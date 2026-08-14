/**
 * Centralized API Client with 401 Interception
 * Automatically attaches auth token if present and catches 401 Unauthenticated errors to trigger sign-out flow.
 */

let onUnauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorizedHandler = handler;
}

export async function apiClient(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Get active session token if available
  if (typeof window !== 'undefined' && window.supabaseClient) {
    try {
      const { data } = await window.supabaseClient.auth.getSession();
      const token = data?.session?.access_token;
      if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Could not retrieve access token for API request:', e);
    }
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    // Intercept 401 Unauthorized centrally (e.g. revoked token, admin ban, expired session)
    if (response.status === 401) {
      console.warn('API Client received 401 Unauthorized. Triggering session sign-out...');
      if (typeof onUnauthorizedHandler === 'function') {
        onUnauthorizedHandler();
      } else if (typeof window !== 'undefined' && window.supabaseClient) {
        window.supabaseClient.auth.signOut().catch(() => {});
        window.location.hash = '#/login';
      }
    }

    return response;
  } catch (error) {
    console.error(`API Client fetch error for ${url}:`, error);
    throw error;
  }
}
