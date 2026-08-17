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
    titleTamil: row.title_ta || '',
    titleEnglish: row.title_en || row.title_ta || '',
    title_ta: row.title_ta || '',
    title_en: row.title_en || '',
    excerptTamil: row.excerpt_ta || '',
    excerptEnglish: row.excerpt_en || row.excerpt_ta || '',
    excerpt_ta: row.excerpt_ta || '',
    excerpt_en: row.excerpt_en || '',
    bodyTamil: row.body_ta || '',
    bodyEnglish: row.body_en || row.body_ta || '',
    body_ta: row.body_ta || '',
    body_en: row.body_en || '',
    coverImage: row.cover_image_url || '/favicon.svg',
    cover_image_url: row.cover_image_url || '',
    category: row.category || 'mutual-fund',
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status || 'draft',
    authorId: row.author_id || null,
    authorName: row.author_name || 'Budget Padmanaban',
    authorAvatar: row.author_avatar || null,
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
          p.avatar_url AS author_avatar
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
      .select('*, profiles(display_name, avatar_url)', { count: 'exact' });

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
        author_avatar: author?.avatar_url
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
          p.avatar_url AS author_avatar
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
      .select('*, profiles(display_name, avatar_url)')
      .eq('slug', slug);

    if (!includeDraft) {
      q = q.eq('status', 'published');
    }

    const { data, error } = await q.maybeSingle();
    if (!error && data) {
      return formatArticleRow({
        ...data,
        author_name: data.profiles?.display_name,
        author_avatar: data.profiles?.avatar_url
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
          p.avatar_url AS author_avatar
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
      .select('*, profiles(display_name, avatar_url)')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      return formatArticleRow({
        ...data,
        author_name: data.profiles?.display_name,
        author_avatar: data.profiles?.avatar_url
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

