import { getPgPool, formatVideoRow } from '../../lib/db.js';
import { supabaseAdmin } from '../../lib/supabase.js';

/**
 * GET /api/videos/trending-preview
 * Public read endpoint for the homepage preview grid & carousel.
 * Exposes strictly non-sensitive metadata (titles, thumbnails, category, duration, views)
 * without full video descriptions or gated content.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = '8' } = req.query;
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
        },
        {
          id: '3',
          youtubeId: 'jNQXAC9IVRw',
          titleTamil: 'மாதம் ₹5000 முதலீடு செய்து ₹1 கோடி சேர்க்கும் வழிமுறை',
          titleEnglish: 'How to Build 1 Crore with 5000 Monthly SIP Strategy',
          title: 'மாதம் ₹5000 முதலீடு செய்து ₹1 கோடி சேர்க்கும் வழிமுறை',
          thumbnail: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&auto=format&fit=crop&q=60',
          category: 'personal-finance',
          publishedAt: '2025-02-05T09:15:00Z',
          duration: '12:10',
          durationSeconds: 730,
          views: 52000,
          trending: true
        },
        {
          id: '4',
          youtubeId: 'fJ9rUzIMcZQ',
          titleTamil: 'நிஃப்டி 50 இன்டெக்ஸ் ஃபண்ட் vs ஆக்டிவ் ஃபண்ட் - எது சிறந்தது?',
          titleEnglish: 'Nifty 50 Index Fund vs Active Mutual Fund - Complete Review',
          title: 'நிஃப்டி 50 இன்டெக்ஸ் ஃபண்ட் vs ஆக்டிவ் ஃபண்ட் - எது சிறந்தது?',
          thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60',
          category: 'mutual-funds',
          publishedAt: '2025-02-01T16:00:00Z',
          duration: '15:30',
          durationSeconds: 930,
          views: 29000,
          trending: false
        }
      ];
      previewVideos = fallbackList.slice(0, l);
    }

    // Set public CDN caching headers
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      status: 'success',
      data: previewVideos,
      count: previewVideos.length,
      isPublicPreview: true
    });

  } catch (error) {
    console.error('Error in GET /api/videos/trending-preview:', error);
    return res.status(500).json({ error: 'Failed to fetch public preview data', message: error.message });
  }
}
