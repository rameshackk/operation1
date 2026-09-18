import { fetchAllFinancialNewsFeeds } from '../../lib/news.js';
import { upsertNewsArticlesBatch, getNewsPendingTranslation, updateNewsTranslation } from '../../lib/db.js';
import { translateNewsItem } from '../../lib/translate.js';
import { checkRateLimit, getClientIp, logSecurityEvent } from '../../lib/security.js';

export default async function handler(req, res) {
  const clientIp = getClientIp(req);

  // Allow GET and POST for cron job invocation
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify Authorization: Bearer <CRON_SECRET> or Vercel Internal Cron Header
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  const isVercelCron = req.headers['x-vercel-cron'] === '1' || req.headers['x-vercel-cron'] === 'true';

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && !isVercelCron) {
    logSecurityEvent('UNAUTHORIZED_CRON_INVOCATION_ATTEMPT', { ip: clientIp, path: '/api/cron/fetch-news' });
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing Bearer CRON_SECRET token' });
  }

  // Rate limit cron invocation
  const cronRate = checkRateLimit(clientIp, 'cron_news', 10, 60000);
  if (!cronRate.allowed) {
    return res.status(429).json({ error: 'Too many cron execution requests' });
  }

  const translateApiKey = process.env.TRANSLATE_API_KEY || process.env.GEMINI_API_KEY;

  try {
    // 1. Fetch & Filter RSS Feeds from High-Authority Financial Outlets
    const candidateItems = await fetchAllFinancialNewsFeeds();
    const totalFetched = candidateItems.length;

    // 2. Upsert into news_articles (Deduplicating by source_url)
    const { insertedCount } = await upsertNewsArticlesBatch(candidateItems);

    // 3. Translate Pending Rows to Tamil (Batched to prevent rate limits)
    let translatedCount = 0;
    const pendingItems = await getNewsPendingTranslation(25);

    for (const item of pendingItems) {
      if (translateApiKey && translateApiKey !== 'YOUR_GOOGLE_TRANSLATE_API_KEY') {
        const transResult = await translateNewsItem(item, translateApiKey);
        if (transResult.success && (transResult.titleTa || transResult.summaryTa)) {
          await updateNewsTranslation(item.id, transResult.titleTa, transResult.summaryTa);
          translatedCount++;
        }
      }
    }

    return res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      summary: {
        fetched: totalFetched,
        new: insertedCount,
        translated: translatedCount,
        pendingTranslation: pendingItems.length - translatedCount
      }
    });

  } catch (error) {
    console.error('Error in /api/cron/fetch-news:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

