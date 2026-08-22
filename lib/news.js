import Parser from 'rss-parser';

// Clean parser configuration with custom fields and standard browser headers
const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['content:encoded', 'contentEncoded'],
      ['description', 'description']
    ]
  }
});

// Verified high-authority Indian financial news RSS feeds
export const FINANCIAL_NEWS_FEEDS = [
  {
    name: 'Economic Times',
    url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
    defaultCategory: 'markets'
  },
  {
    name: 'Economic Times',
    url: 'https://economictimes.indiatimes.com/wealth/rssfeeds/837555174.cms',
    defaultCategory: 'mutual-funds'
  },
  {
    name: 'Livemint',
    url: 'https://www.livemint.com/rss/markets',
    defaultCategory: 'markets'
  },
  {
    name: 'Livemint',
    url: 'https://www.livemint.com/rss/money',
    defaultCategory: 'mutual-funds'
  },
  {
    name: 'Business Standard',
    url: 'https://www.business-standard.com/rss/markets-106.rss',
    defaultCategory: 'markets'
  },
  {
    name: 'Business Standard',
    url: 'https://www.business-standard.com/rss/finance-103.rss',
    defaultCategory: 'regulatory'
  },
  {
    name: 'Moneycontrol',
    url: 'https://www.moneycontrol.com/rss/marketreports.xml',
    defaultCategory: 'markets'
  },
  {
    name: 'Moneycontrol',
    url: 'https://www.moneycontrol.com/rss/business.xml',
    defaultCategory: 'general'
  }
];

// Mandatory investment keyword filters (case-insensitive)
export const RELEVANT_KEYWORDS = [
  'mutual fund',
  'mutual funds',
  'sip',
  'nav',
  'sensex',
  'nifty',
  'rbi',
  'sebi',
  'aum',
  'ipo',
  'amfi',
  'nfo',
  'repo rate',
  'inflation',
  'fii',
  'dii'
];

/**
 * Checks if headline or summary contains at least one target investment keyword.
 */
export function isInvestmentRelevant(title = '', summary = '') {
  const combined = `${title} ${summary}`.toLowerCase();
  return RELEVANT_KEYWORDS.some(kw => {
    // Exact word boundary or phrase match
    const regex = new RegExp(`\\b${kw.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}\\b`, 'i');
    return regex.test(combined);
  });
}

/**
 * Classifies an article into mutual-funds | markets | regulatory | general
 */
export function classifyNewsCategory(title = '', summary = '', fallback = 'general') {
  const text = `${title} ${summary}`.toLowerCase();

  if (/\b(mutual fund|mutual funds|sip|nav|amfi|nfo|aum|etf|index fund|elss|portfolio)\b/i.test(text)) {
    return 'mutual-funds';
  }
  if (/\b(rbi|sebi|repo rate|monetary policy|regulation|guidelines|amfi circular)\b/i.test(text)) {
    return 'regulatory';
  }
  if (/\b(nifty|sensex|ipo|fii|dii|bull|bear|stock|shares|dalal street|q1|q2|q3|q4|earnings)\b/i.test(text)) {
    return 'markets';
  }
  return fallback;
}

/**
 * Safely extracts an image URL from item enclosures, media tags, or HTML content.
 */
export function extractImageUrl(item) {
  if (item.enclosure?.url && item.enclosure.url.startsWith('http')) {
    return item.enclosure.url;
  }
  if (item.mediaContent?.$?.url) {
    return item.mediaContent.$.url;
  }
  if (item.mediaThumbnail?.$?.url) {
    return item.mediaThumbnail.$.url;
  }

  // Look for <img> tags inside description or content
  const htmlContent = item.contentEncoded || item.content || item.description || '';
  const imgMatch = htmlContent.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  return null;
}

/**
 * Cleans HTML entities, tags, and excessive whitespace into a short summary snippet.
 */
export function cleanSummaryText(rawText = '') {
  if (!rawText) return '';
  
  let clean = rawText
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate to maximum 240 chars for clean 1-2 line display
  if (clean.length > 240) {
    clean = clean.substring(0, 237).trim() + '...';
  }
  return clean;
}

/**
 * Fetches and filters all candidate RSS feeds, returning deduplicated candidate items.
 */
export async function fetchAllFinancialNewsFeeds() {
  const allItems = [];
  const seenUrls = new Set();

  for (const feedConfig of FINANCIAL_NEWS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedConfig.url);
      const items = feed.items || [];

      for (const item of items) {
        const sourceUrl = item.link?.trim();
        if (!sourceUrl || seenUrls.has(sourceUrl)) continue;

        const title = (item.title || '').trim().replace(/&amp;/g, '&');
        const summary = cleanSummaryText(item.summary || item.contentSnippet || item.description || '');

        // Strict keyword relevance filter
        if (!isInvestmentRelevant(title, summary)) {
          continue;
        }

        seenUrls.add(sourceUrl);

        const publishedDate = item.pubDate || item.isoDate ? new Date(item.pubDate || item.isoDate) : new Date();
        const category = classifyNewsCategory(title, summary, feedConfig.defaultCategory);
        const imageUrl = extractImageUrl(item);

        allItems.push({
          source_url: sourceUrl,
          source_name: feedConfig.name,
          title_en: title,
          title_ta: null,
          summary_en: summary,
          summary_ta: null,
          image_url: imageUrl,
          category,
          published_at: isNaN(publishedDate.getTime()) ? new Date().toISOString() : publishedDate.toISOString()
        });
      }
    } catch (err) {
      console.warn(`[News Ingestion] Could not fetch feed ${feedConfig.name} (${feedConfig.url}):`, err.message);
    }
  }

  return allItems;
}
