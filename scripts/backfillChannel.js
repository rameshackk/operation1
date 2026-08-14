import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveChannelId, fetchAllUploadVideoIds, fetchVideoDetails } from '../lib/youtube.js';
import { translateText } from '../lib/translate.js';
import { upsertVideo, getPgPool } from '../lib/db.js';
import { supabaseAdmin } from '../lib/supabase.js';

// Native .env loader (zero external dependencies)
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

/**
 * YouTube Channel One-Time Backfill Script
 * Usage:
 *   node scripts/backfillChannel.js
 *   node scripts/backfillChannel.js --titles-only
 */

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@budgetpadmanaban_';
const TRANSLATE_API_KEY = process.env.TRANSLATE_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY;
const IS_TITLES_ONLY = process.argv.includes('--titles-only');

// Helper sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getExistingTranslatedMap() {
  const map = new Map();
  try {
    const pool = getPgPool();
    if (pool) {
      const res = await pool.query('SELECT youtube_id, translated_at, title_en, description_en FROM videos');
      for (const row of res.rows) {
        map.set(row.youtube_id, {
          isTranslated: !!row.translated_at,
          titleEn: row.title_en,
          descriptionEn: row.description_en
        });
      }
      return map;
    }
  } catch (err) {
    console.warn('   ⚠️ Direct PG query skipped, checking Supabase Admin...');
  }

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('videos')
        .select('youtube_id, translated_at, title_en, description_en');
      if (!error && data) {
        for (const row of data) {
          map.set(row.youtube_id, {
            isTranslated: !!row.translated_at,
            titleEn: row.title_en,
            descriptionEn: row.description_en
          });
        }
      }
    } catch (err) {
      console.warn('   ⚠️ Supabase query warning:', err.message);
    }
  }

  return map;
}

