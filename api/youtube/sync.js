import { getPgPool } from '../../lib/db.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import { verifyAdminRequest } from '../../lib/auth-server.js';
import {
  parseIsoDuration,
  checkIfShort,
  enrichVideoWithGemini,
  getAppSetting,
  setAppSetting
} from '../../lib/youtube.js';

export const config = {
  maxDuration: 60 // Allow up to 60s for serverless execution
};

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const syncSecret = process.env.SYNC_SECRET || 'muthaleetu_sync_secure_key_2026';
  const providedSecret = 
    req.headers['x-sync-secret'] || 
    (req.headers['authorization']?.startsWith('Bearer ') ? req.headers['authorization'].slice(7) : null) ||
    req.query.secret;

  const isVercelCron = req.headers['x-vercel-cron'] || (process.env.CRON_SECRET && req.headers['authorization'] === `Bearer ${process.env.CRON_SECRET}`);

  let isAuthorized = false;
  if (isVercelCron || (providedSecret && providedSecret === syncSecret)) {
    isAuthorized = true;
  } else {
    // Check if called by authenticated admin user
    const adminAuth = await verifyAdminRequest(req);
    if (adminAuth.authorized) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing sync secret' });
  }

  const apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || process.env.TRANSLATE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing YOUTUBE_API_KEY environment variable' });
  }

  const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE || '@budgetpadmanaban_';
  const isFullMode = req.query.full === '1' || req.query.full === 'true';
  const shouldResubscribe = req.query.resubscribe === '1' || isFullMode;
  const targetVideoId = req.query.video_id; // Single video sync support for WebSub push

  const pool = getPgPool();
  let newCount = 0;
  let updatedCount = 0;
  let syncError = null;

  try {
    // 1. Resolve Channel and Uploads Playlist
    let channelInfo = await getAppSetting('youtube_channel_info');
    let channelId = channelInfo?.channelId;
    let uploadsPlaylistId = channelInfo?.uploadsPlaylistId;

    if (!channelId || !uploadsPlaylistId || isFullMode) {
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(channelHandle)}&key=${apiKey}`
      );
      if (!channelRes.ok) {
        const errBody = await channelRes.text();
        throw new Error(`YouTube channels API returned ${channelRes.status}: ${errBody}`);
      }
      const channelData = await channelRes.json();
      if (!channelData.items || channelData.items.length === 0) {
        throw new Error(`Channel not found for handle ${channelHandle}`);
      }
      channelId = channelData.items[0].id;
      uploadsPlaylistId = channelData.items[0].contentDetails?.relatedPlaylists?.uploads;
      
      await setAppSetting('youtube_channel_info', {
        channelId,
        uploadsPlaylistId,
        title: channelData.items[0].snippet?.title,
        updatedAt: new Date().toISOString()
      });
    }

    // 2. Fetch Playlist Items
    let candidateVideoIds = [];
    if (targetVideoId) {
      candidateVideoIds = [targetVideoId];
    } else {
      let pageToken = '';
      let keepPaging = true;
      let pageCount = 0;
      const MAX_PAGES = isFullMode ? 30 : 2; // Up to 1500 videos in full mode, 100 in incremental

      // Get existing video IDs from DB to check for incremental stop
      let existingIdsSet = new Set();
      if (pool) {
        const existingRes = await pool.query('SELECT video_id FROM public.youtube_videos ORDER BY published_at DESC LIMIT 200');
        existingIdsSet = new Set(existingRes.rows.map(r => r.video_id));
      }

      while (keepPaging && pageCount < MAX_PAGES) {
        pageCount++;
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&playlistId=${uploadsPlaylistId}&maxResults=50${pageToken ? `&pageToken=${pageToken}` : ''}&key=${apiKey}`;
        const playlistRes = await fetch(playlistUrl);
        if (!playlistRes.ok) {
          throw new Error(`playlistItems API failed: ${playlistRes.status}`);
        }
        const playlistData = await playlistRes.json();
        const items = playlistData.items || [];
        if (items.length === 0) break;

        let foundExistingInBatch = false;
        for (const item of items) {
          const vId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
          if (vId) {
            candidateVideoIds.push(vId);
            if (!isFullMode && existingIdsSet.has(vId)) {
              foundExistingInBatch = true;
            }
          }
        }

        if (!isFullMode && foundExistingInBatch) {
          // Stop incremental paging
          break;
        }

        pageToken = playlistData.nextPageToken || '';
        if (!pageToken) break;
      }

      // Also refresh the 50 most recent videos in database to keep view counts up to date
      if (pool && !isFullMode) {
        const recentRes = await pool.query('SELECT video_id FROM public.youtube_videos ORDER BY published_at DESC LIMIT 50');
        for (const row of recentRes.rows) {
          candidateVideoIds.push(row.video_id);
        }
      }
    }

    // Deduplicate candidate IDs
    const uniqueVideoIds = [...new Set(candidateVideoIds)].filter(Boolean);

    // 3. Batch Fetch Detailed Video Metadata (50 at a time)
    const batches = [];
    for (let i = 0; i < uniqueVideoIds.length; i += 50) {
      batches.push(uniqueVideoIds.slice(i, i + 50));
    }

    for (const batch of batches) {
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,liveStreamingDetails&id=${batch.join(',')}&key=${apiKey}`;
      const videosRes = await fetch(videosUrl);
      if (!videosRes.ok) {
        console.warn('[Sync] videos.list failed for batch:', videosRes.status);
        continue;
      }
      const videosData = await videosRes.json();
      const videoItems = videosData.items || [];

      for (const item of videoItems) {
        const videoId = item.id;
        const snippet = item.snippet || {};
        const contentDetails = item.contentDetails || {};
        const statistics = item.statistics || {};
        const liveStreaming = item.liveStreamingDetails || null;

        const title = snippet.title || 'Untitled Video';
        const description = snippet.description || '';
        const publishedAt = snippet.publishedAt || new Date().toISOString();
        const durationSeconds = parseIsoDuration(contentDetails.duration);
        const viewCount = parseInt(statistics.viewCount || '0', 10);
        const likeCount = statistics.likeCount ? parseInt(statistics.likeCount, 10) : null;
        const tags = Array.isArray(snippet.tags) ? snippet.tags : [];

        // Best available thumbnail
        const thumbs = snippet.thumbnails || {};
        const thumbnailUrl =
          thumbs.maxres?.url ||
          thumbs.standard?.url ||
          thumbs.high?.url ||
          thumbs.medium?.url ||
          thumbs.default?.url ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        // Live / Premiere status
        const isLive = snippet.liveBroadcastContent === 'live' || snippet.liveBroadcastContent === 'upcoming' || !!liveStreaming;

        // Shorts detection
        const isShort = await checkIfShort(videoId, durationSeconds);

        // Check existing record
        let existingRecord = null;
        if (pool) {
          const checkRes = await pool.query(
            'SELECT video_id, category, category_locked, is_hidden, is_pinned, ai_summary_ta, ai_summary_en FROM public.youtube_videos WHERE video_id = $1',
            [videoId]
          );
          if (checkRes.rows.length > 0) {
            existingRecord = checkRes.rows[0];
          }
        }

        let category = existingRecord?.category || 'Mutual Funds';
        let aiSummaryTa = existingRecord?.ai_summary_ta || null;
        let aiSummaryEn = existingRecord?.ai_summary_en || null;

        // Perform Gemini AI enrichment if new video or missing summary
        if (!existingRecord || (!aiSummaryTa && !aiSummaryEn)) {
          const enrichment = await enrichVideoWithGemini(title, description);
          if (!existingRecord?.category_locked) {
            category = enrichment.category;
          }
          if (!aiSummaryTa) aiSummaryTa = enrichment.summary_ta;
          if (!aiSummaryEn) aiSummaryEn = enrichment.summary_en;
        }

        // Upsert video into database
        if (pool) {
          const upsertQuery = `
            INSERT INTO public.youtube_videos (
              video_id, channel_id, title, description, published_at,
              duration_seconds, view_count, like_count, thumbnail_url,
              is_short, is_live, category, tags, ai_summary_ta, ai_summary_en,
              synced_at
            ) VALUES (
              $1, $2, $3, $4, $5,
              $6, $7, $8, $9,
              $10, $11, $12, $13, $14, $15,
              now()
            )
            ON CONFLICT (video_id) DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              duration_seconds = EXCLUDED.duration_seconds,
              view_count = EXCLUDED.view_count,
              like_count = EXCLUDED.like_count,
              thumbnail_url = EXCLUDED.thumbnail_url,
              is_short = EXCLUDED.is_short,
              is_live = EXCLUDED.is_live,
              category = CASE WHEN youtube_videos.category_locked THEN youtube_videos.category ELSE EXCLUDED.category END,
              tags = EXCLUDED.tags,
              ai_summary_ta = COALESCE(youtube_videos.ai_summary_ta, EXCLUDED.ai_summary_ta),
              ai_summary_en = COALESCE(youtube_videos.ai_summary_en, EXCLUDED.ai_summary_en),
              synced_at = now()
            RETURNING (xmax = 0) AS is_insert;
          `;

          const upsertRes = await pool.query(upsertQuery, [
            videoId,
            channelId,
            title,
            description,
            publishedAt,
            durationSeconds,
            viewCount,
            likeCount,
            thumbnailUrl,
            isShort,
            isLive,
            category,
            tags,
            aiSummaryTa,
            aiSummaryEn
          ]);

          if (upsertRes.rows?.[0]?.is_insert) {
            newCount++;
          } else {
            updatedCount++;
          }
        }
      }
    }

    // 4. WebSub Re-subscription (PubSubHubbub)
    if (shouldResubscribe && channelId) {
      try {
        const callbackUrl = 'https://www.muthaleetuthisai.com/api/youtube/websub';
        const topicUrl = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`;
        const formData = new URLSearchParams({
          'hub.callback': callbackUrl,
          'hub.topic': topicUrl,
          'hub.mode': 'subscribe',
          'hub.lease_seconds': '828000'
        });

        await fetch('https://pubsubhubbub.appspot.com/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });
        console.log('[Sync] WebSub subscribed successfully for channel:', channelId);
      } catch (wsErr) {
        console.warn('[Sync] WebSub subscription warning:', wsErr.message);
      }
    }

    // 5. Log to youtube_sync_log
    if (pool) {
      await pool.query(
        'INSERT INTO public.youtube_sync_log (source, new_count, updated_count, error) VALUES ($1, $2, $3, $4)',
        [req.query.source || (isFullMode ? 'manual-full' : (targetVideoId ? 'websub' : 'cron')), newCount, updatedCount, null]
      );
    }

    return res.status(200).json({
      status: 'success',
      new: newCount,
      updated: updatedCount,
      totalProcessed: uniqueVideoIds.length,
      isFullMode,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    syncError = error.message;
    console.error('❌ Error in YouTube sync:', error);

    if (pool) {
      try {
        await pool.query(
          'INSERT INTO public.youtube_sync_log (source, new_count, updated_count, error) VALUES ($1, $2, $3, $4)',
          ['error', newCount, updatedCount, syncError]
        );
      } catch {}
    }

    return res.status(500).json({
      status: 'error',
      error: 'YouTube synchronization failed',
      message: error.message
    });
  }
}
