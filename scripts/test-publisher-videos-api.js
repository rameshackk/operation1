import 'dotenv/config';
import { getPgPool } from '../lib/db.js';

async function testPublisherApi() {
  console.log('🔍 Testing Publisher API Video Endpoint...');
  const pool = getPgPool();
  if (!pool) {
    console.error('❌ Could not connect to database');
    process.exit(1);
  }

  // Check budget-padmanaban or founder profile
  const pubQuery = `
    SELECT p.id, p.display_name, p.role, p.youtube_url, p.youtube_channel_id,
           COALESCE(vid.video_count, 0) as video_count
    FROM profiles p
    LEFT JOIN (
      SELECT source_publisher_id, COUNT(*) as video_count
      FROM videos
      WHERE status = 'published'
      GROUP BY source_publisher_id
    ) vid ON p.id::text = vid.source_publisher_id::text
    LIMIT 5;
  `;
  const res = await pool.query(pubQuery);
  console.log('Found profiles:', res.rows);

  await pool.end();
  console.log('✅ Publisher API verification complete!');
}

testPublisherApi();
