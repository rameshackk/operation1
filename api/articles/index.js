import { listArticles } from '../../lib/db.js';
import { verifyUserRequest } from '../../lib/auth-server.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
