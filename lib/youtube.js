import { getPgPool } from './db.js';
import { supabaseAdmin } from './supabase.js';

export const ALLOWED_CATEGORIES = [
  'Mutual Funds',
  'SIP & Planning',
  'Stock Market',
  'Insurance',
  'Retirement',
  'Children & Education',
  'Gold & Bonds',
  'Tax',
  'Others'
];

export const FORBIDDEN_COMPLIANCE_WORDS = [
  'advisor',
  'adviser',
  'wealth manager',
  'guaranteed',
  'assured',
  'consultant'
];

/**
 * Parse ISO 8601 Duration (e.g. PT1H2M30S, PT15M33S, PT45S) to seconds.
 */
export function parseIsoDuration(durationStr) {
  if (!durationStr || typeof durationStr !== 'string') return 0;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format seconds to duration string (e.g. "14:20" or "1:05:30").
 */
export function formatDurationSeconds(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '0:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${minStr}:${secStr}`;
  }
  return `${minutes}:${secStr}`;
}

/**
 * Check if video is YouTube Short via HTTP check and fallback heuristics.
 */
export async function checkIfShort(videoId, durationSeconds) {
  if (durationSeconds > 180) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: 'HEAD',
      redirect: 'manual',
      signal: controller.signal
    });
    clearTimeout(timeout);
    // If it's a short, YouTube returns 200 OK. If it's a regular video, it redirects (303/302).
    if (res.status === 200) return true;
    if (res.status >= 300 && res.status < 400) return false;
  } catch (err) {
    // Network/timeout fallback
  }

  return durationSeconds > 0 && durationSeconds <= 65;
}

/**
 * Strip compliance violations from AI generated text.
 */
export function sanitizeCompliance(text) {
  if (!text) return '';
  let cleaned = text;
  for (const word of FORBIDDEN_COMPLIANCE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '');
  }
  return cleaned.replace(/\s{2,}/g, ' ').trim();
}

/**
 * AI Enrichment with Gemini API.
 */
export async function enrichVideoWithGemini(title, description) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return {
      category: 'Mutual Funds',
      summary_ta: '',
      summary_en: ''
    };
  }

  const prompt = `You are a strict compliance-trained financial content categorizer and summarizer for Muthaleetu Thisai (Tamil YouTube channel @budgetpadmanaban_).
Analyze this YouTube video:
Title: ${title}
Description: ${(description || '').slice(0, 1000)}

Instructions:
1. Choose ONE category strictly from this exact allowed list:
["Mutual Funds", "SIP & Planning", "Stock Market", "Insurance", "Retirement", "Children & Education", "Gold & Bonds", "Tax", "Others"]

2. Write a crisp 2-line summary in Tamil (summary_ta) explaining the key investor takeaway.
3. Write a crisp 2-line summary in English (summary_en) explaining the key investor takeaway.

STRICT COMPLIANCE RULES:
- NEVER use the forbidden words: "advisor", "adviser", "wealth manager", "guaranteed", "assured", "consultant".
- NEVER promise returns or give direct investment advice. Focus purely on educational and analytical takeaways.

Return ONLY valid JSON matching this schema:
{
  "category": "Mutual Funds",
  "summary_ta": "...",
  "summary_en": "..."
}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          maxOutputTokens: 600
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (rawText) {
        const parsed = JSON.parse(rawText);
        const validCategory = ALLOWED_CATEGORIES.includes(parsed.category) ? parsed.category : 'Others';
        return {
          category: validCategory,
          summary_ta: sanitizeCompliance(parsed.summary_ta || ''),
          summary_en: sanitizeCompliance(parsed.summary_en || '')
        };
      }
    }
  } catch (err) {
    console.warn('[Gemini Enrichment Note]:', err.message);
  }

  return {
    category: 'Mutual Funds',
    summary_ta: '',
    summary_en: ''
  };
}

/**
 * Get or set app settings key.
 */
export async function getAppSetting(key) {
  const pool = getPgPool();
  if (pool) {
    try {
      const res = await pool.query('SELECT value FROM public.app_settings WHERE key = $1', [key]);
      if (res.rows.length > 0) return res.rows[0].value;
    } catch (err) {
      console.warn('[App Setting PG error]:', err.message);
    }
  }

  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('app_settings')
        .select('value')
        .eq('key', key)
        .single();
      if (data) return data.value;
    } catch {}
  }
  return null;
}

export async function setAppSetting(key, value) {
  const pool = getPgPool();
  if (pool) {
    try {
      await pool.query(
        `INSERT INTO public.app_settings (key, value, updated_at) 
         VALUES ($1, $2, now()) 
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, JSON.stringify(value)]
      );
      return true;
    } catch (err) {
      console.warn('[App Setting PG save error]:', err.message);
    }
  }

  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('app_settings').upsert({ key, value, updated_at: new Date().toISOString() });
      return true;
    } catch {}
  }
  return false;
}

// In-memory cache for resolved channel metadata
const channelCache = new Map();

