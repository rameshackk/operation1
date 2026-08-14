import { verifyAdminRequest } from '../../lib/auth-server.js';
import { getAdminMetrics } from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify caller is authenticated and possesses role = 'admin'
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const metrics = await getAdminMetrics();
    return res.status(200).json({
      status: 'success',
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return res.status(500).json({ error: 'Failed to fetch admin metrics', message: error.message });
  }
}
