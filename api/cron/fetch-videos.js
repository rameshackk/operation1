import { getUploadsPlaylistId, fetchLatestUploadVideoIds, fetchAllUploadVideoIds, fetchVideoDetails } from '../../lib/youtube.js';
import { translateVideo } from '../../lib/translate.js';
import { getExistingYoutubeIds, upsertVideo, getVideosPendingTranslation, updateVideoTranslation, getVerifiedPublisherChannels } from '../../lib/db.js';
import { classifyCategory, extractSeoKeywords } from '../../lib/taxonomy.js';

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
  const mainChannelId = process.env.YOUTUBE_CHANNEL_ID || 'UCWD5lYsFycgIDyCB_EHpYOQ';
  const translateApiKey = process.env.TRANSLATE_API_KEY;

  const isFullSync = req.query.fullSync === 'true' || req.query.fullSync === '1';
  const maxPages = parseInt(req.query.maxPages || '50', 10);

  if (!youtubeApiKey) {
    return res.status(500).json({ error: 'YOUTUBE_API_KEY environment variable is missing' });
  }

  try {
    // 1. Build List of Channels to Ingest: Main Brand Channel + Verified Publisher Channels
    const channelsToIngest = [
      {
        channelId: mainChannelId,
        sourcePublisherId: null,
        status: 'published',
        channelName: 'Budget Padmanaban (Main)'
      }
    ];

    // Fetch verified publisher channels from database
    try {
      const verifiedPublishers = await getVerifiedPublisherChannels();
      for (const pub of verifiedPublishers) {
        if (pub.youtube_channel_id && pub.youtube_channel_id !== mainChannelId) {
          channelsToIngest.push({
            channelId: pub.youtube_channel_id,
            sourcePublisherId: pub.id,
            status: 'pending', // Verified publisher videos require admin moderation
            channelName: pub.display_name || pub.youtube_channel_title || 'Publisher'
          });
        }
      }
    } catch (pubErr) {
      console.warn('Could not fetch verified publisher channels for cron:', pubErr.message);
    }

    let totalChecked = 0;
    let totalIngested = 0;
    const channelSummaries = [];

    // 2. Loop through each channel
    for (const channelConfig of channelsToIngest) {
      try {
        const playlistId = await getUploadsPlaylistId(channelConfig.channelId, youtubeApiKey);
        
        let candidateVideoIds = [];
        if (isFullSync) {
          candidateVideoIds = await fetchAllUploadVideoIds(playlistId, youtubeApiKey, maxPages);
        } else {
          candidateVideoIds = await fetchLatestUploadVideoIds(playlistId, youtubeApiKey, 15);
        }

        totalChecked += candidateVideoIds.length;

        // Diff against existing database records
        const existingIds = await getExistingYoutubeIds(candidateVideoIds);
        const existingSet = new Set(existingIds);
        const newVideoIds = candidateVideoIds.filter(id => !existingSet.has(id));

        let channelIngestedCount = 0;

        if (newVideoIds.length > 0) {
          const chunkSize = 50;
          for (let i = 0; i < newVideoIds.length; i += chunkSize) {
            const chunkIds = newVideoIds.slice(i, i + chunkSize);
            const detailsList = await fetchVideoDetails(chunkIds, youtubeApiKey);

            for (const video of detailsList) {
              // Categorize and extract SEO tags using taxonomy engine
              const assignedCategory = classifyCategory(
                video.titleTamil || video.title,
                video.descriptionTamil || video.description,
                video.tags || []
              );
              const assignedTags = extractSeoKeywords(
                video.titleTamil || video.title,
                video.descriptionTamil || video.description,
                video.tags || [],
                assignedCategory
              );

              // Attempt translation
              const translationResult = await translateVideo(video, translateApiKey);

              const videoToSave = {
                ...video,
                category: assignedCategory,
                tags: assignedTags,
                titleEnglish: translationResult.titleEn || video.titleTamil,
                descriptionEnglish: translationResult.descriptionEn || video.descriptionTamil,
                translatedAt: translationResult.success ? new Date().toISOString() : null,
                sourcePublisherId: channelConfig.sourcePublisherId,
                status: channelConfig.status
              };

              const savedRow = await upsertVideo(videoToSave);
              if (savedRow) {
                channelIngestedCount++;
                totalIngested++;
              }
            }
          }
        }

        channelSummaries.push({
          channelName: channelConfig.channelName,
          channelId: channelConfig.channelId,
          checked: candidateVideoIds.length,
          newIngested: channelIngestedCount,
          defaultStatus: channelConfig.status
        });

      } catch (cErr) {
        console.error(`Error processing channel ${channelConfig.channelId} (${channelConfig.channelName}):`, cErr);
        channelSummaries.push({
          channelName: channelConfig.channelName,
          channelId: channelConfig.channelId,
          error: cErr.message
        });
      }
    }

    // 3. Retry pending translations for existing videos where translated_at is NULL
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
        channelsProcessed: channelsToIngest.length,
        totalChecked,
        newVideosIngested: totalIngested,
        retriesAttempted,
        retriesSucceeded,
        channels: channelSummaries
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
