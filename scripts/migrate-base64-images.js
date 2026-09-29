import sharp from 'sharp';
import { getPgPool } from '../lib/db.js';
import { supabaseAdmin } from '../lib/supabase.js';

const isDryRun = process.argv.includes('--dry-run');

function parseDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
    return null;
  }
  const match = dataUrl.match(/^data:([A-Za-z0-9\-+\/]+);base64,(.+)$/s);
  if (!match) return null;
  return {
    mime: match[1],
    buffer: Buffer.from(match[2], 'base64')
  };
}

async function ensureBucket() {
  const { data, error } = await supabaseAdmin.storage.getBucket('media');
  if (error || !data) {
    console.log('[Storage] Creating public bucket "media"...');
    await supabaseAdmin.storage.createBucket('media', { public: true });
  } else {
    console.log('[Storage] Bucket "media" is ready (public: true).');
  }
}

async function uploadToStorage(bucketName, filePath, buffer, contentType = 'image/webp') {
  const { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, buffer, {
      contentType,
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload ${filePath}: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function runMigration() {
  console.log(`=== MUTHALEETU THISAI IMAGE MIGRATION ===`);
  console.log(`Mode: ${isDryRun ? 'DRY-RUN (No DB/Storage modifications)' : 'LIVE EXECUTION'}\n`);

  if (!isDryRun) {
    await ensureBucket();
  }

  const pool = getPgPool();
  if (!pool) {
    console.error('Error: PostgreSQL pool could not be initialized.');
    process.exit(1);
  }

  // 1. MIGRATE ARTICLES COVER IMAGES
  console.log('--- Step 1: Scanning articles table for base64 images ---');
  const articlesRes = await pool.query(`
    SELECT id, slug, cover_image_url 
    FROM articles 
    WHERE cover_image_url LIKE 'data:image%'
    ORDER BY created_at DESC
  `);

  console.log(`Found ${articlesRes.rows.length} article(s) with base64 images.`);

  for (let i = 0; i < articlesRes.rows.length; i++) {
    const article = articlesRes.rows[i];
    console.log(`[${i + 1}/${articlesRes.rows.length}] Processing article: ${article.slug || article.id}`);

    const parsed = parseDataUrl(article.cover_image_url);
    if (!parsed) {
      console.warn(`  Warning: Unable to parse base64 for article ${article.id}`);
      continue;
    }

    try {
      // Convert to 1200w cover WebP (quality 82)
      const cover1200Buffer = await sharp(parsed.buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      // Convert to 480w thumbnail WebP (quality 80)
      const thumb480Buffer = await sharp(parsed.buffer)
        .resize({ width: 480, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const coverPath = `articles/${article.id}/cover-1200.webp`;
      const thumbPath = `articles/${article.id}/cover-480.webp`;

      if (isDryRun) {
        console.log(`  [DRY-RUN] Would upload ${coverPath} (${cover1200Buffer.length} bytes) and ${thumbPath} (${thumb480Buffer.length} bytes)`);
        console.log(`  [DRY-RUN] Would update articles table: cover_image_url and thumbnail_url`);
      } else {
        const coverUrl = await uploadToStorage('media', coverPath, cover1200Buffer, 'image/webp');
        const thumbUrl = await uploadToStorage('media', thumbPath, thumb480Buffer, 'image/webp');

        await pool.query(`
          UPDATE articles 
          SET cover_image_url = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `, [coverUrl, article.id]);

        console.log(`  ✓ Uploaded & updated article ${article.slug}:`);
        console.log(`    Cover URL: ${coverUrl}`);
        console.log(`    Thumb URL: ${thumbUrl}`);
      }
    } catch (err) {
      console.error(`  ✕ Error processing article ${article.id}:`, err.message);
    }
  }

  // 2. MIGRATE PROFILES AVATARS
  console.log('\n--- Step 2: Scanning profiles table for base64 avatars ---');
  const profilesRes = await pool.query(`
    SELECT id, display_name, avatar_url 
    FROM profiles 
    WHERE avatar_url LIKE 'data:image%'
    ORDER BY created_at DESC
  `);

  console.log(`Found ${profilesRes.rows.length} profile(s) with base64 avatars.`);

  for (let i = 0; i < profilesRes.rows.length; i++) {
    const profile = profilesRes.rows[i];
    console.log(`[${i + 1}/${profilesRes.rows.length}] Processing profile: ${profile.display_name || profile.id}`);

    const parsed = parseDataUrl(profile.avatar_url);
    if (!parsed) {
      console.warn(`  Warning: Unable to parse base64 for profile ${profile.id}`);
      continue;
    }

    try {
      // Convert to 96x96 avatar WebP (quality 85)
      const avatarBuffer = await sharp(parsed.buffer)
        .resize(96, 96, { fit: 'cover' })
        .webp({ quality: 85 })
        .toBuffer();

      const avatarPath = `avatars/${profile.id}.webp`;

      if (isDryRun) {
        console.log(`  [DRY-RUN] Would upload ${avatarPath} (${avatarBuffer.length} bytes)`);
        console.log(`  [DRY-RUN] Would update profiles table: avatar_url`);
      } else {
        const avatarUrl = await uploadToStorage('media', avatarPath, avatarBuffer, 'image/webp');

        await pool.query(`
          UPDATE profiles 
          SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `, [avatarUrl, profile.id]);

        console.log(`  ✓ Uploaded & updated profile ${profile.display_name}:`);
        console.log(`    Avatar URL: ${avatarUrl}`);
      }
    } catch (err) {
      console.error(`  ✕ Error processing profile ${profile.id}:`, err.message);
    }
  }

  console.log('\n=== MIGRATION COMPLETE ===');
  process.exit(0);
}

runMigration().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
