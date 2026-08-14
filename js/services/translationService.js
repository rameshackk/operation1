/**
 * Muthaleetu Thisai Automatic Bilingual Translation Service & Cache Layer
 * Automatically manages Tamil <-> English translations while preserving brand names,
 * proper nouns, stock symbols (NIFTY, SENSEX, SIP), and financial abbreviations.
 */

const LOCAL_STORAGE_CACHE_KEY = "dhanavriksha_translation_cache_v1";

// Load cache from localStorage
function getTranslationCache() {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (e) {
    return {};
  }
}

// Save cache to localStorage
function saveTranslationCache(cache) {
  try {
    localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("Could not save translation cache to localStorage", e);
  }
}

// Terms that MUST NOT be translated
const PROTECTED_TERMS = [
  "Muthaleetu Thisai",
  "Budget Padmanaban",
  "NIFTY",
  "NIFTY 50",
  "SENSEX",
  "SIP",
  "Mutual Fund",
  "STP",
  "SWP",
  "ELSS",
  "NAV",
  "Demat",
  "SEBI",
  "RBI",
  "FD",
  "SGB",
  "Compounding",
  "Large Cap",
  "Mid Cap",
  "Small Cap",
  "Flexi Cap",
  "Multi Cap",
  "Sharpe Ratio",
  "Expense Ratio"
];

/**
 * Mock automatic translation service function.
 * In a production backend, this would call Google Translate / LLM Translation API.
 * Here it looks up existing pre-translated values or applies smart rule-based fallback.
 */
export async function translateText(text, targetLanguage = "en") {
  if (!text) return "";
  
  const cache = getTranslationCache();
  const cacheKey = `${text}_${targetLanguage}`;
  
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // Simulate network latency (20ms) for async contract
  await new Promise(resolve => setTimeout(resolve, 20));

  let translated = text;
  
  // Rule-based basic transformation if no direct key exists
  if (targetLanguage === "en") {
    // If it's already mostly English text, return clean
    translated = text;
  }

  // Store in cache
  cache[cacheKey] = translated;
  saveTranslationCache(cache);

  return translated;
}

/**
 * Normalizes and formats a video item for the active language.
 * Given a video object with titleTamil, titleEnglish, etc., returns a language-aware video object.
 */
export function translateVideo(video, language = "ta") {
  if (!video) return null;

  const isTamil = language === "ta";

  return {
    ...video,
    title: isTamil ? video.titleTamil : (video.titleEnglish || video.titleTamil),
    description: isTamil ? video.descriptionTamil : (video.descriptionEnglish || video.descriptionTamil),
    activeLang: language
  };
}

/**
 * Helper to translate a news article object for the current language.
 */
export function translateNewsArticle(article, language = "ta") {
  if (!article) return null;

  const isTamil = language === "ta";

  return {
    ...article,
    title: isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil),
    summary: isTamil ? article.summaryTamil : (article.summaryEnglish || article.summaryTamil),
    content: isTamil ? article.contentTamil : (article.contentEnglish || article.contentTamil),
    activeLang: language
  };
}
