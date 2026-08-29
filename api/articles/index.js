import { listArticles, getArticleBySlug, incrementArticleViews } from '../../lib/db.js';

export default async function handler(req, res) {
  const { slug, action } = req.query || {};
  const targetSlug = (slug || req.body?.slug || '').toString().trim();
  const isViewAction = action === 'view' || req.body?.action === 'view' || req.query?.increment === '1';

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
