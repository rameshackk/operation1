import { verifyAdminRequest } from '../../../lib/auth-server.js';
import { listArticles, createArticle } from '../../../lib/db.js';

export default async function handler(req, res) {
  // 1. Verify admin role
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

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
