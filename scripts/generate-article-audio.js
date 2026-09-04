import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { getPgPool } from '../lib/db.js';
import { generateArticleAudio } from '../lib/tts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const rawTranslate = process.env.TRANSLATE_API_KEY || '';
const rawYoutube = process.env.YOUTUBE_API_KEY || '';
const apiKey = (rawTranslate && !rawTranslate.startsWith('YOUR_')) ? rawTranslate : ((rawYoutube && !rawYoutube.startsWith('YOUR_')) ? rawYoutube : '');

async function run() {
  console.log('🎙️ Starting Article Audio Generation Pipeline...');
  const args = process.argv.slice(2);
  const targetSlug = args.find(a => a.startsWith('--slug='))?.split('=')[1];
  const force = args.includes('--force');

  const pgPool = getPgPool();
  if (!pgPool) {
    console.error('❌ PostgreSQL connection not available');
    process.exit(1);
  }

  // Ensure columns exist in database
  try {
    await pgPool.query(`
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS audio_url_ta TEXT;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS audio_url_en TEXT;
    `);
    console.log('✅ Database schema verified: audio_url_ta, audio_url_en columns ready.');
  } catch (err) {
    console.warn('⚠️ Notice verifying schema:', err.message);
  }

  // Fetch articles
  let query = `SELECT * FROM articles WHERE status = 'published'`;
  const params = [];
  if (targetSlug) {
    query += ` AND slug = $1`;
    params.push(targetSlug);
  } else if (!force) {
    query += ` AND (audio_url_ta IS NULL OR audio_url_en IS NULL)`;
  }

  const { rows: articles } = await pgPool.query(query, params);
  console.log(`📋 Found ${articles.length} article(s) to process.`);

  for (const article of articles) {
    console.log(`\n⏳ Generating audio for: "${article.title_ta || article.title_en}" (${article.slug})...`);
    try {
      const audioResults = await generateArticleAudio(article, apiKey);
      console.log(`   🔊 Tamil Audio:   ${audioResults.audioUrlTa || 'None'}`);
      console.log(`   🔊 English Audio: ${audioResults.audioUrlEn || 'None'}`);

      if (audioResults.audioUrlTa || audioResults.audioUrlEn) {
        await pgPool.query(
          `UPDATE articles 
           SET audio_url_ta = COALESCE($1, audio_url_ta),
               audio_url_en = COALESCE($2, audio_url_en),
               updated_at = NOW()
           WHERE id = $3`,
          [audioResults.audioUrlTa, audioResults.audioUrlEn, article.id]
        );
        console.log(`   ✅ Successfully updated database for ${article.slug}`);
      }
    } catch (err) {
      console.error(`   ❌ Failed for ${article.slug}:`, err.message);
    }
  }

  console.log('\n🎉 Audio generation completed.');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error running audio pipeline:', err);
  process.exit(1);
});
