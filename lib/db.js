import pg from 'pg';
import { supabaseAdmin } from './supabase.js';

const { Pool } = pg;

// Singleton PG Connection Pool for Direct Database Access
let pool;

export function getPgPool() {
  if (!pool && process.env.DATABASE_URL) {
    const connectionString = process.env.DATABASE_URL;
    const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

    pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });
  }
  return pool;
}

/**
 * Checks which YouTube IDs from the input array already exist in the database.
 */
export async function getExistingYoutubeIds(youtubeIds = []) {
  if (!youtubeIds || youtubeIds.length === 0) return [];

  const pgPool = getPgPool();
  if (pgPool) {
    const query = `SELECT youtube_id FROM videos WHERE youtube_id = ANY($1::text[])`;
    const res = await pgPool.query(query, [youtubeIds]);
    return res.rows.map(r => r.youtube_id);
  }

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .select('youtube_id')
      .in('youtube_id', youtubeIds);
    if (error) throw error;
    return (data || []).map(r => r.youtube_id);
  }

  return [];
}

/**
 * Inserts or updates a video record in the database.
 */
export async function upsertVideo(video) {
  const pgPool = getPgPool();

  if (pgPool) {
    const query = `
      INSERT INTO videos (
        youtube_id, title_ta, title_en, description_ta, description_en,
        thumbnail_url, duration, duration_seconds, published_at, view_count,
        category, tags, trending, translated_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP)
      ON CONFLICT (youtube_id) DO UPDATE SET
        title_ta = EXCLUDED.title_ta,
        title_en = COALESCE(EXCLUDED.title_en, videos.title_en),
        description_ta = EXCLUDED.description_ta,
        description_en = COALESCE(EXCLUDED.description_en, videos.description_en),
        thumbnail_url = EXCLUDED.thumbnail_url,
        duration = EXCLUDED.duration,
        duration_seconds = EXCLUDED.duration_seconds,
        view_count = EXCLUDED.view_count,
        category = COALESCE(videos.category, EXCLUDED.category),
        tags = EXCLUDED.tags,
        trending = EXCLUDED.trending,
        translated_at = COALESCE(EXCLUDED.translated_at, videos.translated_at),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      video.youtubeId,
      video.titleTamil,
      video.titleEnglish || null,
      video.descriptionTamil,
      video.descriptionEnglish || null,
      video.thumbnailUrl,
      video.duration,
      video.durationSeconds || 0,
      video.publishedAt,
      video.viewCount || 0,
      video.category || 'personal-finance',
      video.tags || [],
      video.trending || false,
      video.translatedAt || null
    ];

    const res = await pgPool.query(query, values);
    return res.rows[0];
  }

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .upsert({
        youtube_id: video.youtubeId,
        title_ta: video.titleTamil,
        title_en: video.titleEnglish || null,
        description_ta: video.descriptionTamil,
        description_en: video.descriptionEnglish || null,
        thumbnail_url: video.thumbnailUrl,
        duration: video.duration,
        duration_seconds: video.durationSeconds || 0,
        published_at: video.publishedAt,
        view_count: video.viewCount || 0,
        category: video.category || 'personal-finance',
        tags: video.tags || [],
        trending: video.trending || false,
        translated_at: video.translatedAt || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'youtube_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  throw new Error('No database connection available (DATABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
}

/**
 * Fetches a paginated list of videos from the database.
 */
export async function listVideos({ page = 1, limit = 20, category = 'all', sort = 'newest' } = {}) {
  const p = Math.max(1, parseInt(page, 10));
  const l = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (p - 1) * l;
  const isAscending = sort === 'oldest';

  const pgPool = getPgPool();
  if (pgPool) {
    let whereClause = '';
    const params = [l, offset];

    if (category && category !== 'all') {
      whereClause = 'WHERE category = $3';
      params.push(category);
    }

    const orderDirection = isAscending ? 'ASC' : 'DESC';
    const query = `
      SELECT *, COUNT(*) OVER() as total_count
      FROM videos
      ${whereClause}
      ORDER BY published_at ${orderDirection}
      LIMIT $1 OFFSET $2;
    `;

    const res = await pgPool.query(query, params);
    const total = res.rows[0]?.total_count ? parseInt(res.rows[0].total_count, 10) : 0;
    return { videos: res.rows.map(formatVideoRow), total, page: p, limit: l };
  }

  if (supabaseAdmin) {
    let query = supabaseAdmin
      .from('videos')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: isAscending })
      .range(offset, offset + l - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return { videos: (data || []).map(formatVideoRow), total: count || 0, page: p, limit: l };
  }

  return { videos: [], total: 0, page: p, limit: l };
}

/**
 * Fetches a single video by YouTube ID or Database UUID.
 */
export async function getVideoByYoutubeId(idOrYoutubeId) {
  if (!idOrYoutubeId) return null;
  const param = idOrYoutubeId.toString();

  const pgPool = getPgPool();
  if (pgPool) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);
    const query = isUuid
      ? `SELECT * FROM videos WHERE id::text = $1 OR youtube_id = $1 LIMIT 1`
      : `SELECT * FROM videos WHERE youtube_id = $1 LIMIT 1`;
    const res = await pgPool.query(query, [param]);
    return res.rows[0] ? formatVideoRow(res.rows[0]) : null;
  }

  if (supabaseAdmin) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);
    let query = supabaseAdmin.from('videos').select('*');
    if (isUuid) {
      query = query.or(`id.eq.${param},youtube_id.eq.${param}`);
    } else {
      query = query.eq('youtube_id', param);
    }
    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    return data ? formatVideoRow(data) : null;
  }

  return null;
}

/**
 * Fetches videos that failed translation and need a retry.
 */
export async function getVideosPendingTranslation(limit = 5) {
  const pgPool = getPgPool();
  if (pgPool) {
    const res = await pgPool.query(
      `SELECT * FROM videos WHERE translated_at IS NULL ORDER BY published_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  }

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .is('translated_at', null)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  return [];
}

