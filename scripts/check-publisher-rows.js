import 'dotenv/config';
import { getPgPool } from '../lib/db.js';

async function check() {
  const pool = getPgPool();
  const res = await pool.query(`
    SELECT id, youtube_id, title_ta, title_en, category, source_publisher_id 
    FROM videos 
    WHERE source_publisher_id IS NOT NULL 
    LIMIT 5;
  `);
  console.log('Sample rows with publisher:', res.rows);
  await pool.end();
}
check();
