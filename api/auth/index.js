import { supabaseAdmin } from '../../lib/supabase.js';
import { getPgPool } from '../../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.query || {};
  const body = req.body || {};
  const isSignup = action === 'signup' || body.action === 'signup' || !action;

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
