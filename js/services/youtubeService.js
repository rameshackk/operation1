import { videosData } from '../data/videos.js';
import { translateVideo } from '../utils/translations.js';

export async function getVideos(language = "ta", category = "all", sort = "newest") {
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

export async function getVideoById(id, language = "ta") {
  if (!id) return null;

  // 1. Try local dataset
  let video = videosData.find(v => v.id === id || v.youtubeId === id || v.youtube_id === id);
  if (video) return translateVideo(video, language);

  // 2. Try fetching from backend API
  try {
    const res = await fetch(`/api/videos/${encodeURIComponent(id)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        const v = json.data;
        return translateVideo({
          id: v.id || v.youtube_id || id,
          youtubeId: v.youtube_id || v.youtubeId || id,
          titleTamil: v.title_ta || v.titleTamil || v.title,
          titleEnglish: v.title_en || v.titleEnglish || v.title,
          descriptionTamil: v.description_ta || v.descriptionTamil || v.description,
          descriptionEnglish: v.description_en || v.descriptionEnglish || v.description,
          thumbnail: v.thumbnail_url || v.thumbnail || `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
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

  // 3. Fallback: If id is a valid YouTube ID, synthesize video item so player works immediately
  if (typeof id === 'string' && id.length >= 8) {
    return translateVideo({
      id: id,
      youtubeId: id,
      titleTamil: 'முதலீட்டு காணொளி (YouTube Video)',
      titleEnglish: 'Investment Guide Video',
      descriptionTamil: 'YouTube இல் Budget Padmanaban வழங்கும் நிதி வழிகாட்டுதல் காணொளி.',
      descriptionEnglish: 'Financial investment guide by Budget Padmanaban.',
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      duration: '10:00',
      views: 24500,
      publishedAt: new Date().toISOString(),
      category: 'mutual-funds',
      tags: ['mutual-funds', 'personal-finance']
    }, language);
  }

  return null;
}

export async function getRelatedVideos(currentId, language = "ta") {
  await new Promise(resolve => setTimeout(resolve, 30));
  const filtered = videosData.filter(v => v.id !== currentId && v.youtubeId !== currentId);
  return filtered.slice(0, 4).map(v => translateVideo(v, language));
}

export async function searchVideos(query, language = "ta") {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const matches = videosData.filter(v => {
    const titleT = (v.titleTamil || v.title || "").toLowerCase();
    const titleE = (v.titleEnglish || v.title || "").toLowerCase();
    const descT = (v.descriptionTamil || v.description || "").toLowerCase();
    const descE = (v.descriptionEnglish || v.description || "").toLowerCase();
    return (
      titleT.includes(q) ||
      titleE.includes(q) ||
      descT.includes(q) ||
      descE.includes(q) ||
      (v.tags && v.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  });
  return matches.map(v => translateVideo(v, language));
}
