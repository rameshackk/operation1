import { fetchAllFinancialNewsFeeds } from '../../lib/news.js';
import { upsertNewsArticlesBatch, getNewsPendingTranslation, updateNewsTranslation } from '../../lib/db.js';
import { translateNewsItem } from '../../lib/translate.js';

export default async function handler(req, res) {
  // Allow GET and POST for cron job invocation
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization || req.headers.Authorization || '';

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('[News Cron] Unauthorized invocation attempt.');
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing Bearer CRON_SECRET token' });
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
