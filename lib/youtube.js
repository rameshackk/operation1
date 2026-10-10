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