/**
 * Updates video translation fields in the database.
 */
export async function updateVideoTranslation(youtubeId, titleEn, descriptionEn) {
  const pgPool = getPgPool();
  const now = new Date().toISOString();

  if (pgPool) {
    const query = `
      UPDATE videos
      SET title_en = $2, description_en = $3, translated_at = $4, updated_at = CURRENT_TIMESTAMP
      WHERE youtube_id = $1
      RETURNING *;
    `;
    const res = await pgPool.query(query, [youtubeId, titleEn, descriptionEn, now]);
    return res.rows[0];
  }

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .update({
        title_en: titleEn,
        description_en: descriptionEn,
        translated_at: now,
        updated_at: now
      })
      .eq('youtube_id', youtubeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Metrics dashboard for admin user.
 */
export async function getAdminMetrics() {
  const pgPool = getPgPool();
  if (pgPool) {
    const [vCount, pCount, uCount, wCount] = await Promise.all([
      pgPool.query(`SELECT COUNT(*) FROM videos`),
      pgPool.query(`SELECT COUNT(*) FROM videos WHERE translated_at IS NULL`),
      pgPool.query(`SELECT COUNT(*) FROM profiles`),
      pgPool.query(`SELECT COUNT(*) FROM profiles WHERE created_at >= NOW() - INTERVAL '7 days'`)
    ]);

    return {
      totalVideos: parseInt(vCount.rows[0].count, 10),
      pendingTranslations: parseInt(pCount.rows[0].count, 10),
      totalRegisteredUsers: parseInt(uCount.rows[0].count, 10),
      signupsThisWeek: parseInt(wCount.rows[0].count, 10)
    };
  }

  if (supabaseAdmin) {
    const [v, p, u, w] = await Promise.all([
      supabaseAdmin.from('videos').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('videos').select('id', { count: 'exact', head: true }).is('translated_at', null),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 86400 * 1000).toISOString())
    ]);

    return {
      totalVideos: v.count || 0,
      pendingTranslations: p.count || 0,
      totalRegisteredUsers: u.count || 0,
      signupsThisWeek: w.count || 0
    };
  }

  return { totalVideos: 0, pendingTranslations: 0, totalRegisteredUsers: 0, signupsThisWeek: 0 };
}

/**
 * Format raw database row to frontend expected shape.
 */
export function formatVideoRow(row) {
  if (!row) return null;
  const ytId = row.youtube_id || row.youtubeId || (row.id && row.id.length === 11 ? row.id : 'GizYMQfl9CY');
  return {
    id: ytId,
    dbId: row.id,
    youtubeId: ytId,
    youtubeUrl: `https://www.youtube.com/watch?v=${ytId}`,
    isShort: row.duration_seconds > 0 && row.duration_seconds <= 65,
    channelHandle: '@budgetpadmanaban_',
    channelUrl: 'https://www.youtube.com/@budgetpadmanaban_',
    channelName: 'Budget Padmanaban',
    titleTamil: row.title_ta || '',
    titleEnglish: row.title_en || row.title_ta || '',
    title: row.title_ta || '',
    descriptionTamil: row.description_ta || '',
    descriptionEnglish: row.description_en || row.description_ta || '',
    description: row.description_ta || '',
    category: row.category || 'personal-finance',
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : new Date().toISOString(),
    duration: row.duration || '00:00',
    durationSeconds: row.duration_seconds || 0,
    views: parseInt(row.view_count || '0', 10),
    thumbnail: row.thumbnail_url || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    tags: row.tags || [],
    trending: row.trending || false,
    translatedAt: row.translated_at ? new Date(row.translated_at).toISOString() : null
  };
}
