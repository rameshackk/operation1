import { useState, useEffect } from 'react';
import { newsData } from '../data/translations.js';

let liveArticlesCache = null;
let liveArticlesPromise = null;

export function cleanImageUrl(url, category = 'mutual-fund', fallbackUrl = null) {
  if (url && typeof url === 'string' && url.trim() && url !== '/favicon.svg') {
    const trimmed = url.trim();
    // Preserve publisher uploaded data URLs
    if (trimmed.startsWith('data:image')) {
      return trimmed;
    }

    // Optimize Unsplash images
    if (trimmed.includes('images.unsplash.com')) {
      let clean = trimmed.replace(/&w=\d+/g, '&w=600').replace(/&q=\d+/g, '&q=75');
      if (!clean.includes('fm=webp')) clean += '&fm=webp';
      return clean;
    }

    // Optimize YouTube thumbnails to webp
    if (trimmed.includes('img.youtube.com/vi/') || trimmed.includes('i.ytimg.com/vi/')) {
      const match = trimmed.match(/\/vi\/([^/?#]+)\//);
      if (match && match[1]) {
        return `https://i.ytimg.com/vi_webp/${match[1]}/mqdefault.webp`;
      }
    }

    return trimmed;
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

  const rawThumb = item.cover_image_url || item.coverImage || item.thumbnail_url || item.thumbnail || item.imageUrl || '';
  const category = (item.category || 'mutual-fund').replace('_', '-');
  const thumbnail = cleanImageUrl(rawThumb, category);
  const publishedAt = item.publishedAt || item.published_at || item.created_at || '2025-01-01T00:00:00.000Z';
  const authorName = item.authorName || item.author_name || (item.author_profile ? item.author_profile.full_name : null) || 'Budget Padmanaban CFP®';
  const authorRole = item.authorRole || item.author_role || (item.author_profile ? item.author_profile.designation : null) || 'Financial Advisor';
  const authorAvatar = item.authorAvatar || item.author_avatar || (item.author_profile ? item.author_profile.avatar_url : null) || null;
  const authorArn = item.authorArn || item.author_arn || (item.author_profile ? item.author_profile.arn_number : '') || '';
  const isLive = Boolean(item.created_at || item.published_at || item.body_ta || item.body);
  const views = Number(item.views_count ?? item.views ?? item.view_count ?? item.read_count ?? 0);

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
    isLive,
    views,
    views_count: views
  };
}

export async function fetchCardArticles(limit = 24, sort = 'newest', forceRefresh = false) {
  if (!forceRefresh && liveArticlesCache && liveArticlesCache.length > 0) {
    return liveArticlesCache;
  }
  if (!forceRefresh && liveArticlesPromise) {
    return liveArticlesPromise;
  }

  liveArticlesPromise = (async () => {
    try {
      // 1. Consume early preload promise from <head> if available on initial load
      if (!forceRefresh && typeof window !== 'undefined' && window.__HOME__) {
        try {
          const homeResult = await window.__HOME__;
          const homeList = homeResult?.data?.articles || homeResult?.articles;
          if (Array.isArray(homeList) && homeList.length > 0) {
            homeList.sort((a, b) => {
              const tA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
              const tB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
              return tB - tA;
            });
            liveArticlesCache = homeList;
            try {
              sessionStorage.setItem('muthaleetu_articles_cache', JSON.stringify(homeList));
            } catch (_) {}
          }
        } catch (_) {}
      }

      const res = await fetch(`/api/articles?view=card&limit=${limit}&sort=${sort}`);
      if (res.ok) {
        const json = await res.json();
        const list = json.data || [];
        if (Array.isArray(list) && list.length > 0) {
          // Sort strictly descending by publication/upload date (newest first)
          list.sort((a, b) => {
            const tA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
            const tB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
            return tB - tA;
          });
          liveArticlesCache = list;
          try {
            sessionStorage.setItem('muthaleetu_articles_cache', JSON.stringify(list));
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

    if (liveArticlesCache && liveArticlesCache.length > 0) {
      return liveArticlesCache;
    }

    if (typeof window !== 'undefined' && window.__INITIAL_DATA__?.articles) {
      const initial = [...window.__INITIAL_DATA__.articles];
      initial.sort((a, b) => {
        const tA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
        const tB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
        return tB - tA;
      });
      return initial;
    }

    return newsData;
  })();

  return liveArticlesPromise;
}

export function useLiveArticles() {
  const [liveArticles, setLiveArticles] = useState(() => {
    if (liveArticlesCache && liveArticlesCache.length > 0) {
      return liveArticlesCache;
    }
    try {
      const cached = localStorage.getItem('muthaleetu_articles_cache') || sessionStorage.getItem('muthaleetu_articles_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.sort((a, b) => {
            const tA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
            const tB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
            return tB - tA;
          });
          return parsed;
        }
      }
    } catch (_) {}
    if (typeof window !== 'undefined' && window.__INITIAL_DATA__?.articles) {
      return window.__INITIAL_DATA__.articles;
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(liveArticles.length === 0);

  useEffect(() => {
    let isMounted = true;
    const load = async (force = false) => {
      const list = await fetchCardArticles(24, 'newest', force);
      if (isMounted && Array.isArray(list) && list.length > 0) {
        setLiveArticles(list);
        setIsLoading(false);
      }
    };

    // Always fetch latest data from API on mount
    load(true);

    const handleUpdate = () => {
      liveArticlesCache = null;
      load(true);
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