async function runBackfill() {
  console.log('====================================================');
  console.log('🚀 Starting YouTube Channel One-Time Backfill');
  console.log(`📌 Channel Handle: ${CHANNEL_HANDLE}`);
  console.log(`🌐 Titles Only Mode: ${IS_TITLES_ONLY ? 'ENABLED (--titles-only)' : 'DISABLED (Full Titles + Descriptions)'}`);
  console.log('====================================================\n');

  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
    console.error('❌ Error: Valid YOUTUBE_API_KEY environment variable is required in .env');
    console.log('👉 Please set your YouTube Data API v3 key in .env (YOUTUBE_API_KEY=AIzaSy...)');
    process.exit(1);
  }

  // PART 1 — RESOLVE THE CHANNEL HANDLE
  console.log(`[Step 1/5] Resolving channel handle "${CHANNEL_HANDLE}"...`);
  const channelInfo = await resolveChannelId(CHANNEL_HANDLE, YOUTUBE_API_KEY);
  console.log(`   ✅ Resolved Channel: "${channelInfo.channelTitle}"`);
  console.log(`   🆔 Channel ID: ${channelInfo.channelId}`);
  console.log(`   📁 Uploads Playlist ID: ${channelInfo.uploadsPlaylistId}\n`);

  // PART 2 — COLLECT ALL HISTORICAL VIDEO IDs
  console.log(`[Step 2/5] Paginating through uploads playlist to collect all video IDs...`);
  const allVideoIds = await fetchAllUploadVideoIds(channelInfo.uploadsPlaylistId, YOUTUBE_API_KEY, 100);
  console.log(`   ✅ Found ${allVideoIds.length} total videos across full channel history.\n`);

  if (allVideoIds.length === 0) {
    console.log('⚠️ No videos found in uploads playlist. Exiting.');
    process.exit(0);
  }

  // PART 3 — FETCH FULL METADATA IN BATCHES OF 50
  console.log(`[Step 3/5] Fetching video metadata (snippet, duration, stats) in batches of 50...`);
  const BATCH_SIZE = 50;
  const allVideos = [];

  for (let i = 0; i < allVideoIds.length; i += BATCH_SIZE) {
    const batchIds = allVideoIds.slice(i, i + BATCH_SIZE);
    const videoBatch = await fetchVideoDetails(batchIds, YOUTUBE_API_KEY);
    allVideos.push(...videoBatch);
    console.log(`   📦 Fetched metadata for ${allVideos.length}/${allVideoIds.length} videos...`);
  }
  console.log(`   ✅ Successfully loaded metadata for ${allVideos.length} videos.\n`);

  // PART 4 — COST AWARENESS & QUOTA ESTIMATION
  console.log(`[Step 4/5] Analyzing character volume for Translation Cost Awareness...`);
  let totalTitleChars = 0;
  let totalDescChars = 0;

  for (const v of allVideos) {
    totalTitleChars += (v.titleTamil || '').length;
    totalDescChars += (v.descriptionTamil || '').length;
  }

  const totalCharsEstimated = IS_TITLES_ONLY ? totalTitleChars : (totalTitleChars + totalDescChars);
  const freeTierLimit = 500000;

  console.log(`   📊 Total Titles Volume: ~${totalTitleChars.toLocaleString()} characters`);
  console.log(`   📊 Total Descriptions Volume: ~${totalDescChars.toLocaleString()} characters`);
  console.log(`   📊 Planned Translation Volume: ~${totalCharsEstimated.toLocaleString()} characters`);
  console.log(`   ℹ️  Google Cloud Translation free tier is 500,000 chars/month.`);

  if (totalCharsEstimated > freeTierLimit) {
    console.log(`   ⚠️ NOTICE: Estimated characters (${totalCharsEstimated.toLocaleString()}) exceed free tier (${freeTierLimit.toLocaleString()}).`);
    if (!IS_TITLES_ONLY) {
      console.log(`   💡 Tip: You can run with '--titles-only' to translate titles first and let the cron catch up descriptions.`);
    }
  } else {
    console.log(`   ✅ Estimated characters are comfortably within the free tier!`);
  }
  console.log('');

  // Check already existing videos to allow resumable execution
  const existingMap = await getExistingTranslatedMap();
  console.log(`   💾 Database state: ${existingMap.size} videos already recorded in DB.`);

  // PART 5 — IMMEDIATE INSERTION + RATE-LIMITED RESUMABLE TRANSLATION
  console.log(`\n[Step 5/5] Inserting/Upserting videos and translating...`);

  let insertedCount = 0;
  let translatedCount = 0;
  let skippedCount = 0;
  let failedTranslations = 0;

  for (let idx = 0; idx < allVideos.length; idx++) {
    const video = allVideos[idx];
    const existing = existingMap.get(video.youtubeId);

    // 1. Immediate Upsert of Source Tamil Content so it's instantly available
    if (existing?.isTranslated) {
      video.titleEnglish = existing.titleEn;
      video.descriptionEnglish = existing.descriptionEn;
      video.translatedAt = new Date().toISOString();
    }

    try {
      await upsertVideo(video);
      insertedCount++;
    } catch (dbErr) {
      console.error(`   ❌ Failed to upsert video ${video.youtubeId}:`, dbErr.message);
      continue;
    }

    // 2. Check if already translated (Resumable check)
    if (existing?.isTranslated) {
      skippedCount++;
      continue;
    }

    // 3. Perform translation if API key is provided
    if (TRANSLATE_API_KEY && TRANSLATE_API_KEY !== 'YOUR_GOOGLE_TRANSLATE_API_KEY') {
      try {
        const titleEn = await translateText(video.titleTamil, TRANSLATE_API_KEY);
        let descEn = null;

        if (!IS_TITLES_ONLY && video.descriptionTamil) {
          descEn = await translateText(video.descriptionTamil, TRANSLATE_API_KEY);
        }

        video.titleEnglish = titleEn;
        video.descriptionEnglish = descEn;
        video.translatedAt = new Date().toISOString();

        await upsertVideo(video);
        translatedCount++;

        // Rate limiting delay (100ms) to prevent translation API throttling
        await sleep(100);
      } catch (trErr) {
        failedTranslations++;
        console.warn(`   ⚠️ Translation failed for ${video.youtubeId} (${video.titleTamil.slice(0, 30)}...): ${trErr.message}`);
      }
    }

    if ((idx + 1) % 50 === 0 || idx + 1 === allVideos.length) {
      console.log(`   📈 Progress: Processed ${idx + 1}/${allVideos.length} videos (Translated: ${translatedCount}, Skipped: ${skippedCount}, Failed: ${failedTranslations})`);
    }
  }

  // FINAL SUMMARY
  console.log('\n====================================================');
  console.log('🎉 One-Time YouTube Backfill Complete!');
  console.log(`📹 Total Channel Videos Found: ${allVideos.length}`);
  console.log(`💾 Total Videos Upserted: ${insertedCount}`);
  console.log(`🌐 Newly Translated: ${translatedCount}`);
  console.log(`⏩ Skipped (Already Translated): ${skippedCount}`);
  console.log(`⚠️ Translation Failures: ${failedTranslations} (will be retried automatically by ongoing cron)`);
  console.log('====================================================\n');
  process.exit(0);
}

runBackfill().catch((err) => {
  console.error('💥 Fatal error in backfillChannel:', err);
  process.exit(1);
});