/**
 * Resolves any publisher YouTube input (Handle @name, channel URL, or video URL)
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

  // 2. Direct Video URL format
  const videoUrlMatch = raw.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (videoUrlMatch && apiKey) {
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

  // 3. Direct Channel ID format
  const channelUrlMatch = raw.match(/(?:youtube\.com\/channel\/|channel\/|^)(UC[A-Za-z0-9_-]{22})/i);
  if (channelUrlMatch) {
    const channelId = channelUrlMatch[1];
    if (channelCache.has(channelId)) return channelCache.get(channelId);

    if (apiKey) {
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
    }

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

  // 4. Legacy Username format
  const userMatch = raw.match(/youtube\.com\/user\/([A-Za-z0-9_-]+)/i);
  if (userMatch && apiKey) {
    const username = userMatch[1];
    try {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forUsername=${encodeURIComponent(username)}&key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const item = data.items?.[0];
        if (item) {
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
      }
    } catch {}
  }

  // 5. Handle format: @handle
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

  if (apiKey) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(handle)}&key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const item = data?.items?.[0];
        if (item) {
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
      }

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
      console.warn(`[YouTube Resolver] Channel search error: ${searchErr.message}`);
    }
  }

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

export async function resolveChannelId(handle, apiKey) {
  return resolvePublisherYouTubeInput(handle, apiKey);
}

export async function getUploadsPlaylistId(channelId, apiKey) {
  if (!channelId) throw new Error('YOUTUBE_CHANNEL_ID is required');
  if (channelId.startsWith('UC') && channelId.length >= 24) {
    return 'UU' + channelId.slice(2);
  }
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

function parseVideoItem(item) {
  const snippet = item.snippet || {};
  const contentDetails = item.contentDetails || {};
  const statistics = item.statistics || {};

  const durationSec = parseIsoDuration(contentDetails.duration);
  const durationFormatted = formatDurationSeconds(durationSec);
  const isShort = durationSec > 0 && durationSec <= 65;

  const thumbnail = snippet.thumbnails?.maxres?.url ||
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url ||
    snippet.thumbnails?.default?.url ||
    `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;

  return {
    youtubeId: item.id,
    titleTamil: snippet.title || '',
    titleEnglish: snippet.title || '',
    descriptionTamil: snippet.description || '',
    descriptionEnglish: snippet.description || '',
    publishedAt: snippet.publishedAt || new Date().toISOString(),
    thumbnailUrl: thumbnail,
    duration: durationFormatted,
    durationSeconds: durationSec,
    isShort: isShort,
    viewCount: parseInt(statistics.viewCount || '0', 10),
    tags: snippet.tags || []
  };
}

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

export async function resolveChannelWithoutApiKey(input) {
  try {
    const raw = (input || '').trim();
    if (!raw) return null;

    if (raw.startsWith('UC') && raw.length === 24) {
      return {
        channelId: raw,
        channelTitle: `Channel ${raw.slice(0, 8)}`,
        channelThumbnail: '',
        uploadsPlaylistId: 'UU' + raw.slice(2),
        handle: `@${raw}`
      };
    }

    let url = raw;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const clean = raw.replace(/^@/, '');
      url = `https://www.youtube.com/@${clean}`;
    }

    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return null;
    const html = await res.text();

    const channelIdMatch = html.match(/channel_id=(UC[A-Za-z0-9_-]{22})/) ||
                           html.match(/"browseId":"(UC[A-Za-z0-9_-]{22})"/);
    const titleMatch = html.match(/<title>(.*?)<\/title>/);

    if (channelIdMatch && channelIdMatch[1]) {
      const channelId = channelIdMatch[1];
      const title = (titleMatch?.[1] || raw).replace(/ - YouTube$/, '').trim();
      return {
        channelId,
        channelTitle: title,
        channelThumbnail: '',
        uploadsPlaylistId: 'UU' + channelId.slice(2),
        handle: raw.startsWith('@') ? raw : `@${raw}`
      };
    }
  } catch (err) {
    console.warn('[YouTube Scraper] Error scraping channel:', err.message);
  }
  return null;
}

export async function fetchChannelVideosViaRss(channelId) {
  if (!channelId || !channelId.startsWith('UC')) return [];
  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
    const res = await fetch(feedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return [];
    const xml = await res.text();

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const entries = [...xml.matchAll(entryRegex)];

    return entries.map(match => {
      const entryXml = match[1];
      const ytId = entryXml.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || '';
      const title = entryXml.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const published = entryXml.match(/<published>(.*?)<\/published>/)?.[1] || new Date().toISOString();
      const desc = entryXml.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] || '';

      const cleanTitle = title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      const cleanDesc = desc.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

      return {
        youtubeId: ytId,
        titleTamil: cleanTitle,
        titleEnglish: cleanTitle,
        descriptionTamil: cleanDesc,
        descriptionEnglish: cleanDesc,
        publishedAt: published,
        thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        duration: '12:00',
        durationSeconds: 720,
        isShort: false,
        viewCount: 1000
      };
    }).filter(v => Boolean(v.youtubeId));
  } catch (err) {
    console.warn('[YouTube RSS] Error fetching RSS feed:', err.message);
    return [];
  }
}
