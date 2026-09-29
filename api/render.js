import fs from 'fs';
import path from 'path';
import { 
  getVideoByYoutubeId, 
  listVideos, 
  listArticles, 
  formatArticleRow,
  getPgPool
} from '../lib/db.js';
import { 
  BASE_URL, 
  SITE_NAME_TA, 
  SITE_NAME_EN, 
  DEFAULT_OG_IMAGE, 
  OFFICIAL_YOUTUBE_CHANNEL,
  generateOrganizationSchema,
  generateVideoSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateProfileSchema,
  slugify
} from '../lib/seo.js';
import { supabaseAdmin, supabaseAnon } from '../lib/supabase.js';

let cachedTemplate = null;

async function getIndexHtmlTemplate() {
  if (cachedTemplate) return cachedTemplate;
  try {
    const filePath = path.join(process.cwd(), 'index.html');
    cachedTemplate = await fs.promises.readFile(filePath, 'utf8');
    return cachedTemplate;
  } catch (err) {
    console.warn('Failed to read index.html, using fallback template:', err.message);
    return `<!DOCTYPE html>
<html lang="ta" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>முதலீட்டு திசை | Muthaleetu Thisai</title>
  <link rel="stylesheet" href="/css/app.min.css" />
</head>
<body class="text-slate-900 antialiased bg-slate-50">
  <div id="root"></div>
  <script type="module" src="/js/dist/main.js"></script>
</body>
</html>`;
  }
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const CATEGORY_MAP = {
  'all': { ta: 'அனைத்தும்', en: 'All Topics' },
  'mutual-fund': { ta: 'மியூச்சுவல் ஃபண்ட்', en: 'Mutual Funds' },
  'stock-market': { ta: 'பங்குச் சந்தை', en: 'Stock Market' },
  'personal-finance': { ta: 'தனிநபர் நிதி', en: 'Personal Finance' },
  'investment-strategy': { ta: 'முதலீட்டு உத்திகள்', en: 'Investment Strategies' },
  'tax-planning': { ta: 'வரி திட்டமிடல்', en: 'Tax Planning' },
  'market-analysis': { ta: 'சந்தை பகுப்பாய்வு', en: 'Market Analysis' },
  'retirement-planning': { ta: 'ஓய்வுக்கால திட்டம்', en: 'Retirement Planning' },
  'schemes': { ta: 'திட்டங்கள்', en: 'Fund Schemes' }
};

export async function generateSitemapXml() {
  const pgPool = getPgPool();
  let articles = [];
  let videos = [];
  let publishers = [];

  if (pgPool) {
    const [artRes, vidRes, pubRes] = await Promise.all([
      pgPool.query(`SELECT slug, updated_at, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT 500`),
      pgPool.query(`SELECT youtube_id, title_en, title_ta, updated_at, published_at FROM videos WHERE status = 'published' ORDER BY published_at DESC LIMIT 1000`),
      pgPool.query(`SELECT id, updated_at FROM profiles WHERE role IN ('publisher', 'admin') AND is_onboarded = true LIMIT 100`)
    ]);
    articles = artRes.rows;
    videos = vidRes.rows;
    publishers = pubRes.rows;
  } else {
    const client = supabaseAdmin || supabaseAnon;
    if (client) {
      const [artRes, vidRes, pubRes] = await Promise.all([
        client.from('articles').select('slug, updated_at, published_at').eq('status', 'published').limit(500),
        client.from('videos').select('youtube_id, title_en, title_ta, updated_at, published_at').eq('status', 'published').limit(1000),
        client.from('profiles').select('id, updated_at').in('role', ['publisher', 'admin']).eq('is_onboarded', true).limit(100)
      ]);
      articles = artRes.data || [];
      videos = vidRes.data || [];
      publishers = pubRes.data || [];
    }
  }

  const now = new Date().toISOString();

  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily', lastmod: now },
    { url: '/articles', priority: '0.9', changefreq: 'daily', lastmod: now },
    { url: '/videos', priority: '0.9', changefreq: 'daily', lastmod: now },
    { url: '/news', priority: '0.9', changefreq: 'hourly', lastmod: now },
    { url: '/professionals', priority: '0.8', changefreq: 'daily', lastmod: now },
    { url: '/category/mutual-fund', priority: '0.8', changefreq: 'daily', lastmod: now },
    { url: '/category/stock-market', priority: '0.8', changefreq: 'daily', lastmod: now },
    { url: '/category/personal-finance', priority: '0.8', changefreq: 'daily', lastmod: now },
    { url: '/category/financial-education', priority: '0.7', changefreq: 'weekly', lastmod: now },
    { url: '/category/regulatory', priority: '0.7', changefreq: 'weekly', lastmod: now },
    { url: '/calculator', priority: '0.7', changefreq: 'monthly', lastmod: now },
    { url: '/quiz', priority: '0.7', changefreq: 'monthly', lastmod: now }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // 1. Static Core Pages
  for (const r of staticRoutes) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${r.url}</loc>\n`;
    xml += `    <lastmod>${r.lastmod.split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
    xml += `    <priority>${r.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="ta" href="${BASE_URL}${r.url}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${r.url}?lang=en"/>\n`;
    xml += `  </url>\n`;
  }

  // 2. Published Articles
  for (const art of articles) {
    const artDate = art.updated_at || art.published_at || now;
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/articles/${encodeURIComponent(art.slug)}</loc>\n`;
    xml += `    <lastmod>${new Date(artDate).toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="ta" href="${BASE_URL}/articles/${encodeURIComponent(art.slug)}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/articles/${encodeURIComponent(art.slug)}?lang=en"/>\n`;
    xml += `  </url>\n`;
  }

  // 3. Published Videos
  for (const vid of videos) {
    const vidDate = vid.updated_at || vid.published_at || now;
    const cleanSlug = slugify(vid.title_en || vid.title_ta) || vid.youtube_id;
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/videos/${cleanSlug}</loc>\n`;
    xml += `    <lastmod>${new Date(vidDate).toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="ta" href="${BASE_URL}/videos/${cleanSlug}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/videos/${cleanSlug}?lang=en"/>\n`;
    xml += `  </url>\n`;
  }

  // 4. Verified Professionals
  for (const pub of publishers) {
    const pubDate = pub.updated_at || now;
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/professionals/${encodeURIComponent(pub.id)}</loc>\n`;
    xml += `    <lastmod>${new Date(pubDate).toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export default async function handler(req, res) {
  try {
    const rawUrl = req.url || '/';
    const parsedUrl = new URL(rawUrl, BASE_URL);
    const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
    const cleanPath = pathname.toLowerCase();

    // SITEMAP.XML ROUTE
    if (cleanPath === '/sitemap.xml' || cleanPath === '/api/sitemap.xml') {
      const xml = await generateSitemapXml();
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).send(xml);
    }

    const template = await getIndexHtmlTemplate();

    let pageTitle = `${SITE_NAME_TA} | Tamil Mutual Fund & Investment Guide - Budget Padmanaban`;
    let metaDescription = 'பட்ஜெட் பத்மநாபன் ஃபைனான்ஷியல் - மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை, தனிநபர் நிதி மற்றும் முதலீட்டு வழிகாட்டி. Tamil & English investment knowledge platform.';
    let canonicalUrl = `${BASE_URL}${pathname === '/' ? '' : pathname}`;
    let ogType = 'website';
    let ogImage = DEFAULT_OG_IMAGE;
    let schemas = [];
    let preRenderedHtml = '';

    // 1. Homepage (/)
    if (cleanPath === '/' || cleanPath === '') {
      pageTitle = `${SITE_NAME_TA} | Tamil Mutual Fund & Investment Guide - Budget Padmanaban`;
      metaDescription = 'பட்ஜெட் பத்மநாபன் ஃபைனான்ஷியல் - மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை, தனிநபர் நிதி மற்றும் முதலீட்டு வழிகாட்டி. Learn mutual fund investing in Tamil and English.';
      schemas = generateOrganizationSchema();

      try {
        const [videosRes, articlesRes] = await Promise.all([
          listVideos({ limit: 6, status: 'published' }).catch(() => ({ videos: [] })),
          listArticles({ limit: 4, status: 'published' }).catch(() => ({ articles: [] }))
        ]);

        const videoCards = (videosRes.videos || []).map(v => `
          <article class="ssr-card p-4 rounded-xl border border-emerald-100 bg-white/80 shadow-sm">
            <a href="/videos/${v.slug || v.youtubeId}">
              <img src="${v.thumbnail}" alt="${escapeHtml(v.titleTamil || v.titleEnglish)}" class="w-full aspect-video object-cover rounded-lg" loading="lazy" width="320" height="180" />
              <h3 class="font-bold text-slate-900 mt-2 text-base leading-snug">${escapeHtml(v.titleTamil || v.titleEnglish)}</h3>
            </a>
            <p class="text-xs text-slate-500 mt-1">${escapeHtml(v.titleEnglish || '')}</p>
          </article>
        `).join('');

        const articleCards = (articlesRes.articles || []).map(a => `
          <article class="ssr-card p-4 rounded-xl border border-emerald-100 bg-white/80 shadow-sm">
            <a href="/articles/${a.slug || a.id}">
              <h3 class="font-bold text-slate-900 text-base leading-snug">${escapeHtml(a.titleTamil || a.titleEnglish)}</h3>
              <p class="text-xs text-slate-600 mt-1 line-clamp-2">${escapeHtml(a.excerptTamil || a.excerptEnglish || '')}</p>
            </a>
          </article>
        `).join('');

        preRenderedHtml = `
          <div class="ssr-pre-rendered max-w-7xl mx-auto px-4 py-8">
            <header class="text-center mb-10">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                ${SITE_NAME_TA} - <span class="text-emerald-700">${SITE_NAME_EN}</span>
              </h1>
              <p class="text-base text-slate-600 max-w-2xl mx-auto">
                பட்ஜெட் பத்மநாபன் வழங்கும் மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை மற்றும் தனிநபர் நிதி வழிகாட்டல்.
              </p>
            </header>

            <section class="mb-12">
              <h2 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span class="w-2 h-5 bg-emerald-600 rounded-full inline-block"></span>
                சமீபத்திய வீடியோக்கள் (Latest Videos)
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${videoCards}
              </div>
            </section>

            <section class="mb-12">
              <h2 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span class="w-2 h-5 bg-emerald-600 rounded-full inline-block"></span>
                முக்கிய கட்டுரைகள் (Featured Articles)
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                ${articleCards}
              </div>
            </section>
          </div>
        `;
      } catch (err) {
        console.warn('SSR Homepage data fetch error:', err.message);
      }

    // 2. Video Detail (/videos/:slugOrId)
    } else if (cleanPath.startsWith('/videos/')) {
      const videoSlugOrId = decodeURIComponent(pathname.replace('/videos/', '').split('/')[0]);
      const video = await getVideoByYoutubeId(videoSlugOrId);

      if (video) {
        const titleTa = video.titleTamil || video.title || 'வீடியோ';
        const titleEn = video.titleEnglish || video.title || 'Investment Video';
        pageTitle = `${titleTa} | ${titleEn} - முதலீட்டு திசை`;
        metaDescription = (video.descriptionTamil || video.descriptionEnglish || titleTa).slice(0, 160);
        canonicalUrl = `${BASE_URL}/videos/${video.slug || video.youtubeId}`;
        ogType = 'video.other';
        ogImage = video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

        const videoSchema = generateVideoSchema(video, canonicalUrl);
        const breadcrumbSchema = generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Videos', url: '/videos' },
          { name: titleTa, url: `/videos/${video.slug || video.youtubeId}` }
        ]);

        schemas = [videoSchema, breadcrumbSchema].filter(Boolean);

        preRenderedHtml = `
          <div class="ssr-pre-rendered max-w-4xl mx-auto px-4 py-8">
            <nav class="text-xs text-slate-500 mb-4">
              <a href="/" class="hover:underline">Home</a> &rsaquo; 
              <a href="/videos" class="hover:underline">Videos</a> &rsaquo; 
              <span class="text-slate-800">${escapeHtml(titleTa)}</span>
            </nav>
            <article class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
                ${escapeHtml(titleTa)}
              </h1>
              <h2 class="text-lg font-medium text-slate-600 mb-4">
                ${escapeHtml(titleEn)}
              </h2>
              <div class="aspect-video w-full mb-6 rounded-xl overflow-hidden bg-slate-900 relative">
                <img src="${ogImage}" alt="${escapeHtml(titleTa)}" class="w-full h-full object-cover" width="640" height="360" />
              </div>
              <div class="flex items-center gap-4 text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">
                <span>ஆசிரியர்: <strong>${escapeHtml(video.channelName || 'Budget Padmanaban')}</strong></span>
                <span>கால அளவு: ${escapeHtml(video.duration || '00:00')}</span>
                <span>பார்வைகள்: ${video.views?.toLocaleString('ta-IN') || '0'}</span>
              </div>
              <div class="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                ${escapeHtml(video.descriptionTamil || video.descriptionEnglish || '')}
              </div>
            </article>
          </div>
        `;
      }

    // 3. Article Detail (/articles/:slug, /news/:slug)
    } else if (cleanPath.startsWith('/articles/') || cleanPath.startsWith('/news/')) {
      const articleSlugOrId = decodeURIComponent(pathname.replace(/^\/(articles|news)\//, '').split('/')[0]);
      
      let article = null;
      if (supabaseAdmin) {
        const { data } = await supabaseAdmin
          .from('articles')
          .select('*, profiles(display_name, avatar_url, title, arn_number, bio, bio_ta)')
          .or(`slug.eq.${articleSlugOrId},id.eq.${articleSlugOrId}`)
          .maybeSingle();

        if (data) {
          article = formatArticleRow({
            ...data,
            author_name: data.profiles?.display_name,
            author_avatar: data.profiles?.avatar_url,
            author_title: data.profiles?.title,
            author_arn: data.profiles?.arn_number,
            author_bio: data.profiles?.bio,
            author_bio_ta: data.profiles?.bio_ta
          });
        }
      }

      if (article) {
        const titleTa = article.titleTamil || article.title || 'கட்டுரை';
        const titleEn = article.titleEnglish || article.title || 'Article';
        pageTitle = `${titleTa} | ${titleEn} - முதலீட்டு திசை`;
        metaDescription = (article.excerptTamil || article.excerptEnglish || titleTa).slice(0, 160);
        canonicalUrl = `${BASE_URL}/articles/${article.slug || article.id}`;
        ogType = 'article';
        ogImage = article.coverImage || DEFAULT_OG_IMAGE;

        const articleSchema = generateArticleSchema(article, canonicalUrl);
        const breadcrumbSchema = generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Articles', url: '/articles' },
          { name: titleTa, url: `/articles/${article.slug || article.id}` }
        ]);

        schemas = [articleSchema, breadcrumbSchema].filter(Boolean);

        preRenderedHtml = `
          <div class="ssr-pre-rendered max-w-4xl mx-auto px-4 py-8">
            <nav class="text-xs text-slate-500 mb-4">
              <a href="/" class="hover:underline">Home</a> &rsaquo; 
              <a href="/articles" class="hover:underline">Articles</a> &rsaquo; 
              <span class="text-slate-800">${escapeHtml(titleTa)}</span>
            </nav>
            <article class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <header class="mb-6">
                <span class="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold mb-3">
                  ${escapeHtml(article.category || 'Mutual Funds')}
                </span>
                <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
                  ${escapeHtml(titleTa)}
                </h1>
                <p class="text-base text-slate-600 italic">
                  ${escapeHtml(article.excerptTamil || article.excerptEnglish || '')}
                </p>
                <div class="flex items-center gap-3 mt-4 text-xs text-slate-500">
                  <span>எழுதியவர்: <strong>${escapeHtml(article.authorName || 'Budget Padmanaban')}</strong></span>
                  <span>வாசிக்கும் நேரம்: ${article.readTimeMinutes || 3} நிமிடம்</span>
                </div>
              </header>
              ${article.coverImage ? `<img src="${article.coverImage}" alt="${escapeHtml(titleTa)}" class="w-full rounded-xl mb-6 max-h-96 object-cover" loading="lazy" />` : ''}
              <div class="prose max-w-none text-slate-800 text-base leading-relaxed">
                ${article.bodyTamil || article.bodyEnglish || ''}
              </div>
            </article>
          </div>
        `;
      }

    // 4. Category Pages (/category/:id)
    } else if (cleanPath.startsWith('/category/')) {
      const catSlug = decodeURIComponent(pathname.replace('/category/', '').split('/')[0]);
      const catInfo = CATEGORY_MAP[catSlug] || { ta: catSlug, en: catSlug };

      pageTitle = `${catInfo.ta} (${catInfo.en}) - மியூச்சுவல் ஃபண்ட் வழிகாட்டி | முதலீட்டு திசை`;
      metaDescription = `${catInfo.ta} (${catInfo.en}) தொடர்பான தமிழ் வீடியோக்கள் மற்றும் ஆலோசனைக் கட்டுரைகள். Learn ${catInfo.en} in Tamil on Muthaleetu Thisai.`;
      canonicalUrl = `${BASE_URL}/category/${catSlug}`;

      const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Categories', url: '/category' },
        { name: catInfo.ta, url: `/category/${catSlug}` }
      ]);
      schemas = [breadcrumbSchema].filter(Boolean);

      preRenderedHtml = `
        <div class="ssr-pre-rendered max-w-6xl mx-auto px-4 py-8">
          <h1 class="text-3xl font-extrabold text-slate-900 mb-2">${escapeHtml(catInfo.ta)}</h1>
          <p class="text-slate-600 mb-8">${escapeHtml(catInfo.en)} - முதலீட்டு ஆலோசனைகள் மற்றும் வழிகாட்டல்கள்.</p>
        </div>
      `;

    // 5. Professional Profile (/professionals/:id)
    } else if (cleanPath.startsWith('/professionals/')) {
      const profId = decodeURIComponent(pathname.replace('/professionals/', '').split('/')[0]);
      
      let profile = null;
      if (supabaseAdmin) {
        const { data } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', profId)
          .maybeSingle();
        profile = data;
      }

      if (profile) {
        const name = profile.display_name || 'Financial Specialist';
        const arn = profile.arn_number ? ` (ARN: ${profile.arn_number})` : '';
        pageTitle = `${name}${arn} - AMFI Registered Mutual Fund Specialist | முதலீட்டு திசை`;
        metaDescription = (profile.bio_ta || profile.bio || `${name} - Verified AMFI Registered Mutual Fund Advisor`).slice(0, 160);
        canonicalUrl = `${BASE_URL}/professionals/${profId}`;
        ogImage = profile.avatar_url || DEFAULT_OG_IMAGE;

        const profileSchema = generateProfileSchema(profile, canonicalUrl);
        schemas = [profileSchema].filter(Boolean);

        preRenderedHtml = `
          <div class="ssr-pre-rendered max-w-4xl mx-auto px-4 py-8">
            <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
              <img src="${ogImage}" alt="${escapeHtml(name)}" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-emerald-500" />
              <h1 class="text-2xl font-bold text-slate-900">${escapeHtml(name)}</h1>
              <p class="text-emerald-700 font-medium text-sm mt-1">${escapeHtml(profile.title || 'AMFI Registered Mutual Fund Specialist')}</p>
              ${profile.arn_number ? `<p class="text-xs text-slate-500 mt-1">ARN: ${escapeHtml(profile.arn_number)}</p>` : ''}
              <p class="text-slate-700 text-sm max-w-lg mx-auto mt-4 leading-relaxed">${escapeHtml(profile.bio_ta || profile.bio || '')}</p>
            </div>
          </div>
        `;
      }

    // 6. Tools (/calculator, /quiz)
    } else if (cleanPath === '/calculator') {
      pageTitle = `SIP & Mutual Fund Return Calculator (தமிழ்) | முதலீட்டு திசை`;
      metaDescription = 'Calculate your SIP, Lumpsum, and Goal Planning mutual fund returns with our instant Tamil financial calculator.';
      canonicalUrl = `${BASE_URL}/calculator`;
    } else if (cleanPath === '/quiz') {
      pageTitle = `Investment & Risk Profile Quiz (தமிழ்) | முதலீட்டு திசை`;
      metaDescription = 'Find your ideal asset allocation and investment personality with our quick 2-minute financial quiz in Tamil.';
      canonicalUrl = `${BASE_URL}/quiz`;
    }

    // Dynamic Meta Tags Construction
    const metaTagsBlock = `
  <!-- Primary Meta Tags -->
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="title" content="${escapeHtml(pageTitle)}" />
  <meta name="description" content="${escapeHtml(metaDescription)}" />

  <!-- Canonical & Bilingual Hreflang Tags -->
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="ta" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="en" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="Muthaleetu Thisai" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(metaDescription)}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="ta_IN" />
  <meta property="og:locale:alternate" content="en_US" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@budgetpadmanaban" />
  <meta name="twitter:creator" content="@budgetpadmanaban" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- Structured Data JSON-LD -->
  ${schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n  ')}
`;

    let finalHtml = template;

    // Replace <title> and existing description
    finalHtml = finalHtml.replace(/<title>[\s\S]*?<\/title>/i, '');
    finalHtml = finalHtml.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, '');

    // Inject our meta tags before </head>
    finalHtml = finalHtml.replace('</head>', `${metaTagsBlock}\n</head>`);

    // Inject pre-rendered semantic HTML inside #root
    if (preRenderedHtml) {
      finalHtml = finalHtml.replace(
        /<div id="root" class="([^"]*)"><\/div>/i,
        `<div id="root" class="$1">${preRenderedHtml}</div>`
      );
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
    return res.status(200).send(finalHtml);

  } catch (globalErr) {
    console.error('SSR Render Global Handler Error:', globalErr);
    const fallbackTemplate = await getIndexHtmlTemplate();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(fallbackTemplate);
  }
}
