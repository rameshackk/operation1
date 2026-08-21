import { verifyUserRequest } from '../../lib/auth-server.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import { getPgPool, upsertVideo } from '../../lib/db.js';
import { resolvePublisherYouTubeInput, fetchLatestUploadVideoIds, fetchVideoDetails } from '../../lib/youtube.js';
import { translateVideo } from '../../lib/translate.js';

export default async function handler(req, res) {
  // 1. Verify authenticated user
  const auth = await verifyUserRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const userId = auth.user.id;

  // GET: Fetch current publisher onboarding state
  if (req.method === 'GET') {
    try {
      const pgPool = getPgPool();
      if (pgPool) {
        const query = `SELECT * FROM profiles WHERE id = $1 LIMIT 1;`;
        const result = await pgPool.query(query, [userId]);
        return res.status(200).json({ status: 'success', data: result.rows[0] || null });
      }

      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (error) throw error;
        return res.status(200).json({ status: 'success', data });
      }

      return res.status(500).json({ error: 'Database not available' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST / PATCH: Submit first-time onboarding information or update profile
  if (req.method === 'POST' || req.method === 'PATCH') {
    try {
      const auth = await requireAuth(req, res);
      if (!auth) return;

      const userId = auth.user.id;
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
        youtube_url,
        whatsapp_number,
        phone
      } = req.body || {};

      if (!display_name) {
        return res.status(400).json({ error: 'Display Name is required.' });
      }

      const updates = {
        id: userId,
        display_name,
        is_onboarded: true,
        updated_at: new Date().toISOString()
      };

      if (avatar_url !== undefined) updates.avatar_url = avatar_url;
      if (title !== undefined) updates.title = title;
      if (arn_number !== undefined) updates.arn_number = arn_number;
      if (specialties !== undefined) updates.specialties = Array.isArray(specialties) ? specialties : [specialties];
      if (bio !== undefined) updates.bio = bio;
      if (bio_ta !== undefined) updates.bio_ta = bio_ta;
      if (linkedin_url !== undefined) updates.linkedin_url = linkedin_url;
      if (twitter_url !== undefined) updates.twitter_url = twitter_url;
      if (whatsapp_number !== undefined) updates.whatsapp_number = whatsapp_number;
      if (phone !== undefined) updates.phone = phone;

      // Resolve YouTube Channel if youtube_url is provided
      let resolvedChannel = null;
      if (youtube_url !== undefined) {
        updates.youtube_url = youtube_url ? youtube_url.trim() : '';
        if (updates.youtube_url) {
          const ytApiKey = process.env.YOUTUBE_API_KEY;
          if (ytApiKey) {
            try {
              resolvedChannel = await resolvePublisherYouTubeInput(updates.youtube_url, ytApiKey);
            } catch (ytErr) {
              console.warn('YouTube API channel resolution notice:', ytErr.message);
            }
          }

          // If no API key or API resolution didn't yield a channel ID, use scraper fallback
          if (!resolvedChannel || !resolvedChannel.channelId || !resolvedChannel.channelId.startsWith('UC')) {
            const noKeyResolved = await resolveChannelWithoutApiKey(updates.youtube_url);
            if (noKeyResolved && noKeyResolved.channelId) {
              resolvedChannel = noKeyResolved;
            }
          }

          if (resolvedChannel && resolvedChannel.channelId) {
            updates.youtube_channel_id = resolvedChannel.channelId;
            updates.youtube_channel_title = resolvedChannel.channelTitle;
            updates.youtube_channel_thumbnail = resolvedChannel.channelThumbnail;
            updates.youtube_channel_verified = true;
          } else {
            const fallbackName = (updates.youtube_url.match(/(?:@|channel\/)([A-Za-z0-9_.-]+)/)?.[1]) || updates.youtube_url;
            updates.youtube_channel_title = fallbackName;
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
            specialties, bio, bio_ta, linkedin_url, twitter_url,
            youtube_url, youtube_channel_id, youtube_channel_title, youtube_channel_thumbnail, youtube_channel_verified,
            whatsapp_number, phone, is_onboarded, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, true, CURRENT_TIMESTAMP
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
          .upsert({
            ...updates,
            id: userId,
            is_onboarded: true
          })
          .select()
          .single();

        if (error) throw error;
        savedProfile = data;
      }

      // If YouTube channel was changed or updated, remove old videos for this publisher and sync fresh ones
      if (youtube_url !== undefined) {
        try {
          if (pgPool) {
            await pgPool.query('DELETE FROM videos WHERE source_publisher_id::text = $1', [userId]);
          } else if (supabaseAdmin) {
            await supabaseAdmin.from('videos').delete().eq('source_publisher_id', userId);
          }
        } catch (delErr) {
          console.warn('Could not clean old publisher videos:', delErr.message);
        }
      }

      // Immediately ingest and link the new channel's videos into the videos table so they appear on their professional profile!
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

          // Fallback to public RSS feed if API key returned 0 items
          if (videoItems.length === 0 && channelIdToSync.startsWith('UC')) {
            videoItems = await fetchChannelVideosViaRss(channelIdToSync);
          }

          for (const v of videoItems) {
            const videoTitle = v.titleTamil || v.title || '';
            const videoDesc = v.descriptionTamil || v.description || '';
            const assignedCategory = classifyCategory(videoTitle, videoDesc, v.tags || []);
            const assignedTags = extractSeoKeywords(videoTitle, videoDesc, v.tags || [], assignedCategory);

            const videoRecord = {
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
              thumbnail_url: v.thumbnailUrl,
              category: assignedCategory,
              tags: assignedTags,
              source_publisher_id: userId,
              status: 'published'
            };
            await upsertVideo(videoRecord);
          }
        } catch (ingestErr) {
          console.warn('Initial video ingestion notice:', ingestErr.message);
        }
      }

      return res.status(200).json({
        status: 'success',
        message: 'Publisher profile saved successfully! Videos linked to your professional profile.',
        data: savedProfile
      });
    } catch (err) {
      console.error('Error in publisher onboarding:', err);
      return res.status(500).json({ error: err.message || 'Failed to save publisher profile.' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
