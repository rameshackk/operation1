import { supabaseAdmin } from './supabase.js';

// Resolve Google Cloud API Key (filter out dummy placeholders)
const resolveGoogleApiKey = () => {
  const transKey = process.env.TRANSLATE_API_KEY || '';
  const ytKey = process.env.YOUTUBE_API_KEY || '';
  if (transKey && !transKey.startsWith('YOUR_')) return transKey;
  if (ytKey && !ytKey.startsWith('YOUR_')) return ytKey;
  return '';
};

export const TTS_VOICES = {
  ta: {
    languageCode: 'ta-IN',
    name: 'ta-IN-Wavenet-A',
    ssmlGender: 'FEMALE',
    fallbackName: 'ta-IN-Standard-A'
  },
  en: {
    languageCode: 'en-IN',
    name: 'en-IN-Wavenet-A',
    ssmlGender: 'FEMALE',
    fallbackName: 'en-IN-Standard-A'
  }
};

/**
 * Clean HTML and markdown to plain, natural readable text for speech synthesis.
 */
export function cleanTextForSpeech(rawHtml = '') {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '$1. ')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '$1. ')
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Synthesize speech using Google Cloud Text-to-Speech API with WaveNet voices.
 */
async function synthesizeGoogleCloud(text, lang, apiKey) {
  const voiceConfig = TTS_VOICES[lang] || TTS_VOICES.ta;
  const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`;

  const payload = {
    input: { text: text.slice(0, 5000) },
    voice: {
      languageCode: voiceConfig.languageCode,
      name: voiceConfig.name,
      ssmlGender: voiceConfig.ssmlGender
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: lang === 'ta' ? 0.92 : 0.96,
      pitch: 0.0,
      sampleRateHertz: 24000
    }
  };

  let res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    // Try standard fallback voice
    payload.voice.name = voiceConfig.fallbackName;
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Google Cloud TTS status ${res.status}`);
  }

  const data = await res.json();
  if (!data.audioContent) {
    throw new Error('No audioContent returned by Google Cloud Text-to-Speech API');
  }

  return Buffer.from(data.audioContent, 'base64');
}

/**
 * Robust Google TTS Chunk Synthesis Engine (fluent Tamil & English audio)
 */
async function synthesizeGoogleWebChunks(text, lang = 'ta') {
  const langCode = lang === 'ta' ? 'ta' : 'en-IN';
  
  // Split long text into natural punctuation chunks (< 180 chars per request)
  const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
  const chunks = [];
  let cur = '';

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((cur + ' ' + trimmed).length > 180) {
      if (cur.trim()) chunks.push(cur.trim());
      cur = trimmed;
    } else {
      cur += (cur ? ' ' : '') + trimmed;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());

  const bufferPromises = chunks.map(async (chunk) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${langCode}&client=tw-ob`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      return Buffer.from(arrayBuf);
    }
    return null;
  });

  const resolved = await Promise.all(bufferPromises);
  const buffers = resolved.filter(Boolean);

  if (buffers.length === 0) {
    throw new Error('Failed to generate audio chunks via Google TTS');
  }

  return Buffer.concat(buffers);
}

/**
 * Synthesize speech for given text (tries Google Cloud WaveNet first, then Google TTS engine).
 */
export async function synthesizeSpeech(text, lang = 'ta', apiKey = resolveGoogleApiKey()) {
  if (!text || !text.trim()) {
    throw new Error('Text to synthesize is empty');
  }

  // 1. Try Google Cloud Text-to-Speech API if valid API key is present
  if (apiKey) {
    try {
      return await synthesizeGoogleCloud(text, lang, apiKey);
    } catch (gCloudErr) {
      console.warn(`[TTS] Google Cloud WaveNet API unavailable (${gCloudErr.message}), falling back to Google TTS engine...`);
    }
  }

  // 2. High-fidelity Google TTS fallback
  return await synthesizeGoogleWebChunks(text, lang);
}

/**
 * Upload synthesized MP3 buffer to Supabase Storage bucket 'article-audio'.
 * Returns public URL.
 */
export async function uploadAudioToSupabase(slug, lang, audioBuffer) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client is not initialized');
  }

  const bucketName = 'article-audio';
  const filePath = `${slug}-${lang}.mp3`;

  // Ensure bucket exists
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = (buckets || []).some(b => b.name === bucketName);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['audio/mpeg', 'audio/mp3'],
        fileSizeLimit: 25 * 1024 * 1024
      });
    }
  } catch (bucketErr) {
    console.warn('Bucket check warning:', bucketErr.message);
  }

  // Upload or replace MP3 file
  const { error: uploadErr } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, audioBuffer, {
      contentType: 'audio/mpeg',
      upsert: true
    });

  if (uploadErr) {
    throw new Error(`Failed to upload audio to Supabase Storage: ${uploadErr.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

/**
 * Generate and cache audio for an article for both Tamil and English.
 */
export async function generateArticleAudio(article, apiKey = resolveGoogleApiKey()) {
  if (!article || !article.slug) {
    throw new Error('Invalid article object for audio generation');
  }

  const results = {
    audioUrlTa: null,
    audioUrlEn: null
  };

  // 1. Tamil Audio Generation
  const titleTa = article.titleTamil || article.title_ta || article.title || '';
  const excerptTa = article.excerptTamil || article.excerpt_ta || article.summary || '';
  const bodyTa = cleanTextForSpeech(article.bodyTamil || article.body_ta || article.body || '');
  const fullTextTa = `${titleTa}. ${excerptTa ? excerptTa + '.' : ''} ${bodyTa}`.trim();

  if (fullTextTa) {
    try {
      const bufferTa = await synthesizeSpeech(fullTextTa, 'ta', apiKey);
      results.audioUrlTa = await uploadAudioToSupabase(article.slug, 'ta', bufferTa);
    } catch (err) {
      console.error(`Tamil TTS generation failed for ${article.slug}:`, err.message);
    }
  }

  // 2. English Audio Generation
  const titleEn = article.titleEnglish || article.title_en || article.title || '';
  const excerptEn = article.excerptEnglish || article.excerpt_en || article.summary || '';
  const bodyEn = cleanTextForSpeech(article.bodyEnglish || article.body_en || article.body || '');
  const fullTextEn = `${titleEn}. ${excerptEn ? excerptEn + '.' : ''} ${bodyEn}`.trim();

  if (fullTextEn) {
    try {
      const bufferEn = await synthesizeSpeech(fullTextEn, 'en', apiKey);
      results.audioUrlEn = await uploadAudioToSupabase(article.slug, 'en', bufferEn);
    } catch (err) {
      console.error(`English TTS generation failed for ${article.slug}:`, err.message);
    }
  }

  return results;
}
