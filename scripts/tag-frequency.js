import 'dotenv/config';
import { getPgPool } from '../lib/db.js';

const pool = getPgPool();
const res = await pool.query(`SELECT tags FROM videos;`);
const total = res.rows.length;
const freq = new Map();

for (const r of res.rows) {
  for (const t of new Set((r.tags || []).map(x => String(x).toLowerCase().trim()))) {
    if (t) freq.set(t, (freq.get(t) || 0) + 1);
  }
}

const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
console.log(`Total videos: ${total}, distinct tags: ${sorted.length}\n`);
console.log('=== TAGS ON >5% OF VIDEOS (no discriminating signal) ===');
sorted.filter(([, c]) => c / total > 0.05).forEach(([t, c]) =>
  console.log(`  ${String(c).padStart(4)} (${(c / total * 100).toFixed(1)}%)  ${t}`)
);
console.log(`\nTags appearing on exactly 1 video: ${sorted.filter(([, c]) => c === 1).length}`);
await pool.end();
