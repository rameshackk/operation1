import { verifyAdminRequest } from '../../../lib/auth-server.js';
import { getPendingPublisherChannels, getVerifiedPublisherChannels, verifyPublisherChannel, getPgPool } from '../../../lib/db.js';
import { supabaseAdmin } from '../../../lib/supabase.js';

export default async function handler(req, res) {
  // 1. Verify caller is authenticated and possesses role = 'admin'
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  // GET: List publisher channels awaiting verification (or all channels)
  if (req.method === 'GET') {
    try {
      const { status = 'pending' } = req.query || {};

      if (status === 'verified') {
        const verified = await getVerifiedPublisherChannels();
        return res.status(200).json({ status: 'success', data: verified });
      }

      if (status === 'all') {
        const pgPool = getPgPool();
        if (pgPool) {
          const query = `
            SELECT 
              id, display_name, email, arn_number, avatar_url,
              youtube_url, youtube_channel_id, youtube_channel_title, youtube_channel_thumbnail,
              youtube_channel_verified, created_at, updated_at
            FROM profiles
            WHERE youtube_channel_id IS NOT NULL AND youtube_channel_id <> ''
            ORDER BY youtube_channel_verified ASC, updated_at DESC;
          `;
          const result = await pgPool.query(query);
          return res.status(200).json({ status: 'success', data: result.rows });
        }
      }

      // Default: Pending channels awaiting verification
      const pending = await getPendingPublisherChannels();
      return res.status(200).json({ status: 'success', data: pending });

    } catch (error) {
      console.error('Error fetching admin channels queue:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // PATCH / POST: Approve or Reject a publisher channel link
  if (req.method === 'PATCH' || req.method === 'POST') {
    try {
      const { publisherId, action } = req.body || {};

      if (!publisherId) {
        return res.status(400).json({ error: 'publisherId is required' });
      }

      const isApprove = action === 'approve' || action === true;
      const updated = await verifyPublisherChannel(publisherId, isApprove);

      return res.status(200).json({
        status: 'success',
        message: isApprove
          ? 'Publisher YouTube channel approved! Channel uploads will be ingested in the next cron run.'
          : 'Publisher YouTube channel rejected.',
        data: updated
      });

    } catch (error) {
      console.error('Error verifying publisher channel:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
