import { supabaseAdmin } from '../../lib/supabase.js';
import { getPgPool } from '../../lib/db.js';
import { checkRateLimit, getClientIp, isValidEmail, sanitizeText, logSecurityEvent } from '../../lib/security.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = getClientIp(req);
  const { action } = req.query || {};
  const body = req.body || {};
  const isSignup = action === 'signup' || body.action === 'signup';
  const isSync = action === 'sync_user' || body.action === 'sync_user';

  // 1. SIGNUP HANDLER
  if (isSignup) {
    const rateLimit = checkRateLimit(clientIp, 'auth_signup', 5, 60000);
    if (!rateLimit.allowed) {
      logSecurityEvent('SIGNUP_RATE_LIMIT_EXCEEDED', { ip: clientIp });
      return res.status(429).json({ error: 'Too many signup attempts. Please wait a minute and try again.' });
    }

    const email = (body.email || '').toString().trim().toLowerCase();
    const password = (body.password || '').toString();
    const rawDisplayName = body.displayName || body.fullName || body.name || email.split('@')[0] || 'User';
    const displayName = sanitizeText(rawDisplayName, 100);

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    try {
      // Create pre-confirmed user directly with Supabase Admin API
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

      // Ensure profile row exists in PostgreSQL with safe default role = 'user'
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

      logSecurityEvent('USER_REGISTERED', { ip: clientIp, userId: user.id, email });

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
      logSecurityEvent('SIGNUP_ERROR', { ip: clientIp, email, error: err.message });
      return res.status(500).json({ error: 'Failed to create account', message: err.message });
    }
  }

  // 2. PROFILE SYNC HANDLER (Used on OAuth login or app init)
  if (isSync) {
    const rateLimit = checkRateLimit(clientIp, 'auth_sync', 60, 60000);
    if (!rateLimit.allowed) {
      return res.status(429).json({ error: 'Too many sync requests. Please try again later.' });
    }

    const rawUserId = (body.userId || body.id || '').toString().trim();
    const email = (body.email || '').toString().trim().toLowerCase();
    const rawDisplayName = body.displayName || body.fullName || body.name || (email ? email.split('@')[0] : 'User');
    const displayName = sanitizeText(rawDisplayName, 100);
    const rawAvatarUrl = (body.avatarUrl || body.avatar_url || '').toString().trim();
    const avatarUrl = rawAvatarUrl.startsWith('http://') || rawAvatarUrl.startsWith('https://') || rawAvatarUrl.startsWith('/') ? rawAvatarUrl : '';

    if (!rawUserId && !email) {
      return res.status(400).json({ error: 'User ID or email is required' });
    }

    try {
      const pgPool = getPgPool();
      let profile = null;

      if (pgPool) {
        // 1. Check if profile exists by ID or email
        const existingRes = await pgPool.query(
          `SELECT * FROM profiles WHERE id::text = $1 OR (email IS NOT NULL AND LOWER(email) = LOWER($2)) LIMIT 1`,
          [rawUserId || 'no-id', email || 'no-email']
        );

        if (existingRes.rows.length > 0) {
          profile = existingRes.rows[0];
          // If profile exists and avatar needs updating
          if (avatarUrl && !profile.avatar_url) {
            await pgPool.query(
              `UPDATE profiles SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
              [avatarUrl, profile.id]
            ).catch(e => console.warn('Avatar update warning:', e.message));
            profile.avatar_url = avatarUrl;
          }
        } else {
          // New Profile: Default to 'user' role strictly
          const insertRes = await pgPool.query(
            `INSERT INTO profiles (id, email, display_name, avatar_url, role, is_onboarded, created_at, updated_at)
             VALUES ($1, $2, $3, $4, 'user', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             ON CONFLICT (id) DO UPDATE SET
               email = COALESCE(EXCLUDED.email, profiles.email),
               display_name = COALESCE(profiles.display_name, EXCLUDED.display_name),
               avatar_url = COALESCE(profiles.avatar_url, EXCLUDED.avatar_url),
               updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [rawUserId, email, displayName, avatarUrl || null]
          );
          profile = insertRes.rows[0];
        }
      }

      if (!profile && supabaseAdmin) {
        // Fallback to Supabase Admin Client
        const { data: sbProfile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .or(`id.eq.${rawUserId},email.eq.${email}`)
          .maybeSingle();

        if (sbProfile) {
          profile = sbProfile;
        } else {
          const { data: newProfile } = await supabaseAdmin
            .from('profiles')
            .upsert({
              id: rawUserId,
              email: email,
              display_name: displayName,
              avatar_url: avatarUrl || null,
              role: 'user',
              updated_at: new Date().toISOString()
            })
            .select()
            .maybeSingle();
          profile = newProfile || { id: rawUserId, email, display_name: displayName, role: 'user' };
        }
      }

      return res.status(200).json({
        status: 'success',
        profile: profile || { id: rawUserId, email, display_name: displayName, role: 'user' }
      });
    } catch (err) {
      console.error('Error during profile sync:', err);
      return res.status(200).json({
        status: 'fallback',
        profile: { id: rawUserId, email, display_name: displayName, role: 'user' }
      });
    }
  }

  return res.status(400).json({ error: 'Invalid auth action' });
}

