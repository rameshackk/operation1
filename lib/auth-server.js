import { supabaseAdmin, supabaseAnon } from './supabase.js';

/**
 * Server-side JWT & Admin Role verification helper for API endpoints.
 * Never relies on client-provided headers or claims without validating token with Supabase Auth engine.
 */
export async function verifyAdminRequest(req) {
  const auth = await verifyAdminOrPublisherRequest(req);
  if (!auth.authorized) return auth;
  if (auth.profile.role !== 'admin') {
    return { authorized: false, status: 403, error: 'Access denied: Admin role required' };
  }
  return auth;
}

export async function verifyAdminOrPublisherRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
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

  const { data: { user }, error: authError } = await client.auth.getUser(token);

  if (authError || !user) {
    return { authorized: false, status: 401, error: `Invalid session token: ${authError?.message || 'User not found'}` };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { authorized: false, status: 403, error: 'User profile not found' };
  }

  if (profile.role !== 'admin' && profile.role !== 'publisher') {
    return { authorized: false, status: 403, error: 'Access denied: Admin or Publisher role required' };
  }

  return { authorized: true, user, profile };
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

  const { data: { user }, error: authError } = await client.auth.getUser(token);

  if (authError || !user) {
    return { authorized: false, status: 401, error: `Invalid or expired session token: ${authError?.message || 'User not found'}` };
  }

  return { authorized: true, user };
}

