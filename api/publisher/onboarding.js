import { verifyUserRequest } from '../../lib/auth-server.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import { getPgPool } from '../../lib/db.js';

export default async function handler(req, res) {
  // 1. Verify authenticated user
  const auth = await verifyUserRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const userId = auth.user.id;

  // GET: Fetch current publisher onboarding state
  if (req.method === 'GET') {
    try {
      const pgPool = getPgPool();
      if (pgPool) {
        const query = `SELECT * FROM profiles WHERE id = $1 LIMIT 1;`;
        const result = await pgPool.query(query, [userId]);
        return res.status(200).json({ status: 'success', data: result.rows[0] || null });
      }

      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (error) throw error;
        return res.status(200).json({ status: 'success', data });
      }

      return res.status(500).json({ error: 'Database not available' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST / PATCH: Submit first-time onboarding information
  if (req.method === 'POST' || req.method === 'PATCH') {
    try {
      const {
        display_name,
        avatar_url,
        title,
        arn_number,
        specialties,
        bio,
        bio_ta,
        linkedin_url,
        twitter_url,
        youtube_url,
        whatsapp_number,
        phone
      } = req.body || {};

      const updates = {
        updated_at: new Date().toISOString(),
        is_onboarded: true
      };

      if (display_name && display_name.trim()) updates.display_name = display_name.trim();
      if (avatar_url !== undefined) updates.avatar_url = avatar_url;
      if (title !== undefined) updates.title = title;
      if (arn_number !== undefined) updates.arn_number = arn_number;
      if (specialties !== undefined) updates.specialties = Array.isArray(specialties) ? specialties : [specialties];
      if (bio !== undefined) updates.bio = bio;
      if (bio_ta !== undefined) updates.bio_ta = bio_ta;
      if (linkedin_url !== undefined) updates.linkedin_url = linkedin_url;
      if (twitter_url !== undefined) updates.twitter_url = twitter_url;
      if (youtube_url !== undefined) updates.youtube_url = youtube_url;
      if (whatsapp_number !== undefined) updates.whatsapp_number = whatsapp_number;
      if (phone !== undefined) updates.phone = phone;

      const pgPool = getPgPool();
      if (pgPool) {
        const keys = Object.keys(updates);
        const setClauses = keys.map((k, idx) => `"${k}" = $${idx + 1}`).join(', ');
        const values = keys.map(k => updates[k]);
        values.push(userId);

        const query = `UPDATE profiles SET ${setClauses} WHERE id = $${values.length} RETURNING *;`;
        const result = await pgPool.query(query, values);
        return res.status(200).json({
          status: 'success',
          message: 'Publisher onboarding completed successfully!',
          data: result.rows[0]
        });
      }

      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json({
          status: 'success',
          message: 'Publisher onboarding completed successfully!',
          data
        });
      }

      return res.status(500).json({ error: 'Database not available' });
    } catch (err) {
      console.error('Error in publisher onboarding:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
