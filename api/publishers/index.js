import { supabaseAdmin, supabaseAnon } from '../../lib/supabase.js';
import { getPgPool, formatArticleRow, formatVideoRow, upsertVideo } from '../../lib/db.js';
import { verifyUserRequest } from '../../lib/auth-server.js';
import { 
  resolvePublisherYouTubeInput, 
  resolveChannelWithoutApiKey, 
  fetchLatestUploadVideoIds, 
  fetchVideoDetails, 
  fetchChannelVideosViaRss 
} from '../../lib/youtube.js';
import { classifyCategory, extractSeoKeywords } from '../../lib/taxonomy.js';
import { 
  isSafeUrl, 
  sanitizeText, 
  getClientIp, 
  checkRateLimit, 
  logSecurityEvent 
} from '../../lib/security.js';

export default async function handler(req, res) {
  const clientIp = getClientIp(req);

  // ================= POST / PATCH: PUBLISHER ONBOARDING / PROFILE UPDATE =================
  if (req.method === 'POST' || req.method === 'PATCH') {
    const auth = await verifyUserRequest(req);
    if (!auth.authorized) {
      return res.status(auth.status).json({ error: auth.error });
    }

    const userId = auth.user.id;
    const rate = checkRateLimit(clientIp, 'publisher_onboard', 15, 60000);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
    }

    try {
      const {
        display_name,
        avatar_url,
        title,
        arn_number,
        specialties,
        bio,
        bio_ta,
        linkedin_url,
        twitter_url,
        website_url,
        youtube_url,
        whatsapp_number,
        phone
      } = req.body || {};

      if (!display_name || !display_name.trim()) {
        return res.status(400).json({ error: 'Display Name is required.' });
      }

      const updates = {
        id: userId,
        display_name: sanitizeText(display_name, 100),
        is_onboarded: true,
        updated_at: new Date().toISOString()
      };

      if (avatar_url !== undefined) updates.avatar_url = isSafeUrl(avatar_url) ? avatar_url.trim() : null;
      if (title !== undefined) updates.title = sanitizeText(title, 150);
      if (arn_number !== undefined) updates.arn_number = sanitizeText(arn_number, 50);
      if (specialties !== undefined) updates.specialties = Array.isArray(specialties) ? specialties.map(s => sanitizeText(String(s), 50)) : [sanitizeText(String(specialties), 50)];
      if (bio !== undefined) updates.bio = sanitizeText(bio, 2000);
      if (bio_ta !== undefined) updates.bio_ta = sanitizeText(bio_ta, 2000);
      if (linkedin_url !== undefined) updates.linkedin_url = isSafeUrl(linkedin_url) ? linkedin_url.trim() : null;
      if (twitter_url !== undefined) updates.twitter_url = isSafeUrl(twitter_url) ? twitter_url.trim() : null;
      if (website_url !== undefined) updates.website_url = isSafeUrl(website_url) ? website_url.trim() : '';
      if (whatsapp_number !== undefined) updates.whatsapp_number = sanitizeText(whatsapp_number, 30);
      if (phone !== undefined) updates.phone = sanitizeText(phone, 30);

      let resolvedChannel = null;
      if (youtube_url !== undefined) {
        updates.youtube_url = isSafeUrl(youtube_url) ? youtube_url.trim() : '';
        if (updates.youtube_url) {
          const ytApiKey = process.env.YOUTUBE_API_KEY;
          if (ytApiKey) {
            try {
              resolvedChannel = await resolvePublisherYouTubeInput(updates.youtube_url, ytApiKey);
            } catch (ytErr) {
              console.warn('YouTube API channel resolution notice:', ytErr.message);
            }
          }

          if (!resolvedChannel || !resolvedChannel.channelId || !resolvedChannel.channelId.startsWith('UC')) {
            const noKeyResolved = await resolveChannelWithoutApiKey(updates.youtube_url);
            if (noKeyResolved && noKeyResolved.channelId) {
              resolvedChannel = noKeyResolved;
            }
          }

          if (resolvedChannel && resolvedChannel.channelId) {
            updates.youtube_channel_id = resolvedChannel.channelId;
            updates.youtube_channel_title = sanitizeText(resolvedChannel.channelTitle, 150);
            updates.youtube_channel_thumbnail = isSafeUrl(resolvedChannel.channelThumbnail) ? resolvedChannel.channelThumbnail : null;
            updates.youtube_channel_verified = true;
          } else {
            const fallbackName = (updates.youtube_url.match(/(?:@|channel\/)([A-Za-z0-9_.-]+)/)?.[1]) || updates.youtube_url;
            updates.youtube_channel_title = sanitizeText(fallbackName, 150);
            updates.youtube_channel_verified = true;
          }
        } else {
          updates.youtube_channel_id = null;
          updates.youtube_channel_title = null;
          updates.youtube_channel_thumbnail = null;
          updates.youtube_channel_verified = false;
        }
      }

      const pgPool = getPgPool();
      let savedProfile = null;

      if (pgPool) {
        const userEmail = auth.user.email || '';
        const upsertQuery = `
          INSERT INTO profiles (
            id, email, display_name, avatar_url, title, arn_number,
            specialties, bio, bio_ta, linkedin_url, twitter_url, website_url,
            youtube_url, youtube_channel_id, youtube_channel_title, youtube_channel_thumbnail, youtube_channel_verified,
            whatsapp_number, phone, is_onboarded, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, true, CURRENT_TIMESTAMP
          )
          ON CONFLICT (id) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
            title = COALESCE(EXCLUDED.title, profiles.title),
            arn_number = COALESCE(EXCLUDED.arn_number, profiles.arn_number),
            specialties = COALESCE(EXCLUDED.specialties, profiles.specialties),
            bio = COALESCE(EXCLUDED.bio, profiles.bio),
            bio_ta = COALESCE(EXCLUDED.bio_ta, profiles.bio_ta),
            linkedin_url = COALESCE(EXCLUDED.linkedin_url, profiles.linkedin_url),
            twitter_url = COALESCE(EXCLUDED.twitter_url, profiles.twitter_url),
            website_url = COALESCE(EXCLUDED.website_url, profiles.website_url),
            youtube_url = COALESCE(EXCLUDED.youtube_url, profiles.youtube_url),
            youtube_channel_id = COALESCE(EXCLUDED.youtube_channel_id, profiles.youtube_channel_id),
            youtube_channel_title = COALESCE(EXCLUDED.youtube_channel_title, profiles.youtube_channel_title),
            youtube_channel_thumbnail = COALESCE(EXCLUDED.youtube_channel_thumbnail, profiles.youtube_channel_thumbnail),
            youtube_channel_verified = COALESCE(EXCLUDED.youtube_channel_verified, profiles.youtube_channel_verified),
            whatsapp_number = COALESCE(EXCLUDED.whatsapp_number, profiles.whatsapp_number),
            phone = COALESCE(EXCLUDED.phone, profiles.phone),
            is_onboarded = true,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *;
        `;

        const values = [
          userId,
          userEmail,
          updates.display_name,
          updates.avatar_url || null,
          updates.title || null,
          updates.arn_number || null,
          updates.specialties || [],
          updates.bio || null,
          updates.bio_ta || null,
          updates.linkedin_url || null,
          updates.twitter_url || null,
          updates.website_url || null,
          updates.youtube_url || null,
          updates.youtube_channel_id || null,
          updates.youtube_channel_title || null,
          updates.youtube_channel_thumbnail || null,
          updates.youtube_channel_verified || false,
          updates.whatsapp_number || null,
          updates.phone || null
        ];

        const resDb = await pgPool.query(upsertQuery, values);
        savedProfile = resDb.rows[0];
      } else if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .upsert({ ...updates, id: userId, is_onboarded: true })
          .select()
          .single();

        if (error) throw error;
        savedProfile = data;
      }

      const channelIdToSync = resolvedChannel?.channelId || updates.youtube_channel_id;
      if (channelIdToSync) {
        try {
          const ytApiKey = process.env.YOUTUBE_API_KEY;
          let videoItems = [];

          if (ytApiKey && resolvedChannel?.uploadsPlaylistId) {
            try {
              let videoIds = [];
              if (resolvedChannel.initialVideoId) videoIds.push(resolvedChannel.initialVideoId);
              const playlistVideoIds = await fetchLatestUploadVideoIds(resolvedChannel.uploadsPlaylistId, ytApiKey, 24);
              videoIds = Array.from(new Set([...videoIds, ...playlistVideoIds]));
              if (videoIds.length > 0) {
                videoItems = await fetchVideoDetails(videoIds, ytApiKey);
              }
            } catch (apiErr) {
              console.warn('YouTube API videos fetch notice:', apiErr.message);
            }
          }

          if (videoItems.length === 0 && channelIdToSync.startsWith('UC')) {
            videoItems = await fetchChannelVideosViaRss(channelIdToSync);
          }

          for (const v of videoItems) {
            const videoTitle = sanitizeText(v.titleTamil || v.title || '', 300);
            const videoDesc = sanitizeText(v.descriptionTamil || v.description || '', 5000);
            const assignedCategory = classifyCategory(videoTitle, videoDesc, v.tags || []);
            const assignedTags = extractSeoKeywords(videoTitle, videoDesc, v.tags || [], assignedCategory);

            await upsertVideo({
              youtube_id: v.youtubeId,
              title: videoTitle,
              title_ta: videoTitle,
              title_en: videoTitle,
              description: videoDesc,
              description_ta: videoDesc,
              description_en: videoDesc,
              published_at: v.publishedAt,
              duration: v.duration || '12:00',
              duration_seconds: v.durationSeconds || 720,
              view_count: v.viewCount || 1000,
              is_short: v.isShort || false,
              thumbnail_url: isSafeUrl(v.thumbnailUrl) ? v.thumbnailUrl : null,
              category: assignedCategory,
              tags: assignedTags,
              source_publisher_id: userId,
              status: 'published'
            });
          }
        } catch (ingestErr) {
          console.warn('Initial video ingestion notice:', ingestErr.message);
        }
      }

      logSecurityEvent('PUBLISHER_ONBOARDED', { ip: clientIp, userId });

      return res.status(200).json({
        status: 'success',
        message: 'Publisher profile saved successfully!',
        data: savedProfile
      });
    } catch (err) {
      console.error('Error in publisher onboarding:', err);
      return res.status(500).json({ error: err.message || 'Failed to save publisher profile.' });
    }
  }

  // ================= GET: SINGLE PUBLISHER OR LIST PUBLISHERS =================
  if (req.method === 'GET') {
    const { id, search, limit = 50 } = req.query || {};

    // 1. Single publisher profile
    if (id) {
      try {
        const pgPool = getPgPool();
        if (pgPool) {
          const pubQuery = `
            SELECT 
              p.id, p.display_name, p.avatar_url, p.role, p.title, p.arn_number,
              p.specialties, p.bio, p.bio_ta, p.linkedin_url, p.twitter_url, p.website_url,
              p.youtube_url, p.youtube_channel_id, p.youtube_channel_title, p.youtube_channel_thumbnail,
              p.youtube_channel_verified, p.whatsapp_number, p.phone, p.is_onboarded, p.created_at,
              COALESCE(art.article_count, 0) as article_count,
              COALESCE(vid.video_count, 0) as video_count
            FROM profiles p
            LEFT JOIN (
              SELECT author_id, COUNT(*) as article_count FROM articles WHERE status = 'published' GROUP BY author_id
            ) art ON p.id::text = art.author_id::text
            LEFT JOIN (
              SELECT source_publisher_id, COUNT(*) as video_count FROM videos WHERE status = 'published' GROUP BY source_publisher_id
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

          const articlesQuery = `
            SELECT a.*, p.display_name as author_name, p.avatar_url as author_avatar, p.title as author_title, p.arn_number as author_arn
            FROM articles a
            LEFT JOIN profiles p ON a.author_id::text = p.id::text
            WHERE a.author_id::text = $1 AND a.status = 'published'
            ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
            LIMIT 20;
          `;
          const articlesRes = await pgPool.query(articlesQuery, [String(publisher.id)]);

          const videoCondition = isFounder 
            ? `(v.source_publisher_id::text = $1 OR v.source_publisher_id IS NULL)`
            : `v.source_publisher_id::text = $1`;

          const videosQuery = `
            SELECT v.*, p.display_name as source_publisher_name, p.arn_number as source_publisher_arn, p.avatar_url as source_publisher_avatar
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
            .select('*')
            .or(`id.eq.${id},arn_number.eq.${id}`)
            .maybeSingle();

          if (pubErr || !pubData) {
            return res.status(404).json({ error: 'Publisher profile not found' });
          }

          const [{ data: artData }, { data: vidData }] = await Promise.all([
            client.from('articles').select('*').eq('author_id', pubData.id).eq('status', 'published').limit(20),
            client.from('videos').select('*').eq('source_publisher_id', pubData.id).eq('status', 'published').limit(50)
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

    // 2. List all publishers
    try {
      const pgPool = getPgPool();
      if (pgPool) {
        let query = `
          SELECT 
            p.id, p.display_name, p.avatar_url, p.role, p.title, p.arn_number,
            p.specialties, p.bio, p.bio_ta, p.linkedin_url, p.twitter_url, p.website_url,
            p.youtube_url, p.whatsapp_number, p.phone, p.is_onboarded, p.created_at,
            COALESCE(art.article_count, 0) as article_count
          FROM profiles p
          LEFT JOIN (
            SELECT author_id, COUNT(*) as article_count FROM articles WHERE status = 'published' GROUP BY author_id
          ) art ON p.id::text = art.author_id::text
          WHERE p.role IN ('publisher', 'admin')
            AND (p.is_test IS NULL OR p.is_test = false)
            AND p.display_name NOT ILIKE '%demo%'
        `;

        const params = [];
        if (search && search.trim()) {
          params.push(`%${search.trim()}%`);
          query += ` AND (p.display_name ILIKE $${params.length} OR p.title ILIKE $${params.length} OR p.arn_number ILIKE $${params.length})`;
        }

        query += ` ORDER BY p.is_onboarded DESC, article_count DESC, p.created_at DESC LIMIT $${params.length + 1};`;
        params.push(parseInt(limit, 10) || 50);

        const result = await pgPool.query(query, params);
        res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
        return res.status(200).json({
          status: 'success',
          data: result.rows
        });
      }

      const client = supabaseAdmin || supabaseAnon;
      if (client) {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .in('role', ['publisher', 'admin'])
          .or('is_test.is.null,is_test.eq.false')
          .not('display_name', 'ilike', '%demo%')
          .order('created_at', { ascending: false })
          .limit(parseInt(limit, 10) || 50);

        if (error) throw error;
        res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
        return res.status(200).json({ status: 'success', data: data || [] });
      }

      return res.status(500).json({ error: 'Database client not available' });
    } catch (err) {
      console.error('Error listing publishers:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
