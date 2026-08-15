import { getVideoByYoutubeId } from '../../lib/db.js';
import { verifyUserRequest } from '../../lib/auth-server.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enforce server-side authentication for video detail and insights
  const auth = await verifyUserRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status || 401).json({
      error: 'Authentication required',
      message: 'Sign in to access video details, summaries, and full financial analysis.',
      requiresAuth: true
    });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing video YouTube ID parameter' });
  }

  try {
    const video = await getVideoByYoutubeId(id.toString());

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      status: 'success',
      data: video
    });

  } catch (error) {
    console.error(`Error in GET /api/videos/${id}:`, error);
    return res.status(500).json({ error: 'Failed to fetch video details', message: error.message });
  }
}
