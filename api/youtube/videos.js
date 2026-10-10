import { getPgPool } from '../../lib/db.js';
import { supabaseAnon } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    type = 'videos', // 'videos' (long-form), 'shorts', 'live', 'all'
    category = 'all',
    q = '',
    cursor = null,
    limit = 24,
    include_hero = 'false',
    id = null
  } = req.query || {};

  const maxLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 24));
  const pool = getPgPool();

  try {
    // 1. Single video by ID
    if (id) {
      if (pool) {
        const singleRes = await pool.query(
          `SELECT 
            video_id, channel_id, title, description, published_at,
            duration_seconds, view_count, like_count, thumbnail_url,
            is_short, is_live, category, is_pinned, ai_summary_ta, ai_summary_en,
            tags
           FROM public.youtube_videos 
           WHERE video_id = $1 AND is_hidden = false`,
          [id]
        );
        if (singleRes.rows.length > 0) {
          res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
          return res.status(200).json({ status: 'success', data: singleRes.rows[0] });
        }
      }

      if (supabaseAnon) {
        const { data, error } = await supabaseAnon
          .from('youtube_videos')
          .select('*')
          .eq('video_id', id)
          .eq('is_hidden', false)
          .single();
        if (data && !error) {
          res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
          return res.status(200).json({ status: 'success', data });
        }
      }

      return res.status(404).json({ error: 'Video not found' });
    }

    // 2. Fetch Hero Video if requested
    let heroVideo = null;
    if (include_hero === '1' || include_hero === 'true') {
      if (pool) {
        const heroRes = await pool.query(`
          SELECT 
            video_id, channel_id, title, description, published_at,
            duration_seconds, view_count, like_count, thumbnail_url,
            is_short, is_live, category, is_pinned, ai_summary_ta, ai_summary_en
          FROM public.youtube_videos
          WHERE is_hidden = false AND is_short = false
          ORDER BY is_pinned DESC, published_at DESC
          LIMIT 1
        `);
        if (heroRes.rows.length > 0) {
          heroVideo = heroRes.rows[0];
        }
      }
    }

    // 3. Build Dynamic Filtering Query
    let queryConditions = ['is_hidden = false'];
    const queryParams = [];

    // Type filter
    if (type === 'shorts') {
      queryConditions.push('is_short = true');
    } else if (type === 'videos') {
      queryConditions.push('is_short = false');
    } else if (type === 'live') {
      queryConditions.push('is_live = true');
    }

    // Category filter
    if (category && category !== 'all') {
      queryParams.push(category);
      queryConditions.push(`category = $${queryParams.length}`);
    }

    // Search query filter (title, description, tags)
    if (q && q.trim()) {
      queryParams.push(`%${q.trim()}%`);
      const pIndex = queryParams.length;
      queryConditions.push(`(title ILIKE $${pIndex} OR description ILIKE $${pIndex} OR category ILIKE $${pIndex})`);
    }

    // Cursor pagination (based on published_at)
    if (cursor) {
      queryParams.push(new Date(cursor).toISOString());
      queryConditions.push(`published_at < $${queryParams.length}`);
    }

    // Execute query with limit + 1 to check hasMore
    queryParams.push(maxLimit + 1);
    const limitIndex = queryParams.length;

    const sql = `
      SELECT 
        video_id, channel_id, title, description, published_at,
        duration_seconds, view_count, like_count, thumbnail_url,
        is_short, is_live, category, is_pinned, ai_summary_ta, ai_summary_en
      FROM public.youtube_videos
      WHERE ${queryConditions.join(' AND ')}
      ORDER BY is_pinned DESC, published_at DESC
      LIMIT $${limitIndex};
    `;

    let rows = [];
    if (pool) {
      const result = await pool.query(sql, queryParams);
      rows = result.rows || [];
    } else if (supabaseAnon) {
      let query = supabaseAnon
        .from('youtube_videos')
        .select('*')
        .eq('is_hidden', false);

      if (type === 'shorts') query = query.eq('is_short', true);
      if (type === 'videos') query = query.eq('is_short', false);
      if (type === 'live') query = query.eq('is_live', true);
      if (category && category !== 'all') query = query.eq('category', category);
      if (q && q.trim()) query = query.ilike('title', `%${q.trim()}%`);
      if (cursor) query = query.lt('published_at', cursor);

      query = query
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(maxLimit + 1);

      const { data } = await query;
      rows = data || [];
    }

    const hasMore = rows.length > maxLimit;
    const items = hasMore ? rows.slice(0, maxLimit) : rows;
    const nextCursor = items.length > 0 ? items[items.length - 1].published_at : null;

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      status: 'success',
      data: items,
      hero: heroVideo,
      hasMore,
      nextCursor,
      count: items.length
    });
  } catch (error) {
    console.error('Error in GET /api/youtube/videos:', error);
    return res.status(500).json({
      status: 'error',
      error: 'Failed to fetch YouTube videos',
      message: error.message
    });
  }
}
