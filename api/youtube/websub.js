import { getPgPool } from '../../lib/db.js';

export default async function handler(req, res) {
  // 1. Verification GET request from PubSubHubbub hub
  if (req.method === 'GET') {
    const topic = req.query['hub.topic'];
    const challenge = req.query['hub.challenge'];
    const mode = req.query['hub.mode'];

    console.log(`[WebSub] Verification request mode=${mode}, topic=${topic}`);
    if (challenge) {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(challenge);
    }
    return res.status(400).send('Missing hub.challenge');
  }

  // 2. Notification POST request when a video is published / updated
  if (req.method === 'POST') {
    try {
      let rawBody = req.body;
      if (typeof rawBody !== 'string') {
        rawBody = JSON.stringify(rawBody);
      }

      console.log('[WebSub] Notification received');
      
      // Extract video ID from XML payload
      const videoIdMatch = (rawBody || '').match(/<yt:videoId>([^<]+)<\/yt:videoId>/i) ||
                           (rawBody || '').match(/<id>yt:video:([^<]+)<\/id>/i);
      
      const videoId = videoIdMatch ? videoIdMatch[1].trim() : null;

      if (videoId) {
        console.log(`[WebSub] New video published/updated: ${videoId}. Triggering instant sync...`);
        
        // Trigger sync for this specific video in background
        const syncSecret = process.env.SYNC_SECRET || 'muthaleetu_sync_secure_key_2026';
        const syncUrl = `https://www.muthaleetuthisai.com/api/youtube/sync?video_id=${encodeURIComponent(videoId)}&source=websub`;
        
        fetch(syncUrl, {
          method: 'POST',
          headers: {
            'x-sync-secret': syncSecret
          }
        }).catch(err => console.warn('[WebSub] Background sync trigger warning:', err.message));
      } else {
        // Fallback: Trigger general incremental sync
        const syncSecret = process.env.SYNC_SECRET || 'muthaleetu_sync_secure_key_2026';
        fetch(`https://www.muthaleetuthisai.com/api/youtube/sync?source=websub`, {
          method: 'POST',
          headers: { 'x-sync-secret': syncSecret }
        }).catch(() => {});
      }

      // Hub requires fast 200/204 response
      return res.status(200).send('OK');
    } catch (err) {
      console.error('[WebSub] Error processing notification:', err);
      return res.status(200).send('OK'); // Return 200 so hub does not endlessly retry failed parsing
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
