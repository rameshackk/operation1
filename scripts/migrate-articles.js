import 'dotenv/config';
import { getPgPool } from '../lib/db.js';
import { supabaseAdmin } from '../lib/supabase.js';

async function migrate() {
  console.log('🚀 Running database migration for Articles feature...');
  const pool = getPgPool();

  if (!pool) {
    console.error('❌ PostgreSQL connection pool not available');
    process.exit(1);
  }

  const sql = `
    -- 1. Create articles table
    CREATE TABLE IF NOT EXISTS public.articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(255) UNIQUE NOT NULL,
        title_ta TEXT NOT NULL,
        title_en TEXT,
        excerpt_ta TEXT,
        excerpt_en TEXT,
        body_ta TEXT NOT NULL,
        body_en TEXT,
        cover_image_url TEXT,
        category VARCHAR(64) DEFAULT 'mutual-fund',
        tags TEXT[] DEFAULT '{}',
        status VARCHAR(16) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
        read_time_minutes INTEGER DEFAULT 3,
        published_at TIMESTAMPTZ DEFAULT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Indexes
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
    CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles (status, published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category);
    CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles (created_at DESC);

    -- 3. Enable RLS
    ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

    -- 4. Policies
    DROP POLICY IF EXISTS "Articles read access" ON public.articles;
    CREATE POLICY "Articles read access" ON public.articles
        FOR SELECT USING (
            status = 'published' OR 
            public.is_admin(auth.uid())
        );

    DROP POLICY IF EXISTS "Admin insert articles" ON public.articles;
    CREATE POLICY "Admin insert articles" ON public.articles
        FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

    DROP POLICY IF EXISTS "Admin update articles" ON public.articles;
    CREATE POLICY "Admin update articles" ON public.articles
        FOR UPDATE USING (public.is_admin(auth.uid()));

    DROP POLICY IF EXISTS "Admin delete articles" ON public.articles;
    CREATE POLICY "Admin delete articles" ON public.articles
        FOR DELETE USING (public.is_admin(auth.uid()));
  `;

  try {
    await pool.query(sql);
    console.log('✅ Articles table, indexes, and RLS policies created successfully in PostgreSQL.');

    // Ensure storage bucket exists via Supabase Admin Client
    if (supabaseAdmin) {
      try {
        const { data: buckets, error: getBucketsError } = await supabaseAdmin.storage.listBuckets();
        const exists = buckets && buckets.some(b => b.name === 'article-covers' || b.id === 'article-covers');
        if (!exists) {
          const { error: createBucketError } = await supabaseAdmin.storage.createBucket('article-covers', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif']
          });
          if (createBucketError) {
            console.warn('Note on storage bucket creation:', createBucketError.message);
          } else {
            console.log('✅ Supabase Storage bucket "article-covers" created with public access.');
          }
        } else {
          console.log('✅ Supabase Storage bucket "article-covers" already exists.');
        }
      } catch (storageErr) {
        console.warn('Storage bucket setup note:', storageErr.message);
      }
    }

    console.log('🎉 Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
