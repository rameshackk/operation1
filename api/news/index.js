import { listNewsArticles } from '../../lib/db.js';
import { parseSafePagination, sanitizeText } from '../../lib/security.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category = 'all' } = req.query || {};
  const { page, limit } = parseSafePagination(req.query, 20, 50);

  try {
    const result = await listNewsArticles({
      category: sanitizeText(category.toString(), 50),
      limit,
      page
    });

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      status: 'success',
      data: result.news,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });

  } catch (error) {
    console.error('Error in GET /api/news:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch news articles'
    });
  }
}

