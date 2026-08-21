import { listVideos, getVideoByYoutubeId, getPgPool, formatVideoRow } from '../../lib/db.js';
import { verifyUserRequest } from '../../lib/auth-server.js';
import { supabaseAdmin } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, preview, type, limit = '20', page = '1', category = 'all', sort = 'newest' } = req.query || {};

  // ================= 1. PUBLIC TRENDING PREVIEW =================
  if (preview === '1' || preview === 'true' || type === 'trending-preview') {
    try {
      const l = Math.min(16, Math.max(1, parseInt(limit, 10) || 8));
      const pgPool = getPgPool();
      let previewVideos = [];

      if (pgPool) {
        const query = `
          SELECT 
            id, youtube_id, title_ta, title_en,
            thumbnail_url, duration, duration_seconds,
            published_at, view_count, category, trending
          FROM videos
          WHERE status = 'published'
          ORDER BY trending DESC, published_at DESC
          LIMIT $1;
        `;
        const result = await pgPool.query(query, [l]);
        previewVideos = (result.rows || []).map(r => {
          const full = formatVideoRow(r);
          return {
            id: full.id,
            youtubeId: full.youtubeId,
            titleTamil: full.titleTamil,
            titleEnglish: full.titleEnglish,
            title: full.title,
            thumbnail: full.thumbnail,
            category: full.category,
            publishedAt: full.publishedAt,
            duration: full.duration,
            durationSeconds: full.durationSeconds,
            views: full.views,
            trending: full.trending
          };
        });
      } else if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('videos')
          .select('id, youtube_id, title_ta, title_en, thumbnail_url, duration, duration_seconds, published_at, view_count, category, trending')
          .eq('status', 'published')
          .order('trending', { ascending: false })
          .order('published_at', { ascending: false })
          .limit(l);

        if (error) throw error;
        previewVideos = (data || []).map(r => {
          const full = formatVideoRow(r);
          return {
            id: full.id,
            youtubeId: full.youtubeId,
            titleTamil: full.titleTamil,
            titleEnglish: full.titleEnglish,
            title: full.title,
            thumbnail: full.thumbnail,
            category: full.category,
            publishedAt: full.publishedAt,
            duration: full.duration,
            durationSeconds: full.durationSeconds,
            views: full.views,
            trending: full.trending
          };
        });
      }

      res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
      res.setHeader('Content-Type', 'application/json');

      return res.status(200).json({
        status: 'success',
        data: previewVideos,
        count: previewVideos.length,
        isPublicPreview: true
      });
    } catch (error) {
      console.error('Error in preview videos:', error);
      return res.status(500).json({ error: 'Failed to fetch public preview data', message: error.message });
    }
  }

  // Optional authentication: allow public reads of published videos; extract auth if present for publisher permissions
  const auth = await verifyUserRequest(req);

  // ================= 2. SINGLE VIDEO DETAIL BY ID =================
  if (id) {
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
      console.error(`Error in GET video ${id}:`, error);
      return res.status(500).json({ error: 'Failed to fetch video details', message: error.message });
    }
  }

  // ================= 3. FULL VIDEO LISTING =================
  try {
    const { publisherId, sourcePublisherId, search } = req.query || {};
    const targetPublisherId = publisherId || sourcePublisherId || null;

    // Publishers can see their own pending videos when authenticated; public users only see published videos
    let statusFilter = 'published';
    if (targetPublisherId && auth && auth.authorized && auth.user && (auth.user.id === targetPublisherId || auth.user.role === 'admin')) {
      if (req.query.status) {
        statusFilter = req.query.status.toString();
      }
    }

    const result = await listVideos({
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 100,
      category: category.toString(),
      sort: sort.toString(),
      status: statusFilter,
      sourcePublisherId: targetPublisherId,
      search: search ? search.toString() : ''
    });

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
