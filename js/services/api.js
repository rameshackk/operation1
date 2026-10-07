import { videosData, newsData, professionalsData } from '../data/translations.js';
import { normalizeArticleItem } from './articles.js';

function translateVideo(video, language = "ta") {
  if (!video) return null;
  const isTamil = language === "ta";
  const title = isTamil ? (video.titleTamil || video.title) : (video.titleEnglish || video.title || video.titleTamil);
  const description = isTamil ? (video.descriptionTamil || video.description) : (video.descriptionEnglish || video.description || video.descriptionTamil);
  return {
    ...video,
    title: title || "Budget Padmanaban Video",
    description: description || "Financial Insights by Budget Padmanaban",
    duration: video.duration || (video.isShort ? "Short" : "10:00"),
    views: video.views || 18500,
    activeLang: language
  };
}

function translateNewsArticle(article, language = "ta") {
  if (!article) return null;
  const isTamil = language === "ta";
  return {
    ...article,
    title: isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil),
    summary: isTamil ? article.summaryTamil : (article.summaryEnglish || article.summaryTamil),
    content: isTamil ? article.contentTamil : (article.contentEnglish || article.contentTamil),
    activeLang: language
  };
}

/**
 * Normalises a video row into the shape the UI expects.
 * /api/videos already returns camelCase via formatVideoRow, but the snake_case
 * fallbacks keep this safe for raw rows and for the bundled static catalog.
 */
function normalizeVideoRow(v) {
  const youtubeId = v.youtubeId || v.youtube_id || v.id;
  return {
    ...v,
    youtubeId,
    titleTamil: v.title_ta || v.titleTamil || v.title,
    titleEnglish: v.title_en || v.titleEnglish || v.title,
    descriptionTamil: v.description_ta || v.descriptionTamil || v.description,
    descriptionEnglish: v.description_en || v.descriptionEnglish || v.description,
    thumbnail: v.thumbnail_url || v.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : ''),
    views: v.view_count || v.views || 0,
    publishedAt: v.published_at || v.publishedAt,
    tags: v.tags || []
  };
}

async function getTrendingPreviewVideos(language = "ta") {
  try {
    const res = await fetch('/api/videos/trending-preview?limit=8');
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(v => translateVideo(normalizeVideoRow(v), language));
      }
    }
  } catch (e) {
    console.warn('Public trending preview API fallback:', e);
  }

  // Fallback to top 8 items from static preview catalog
  return videosData.slice(0, 8).map(v => translateVideo(v, language));
}

async function getLatestVideos(language = "ta", category = "all", sort = "newest") {
  try {
    let headers = {};
    if (typeof window !== 'undefined' && window.supabase) {
      try {
        const sessionRes = await window.supabase.auth.getSession();
        const token = sessionRes?.data?.session?.access_token;
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) { }
    }

    const url = `/api/videos?limit=1000&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`;
    const res = await fetch(url, { headers });
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(v => translateVideo(normalizeVideoRow(v), language));
      }
    }
  } catch (e) {
    console.warn('Using local video dataset fallback:', e);
  }

  let list = [...videosData];
  if (category && category !== "all") {
    list = list.filter(v => v.category === category);
  }

  if (sort === "oldest") {
    list.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
  } else {
    list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  return list.map(v => translateVideo(v, language));
}

