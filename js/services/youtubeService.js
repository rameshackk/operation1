import { videosData } from '../data/videos.js';
import { translateVideo } from './translationService.js';

/**
 * YouTube Data Service Layer (stale-while-revalidate pattern)
 * Prepares the application for a real YouTube Data API v3 backend connection.
 */

export async function getLatestVideos(language = "ta", category = "all") {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  let list = [...videosData];
  
  if (category && category !== "all") {
    list = list.filter(v => v.category === category);
  }

  return list.map(v => translateVideo(v, language));
}

export async function getVideoById(id, language = "ta") {
  await new Promise(resolve => setTimeout(resolve, 80));
  const video = videosData.find(v => v.id === id || v.youtubeId === id);
  return video ? translateVideo(video, language) : null;
}

export async function getRelatedVideos(currentId, language = "ta") {
  await new Promise(resolve => setTimeout(resolve, 100));
  const filtered = videosData.filter(v => v.id !== currentId && v.youtubeId !== currentId);
  return filtered.slice(0, 4).map(v => translateVideo(v, language));
}

export async function searchVideos(query, language = "ta") {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  
  const matches = videosData.filter(v => {
    return (
      v.titleTamil.toLowerCase().includes(q) ||
      v.titleEnglish.toLowerCase().includes(q) ||
      v.descriptionTamil.toLowerCase().includes(q) ||
      v.descriptionEnglish.toLowerCase().includes(q) ||
      v.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  return matches.map(v => translateVideo(v, language));
}
