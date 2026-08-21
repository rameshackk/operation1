import 'dotenv/config';
import { getPgPool } from '../lib/db.js';
import { resolvePublisherYouTubeInput, fetchLatestUploadVideoIds, fetchVideoDetails } from '../lib/youtube.js';
import { classifyCategory, extractSeoKeywords } from '../lib/taxonomy.js';

async function testPublisherFlow() {
  console.log('🧪 Testing End-to-End Publisher YouTube Channel Flow...');
  const pool = getPgPool();
  if (!pool) {
    console.error('❌ Could not connect to Postgres');
    process.exit(1);
  }

  const ytApiKey = process.env.YOUTUBE_API_KEY;
  console.log('🔑 YouTube API Key exists:', !!ytApiKey);

  // 1. Test resolving channel link formats
  const testLinks = [
    'https://www.youtube.com/@budgetpadmanaban_',
    '@budgetpadmanaban_',
    'https://www.youtube.com/channel/UCWD5lYsFycgIDyCB_EHpYOQ',
    'https://www.youtube.com/watch?v=_fvxhThYO70'
  ];

  for (const link of testLinks) {
    try {
      const resolved = await resolvePublisherYouTubeInput(link, ytApiKey);
      console.log(`\n✅ Resolved Link "${link}":`);
      console.log(`   - Channel ID: ${resolved?.channelId}`);
      console.log(`   - Channel Title: ${resolved?.channelTitle}`);
      console.log(`   - Uploads Playlist: ${resolved?.uploadsPlaylistId}`);
    } catch (err) {
      console.error(`❌ Failed to resolve link "${link}":`, err.message);
    }
  }

  // 2. Check if a publisher profile in database has linked videos
  console.log('\n📊 Checking existing publisher channels in database:');
  const pubRes = await pool.query(`
    SELECT p.id, p.display_name, p.youtube_channel_id, p.youtube_channel_title, COUNT(v.id) as video_count
    FROM profiles p
    LEFT JOIN videos v ON v.source_publisher_id::text = p.id::text
    WHERE p.youtube_channel_id IS NOT NULL AND p.youtube_channel_id <> ''
    GROUP BY p.id, p.display_name, p.youtube_channel_id, p.youtube_channel_title;
  `);

  if (pubRes.rows.length === 0) {
    console.log('   No publishers with custom YouTube channels yet.');
  } else {
    pubRes.rows.forEach(p => {
      console.log(`   - Publisher "${p.display_name}" (ID: ${p.id}): ${p.video_count} videos synced | Channel: ${p.youtube_channel_title} (${p.youtube_channel_id})`);
    });
  }

  await pool.end();
  console.log('\n✨ Publisher YouTube Channel flow check completed!');
}

testPublisherFlow();
