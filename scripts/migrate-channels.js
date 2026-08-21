import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.etanokdvfyvkidpeovdi:Fortune%21%40%23%241234%3F@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('--- Starting YouTube Channel & Video Moderation Migration ---');

    // 1. Update profiles table with YouTube Channel columns
    await client.query(`
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS youtube_channel_id TEXT DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS youtube_channel_title TEXT DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS youtube_channel_thumbnail TEXT DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS youtube_channel_verified BOOLEAN DEFAULT false;
    `);
    console.log('✓ profiles table updated with youtube_channel_id and youtube_channel_verified.');

    // Index on youtube_channel_verified
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_profiles_yt_channel_verified 
      ON public.profiles (youtube_channel_verified) 
      WHERE youtube_channel_verified = true;
    `);
    console.log('✓ Created index idx_profiles_yt_channel_verified.');

    // 2. Update videos table with source_publisher_id and status
    await client.query(`
      ALTER TABLE public.videos 
      ADD COLUMN IF NOT EXISTS source_publisher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS status VARCHAR(16) NOT NULL DEFAULT 'published';
    `);
    console.log('✓ videos table updated with source_publisher_id and status.');

    // Add CHECK constraint on status if not exists
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'videos_status_check'
        ) THEN
          ALTER TABLE public.videos ADD CONSTRAINT videos_status_check CHECK (status IN ('pending', 'published', 'rejected'));
        END IF;
      END $$;
    `);
    console.log('✓ videos_status_check constraint verified.');

    // 3. Ensure existing videos are marked as 'published'
    await client.query(`
      UPDATE public.videos 
      SET status = 'published' 
      WHERE status IS NULL OR status = '';
    `);
    console.log('✓ Existing videos marked as published.');

    // 4. Create Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos (status);
      CREATE INDEX IF NOT EXISTS idx_videos_source_publisher ON public.videos (source_publisher_id, status);
      CREATE INDEX IF NOT EXISTS idx_videos_published_status ON public.videos (published_at DESC) WHERE status = 'published';
    `);
    console.log('✓ Indexes for videos status and publisher created.');

    // 5. Update trending_preview View to include status = 'published' and source_publisher_id
    await client.query(`
      CREATE OR REPLACE VIEW public.trending_preview AS
      SELECT 
          id,
          youtube_id,
          title_ta,
          title_en,
          thumbnail_url,
          duration,
          duration_seconds,
          published_at,
          view_count,
          category,
          trending,
          status,
          source_publisher_id
      FROM public.videos
      WHERE status = 'published';
    `);
    console.log('✓ trending_preview view updated with status filter.');

    // 6. Update Videos RLS Policies
    await client.query(`
      DROP POLICY IF EXISTS "Public videos read access" ON public.videos;
      DROP POLICY IF EXISTS "Authenticated videos read access" ON public.videos;
      
      -- Authenticated & public users can read published videos, or admins can read all, or publishers can read their own
      CREATE POLICY "Videos select policy" ON public.videos
        FOR SELECT USING (
          status = 'published' 
          OR (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
          OR (auth.uid() IS NOT NULL AND source_publisher_id = auth.uid())
        );
    `);
    console.log('✓ videos RLS policy updated.');

    console.log('--- Migration Completed Successfully! ---');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
