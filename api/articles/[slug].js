import { getArticleBySlug } from '../../lib/db.js';
import { verifyUserRequest } from '../../lib/auth-server.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enforce server-side authentication
  const auth = await verifyUserRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status || 401).json({
      error: 'Authentication required',
      message: 'You must be signed in to read articles.',
      requiresAuth: true
    });
  }

  const { slug } = req.query || {};
  if (!slug) {
    return res.status(400).json({ error: 'Article slug is required' });
  }

  try {
    const article = await getArticleBySlug(slug, false);
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
