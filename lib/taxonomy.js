/**
 * Video taxonomy: category classification + SEO keyword extraction.
 *
 * Kept separate from youtube.js so the cron ingest and the backfill script share
 * exactly one implementation, and so it can be unit-tested without API access.
 *
 * Why this exists: every video on the channel carries an identical description
 * footer that ends with "...investing in mutual funds carries market risks".
 * Classifying over the raw description therefore matched "mutual fund" on all
 * 882 videos. Everything here works on the *authored* part of the description.
 */

/**
 * The five categories the UI exposes (see CategoryPage.categoryTitles).
 * 'shorts' is intentionally absent — it is derived from duration_seconds.
 */
export const VIDEO_CATEGORIES = [
  'mutual-funds',
  'stocks',
  'personal-finance',
  'tax-saving',
  'education'
];

/**
 * Markers that begin the channel's standard description footer. Everything from
 * the earliest match onward is boilerplate repeated on every upload.
 */
const BOILERPLATE_MARKERS = [
  'padmanaban b |',
  'certified financial planner',
  'director - fortune',
  'director- fortune',
  'contact form:',
  'contact 📞',
  'socials:',
  'disclaimer:',
  'instagram:',
  'linkedin:',
  'twitter:',
  'whatsapp:',
  'telegram:',
  'subscribe',
  'amfi registered',
  'mutual fund distributor'
];

/**
 * Brand and channel words that carry no topical signal — they appear in nearly
 * every title and description, so they must never drive a category or a keyword.
 */
const STOPWORDS = new Set([
  'budget', 'padmanaban', 'padhucfp', 'fortune', 'investment services', 'cfp',
  'tamil', 'india', 'video', 'youtube', 'shorts', 'short', 'subscribe', 'like',
  'share', 'comment', 'channel', 'today', 'new', 'best', 'top', 'how', 'what',
  'why', 'the', 'and', 'for', 'you', 'your', 'with', 'from', 'this', 'that'
]);

/**
 * YouTube tags on this channel are largely discovery spam: the channel's own name
 * misspelled, plus the names of competing Tamil finance creators. Measured over the
 * catalog, each of these sits on 30-61% of all videos, so they carry no topical
 * signal and actively skew classification. Regenerate with scripts/tag-frequency.js.
 */
const TAG_STOPLIST = new Set([
  'budget padmanaban', 'padmanaban', 'padmanaban sir', 'budget bathmanaban',
  'budget padmanabhan', 'budget padhmanaban', 'finance badmanaban interview',
  'nanayam vikatan', 'money pechu', 'behindwoods immanuel', 'immanuel',
  'immanuel anand srinivasan', 'anand srinivasan', 'finance with sharan',
  'vikatan', 'moneypechu', 'nanayamvikatan', 'budgetpadmanaban'
]);

/**
 * Drops discovery-spam tags. `extraStoplist` lets a caller add terms derived from
 * corpus frequency, so new spam tags can be excluded without editing this file.
 */
export function filterTags(tags = [], extraStoplist = null) {
  return (Array.isArray(tags) ? tags : [])
    .map(t => String(t || '').toLowerCase().trim())
    .filter(t => t.length >= 2 && !TAG_STOPLIST.has(t) && !STOPWORDS.has(t))
    .filter(t => !extraStoplist || !extraStoplist.has(t));
}

/**
 * Weighted category rules. `strong` terms are decisive topic markers; `weak`
 * terms only break ties, because words like "investment" and "முதலீடு" appear
 * across the whole catalog and would otherwise dominate every score.
 *
 * Order does not matter — the highest total score wins, unlike the previous
 * first-match-wins chain where the broadest rule was checked first.
 */
