import { getPgPool } from '../lib/db.js';

async function migrateYoutubeVideos() {
  const pool = getPgPool();
  if (!pool) {
    console.error('No PostgreSQL pool available');
    process.exit(1);
  }

  console.log('🚀 Running Supabase migration for youtube_videos & youtube_sync_log...');

  try {
    // 1. Create table youtube_videos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.youtube_videos (
        video_id text PRIMARY KEY,
        channel_id text,
        title text NOT NULL,
        description text,
        published_at timestamptz NOT NULL,
        duration_seconds int DEFAULT 0,
        view_count bigint DEFAULT 0,
        like_count bigint,
        thumbnail_url text,
        is_short boolean DEFAULT false,
        is_live boolean DEFAULT false,
        category text DEFAULT 'Others',
        category_locked boolean DEFAULT false,
        tags text[] DEFAULT '{}',
        is_hidden boolean DEFAULT false,
        is_pinned boolean DEFAULT false,
        ai_summary_ta text,
        ai_summary_en text,
        synced_at timestamptz DEFAULT now()
      );
    `);
    console.log('✅ Table youtube_videos created or verified');

    // 2. Create table youtube_sync_log
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.youtube_sync_log (
        id bigserial PRIMARY KEY,
        ran_at timestamptz DEFAULT now(),
        source text,
        new_count int DEFAULT 0,
        updated_count int DEFAULT 0,
        error text
      );
    `);
    console.log('✅ Table youtube_sync_log created or verified');

    // 3. Create app_settings table for caching channel metadata
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.app_settings (
        key text PRIMARY KEY,
        value jsonb NOT NULL,
        updated_at timestamptz DEFAULT now()
      );
    `);
    console.log('✅ Table app_settings created or verified');

    // 4. Create Indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_youtube_videos_published_at ON public.youtube_videos (published_at DESC);
      CREATE INDEX IF NOT EXISTS idx_youtube_videos_pinned_published ON public.youtube_videos (is_pinned DESC, published_at DESC);
      CREATE INDEX IF NOT EXISTS idx_youtube_videos_category ON public.youtube_videos (category);
      CREATE INDEX IF NOT EXISTS idx_youtube_videos_is_short ON public.youtube_videos (is_short);
      CREATE INDEX IF NOT EXISTS idx_youtube_videos_is_hidden ON public.youtube_videos (is_hidden);
    `);
    console.log('✅ Indexes created');

    // 5. Enable RLS and setup policies
    await pool.query(`
      ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.youtube_sync_log ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'youtube_videos' AND policyname = 'Public can view non-hidden videos'
        ) THEN
          CREATE POLICY "Public can view non-hidden videos" 
          ON public.youtube_videos 
          FOR SELECT 
          USING (is_hidden = false);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'youtube_videos' AND policyname = 'Admins full access to youtube_videos'
        ) THEN
          CREATE POLICY "Admins full access to youtube_videos" 
          ON public.youtube_videos 
          FOR ALL 
          USING (auth.role() = 'service_role' OR is_admin(auth.uid()));
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'youtube_sync_log' AND policyname = 'Admins view sync logs'
        ) THEN
          CREATE POLICY "Admins view sync logs" 
          ON public.youtube_sync_log 
          FOR ALL 
          USING (auth.role() = 'service_role' OR is_admin(auth.uid()));
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'app_settings' AND policyname = 'Public read app_settings'
        ) THEN
          CREATE POLICY "Public read app_settings" 
          ON public.app_settings 
          FOR SELECT 
          USING (true);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'app_settings' AND policyname = 'Admins manage app_settings'
        ) THEN
          CREATE POLICY "Admins manage app_settings" 
          ON public.app_settings 
          FOR ALL 
          USING (auth.role() = 'service_role' OR is_admin(auth.uid()));
        END IF;
      END $$;
    `);
    console.log('✅ RLS Policies applied');

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrateYoutubeVideos();
