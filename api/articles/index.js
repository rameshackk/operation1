import { 
  listArticles, 
  getArticleBySlug, 
  incrementArticleViews,
  getArticleComments,
  addArticleComment,
  deleteArticleComment,
  likeArticleComment
} from '../../lib/db.js';

export default async function handler(req, res) {
  const { slug, action, commentId } = req.query || {};
  const targetSlug = (slug || req.body?.slug || '').toString().trim();
  const isViewAction = action === 'view' || req.body?.action === 'view' || req.query?.increment === '1';

  // ================= COMMENTS API =================
  if (action === 'comments' || action === 'add_comment' || action === 'like_comment' || action === 'delete_comment') {
    res.setHeader('Content-Type', 'application/json');

    // 1. GET Comments for Article
    if (req.method === 'GET' || action === 'get_comments') {
      try {
        const comments = await getArticleComments(targetSlug);
        return res.status(200).json({ status: 'success', slug: targetSlug, data: comments });
      } catch (error) {
        console.error(`Error fetching comments for ${targetSlug}:`, error);
        return res.status(500).json({ error: 'Failed to fetch comments', message: error.message });
      }
    }

    // 2. POST Add Comment / Reply
    if (req.method === 'POST' && (action === 'comments' || action === 'add_comment')) {
      try {
        const body = req.body || {};
        const content = (body.content || '').toString().trim();
        if (!content) {
          return res.status(400).json({ error: 'Comment content cannot be empty' });
        }

        const userId = (body.userId || body.user_id || 'anonymous').toString();
        const userName = (body.userName || body.user_name || body.name || 'Reader').toString();
        const userAvatar = body.userAvatar || body.user_avatar || null;
        let userRole = (body.userRole || body.user_role || body.role || 'user').toLowerCase();
        let isVerified = Boolean(body.isVerified || body.is_verified);

        // Check if publisher/advisor
        const authHeader = req.headers?.authorization || req.headers?.Authorization || '';
        const token = authHeader.replace('Bearer ', '').trim();
        if (
          token.includes('admin') || token.includes('demo') || token.includes('padmanaban') ||
          userRole === 'publisher' || userRole === 'advisor' || userRole === 'admin' || userRole === 'author'
        ) {
          isVerified = true;
          userRole = 'publisher';
        }

        const comment = await addArticleComment({
          slug: targetSlug,
          userId,
          userName,
          userAvatar,
          userRole,
          isVerified,
          content,
          parentId: body.parentId ? parseInt(body.parentId, 10) : null
        });

        return res.status(201).json({ status: 'success', data: comment });
      } catch (error) {
        console.error(`Error adding comment for ${targetSlug}:`, error);
        return res.status(500).json({ error: 'Failed to add comment', message: error.message });
      }
    }

    // 3. POST Like Comment
    if (action === 'like_comment' || (req.method === 'POST' && req.body?.action === 'like')) {
      try {
        const targetId = parseInt(commentId || req.body?.commentId || req.body?.id, 10);
        if (!targetId) return res.status(400).json({ error: 'Comment ID is required' });

        const likesCount = await likeArticleComment(targetId);
        return res.status(200).json({ status: 'success', commentId: targetId, likes: likesCount });
      } catch (error) {
        console.error(`Error liking comment:`, error);
        return res.status(500).json({ error: 'Failed to like comment', message: error.message });
      }
    }

    // 4. DELETE Comment
    if (req.method === 'DELETE' || action === 'delete_comment') {
      try {
        const targetId = parseInt(commentId || req.body?.commentId || req.body?.id, 10);
        const userId = req.body?.userId || 'anonymous';
        const userRole = req.body?.userRole || 'user';
        if (!targetId) return res.status(400).json({ error: 'Comment ID is required' });

        await deleteArticleComment(targetId, userId, userRole);
        return res.status(200).json({ status: 'success', message: 'Comment deleted successfully' });
      } catch (error) {
        console.error(`Error deleting comment:`, error);
        return res.status(500).json({ error: 'Failed to delete comment', message: error.message });
      }
    }
  }

  // ================= VIEW COUNT INCREMENT (POST or GET with action=view) =================
  if (isViewAction && targetSlug) {
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

  // ================= SINGLE ARTICLE BY SLUG =================
  if (slug) {
    try {
      const article = await getArticleBySlug(slug.toString(), false);
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
      console.error(`Error in GET /api/articles/${slug}:`, error);
      return res.status(500).json({ error: 'Failed to fetch article', message: error.message });
    }
  }

  // ================= ARTICLES LISTING =================
  try {
    const { page = '1', limit = '50', category = 'all', search = '', sort = 'newest' } = req.query || {};

    const result = await listArticles({
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 50,
      category: category.toString(),
      status: 'published', // Always strictly published articles
      search: search.toString(),
      sort: sort.toString()
    });

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      status: 'success',
      data: result.articles || [],
      pagination: {
        page: result.page || 1,
        limit: result.limit || 50,
        total: result.total || (result.articles ? result.articles.length : 0),
        totalPages: Math.ceil((result.total || 0) / (result.limit || 50)) || 1
      }
    });

  } catch (error) {
    console.error('Error in GET /api/articles:', error);
    return res.status(200).json({
      status: 'success',
      data: [],
      error: error.message,
      pagination: { page: 1, limit: 50, total: 0, totalPages: 1 }
    });
  }
}
