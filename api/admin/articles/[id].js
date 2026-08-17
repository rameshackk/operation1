import { verifyAdminRequest } from '../../../lib/auth-server.js';
import { getArticleById, updateArticle, deleteArticle } from '../../../lib/db.js';

export default async function handler(req, res) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ error: 'Article ID is required' });
  }

  // GET single article by ID
  if (req.method === 'GET') {
    try {
      const article = await getArticleById(id);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      return res.status(200).json({ status: 'success', data: article });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT / PATCH: Update article
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const updateData = req.body || {};
      const updated = await updateArticle(id, updateData);

      return res.status(200).json({
        status: 'success',
        message: 'Article updated successfully',
        data: updated
      });
    } catch (error) {
      console.error(`Error updating article ${id}:`, error);
      if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique')) {
        return res.status(409).json({ error: 'An article with this URL slug already exists. Please modify the slug.' });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE: Remove article
  if (req.method === 'DELETE') {
    try {
      const success = await deleteArticle(id);
      if (!success) {
        return res.status(404).json({ error: 'Article not found or could not be deleted' });
      }
      return res.status(200).json({
        status: 'success',
        message: 'Article deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
