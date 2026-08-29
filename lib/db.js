import pg from 'pg';
import { supabaseAdmin } from './supabase.js';

const { Pool } = pg;

// Singleton PG Connection Pool for Direct Database Access
let pool;

export function getPgPool() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.etanokdvfyvkidpeovdi:Fortune%21%40%23%241234%3F@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
  if (!pool && connectionString) {
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
 * Main brand channel videos default to status = 'published'.
 * Publisher-sourced videos default to status = 'pending'.
 */
export async function upsertVideo(video) {
  const pgPool = getPgPool();
  const sourcePublisherId = video.sourcePublisherId || video.source_publisher_id || null;
  const status = video.status || (sourcePublisherId ? 'pending' : 'published');

  if (pgPool) {
    const query = `
      INSERT INTO videos (
        youtube_id, title_ta, title_en, description_ta, description_en,
        thumbnail_url, duration, duration_seconds, published_at, view_count,
        category, tags, trending, translated_at, source_publisher_id, status, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP)
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
        source_publisher_id = COALESCE(videos.source_publisher_id, EXCLUDED.source_publisher_id),
        status = COALESCE(videos.status, EXCLUDED.status),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const youtubeId = video.youtubeId || video.youtube_id || (video.id && video.id.length === 11 ? video.id : null);
    const titleTa = video.titleTamil || video.title_ta || video.title || '';
    const titleEn = video.titleEnglish || video.title_en || (video.title && !video.titleTamil ? video.title : null);
    const descTa = video.descriptionTamil || video.description_ta || video.description || '';
    const descEn = video.descriptionEnglish || video.description_en || (video.description && !video.descriptionTamil ? video.description : null);
    const thumbUrl = video.thumbnailUrl || video.thumbnail_url || video.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '');
    const durFormatted = video.duration || '00:00';
    const durSec = video.durationSeconds || video.duration_seconds || 0;
    const pubAt = video.publishedAt || video.published_at || new Date().toISOString();
    const views = video.viewCount || video.view_count || video.views || 0;

    const values = [
      youtubeId,
      titleTa,
      titleEn,
      descTa,
      descEn,
      thumbUrl,
      durFormatted,
      durSec,
      pubAt,
      views,
      video.category || 'personal-finance',
      video.tags || [],
      video.trending || false,
      video.translatedAt || video.translated_at || null,
      sourcePublisherId,
      status
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
        source_publisher_id: sourcePublisherId,
        status: status,
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
 * Filters by status ('published' by default for public catalog, or 'pending' / 'all' for admin/publisher).
 */
export async function listVideos({ page = 1, limit = 20, category = 'all', sort = 'newest', status = 'published', sourcePublisherId = null, search = '' } = {}) {
  const p = Math.max(1, parseInt(page, 10));
  const l = Math.min(1000, Math.max(1, parseInt(limit, 10)));
  const offset = (p - 1) * l;
  const isAscending = sort === 'oldest';

  const pgPool = getPgPool();
  if (pgPool) {
    const conditions = [];
    const params = [];

    // Filter by status (if not 'all')
    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`v.status = $${params.length}`);
    }

    // Filter by category
    if (category && category !== 'all') {
      params.push(category);
      conditions.push(`v.category = $${params.length}`);
    }

    // Filter by source publisher
    if (sourcePublisherId) {
      params.push(sourcePublisherId);
      conditions.push(`v.source_publisher_id::text = $${params.length}`);
    }

    // Search query
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(v.title_ta ILIKE $${params.length} OR v.title_en ILIKE $${params.length} OR v.description_ta ILIKE $${params.length} OR v.description_en ILIKE $${params.length} OR array_to_string(v.tags, ' ') ILIKE $${params.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderDirection = isAscending ? 'ASC' : 'DESC';

    params.push(l);
    const limitParamIdx = params.length;
    params.push(offset);
    const offsetParamIdx = params.length;

    const query = `
      SELECT 
        v.*,
        p.display_name as source_publisher_name,
        p.arn_number as source_publisher_arn,
        p.avatar_url as source_publisher_avatar,
        COUNT(*) OVER() as total_count
      FROM videos v
      LEFT JOIN profiles p ON v.source_publisher_id::text = p.id::text
      ${whereClause}
      ORDER BY v.published_at ${orderDirection} NULLS LAST, v.created_at DESC
      LIMIT $${limitParamIdx} OFFSET $${offsetParamIdx};
    `;

    const res = await pgPool.query(query, params);
    const total = res.rows[0]?.total_count ? parseInt(res.rows[0].total_count, 10) : 0;
    return { videos: res.rows.map(formatVideoRow), total, page: p, limit: l };
  }

  if (supabaseAdmin) {
    let query = supabaseAdmin
      .from('videos')
      .select('*, profiles:source_publisher_id(display_name, arn_number, avatar_url)', { count: 'exact' })
      .order('published_at', { ascending: isAscending })
      .range(offset, offset + l - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (sourcePublisherId) {
      query = query.eq('source_publisher_id', sourcePublisherId);
    }
    if (search && search.trim()) {
      query = query.or(`title_ta.ilike.%${search.trim()}%,title_en.ilike.%${search.trim()}%`);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      videos: (data || []).map(r => formatVideoRow({
        ...r,
        source_publisher_name: r.profiles?.display_name,
        source_publisher_arn: r.profiles?.arn_number,
        source_publisher_avatar: r.profiles?.avatar_url
      })),
      total: count || 0,
      page: p,
      limit: l
    };
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
  const sourcePublisherId = row.source_publisher_id || row.sourcePublisherId || null;
  const isBrandChannel = !sourcePublisherId;

  return {
    id: ytId,
    dbId: row.id,
    youtubeId: ytId,
    youtubeUrl: `https://www.youtube.com/watch?v=${ytId}`,
    isShort: row.duration_seconds > 0 && row.duration_seconds <= 65,
    channelHandle: isBrandChannel ? '@budgetpadmanaban_' : (row.source_publisher_arn ? `@${row.source_publisher_arn}` : '@advisor'),
    channelUrl: isBrandChannel ? 'https://www.youtube.com/@budgetpadmanaban_' : (row.youtube_url || '#'),
    channelName: isBrandChannel ? 'Budget Padmanaban' : (row.source_publisher_name || 'Verified Advisor'),
    titleTamil: row.title_ta || row.title || row.title_en || row.titleTamil || '',
    titleEnglish: row.title_en || row.title || row.title_ta || row.titleEnglish || '',
    title: row.title_ta || row.title_en || row.title || row.titleTamil || '',
    descriptionTamil: row.description_ta || row.description || row.description_en || row.descriptionTamil || '',
    descriptionEnglish: row.description_en || row.description || row.description_ta || row.descriptionEnglish || '',
    description: row.description_ta || row.description_en || row.description || row.descriptionTamil || '',
    category: row.category || 'personal-finance',
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : new Date().toISOString(),
    duration: row.duration || '00:00',
    durationSeconds: row.duration_seconds || 0,
    views: parseInt(row.view_count || '0', 10),
    thumbnail: row.thumbnail_url || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    tags: row.tags || [],
    trending: row.trending || false,
    translatedAt: row.translated_at ? new Date(row.translated_at).toISOString() : null,
    sourcePublisherId: sourcePublisherId,
    sourcePublisherName: row.source_publisher_name || null,
    sourcePublisherArn: row.source_publisher_arn || null,
    sourcePublisherAvatar: row.source_publisher_avatar || null,
    status: row.status || 'published'
  };
}

/**
 * Returns all verified publisher channels for the cron ingestion pipeline.
 */
export async function getVerifiedPublisherChannels() {
  const pgPool = getPgPool();
  if (pgPool) {
    const query = `
      SELECT 
        id, display_name, email, arn_number, 
        youtube_url, youtube_channel_id, youtube_channel_title, youtube_channel_thumbnail
      FROM profiles
      WHERE youtube_channel_verified = true 
        AND youtube_channel_id IS NOT NULL 
        AND youtube_channel_id <> '';
    `;
    const res = await pgPool.query(query);
    return res.rows;
  }

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, display_name, email, arn_number, youtube_url, youtube_channel_id, youtube_channel_title, youtube_channel_thumbnail')
      .eq('youtube_channel_verified', true)
      .not('youtube_channel_id', 'is', null);
    if (error) throw error;
    return data || [];
  }

  return [];
}

