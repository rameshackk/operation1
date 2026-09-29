import { getPgPool } from '../lib/db.js';

async function createHomeFeedRpc() {
  const pool = getPgPool();
  if (!pool) {
    console.error('No pg pool');
    process.exit(1);
  }

  console.log('Creating home_feed() SQL function in Supabase Postgres...');

  const sql = `
    CREATE OR REPLACE FUNCTION public.home_feed()
    RETURNS JSONB AS $$
    DECLARE
        result JSONB;
    BEGIN
        SELECT jsonb_build_object(
            'articles', (
                SELECT COALESCE(jsonb_agg(a_row), '[]'::jsonb)
                FROM (
                    SELECT 
                        a.id,
                        a.slug,
                        a.title_ta,
                        a.title_en,
                        a.title_ta AS "titleTamil",
                        COALESCE(a.title_en, a.title_ta) AS "titleEnglish",
                        COALESCE(a.title_ta, a.title_en) AS title,
                        LEFT(COALESCE(a.excerpt_ta, ''), 160) AS excerpt_ta,
                        LEFT(COALESCE(a.excerpt_ta, ''), 160) AS "excerptTamil",
                        LEFT(COALESCE(a.excerpt_en, a.excerpt_ta, ''), 160) AS "excerptEnglish",
                        COALESCE(a.cover_image_url, '') AS thumbnail_url,
                        COALESCE(a.cover_image_url, '') AS "thumbnailUrl",
                        COALESCE(a.cover_image_url, '') AS thumbnail,
                        COALESCE(a.cover_image_url, '') AS "coverImage",
                        a.category,
                        COALESCE(a.view_count, 0) AS views,
                        COALESCE(a.read_time_minutes, 3) AS "readTimeMinutes",
                        a.published_at AS published_at,
                        a.published_at AS "publishedAt",
                        a.author_id AS author_id,
                        COALESCE(p.display_name, 'Budget Padmanaban') AS "authorName",
                        p.avatar_url AS "authorAvatar",
                        p.avatar_url AS author_avatar_url,
                        COALESCE(p.arn_number, '') AS "authorArn"
                    FROM public.articles a
                    LEFT JOIN public.profiles p ON a.author_id = p.id
                    WHERE a.status = 'published'
                    ORDER BY a.published_at DESC NULLS LAST, a.id DESC
                    LIMIT 6
                ) a_row
            ),
            'videos', (
                SELECT COALESCE(jsonb_agg(v_row), '[]'::jsonb)
                FROM (
                    SELECT 
                        v.youtube_id AS id,
                        v.youtube_id AS "youtubeId",
                        v.title_ta AS "titleTamil",
                        v.title_en AS "titleEnglish",
                        COALESCE(v.title_ta, v.title_en) AS title,
                        COALESCE(v.thumbnail_url, 'https://i.ytimg.com/vi_webp/' || v.youtube_id || '/mqdefault.webp') AS thumbnail,
                        v.category,
                        v.published_at AS "publishedAt",
                        v.duration,
                        COALESCE(v.duration_seconds, 0) AS "durationSeconds",
                        COALESCE(v.view_count, 0) AS views,
                        COALESCE(p.display_name, 'Budget Padmanaban') AS "channelName",
                        COALESCE(v.trending, false) AS trending
                    FROM public.videos v
                    LEFT JOIN public.profiles p ON v.source_publisher_id::text = p.id::text
                    WHERE v.status = 'published'
                    ORDER BY v.published_at DESC NULLS LAST
                    LIMIT 12
                ) v_row
            ),
            'trendingVideos', (
                SELECT COALESCE(jsonb_agg(tv_row), '[]'::jsonb)
                FROM (
                    SELECT 
                        v.youtube_id AS id,
                        v.youtube_id AS "youtubeId",
                        v.title_ta AS "titleTamil",
                        v.title_en AS "titleEnglish",
                        COALESCE(v.title_ta, v.title_en) AS title,
                        COALESCE(v.thumbnail_url, 'https://i.ytimg.com/vi_webp/' || v.youtube_id || '/mqdefault.webp') AS thumbnail,
                        v.category,
                        v.published_at AS "publishedAt",
                        v.duration,
                        COALESCE(v.duration_seconds, 0) AS "durationSeconds",
                        COALESCE(v.view_count, 0) AS views,
                        COALESCE(p.display_name, 'Budget Padmanaban') AS "channelName",
                        true AS trending
                    FROM public.videos v
                    LEFT JOIN public.profiles p ON v.source_publisher_id::text = p.id::text
                    WHERE v.status = 'published' AND v.trending = true
                    ORDER BY v.published_at DESC NULLS LAST
                    LIMIT 8
                ) tv_row
            ),
            'professionals', (
                SELECT COALESCE(jsonb_agg(prof_row), '[]'::jsonb)
                FROM (
                    SELECT 
                        p.id,
                        COALESCE(p.display_name, 'Advisor') AS display_name,
                        COALESCE(p.display_name, 'Advisor') AS name,
                        p.title,
                        COALESCE(p.arn_number, '') AS arn_number,
                        p.avatar_url,
                        p.avatar_url AS avatar,
                        COALESCE(p.specialties, '{}'::text[]) AS specialties,
                        COALESCE(p.bio, '') AS bio,
                        COALESCE(p.bio_ta, '') AS bio_ta,
                        p.whatsapp_number,
                        (SELECT COUNT(*) FROM public.articles WHERE author_id = p.id AND status = 'published') AS article_count,
                        (SELECT COUNT(*) FROM public.videos WHERE source_publisher_id = p.id AND status = 'published') AS video_count
                    FROM public.profiles p
                    WHERE p.role IN ('publisher', 'admin')
                    ORDER BY (p.role = 'admin') DESC, p.created_at ASC
                    LIMIT 10
                ) prof_row
            ),
            'timestamp', CURRENT_TIMESTAMP
        ) INTO result;

        RETURN result;
    END;
    $$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

    GRANT EXECUTE ON FUNCTION public.home_feed() TO anon, authenticated, service_role;
  `;

  try {
    await pool.query(sql);
    console.log('✓ Created home_feed() RPC function in database.');

    const res = await pool.query(`SELECT public.home_feed() AS feed`);
    const feed = res.rows[0]?.feed;
    console.log('\n--- Tested home_feed() output ---');
    console.log('Articles count:', feed.articles?.length);
    console.log('Videos count:', feed.videos?.length);
    console.log('Trending videos count:', feed.trendingVideos?.length);
    console.log('Professionals count:', feed.professionals?.length);
    console.log('Total JSON payload size:', JSON.stringify(feed).length, 'bytes');

    process.exit(0);
  } catch (err) {
    console.error('Error creating home_feed() RPC:', err);
    process.exit(1);
  }
}

createHomeFeedRpc();
