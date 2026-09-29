import { getPgPool, invalidateCache } from '../lib/db.js';

async function main() {
  const pool = getPgPool();
  if (!pool) {
    console.error('No PostgreSQL pool available');
    process.exit(1);
  }

  const updates = [
    {
      slug: 'mutual-fund-investing-how-to-build-long-term-wealth-starting-with-small-amounts',
      img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
      category: 'mutual-funds'
    },
    {
      slug: 'risk-vs-volatility',
      img: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80',
      category: 'stocks'
    },
    {
      slug: 'sip-mutual-funds-long-term-wealth',
      img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      category: 'mutual-funds'
    },
    {
      slug: '5000-sip-to-50-lakhs-wealth-plan',
      img: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&w=800&q=80',
      category: 'personal-finance'
    },
    {
      slug: 'nifty-50-vs-sensex-tamil-guide',
      img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      category: 'stocks'
    },
    {
      slug: 'top-5-flexi-cap-funds-2026',
      img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
      category: 'mutual-funds'
    }
  ];

  for (const item of updates) {
    const res = await pool.query(
      'UPDATE articles SET cover_image_url = $1, category = $2 WHERE slug = $3 RETURNING id, slug, cover_image_url, category;',
      [item.img, item.category, item.slug]
    );
    if (res.rows.length > 0) {
      console.log('✅ Updated article:', res.rows[0].slug, '->', res.rows[0].cover_image_url);
    } else {
      console.log('⚠️ Article not found by slug:', item.slug);
    }
  }

  // Also ensure any other articles without distinct images get category fallbacks
  await pool.query(`
    UPDATE articles
    SET cover_image_url = CASE
      WHEN category ILIKE '%mutual%' OR category ILIKE '%sip%' THEN 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80'
      WHEN category ILIKE '%stock%' OR category ILIKE '%market%' THEN 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80'
      ELSE 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'
    END
    WHERE cover_image_url IS NULL OR cover_image_url = '' OR cover_image_url ILIKE '%avatars%';
  `);

  invalidateCache('articles:');
  invalidateCache('home_feed');
  console.log('🎉 Successfully fixed all article thumbnails in database!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error fixing article thumbnails:', err);
  process.exit(1);
});
