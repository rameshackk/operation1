import { supabaseAdmin, supabaseAnon } from '../../lib/supabase.js';
import { getPgPool, formatArticleRow } from '../../lib/db.js';

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
          WHERE p.id::text = $1 OR p.arn_number = $1
          LIMIT 1;
        `;
        const pubRes = await pgPool.query(pubQuery, [id]);
        if (pubRes.rows.length === 0) {
          return res.status(404).json({ error: 'Publisher profile not found' });
        }

        const publisher = pubRes.rows[0];

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

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.status(200).json({
          status: 'success',
          data: {
            ...publisher,
            articles: articlesRes.rows.map(formatArticleRow)
          }
        });
      }

      const client = supabaseAdmin || supabaseAnon;
      if (client) {
        const { data: pubData, error: pubErr } = await client
          .from('profiles')
          .select('id, display_name, avatar_url, role, title, arn_number, specialties, bio, bio_ta, linkedin_url, twitter_url, youtube_url, whatsapp_number, phone, is_onboarded, created_at')
          .eq('id', id)
          .maybeSingle();

        if (pubErr || !pubData) {
          return res.status(404).json({ error: 'Publisher profile not found' });
        }

        const { data: artData } = await client
          .from('articles')
          .select('*')
          .eq('author_id', pubData.id)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(20);

        return res.status(200).json({
          status: 'success',
          data: {
            ...pubData,
            article_count: artData?.length || 0,
            articles: (artData || []).map(formatArticleRow)
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

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