/**
 * Returns publisher channels awaiting verification for the admin review queue.
 */
export async function getPendingPublisherChannels() {
  const pgPool = getPgPool();
  if (pgPool) {
    const query = `
      SELECT 
        id, display_name, email, arn_number, avatar_url,
        youtube_url, youtube_channel_id, youtube_channel_title, youtube_channel_thumbnail,
        youtube_channel_verified, created_at, updated_at
      FROM profiles
      WHERE (youtube_channel_verified = false OR youtube_channel_verified IS NULL)
        AND youtube_channel_id IS NOT NULL 
        AND youtube_channel_id <> ''
      ORDER BY updated_at DESC;
    `;
    const res = await pgPool.query(query);
    return res.rows;
  }

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, display_name, email, arn_number, avatar_url, youtube_url, youtube_channel_id, youtube_channel_title, youtube_channel_thumbnail, youtube_channel_verified, created_at, updated_at')
      .eq('youtube_channel_verified', false)
      .not('youtube_channel_id', 'is', null)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  return [];
}

/**
 * Approves or rejects a publisher's YouTube channel link.
 */
export async function verifyPublisherChannel(publisherId, isVerified) {
  const pgPool = getPgPool();
  if (pgPool) {
    const query = `
      UPDATE profiles 
      SET 
        youtube_channel_verified = $2,
        youtube_channel_id = CASE WHEN $2 = false THEN NULL ELSE youtube_channel_id END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const res = await pgPool.query(query, [publisherId, Boolean(isVerified)]);
    return res.rows[0];
  }

  if (supabaseAdmin) {
    const updatePayload = {
      youtube_channel_verified: Boolean(isVerified),
      updated_at: new Date().toISOString()
    };
    if (!isVerified) updatePayload.youtube_channel_id = null;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updatePayload)
      .eq('id', publisherId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

/**
 * Updates video publication status ('published' | 'rejected' | 'pending').
 */
export async function updateVideoStatus(youtubeIdOrId, status) {
  const pgPool = getPgPool();
  if (pgPool) {
    const query = `
      UPDATE videos
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE youtube_id = $1 OR id::text = $1
      RETURNING *;
    `;
    const res = await pgPool.query(query, [youtubeIdOrId, status]);
    return res.rows[0];
  }

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .update({ status, updated_at: new Date().toISOString() })
      .or(`youtube_id.eq.${youtubeIdOrId},id.eq.${youtubeIdOrId}`)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

/**
 * Automatically compute read time in minutes from word counts.
 * 130 WPM for Tamil, 180 WPM for English.
 */
export function calculateReadTime(textTa = '', textEn = '') {
  const stripHtml = (html) => (html || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  const plainTa = stripHtml(textTa);
  const plainEn = stripHtml(textEn);

  const wordsTa = plainTa ? plainTa.split(/\s+/).length : 0;
  const wordsEn = plainEn ? plainEn.split(/\s+/).length : 0;

  const minutesTa = wordsTa > 0 ? Math.ceil(wordsTa / 130) : 1;
  const minutesEn = wordsEn > 0 ? Math.ceil(wordsEn / 180) : 1;

  return Math.max(1, Math.max(minutesTa, minutesEn));
}

/**
 * Format raw database row to frontend expected article shape.
 */
export function formatArticleRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title_ta || row.title_en || '',
    titleTamil: row.title_ta || '',
    titleEnglish: row.title_en || row.title_ta || '',
    title_ta: row.title_ta || '',
    title_en: row.title_en || '',
    summary: row.excerpt_ta || row.excerpt_en || '',
    excerptTamil: row.excerpt_ta || '',
    excerptEnglish: row.excerpt_en || row.excerpt_ta || '',
    excerpt_ta: row.excerpt_ta || '',
    excerpt_en: row.excerpt_en || '',
    body: row.body_ta || row.body_en || '',
    bodyTamil: row.body_ta || '',
    bodyEnglish: row.body_en || row.body_ta || '',
    body_ta: row.body_ta || '',
    body_en: row.body_en || '',
    coverImage: row.cover_image_url || '/favicon.svg',
    cover_image_url: row.cover_image_url || '',
    category: row.category || 'mutual-fund',
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status || 'draft',
    views: parseInt(row.view_count || row.views || '0', 10),
    viewCount: parseInt(row.view_count || row.views || '0', 10),
    authorId: row.author_id || null,
    authorName: row.author_name || 'Budget Padmanaban',
    authorAvatar: row.author_avatar || null,
    authorTitle: row.author_title || row.title || 'AMFI Registered Mutual Fund Distributor',
    authorArn: row.author_arn || row.arn_number || '',
    authorSpecialties: row.author_specialties || row.specialties || [],
    authorBio: row.author_bio || row.bio || '',
    authorBioTa: row.author_bio_ta || row.bio_ta || '',
    authorLinkedin: row.author_linkedin || row.linkedin_url || '',
    authorTwitter: row.author_twitter || row.twitter_url || '',
    authorYoutube: row.author_youtube || row.youtube_url || '',
    authorWhatsapp: row.author_whatsapp || row.whatsapp_number || row.phone || '',
    authorPhone: row.author_phone || row.phone || '',
    readTimeMinutes: row.read_time_minutes || calculateReadTime(row.body_ta, row.body_en),
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  };
}

/**
 * List articles with pagination, category filter, status filter, and search.
 */
export async function listArticles({
  page = 1,
  limit = 20,
  category = 'all',
  status = 'published',
  search = '',
  sort = 'newest'
} = {}) {
  const pgPool = getPgPool();
  const offset = (Math.max(1, page) - 1) * limit;

  if (pgPool) {
    try {
      const conditions = [];
      const values = [];
      let paramIdx = 1;

      if (status && status !== 'all') {
        conditions.push(`a.status = $${paramIdx++}`);
        values.push(status);
      }

      if (category && category !== 'all') {
        conditions.push(`a.category = $${paramIdx++}`);
        values.push(category);
      }

      if (search && search.trim()) {
        conditions.push(`(
          a.title_ta ILIKE $${paramIdx} OR 
          a.title_en ILIKE $${paramIdx} OR 
          a.excerpt_ta ILIKE $${paramIdx} OR 
          a.excerpt_en ILIKE $${paramIdx}
        )`);
        values.push(`%${search.trim()}%`);
        paramIdx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      let orderBy = 'ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC';
      if (sort === 'oldest') {
        orderBy = 'ORDER BY a.published_at ASC NULLS LAST, a.created_at ASC';
      } else if (sort === 'title') {
        orderBy = 'ORDER BY a.title_ta ASC';
      } else if (sort === 'read_time') {
        orderBy = 'ORDER BY a.read_time_minutes DESC';
      }

      const countQuery = `SELECT COUNT(*) AS total FROM articles a ${whereClause}`;
      const countRes = await pgPool.query(countQuery, values);
      const total = parseInt(countRes.rows[0]?.total || '0', 10);

      const query = `
        SELECT 
          a.*,
          p.display_name AS author_name,
          p.avatar_url AS author_avatar,
          p.title AS author_title,
          p.arn_number AS author_arn,
          p.specialties AS author_specialties,
          p.bio AS author_bio,
          p.bio_ta AS author_bio_ta,
          p.linkedin_url AS author_linkedin,
          p.twitter_url AS author_twitter,
          p.youtube_url AS author_youtube,
          p.whatsapp_number AS author_whatsapp,
          p.phone AS author_phone
        FROM articles a
        LEFT JOIN profiles p ON a.author_id = p.id
        ${whereClause}
        ${orderBy}
        LIMIT $${paramIdx++} OFFSET $${paramIdx++}
      `;

      const res = await pgPool.query(query, [...values, limit, offset]);

      return {
        articles: res.rows.map(formatArticleRow),
        total,
        page,
        limit
      };
    } catch (pgErr) {
      console.warn('pgPool query failed in listArticles, falling back to Supabase client:', pgErr.message);
    }
  }

  const client = supabaseAdmin || supabaseAnon;
  if (client) {
    let q = client
      .from('articles')
      .select('*, profiles(display_name, avatar_url, title, arn_number, specialties, bio, bio_ta, linkedin_url, twitter_url, youtube_url, whatsapp_number, phone)', { count: 'exact' });

    if (status && status !== 'all') {
      q = q.eq('status', status);
    }
    if (category && category !== 'all') {
      q = q.eq('category', category);
    }
    if (search && search.trim()) {
      q = q.or(`title_ta.ilike.%${search.trim()}%,title_en.ilike.%${search.trim()}%`);
    }

    q = q.order('published_at', { ascending: sort === 'oldest', nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await q;
    if (error) {
      // If profile join failed, fallback to direct articles select
      const fallbackQuery = client
        .from('articles')
        .select('*', { count: 'exact' });

      if (status && status !== 'all') fallbackQuery.eq('status', status);
      if (category && category !== 'all') fallbackQuery.eq('category', category);
      if (search && search.trim()) fallbackQuery.or(`title_ta.ilike.%${search.trim()}%,title_en.ilike.%${search.trim()}%`);

      const fallbackRes = await fallbackQuery
        .order('published_at', { ascending: sort === 'oldest', nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      return {
        articles: (fallbackRes.data || []).map(formatArticleRow),
        total: fallbackRes.count || 0,
        page,
        limit
      };
    }

    const formatted = (data || []).map(r => {
      const author = r.profiles;
      return formatArticleRow({
        ...r,
        author_name: author?.display_name,
        author_avatar: author?.avatar_url,
        author_title: author?.title,
        author_arn: author?.arn_number,
        author_specialties: author?.specialties,
        author_bio: author?.bio,
        author_bio_ta: author?.bio_ta,
        author_linkedin: author?.linkedin_url,
        author_twitter: author?.twitter_url,
        author_youtube: author?.youtube_url,
        author_whatsapp: author?.whatsapp_number,
        author_phone: author?.phone
      });
    });

    return {
      articles: formatted,
      total: count || 0,
      page,
      limit
    };
  }

  return { articles: [], total: 0, page, limit };
}

/**
 * Get article by unique URL slug.
 */
export async function getArticleBySlug(slug, includeDraft = false) {
  if (!slug) return null;
  const pgPool = getPgPool();

  if (pgPool) {
    try {
      let query = `
        SELECT 
          a.*,
          p.display_name AS author_name,
          p.avatar_url AS author_avatar,
          p.title AS author_title,
          p.arn_number AS author_arn,
          p.specialties AS author_specialties,
          p.bio AS author_bio,
          p.bio_ta AS author_bio_ta,
          p.linkedin_url AS author_linkedin,
          p.twitter_url AS author_twitter,
          p.youtube_url AS author_youtube,
          p.whatsapp_number AS author_whatsapp,
          p.phone AS author_phone
        FROM articles a
        LEFT JOIN profiles p ON a.author_id = p.id
        WHERE a.slug = $1
      `;
      const params = [slug];
      if (!includeDraft) {
        query += ` AND a.status = 'published'`;
      }

      const res = await pgPool.query(query, params);
      if (res.rows.length > 0) {
        return formatArticleRow(res.rows[0]);
      }
    } catch (pgErr) {
      console.warn('pgPool query failed in getArticleBySlug, falling back:', pgErr.message);
    }
  }

  const client = supabaseAdmin || supabaseAnon;
  if (client) {
    let q = client
      .from('articles')
      .select('*, profiles(display_name, avatar_url, title, arn_number, specialties, bio, bio_ta, linkedin_url, twitter_url, youtube_url, whatsapp_number, phone)')
      .eq('slug', slug);

    if (!includeDraft) {
      q = q.eq('status', 'published');
    }

    const { data, error } = await q.maybeSingle();
    if (!error && data) {
      const author = data.profiles;
      return formatArticleRow({
        ...data,
        author_name: author?.display_name,
        author_avatar: author?.avatar_url,
        author_title: author?.title,
        author_arn: author?.arn_number,
        author_specialties: author?.specialties,
        author_bio: author?.bio,
        author_bio_ta: author?.bio_ta,
        author_linkedin: author?.linkedin_url,
        author_twitter: author?.twitter_url,
        author_youtube: author?.youtube_url,
        author_whatsapp: author?.whatsapp_number,
        author_phone: author?.phone
      });
    }

    // Direct fallback without join
    let directQ = client.from('articles').select('*').eq('slug', slug);
    if (!includeDraft) directQ = directQ.eq('status', 'published');
    const directRes = await directQ.maybeSingle();
    if (directRes.data) {
      return formatArticleRow(directRes.data);
    }
  }

  return null;
}

/**
 * Atomically increments the view count for an article by slug.
 */
export async function incrementArticleViews(slug) {
  if (!slug) return 0;
  const pgPool = getPgPool();

  if (pgPool) {
    try {
      const res = await pgPool.query(
        `UPDATE articles 
         SET view_count = COALESCE(view_count, 0) + 1 
         WHERE slug = $1 
         RETURNING view_count`,
        [slug]
      );
      if (res.rows.length > 0) {
        return parseInt(res.rows[0].view_count || '0', 10);
      }
    } catch (pgErr) {
      console.warn('pgPool query failed in incrementArticleViews, falling back:', pgErr.message);
    }
  }

  const client = supabaseAdmin || supabaseAnon;
  if (client) {
    try {
      const { data: curr } = await client
        .from('articles')
        .select('id, view_count')
        .eq('slug', slug)
        .maybeSingle();

      if (curr) {
        const nextViews = (curr.view_count || 0) + 1;
        await client
          .from('articles')
          .update({ view_count: nextViews })
          .eq('id', curr.id);
        return nextViews;
      }
    } catch (sbErr) {
      console.warn('Supabase fallback failed in incrementArticleViews:', sbErr.message);
    }
  }

  return 0;
}

/**
 * Get all comments for an article by slug (with verified publisher badges).
 */
export async function getArticleComments(slug) {
  if (!slug) return [];
  const pgPool = getPgPool();
  if (pgPool) {
    try {
      const res = await pgPool.query(
        `SELECT id, article_slug, user_id, user_name, user_avatar, user_role, is_verified, parent_id, content, likes_count, created_at
         FROM article_comments
         WHERE article_slug = $1
         ORDER BY created_at ASC`,
        [slug]
      );
      return res.rows.map(r => ({
        id: r.id,
        slug: r.article_slug,
        userId: r.user_id,
        userName: r.user_name,
        userAvatar: r.user_avatar,
        userRole: r.user_role || 'user',
        isVerified: Boolean(r.is_verified),
        parentId: r.parent_id,
        content: r.content,
        likesCount: parseInt(r.likes_count || '0', 10),
        createdAt: r.created_at
      }));
    } catch (err) {
      console.error('Error fetching comments from pgPool:', err.message);
    }
  }
  return [];
}

/**
 * Add a comment or reply to an article.
 */
export async function addArticleComment({ slug, userId, userName, userAvatar, userRole = 'user', isVerified = false, content, parentId = null }) {
  if (!slug || !content || !content.trim()) {
    throw new Error('Article slug and content are required');
  }
  const pgPool = getPgPool();
  if (!pgPool) throw new Error('Database connection not available');

  const res = await pgPool.query(
    `INSERT INTO article_comments (
       article_slug, user_id, user_name, user_avatar, user_role, is_verified, parent_id, content, likes_count, created_at, updated_at
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING id, article_slug, user_id, user_name, user_avatar, user_role, is_verified, parent_id, content, likes_count, created_at`,
    [slug, userId || 'anonymous', userName || 'Reader', userAvatar || null, userRole, Boolean(isVerified), parentId || null, content.trim()]
  );

  const r = res.rows[0];
  return {
    id: r.id,
    slug: r.article_slug,
    userId: r.user_id,
    userName: r.user_name,
    userAvatar: r.user_avatar,
    userRole: r.user_role,
    isVerified: Boolean(r.is_verified),
    parentId: r.parent_id,
    content: r.content,
    likesCount: parseInt(r.likes_count || '0', 10),
    createdAt: r.created_at
  };
}

/**
 * Delete a comment by ID.
 */
export async function deleteArticleComment(id, userId, userRole = 'user') {
  const pgPool = getPgPool();
  if (!pgPool) throw new Error('Database connection not available');

  if (userRole === 'admin' || userRole === 'publisher') {
    await pgPool.query('DELETE FROM article_comments WHERE id = $1', [id]);
  } else {
    await pgPool.query('DELETE FROM article_comments WHERE id = $1 AND user_id = $2', [id, userId]);
  }
  return true;
}

/**
 * Like a comment by ID.
 */
export async function likeArticleComment(id) {
  const pgPool = getPgPool();
  if (!pgPool) throw new Error('Database connection not available');

  const res = await pgPool.query(
    `UPDATE article_comments
     SET likes_count = COALESCE(likes_count, 0) + 1
     WHERE id = $1
     RETURNING likes_count`,
    [id]
  );
  return res.rows.length > 0 ? parseInt(res.rows[0].likes_count || '0', 10) : 0;
}

/**
 * Get article by primary UUID.
 */
export async function getArticleById(id) {
  if (!id) return null;
  const pgPool = getPgPool();

  if (pgPool) {
    try {
      const query = `
        SELECT 
          a.*,
          p.display_name AS author_name,
          p.avatar_url AS author_avatar,
          p.title AS author_title,
          p.arn_number AS author_arn,
          p.specialties AS author_specialties,
          p.bio AS author_bio,
          p.bio_ta AS author_bio_ta,
          p.linkedin_url AS author_linkedin,
          p.twitter_url AS author_twitter,
          p.youtube_url AS author_youtube,
          p.whatsapp_number AS author_whatsapp,
          p.phone AS author_phone
        FROM articles a
        LEFT JOIN profiles p ON a.author_id = p.id
        WHERE a.id = $1
      `;
      const res = await pgPool.query(query, [id]);
      if (res.rows.length > 0) return formatArticleRow(res.rows[0]);
    } catch (pgErr) {
      console.warn('pgPool query failed in getArticleById, falling back:', pgErr.message);
    }
  }

  const client = supabaseAdmin || supabaseAnon;
  if (client) {
    const { data, error } = await client
      .from('articles')
      .select('*, profiles(display_name, avatar_url, title, arn_number, specialties, bio, bio_ta, linkedin_url, twitter_url, youtube_url, whatsapp_number, phone)')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      const author = data.profiles;
      return formatArticleRow({
        ...data,
        author_name: author?.display_name,
        author_avatar: author?.avatar_url,
        author_title: author?.title,
        author_arn: author?.arn_number,
        author_specialties: author?.specialties,
        author_bio: author?.bio,
        author_bio_ta: author?.bio_ta,
        author_linkedin: author?.linkedin_url,
        author_twitter: author?.twitter_url,
        author_youtube: author?.youtube_url,
        author_whatsapp: author?.whatsapp_number,
        author_phone: author?.phone
      });
    }

    const directRes = await client.from('articles').select('*').eq('id', id).maybeSingle();
    if (directRes.data) return formatArticleRow(directRes.data);
  }

  return null;
}

/**
 * Create a new article in the database.
 */
export async function createArticle(data) {
  const pgPool = getPgPool();
  const readTime = calculateReadTime(data.body_ta, data.body_en);
  const status = data.status === 'published' ? 'published' : 'draft';
  const publishedAt = status === 'published' ? (data.published_at || new Date().toISOString()) : null;
  const tags = Array.isArray(data.tags) ? data.tags : [];

  if (pgPool) {
    const query = `
      INSERT INTO articles (
        slug, title_ta, title_en, excerpt_ta, excerpt_en,
        body_ta, body_en, cover_image_url, category, tags,
        status, author_id, read_time_minutes, published_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14
      )
      RETURNING *
    `;

    const values = [
      data.slug,
      data.title_ta,
      data.title_en || null,
      data.excerpt_ta || null,
      data.excerpt_en || null,
      data.body_ta,
      data.body_en || null,
      data.cover_image_url || null,
      data.category || 'mutual-fund',
      tags,
      status,
      data.author_id || null,
      readTime,
      publishedAt
    ];

    const res = await pgPool.query(query, values);
    return formatArticleRow(res.rows[0]);
  }

  if (supabaseAdmin) {
    const { data: created, error } = await supabaseAdmin
      .from('articles')
      .insert({
        slug: data.slug,
        title_ta: data.title_ta,
        title_en: data.title_en || null,
        excerpt_ta: data.excerpt_ta || null,
        excerpt_en: data.excerpt_en || null,
        body_ta: data.body_ta,
        body_en: data.body_en || null,
        cover_image_url: data.cover_image_url || null,
        category: data.category || 'mutual-fund',
        tags,
        status,
        author_id: data.author_id || null,
        read_time_minutes: readTime,
        published_at: publishedAt
      })
      .select()
      .single();

    if (error) throw error;
    return formatArticleRow(created);
  }

  throw new Error('Database connection not available');
}

/**
 * Update an existing article by ID.
 */
export async function updateArticle(id, data) {
  const pgPool = getPgPool();
  const existing = await getArticleById(id);
  if (!existing) {
    throw new Error('Article not found');
  }

  const bodyTa = data.body_ta !== undefined ? data.body_ta : existing.body_ta;
  const bodyEn = data.body_en !== undefined ? data.body_en : existing.body_en;
  const readTime = calculateReadTime(bodyTa, bodyEn);

  let status = data.status !== undefined ? data.status : existing.status;
  let publishedAt = existing.publishedAt;

  if (status === 'published' && (!existing.publishedAt || existing.status === 'draft')) {
    publishedAt = new Date().toISOString();
  } else if (status === 'draft') {
    publishedAt = null;
  }

  const tags = data.tags !== undefined ? (Array.isArray(data.tags) ? data.tags : []) : existing.tags;

  if (pgPool) {
    const query = `
      UPDATE articles SET
        slug = COALESCE($1, slug),
        title_ta = COALESCE($2, title_ta),
        title_en = COALESCE($3, title_en),
        excerpt_ta = COALESCE($4, excerpt_ta),
        excerpt_en = COALESCE($5, excerpt_en),
        body_ta = COALESCE($6, body_ta),
        body_en = COALESCE($7, body_en),
        cover_image_url = COALESCE($8, cover_image_url),
        category = COALESCE($9, category),
        tags = $10,
        status = $11,
        read_time_minutes = $12,
        published_at = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;

    const values = [
      data.slug || null,
      data.title_ta || null,
      data.title_en || null,
      data.excerpt_ta || null,
      data.excerpt_en || null,
      data.body_ta || null,
      data.body_en || null,
      data.cover_image_url || null,
      data.category || null,
      tags,
      status,
      readTime,
      publishedAt,
      id
    ];

    try {
      const res = await pgPool.query(query, values);
      if (res.rows.length > 0) {
        return formatArticleRow(res.rows[0]);
      }
    } catch (pgErr) {
      console.warn('pgPool query failed in updateArticle, falling back to Supabase client:', pgErr.message);
    }
  }

  const client = supabaseAdmin || supabaseAnon;
  if (client) {
    const updateObj = {
      updated_at: new Date().toISOString(),
      read_time_minutes: readTime,
      status,
      published_at: publishedAt,
      tags
    };

    if (data.slug !== undefined) updateObj.slug = data.slug;
    if (data.title_ta !== undefined) updateObj.title_ta = data.title_ta;
    if (data.title_en !== undefined) updateObj.title_en = data.title_en;
    if (data.excerpt_ta !== undefined) updateObj.excerpt_ta = data.excerpt_ta;
    if (data.excerpt_en !== undefined) updateObj.excerpt_en = data.excerpt_en;
    if (data.body_ta !== undefined) updateObj.body_ta = data.body_ta;
    if (data.body_en !== undefined) updateObj.body_en = data.body_en;
    if (data.cover_image_url !== undefined) updateObj.cover_image_url = data.cover_image_url;
    if (data.category !== undefined) updateObj.category = data.category;

    const { data: updated, error } = await client
      .from('articles')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return formatArticleRow(updated);
  }

  throw new Error('Database connection not available');
}

/**
 * Delete an article by ID.
 */
export async function deleteArticle(id) {
  const pgPool = getPgPool();
  if (pgPool) {
    try {
      const res = await pgPool.query('DELETE FROM articles WHERE id = $1 RETURNING id', [id]);
      if (res.rowCount > 0) return true;
    } catch (pgErr) {
      console.warn('pgPool delete failed, falling back to Supabase client:', pgErr.message);
    }
  }

  const client = supabaseAdmin || supabaseAnon;
  if (client) {
    const { error } = await client
      .from('articles')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }

  return false;
}

// ============================================================
// NEWS ARTICLES AGGREGATOR HELPERS
// ============================================================

/**
 * Format raw database row for news articles
 */
export function formatNewsRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    sourceUrl: row.source_url,
    sourceName: row.source_name,
    titleEnglish: row.title_en,
    titleTamil: row.title_ta || row.title_en,
    summaryEnglish: row.summary_en || '',
    summaryTamil: row.summary_ta || row.summary_en || '',
    imageUrl: row.image_url || null,
    category: row.category || 'general',
    publishedAt: row.published_at,
    fetchedAt: row.fetched_at,
    translatedAt: row.translated_at
  };
}

