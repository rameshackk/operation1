/**
 * Bilingual Translation Engine (Tamil <-> English)
 * Supports Google Cloud Translation v2 & Gemini API (via plain fetch)
 * Protects proper nouns, brand names, stock tickers & financial terms with token masking/unmasking
 */

// Extensible list of protected proper nouns and financial terms
export const DEFAULT_PROTECTED_TERMS = [
  process.env.COMPANY_NAME || 'Muthaleetu Thisai',
  process.env.CHANNEL_NAME || 'Budget Padmanaban',
  '@budgetpadmanaban_',
  'Budget Padmanaban',
  'Padmanaban',
  'Padmanaban B',
  'Fortune Investment Services',
  'FISPL',
  'NIFTY 50',
  'NIFTY',
  'SENSEX',
  'BANK NIFTY',
  'SIP',
  'STP',
  'SWP',
  'Mutual Fund',
  'Mutual Funds',
  'Flexi Cap',
  'Multi Cap',
  'Small Cap',
  'Large Cap',
  'Mid Cap',
  'Hybrid Fund',
  'ELSS',
  'SEBI',
  'RBI',
  'AMFI',
  'NFO',
  'AUM',
  'IPO',
  'LTCG',
  'STCG',
  'CAGR',
  'NAV',
  'TER',
  'FII',
  'DII',
  'Repo Rate',
  'Economic Times',
  'Livemint',
  'Business Standard',
  'Moneycontrol'
];

/**
 * Mask protected terms in text with unique tokens before calling translation API.
 */
export function maskProtectedTerms(text, customTerms = []) {
  if (!text) return { maskedText: '', tokenMap: new Map() };

  const protectedTerms = [...new Set([...DEFAULT_PROTECTED_TERMS, ...customTerms])].filter(Boolean);
  const tokenMap = new Map();
  let tokenCounter = 0;
  let maskedText = text;

  // 1. Mask URLs
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  maskedText = maskedText.replace(urlRegex, (match) => {
    const token = `__URL_TOKEN_${tokenCounter++}__`;
    tokenMap.set(token, match);
    return token;
  });

  // 2. Mask Handles (@handle)
  const handleRegex = /@[a-zA-Z0-9_]+/g;
  maskedText = maskedText.replace(handleRegex, (match) => {
    const token = `__HANDLE_TOKEN_${tokenCounter++}__`;
    tokenMap.set(token, match);
    return token;
  });

  // 3. Mask Explicit Protected Terms (sorted by length descending to match longer phrases first)
  const sortedTerms = protectedTerms.sort((a, b) => b.length - a.length);
  for (const term of sortedTerms) {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const termRegex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');

    maskedText = maskedText.replace(termRegex, (match) => {
      const token = `__TERM_TOKEN_${tokenCounter++}__`;
      tokenMap.set(token, match);
      return token;
    });
  }

  return { maskedText, tokenMap };
}

/**
 * Restore original terms from tokens after translation completes.
 */
export function unmaskProtectedTerms(translatedText, tokenMap) {
  if (!translatedText || !tokenMap || tokenMap.size === 0) return translatedText || '';

  let restoredText = translatedText;
  for (const [token, originalValue] of tokenMap.entries()) {
    const tokenRegex = new RegExp(token.replace(/_/g, '[_\\s]?'), 'gi');
    restoredText = restoredText.replace(tokenRegex, originalValue);
  }

  return restoredText;
}

/**
 * Translates Tamil text to English with financial term protection.
 * Supports Gemini Generative AI, Google Cloud Translation v2, and reliable public Google Translate fallback.
 */
