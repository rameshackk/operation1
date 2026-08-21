import { verifyAdminRequest } from '../../lib/auth-server.js';
import { listVideos, getVideoByYoutubeId, updateVideoTranslation, updateVideoStatus } from '../../lib/db.js';
import { translateVideo } from '../../lib/translate.js';
import { supabaseAdmin } from '../../lib/supabase.js';

export default async function handler(req, res) {
  // 1. Verify caller is authenticated and possesses role = 'admin'
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  if (req.method === 'GET') {
    try {
      const { page = '1', limit = '50', category = 'all', status = 'all', sourcePublisherId = null, search = '' } = req.query;
      const result = await listVideos({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        category: category.toString(),
        status: status.toString(),
        sourcePublisherId: sourcePublisherId ? sourcePublisherId.toString() : null,
        search: search.toString()
      });
      return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { youtubeId, status, category, tags, trending, retryTranslation } = req.body || {};

      if (!youtubeId) {
        return res.status(400).json({ error: 'youtubeId is required' });
      }

      const existing = await getVideoByYoutubeId(youtubeId);
      if (!existing) {
        return res.status(404).json({ error: 'Video not found' });
      }

      let updatedTranslation = null;

      // Handle manual translation retry if requested
      if (retryTranslation) {
        const videoMock = {
          youtubeId,
          titleTamil: existing.titleTamil,
          descriptionTamil: existing.descriptionTamil
        };
        const result = await translateVideo(videoMock);
        if (result.success && result.titleEn) {
          await updateVideoTranslation(youtubeId, result.titleEn, result.descriptionEn);
          updatedTranslation = result;
        } else {
          return res.status(500).json({ error: 'Translation retry failed', details: result.error });
        }
      }

      // Handle direct status update (Approve/Reject)
      if (status && ['published', 'rejected', 'pending'].includes(status)) {
        const updatedRow = await updateVideoStatus(youtubeId, status);
        return res.status(200).json({
          status: 'success',
          message: `Video status updated to ${status}`,
          data: updatedRow,
          updatedTranslation
        });
      }

      // Update fields in database using supabaseAdmin
      const updateData = { updated_at: new Date().toISOString() };
      if (category !== undefined) updateData.category = category;
      if (tags !== undefined) updateData.tags = tags;
      if (trending !== undefined) updateData.trending = trending;

      const { data, error } = await supabaseAdmin
        .from('videos')
        .update(updateData)
        .eq('youtube_id', youtubeId)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        status: 'success',
        message: 'Video updated successfully',
        data,
        updatedTranslation
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
