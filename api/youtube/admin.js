import { getPgPool } from '../../lib/db.js';
import { verifyAdminRequest } from '../../lib/auth-server.js';
import { ALLOWED_CATEGORIES } from '../../lib/youtube.js';

export default async function handler(req, res) {
  // 1. Authenticate admin user
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status || 401).json({ error: auth.error || 'Admin access required' });
  }

  const pool = getPgPool();
  if (!pool) {
    return res.status(500).json({ error: 'Database connection unavailable' });
  }

  const action = req.query.action || (req.method === 'POST' ? req.body?.action : 'list');

  try {
    // ================= 1. LIST VIDEOS (WITH ADMIN METADATA) =================
    if (req.method === 'GET' && action === 'list') {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
      const offset = (page - 1) * limit;
      const search = req.query.search ? req.query.search.trim() : '';

      let countSql = 'SELECT COUNT(*) FROM public.youtube_videos';
      let dataSql = `
        SELECT 
          video_id, title, published_at, duration_seconds, view_count,
          thumbnail_url, is_short, is_live, category, category_locked,
          is_hidden, is_pinned, synced_at
        FROM public.youtube_videos
      `;

      const params = [];
      if (search) {
        params.push(`%${search}%`);
        const clause = ' WHERE title ILIKE $1 OR video_id ILIKE $1 OR category ILIKE $1';
        countSql += clause;
        dataSql += clause;
      }

      dataSql += ' ORDER BY is_pinned DESC, published_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);

      const [countRes, dataRes] = await Promise.all([
        pool.query(countSql, search ? [params[0]] : []),
        pool.query(dataSql, [...params, limit, offset])
      ]);

      const total = parseInt(countRes.rows[0]?.count || '0', 10);

      return res.status(200).json({
        status: 'success',
        data: dataRes.rows || [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1
        },
        allowedCategories: ALLOWED_CATEGORIES
      });
    }

    // ================= 2. UPDATE VIDEO METADATA (HIDE, PIN, CATEGORY) =================
    if (req.method === 'POST' && action === 'update') {
      const { videoId, isHidden, isPinned, category } = req.body || {};
      if (!videoId) {
        return res.status(400).json({ error: 'Missing videoId' });
      }

      const updates = [];
      const values = [videoId];

      if (typeof isHidden === 'boolean') {
        values.push(isHidden);
        updates.push(`is_hidden = $${values.length}`);
      }

      if (typeof isPinned === 'boolean') {
        values.push(isPinned);
        updates.push(`is_pinned = $${values.length}`);
      }

      if (category && ALLOWED_CATEGORIES.includes(category)) {
        values.push(category);
        updates.push(`category = $${values.length}`);
        updates.push('category_locked = true');
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No valid update fields provided' });
      }

      const updateSql = `
        UPDATE public.youtube_videos 
        SET ${updates.join(', ')} 
        WHERE video_id = $1
        RETURNING video_id, is_hidden, is_pinned, category, category_locked;
      `;

      const result = await pool.query(updateSql, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }

      return res.status(200).json({
        status: 'success',
        data: result.rows[0],
        message: 'Video updated successfully'
      });
    }

    // ================= 3. TRIGGER MANUAL SYNC =================
    if (req.method === 'POST' && action === 'sync') {
      const syncSecret = process.env.SYNC_SECRET || 'muthaleetu_sync_secure_key_2026';
      const isFull = req.body?.full === true || req.body?.full === '1';
      
      const syncUrl = `https://www.muthaleetuthisai.com/api/youtube/sync?full=${isFull ? '1' : '0'}&source=admin-panel`;
      
      // Call sync endpoint directly or trigger execution
      try {
        const syncResponse = await fetch(syncUrl, {
          method: 'POST',
          headers: {
            'x-sync-secret': syncSecret
          }
        });
        const syncResult = await syncResponse.json();
        return res.status(200).json({
          status: 'success',
          data: syncResult,
          message: 'Sync executed successfully'
        });
      } catch (syncErr) {
        return res.status(500).json({
          status: 'error',
          error: 'Sync trigger error',
          message: syncErr.message
        });
      }
    }

    // ================= 4. GET LAST 20 SYNC LOGS =================
    if (req.method === 'GET' && action === 'logs') {
      const logsRes = await pool.query(
        'SELECT id, ran_at, source, new_count, updated_count, error FROM public.youtube_sync_log ORDER BY id DESC LIMIT 20'
      );
      return res.status(200).json({
        status: 'success',
        data: logsRes.rows || []
      });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (error) {
    console.error('Admin YouTube handler error:', error);
    return res.status(500).json({ error: 'Admin operation failed', message: error.message });
  }
}
