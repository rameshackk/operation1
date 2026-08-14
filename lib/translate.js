/**
 * Tamil to English Translation Engine
 * Uses Google Cloud Translation v2 REST API (via plain fetch)
 * Protects proper nouns, brand names, stock tickers & terms with token masking/unmasking
 */

// Extensible list of protected proper nouns and financial terms
export const DEFAULT_PROTECTED_TERMS = [
  process.env.COMPANY_NAME || 'Muthaleetu Thisai',
  process.env.CHANNEL_NAME || 'Budget Padmanaban',
  '@budgetpadmanaban_',
  'Budget Padmanaban',
  'Padmanaban',
  'Padmanaban B',
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
  'LTCG',
  'STCG',
  'CAGR',
  'NAV',
  'TER',
  'Keshav'
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

  // 2. Mask YouTube Video IDs / Handles (@handle)
  const handleRegex = /@[a-zA-Z0-9_]+/g;
  maskedText = maskedText.replace(handleRegex, (match) => {
    const token = `__HANDLE_TOKEN_${tokenCounter++}__`;
    tokenMap.set(token, match);
    return token;
  });

  // 3. Mask Explicit Protected Terms (sorted by length descending to match longer phrases first)
  const sortedTerms = protectedTerms.sort((a, b) => b.length - a.length);
  for (const term of sortedTerms) {
    // Escape special regex characters
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
    // Handle potential whitespace or capitalization changes introduced by translation engine
    const tokenRegex = new RegExp(token.replace(/_/g, '[_\\s]?'), 'gi');
    restoredText = restoredText.replace(tokenRegex, originalValue);
  }

  return restoredText;
}

/**
 * Translates Tamil text to English using Google Cloud Translation v2 REST API (via fetch).
 */
export async function translateText(text, apiKey = process.env.TRANSLATE_API_KEY) {
  if (!text || !text.trim()) return '';
  if (!apiKey) {
    console.warn('TRANSLATE_API_KEY missing. Returning un-translated text.');
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
 * Translates both title and description of a video.
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
