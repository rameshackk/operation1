import { useState, useEffect } from 'react';
import { videosData } from '../data/translations.js';
import { normalizeVideoRow, translateVideo } from './api.js';

const memoryCache = new Map();
const inflightPromises = new Map();

function getCachedVideos(key, language) {
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`mt_vids_swr_${key}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const list = parsed.map(v => translateVideo(normalizeVideoRow(v), language));
          memoryCache.set(key, list);
          return list;
        }
      }
    } catch (e) {}
  }
  return null;
}

function setCachedVideos(key, list) {
  memoryCache.set(key, list);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`mt_vids_swr_${key}`, JSON.stringify(list.slice(0, 100)));
    } catch (e) {}
  }
}

export async function fetchVideos(category = 'all', sort = 'newest', limit = 12, language = 'ta') {
  const cacheKey = `${category}-${sort}-${limit}-${language}`;

  if (inflightPromises.has(cacheKey)) {
    return inflightPromises.get(cacheKey);
  }

  const promise = (async () => {
    try {
      // 1. Consume early preload promise from <head> if available on home feed
      if (category === 'all' && sort === 'newest' && typeof window !== 'undefined' && window.__HOME__) {
        try {
          const homeResult = await window.__HOME__;
          const homeVids = homeResult?.data?.videos || homeResult?.videos;
          if (Array.isArray(homeVids) && homeVids.length > 0) {
            const list = homeVids.slice(0, limit).map(v => translateVideo(normalizeVideoRow(v), language));
            setCachedVideos(cacheKey, list);
            return list;
          }
        } catch (_) {}
      }

      const url = `/api/videos?limit=${limit}&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          const list = json.data.map(v => translateVideo(normalizeVideoRow(v), language));
          setCachedVideos(cacheKey, list);
          return list;
        }
      }
    } catch (e) {
      console.warn('[Videos SWR] Silent fetch fallback:', e.message);
    } finally {
      inflightPromises.delete(cacheKey);
    }

    // Cached / Static Fallback
    const cached = getCachedVideos(cacheKey, language);
    if (cached && cached.length > 0) return cached;

    let list = [...videosData];
    if (category && category !== 'all') {
      list = list.filter(v => v.category === category);
    }
    const result = list.slice(0, limit).map(v => translateVideo(v, language));
    setCachedVideos(cacheKey, result);
    return result;
  })();

  inflightPromises.set(cacheKey, promise);
  return promise;
}

export function useVideos(category = 'all', sort = 'newest', limit = 12, language = 'ta') {
  const cacheKey = `${category}-${sort}-${limit}-${language}`;

  // Instant 0ms Initial State: SWR Cache -> Initial Prerender -> Static Catalog
  const [videos, setVideos] = useState(() => {
    const cached = getCachedVideos(cacheKey, language);
    if (cached && cached.length > 0) {
      return cached;
    }
    if (typeof window !== 'undefined' && window.__INITIAL_DATA__?.videos && category === 'all') {
      const initial = window.__INITIAL_DATA__.videos.map(v => translateVideo(normalizeVideoRow(v), language));
      if (initial.length > 0) return initial;
    }
    let list = [...videosData];
    if (category && category !== 'all') {
      list = list.filter(v => v.category === category);
    }
    return list.slice(0, limit).map(v => translateVideo(v, language));
  });

  const [isLoading, setIsLoading] = useState(false);

  // Background SWR Revalidation: Silently checks for new YouTube syncs without freezing UI
  useEffect(() => {
    let isMounted = true;
    const revalidate = async () => {
      const data = await fetchVideos(category, sort, limit, language);
      if (isMounted && data && data.length > 0) {
        setVideos(data);
        setIsLoading(false);
      }
    };
    revalidate();
    return () => {
      isMounted = false;
    };
  }, [category, sort, limit, language]);

  return { videos, isLoading };
}

