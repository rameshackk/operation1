import { getUploadsPlaylistId, fetchLatestUploadVideoIds, fetchAllUploadVideoIds, fetchVideoDetails } from '../../lib/youtube.js';
import { translateVideo } from '../../lib/translate.js';
import { getExistingYoutubeIds, upsertVideo, getVideosPendingTranslation, updateVideoTranslation } from '../../lib/db.js';

export default async function handler(req, res) {
  // Allow GET and POST for cron job invocation
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization || req.headers.Authorization || '';

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('Unauthorized cron invocation attempt.');
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing Bearer CRON_SECRET token' });
  }

  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCWD5lYsFycgIDyCB_EHpYOQ';
  const translateApiKey = process.env.TRANSLATE_API_KEY;

  const isFullSync = req.query.fullSync === 'true' || req.query.fullSync === '1';
  const maxPages = parseInt(req.query.maxPages || '50', 10);

  if (!youtubeApiKey) {
    return res.status(500).json({ error: 'YOUTUBE_API_KEY environment variable is missing' });
  }

  try {
    // 1. Resolve Uploads Playlist ID
    const playlistId = await getUploadsPlaylistId(channelId, youtubeApiKey);

    // 2. Fetch Upload Video IDs (Full sync paginates through all pages; regular poll fetches 10)
    let candidateVideoIds = [];
    if (isFullSync) {
      candidateVideoIds = await fetchAllUploadVideoIds(playlistId, youtubeApiKey, maxPages);
    } else {
      candidateVideoIds = await fetchLatestUploadVideoIds(playlistId, youtubeApiKey, 15);
    }

    // 3. Diff against existing database records
    const existingIds = await getExistingYoutubeIds(candidateVideoIds);
    const existingSet = new Set(existingIds);
    const newVideoIds = candidateVideoIds.filter(id => !existingSet.has(id));

    let ingestedCount = 0;

    // 4. Fetch details in chunks of 50
    if (newVideoIds.length > 0) {
      const chunkSize = 50;
      for (let i = 0; i < newVideoIds.length; i += chunkSize) {
        const chunkIds = newVideoIds.slice(i, i + chunkSize);
        const detailsList = await fetchVideoDetails(chunkIds, youtubeApiKey);

        for (const video of detailsList) {
          // Attempt translation
          const translationResult = await translateVideo(video, translateApiKey);

          const videoToSave = {
            ...video,
            titleEnglish: translationResult.titleEn || video.titleTamil,
            descriptionEnglish: translationResult.descriptionEn || video.descriptionTamil,
            translatedAt: translationResult.success ? new Date().toISOString() : null
          };

          const savedRow = await upsertVideo(videoToSave);
          if (savedRow) ingestedCount++;
        }
      }
    }

    // 5. Retry pending translations for existing videos where translated_at is NULL
    let retriesAttempted = 0;
    let retriesSucceeded = 0;

    const pendingVideos = await getVideosPendingTranslation(5);
    retriesAttempted = pendingVideos.length;

    for (const pending of pendingVideos) {
      const videoMock = {
        youtubeId: pending.youtube_id,
        titleTamil: pending.title_ta,
        descriptionTamil: pending.description_ta
      };

      const result = await translateVideo(videoMock, translateApiKey);
      if (result.success && result.titleEn) {
        await updateVideoTranslation(pending.youtube_id, result.titleEn, result.descriptionEn);
        retriesSucceeded++;
      }
    }

    return res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      summary: {
        checked: latestVideoIds.length,
        newVideosIngested: ingestedCount,
        retriesAttempted,
        retriesSucceeded
      }
    });

  } catch (error) {
    console.error('Error in /api/cron/fetch-videos:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
