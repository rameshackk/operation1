/**
 * YouTube Data API v3 Ingestion Library
 * Optimized for low quota usage (1 quota unit for playlistItems.list polling)
 */

// In-memory cache for resolved channel metadata to avoid repetitive quota usage
const channelCache = new Map();

/**
 * Resolves a YouTube channel handle (e.g. @budgetpadmanaban_) to its Channel ID and Uploads Playlist ID.
 * Calls channels.list with forHandle=<handle> and part=contentDetails.
 */
export async function resolveChannelId(handle, apiKey) {
  if (!handle) throw new Error('YouTube handle is required to resolve channel');
  
  const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;
  
  if (channelCache.has(formattedHandle)) {
    return channelCache.get(formattedHandle);
  }

  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(formattedHandle)}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`YouTube channels.list forHandle failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const channelItem = data.items?.[0];
  
  if (!channelItem) {
    throw new Error(`Could not find YouTube channel for handle: ${formattedHandle}`);
  }

  const channelId = channelItem.id;
  const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads || ('UU' + channelId.slice(2));
  const channelTitle = channelItem.snippet?.title || formattedHandle;

  const result = {
    channelId,
    uploadsPlaylistId,
    channelTitle,
    handle: formattedHandle
  };

  channelCache.set(formattedHandle, result);
  return result;
}

/**
 * Resolves the channel's uploads playlist ID.
 * Standard YouTube Channel IDs start with 'UC'. Replacing 'UC' with 'UU' gives the uploads playlist ID.
 */
export async function getUploadsPlaylistId(channelId, apiKey) {
  if (!channelId) throw new Error('YOUTUBE_CHANNEL_ID is required');
  
  if (channelId.startsWith('UC') && channelId.length >= 24) {
    return 'UU' + channelId.slice(2);
  }

  // Fallback to API lookup if non-standard channel ID format
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`YouTube channels.list failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const playlistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) {
    throw new Error(`Could not resolve uploads playlist for channel ID: ${channelId}`);
  }
  return playlistId;
}

/**
 * Polls the uploads playlist using playlistItems.list (1 quota unit).
 * Returns an array of video IDs from the first page.
 */
export async function fetchLatestUploadVideoIds(playlistId, apiKey, maxResults = 10) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(playlistId)}&maxResults=${maxResults}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`YouTube playlistItems.list failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return (data.items || []).map(item => item.snippet?.resourceId?.videoId).filter(Boolean);
}

/**
 * Paginates through all pages of the uploads playlist using nextPageToken
 * to fetch ALL historical video IDs from the channel.
 */
export async function fetchAllUploadVideoIds(playlistId, apiKey, maxPages = 50) {
  let allVideoIds = [];
  let pageToken = '';
  let pageCount = 0;

  do {
    pageCount++;
    const tokenParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(playlistId)}&maxResults=50${tokenParam}&key=${encodeURIComponent(apiKey)}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`YouTube playlistItems.list page ${pageCount} failed (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    const videoIds = (data.items || []).map(item => item.snippet?.resourceId?.videoId).filter(Boolean);
    allVideoIds.push(...videoIds);

    pageToken = data.nextPageToken || '';
  } while (pageToken && pageCount < maxPages);

  return allVideoIds;
}

/**
 * Fetches full metadata for specific video IDs using videos.list.
 */
export async function fetchVideoDetails(videoIds, apiKey) {
  if (!videoIds || videoIds.length === 0) return [];

  const idsParam = videoIds.join(',');
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${encodeURIComponent(idsParam)}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`YouTube videos.list failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return (data.items || []).map(item => parseVideoItem(item));
}

/**
 * Converts ISO 8601 duration (e.g. PT14M20S, PT1H2M3S, PT50S) to "MM:SS" / "H:MM:SS" and total seconds.
 */
export function parseIsoDuration(durationStr) {
  if (!durationStr) return { durationFormatted: '00:00', durationSeconds: 0 };

  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return { durationFormatted: '00:00', durationSeconds: 0 };

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return { durationFormatted: formatted, durationSeconds: totalSeconds };
}

/**
 * Classifies video category based on title, description, and tags keywords.
 */
export function classifyCategory(title = '', description = '', tags = []) {
  const text = `${title} ${description} ${tags.join(' ')}`.toLowerCase();

  if (text.includes('mutual fund') || text.includes('sip') || text.includes('flexi cap') || text.includes('small cap') || text.includes('large cap') || text.includes('elss')) {
    return 'mutual-funds';
  }
  if (text.includes('nifty') || text.includes('sensex') || text.includes('stock') || text.includes('share market') || text.includes('trading') || text.includes('ipo')) {
    return 'stocks';
  }
  if (text.includes('habit') || text.includes('budget') || text.includes('saving') || text.includes('discipline') || text.includes('fd') || text.includes('tax')) {
    return 'personal-finance';
  }
  return 'education';
}

function parseVideoItem(item) {
  const snippet = item.snippet || {};
  const contentDetails = item.contentDetails || {};
  const statistics = item.statistics || {};

  const { durationFormatted, durationSeconds } = parseIsoDuration(contentDetails.duration);
  const isShort = durationSeconds > 0 && durationSeconds <= 65;

  const thumbnail = snippet.thumbnails?.maxres?.url ||
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url ||
    snippet.thumbnails?.default?.url ||
    `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;

  return {
    youtubeId: item.id,
    titleTamil: snippet.title || '',
    descriptionTamil: snippet.description || '',
    publishedAt: snippet.publishedAt || new Date().toISOString(),
    thumbnailUrl: thumbnail,
    duration: durationFormatted,
    durationSeconds: durationSeconds,
    isShort: isShort,
    viewCount: parseInt(statistics.viewCount || '0', 10),
    category: classifyCategory(snippet.title, snippet.description, snippet.tags || []),
    tags: snippet.tags || [],
    trending: parseInt(statistics.viewCount || '0', 10) > 25000
  };
}
