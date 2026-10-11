import { verifyUserRequest, verifyAdminRequest } from '../../lib/auth-server.js';
import { getPgPool, invalidateCache } from '../../lib/db.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import { 
  sanitizeHtml, 
  sanitizeText, 
  sanitizeSlug, 
  checkRateLimit, 
  getClientIp, 
  logSecurityEvent 
} from '../../lib/security.js';

const ALLOWED_CATEGORIES = [
  'personal-finance',
  'mutual-funds',
  'stocks',
  'tax-retirement',
  'financial-education',
  'quick-takes'
];

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const clientIp = getClientIp(req);
  const pgPool = getPgPool();

  if (!pgPool && !supabaseAdmin) {
    return res.status(500).json({ error: 'Database service unavailable' });
  }

  // ================= 1. SUBMISSION IMAGE UPLOAD =================
  if (req.method === 'POST' && (req.query?.action === 'upload' || req.body?.action === 'upload')) {
    const auth = await verifyUserRequest(req);
    if (!auth.authorized) {
      return res.status(auth.status).json({ error: auth.error });
    }

    const rate = checkRateLimit(clientIp, 'submission_upload', 20, 60000);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Upload rate limit exceeded. Please wait a minute and try again.' });
    }

    try {
      const { fileData, fileName = 'submission.jpg', fileType = 'image/jpeg' } = req.body || {};
      if (!fileData || typeof fileData !== 'string') {
        return res.status(400).json({ error: 'Image fileData is required' });
      }

      // If already a valid web URL, return it
      if (fileData.startsWith('http://') || fileData.startsWith('https://')) {
        return res.status(200).json({ status: 'success', data: { url: fileData } });
      }

      let buffer;
      let mimeType = (fileType || 'image/jpeg').toLowerCase();

      if (fileData.startsWith('data:')) {
        const matches = fileData.match(/^data:([A-Za-z0-9\-+\/]+);base64,(.+)$/s);
        if (!matches) {
          return res.status(400).json({ error: 'Invalid data URL format' });
        }
        mimeType = matches[1].toLowerCase();
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(fileData, 'base64');
      }

      // Validate allowed mime types: JPG, PNG, WEBP only
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(mimeType)) {
        return res.status(400).json({ error: 'Only JPG, PNG, and WEBP image files are allowed.' });
      }

      // Validate max size (5MB limit)
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image exceeds maximum 5MB size limit.' });
      }

      const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
      const cleanFileName = `user_${auth.user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = `covers/${cleanFileName}`;

      if (supabaseAdmin) {
        // Ensure bucket exists
        await supabaseAdmin.storage.createBucket('article-submissions', { public: true }).catch(() => {});

        const { error: uploadErr } = await supabaseAdmin.storage
          .from('article-submissions')
          .upload(filePath, buffer, {
            contentType: mimeType,
            upsert: true
          });

        if (uploadErr) {
          console.error('[Storage] Upload error:', uploadErr);
          return res.status(500).json({ error: 'Failed to upload image to storage' });
        }

        const { data: publicUrlData } = supabaseAdmin.storage
          .from('article-submissions')
          .getPublicUrl(filePath);

        return res.status(200).json({
          status: 'success',
          data: {
            url: publicUrlData.publicUrl,
            size: buffer.length
          }
        });
      }

      return res.status(500).json({ error: 'Storage service not available' });
    } catch (err) {
      console.error('[Storage Exception]', err);
      return res.status(500).json({ error: err.message || 'Image processing error' });
    }
  }

  // ================= 2. ADMIN REVIEW ACTION (Approve & Publish / Reject) =================
  if (req.method === 'POST' && (req.query?.action === 'review' || req.body?.action === 'review')) {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return res.status(auth.status).json({ error: auth.error });
    }

    const { id, decision, review_notes, editedData } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'Submission ID is required' });
    }

    if (!['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ error: 'Decision must be approve or reject' });
    }

    try {
      // Fetch existing submission
      let sub;
      if (pgPool) {
        const subRes = await pgPool.query('SELECT * FROM article_submissions WHERE id = $1', [id]);
        if (subRes.rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
        sub = subRes.rows[0];
      } else {
        const { data, error } = await supabaseAdmin.from('article_submissions').select('*').eq('id', id).single();
        if (error || !data) return res.status(404).json({ error: 'Submission not found' });
        sub = data;
      }

      if (decision === 'reject') {
        const notes = sanitizeText(review_notes || 'Does not align with our editorial guidelines.', 500);
        if (pgPool) {
          await pgPool.query(`
            UPDATE article_submissions
            SET status = 'rejected',
                reviewed_by = $1,
                reviewed_at = CURRENT_TIMESTAMP,
                review_notes = $2
            WHERE id = $3
          `, [auth.user.id, notes, id]);
        } else {
          await supabaseAdmin.from('article_submissions').update({
            status: 'rejected',
            reviewed_by: auth.user.id,
            reviewed_at: new Date().toISOString(),
            review_notes: notes
          }).eq('id', id);
        }

        return res.status(200).json({
          status: 'success',
          message: 'Submission rejected successfully.'
        });
      }

      // DECISION === 'approve': Publish directly to live articles table
      const title = sanitizeText(editedData?.title || sub.title, 200);
      const category = ALLOWED_CATEGORIES.includes(editedData?.category) ? editedData.category : sub.category;
      const displayName = sanitizeText(editedData?.display_name || sub.display_name, 100);
      const summary = sanitizeText(editedData?.summary || sub.summary || '', 600);
      const body = sanitizeHtml(editedData?.body || sub.body || '');
      const coverImage = editedData?.cover_image_url || sub.cover_image_url || '';

      // Generate clean unique slug
      let baseSlug = sanitizeSlug(title) || 'community-article';
      let slug = baseSlug;
      let counter = 1;

      if (pgPool) {
        while (true) {
          const chk = await pgPool.query('SELECT id FROM articles WHERE slug = $1', [slug]);
          if (chk.rows.length === 0) break;
          slug = `${baseSlug}-${counter++}`;
        }
      }

      const words = body.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(words / 150));

      let publishedArticleId;

      if (pgPool) {
        const insertArt = await pgPool.query(`
          INSERT INTO articles (
            slug, title_ta, title_en, excerpt_ta, excerpt_en,
            body_ta, body_en, cover_image_url, category,
            status, author_id, author_display_name, is_community,
            read_time_minutes, published_at, created_at, updated_at
          ) VALUES (
            $1, $2, $2, $3, $3,
            $4, $4, $5, $6,
            'published', $7, $8, true,
            $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
          RETURNING id, slug
        `, [
          slug, title, summary, body, coverImage, category,
          sub.submitter_user_id, displayName, readTime
        ]);

        publishedArticleId = insertArt.rows[0].id;

        await pgPool.query(`
          UPDATE article_submissions
          SET status = 'approved',
              reviewed_by = $1,
              reviewed_at = CURRENT_TIMESTAMP,
              review_notes = $2,
              published_article_id = $3
          WHERE id = $4
        `, [auth.user.id, sanitizeText(review_notes || 'Approved & Published', 500), publishedArticleId, id]);
      } else {
        const { data: newArt, error: insErr } = await supabaseAdmin.from('articles').insert({
          slug,
          title_ta: title,
          title_en: title,
          excerpt_ta: summary,
          excerpt_en: summary,
          body_ta: body,
          body_en: body,
          cover_image_url: coverImage,
          category,
          status: 'published',
          author_id: sub.submitter_user_id,
          author_display_name: displayName,
          is_community: true,
          read_time_minutes: readTime,
          published_at: new Date().toISOString()
        }).select().single();

        if (insErr) throw insErr;
        publishedArticleId = newArt.id;

        await supabaseAdmin.from('article_submissions').update({
          status: 'approved',
          reviewed_by: auth.user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: sanitizeText(review_notes || 'Approved & Published', 500),
          published_article_id: publishedArticleId
        }).eq('id', id);
      }

      invalidateCache('articles:');
      invalidateCache('home:');

      return res.status(200).json({
        status: 'success',
        message: 'Submission approved and published live!',
        data: {
          articleId: publishedArticleId,
          slug
        }
      });
    } catch (err) {
      console.error('[Review Exception]', err);
      return res.status(500).json({ error: err.message || 'Review action failed' });
    }
  }

  // ================= 3. GET SUBMISSIONS (USER "MY SUBMISSIONS" OR ADMIN QUEUE) =================
  if (req.method === 'GET') {
    const isAdminQuery = req.query?.admin === '1';
    const isStatsQuery = req.query?.stats === '1';

    // 3.1 Admin Queue or Stats
    if (isAdminQuery || isStatsQuery) {
      const auth = await verifyAdminRequest(req);
      if (!auth.authorized) {
        return res.status(auth.status).json({ error: auth.error });
      }

      try {
        if (isStatsQuery) {
          let pendingCount = 0;
          if (pgPool) {
            const r = await pgPool.query("SELECT COUNT(*) AS count FROM article_submissions WHERE status = 'pending'");
            pendingCount = parseInt(r.rows[0]?.count || '0', 10);
          } else {
            const { count } = await supabaseAdmin.from('article_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending');
            pendingCount = count || 0;
          }
          return res.status(200).json({ status: 'success', pendingCount });
        }

        const statusFilter = (req.query?.status || 'all').toLowerCase();
        let query = `
          SELECT 
            s.*,
            p.email AS submitter_email,
            p.avatar_url AS submitter_avatar,
            a.slug AS published_slug
          FROM article_submissions s
          LEFT JOIN profiles p ON s.submitter_user_id = p.id
          LEFT JOIN articles a ON s.published_article_id = a.id
        `;
        const values = [];

        if (statusFilter !== 'all') {
          query += ` WHERE s.status = $1`;
          values.push(statusFilter);
        }

        query += ` ORDER BY s.submitted_at DESC LIMIT 100`;

        let submissions = [];
        let pendingCount = 0;

        if (pgPool) {
          const resRows = await pgPool.query(query, values);
          submissions = resRows.rows;

          const countRes = await pgPool.query("SELECT COUNT(*) AS count FROM article_submissions WHERE status = 'pending'");
          pendingCount = parseInt(countRes.rows[0]?.count || '0', 10);
        } else {
          let q = supabaseAdmin.from('article_submissions').select('*, profiles(email, avatar_url), articles(slug)').order('submitted_at', { ascending: false }).limit(100);
          if (statusFilter !== 'all') q = q.eq('status', statusFilter);
          const { data } = await q;
          submissions = data || [];
          const { count } = await supabaseAdmin.from('article_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending');
          pendingCount = count || 0;
        }

        return res.status(200).json({
          status: 'success',
          data: submissions,
          pendingCount
        });
      } catch (err) {
        console.error('[Admin Submissions Exception]', err);
        return res.status(500).json({ error: err.message || 'Failed to fetch submissions' });
      }
    }

    // 3.2 User "My Submissions"
    const auth = await verifyUserRequest(req);
    if (!auth.authorized) {
      return res.status(auth.status).json({ error: auth.error });
    }

    try {
      let mySubmissions = [];
      if (pgPool) {
        const resRows = await pgPool.query(`
          SELECT 
            s.id, s.title, s.category, s.display_name, s.summary,
            s.cover_image_url, s.status, s.submitted_at, s.reviewed_at,
            s.review_notes, s.published_article_id,
            a.slug AS published_slug
          FROM article_submissions s
          LEFT JOIN articles a ON s.published_article_id = a.id
          WHERE s.submitter_user_id = $1
          ORDER BY s.submitted_at DESC
        `, [auth.user.id]);
        mySubmissions = resRows.rows;
      } else {
        const { data } = await supabaseAdmin
          .from('article_submissions')
          .select('*, articles(slug)')
          .eq('submitter_user_id', auth.user.id)
          .order('submitted_at', { ascending: false });
        mySubmissions = data || [];
      }

      return res.status(200).json({
        status: 'success',
        data: mySubmissions
      });
    } catch (err) {
      console.error('[My Submissions Exception]', err);
      return res.status(500).json({ error: err.message || 'Failed to load user submissions' });
    }
  }

  // ================= 4. POST NEW SUBMISSION =================
  if (req.method === 'POST') {
    const auth = await verifyUserRequest(req);
    if (!auth.authorized) {
      return res.status(auth.status).json({ error: auth.error });
    }

    // IP Rate Limiting
    const ipRate = checkRateLimit(clientIp, 'article_submit_ip', 10, 3600000);
    if (!ipRate.allowed) {
      return res.status(429).json({ error: 'Too many submissions from this connection. Please try again later.' });
    }

    try {
      // Check user's current pending submissions (max 5 pending at a time to prevent spam)
      if (pgPool) {
        const countChk = await pgPool.query(
          "SELECT COUNT(*) AS count FROM article_submissions WHERE submitter_user_id = $1 AND status = 'pending'",
          [auth.user.id]
        );
        const currentPending = parseInt(countChk.rows[0]?.count || '0', 10);
        if (currentPending >= 5) {
          return res.status(429).json({
            error: 'You currently have 5 pending articles awaiting editorial review. Please wait for them to be reviewed before submitting more.'
          });
        }
      }

      const body = req.body || {};
      const rawTitle = (body.title || '').toString().trim();
      const rawCategory = (body.category || 'personal-finance').toString().trim().toLowerCase();
      const rawDisplayName = (body.displayName || body.display_name || auth.user.user_metadata?.full_name || 'Community Contributor').toString().trim();
      const rawSummary = (body.summary || '').toString().trim();
      const rawContent = (body.body || body.content || '').toString().trim();
      const rawCoverImage = (body.coverImageUrl || body.cover_image_url || '').toString().trim();

      // Validation
      if (!rawTitle || rawTitle.length < 10) {
        return res.status(400).json({ error: 'Article title must be at least 10 characters long.' });
      }
      if (rawTitle.length > 200) {
        return res.status(400).json({ error: 'Article title cannot exceed 200 characters.' });
      }

      if (!rawDisplayName) {
        return res.status(400).json({ error: 'Author display name is required.' });
      }

      if (!rawContent || rawContent.length < 50) {
        return res.status(400).json({ error: 'Article content must be at least 50 characters long.' });
      }
      if (rawContent.length > 30000) {
        return res.status(400).json({ error: 'Article content is too long (maximum 30,000 characters).' });
      }

      const category = ALLOWED_CATEGORIES.includes(rawCategory) ? rawCategory : 'personal-finance';
      const title = sanitizeText(rawTitle, 200);
      const displayName = sanitizeText(rawDisplayName, 100);
      const summary = sanitizeText(rawSummary, 600);
      const sanitizedBody = sanitizeHtml(rawContent);

      let newRow;
      if (pgPool) {
        const ins = await pgPool.query(`
          INSERT INTO article_submissions (
            submitter_user_id, title, category, display_name,
            summary, body, cover_image_url, status, submitted_at
          ) VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, 'pending', CURRENT_TIMESTAMP
          )
          RETURNING *
        `, [auth.user.id, title, category, displayName, summary, sanitizedBody, rawCoverImage || null]);
        newRow = ins.rows[0];
      } else {
        const { data, error: insErr } = await supabaseAdmin.from('article_submissions').insert({
          submitter_user_id: auth.user.id,
          title,
          category,
          display_name: displayName,
          summary,
          body: sanitizedBody,
          cover_image_url: rawCoverImage || null,
          status: 'pending'
        }).select().single();
        if (insErr) throw insErr;
        newRow = data;
      }

      logSecurityEvent('ARTICLE_SUBMITTED', {
        ip: clientIp,
        userId: auth.user.id,
        submissionId: newRow.id,
        title
      });

      return res.status(201).json({
        status: 'success',
        message: 'Your article has been submitted for editorial review!',
        data: newRow
      });
    } catch (err) {
      console.error('[Create Submission Exception]', err);
      return res.status(500).json({ error: err.message || 'Failed to submit article' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