export async function translateText(text, apiKey = process.env.TRANSLATE_API_KEY || process.env.GEMINI_API_KEY) {
  if (!text || !text.trim()) return '';

  const { maskedText, tokenMap } = maskProtectedTerms(text);

  // 1. Try Gemini API if GEMINI_API_KEY is configured
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert financial translator for Muthaleetu Thisai. Translate the following Tamil financial article text into fluent, professional English. If the text contains HTML tags (like <p>, <h3>, <strong>), preserve the HTML tags and structure accurately. Keep all tokens like __TERM_TOKEN_0__, __URL_TOKEN_0__, __HANDLE_TOKEN_0__ exactly as they are without modifying or removing them.\n\nText:\n${maskedText}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 3000
          }
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const translatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (translatedContent) {
          return unmaskProtectedTerms(translatedContent, tokenMap);
        }
      }
    } catch (geminiErr) {
      console.warn('Gemini Tamil-to-English translation fallback:', geminiErr.message);
    }
  }

  // 2. Google Cloud Translation v2 REST API (if valid API key exists)
  const gKey = process.env.TRANSLATE_API_KEY || process.env.GOOGLE_API_KEY || (apiKey && apiKey !== 'YOUR_GOOGLE_TRANSLATE_API_KEY' ? apiKey : null);
  if (gKey) {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(gKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: maskedText,
          source: 'ta',
          target: 'en',
          format: text.includes('<') && text.includes('>') ? 'html' : 'text'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawTranslation = data.data?.translations?.[0]?.translatedText;
        if (rawTranslation) {
          return unmaskProtectedTerms(rawTranslation, tokenMap);
        }
      }
    } catch (gErr) {
      console.warn('Google Cloud Translation v2 fallback:', gErr.message);
    }
  }

  // 3. Reliable Public Google Translate Fallback
  try {
    const isHtml = text.includes('<') && text.includes('>');
    // For long content, translate in chunks of 1500 chars to avoid URL length limits
    if (maskedText.length > 1500) {
      const chunks = maskedText.match(/[\s\S]{1,1500}(?:\s|$)/g) || [maskedText];
      const translatedChunks = await Promise.all(chunks.map(async (chunk) => {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ta&tl=en&dt=t&q=${encodeURIComponent(chunk)}`);
        if (!res.ok) return chunk;
        const data = await res.json();
        return Array.isArray(data?.[0]) ? data[0].map(item => item[0] || '').join('') : chunk;
      }));
      return unmaskProtectedTerms(translatedChunks.join(''), tokenMap);
    }

    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ta&tl=en&dt=t&q=${encodeURIComponent(maskedText)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.[0])) {
        const rawTranslation = data[0].map(item => item[0] || '').join('');
        if (rawTranslation) {
          return unmaskProtectedTerms(rawTranslation, tokenMap);
        }
      }
    }
  } catch (publicErr) {
    console.warn('Public Translate fallback error:', publicErr.message);
  }

  return unmaskProtectedTerms(maskedText, tokenMap);
}

/**
 * Translates English text to Tamil with financial term protection.
 * Supports Gemini Generative AI, Google Cloud Translation API, and reliable public Google Translate fallback.
 */
export async function translateEnglishToTamil(text, apiKey = process.env.TRANSLATE_API_KEY || process.env.GEMINI_API_KEY) {
  if (!text || !text.trim()) return '';

  const { maskedText, tokenMap } = maskProtectedTerms(text);

  // 1. Try Gemini API if GEMINI_API_KEY is available
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert Tamil financial translator for Muthaleetu Thisai. Translate the following English financial news text into natural, professional Tamil. Keep all tokens like __TERM_TOKEN_0__, __URL_TOKEN_0__, __HANDLE_TOKEN_0__ exactly as they are without modifying or removing them.\n\nText:\n${maskedText}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1000
          }
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const translatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (translatedContent) {
          return unmaskProtectedTerms(translatedContent, tokenMap);
        }
      }
    } catch (geminiErr) {
      console.warn('Gemini English-to-Tamil translation fallback:', geminiErr.message);
    }
  }

  // 2. Google Cloud Translation v2 REST API (if valid key exists)
  const gKey = process.env.TRANSLATE_API_KEY || process.env.GOOGLE_API_KEY || (apiKey && apiKey !== 'YOUR_GOOGLE_TRANSLATE_API_KEY' ? apiKey : null);
  if (gKey) {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(gKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: maskedText,
          source: 'en',
          target: 'ta',
          format: text.includes('<') && text.includes('>') ? 'html' : 'text'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawTranslation = data.data?.translations?.[0]?.translatedText;
        if (rawTranslation) {
          return unmaskProtectedTerms(rawTranslation, tokenMap);
        }
      }
    } catch (error) {
      console.warn('English to Tamil translation error:', error.message);
    }
  }

  // 3. Reliable Public Google Translate Fallback
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(maskedText)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.[0])) {
        const rawTranslation = data[0].map(item => item[0] || '').join('');
        if (rawTranslation) {
          return unmaskProtectedTerms(rawTranslation, tokenMap);
        }
      }
    }
  } catch (publicErr) {
    console.warn('Public Translate fallback error:', publicErr.message);
  }

  return unmaskProtectedTerms(maskedText, tokenMap);
}

/**
 * Translates both title and description of a video from Tamil to English.
 */
export async function translateVideo(video, apiKey = process.env.TRANSLATE_API_KEY) {
  if (!video) return { titleEn: null, descriptionEn: null };

  try {
    const [titleEn, descriptionEn] = await Promise.all([
      translateText(video.titleTamil, apiKey),
      translateText(video.descriptionTamil, apiKey)
    ]);
    return { titleEn, descriptionEn, success: true };
  } catch (error) {
    console.error(`Translation failed for video ${video.youtubeId}:`, error.message);
    return { titleEn: null, descriptionEn: null, success: false, error: error.message };
  }
}

/**
 * Translates English news article to Tamil.
 */
export async function translateNewsItem(newsItem, apiKey = process.env.TRANSLATE_API_KEY || process.env.GEMINI_API_KEY) {
  if (!newsItem) return { titleTa: null, summaryTa: null, success: false };

  try {
    const [titleTa, summaryTa] = await Promise.all([
      translateEnglishToTamil(newsItem.title_en, apiKey),
      translateEnglishToTamil(newsItem.summary_en, apiKey)
    ]);
    return {
      titleTa: titleTa || null,
      summaryTa: summaryTa || null,
      success: !!(titleTa || summaryTa)
    };
  } catch (error) {
    console.error(`Translation failed for news article:`, error.message);
    return { titleTa: null, summaryTa: null, success: false };
  }
}
