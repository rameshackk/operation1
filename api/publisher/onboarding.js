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
        // Fetch user email if not in profile
        const userEmail = auth.user.email || '';
        
        const upsertQuery = `
          INSERT INTO profiles (
            id, email, display_name, avatar_url, title, arn_number,
            specialties, bio, bio_ta, linkedin_url, twitter_url,
            youtube_url, whatsapp_number, phone, is_onboarded, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, CURRENT_TIMESTAMP
          )
          ON CONFLICT (id) DO UPDATE SET
            display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
            avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
            title = COALESCE(EXCLUDED.title, profiles.title),
            arn_number = COALESCE(EXCLUDED.arn_number, profiles.arn_number),
            specialties = COALESCE(EXCLUDED.specialties, profiles.specialties),
            bio = COALESCE(EXCLUDED.bio, profiles.bio),
            bio_ta = COALESCE(EXCLUDED.bio_ta, profiles.bio_ta),
            linkedin_url = COALESCE(EXCLUDED.linkedin_url, profiles.linkedin_url),
            twitter_url = COALESCE(EXCLUDED.twitter_url, profiles.twitter_url),
            youtube_url = COALESCE(EXCLUDED.youtube_url, profiles.youtube_url),
            whatsapp_number = COALESCE(EXCLUDED.whatsapp_number, profiles.whatsapp_number),
            phone = COALESCE(EXCLUDED.phone, profiles.phone),
            is_onboarded = true,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *;
        `.replace('COCLUDED', 'COALESCE');

        const values = [
          userId,
          userEmail,
          updates.display_name || auth.user.user_metadata?.full_name || 'Publisher',
          updates.avatar_url || null,
          updates.title || 'AMFI Registered Mutual Fund Distributor',
          updates.arn_number || '',
          updates.specialties || ['Mutual Funds', 'Wealth Planning'],
          updates.bio || '',
          updates.bio_ta || '',
          updates.linkedin_url || '',
          updates.twitter_url || '',
          updates.youtube_url || '',
          updates.whatsapp_number || '',
          updates.phone || ''
        ];

        const result = await pgPool.query(upsertQuery, values);
        return res.status(200).json({
          status: 'success',
          message: 'Publisher onboarding completed successfully!',
          data: result.rows[0]
        });
      }

      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: userId,
            email: auth.user.email,
            ...updates
          })
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