async function getVideoById(id, language = "ta") {
  if (!id) return null;

  // Legacy catalog ids (vid-bp-XXX) predate the database migration, so resolve them
  // to a real YouTube id up front — the API only looks videos up by youtube_id.
  const staticMatch = videosData.find(v => v.id === id || v.youtubeId === id || v.youtube_id === id);
  const lookupId = (staticMatch && staticMatch.youtubeId) ? staticMatch.youtubeId : id;

  // 1. The database is the source of truth: try it first so freshly ingested videos
  //    and refreshed view counts resolve instead of being masked by the bundled copy.
  try {
    const res = await fetch(`/api/videos/${encodeURIComponent(lookupId)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        const v = json.data;
        const ytId = v.youtube_id || v.youtubeId || (v.id && v.id.length === 11 ? v.id : '_fvxhThYO70');
        return translateVideo({
          id: ytId,
          dbId: v.id,
          youtubeId: ytId,
          titleTamil: v.title_ta || v.titleTamil || v.title,
          titleEnglish: v.title_en || v.titleEnglish || v.title,
          descriptionTamil: v.description_ta || v.descriptionTamil || v.description,
          descriptionEnglish: v.description_en || v.descriptionEnglish || v.description,
          thumbnail: v.thumbnail_url || v.thumbnail || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
          duration: v.duration || '10:00',
          views: v.view_count || v.views || 18500,
          publishedAt: v.published_at || v.publishedAt || new Date().toISOString(),
          category: v.category || 'mutual-funds',
          tags: v.tags || []
        }, language);
      }
    }
  } catch (e) {
    console.warn('API fetch video detail fallback:', e);
  }

  // 2. Fall back to the bundled catalog only when the API is unreachable or has no row.
  if (staticMatch) {
    const ytId = (staticMatch.youtubeId && staticMatch.youtubeId.length === 11) ? staticMatch.youtubeId : (staticMatch.id && staticMatch.id.length === 11 ? staticMatch.id : 'GizYMQfl9CY');
    return translateVideo({ ...staticMatch, youtubeId: ytId }, language);
  }

  // 3. Fallback: If id is a valid 11-char YouTube ID (or fallback to latest channel video)
  const is11CharYt = typeof id === 'string' && id.length === 11 && !id.includes('-');
  const safeYtId = is11CharYt ? id : '_fvxhThYO70';

  return translateVideo({
    id: safeYtId,
    youtubeId: safeYtId,
    titleTamil: 'முதலீட்டு காணொளி (Budget Padmanaban)',
    titleEnglish: 'Investment Guide Video',
    descriptionTamil: 'YouTube இல் Budget Padmanaban வழங்கும் நிதி வழிகாட்டுதல் காணொளி.',
    descriptionEnglish: 'Financial investment guide by Budget Padmanaban.',
    thumbnail: `https://img.youtube.com/vi/${safeYtId}/hqdefault.jpg`,
    duration: '10:00',
    views: 24500,
    publishedAt: new Date().toISOString(),
    category: 'mutual-funds',
    tags: ['mutual-funds', 'personal-finance']
  }, language);
}

