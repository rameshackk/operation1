import { getPgPool } from '../lib/db.js';

async function applyConstraints() {
  const pool = getPgPool();
  if (!pool) {
    console.error('No pg pool');
    process.exit(1);
  }

  console.log('Applying DB CHECK constraints on articles and profiles...');
  try {
    await pool.query(`ALTER TABLE public.articles DROP CONSTRAINT IF EXISTS check_cover_not_data_uri`);
    await pool.query(`ALTER TABLE public.articles ADD CONSTRAINT check_cover_not_data_uri CHECK (cover_image_url IS NULL OR cover_image_url NOT LIKE 'data:%')`);
    console.log('✓ Added articles CHECK constraint: check_cover_not_data_uri');

    await pool.query(`ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS check_avatar_not_data_uri`);
    await pool.query(`ALTER TABLE public.profiles ADD CONSTRAINT check_avatar_not_data_uri CHECK (avatar_url IS NULL OR avatar_url NOT LIKE 'data:%')`);
    console.log('✓ Added profiles CHECK constraint: check_avatar_not_data_uri');

    // Also add indexes for Task C
    console.log('\nApplying Task C indexes...');
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_articles_status_published_at_desc ON public.articles (status, published_at DESC NULLS LAST)`);
    console.log('✓ Added idx_articles_status_published_at_desc');

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_articles_category_published_at_desc ON public.articles (category, published_at DESC NULLS LAST)`);
    console.log('✓ Added idx_articles_category_published_at_desc');

    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug_unique ON public.articles (slug)`);
    console.log('✓ Added idx_articles_slug_unique');

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_videos_category_published_at_desc ON public.videos (category, published_at DESC NULLS LAST)`);
    console.log('✓ Added idx_videos_category_published_at_desc');

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_videos_trending_partial ON public.videos (trending, published_at DESC NULLS LAST) WHERE trending = true`);
    console.log('✓ Added idx_videos_trending_partial');

    console.log('\nAll constraints and indexes applied successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error applying DB constraints/indexes:', err);
    process.exit(1);
  }
}

applyConstraints();
