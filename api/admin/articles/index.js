import { verifyAdminOrPublisherRequest } from '../../../lib/auth-server.js';
import { listArticles, createArticle, getArticleById, updateArticle, deleteArticle } from '../../../lib/db.js';
import { translateText } from '../../../lib/translate.js';

export default async function handler(req, res) {
  // 1. Verify admin or publisher role
  const auth = await verifyAdminOrPublisherRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  // Handle translation action
  if (req.query?.action === 'translate' || req.body?.action === 'translate') {
    try {
      const { title_ta, excerpt_ta, body_ta, text } = req.body || {};
      if (text) {
        const translated = await translateText(text);
        return res.status(200).json({ status: 'success', data: { translated } });
      }
      const [title_en, excerpt_en, body_en] = await Promise.all([
        title_ta ? translateText(title_ta) : Promise.resolve(''),
        excerpt_ta ? translateText(excerpt_ta) : Promise.resolve(''),
        body_ta ? translateText(body_ta) : Promise.resolve('')
      ]);
      return res.status(200).json({
        status: 'success',
        data: { title_en, excerpt_en, body_en }
      });
    } catch (error) {
      console.error('Translation error:', error);
      return res.status(500).json({ error: 'Translation failed', message: error.message });
    }
  }

  const { id } = req.query || {};

  // ================= SINGLE ARTICLE BY ID =================
  if (id) {
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

  // ================= COLLECTION OPERATIONS =================

  // GET: List all articles (drafts and published)
  if (req.method === 'GET') {
    try {
      const { page = '1', limit = '50', category = 'all', status = 'all', search = '', sort = 'newest' } = req.query || {};
      const result = await listArticles({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        category: category.toString(),
        status: status.toString(),
        search: search.toString(),
        sort: sort.toString()
      });

      return res.status(200).json({
        status: 'success',
        data: result.articles,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit) || 1
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST: Create a new article
  if (req.method === 'POST') {
    try {
      const {
        slug,
        title_ta,
        title_en,
        excerpt_ta,
        excerpt_en,
        body_ta,
        body_en,
        cover_image_url,
        category,
        tags,
        status
      } = req.body || {};

      if (!title_ta || !title_ta.trim()) {
        return res.status(400).json({ error: 'Tamil title (title_ta) is required' });
      }

      if (!body_ta || !body_ta.trim()) {
        return res.status(400).json({ error: 'Tamil body (body_ta) is required' });
      }

      // Generate or clean slug
      let finalSlug = slug;
      if (!finalSlug || !finalSlug.trim()) {
        const base = (title_en || title_ta)
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        finalSlug = base || `article-${Date.now()}`;
      } else {
        finalSlug = finalSlug
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
      }

      const newArticle = await createArticle({
        slug: finalSlug,
        title_ta,
        title_en,
        excerpt_ta,
        excerpt_en,
        body_ta,
        body_en,
        cover_image_url,
        category: category || 'mutual-fund',
        tags: Array.isArray(tags) ? tags : [],
        status: status === 'published' ? 'published' : 'draft',
        author_id: auth.user.id
      });

      return res.status(201).json({
        status: 'success',
        message: status === 'published' ? 'Article published successfully' : 'Article draft saved',
        data: newArticle
      });

    } catch (error) {
      console.error('Error creating article:', error);
      if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique')) {
        return res.status(409).json({ error: 'An article with this URL slug already exists. Please modify the slug.' });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
