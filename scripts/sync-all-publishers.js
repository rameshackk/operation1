import 'dotenv/config';
import { getPgPool, upsertVideo } from '../lib/db.js';
import { resolvePublisherYouTubeInput, fetchLatestUploadVideoIds, fetchVideoDetails } from '../lib/youtube.js';
import { classifyCategory, extractSeoKeywords } from '../lib/taxonomy.js';

async function syncAllPublishers() {
  console.log('🔄 Syncing All Existing Publisher YouTube Channels & Ingesting Their Videos...');
  const pool = getPgPool();
  if (!pool) {
    console.error('❌ Could not connect to Postgres');
    process.exit(1);
  }

  const ytApiKey = process.env.YOUTUBE_API_KEY;
  if (!ytApiKey) {
    console.error('❌ Missing YOUTUBE_API_KEY');
    process.exit(1);
  }

  try {
    const pubQuery = `
      SELECT id, display_name, youtube_url, youtube_channel_id
      FROM profiles
      WHERE youtube_url IS NOT NULL AND youtube_url <> '';
    `;
    const res = await pool.query(pubQuery);
    console.log(`Found ${res.rows.length} profiles with a YouTube URL to sync.`);

    for (const pub of res.rows) {
      console.log(`\n▶ Processing Publisher "${pub.display_name}" (ID: ${pub.id}) -> URL: ${pub.youtube_url}`);
      try {
        const resolved = await resolvePublisherYouTubeInput(pub.youtube_url, ytApiKey);
        if (!resolved || !resolved.channelId) {
          console.warn(`   ⚠️ Could not resolve channel for ${pub.youtube_url}`);
          continue;
        }

        console.log(`   ✓ Resolved Channel: "${resolved.channelTitle}" (ID: ${resolved.channelId}, Playlist: ${resolved.uploadsPlaylistId})`);

        // Update profile with resolved channel details
        await pool.query(`
          UPDATE profiles
          SET youtube_channel_id = $1,
              youtube_channel_title = $2,
              youtube_channel_thumbnail = $3,
              youtube_channel_verified = true,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $4;
        `, [resolved.channelId, resolved.channelTitle, resolved.channelThumbnail, pub.id]);

        // Fetch latest videos for this publisher channel
        const videoIds = await fetchLatestUploadVideoIds(resolved.uploadsPlaylistId, ytApiKey, 12);
        console.log(`   ✓ Found ${videoIds.length} recent uploads from channel`);

        if (videoIds.length > 0) {
          const videoDetails = await fetchVideoDetails(videoIds, ytApiKey);
          let ingestedCount = 0;

          for (const v of videoDetails) {
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
              duration: v.duration,
              duration_seconds: v.durationSeconds || 0,
              view_count: v.viewCount || 0,
              is_short: v.isShort || false,
              thumbnail_url: v.thumbnailUrl,
              category: assignedCategory,
              tags: assignedTags,
              source_publisher_id: pub.id,
              status: 'published'
            };
            await upsertVideo(videoRecord);
            ingestedCount++;
          }
          console.log(`   🎉 Successfully ingested & linked ${ingestedCount} videos to publisher "${pub.display_name}"!`);
        }

      } catch (pubErr) {
        console.error(`   ❌ Error syncing publisher ${pub.display_name}:`, pubErr.message);
      }
    }

    console.log('\n✅ All publisher YouTube channels synced and videos attached to their profile pages!');
  } catch (err) {
    console.error('❌ Error during publisher sync:', err);
  } finally {
    await pool.end();
  }
}

syncAllPublishers();
