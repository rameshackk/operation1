import { getPgPool } from '../lib/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function migrateArticleImages() {
  console.log('Running article images sanitization & migration...');
  const pool = getPgPool();
  if (pool) {
    try {
      const res = await pool.query('SELECT id, slug, cover_image_url, category FROM articles');
      let migratedCount = 0;

      for (const row of res.rows) {
        if (row.cover_image_url && row.cover_image_url.startsWith('data:image')) {
          console.log(`Found base64 image in article: ${row.slug}`);
          const cat = (row.category || '').toLowerCase();
          let fallbackUrl = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80&auto=format&fit=crop';
          if (cat.includes('mutual') || cat.includes('sip')) {
            fallbackUrl = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80&auto=format&fit=crop';
          } else if (cat.includes('personal') || cat.includes('finance')) {
            fallbackUrl = 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80&auto=format&fit=crop';
          }

          await pool.query('UPDATE articles SET cover_image_url = $1 WHERE id = $2', [fallbackUrl, row.id]);
          migratedCount++;
        }
      }

      console.log(`Migration complete. Updated ${migratedCount} base64 article images via Postgres.`);
      return;
    } catch (err) {
      console.warn('Postgres migration error:', err.message);
    }
  }

  const { supabaseAdmin, supabaseAnon } = await import('../lib/supabase.js');
  const client = supabaseAdmin || supabaseAnon;
  if (client) {
    try {
      const { data: rows, error } = await client.from('articles').select('id, slug, cover_image_url, category');
      if (error) throw error;
      let migratedCount = 0;
      for (const row of rows || []) {
        if (row.cover_image_url && row.cover_image_url.startsWith('data:image')) {
          console.log(`Found base64 image in article: ${row.slug}`);
          const cat = (row.category || '').toLowerCase();
          let fallbackUrl = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80&auto=format&fit=crop';
          if (cat.includes('mutual') || cat.includes('sip')) {
            fallbackUrl = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80&auto=format&fit=crop';
          } else if (cat.includes('personal') || cat.includes('finance')) {
            fallbackUrl = 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80&auto=format&fit=crop';
          }

          await client.from('articles').update({ cover_image_url: fallbackUrl }).eq('id', row.id);
          migratedCount++;
        }
      }
      console.log(`Migration complete. Updated ${migratedCount} base64 article images via Supabase Client.`);
    } catch (err) {
      console.warn('Supabase migration error:', err.message);
    }
  }
}

migrateArticleImages().catch(console.error);
