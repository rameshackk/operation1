import dotenv from 'dotenv';
dotenv.config();

import { getPgPool } from '../lib/db.js';
import {
  parseIsoDuration,
  checkIfShort,
  enrichVideoWithGemini,
  setAppSetting
} from '../lib/youtube.js';

const apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || process.env.TRANSLATE_API_KEY;
const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE || '@budgetpadmanaban_';

async function runFullSync() {
  const pool = getPgPool();
  if (!pool) {
    console.error('No PostgreSQL pool available');
    process.exit(1);
  }

  console.log(`🚀 Starting Full YouTube Sync for ${channelHandle}...`);

  try {
    // 1. Resolve Channel
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(channelHandle)}&key=${apiKey}`
    );
    const channelData = await channelRes.json();
    const channelItem = channelData.items?.[0];
    if (!channelItem) {
      throw new Error('Channel not found');
    }
    const channelId = channelItem.id;
    const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;
    console.log(`✅ Channel: "${channelItem.snippet?.title}" (ID: ${channelId})`);
    console.log(`✅ Uploads Playlist: ${uploadsPlaylistId}`);

    await setAppSetting('youtube_channel_info', {
      channelId,
      uploadsPlaylistId,
      title: channelItem.snippet?.title,
      updatedAt: new Date().toISOString()
    });

    // 2. Page all videos
    let pageToken = '';
    const allVideoIds = [];
    let page = 1;

    while (true) {
      console.log(`Fetching playlist page ${page}...`);
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&playlistId=${uploadsPlaylistId}&maxResults=50${pageToken ? `&pageToken=${pageToken}` : ''}&key=${apiKey}`;
      const playlistRes = await fetch(playlistUrl);
      const playlistData = await playlistRes.json();
      const items = playlistData.items || [];
      if (items.length === 0) break;

      for (const item of items) {
        const vId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
        if (vId) allVideoIds.push(vId);
      }

      pageToken = playlistData.nextPageToken || '';
      if (!pageToken) break;
      page++;
    }

    const uniqueIds = [...new Set(allVideoIds)];
    console.log(`✅ Collected ${uniqueIds.length} total videos from channel.`);

    // 3. Batch fetch in chunks of 50
    let insertedCount = 0;
    let updatedCount = 0;

    for (let i = 0; i < uniqueIds.length; i += 50) {
      const batch = uniqueIds.slice(i, i + 50);
      console.log(`Processing batch ${i + 1} to ${i + batch.length} of ${uniqueIds.length}...`);

      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,liveStreamingDetails&id=${batch.join(',')}&key=${apiKey}`;
      const videosRes = await fetch(videosUrl);
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

        const thumbs = snippet.thumbnails || {};
        const thumbnailUrl =
          thumbs.maxres?.url ||
          thumbs.standard?.url ||
          thumbs.high?.url ||
          thumbs.medium?.url ||
          thumbs.default?.url ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        const isLive = snippet.liveBroadcastContent === 'live' || snippet.liveBroadcastContent === 'upcoming' || !!liveStreaming;
        const isShort = await checkIfShort(videoId, durationSeconds);

        // Simple default category categorization for fast bulk backfill, or Gemini for first batch
        let category = 'Mutual Funds';
        const tLower = title.toLowerCase();
        if (tLower.includes('sip') || tLower.includes('plan')) category = 'SIP & Planning';
        else if (tLower.includes('stock') || tLower.includes('nifty') || tLower.includes('sensex') || tLower.includes('share') || tLower.includes('ipo')) category = 'Stock Market';
        else if (tLower.includes('insurance') || tLower.includes('term') || tLower.includes('lic')) category = 'Insurance';
        else if (tLower.includes('retire') || tLower.includes('nps') || tLower.includes('epf') || tLower.includes('pension')) category = 'Retirement';
        else if (tLower.includes('gold') || tLower.includes('sgb') || tLower.includes('bond')) category = 'Gold & Bonds';
        else if (tLower.includes('tax') || tLower.includes('80c') || tLower.includes('it return')) category = 'Tax';
        else if (tLower.includes('child') || tLower.includes('education') || tLower.includes('marriage')) category = 'Children & Education';

        const upsertQuery = `
          INSERT INTO public.youtube_videos (
            video_id, channel_id, title, description, published_at,
            duration_seconds, view_count, like_count, thumbnail_url,
            is_short, is_live, category, tags,
            synced_at
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9,
            $10, $11, $12, $13,
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
          tags
        ]);

        if (upsertRes.rows?.[0]?.is_insert) insertedCount++;
        else updatedCount++;
      }
    }

    // 4. Log to sync log
    await pool.query(
      'INSERT INTO public.youtube_sync_log (source, new_count, updated_count, error) VALUES ($1, $2, $3, $4)',
      ['initial-backfill', insertedCount, updatedCount, null]
    );

    console.log(`🎉 Full Sync Finished! Inserted: ${insertedCount}, Updated: ${updatedCount}, Total: ${uniqueIds.length}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Full sync error:', err);
    process.exit(1);
  }
}

runFullSync();