const CATEGORY_RULES = [
  {
    category: 'mutual-funds',
    strong: [
      'mutual fund', 'mutualfund', 'mutual funds', 'sip', 'stepupsip', 'step up sip',
      'step-up sip', 'elss', 'flexi cap', 'flexicap', 'small cap', 'smallcap',
      'mid cap', 'midcap', 'large cap', 'largecap', 'index fund', 'nifty index fund',
      'lumpsum', 'lump sum', 'swp', 'stp', 'nfo', 'nav', 'folio', 'amc',
      'compounding', 'power of compounding', 'rule 72', 'xirr', 'cagr',
      'மியூச்சுவல்', 'கூட்டு வட்டி'
    ],
    weak: ['fund', 'invest', 'investing', 'portfolio', 'returns', 'wealth']
  },
  {
    category: 'stocks',
    strong: [
      'stock market', 'stock', 'stocks', 'share market', 'shares', 'equity',
      'nifty', 'sensex', 'trading', 'trader', 'intraday', 'ipo', 'demat',
      'bse', 'nse', 'dividend', 'bonus share', 'penny stock', 'f&o', 'futures',
      'options trading', 'பங்கு', 'பங்குச்சந்தை', 'பங்கு சந்தை', 'சந்தை'
    ],
    weak: ['market', 'broker', 'listing']
  },
  {
    category: 'personal-finance',
    strong: [
      'credit card', 'creditcard', 'debit card', 'personal loan', 'home loan',
      'car loan', 'gold loan', 'education loan', 'loan', 'emi', 'cibil',
      'credit score', 'insurance', 'term insurance', 'health insurance',
      'lic', 'emergency fund', 'gold', 'silver', 'jewellery', 'real estate',
      'property', 'rent', 'salary', 'debt', 'savings account',
      'recurring deposit', 'fixed deposit', ' rd ', ' fd ', 'chit',
      'தங்கம்', 'வெள்ளி', 'கடன்', 'வீடு', 'சம்பளம்', 'காப்பீடு',
      'நகை', 'அடகு', 'வாடகை'
    ],
    // "savings" and "சேமிப்பு" are weak on purpose: on this channel they almost
    // always describe SIP investing, not a savings product.
    weak: ['money', 'save', 'saving', 'savings', 'budgeting', 'expense', 'spend', 'பணம்', 'சேமிப்பு']
  },
  {
    category: 'tax-saving',
    strong: [
      'income tax', 'tax saving', 'tax planning', 'tax', 'itr', '80c', '80d',
      'tds', 'gst', 'capital gains', 'ltcg', 'stcg', 'old regime', 'new regime',
      'retirement', 'retirement planning', 'pension', 'nps', 'epf', 'ppf',
      'gratuity', 'annuity', 'superannuation', 'fire', 'financial independence',
      'early retirement', 'senior citizen',
      'வரி', 'ஓய்வூதியம்', 'ஓய்வு', 'பென்ஷன்'
    ],
    weak: ['deduction', 'exemption', 'refund']
  },
  {
    category: 'education',
    strong: [
      'financial literacy', 'financial education', 'basics', 'beginner',
      'explained', 'life lesson', 'life lessons', 'story', 'case study',
      'mistake', 'mistakes', 'myth', 'awareness', 'fraud', 'scam', 'ponzi',
      'நிதி கல்வி', 'பாடம்', 'தவறு', 'தவறுகள்', 'மோசடி', 'கதை'
    ],
    weak: ['learn', 'guide', 'tips', 'rule']
  }
];

const TITLE_WEIGHT = 4;
const HASHTAG_WEIGHT = 3;
// YouTube tags stay at 1 even after stoplisting: what remains is still noisier
// than the title or the author's own hashtags.
const TAG_WEIGHT = 1;
const BODY_WEIGHT = 1;

/**
 * Removes the repeated channel footer, URLs, phone numbers and emoji from a
 * description, leaving only the text the video author actually wrote for it.
 */
export function stripBoilerplate(description = '') {
  if (!description) return '';

  const lower = description.toLowerCase();
  let cut = description.length;
  for (const marker of BOILERPLATE_MARKERS) {
    const idx = lower.indexOf(marker);
    if (idx !== -1 && idx < cut) cut = idx;
  }

  return description
    .slice(0, cut)
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\b\d{10}\b/g, ' ')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Pulls "#StepUpSIP" style hashtags out of a description and splits camelCase
 * into searchable words: "#StepUpSIP" -> "step up sip".
 */
