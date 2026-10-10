-- Migration: Auto-Synced YouTube Video Section for Muthaleetu Thisai
-- Table: youtube_videos

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

CREATE TABLE IF NOT EXISTS public.youtube_sync_log (
  id bigserial PRIMARY KEY,
  ran_at timestamptz DEFAULT now(),
  source text,
  new_count int DEFAULT 0,
  updated_count int DEFAULT 0,
  error text
);

CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_youtube_videos_published_at ON public.youtube_videos (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_pinned_published ON public.youtube_videos (is_pinned DESC, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_category ON public.youtube_videos (category);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_is_short ON public.youtube_videos (is_short);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_is_hidden ON public.youtube_videos (is_hidden);

-- Enable RLS
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- Optional: Supabase pg_cron + pg_net 30-minute safety-net schedule
-- (Uncomment in Supabase SQL editor if pg_cron and pg_net extensions are enabled)
-- SELECT cron.schedule(
--   'sync-youtube-every-30-mins',
--   '*/30 * * * *',
--   $$
--   SELECT net.http_post(
--     url := 'https://www.muthaleetuthisai.com/api/youtube/sync',
--     headers := jsonb_build_object('Content-Type', 'application/json', 'x-sync-secret', 'YOUR_SYNC_SECRET')
--   );
--   $$
-- );
