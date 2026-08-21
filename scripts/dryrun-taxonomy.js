import 'dotenv/config';
import { getPgPool } from '../lib/db.js';
import { classifyCategory, extractSeoKeywords, stripBoilerplate } from '../lib/taxonomy.js';

const pool = getPgPool();
const res = await pool.query(`
  SELECT youtube_id, title_ta, description_ta, tags, category, duration_seconds, view_count
  FROM videos ORDER BY view_count DESC;
`);

// Corpus-derived stoplist: a tag on more than a quarter of the catalog cannot
// discriminate between videos, whatever it says.
const total = res.rows.length;
const freq = new Map();
for (const r of res.rows) {
  for (const t of new Set((r.tags || []).map(x => String(x).toLowerCase().trim()))) {
    if (t) freq.set(t, (freq.get(t) || 0) + 1);
  }
}
const corpusStoplist = new Set([...freq.entries()].filter(([, c]) => c / total > 0.25).map(([t]) => t));
console.log(`Corpus-derived stoplist (>25% of catalog): ${corpusStoplist.size} tags\n`);

const dist = {};
const samples = {};
let moved = 0;
let noKeywords = 0;

for (const r of res.rows) {
  const next = classifyCategory(r.title_ta, r.description_ta, r.tags || [], corpusStoplist);
  const kw = extractSeoKeywords(r.title_ta, r.description_ta, r.tags || [], next, corpusStoplist);
  dist[next] = (dist[next] || 0) + 1;
  if (next !== r.category) moved++;
  if (kw.length === 0) noKeywords++;
  if (!samples[next]) samples[next] = [];
  if (samples[next].length < 5) samples[next].push({ title: r.title_ta, kw });
}

console.log(`=== NEW DISTRIBUTION (${total} videos) ===`);
Object.entries(dist).sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
  console.log(`  ${k.padEnd(18)} ${String(v).padStart(4)}  (${(v / total * 100).toFixed(1)}%)`)
);
console.log(`\nRecategorised: ${moved} / ${total}`);
console.log(`Videos with zero keywords: ${noKeywords}`);

console.log('\n=== SAMPLES PER CATEGORY ===');
for (const [cat, list] of Object.entries(samples)) {
  console.log(`\n--- ${cat} ---`);
  list.forEach(s => {
    console.log(`  ${s.title.slice(0, 64)}`);
    console.log(`     kw: ${s.kw.slice(0, 9).join(', ')}`);
  });
}

await pool.end();