/**
 * Batch upserts news items into news_articles on source_url (skips existing records).
 * Returns { insertedCount, totalProcessed }
 */
export async function upsertNewsArticlesBatch(newsItems = []) {
  if (!newsItems || newsItems.length === 0) {
    return { insertedCount: 0, totalProcessed: 0 };
  }

  const pgPool = getPgPool();
  let insertedCount = 0;

  if (pgPool) {
    for (const item of newsItems) {
      try {
        const query = `
          INSERT INTO news_articles (
            source_url, source_name, title_en, title_ta, summary_en, summary_ta,
            image_url, category, published_at, fetched_at, translated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, $10)
          ON CONFLICT (source_url) DO NOTHING
          RETURNING id;
        `;
        const values = [
          item.source_url,
          item.source_name,
          item.title_en,
          item.title_ta || null,
          item.summary_en || null,
          item.summary_ta || null,
          item.image_url || null,
          item.category || 'general',
          item.published_at,
          item.translated_at || null
        ];
        const res = await pgPool.query(query, values);
        if (res.rowCount > 0) {
          insertedCount++;
        }
      } catch (err) {
        console.warn(`[DB News] Error inserting news item (${item.source_url}):`, err.message);
      }
    }
    return { insertedCount, totalProcessed: newsItems.length };
  }

  if (supabaseAdmin) {
    const rowsToInsert = newsItems.map(item => ({
      source_url: item.source_url,
      source_name: item.source_name,
      title_en: item.title_en,
      title_ta: item.title_ta || null,
      summary_en: item.summary_en || null,
      summary_ta: item.summary_ta || null,
      image_url: item.image_url || null,
      category: item.category || 'general',
      published_at: item.published_at,
      translated_at: item.translated_at || null
    }));

    const { data, error } = await supabaseAdmin
      .from('news_articles')
      .upsert(rowsToInsert, { onConflict: 'source_url', ignoreDuplicates: true })
      .select('id');

    if (error) {
      console.warn('[Supabase News] Error upserting news items:', error.message);
    }
    return { insertedCount: data?.length || 0, totalProcessed: newsItems.length };
  }

  return { insertedCount: 0, totalProcessed: newsItems.length };
}

