import { useState, useEffect } from 'react';
import { newsData } from '../data/translations.js';

let liveArticlesCache = null;
let liveArticlesPromise = null;

export function cleanImageUrl(url, category = 'mutual-fund', fallbackUrl = null) {
  if (url && typeof url === 'string' && url !== '/favicon.svg') {
    // Preserve publisher uploaded data URLs
    if (url.startsWith('data:image')) {
      return url;
    }

    // Optimize Unsplash images
    if (url.includes('images.unsplash.com')) {
      let clean = url.replace(/&w=\d+/g, '&w=600').replace(/&q=\d+/g, '&q=75');
      if (!clean.includes('fm=webp')) clean += '&fm=webp';
      return clean;
    }

    // Optimize YouTube thumbnails to webp
    if (url.includes('img.youtube.com/vi/') || url.includes('i.ytimg.com/vi/')) {
      const match = url.match(/\/vi\/([^/?#]+)\//);
      if (match && match[1]) {
        return `https://i.ytimg.com/vi_webp/${match[1]}/mqdefault.webp`;
      }
    }

    return url;
  }

  if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl !== '/favicon.svg') {
    return fallbackUrl;
  }

  const cat = (category || '').toLowerCase();
  if (cat.includes('mutual') || cat.includes('sip')) {
    return 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=75&fm=webp';
  } else if (cat.includes('stock') || cat.includes('market') || cat.includes('ipo')) {
    return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=75&fm=webp';
  } else if (cat.includes('personal') || cat.includes('finance') || cat.includes('saving')) {
    return 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=75&fm=webp';
  } else if (cat.includes('tax') || cat.includes('retire')) {
    return 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=75&fm=webp';
  } else {
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=75&fm=webp';
  }
}

export function normalizeArticleItem(item, language = 'ta') {
  if (!item) return null;
  const isTamil = language === 'ta';
  const id = item.id || item.slug || Math.random().toString(36).substring(2, 9);
  const slug = item.slug || `article-${id}`;
  const titleTamil = item.titleTamil || item.title_ta || item.title || 'நிதி செய்திகள்';
  const titleEnglish = item.titleEnglish || item.title_en || item.title || titleTamil;
  const title = isTamil ? (titleTamil || titleEnglish) : (titleEnglish || titleTamil);
  const summaryTamil = item.summaryTamil || item.excerptTamil || item.excerpt_ta || item.summary || '';
  const summaryEnglish = item.summaryEnglish || item.excerptEnglish || item.excerpt_en || summaryTamil;
  const summary = isTamil ? (summaryTamil || summaryEnglish) : (summaryEnglish || summaryTamil);

  const rawThumb = item.coverImage || item.cover_image_url || item.thumbnail || item.thumbnail_url || item.imageUrl || '';
  const category = (item.category || 'mutual-fund').replace('_', '-');
  const thumbnail = cleanImageUrl(rawThumb, category);
  const publishedAt = item.publishedAt || item.published_at || item.created_at || new Date().toISOString();
  const authorName = item.authorName || item.author_name || (item.author_profile ? item.author_profile.full_name : null) || 'Budget Padmanaban CFP®';
  const authorRole = item.authorRole || item.author_role || (item.author_profile ? item.author_profile.designation : null) || 'Financial Advisor';
  const authorAvatar = item.authorAvatar || item.author_avatar || (item.author_profile ? item.author_profile.avatar_url : null) || null;
  const authorArn = item.authorArn || item.author_arn || (item.author_profile ? item.author_profile.arn_number : '') || '';
  const isLive = Boolean(item.created_at || item.published_at || item.body_ta || item.body);

  return {
    id,
    slug,
    titleTamil,
    titleEnglish,
    title,
    summaryTamil,
    summaryEnglish,
    summary,
    thumbnail,
    coverImage: thumbnail,
    category,
    publishedAt,
    authorName,
    authorRole,
    authorAvatar,
    authorArn,
    isLive
  };
}

export async function fetchCardArticles(limit = 12, sort = 'newest') {
  if (liveArticlesCache && liveArticlesCache.length > 0) {
    return liveArticlesCache;
  }
  if (liveArticlesPromise) {
    return liveArticlesPromise;
  }

  liveArticlesPromise = (async () => {
    try {
      // Check embedded server data
      if (typeof window !== 'undefined' && window.__INITIAL_DATA__?.articles) {
        liveArticlesCache = window.__INITIAL_DATA__.articles;
        return liveArticlesCache;
      }

      const res = await fetch(`/api/articles?view=card&limit=${limit}&sort=${sort}`);
      if (res.ok) {
        const json = await res.json();
        const list = json.data || [];
        if (Array.isArray(list) && list.length > 0) {
          liveArticlesCache = list;
          try {
            localStorage.setItem('muthaleetu_articles_cache', JSON.stringify(list));
          } catch (_) {}
          return list;
        }
      }
    } catch (err) {
      console.warn('Card articles fetch fallback:', err.message);
    } finally {
      liveArticlesPromise = null;
    }
    return newsData;
  })();

  return liveArticlesPromise;
}

export function useLiveArticles() {
  const [liveArticles, setLiveArticles] = useState(() => {
    if (typeof window !== 'undefined' && window.__INITIAL_DATA__?.articles) {
      return window.__INITIAL_DATA__.articles;
    }
    if (liveArticlesCache && liveArticlesCache.length > 0) {
      return liveArticlesCache;
    }
    try {
      const cached = localStorage.getItem('muthaleetu_articles_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [];
  });
  const [isLoading, setIsLoading] = useState(liveArticles.length === 0);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const list = await fetchCardArticles(12, 'newest');
      if (isMounted && Array.isArray(list) && list.length > 0) {
        setLiveArticles(list);
        setIsLoading(false);
      }
    };

    load();

    const handleUpdate = () => {
      liveArticlesCache = null;
      load();
    };

    window.addEventListener('articles_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('articles_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return { liveArticles, isLoading };
}