export function extractHashtags(description = '') {
  const matches = description.match(/#[\p{L}\p{N}_]+/gu) || [];
  const out = [];

  for (const raw of matches) {
    const body = raw.slice(1).replace(/_/g, ' ');
    const spaced = body
      .replace(/([a-z\d])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    if (spaced && !STOPWORDS.has(spaced)) out.push(spaced);
  }

  return Array.from(new Set(out));
}

/**
 * Term matching that works for both scripts: ASCII terms get word boundaries so
 * "sip" cannot match inside "gossip", while Tamil terms fall back to substring
 * matching because \b is meaningless outside the Latin alphabet.
 */
function countTerm(haystack, term) {
  if (!haystack || !term) return 0;

  if (/^[\x20-\x7E]+$/.test(term)) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'g');
    return (haystack.match(re) || []).length;
  }

  let count = 0;
  let idx = haystack.indexOf(term);
  while (idx !== -1) {
    count++;
    idx = haystack.indexOf(term, idx + term.length);
  }
  return count;
}

/**
 * Scores every category over the weighted text fields and returns the winner.
 * Falls back to 'education' only when nothing at all matched.
 */
export function classifyCategory(title = '', description = '', tags = [], extraStoplist = null) {
  const body = stripBoilerplate(description);
  const hashtags = extractHashtags(description).join(' ');
  const tagText = filterTags(tags, extraStoplist).join(' ');

  const fields = [
    { text: ` ${(title || '').toLowerCase()} `, weight: TITLE_WEIGHT },
    { text: ` ${hashtags.toLowerCase()} `, weight: HASHTAG_WEIGHT },
    { text: ` ${tagText.toLowerCase()} `, weight: TAG_WEIGHT },
    { text: ` ${body.toLowerCase()} `, weight: BODY_WEIGHT }
  ];

  let best = { category: 'education', score: 0 };

  for (const rule of CATEGORY_RULES) {
    let score = 0;
    for (const { text, weight } of fields) {
      for (const term of rule.strong) {
        score += countTerm(text, term) * weight * 3;
      }
      for (const term of rule.weak) {
        score += countTerm(text, term) * weight;
      }
    }
    if (score > best.score) best = { category: rule.category, score };
  }

  return best.category;
}

/**
 * Builds the SEO keyword set used for search ranking and related-video lookups.
 * Sources, in order of trust: author hashtags, YouTube tags, matched taxonomy
 * terms, then notable words from the title.
 */
export function extractSeoKeywords(title = '', description = '', tags = [], category = null, extraStoplist = null) {
  const body = stripBoilerplate(description);
  const titleLower = ` ${(title || '').toLowerCase()} `;
  const bodyLower = ` ${body.toLowerCase()} `;
  const keywords = [];

  const push = (term) => {
    const clean = (term || '').toString().toLowerCase().trim();
    if (clean.length < 2 || clean.length > 48) return;
    if (STOPWORDS.has(clean)) return;
    if (/^\d+$/.test(clean)) return;
    keywords.push(clean);
  };

  // 1. Author-written hashtags are the strongest intent signal.
  extractHashtags(description).forEach(push);

  // 2. YouTube's own tag array, minus the discovery spam.
  filterTags(tags, extraStoplist).forEach(push);

  // 3. Taxonomy terms actually present in the title or authored description.
  for (const rule of CATEGORY_RULES) {
    for (const term of rule.strong) {
      if (countTerm(titleLower, term) > 0 || countTerm(bodyLower, term) > 0) {
        push(term.trim());
      }
    }
  }

  // 4. Meaningful words from the title, so a search for a phrase in the title hits.
  const titleWords = (title || '')
    .replace(/[|·•–—:!?,.()\[\]"'`]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  for (const word of titleWords) {
    const w = word.toLowerCase();
    if (w.length < 3) continue;
    if (STOPWORDS.has(w)) continue;
    if (/^[\d₹%.,+-]+$/.test(w)) continue;
    push(w);
  }

  if (category) push(category.replace(/-/g, ' '));

  return Array.from(new Set(keywords)).slice(0, 40);
}
