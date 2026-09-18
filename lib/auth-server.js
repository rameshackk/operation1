import { supabaseAdmin, supabaseAnon } from './supabase.js';
import { checkRateLimit, getClientIp, logSecurityEvent } from './security.js';

/**
 * Server-side JWT & Admin Role verification helper for API endpoints.
 * Validates JWT token with Supabase Auth engine and confirms genuine admin role in the database.
 */
export async function verifyAdminRequest(req) {
  const auth = await verifyAdminOrPublisherRequest(req);
  if (!auth.authorized) return auth;
  if (auth.profile?.role !== 'admin') {
    const ip = getClientIp(req);
    logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT', {
      ip,
      userId: auth.user?.id,
      email: auth.user?.email,
      attemptedRole: auth.profile?.role
    });
    return { authorized: false, status: 403, error: 'Access denied: Admin role required' };
  }
  return auth;
}

/**
 * Server-side JWT verification helper for Admin and Publisher endpoints.
 * Ensures the caller is authenticated and possesses either 'admin' or 'publisher' role.
 */
export async function verifyAdminOrPublisherRequest(req) {
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip, 'auth_verify', 120, 60000);
  if (!rateCheck.allowed) {
    return { authorized: false, status: 429, error: 'Too many authentication requests. Please try again later.' };
  }

  const authHeader = req.headers?.authorization || req.headers?.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { authorized: false, status: 401, error: 'Missing or malformed Authorization header' };
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    return { authorized: false, status: 401, error: 'Bearer token is required' };
  }

  const client = supabaseAdmin || supabaseAnon;
  if (!client) {
    return { authorized: false, status: 500, error: 'Supabase client not initialized on server' };
  }

  try {
    const { data: { user }, error: authError } = await client.auth.getUser(token);

    if (authError || !user) {
      logSecurityEvent('INVALID_BEARER_TOKEN', { ip, error: authError?.message || 'User not found' });
      return { authorized: false, status: 401, error: `Invalid session token: ${authError?.message || 'User not found'}` };
    }

    const { data: profile, error: profileError } = await (supabaseAdmin || supabaseAnon)
      .from('profiles')
      .select('id, email, display_name, role, is_onboarded')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { authorized: false, status: 403, error: 'User profile not found' };
    }

    if (profile.role !== 'admin' && profile.role !== 'publisher') {
      return { authorized: false, status: 403, error: 'Access denied: Admin or Publisher role required' };
    }

    return { authorized: true, user, profile };
  } catch (err) {
    logSecurityEvent('AUTH_VERIFY_EXCEPTION', { ip, error: err.message });
    return { authorized: false, status: 500, error: 'Internal authentication error' };
  }
}

/**
 * Server-side JWT verification helper for regular authenticated user API endpoints.
 */
export async function verifyUserRequest(req) {
  const headers = req?.headers || {};
  const authHeader = headers.authorization || headers.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { authorized: false, status: 401, error: 'Authentication required: Missing or malformed Authorization header' };
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    return { authorized: false, status: 401, error: 'Authentication required: Bearer token is required' };
  }

  const client = supabaseAdmin || supabaseAnon;
  if (!client) {
    return { authorized: false, status: 500, error: 'Supabase client not initialized on server' };
  }

  try {
    const { data: { user }, error: authError } = await client.auth.getUser(token);

    if (authError || !user) {
      return { authorized: false, status: 401, error: `Invalid or expired session token: ${authError?.message || 'User not found'}` };
    }

    return { authorized: true, user };
  } catch (err) {
    return { authorized: false, status: 500, error: 'Internal authentication error' };
  }
}


