import { supabaseAdmin } from './supabase.js';

const GOOGLE_TTS_API_KEY = process.env.TRANSLATE_API_KEY || process.env.YOUTUBE_API_KEY || '';

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
 * Synthesize speech for a given text using Google Cloud Text-to-Speech API.
 * Returns MP3 audio Buffer.
 */
export async function synthesizeSpeech(text, lang = 'ta', apiKey = GOOGLE_TTS_API_KEY) {
  if (!text || !text.trim()) {
    throw new Error('Text to synthesize is empty');
  }
  if (!apiKey) {
    throw new Error('Google Cloud API key is missing for Text-to-Speech');
  }

  const voiceConfig = TTS_VOICES[lang] || TTS_VOICES.ta;
  const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`;

  // Google TTS request payload (using WaveNet female voice, MP3 24kHz)
  const payload = {
    input: { text: text.slice(0, 5000) },
    voice: {
      languageCode: voiceConfig.languageCode,
      name: voiceConfig.name,
      ssmlGender: voiceConfig.ssmlGender
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: lang === 'ta' ? 0.90 : 0.95,
      pitch: 0.0,
      sampleRateHertz: 24000
    }
  };

  let res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  // If WaveNet voice is unavailable, fallback to Standard female voice
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    console.warn(`WaveNet voice synthesis failed (${voiceConfig.name}), trying fallback (${voiceConfig.fallbackName}):`, errJson);

    payload.voice.name = voiceConfig.fallbackName;
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const fallbackErr = await res.json().catch(() => ({}));
      throw new Error(`Google TTS failed: ${fallbackErr.error?.message || res.statusText}`);
    }
  }

  const data = await res.json();
  if (!data.audioContent) {
    throw new Error('No audioContent returned by Google Cloud Text-to-Speech API');
  }

  return Buffer.from(data.audioContent, 'base64');
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
    console.warn('Bucket verification notice:', bucketErr.message);
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
export async function generateArticleAudio(article, apiKey = GOOGLE_TTS_API_KEY) {
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
