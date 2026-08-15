import { listVideos } from '../../lib/db.js';
import { verifyUserRequest } from '../../lib/auth-server.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enforce server-side authentication for full videos library
  const auth = await verifyUserRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status || 401).json({
      error: 'Authentication required',
      message: 'You must be signed in to access the full video catalog. Use /api/videos/trending-preview for public homepage preview.',
      requiresAuth: true
    });
  }

  try {
    const { page = '1', limit = '20', category = 'all', sort = 'newest' } = req.query;

    const result = await listVideos({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      category: category.toString(),
      sort: sort.toString()
    });

    // Set serverless cache headers (60s CDN cache, 300s stale-while-revalidate)
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      status: 'success',
      data: result.videos,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 1
      }
    });

  } catch (error) {
    console.error('Error in GET /api/videos:', error);
    return res.status(500).json({ error: 'Failed to fetch videos from database', message: error.message });
  }
}
