import { listVideos, getVideoByYoutubeId, getPgPool, formatVideoRow } from '../../lib/db.js';
import { verifyUserRequest } from '../../lib/auth-server.js';
import { supabaseAdmin } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, preview, type, limit = '20', page = '1', category = 'all', sort = 'newest' } = req.query || {};

  // ================= 1. PUBLIC TRENDING PREVIEW (NO AUTH REQUIRED) =================
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

      if (!previewVideos || previewVideos.length === 0) {
        const fallbackList = [
          {
            id: '1',
            youtubeId: 'GizYMQfl9CY',
            titleTamil: 'Top 5 மியூச்சுவல் ஃபண்டுகள் 2025 | அதிக லாபம் தரும் SIP திட்டங்கள்',
            titleEnglish: 'Top 5 Mutual Funds 2025 | Highest Return SIP Plans',
            title: 'Top 5 மியூச்சுவல் ஃபண்டுகள் 2025 | அதிக லாபம் தரும் SIP திட்டங்கள்',
            thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60',
            category: 'mutual-funds',
            publishedAt: '2025-02-10T10:00:00Z',
            duration: '14:22',
            durationSeconds: 862,
            views: 45000,
            trending: true
          },
          {
            id: '2',
            youtubeId: 'dQw4w9WgXcQ',
            titleTamil: 'பங்குச் சந்தையில் முதலீடு செய்வது எப்படி? ஆரம்ப வழிகாட்டி',
            titleEnglish: 'How to Invest in Stock Market? Beginner Guide Tamil',
            title: 'பங்குச் சந்தையில் முதலீடு செய்வது எப்படி? ஆரம்ப வழிகாட்டி',
            thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60',
            category: 'stocks',
            publishedAt: '2025-02-08T14:30:00Z',
            duration: '18:45',
            durationSeconds: 1125,
            views: 38000,
            trending: true
          }
        ];
        previewVideos = fallbackList.slice(0, l);
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

  // ================= AUTH VERIFICATION FOR FULL CATALOG & DETAIL =================
  const auth = await verifyUserRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status || 401).json({
      error: 'Authentication required',
      message: 'You must be signed in to access full video details and library.',
      requiresAuth: true
    });
  }

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
    const result = await listVideos({
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
      category: category.toString(),
      sort: sort.toString()
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
