import { listVideos, getVideoByYoutubeId, getPgPool, formatVideoRow } from '../../lib/db.js';
import { verifyUserRequest } from '../../lib/auth-server.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import { 
  parseSafePagination, 
  sanitizeText, 
  checkRateLimit, 
  getClientIp 
} from '../../lib/security.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = getClientIp(req);
  const { id, preview, type, category = 'all', sort = 'newest' } = req.query || {};

  // ================= 1. PUBLIC TRENDING PREVIEW =================
  if (preview === '1' || preview === 'true' || type === 'trending-preview') {
    const rate = checkRateLimit(clientIp, 'preview_videos', 60, 60000);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    try {
      const l = Math.min(16, Math.max(1, parseInt(req.query?.limit, 10) || 8));
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
      const cleanId = sanitizeText(id.toString(), 64);
      const video = await getVideoByYoutubeId(cleanId);
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
    const rawPublisherId = publisherId || sourcePublisherId || null;
    const targetPublisherId = rawPublisherId ? sanitizeText(rawPublisherId.toString(), 64) : null;
    const { page, limit } = parseSafePagination(req.query, 100, 100);

    // Publishers can see their own pending videos when authenticated; public users only see published videos
    let statusFilter = 'published';
    if (targetPublisherId && auth && auth.authorized && auth.user && (auth.user.id === targetPublisherId || auth.user.role === 'admin')) {
      if (req.query.status) {
        statusFilter = sanitizeText(req.query.status.toString(), 20);
      }
    }

    const result = await listVideos({
      page,
      limit,
      category: sanitizeText(category.toString(), 50),
      sort: sanitizeText(sort.toString(), 20),
      status: statusFilter,
      sourcePublisherId: targetPublisherId,
      search: search ? sanitizeText(search.toString(), 100) : ''
    });

    const isFullView = req.query?.view === 'full';
    let videoData = (result.videos || []).map(v => {
      if (isFullView) return v;
      return {
        id: v.youtubeId || v.id,
        youtubeId: v.youtubeId || v.id,
        slug: v.slug,
        titleTamil: v.titleTamil,
        titleEnglish: v.titleEnglish,
        title: v.title,
        thumbnail: (v.youtubeId || v.id) ? `https://i.ytimg.com/vi_webp/${v.youtubeId || v.id}/mqdefault.webp` : v.thumbnail,
        category: v.category,
        publishedAt: v.publishedAt,
        duration: v.duration,
        durationSeconds: v.durationSeconds,
        views: v.views,
        channelName: v.channelName,
        trending: v.trending
      };
    });

    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      status: 'success',
      data: videoData,
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

