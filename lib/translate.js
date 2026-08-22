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
 * Translates Tamil text to English using Google Cloud Translation v2 REST API.
 */
export async function translateText(text, apiKey = process.env.TRANSLATE_API_KEY) {
  if (!text || !text.trim()) return '';
  if (!apiKey || apiKey === 'YOUR_GOOGLE_TRANSLATE_API_KEY') {
    return text;
  }

  const { maskedText, tokenMap } = maskProtectedTerms(text);

  const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: maskedText,
      source: 'ta',
      target: 'en',
      format: 'text'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Translation API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawTranslation = data.data?.translations?.[0]?.translatedText || maskedText;

  return unmaskProtectedTerms(rawTranslation, tokenMap);
}

/**
 * Translates English text to Tamil with financial term protection.
 * Supports Google Cloud Translation API & Gemini Generative AI API.
 */
export async function translateEnglishToTamil(text, apiKey = process.env.TRANSLATE_API_KEY || process.env.GEMINI_API_KEY) {
  if (!text || !text.trim()) return '';
  if (!apiKey || apiKey === 'YOUR_GOOGLE_TRANSLATE_API_KEY') {
    return null;
  }

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
              text: `You are an expert Tamil financial translator for Muthaaleetu Thisai. Translate the following English financial news text into natural, professional Tamil. Keep all tokens like __TERM_TOKEN_0__, __URL_TOKEN_0__ exactly as they are without modifying or removing them.\n\nText: ${maskedText}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500
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
      console.warn('Gemini translation fallback:', geminiErr.message);
    }
  }

  // 2. Google Cloud Translation v2 REST API
  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: maskedText,
        source: 'en',
        target: 'ta',
        format: 'text'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Translation API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const rawTranslation = data.data?.translations?.[0]?.translatedText || maskedText;
    return unmaskProtectedTerms(rawTranslation, tokenMap);
  } catch (error) {
    console.warn('English to Tamil translation error:', error.message);
    return null;
  }
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
