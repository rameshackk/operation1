import { supabaseAdmin } from '../../lib/supabase.js';
import { getPgPool } from '../../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.query || {};
  const body = req.body || {};
  const isSignup = action === 'signup' || body.action === 'signup';
  const isSync = action === 'sync_user' || body.action === 'sync_user';

  if (isSync) {
    const userId = body.userId || body.id;
    const email = (body.email || '').toString().trim().toLowerCase();
    const displayName = (body.displayName || body.fullName || body.name || email.split('@')[0] || 'User').toString().trim();
    const avatarUrl = (body.avatarUrl || body.avatar_url || '').toString().trim();

    if (!userId && !email) {
      return res.status(400).json({ error: 'User ID or email is required' });
    }

    try {
      const pgPool = getPgPool();
      let profile = null;

      if (pgPool) {
        // 1. Check if profile exists by ID or email
        const existingRes = await pgPool.query(
          `SELECT * FROM profiles WHERE id = $1 OR (email IS NOT NULL AND LOWER(email) = LOWER($2)) LIMIT 1`,
          [userId || 'no-id', email || 'no-email']
        );

        if (existingRes.rows.length > 0) {
          profile = existingRes.rows[0];
          // If profile exists and ID or avatar needs updating
          if (userId && profile.id !== userId) {
            await pgPool.query(
              `UPDATE profiles 
               SET id = $1, 
                   display_name = COALESCE(NULLIF(display_name, ''), $2), 
                   avatar_url = COALESCE(NULLIF(avatar_url, ''), $3), 
                   updated_at = CURRENT_TIMESTAMP 
               WHERE LOWER(email) = LOWER($4)`,
              [userId, displayName, avatarUrl, email]
            ).catch(e => console.warn('Update ID warning:', e.message));
            profile.id = userId;
          } else if (avatarUrl && !profile.avatar_url) {
            await pgPool.query(
              `UPDATE profiles SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
              [avatarUrl, profile.id]
            ).catch(e => console.warn('Avatar update warning:', e.message));
            profile.avatar_url = avatarUrl;
          }
        } else {
          // New Profile: Check if this user should be admin or standard user
          const isSpecialAdmin = email === 'admin@gmail.com' || email.includes('padmanaban') || email.includes('admin');
          const defaultRole = isSpecialAdmin ? 'admin' : 'user';

          const insertRes = await pgPool.query(
            `INSERT INTO profiles (id, email, display_name, avatar_url, role, is_onboarded, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             ON CONFLICT (id) DO UPDATE SET
               email = COALESCE(EXCLUDED.email, profiles.email),
               display_name = COALESCE(profiles.display_name, EXCLUDED.display_name),
               avatar_url = COALESCE(profiles.avatar_url, EXCLUDED.avatar_url),
               updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [userId || `user-${Date.now()}`, email, displayName, avatarUrl, defaultRole, isSpecialAdmin]
          );
          profile = insertRes.rows[0];
        }
      }

      if (!profile) {
        // 2. Fallback to Supabase Admin Client
        const { data: sbProfile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .or(`id.eq.${userId},email.eq.${email}`)
          .maybeSingle();

        if (sbProfile) {
          profile = sbProfile;
        } else {
          const isSpecialAdmin = email === 'admin@gmail.com' || email.includes('padmanaban') || email.includes('admin');
          const { data: newProfile } = await supabaseAdmin
            .from('profiles')
            .upsert({
              id: userId,
              email: email,
              display_name: displayName,
              avatar_url: avatarUrl,
              role: isSpecialAdmin ? 'admin' : 'user',
              updated_at: new Date().toISOString()
            })
            .select()
            .maybeSingle();
          profile = newProfile || { id: userId, email, display_name: displayName, role: isSpecialAdmin ? 'admin' : 'user' };
        }
      }

      return res.status(200).json({
        status: 'success',
        profile: profile || { id: userId, email, display_name: displayName, role: 'user' }
      });
    } catch (err) {
      console.error('Error during profile sync:', err);
      const isSpecialAdmin = email === 'admin@gmail.com' || email.includes('padmanaban') || email.includes('admin');
      return res.status(200).json({
        status: 'fallback',
        profile: { id: userId, email, display_name: displayName, role: isSpecialAdmin ? 'admin' : 'user' }
      });
    }
  }

  if (isSignup) {
    const email = (body.email || '').toString().trim().toLowerCase();
    const password = (body.password || '').toString();
    const displayName = (body.displayName || body.fullName || body.name || email.split('@')[0] || 'User').toString().trim();

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
      // 1. Create pre-confirmed user directly with Supabase Admin API
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: displayName }
      });

      if (error) {
        if (error.message && (error.message.toLowerCase().includes('already') || error.message.toLowerCase().includes('registered'))) {
          return res.status(400).json({ error: 'This email is already registered. Please log in.' });
        }
        return res.status(400).json({ error: error.message });
      }

      const user = data.user;

      // 2. Ensure profile row exists in PostgreSQL
      const pgPool = getPgPool();
      if (pgPool && user?.id) {
        try {
          await pgPool.query(
            `INSERT INTO profiles (id, email, display_name, role, created_at, updated_at)
             VALUES ($1, $2, $3, 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             ON CONFLICT (id) DO UPDATE SET
               display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
               updated_at = CURRENT_TIMESTAMP`,
            [user.id, email, displayName]
          );
        } catch (dbErr) {
          console.warn('Profile insertion warning:', dbErr.message);
        }
      }

      return res.status(200).json({
        status: 'success',
        message: 'Account created and verified successfully.',
        user: {
          id: user.id,
          email: user.email,
          displayName
        }
      });
    } catch (err) {
      console.error('Error during admin createUser:', err);
      return res.status(500).json({ error: 'Failed to create account', message: err.message });
    }
  }

  return res.status(400).json({ error: 'Invalid auth action' });
}
