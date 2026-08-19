import { verifyAdminRequest } from '../../../lib/auth-server.js';
import { supabaseAdmin } from '../../../lib/supabase.js';
import { getPgPool } from '../../../lib/db.js';

export default async function handler(req, res) {
  // 1. Verify admin permissions
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const { id } = req.query || {};

  // ================= SINGLE PUBLISHER OPERATIONS (WHEN ID IS PRESENT) =================
  if (id) {
    // Prevent self-deletion of root admin
    if (req.method === 'DELETE' && auth.user.id === id) {
      return res.status(400).json({ error: 'You cannot delete your own admin account from the console.' });
    }

    // GET: Fetch single publisher
    if (req.method === 'GET') {
      try {
        const pgPool = getPgPool();
        if (pgPool) {
          const query = `SELECT * FROM profiles WHERE id = $1 LIMIT 1;`;
          const result = await pgPool.query(query, [id]);
          if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Publisher not found' });
          }
          return res.status(200).json({ status: 'success', data: result.rows[0] });
        }

        if (supabaseAdmin) {
          const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', id).single();
          if (error || !data) return res.status(404).json({ error: 'Publisher not found' });
          return res.status(200).json({ status: 'success', data });
        }

        return res.status(500).json({ error: 'Database client not available' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    // PATCH: Update publisher
    if (req.method === 'PATCH' || req.method === 'PUT') {
      try {
        const updateData = req.body || {};
        const allowedFields = [
          'display_name',
          'title',
          'arn_number',
          'specialties',
          'bio',
          'bio_ta',
          'avatar_url',
          'linkedin_url',
          'twitter_url',
          'youtube_url',
          'phone',
          'whatsapp_number',
          'role',
          'is_onboarded'
        ];

        const cleanUpdates = {};
        allowedFields.forEach(f => {
          if (updateData[f] !== undefined) {
            cleanUpdates[f] = updateData[f];
          }
        });
        cleanUpdates.updated_at = new Date().toISOString();

        const pgPool = getPgPool();
        if (pgPool) {
          const keys = Object.keys(cleanUpdates);
          if (keys.length === 0) return res.status(400).json({ error: 'No update data provided' });

          const setClauses = keys.map((k, idx) => `"${k}" = $${idx + 1}`).join(', ');
          const values = keys.map(k => cleanUpdates[k]);
          values.push(id);

          const query = `UPDATE profiles SET ${setClauses} WHERE id = $${values.length} RETURNING *;`;
          const result = await pgPool.query(query, values);
          if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Publisher not found' });
          }
          return res.status(200).json({ status: 'success', data: result.rows[0] });
        }

        if (supabaseAdmin) {
          const { data, error } = await supabaseAdmin
            .from('profiles')
            .update(cleanUpdates)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          return res.status(200).json({ status: 'success', data });
        }

        return res.status(500).json({ error: 'Database client not available' });
      } catch (err) {
        console.error('Error updating publisher:', err);
        return res.status(500).json({ error: err.message });
      }
    }

    // DELETE: Delete publisher and remove auth user
    if (req.method === 'DELETE') {
      try {
        if (supabaseAdmin) {
          try {
            await supabaseAdmin.auth.admin.deleteUser(id);
          } catch (authErr) {
            console.warn('Auth user deletion warning:', authErr.message);
          }
        }

        const pgPool = getPgPool();
        if (pgPool) {
          await pgPool.query('DELETE FROM profiles WHERE id = $1', [id]);
          return res.status(200).json({
            status: 'success',
            message: 'Publisher account deleted successfully'
          });
        }

        if (supabaseAdmin) {
          const { error } = await supabaseAdmin.from('profiles').delete().eq('id', id);
          if (error) throw error;
          return res.status(200).json({
            status: 'success',
            message: 'Publisher account deleted successfully'
          });
        }

        return res.status(500).json({ error: 'Database client not available' });
      } catch (err) {
        console.error('Error deleting publisher:', err);
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ================= COLLECTION OPERATIONS (GET ALL / CREATE NEW) =================

  // GET: List all publishers and advisors
  if (req.method === 'GET') {
    try {
      const pgPool = getPgPool();
      if (pgPool) {
        const query = `
          SELECT 
            p.*,
            COALESCE(art.article_count, 0) as article_count
          FROM profiles p
          LEFT JOIN (
            SELECT author_id, COUNT(*) as article_count 
            FROM articles 
            GROUP BY author_id
          ) art ON p.id = art.author_id
          WHERE p.role IN ('publisher', 'admin')
          ORDER BY p.created_at DESC;
        `;
        const result = await pgPool.query(query);
        return res.status(200).json({
          status: 'success',
          data: result.rows
        });
      }

      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .in('role', ['publisher', 'admin'])
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json({
          status: 'success',
          data: data || []
        });
      }

      return res.status(500).json({ error: 'Database client not available' });
    } catch (err) {
      console.error('Error fetching publishers:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // POST: Create a new publisher
  if (req.method === 'POST') {
    try {
      const {
        email,
        password,
        display_name,
        title,
        arn_number,
        specialties,
        bio,
        bio_ta,
        linkedin_url,
        twitter_url,
        youtube_url,
        phone,
        whatsapp_number
      } = req.body || {};

      if (!email || !email.trim() || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      if (!display_name || !display_name.trim()) {
        return res.status(400).json({ error: 'Publisher full name / display name is required' });
      }

      let userId = null;

      // 1. Create or link auth user in Supabase Auth via Admin API
      if (supabaseAdmin) {
        const { data: userRecord, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: email.trim().toLowerCase(),
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: display_name.trim(),
            role: 'publisher'
          }
        });

        if (!userError && userRecord?.user?.id) {
          userId = userRecord.user.id;
        } else if (userError) {
          // If user already exists, retrieve existing user ID and update password & role metadata
          if (
            userError.message?.toLowerCase().includes('already') ||
            userError.message?.toLowerCase().includes('duplicate') ||
            userError.message?.toLowerCase().includes('registered') ||
            userError.status === 422
          ) {
            // Find existing user in profiles or Supabase auth
            const { data: existingProfile } = await supabaseAdmin
              .from('profiles')
              .select('id')
              .eq('email', email.trim().toLowerCase())
              .maybeSingle();

            if (existingProfile?.id) {
              userId = existingProfile.id;
            } else {
              const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
              const foundUser = userList?.users?.find(u => u.email?.toLowerCase() === email.trim().toLowerCase());
              if (foundUser?.id) {
                userId = foundUser.id;
              }
            }

            if (userId) {
              // Update user password and role metadata
              await supabaseAdmin.auth.admin.updateUserById(userId, {
                password: password,
                user_metadata: {
                  full_name: display_name.trim(),
                  role: 'publisher'
                }
              });
            } else {
              return res.status(409).json({ error: 'A user with this email already exists in Auth. Please try logging in with this email or use another address.' });
            }
          } else {
            throw userError;
          }
        }
      }

      if (!userId) {
        return res.status(500).json({ error: 'Failed to generate user identifier' });
      }

      // 2. Insert/Upsert into profiles table
      const profileData = {
        id: userId,
        email: email.trim().toLowerCase(),
        display_name: display_name.trim(),
        role: 'publisher',
        title: title || 'AMFI Registered Mutual Fund Specialist',
        arn_number: arn_number || '',
        specialties: Array.isArray(specialties) ? specialties : (specialties ? [specialties] : ['Mutual Funds', 'Wealth Planning']),
        bio: bio || '',
        bio_ta: bio_ta || '',
        linkedin_url: linkedin_url || '',
        twitter_url: twitter_url || '',
        youtube_url: youtube_url || '',
        phone: phone || '',
        whatsapp_number: whatsapp_number || '',
        is_onboarded: false,
        updated_at: new Date().toISOString()
      };

      const pgPool = getPgPool();
      if (pgPool) {
        const query = `
          INSERT INTO profiles (
            id, email, display_name, role, title, arn_number,
            specialties, bio, bio_ta, linkedin_url, twitter_url,
            youtube_url, phone, whatsapp_number, is_onboarded, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP)
          ON CONFLICT (id) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            role = EXCLUDED.role,
            title = EXCLUDED.title,
            arn_number = EXCLUDED.arn_number,
            specialties = EXCLUDED.specialties,
            bio = EXCLUDED.bio,
            bio_ta = EXCLUDED.bio_ta,
            linkedin_url = EXCLUDED.linkedin_url,
            twitter_url = EXCLUDED.twitter_url,
            youtube_url = EXCLUDED.youtube_url,
            phone = EXCLUDED.phone,
            whatsapp_number = EXCLUDED.whatsapp_number,
            is_onboarded = EXCLUDED.is_onboarded,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *;
        `;
        const insertRes = await pgPool.query(query, [
          profileData.id,
          profileData.email,
          profileData.display_name,
          profileData.role,
          profileData.title,
          profileData.arn_number,
          profileData.specialties,
          profileData.bio,
          profileData.bio_ta,
          profileData.linkedin_url,
          profileData.twitter_url,
          profileData.youtube_url,
          profileData.phone,
          profileData.whatsapp_number,
          profileData.is_onboarded
        ]);

        return res.status(201).json({
          status: 'success',
          message: 'Publisher account created successfully',
          data: insertRes.rows[0]
        });
      }

      if (supabaseAdmin) {
        const { data: savedProfile, error: profileErr } = await supabaseAdmin
          .from('profiles')
          .upsert(profileData)
          .select()
          .single();

        if (profileErr) throw profileErr;

        return res.status(201).json({
          status: 'success',
          message: 'Publisher account created successfully',
          data: savedProfile
        });
      }

      return res.status(500).json({ error: 'Database client not available' });
    } catch (err) {
      console.error('Error creating publisher:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
