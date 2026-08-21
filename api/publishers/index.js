import { supabaseAdmin, supabaseAnon } from '../../lib/supabase.js';
import { getPgPool, formatArticleRow, formatVideoRow } from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, search, limit = 50 } = req.query || {};

  // ================= SINGLE PUBLISHER / ADVISOR PROFILE =================
  if (id) {
    try {
      const pgPool = getPgPool();
      if (pgPool) {
        // Fetch publisher profile
        const pubQuery = `
          SELECT 
            p.id,
            p.display_name,
            p.avatar_url,
            p.role,
            p.title,
            p.arn_number,
            p.specialties,
            p.bio,
            p.bio_ta,
            p.linkedin_url,
            p.twitter_url,
            p.youtube_url,
            p.youtube_channel_id,
            p.youtube_channel_title,
            p.youtube_channel_thumbnail,
            p.youtube_channel_verified,
            p.whatsapp_number,
            p.phone,
            p.is_onboarded,
            p.created_at,
            COALESCE(art.article_count, 0) as article_count,
            COALESCE(vid.video_count, 0) as video_count
          FROM profiles p
          LEFT JOIN (
            SELECT author_id, COUNT(*) as article_count 
            FROM articles 
            WHERE status = 'published'
            GROUP BY author_id
          ) art ON p.id::text = art.author_id::text
          LEFT JOIN (
            SELECT source_publisher_id, COUNT(*) as video_count
            FROM videos
            WHERE status = 'published'
            GROUP BY source_publisher_id
          ) vid ON p.id::text = vid.source_publisher_id::text
          WHERE p.id::text = $1 
             OR p.arn_number = $1 
             OR LOWER(REPLACE(p.display_name, ' ', '-')) = LOWER($1) 
             OR LOWER(p.display_name) = LOWER($1)
             OR ($1 = 'budget-padmanaban' AND (p.display_name ILIKE '%padmanaban%' OR p.role = 'admin'))
          LIMIT 1;
        `;
        const pubRes = await pgPool.query(pubQuery, [id]);
        if (pubRes.rows.length === 0) {
          // If seed founder query
          if (id === 'budget-padmanaban') {
            const founderRes = await pgPool.query(`
              SELECT id, display_name, avatar_url, role, title, arn_number, specialties, bio, bio_ta, linkedin_url, twitter_url, youtube_url, whatsapp_number, phone, is_onboarded, created_at
              FROM profiles WHERE role = 'admin' OR display_name ILIKE '%padmanaban%' LIMIT 1;
            `);
            if (founderRes.rows.length > 0) {
              pubRes.rows = founderRes.rows;
            } else {
              return res.status(404).json({ error: 'Publisher profile not found' });
            }
          } else {
            return res.status(404).json({ error: 'Publisher profile not found' });
          }
        }

        const publisher = pubRes.rows[0];
        const isFounder = id === 'budget-padmanaban' || (publisher.display_name && publisher.display_name.toLowerCase().includes('padmanaban'));

        // Fetch articles published by this author
        const articlesQuery = `
          SELECT 
            a.*,
            p.display_name as author_name,
            p.avatar_url as author_avatar,
            p.title as author_title,
            p.arn_number as author_arn
          FROM articles a
          LEFT JOIN profiles p ON a.author_id::text = p.id::text
          WHERE a.author_id::text = $1 AND a.status = 'published'
          ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
          LIMIT 20;
        `;
        const articlesRes = await pgPool.query(articlesQuery, [String(publisher.id)]);

        // Fetch videos ingested from this publisher's verified channel (or main channel if founder)
        const videoCondition = isFounder 
          ? `(v.source_publisher_id::text = $1 OR v.source_publisher_id IS NULL)`
          : `v.source_publisher_id::text = $1`;

        const videosQuery = `
          SELECT 
            v.*,
            p.display_name as source_publisher_name,
            p.arn_number as source_publisher_arn,
            p.avatar_url as source_publisher_avatar
          FROM videos v
          LEFT JOIN profiles p ON v.source_publisher_id::text = p.id::text
          WHERE ${videoCondition} AND v.status = 'published'
          ORDER BY v.published_at DESC NULLS LAST, v.created_at DESC
          LIMIT 50;
        `;
        const videosRes = await pgPool.query(videosQuery, [String(publisher.id)]);

        res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
        return res.status(200).json({
          status: 'success',
          data: {
            ...publisher,
            articles: articlesRes.rows.map(formatArticleRow),
            videos: videosRes.rows.map(r => formatVideoRow(r))
          }
        });
      }

      const client = supabaseAdmin || supabaseAnon;
      if (client) {
        const { data: pubData, error: pubErr } = await client
          .from('profiles')
          .select('id, display_name, avatar_url, role, title, arn_number, specialties, bio, bio_ta, linkedin_url, twitter_url, youtube_url, youtube_channel_id, youtube_channel_title, youtube_channel_thumbnail, youtube_channel_verified, whatsapp_number, phone, is_onboarded, created_at')
          .or(`id.eq.${id},arn_number.eq.${id}`)
          .maybeSingle();

        if (pubErr || !pubData) {
          return res.status(404).json({ error: 'Publisher profile not found' });
        }

        const [{ data: artData }, { data: vidData }] = await Promise.all([
          client
            .from('articles')
            .select('*')
            .eq('author_id', pubData.id)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(20),
          client
            .from('videos')
            .select('*')
            .eq('source_publisher_id', pubData.id)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(50)
        ]);

        return res.status(200).json({
          status: 'success',
          data: {
            ...pubData,
            article_count: artData?.length || 0,
            video_count: vidData?.length || 0,
            articles: (artData || []).map(formatArticleRow),
            videos: (vidData || []).map(r => formatVideoRow(r))
          }
        });
      }

      return res.status(500).json({ error: 'Database client not available' });
    } catch (err) {
      console.error('Error fetching publisher profile:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ================= LIST ALL VERIFIED PUBLISHERS & ADVISORS =================
  try {
    const pgPool = getPgPool();
    if (pgPool) {
      let query = `
        SELECT 
          p.id,
          p.display_name,
          p.avatar_url,
          p.role,
          p.title,
          p.arn_number,
          p.specialties,
          p.bio,
          p.bio_ta,
          p.linkedin_url,
          p.twitter_url,
          p.youtube_url,
          p.whatsapp_number,
          p.phone,
          p.is_onboarded,
          p.created_at,
          COALESCE(art.article_count, 0) as article_count
        FROM profiles p
        LEFT JOIN (
          SELECT author_id, COUNT(*) as article_count 
          FROM articles 
          WHERE status = 'published'
          GROUP BY author_id
        ) art ON p.id::text = art.author_id::text
        WHERE p.role = 'publisher'
      `;

      const params = [];
      if (search && search.trim()) {
        params.push(`%${search.trim()}%`);
        query += ` AND (p.display_name ILIKE $${params.length} OR p.title ILIKE $${params.length} OR p.arn_number ILIKE $${params.length} OR p.bio ILIKE $${params.length} OR p.bio_ta ILIKE $${params.length})`;
      }

      query += ` ORDER BY p.is_onboarded DESC, article_count DESC, p.created_at DESC LIMIT $${params.length + 1};`;
      params.push(parseInt(limit, 10) || 50);

      const result = await pgPool.query(query, params);

      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
      return res.status(200).json({
        status: 'success',
        data: result.rows
      });
    }

    const client = supabaseAdmin || supabaseAnon;
    if (client) {
      let q = client
        .from('profiles')
        .select('id, display_name, avatar_url, role, title, arn_number, specialties, bio, bio_ta, linkedin_url, twitter_url, youtube_url, whatsapp_number, phone, is_onboarded, created_at')
        .eq('role', 'publisher')
        .order('created_at', { ascending: false })
        .limit(parseInt(limit, 10) || 50);

      if (search && search.trim()) {
        q = q.or(`display_name.ilike.%${search.trim()}%,title.ilike.%${search.trim()}%,arn_number.ilike.%${search.trim()}%`);
      }

      const { data, error } = await q;
      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        data: data || []
      });
    }

    return res.status(500).json({ error: 'Database client not available' });
  } catch (err) {
    console.error('Error listing publishers:', err);
    return res.status(500).json({ error: err.message });
  }
}
