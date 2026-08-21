import 'dotenv/config';
import { getPgPool } from '../lib/db.js';
import { classifyCategory, extractSeoKeywords } from '../lib/taxonomy.js';

async function runBackfill() {
  console.log('🚀 Starting Taxonomy & SEO Backfill for Videos...');
  const pool = getPgPool();
  if (!pool) {
    console.error('❌ Could not acquire PostgreSQL connection pool.');
    process.exit(1);
  }

  try {
    const fetchRes = await pool.query(`
      SELECT id, youtube_id, title_ta, title_en, description_ta, description_en, tags, category
      FROM videos;
    `);

    const total = fetchRes.rows.length;
    console.log(`📊 Found ${total} total videos to analyze and recategorize.`);

    let updatedCount = 0;
    const categoryCounts = {};

    for (let i = 0; i < total; i++) {
      const row = fetchRes.rows[i];
      const title = row.title_ta || row.title_en || '';
      const description = row.description_ta || row.description_en || '';
      const currentTags = Array.isArray(row.tags) ? row.tags : [];

      const newCategory = classifyCategory(title, description, currentTags);
      const newTags = extractSeoKeywords(title, description, currentTags, newCategory);

      categoryCounts[newCategory] = (categoryCounts[newCategory] || 0) + 1;

      await pool.query(`
        UPDATE videos
        SET category = $1, tags = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3;
      `, [newCategory, newTags, row.id]);

      updatedCount++;
      if (updatedCount % 100 === 0 || updatedCount === total) {
        console.log(`   ⏳ Processed ${updatedCount}/${total} videos...`);
      }
    }

    console.log('\n✅ Successfully backfilled all videos!');
    console.log('📈 Category Distribution:');
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      const pct = ((count / total) * 100).toFixed(1);
      console.log(`   - ${cat.padEnd(20)}: ${count} (${pct}%)`);
    });

  } catch (err) {
    console.error('❌ Error during taxonomy backfill:', err);
  } finally {
    await pool.end();
  }
}

runBackfill();
