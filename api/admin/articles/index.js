import { verifyAdminOrPublisherRequest } from '../../../lib/auth-server.js';
import { listArticles, createArticle, getArticleById, updateArticle, deleteArticle } from '../../../lib/db.js';
import { translateText } from '../../../lib/translate.js';
import { 
  sanitizeHtml, 
  sanitizeText, 
  sanitizeSlug, 
  isSafeUrl, 
  parseSafePagination, 
  checkRateLimit, 
  getClientIp, 
  logSecurityEvent 
} from '../../../lib/security.js';

export default async function handler(req, res) {
  const clientIp = getClientIp(req);

  // 1. Verify admin or publisher role
  const auth = await verifyAdminOrPublisherRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  // Handle translation action
  if (req.query?.action === 'translate' || req.body?.action === 'translate') {
    const rate = checkRateLimit(clientIp, 'admin_translate', 30, 60000);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Translation rate limit exceeded. Please wait a minute.' });
    }

    try {
      const { title_ta, excerpt_ta, body_ta, text } = req.body || {};
      if (text) {
        const translated = await translateText(sanitizeText(text, 5000));
        return res.status(200).json({ status: 'success', data: { translated } });
      }
      const [title_en, excerpt_en, body_en] = await Promise.all([
        title_ta ? translateText(sanitizeText(title_ta, 500)) : Promise.resolve(''),
        excerpt_ta ? translateText(sanitizeText(excerpt_ta, 1000)) : Promise.resolve(''),
        body_ta ? translateText(sanitizeHtml(body_ta)) : Promise.resolve('')
      ]);
      return res.status(200).json({
        status: 'success',
        data: { title_en, excerpt_en, body_en }
      });
    } catch (error) {
      console.error('Translation error:', error);
      return res.status(500).json({ error: 'Translation failed', message: error.message });
    }
  }

  const { id } = req.query || {};
  const isSuperAdmin = auth.profile?.role === 'admin';
  const currentUserId = auth.user?.id;

  // ================= SINGLE ARTICLE BY ID =================
  if (id) {
    // GET single article by ID
    if (req.method === 'GET') {
      try {
        const article = await getArticleById(id);
        if (!article) {
          return res.status(404).json({ error: 'Article not found' });
        }

        // Publisher check: Can only access their own article in the admin/editor context
        if (!isSuperAdmin) {
          const articleAuthorId = article.authorId || article.author_id;
          if (articleAuthorId && articleAuthorId !== currentUserId) {
            logSecurityEvent('UNAUTHORIZED_ARTICLE_VIEW_ATTEMPT', { ip: clientIp, userId: currentUserId, articleId: id });
            return res.status(403).json({ error: 'Access denied: Publishers can only view and edit their own articles.' });
          }
        }

        return res.status(200).json({ status: 'success', data: article });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    // PUT / PATCH: Update article
    if (req.method === 'PUT' || req.method === 'PATCH') {
      try {
        const existingArticle = await getArticleById(id);
        if (!existingArticle) {
          return res.status(404).json({ error: 'Article not found' });
        }

        // Strict Publisher Ownership Check: Only allow editing if the article belongs to this publisher
        if (!isSuperAdmin) {
          const articleAuthorId = existingArticle.authorId || existingArticle.author_id;
          if (articleAuthorId && articleAuthorId !== currentUserId) {
            logSecurityEvent('UNAUTHORIZED_ARTICLE_EDIT_ATTEMPT', { ip: clientIp, userId: currentUserId, articleId: id });
            return res.status(403).json({ error: 'Access denied: You do not have permission to edit another publisher\'s article.' });
          }
        }

        const updateData = req.body || {};

        // Sanitize rich text inputs
        if (updateData.body_ta) updateData.body_ta = sanitizeHtml(updateData.body_ta);
        if (updateData.body_en) updateData.body_en = sanitizeHtml(updateData.body_en);
        if (updateData.title_ta) updateData.title_ta = sanitizeText(updateData.title_ta, 300);
        if (updateData.title_en) updateData.title_en = sanitizeText(updateData.title_en, 300);
        if (updateData.excerpt_ta) updateData.excerpt_ta = sanitizeText(updateData.excerpt_ta, 1000);
        if (updateData.excerpt_en) updateData.excerpt_en = sanitizeText(updateData.excerpt_en, 1000);
        if (updateData.slug) updateData.slug = sanitizeSlug(updateData.slug);

        if (updateData.cover_image_url && !isSafeUrl(updateData.cover_image_url)) {
          updateData.cover_image_url = null;
        }

        // If publisher is updating, preserve their author_id
        if (!isSuperAdmin) {
          updateData.author_id = currentUserId;
        }

        const updated = await updateArticle(id, updateData);

        return res.status(200).json({
          status: 'success',
          message: 'Article updated successfully',
          data: updated
        });
      } catch (error) {
        console.error(`Error updating article ${id}:`, error);
        if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique')) {
          return res.status(409).json({ error: 'An article with this URL slug already exists. Please modify the slug.' });
        }
        return res.status(500).json({ error: error.message });
      }
    }

    // DELETE: Remove article
    if (req.method === 'DELETE') {
      try {
        const existingArticle = await getArticleById(id);
        if (!existingArticle) {
          return res.status(404).json({ error: 'Article not found' });
        }

        // Strict Publisher Ownership Check: Only allow deleting own articles
        if (!isSuperAdmin) {
          const articleAuthorId = existingArticle.authorId || existingArticle.author_id;
          if (articleAuthorId && articleAuthorId !== currentUserId) {
            logSecurityEvent('UNAUTHORIZED_ARTICLE_DELETE_ATTEMPT', { ip: clientIp, userId: currentUserId, articleId: id });
            return res.status(403).json({ error: 'Access denied: You do not have permission to delete another publisher\'s article.' });
          }
        }

        const success = await deleteArticle(id);
        if (!success) {
          return res.status(404).json({ error: 'Article not found or could not be deleted' });
        }
        return res.status(200).json({
          status: 'success',
          message: 'Article deleted successfully'
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ================= COLLECTION OPERATIONS =================

  // GET: List articles (Filtered to own articles for publishers, all for admins)
  if (req.method === 'GET') {
    try {
      const { category = 'all', status = 'all', search = '', sort = 'newest' } = req.query || {};
      const { page, limit } = parseSafePagination(req.query, 50, 100);
      
      const result = await listArticles({
        page,
        limit,
        category: sanitizeText(category.toString(), 50),
        status: sanitizeText(status.toString(), 20),
        search: sanitizeText(search.toString(), 100),
        sort: sanitizeText(sort.toString(), 20),
        authorId: isSuperAdmin ? null : currentUserId
      });

      return res.status(200).json({
        status: 'success',
        data: result.articles,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit) || 1
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST: Create a new article
  if (req.method === 'POST') {
    try {
      const {
        slug,
        title_ta,
        title_en,
        excerpt_ta,
        excerpt_en,
        body_ta,
        body_en,
        cover_image_url,
        category,
        tags,
        status
      } = req.body || {};

      if (!title_ta || !title_ta.trim()) {
        return res.status(400).json({ error: 'Tamil title (title_ta) is required' });
      }

      if (!body_ta || !body_ta.trim()) {
        return res.status(400).json({ error: 'Tamil body (body_ta) is required' });
      }

      // Generate or clean slug
      let finalSlug = slug;
      if (!finalSlug || !finalSlug.trim()) {
        const base = (title_en || title_ta)
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        finalSlug = base || `article-${Date.now()}`;
      } else {
        finalSlug = sanitizeSlug(finalSlug);
      }

      // Sanitize rich text body
      const cleanBodyTa = sanitizeHtml(body_ta);
      const cleanBodyEn = body_en ? sanitizeHtml(body_en) : '';
      const safeCoverUrl = isSafeUrl(cover_image_url) ? cover_image_url : null;

      const newArticle = await createArticle({
        slug: finalSlug,
        title_ta: sanitizeText(title_ta, 300),
        title_en: title_en ? sanitizeText(title_en, 300) : '',
        excerpt_ta: excerpt_ta ? sanitizeText(excerpt_ta, 1000) : '',
        excerpt_en: excerpt_en ? sanitizeText(excerpt_en, 1000) : '',
        body_ta: cleanBodyTa,
        body_en: cleanBodyEn,
        cover_image_url: safeCoverUrl,
        category: category || 'mutual-fund',
        tags: Array.isArray(tags) ? tags.map(t => sanitizeText(String(t), 50)) : [],
        status: status === 'published' ? 'published' : 'draft',
        author_id: auth.user.id
      });

      return res.status(201).json({
        status: 'success',
        message: status === 'published' ? 'Article published successfully' : 'Article draft saved',
        data: newArticle
      });

    } catch (error) {
      console.error('Error creating article:', error);
      if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique')) {
        return res.status(409).json({ error: 'An article with this URL slug already exists. Please modify the slug.' });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

