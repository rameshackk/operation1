-- ============================================================
-- DHANAVRIKSHA WEALTH - SUPABASE POSTGRES SCHEMA & RLS POLICIES
-- ============================================================

-- 1. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_id VARCHAR(32) UNIQUE NOT NULL,
    title_ta TEXT NOT NULL,
    title_en TEXT,
    description_ta TEXT,
    description_en TEXT,
    thumbnail_url TEXT,
    duration VARCHAR(16),
    duration_seconds INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    view_count BIGINT DEFAULT 0,
    category VARCHAR(64) DEFAULT 'personal-finance',
    tags TEXT[] DEFAULT '{}',
    trending BOOLEAN DEFAULT false,
    translated_at TIMESTAMPTZ DEFAULT NULL,
    source_publisher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'published' CHECK (status IN ('pending', 'published', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos (category);
CREATE INDEX IF NOT EXISTS idx_videos_pending_translation ON public.videos (translated_at) WHERE translated_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos (status);
CREATE INDEX IF NOT EXISTS idx_videos_source_publisher ON public.videos (source_publisher_id, status);

-- 2. PROFILES TABLE (Tied to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    role VARCHAR(16) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'publisher')),
    title TEXT,
    arn_number TEXT,
    specialties TEXT[] DEFAULT '{}',
    bio TEXT,
    bio_ta TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT DEFAULT NULL,
    youtube_url TEXT,
    youtube_channel_id TEXT DEFAULT NULL,
    youtube_channel_title TEXT DEFAULT NULL,
    youtube_channel_thumbnail TEXT DEFAULT NULL,
    youtube_channel_verified BOOLEAN DEFAULT false,
    whatsapp_number TEXT,
    phone TEXT,
    is_onboarded BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for role lookup & verified channels
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_yt_channel_verified ON public.profiles (youtube_channel_verified) WHERE youtube_channel_verified = true;

-- 3. WATCH HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    progress_seconds INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_video_history UNIQUE (user_id, video_id)
);

CREATE INDEX IF NOT EXISTS idx_watch_history_user ON public.watch_history (user_id, updated_at DESC);

-- 4. HELPER FUNCTION TO CHECK ADMIN ROLE
CREATE OR REPLACE FUNCTION public.is_admin(user_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_uid AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL),
        'user'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. PUBLIC HOMEPAGE PREVIEW VIEW (Non-sensitive metadata only)
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

-- Grant select to anon (public) and authenticated roles
GRANT SELECT ON public.trending_preview TO anon, authenticated;

-- 7. ROW-LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- VIDEOS POLICIES:
-- Public and authenticated users can view published videos, admins can view all, publishers can view their own
DROP POLICY IF EXISTS "Public videos read access" ON public.videos;
DROP POLICY IF EXISTS "Authenticated videos read access" ON public.videos;
DROP POLICY IF EXISTS "Videos select policy" ON public.videos;
CREATE POLICY "Videos select policy" ON public.videos
    FOR SELECT USING (
        status = 'published' 
        OR (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
        OR (auth.uid() IS NOT NULL AND source_publisher_id = auth.uid())
    );

-- PROFILES POLICIES:
-- Users can view their own profile
CREATE POLICY "Users view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- Users can update their own profile
CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- WATCH HISTORY POLICIES:
-- Users can view their own watch history
CREATE POLICY "Users view own watch history" ON public.watch_history
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Users can insert/update their own watch history
CREATE POLICY "Users manage own watch history" ON public.watch_history
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 8. ARTICLES TABLE (Original Written Content by Admin)
-- ============================================================
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

-- Articles Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles (created_at DESC);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- ARTICLES POLICIES:
-- 1. SELECT: Authenticated users can view published articles, or admins can view all (including drafts)
DROP POLICY IF EXISTS "Articles read access" ON public.articles;
CREATE POLICY "Articles read access" ON public.articles
    FOR SELECT USING (
        status = 'published' OR 
        public.is_admin(auth.uid())
    );

-- 2. INSERT: Admins only
DROP POLICY IF EXISTS "Admin insert articles" ON public.articles;
CREATE POLICY "Admin insert articles" ON public.articles
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- 3. UPDATE: Admins only
DROP POLICY IF EXISTS "Admin update articles" ON public.articles;
CREATE POLICY "Admin update articles" ON public.articles
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- 4. DELETE: Admins only
DROP POLICY IF EXISTS "Admin delete articles" ON public.articles;
CREATE POLICY "Admin delete articles" ON public.articles
    FOR DELETE USING (public.is_admin(auth.uid()));

-- ============================================================
-- 9. SUPABASE STORAGE BUCKET: article-covers
-- ============================================================
-- Insert bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-covers', 'article-covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public read access
DROP POLICY IF EXISTS "Public article cover access" ON storage.objects;
CREATE POLICY "Public article cover access" ON storage.objects
    FOR SELECT USING (bucket_id = 'article-covers');

-- Storage RLS: Admin upload access
DROP POLICY IF EXISTS "Admin upload article cover" ON storage.objects;
CREATE POLICY "Admin upload article cover" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'article-covers' AND
        (public.is_admin(auth.uid()) OR auth.role() = 'service_role')
    );

-- Storage RLS: Admin update/delete access
DROP POLICY IF EXISTS "Admin modify article cover" ON storage.objects;
CREATE POLICY "Admin modify article cover" ON storage.objects
    FOR ALL USING (
        bucket_id = 'article-covers' AND
        (public.is_admin(auth.uid()) OR auth.role() = 'service_role')
    );

