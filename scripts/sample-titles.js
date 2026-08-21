import 'dotenv/config';
import { getPgPool } from '../lib/db.js';

const pool = getPgPool();
const res = await pool.query(`
  SELECT title_ta, category, duration_seconds
  FROM videos
  WHERE status = 'published'
  ORDER BY view_count DESC
  LIMIT 70;
`);
res.rows.forEach(r => console.log(`[${r.category.padEnd(17)}|${String(r.duration_seconds).padStart(5)}s] ${r.title_ta}`));

const boiler = await pool.query(`SELECT description_ta FROM videos WHERE status='published' AND length(description_ta) > 100 LIMIT 2;`);
console.log('\n===== SAMPLE DESCRIPTION (boilerplate check) =====');
boiler.rows.forEach(r => console.log('---\n' + r.description_ta.slice(0, 700)));

await pool.end();
