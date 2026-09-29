import { getHomeFeed } from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const feed = await getHomeFeed();

    // Cache-Control: public, s-maxage=60, stale-while-revalidate=86400
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Generate ETag for 304 Not Modified support
    const content = JSON.stringify({ status: 'success', data: feed });
    const etag = `W/"${Buffer.from(content).length}-${feed.timestamp || Date.now()}"`;
    res.setHeader('ETag', etag);

    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }

    return res.status(200).send(content);
  } catch (error) {
    console.error('Error in GET /api/home:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to load home feed',
      data: { articles: [], videos: [], trendingVideos: [], professionals: [] }
    });
  }
}
