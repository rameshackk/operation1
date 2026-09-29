import { 
  listArticles, 
  getArticleBySlug, 
  incrementArticleViews,
  getArticleComments,
  addArticleComment,
  deleteArticleComment,
  likeArticleComment,
  listNewsArticles,
  upsertNewsArticlesBatch,
  getPgPool
} from '../../lib/db.js';
import { fetchAllFinancialNewsFeeds } from '../../lib/news.js';
import { synthesizeSpeech, cleanTextForSpeech } from '../../lib/tts.js';
import { verifyUserRequest, verifyAdminOrPublisherRequest } from '../../lib/auth-server.js';
import { 
  checkRateLimit, 
  getClientIp, 
  sanitizeSlug, 
  sanitizeText, 
  escapeHtml, 
  parseSafePagination,
  logSecurityEvent 
} from '../../lib/security.js';
import { supabaseAdmin, supabaseAnon } from '../../lib/supabase.js';

export default async function handler(req, res) {
  const clientIp = getClientIp(req);
  const { slug, action, commentId, lang = 'ta', text } = req.query || {};
  const rawSlug = (slug || req.body?.slug || '').toString().trim();
  const targetSlug = sanitizeSlug(rawSlug);
  const isViewAction = action === 'view' || req.body?.action === 'view' || req.query?.increment === '1';

  // ================= 1. TEXT-TO-SPEECH STREAMING API =================
  if (action === 'tts' || action === 'audio' || req.query?.tts === '1' || req.query?.audio === '1') {
    const ttsRate = checkRateLimit(clientIp, 'tts_stream', 30, 60000);
    if (!ttsRate.allowed) {
      return res.status(429).json({ error: 'Too many audio generation requests. Please try again in a minute.' });
    }

    try {
      const isTa = lang === 'ta';
      let textToSynthesize = '';

      if (text) {
        textToSynthesize = sanitizeText(text.toString(), 3000);
      } else if (targetSlug) {
        const article = await getArticleBySlug(targetSlug);
        if (!article) {
          return res.status(404).json({ error: 'Article not found' });
        }

        const title = isTa ? (article.titleTamil || article.title_ta || '') : (article.titleEnglish || article.title_en || '');
        const excerpt = isTa ? (article.excerptTamil || article.excerpt_ta || '') : (article.excerptEnglish || article.excerpt_en || '');
        const rawBody = isTa ? (article.bodyTamil || article.body_ta || '') : (article.bodyEnglish || article.body_en || '');
        const body = cleanTextForSpeech(rawBody);

        textToSynthesize = `${title}. ${excerpt ? excerpt + '.' : ''} ${body}`.trim();
      }

      if (!textToSynthesize) {
        return res.status(400).json({ error: 'No text content available to synthesize' });
      }

      const audioBuffer = await synthesizeSpeech(textToSynthesize, isTa ? 'ta' : 'en');
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      res.setHeader('Accept-Ranges', 'bytes');
      return res.status(200).end(audioBuffer);
    } catch (error) {
      console.error(`Error streaming TTS for ${targetSlug}:`, error);
      return res.status(500).json({ error: 'Failed to synthesize speech', message: error.message });
    }
  }

  // ================= 2. COMMENTS API =================
  if (action === 'comments' || action === 'add_comment' || action === 'like_comment' || action === 'delete_comment') {
    res.setHeader('Content-Type', 'application/json');

    // 2.1 GET Comments for Article
    if (req.method === 'GET' || action === 'get_comments') {
      try {
        if (!targetSlug) return res.status(400).json({ error: 'Article slug is required' });
        const comments = await getArticleComments(targetSlug);
        return res.status(200).json({ status: 'success', slug: targetSlug, data: comments });
      } catch (error) {
        console.error(`Error fetching comments for ${targetSlug}:`, error);
        return res.status(500).json({ error: 'Failed to fetch comments', message: error.message });
      }
    }

    // 2.2 POST Add Comment / Reply
    if (req.method === 'POST' && (action === 'comments' || action === 'add_comment')) {
      const commentRate = checkRateLimit(clientIp, 'post_comment', 10, 60000);
      if (!commentRate.allowed) {
        return res.status(429).json({ error: 'You are commenting too fast. Please wait a minute.' });
      }

      try {
        const body = req.body || {};
        const rawContent = (body.content || '').toString().trim();
        if (!rawContent) {
          return res.status(400).json({ error: 'Comment content cannot be empty' });
        }

        const content = escapeHtml(sanitizeText(rawContent, 1000));
        let userId = 'anonymous';
        let userName = sanitizeText((body.userName || body.user_name || body.name || 'Reader').toString(), 80);
        let userAvatar = body.userAvatar || body.user_avatar || null;
        let userRole = 'user';
        let isVerified = false;

        // Verify genuine authenticated caller if token present
        const auth = await verifyUserRequest(req);
        if (auth.authorized && auth.user) {
          userId = auth.user.id;
          userName = sanitizeText(auth.user.user_metadata?.full_name || auth.user.email?.split('@')[0] || userName, 80);

          // Check database profile for verified role
          const pgPool = getPgPool();
          if (pgPool) {
            const roleRes = await pgPool.query('SELECT role, display_name, avatar_url FROM profiles WHERE id::text = $1', [userId]);
            if (roleRes.rows.length > 0) {
              const p = roleRes.rows[0];
              userRole = p.role || 'user';
              if (p.role === 'admin' || p.role === 'publisher') {
                isVerified = true;
              }
              if (p.display_name) userName = p.display_name;
              if (p.avatar_url) userAvatar = p.avatar_url;
            }
          }
        }

        const parentId = body.parentId ? parseInt(body.parentId, 10) : null;

        const comment = await addArticleComment({
          slug: targetSlug,
          userId,
          userName,
          userAvatar,
          userRole,
          isVerified,
          content,
          parentId: Number.isInteger(parentId) ? parentId : null
        });

        return res.status(201).json({ status: 'success', data: comment });
      } catch (error) {
        console.error(`Error adding comment for ${targetSlug}:`, error);
        return res.status(500).json({ error: 'Failed to add comment', message: error.message });
      }
    }

    // 2.3 POST Like / Unlike Comment
    if (action === 'like_comment' || (req.method === 'POST' && (req.body?.action === 'like' || req.body?.action === 'unlike'))) {
      const likeRate = checkRateLimit(clientIp, 'like_comment', 60, 60000);
      if (!likeRate.allowed) {
        return res.status(429).json({ error: 'Too many requests' });
      }

      try {
        const targetId = parseInt(commentId || req.body?.commentId || req.body?.id, 10);
        if (!targetId || isNaN(targetId)) return res.status(400).json({ error: 'Valid Comment ID is required' });

        const isUnlike = req.query?.unlike === '1' || req.body?.action === 'unlike' || req.body?.unlike === true;
        const likesCount = await likeArticleComment(targetId, isUnlike);
        return res.status(200).json({ status: 'success', commentId: targetId, likes: likesCount, unliked: isUnlike });
      } catch (error) {
        console.error(`Error liking comment:`, error);
        return res.status(500).json({ error: 'Failed to update like status', message: error.message });
      }
    }

    // 2.4 DELETE Comment (Strictly authorized: Comment Owner or Admin)
    if (req.method === 'DELETE' || action === 'delete_comment') {
      const targetId = parseInt(commentId || req.body?.commentId || req.body?.id, 10);
      if (!targetId || isNaN(targetId)) return res.status(400).json({ error: 'Valid Comment ID is required' });

      const auth = await verifyUserRequest(req);
      if (!auth.authorized || !auth.user) {
        return res.status(401).json({ error: 'Authentication required to delete comment' });
      }

      try {
        // Fetch genuine profile role from database
        let userRole = 'user';
        const pgPool = getPgPool();
        if (pgPool) {
          const profileRes = await pgPool.query('SELECT role FROM profiles WHERE id::text = $1', [auth.user.id]);
          if (profileRes.rows.length > 0) {
            userRole = profileRes.rows[0].role;
          }
        }

        const success = await deleteArticleComment(targetId, auth.user.id, userRole);
        if (!success) {
          return res.status(403).json({ error: 'You do not have permission to delete this comment' });
        }

        return res.status(200).json({ status: 'success', message: 'Comment deleted successfully' });
      } catch (error) {
        console.error(`Error deleting comment:`, error);
        return res.status(500).json({ error: 'Failed to delete comment', message: error.message });
      }
    }
  }

  // ================= 3. VIEW COUNT INCREMENT =================
  if (isViewAction && targetSlug) {
    const viewRate = checkRateLimit(`${clientIp}:${targetSlug}`, 'article_view', 5, 60000);
    if (!viewRate.allowed) {
      return res.status(200).json({ status: 'ignored', message: 'View rate limited' });
    }

    try {
      const nextViews = await incrementArticleViews(targetSlug);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({
        status: 'success',
        slug: targetSlug,
        views: nextViews
      });
    } catch (error) {
      console.error(`Error incrementing views for article ${targetSlug}:`, error);
      return res.status(500).json({ error: 'Failed to increment view count', message: error.message });
    }
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ================= 4. SINGLE ARTICLE BY SLUG =================
  if (slug) {
    try {
      const article = await getArticleBySlug(targetSlug, false);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      res.setHeader('Content-Type', 'application/json');

      return res.status(200).json({
        status: 'success',
        data: article
      });
    } catch (error) {
      console.error(`Error in GET /api/articles/${targetSlug}:`, error);
      return res.status(500).json({ error: 'Failed to fetch article', message: error.message });
    }
  }

  // ================= 4.5. LIVE AGGREGATED MARKET NEWS =================
  if (req.query?.news === '1' || req.query?.is_news === '1' || req.query?.type === 'news') {
    try {
      const { category = 'all' } = req.query || {};
      const { page, limit } = parseSafePagination(req.query, 40, 100);

      let newsResult = await listNewsArticles({
        category: sanitizeText(category.toString(), 50),
        limit,
        page
      });

      // If database has 0 news articles, auto-fetch live feeds and cache to DB
      if (!newsResult.news || newsResult.news.length === 0) {
        try {
          const freshFeeds = await fetchAllFinancialNewsFeeds();
          if (freshFeeds.length > 0) {
            await upsertNewsArticlesBatch(freshFeeds);
            newsResult = await listNewsArticles({
              category: sanitizeText(category.toString(), 50),
              limit,
              page
            });
            // If DB write failed or still empty, return formatted in-memory feeds
            if (!newsResult.news || newsResult.news.length === 0) {
              const inMemoryNews = freshFeeds.map(item => ({
                id: item.source_url,
                sourceUrl: item.source_url,
                sourceName: item.source_name,
                titleEnglish: item.title_en,
                titleTamil: item.title_ta || item.title_en,
                summaryEnglish: item.summary_en || '',
                summaryTamil: item.summary_ta || item.summary_en || '',
                imageUrl: item.image_url || null,
                category: item.category || 'general',
                publishedAt: item.published_at,
                fetchedAt: new Date().toISOString()
              }));
              const filtered = (category && category !== 'all') 
                ? inMemoryNews.filter(n => n.category === category)
                : inMemoryNews;
              newsResult = {
                news: filtered.slice(0, limit),
                total: filtered.length,
                page: 1,
                limit,
                totalPages: Math.ceil(filtered.length / limit) || 1
              };
            }
          }
        } catch (feedErr) {
          console.warn('Live feed fallback warning:', feedErr.message);
        }
      }

      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      res.setHeader('Content-Type', 'application/json');

      return res.status(200).json({
        status: 'success',
        data: newsResult.news || [],
        news: newsResult.news || [],
        pagination: {
          page: newsResult.page || 1,
          limit: newsResult.limit || limit,
          total: newsResult.total || (newsResult.news ? newsResult.news.length : 0),
          totalPages: newsResult.totalPages || 1
        }
      });
    } catch (error) {
      console.error('Error in GET /api/news:', error);
      return res.status(200).json({
        status: 'success',
        data: [],
        error: error.message,
        pagination: { page: 1, limit: 40, total: 0, totalPages: 1 }
      });
    }
  }

  // ================= 5. ARTICLES LISTING =================
  try {
    const { category = 'all', search = '', sort = 'newest', view = 'card' } = req.query || {};
    const { page, limit } = parseSafePagination(req.query, 20, 100);

    const result = await listArticles({
      page,
      limit,
      category: sanitizeText(category.toString(), 50),
      status: 'published', // Always strictly published articles
      search: sanitizeText(search.toString(), 100),
      sort: sanitizeText(sort.toString(), 20),
      view: sanitizeText(view.toString(), 10)
    });

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      status: 'success',
      data: result.articles || [],
      news: result.articles || [],
      pagination: {
        page: result.page || 1,
        limit: result.limit || limit,
        total: result.total || (result.articles ? result.articles.length : 0),
        totalPages: Math.ceil((result.total || 0) / (result.limit || limit)) || 1
      }
    });

  } catch (error) {
    console.error('Error in GET /api/articles:', error);
    return res.status(200).json({
      status: 'success',
      data: [],
      error: error.message,
      pagination: { page: 1, limit: 20, total: 0, totalPages: 1 }
    });
  }
}

