/**
 * YouTube Data API v3 Ingestion Library
 * Optimized for low quota usage (1 quota unit for playlistItems.list polling)
 */

// In-memory cache for resolved channel metadata to avoid repetitive quota usage
const channelCache = new Map();

/**
 * Resolves any publisher YouTube input (Handle @name, channel URL /channel/UC..., or legacy user URL /user/...)
 * Rejects custom /c/ URLs with instructional guidance.
 */
export async function resolvePublisherYouTubeInput(input, apiKey) {
  if (!input || typeof input !== 'string' || !input.trim()) {
    return null;
  }

  const raw = input.trim();

  // 1. Detect custom /c/ URL
  if (raw.includes('/c/') || raw.match(/youtube\.com\/c\/[^\/\?]+/i)) {
    throw new Error(
      'Custom YouTube URLs (/c/...) cannot be resolved directly via API. Please find your @handle or Channel ID in YouTube Studio -> Settings -> Channel -> Advanced settings, and enter it (e.g. @yourhandle or UC...).'
    );
  }

  // 2. Direct Video URL format: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...
  const videoUrlMatch = raw.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (videoUrlMatch) {
    const videoId = videoUrlMatch[1];
    try {
      const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;
      const vRes = await fetch(vUrl);
      if (vRes.ok) {
        const vData = await vRes.json();
        const vItem = vData.items?.[0];
        if (vItem && vItem.snippet?.channelId) {
          const channelId = vItem.snippet.channelId;
          const uploadsPlaylistId = 'UU' + channelId.slice(2);
          const channelTitle = vItem.snippet.channelTitle || 'YouTube Creator';
          const result = {
            channelId,
            uploadsPlaylistId,
            channelTitle,
            channelThumbnail: vItem.snippet.thumbnails?.medium?.url || '',
            handle: `@${channelTitle.replace(/\s+/g, '')}`,
            initialVideoId: videoId
          };
          channelCache.set(channelId, result);
          return result;
        }
      }
    } catch (vErr) {
      console.warn(`[YouTube Resolver] Video URL lookup error: ${vErr.message}`);
    }
  }

  // 3. Direct Channel ID format: UC... (24 characters) or URL containing /channel/(UC[A-Za-z0-9_-]{22})
  const channelUrlMatch = raw.match(/(?:youtube\.com\/channel\/|channel\/|^)(UC[A-Za-z0-9_-]{22})/i);
  if (channelUrlMatch) {
    const channelId = channelUrlMatch[1];
    if (channelCache.has(channelId)) return channelCache.get(channelId);

    try {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const item = data.items?.[0];
        if (item) {
          const uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads || ('UU' + channelId.slice(2));
          const result = {
            channelId: item.id,
            uploadsPlaylistId,
            channelTitle: item.snippet?.title || 'YouTube Channel',
            channelThumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
            handle: item.snippet?.customUrl || `@${item.snippet?.title || channelId}`
          };
          channelCache.set(channelId, result);
          return result;
        }
      }
    } catch (fetchErr) {
      console.warn(`[YouTube Resolver] Direct channel lookup warning: ${fetchErr.message}`);
    }

    // Direct deterministic fallback for verified UC channel IDs
    const result = {
      channelId,
      uploadsPlaylistId: 'UU' + channelId.slice(2),
      channelTitle: `Channel ${channelId.slice(0, 8)}`,
      channelThumbnail: '',
      handle: channelId
    };
    channelCache.set(channelId, result);
    return result;
  }

  // 3. Legacy Username format: youtube.com/user/LegacyName
  const userMatch = raw.match(/youtube\.com\/user\/([A-Za-z0-9_-]+)/i);
  if (userMatch) {
    const username = userMatch[1];
    const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forUsername=${encodeURIComponent(username)}&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`YouTube channels.list by username failed (${res.status}): ${errorText}`);
    }
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) {
      throw new Error(`No YouTube channel found matching username: ${username}`);
    }

    const channelId = item.id;
    const uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads || ('UU' + channelId.slice(2));
    const result = {
      channelId,
      uploadsPlaylistId,
      channelTitle: item.snippet?.title || username,
      channelThumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
      handle: item.snippet?.customUrl || `@${username}`
    };
    channelCache.set(username, result);
    return result;
  }

  // 4. Handle format: @handle, https://youtube.com/@handle, or https://www.youtube.com/@handle
  let handle = raw;
  const handleMatch = raw.match(/(?:youtube\.com\/|youtu\.be\/)?@([A-Za-z0-9_.-]+)/i);
  if (handleMatch) {
    handle = `@${handleMatch[1]}`;
  } else if (!handle.startsWith('@') && !handle.includes('/')) {
    handle = `@${handle}`;
  }

  if (channelCache.has(handle)) {
    return channelCache.get(handle);
  }

  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(handle)}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);

  let data = null;
  if (res.ok) {
    data = await res.json();
  }

  let item = data?.items?.[0];

  // 5. If handle lookup returned nothing or failed, perform YouTube Channel Search by name/keyword
  if (!item && apiKey) {
    try {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(raw.replace(/^@/, ''))}&key=${encodeURIComponent(apiKey)}`;
      const sRes = await fetch(searchUrl);
      if (sRes.ok) {
        const sData = await sRes.json();
        const sItem = sData.items?.[0];
        if (sItem && (sItem.id?.channelId || sItem.snippet?.channelId)) {
          const channelId = sItem.id?.channelId || sItem.snippet?.channelId;
          const uploadsPlaylistId = 'UU' + channelId.slice(2);
          const result = {
            channelId,
            uploadsPlaylistId,
            channelTitle: sItem.snippet?.title || raw,
            channelThumbnail: sItem.snippet?.thumbnails?.medium?.url || sItem.snippet?.thumbnails?.default?.url || '',
            handle: `@${(sItem.snippet?.title || raw).replace(/\s+/g, '')}`
          };
          channelCache.set(raw, result);
          return result;
        }
      }
    } catch (searchErr) {
      console.warn(`[YouTube Resolver] Channel search fallback warning: ${searchErr.message}`);
    }
  }

  if (!item) {
    const cleanTitle = raw.replace(/^@/, '');
    const fallbackResult = {
      channelId: raw,
      uploadsPlaylistId: null,
      channelTitle: cleanTitle,
      channelThumbnail: '',
      handle: raw.startsWith('@') ? raw : `@${raw}`
    };
    channelCache.set(raw, fallbackResult);
    return fallbackResult;
  }

  const channelId = item.id;
  const uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads || ('UU' + channelId.slice(2));
  const result = {
    channelId,
    uploadsPlaylistId,
    channelTitle: item.snippet?.title || raw,
    channelThumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
    handle: item.snippet?.customUrl || handle
  };

  channelCache.set(raw, result);
  return result;
}

/**
 * Resolves a YouTube channel handle (e.g. @budgetpadmanaban_) to its Channel ID and Uploads Playlist ID.
 */
export async function resolveChannelId(handle, apiKey) {
  const res = await resolvePublisherYouTubeInput(handle, apiKey);
  return res;
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