/**
 * Lists aggregated news articles with optional category filter and pagination.
 */
export async function listNewsArticles({ category = 'all', limit = 20, page = 1 } = {}) {
  const pgPool = getPgPool();
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const offset = (safePage - 1) * safeLimit;

  if (pgPool) {
    let whereClause = '';
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      whereClause = `WHERE category = $${params.length}`;
    }

    params.push(safeLimit);
    const limitParam = `$${params.length}`;
    params.push(offset);
    const offsetParam = `$${params.length}`;

    const dataQuery = `
      SELECT * FROM news_articles
      ${whereClause}
      ORDER BY published_at DESC
      LIMIT ${limitParam} OFFSET ${offsetParam};
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM news_articles ${whereClause};
    `;

    const [dataRes, countRes] = await Promise.all([
      pgPool.query(dataQuery, params),
      pgPool.query(countQuery, category && category !== 'all' ? [category] : [])
    ]);

    const total = parseInt(countRes.rows[0]?.total || '0', 10);
    return {
      news: (dataRes.rows || []).map(formatNewsRow),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1
    };
  }

  if (supabaseAdmin) {
    let query = supabaseAdmin
      .from('news_articles')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(offset, offset + safeLimit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      news: (data || []).map(formatNewsRow),
      total: count || 0,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil((count || 0) / safeLimit) || 1
    };
  }

  return { news: [], total: 0, page: 1, limit: safeLimit, totalPages: 1 };
}

/**
 * Returns news items that are pending Tamil translation.
 */
export async function getNewsPendingTranslation(limit = 10) {
  const pgPool = getPgPool();
  if (pgPool) {
    const res = await pgPool.query(
      `SELECT id, source_url, title_en, summary_en FROM news_articles WHERE translated_at IS NULL ORDER BY published_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  }

  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from('news_articles')
      .select('id, source_url, title_en, summary_en')
      .is('translated_at', null)
      .order('published_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  return [];
}

/**
 * Updates translated Tamil headline and summary for a news item.
 */
export async function updateNewsTranslation(id, titleTa, summaryTa) {
  const pgPool = getPgPool();
  const now = new Date().toISOString();

  if (pgPool) {
    await pgPool.query(
      `UPDATE news_articles SET title_ta = $1, summary_ta = $2, translated_at = $3 WHERE id = $4`,
      [titleTa, summaryTa, now, id]
    );
    return true;
  }

  if (supabaseAdmin) {
    await supabaseAdmin
      .from('news_articles')
      .update({ title_ta: titleTa, summary_ta: summaryTa, translated_at: now })
      .eq('id', id);
    return true;
  }

  return false;
}