async function getRelatedVideos(currentId, language = "ta", category = "all") {
  try {
    const res = await fetch(`/api/videos?limit=12&sort=newest&category=${encodeURIComponent(category || 'all')}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        const related = json.data
          .map(normalizeVideoRow)
          .filter(v => v.id !== currentId && v.youtubeId !== currentId);
        if (related.length > 0) {
          return related.slice(0, 4).map(v => translateVideo(v, language));
        }
      }
    }
  } catch (e) {
    console.warn('Related videos API fallback:', e);
  }

  const filtered = videosData.filter(v => v.id !== currentId && v.youtubeId !== currentId);
  return filtered.slice(0, 4).map(v => translateVideo(v, language));
}

async function searchAllContent(query, language = "ta") {
  if (!query || !query.trim()) {
    return { all: [], articles: [], videos: [], news: [], publishers: [] };
  }

  const rawQ = query.trim();
  const q = rawQ.toLowerCase();
  const qTerms = q.split(/\s+/).filter(Boolean);

  // Parallel asynchronous fetching across all platform resources
  const [videosRes, articlesRes, publishersRes, newsRes] = await Promise.allSettled([
    fetch(`/api/videos?limit=80&search=${encodeURIComponent(rawQ)}`).then(r => r.ok ? r.json() : null),
    fetch(`/api/articles?limit=50&search=${encodeURIComponent(rawQ)}`).then(r => r.ok ? r.json() : null),
    fetch(`/api/publishers?limit=30&search=${encodeURIComponent(rawQ)}`).then(r => r.ok ? r.json() : null),
    fetch(`/api/news?limit=40&search=${encodeURIComponent(rawQ)}`).then(r => r.ok ? r.json() : null)
  ]);

  // 1. VIDEOS POOL
  let videoPool = [];
  if (videosRes.status === 'fulfilled' && videosRes.value?.status === 'success' && Array.isArray(videosRes.value?.data)) {
    videoPool = videosRes.value.data.map(normalizeVideoRow);
  }
  if (videoPool.length === 0 && typeof videosData !== 'undefined') {
    videoPool = videosData;
  }

  // 2. ARTICLES & NEWS POOL
  let articlesPool = [];
  if (articlesRes.status === 'fulfilled' && articlesRes.value?.status === 'success' && Array.isArray(articlesRes.value?.data)) {
    articlesPool = articlesRes.value.data;
  }
  if (typeof newsData !== 'undefined') {
    const existingSlugs = new Set(articlesPool.map(a => a.slug));
    newsData.forEach(n => {
      if (!existingSlugs.has(n.slug)) {
        articlesPool.push(n);
      }
    });
  }
  if (newsRes.status === 'fulfilled' && newsRes.value?.status === 'success' && Array.isArray(newsRes.value?.data)) {
    newsRes.value.data.forEach(n => {
      articlesPool.push({
        id: n.id,
        isNews: true,
        isExternal: true,
        sourceUrl: n.sourceUrl,
        sourceName: n.sourceName,
        titleTamil: n.titleTamil,
        titleEnglish: n.titleEnglish,
        summaryTamil: n.summaryTamil,
        summaryEnglish: n.summaryEnglish,
        imageUrl: n.imageUrl,
        category: n.category || 'news',
        publishedAt: n.publishedAt
      });
    });
  }

  // 3. PUBLISHERS POOL
  let publishersPool = [];
  if (publishersRes.status === 'fulfilled' && publishersRes.value?.status === 'success' && Array.isArray(publishersRes.value?.data)) {
    publishersPool = publishersRes.value.data;
  }
  if (typeof professionalsData !== 'undefined') {
    const existingPubIds = new Set(publishersPool.map(p => p.id));
    professionalsData.forEach(p => {
      if (!existingPubIds.has(p.id)) {
        publishersPool.push(p);
      }
    });
  }

  // --- SCORE & RANK VIDEOS ---
  const scoredVideos = videoPool.map(v => {
    let score = 0;
    const titleT = (v.titleTamil || v.title || "").toLowerCase().trim();
    const titleE = (v.titleEnglish || v.title || "").toLowerCase().trim();
    const descT = (v.descriptionTamil || v.description || "").toLowerCase();
    const descE = (v.descriptionEnglish || v.description || "").toLowerCase();
    const cat = (v.category || "").toLowerCase();
    const channel = (v.channelName || "").toLowerCase();
    const tags = (v.tags || []).join(' ').toLowerCase();

    // SEO EXACT MATCH (+350)
    if (titleT === q || titleE === q) score += 350;
    else if (titleT.startsWith(q) || titleE.startsWith(q)) score += 180;
    else if (titleT.includes(q) || titleE.includes(q)) score += 120;

    if (channel.includes(q)) score += 80;
    if (cat.includes(q) || q.includes(cat.replace('-', ' '))) score += 70;
    if (tags.includes(q)) score += 60;

    qTerms.forEach(term => {
      if (titleT.includes(term) || titleE.includes(term)) score += 40;
      if (descT.includes(term) || descE.includes(term)) score += 20;
      if (tags.includes(term)) score += 15;
    });

    if (score === 0) return null;
    const translated = translateVideo(v, language);
    return {
      ...translated,
      contentType: 'video',
      score
    };
  }).filter(Boolean);

  // --- SCORE & RANK ARTICLES & NEWS ---
  const scoredArticles = [];
  const scoredNews = [];

  articlesPool.forEach(a => {
    let score = 0;
    const titleT = (a.titleTamil || a.title_ta || a.title || "").toLowerCase().trim();
    const titleE = (a.titleEnglish || a.title_en || a.title || "").toLowerCase().trim();
    const sumT = (a.summaryTamil || a.excerptTamil || a.excerpt_ta || a.summary || "").toLowerCase();
    const sumE = (a.summaryEnglish || a.excerptEnglish || a.excerpt_en || a.summary || "").toLowerCase();
    const cat = (a.category || "").toLowerCase();
    const author = (a.authorName || a.author_name || "").toLowerCase();
    const slug = (a.slug || "").toLowerCase();

    // SEO EXACT MATCH (+350)
    if (titleT === q || titleE === q || slug === q) score += 350;
    else if (titleT.startsWith(q) || titleE.startsWith(q)) score += 180;
    else if (titleT.includes(q) || titleE.includes(q)) score += 120;

    if (cat.includes(q) || q.includes(cat.replace('-', ' '))) score += 70;
    if (author.includes(q)) score += 50;

    qTerms.forEach(term => {
      if (titleT.includes(term) || titleE.includes(term)) score += 40;
      if (sumT.includes(term) || sumE.includes(term)) score += 25;
      if (cat.includes(term)) score += 15;
    });

    if (score === 0) return;
    const isNews = cat === 'news' || a.isNews === true || (a.category && a.category.includes('news'));
    const normalized = normalizeArticleItem(a, language);
    const item = {
      ...normalized,
      contentType: isNews ? 'news' : 'article',
      score
    };

    if (isNews) scoredNews.push(item);
    else scoredArticles.push(item);
  });

  // --- SCORE & RANK PUBLISHER PROFILES ---
  const scoredPublishers = publishersPool.map(p => {
    let score = 0;
    const nameT = (p.display_name || p.nameTamil || p.nameEnglish || "").toLowerCase().trim();
    const nameE = (p.display_name || p.nameEnglish || p.nameTamil || "").toLowerCase().trim();
    const titleT = (p.title || p.titleTamil || p.titleEnglish || "").toLowerCase();
    const titleE = (p.title || p.titleEnglish || p.titleTamil || "").toLowerCase();
    const arn = (p.arn_number || p.arnNumber || "").toLowerCase();
    const bioT = (p.bio_ta || p.bioTamil || p.bio || "").toLowerCase();
    const bioE = (p.bio || p.bioEnglish || "").toLowerCase();
    const specialties = (Array.isArray(p.specialties) ? p.specialties.join(' ') : (Array.isArray(p.specializations) ? p.specializations.map(s => s.en || s.ta).join(' ') : '')).toLowerCase();

    // SEO EXACT MATCH (+400 for publisher name / ARN exact hit)
    if (nameT === q || nameE === q || arn === q) score += 400;
    else if (nameT.startsWith(q) || nameE.startsWith(q) || arn.startsWith(q)) score += 200;
    else if (nameT.includes(q) || nameE.includes(q)) score += 140;

    if (arn.includes(q)) score += 100;
    if (titleT.includes(q) || titleE.includes(q)) score += 80;
    if (specialties.includes(q)) score += 70;

    qTerms.forEach(term => {
      if (nameT.includes(term) || nameE.includes(term)) score += 50;
      if (titleT.includes(term) || titleE.includes(term)) score += 30;
      if (specialties.includes(term)) score += 20;
      if (bioT.includes(term) || bioE.includes(term)) score += 15;
    });

    if (score === 0) return null;

    const displayName = p.display_name || p.nameEnglish || p.nameTamil || 'Financial Advisor';
    const isFounder = p.id === 'fe41c6c1-647f-4f8c-81b8-c39ca3666426' || displayName.toLowerCase().includes('budget padmanaban');
    const avatar = p.avatar_url || p.avatar || (isFounder ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f59e0b&color=0f172a&bold=true`);

    return {
      id: p.id || p.slug,
      slug: p.slug || p.id,
      title: displayName,
      name: displayName,
      avatar,
      thumbnail: avatar,
      arnNumber: p.arn_number || p.arnNumber || '',
      designation: p.title || (language === 'ta' ? (isFounder ? 'நிறுவனர் & தலைமை நிதி ஆய்வாளர்' : 'பதிவுசெய்யப்பட்ட மியூச்சுவல் ஃபண்ட் விநியோகஸ்தர்') : (isFounder ? 'Founder & Chief Market Commentator' : 'AMFI Registered Mutual Fund Distributor')),
      summary: p.bio || (language === 'ta' ? (p.bio_ta || 'முதலீட்டாளர்களுக்கு வழிகாட்டும் AMFI பதிவுசெய்த விநியோகஸ்தர்') : 'Certified AMFI mutual fund distributor dedicated to investor wealth creation.'),
      category: 'publisher',
      contentType: 'publisher',
      articleCount: p.article_count || p.stats?.articles || 0,
      videoCount: p.video_count || p.stats?.masterclasses || 0,
      score
    };
  }).filter(Boolean);

  // Combine and sort by highest SEO score first
  const allResults = [...scoredPublishers, ...scoredArticles, ...scoredNews, ...scoredVideos].sort((a, b) => b.score - a.score);

  return {
    all: allResults,
    articles: scoredArticles.sort((a, b) => b.score - a.score),
    videos: scoredVideos.sort((a, b) => b.score - a.score),
    news: scoredNews.sort((a, b) => b.score - a.score),
    publishers: scoredPublishers.sort((a, b) => b.score - a.score)
  };
}

async function searchVideos(query, language = "ta") {
  const resultObj = await searchAllContent(query, language);
  return resultObj.videos || [];
}

let publishersPromise = null;
async function getCachedPublishers(limit = 50) {
  if (publishersPromise) return publishersPromise;
  publishersPromise = fetch(`/api/publishers?limit=${limit}`)
    .then(r => r.ok ? r.json() : null)
    .then(json => json?.status === 'success' && Array.isArray(json.data) ? json.data : [])
    .catch(err => {
      console.warn('Publishers fetch fallback note:', err);
      return [];
    });
  return publishersPromise;
}

export {
  translateVideo,
  translateNewsArticle,
  normalizeVideoRow,
  getTrendingPreviewVideos,
  getLatestVideos,
  getVideoById,
  getRelatedVideos,
  searchAllContent,
  searchVideos,
  getCachedPublishers
};

