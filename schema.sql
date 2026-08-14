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
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos (category);
CREATE INDEX IF NOT EXISTS idx_videos_pending_translation ON public.videos (translated_at) WHERE translated_at IS NULL;

-- 2. PROFILES TABLE (Tied to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    role VARCHAR(16) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for role lookup
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

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

-- 6. ROW-LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- VIDEOS POLICIES:
-- Public read access to videos
CREATE POLICY "Public videos read access" ON public.videos
    FOR SELECT USING (true);

-- Service role full access to videos (handled automatically by Supabase service key)

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
