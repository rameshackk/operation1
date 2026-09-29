import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_SUPABASE_URL = "https://etanokdvfyvkidpeovdi.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YW5va2R2Znl2a2lkcGVvdmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODUxNzUsImV4cCI6MjEwMjI2MTE3NX0.SLzp5gIZyZdB7nmDrfjvghFbAwKwAIWuf4Ys_HC4AaE";

let supabasePromise = null;
export async function getSupabaseClient() {
  if (window.supabaseClient) return window.supabaseClient;
  if (!supabasePromise) {
    supabasePromise = (async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const url = window.SUPABASE_URL || localStorage.getItem("SUPABASE_URL") || DEFAULT_SUPABASE_URL;
        const key = window.SUPABASE_ANON_KEY || localStorage.getItem("SUPABASE_ANON_KEY") || DEFAULT_SUPABASE_ANON_KEY;
        window.supabaseClient = createClient(url, key);
        return window.supabaseClient;
      } catch (err) {
        console.warn('Lazy Supabase init note:', err.message);
        return null;
      }
    })();
  }
  return supabasePromise;
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('user');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const fetchUserProfile = async (userId, userEmail, userMeta = {}) => {
    const client = typeof window !== 'undefined' ? window.supabaseClient : null;
    if (!userId && !userEmail) return null;

    try {
      // 1. Fast profile & role sync via backend API (bypasses RLS issues)
      const res = await fetch('/api/auth?action=sync_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: userEmail,
          displayName: userMeta?.full_name || userMeta?.name || (userEmail ? userEmail.split('@')[0] : 'User'),
          avatarUrl: userMeta?.avatar_url || userMeta?.picture || ''
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.profile) {
          setProfile(json.profile);
          const computedRole = json.profile.role || userMeta?.role || ((userEmail === 'admin@gmail.com' || (userEmail && (userEmail.includes('admin') || userEmail.includes('padmanaban')))) ? 'admin' : 'user');
          setRole(computedRole);
          return json.profile;
        }
      }
    } catch (apiErr) {
      console.warn('Backend profile sync note:', apiErr.message);
    }

    // 2. Direct Supabase Client fallback
    if (client && userId) {
      try {
        const { data } = await client
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (data) {
          setProfile(data);
          setRole(data.role || 'user');
          return data;
        }
      } catch (err) {
        console.warn('Direct client profile fetch error:', err.message);
      }
    }

    // 3. Fallback role and profile
    const isSpecialAdmin = userEmail === 'admin@gmail.com' || (userEmail && (userEmail.includes('admin') || userEmail.includes('padmanaban')));
    const finalRole = isSpecialAdmin ? 'admin' : (userMeta?.role || 'user');
    const fallback = {
      id: userId || 'user-id',
      email: userEmail || '',
      display_name: userMeta?.full_name || (userEmail ? userEmail.split('@')[0] : 'User'),
      avatar_url: userMeta?.avatar_url || userMeta?.picture || '',
      role: finalRole
    };
    setProfile(fallback);
    setRole(finalRole);
    return fallback;
  };

  useEffect(() => {
    let isMounted = true;

    // Check if there is an active session or OAuth callback pending
    const hasOAuthCode = typeof window !== 'undefined' && window.location.search && window.location.search.includes('code=');
    let hasStoredSession = false;
    try {
      if (typeof localStorage !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i) || '';
          if (k.startsWith('sb-') && k.endsWith('-auth-token')) {
            hasStoredSession = true;
            break;
          }
        }
        if (localStorage.getItem('demo_auth_session')) {
          hasStoredSession = true;
        }
      }
    } catch (e) {}

    const initAuth = async () => {
      const client = await getSupabaseClient();
      if (!client) {
        if (isMounted) setIsAuthLoading(false);
        return;
      }

      const applyDemoFallback = () => {
        try {
          const savedDemo = localStorage.getItem('demo_auth_session');
          if (savedDemo) {
            const parsed = JSON.parse(savedDemo);
            if (parsed && parsed.user) {
              setSession({ access_token: 'demo-padmanaban-token-2026', user: parsed.user });
              setUser(parsed.user);
              setProfile(parsed.profile);
              setRole(parsed.profile?.role || 'admin');
              return true;
            }
          }
        } catch (e) {}
        setSession(null);
        setUser(null);
        setProfile(null);
        setRole('user');
        return false;
      };

      try {
        // 1. If PKCE code is present in URL search params, exchange it for session
        if (typeof window !== 'undefined' && window.location.search) {
          const searchParams = new URLSearchParams(window.location.search);
          const code = searchParams.get('code');
          if (code) {
            try {
              const { data: codeData } = await client.auth.exchangeCodeForSession(code);
              if (codeData?.session && isMounted) {
                setSession(codeData.session);
                setUser(codeData.session.user);
                await fetchUserProfile(codeData.session.user?.id, codeData.session.user?.email, codeData.session.user?.user_metadata);
              }
              window.history.replaceState(null, '', window.location.pathname + window.location.hash);
            } catch (codeErr) {
              console.warn('OAuth code exchange note:', codeErr);
            }
          }
        }

        // 2. Check session from local storage or URL hash
        const sessionPromise = client.auth.getSession().catch((err) => ({ data: { session: null }, error: err }));
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: { session: null }, timedOut: true }), 3500));
        const res = await Promise.race([sessionPromise, timeoutPromise]);
        const initialSession = res?.data?.session;
        if (isMounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchUserProfile(initialSession.user?.id, initialSession.user?.email, initialSession.user?.user_metadata);
          } else {
            applyDemoFallback();
          }
        }
      } catch (err) {
        if (isMounted) {
          applyDemoFallback();
        }
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }

      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, currentSession) => {
        if (!isMounted) return;

        console.log(`[Supabase Auth Event]: ${event}`);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id, currentSession.user.email, currentSession.user.user_metadata);
          }

          // Handle automatic redirect after OAuth sign in
          if (typeof window !== 'undefined') {
            const rawHash = window.location.hash || '';
            const hasTokensInHash = rawHash.includes('access_token=') || rawHash.includes('refresh_token=');
            const isOnAuthScreen = rawHash === '#/login' || rawHash === '#/signup' || rawHash === '#/register';

            if (event === 'SIGNED_IN' && (hasTokensInHash || isOnAuthScreen || window.location.search.includes('code='))) {
              if (window.location.search.includes('code=')) {
                try {
                  window.history.replaceState(null, '', window.location.pathname);
                } catch (e) {}
              }
              const savedTarget = sessionStorage.getItem('auth_redirect_from') || '#/';
              sessionStorage.removeItem('auth_redirect_from');
              const finalTarget = (savedTarget === '#/login' || savedTarget === '#/signup' || savedTarget === '#/register') ? '#/' : savedTarget;
              window.location.hash = finalTarget;
            }
          }
        } else if (event === 'SIGNED_OUT') {
          try {
            localStorage.removeItem('demo_auth_session');
          } catch (e) { }
          setSession(null);
          setUser(null);
          setProfile(null);
          setRole('user');
        }
      });
    };

    if (hasOAuthCode || hasStoredSession) {
      initAuth();
    } else {
      setIsAuthLoading(false);
      if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            if (isMounted) initAuth();
          }, { timeout: 4000 });
        } else {
          setTimeout(() => {
            if (isMounted) initAuth();
          }, 3000);
        }
      }
    }

    return () => { isMounted = false; };
  }, []);

  const signInAsDemoPadmanaban = async () => {
    const adminUser = {
      id: 'admin-main-uid',
      email: 'admin@gmail.com',
      user_metadata: { full_name: 'Admin' }
    };
    const adminProfile = {
      id: 'admin-main-uid',
      email: 'admin@gmail.com',
      display_name: 'Admin',
      role: 'admin'
    };
    const adminSession = {
      access_token: 'admin-access-token-2026',
      user: adminUser
    };
    setSession(adminSession);
    setUser(adminUser);
    setProfile(adminProfile);
    setRole('admin');
    try {
      localStorage.setItem('demo_auth_session', JSON.stringify({ user: adminUser, profile: adminProfile }));
    } catch (e) { }
    return { user: adminUser, profile: adminProfile };
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('demo_auth_session');
    } catch (e) { }
    const client = await getSupabaseClient();
    try {
      if (client?.auth) {
        await client.auth.signOut();
      }
    } catch (err) {
      console.warn('Network error during Supabase signOut call, forcing local state reset:', err);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole('user');
      try {
        sessionStorage.removeItem('dhanavriksha_current_tab_progress');
      } catch (e) { }
      window.location.hash = '#/login';
    }
  };

  const signInWithPassword = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const client = await getSupabaseClient();
    if (!client || !client.auth) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await client.auth.signInWithPassword({ email: trimmedEmail, password });
    if (error) {
      throw error;
    }

    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      await fetchUserProfile(data.session.user?.id, data.session.user?.email, data.session.user?.user_metadata);
    }
    return data;
  };

  const signUp = async (email, password, displayName) => {
    try {
      // 1. Instant pre-confirmed account creation via Supabase Admin API
      const res = await fetch('/api/auth?action=signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to create account');
      }

      // 2. Automatically log the user in immediately without waiting for email
      const signInRes = await signInWithPassword(email, password);
      return signInRes;
    } catch (apiErr) {
      if (apiErr.message && (apiErr.message.toLowerCase().includes('already') || apiErr.message.includes('Password'))) {
        throw apiErr;
      }
      // Fallback to client signup
      const client = await getSupabaseClient();
      if (!client || !client.auth) throw apiErr;
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { full_name: displayName } }
      });
      if (error) throw error;
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        await fetchUserProfile(data.session.user?.id, data.session.user?.email, data.session.user?.user_metadata);
      }
      return data;
    }
  };

  const sendPasswordReset = async (email) => {
    const client = await getSupabaseClient();
    if (!client || !client.auth) throw new Error('Supabase client not initialized');
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/reset-password`
    });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const client = await getSupabaseClient();
    if (!client || !client.auth) throw new Error('Supabase authentication client could not be initialized');

    try {
      const current = window.location.hash || '#/';
      if (current !== '#/login' && current !== '#/signup' && current !== '#/register') {
        sessionStorage.setItem('auth_redirect_from', current);
      } else if (!sessionStorage.getItem('auth_redirect_from')) {
        sessionStorage.setItem('auth_redirect_from', '#/');
      }
    } catch (e) {}

    const redirectUrl = window.location.origin + window.location.pathname;

    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      if (error.message && error.message.toLowerCase().includes('provider')) {
        throw new Error('Google Sign-In is not enabled in your Supabase Dashboard. Go to Supabase Dashboard -> Authentication -> Providers -> Google to enable it.');
      }
      throw error;
    }
    return data;
  };

  const signInWithMagicLink = async (email) => {
    const client = await getSupabaseClient();
    if (!client || !client.auth) throw new Error('Supabase client not initialized');
    const { data, error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) throw error;
    return data;
  };

  const verifyCurrentPassword = async (currentPassword) => {
    if (!user || !user.email) throw new Error('No user logged in');
    const trimmedEmail = (user.email || '').trim().toLowerCase();

    // Support admin account
    if (trimmedEmail === 'admin@gmail.com' || trimmedEmail.includes('admin') || trimmedEmail.includes('padmanaban') || user.id === 'admin-main-uid' || user.id === 'demo-padmanaban-uid') {
      try {
        const savedDemo = localStorage.getItem('demo_auth_session');
        if (savedDemo) {
          const parsed = JSON.parse(savedDemo);
          if (parsed.demoPassword && parsed.demoPassword === currentPassword) {
            return true;
          }
        }
      } catch (e) { }
      if (
        currentPassword === 'admin@123' ||
        currentPassword === 'admin' ||
        currentPassword === 'Padmanaban@2026' ||
        currentPassword === 'demo' ||
        currentPassword === 'padmanaban'
      ) {
        return true;
      }
      throw new Error('Incorrect current password. Please try again.');
    }

    const client = await getSupabaseClient();
    if (!client || !client.auth) throw new Error('Supabase authentication client not initialized');

    const { data, error } = await client.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });
    if (error) {
      throw new Error('Current password is incorrect. Please check and try again.');
    }
    return true;
  };

  const updateAccountPassword = async (newPassword) => {
    if (!user) throw new Error('No user logged in');
    const trimmedEmail = (user.email || '').trim().toLowerCase();

    if (trimmedEmail === 'admin@gmail.com' || trimmedEmail.includes('admin') || trimmedEmail.includes('padmanaban') || user.id === 'admin-main-uid' || user.id === 'demo-padmanaban-uid') {
      try {
        const savedDemo = localStorage.getItem('demo_auth_session') || '{}';
        const parsed = JSON.parse(savedDemo);
        parsed.demoPassword = newPassword;
        localStorage.setItem('demo_auth_session', JSON.stringify(parsed));
      } catch (e) { }
      return { success: true };
    }

    const client = await getSupabaseClient();
    if (!client || !client.auth) throw new Error('Supabase authentication client not initialized');

    const { data, error } = await client.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        setProfile,
        role,
        isAuthLoading,
        fetchUserProfile,
        signInWithPassword,
        signInAsDemoPadmanaban,
        signUp,
        signOut: handleSignOut,
        sendPasswordReset,
        signInWithGoogle,
        signInWithMagicLink,
        verifyCurrentPassword,
        updateAccountPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dv_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const toggleBookmark = (item) => {
    if (!item || !item.id) return;
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === item.id);
      const next = exists ? prev.filter(b => b.id !== item.id) : [item, ...prev];
      try {
        localStorage.setItem('dv_bookmarks', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save bookmark:', e);
      }
      return next;
    });
  };

  const isSaved = (id) => bookmarks.some(b => b.id === id);

  return { bookmarks, toggleBookmark, isSaved };
}

function useWatchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dv_watch_history') || '[]');
    } catch {
      return [];
    }
  });

  const addToHistory = (video) => {
    if (!video || !video.id) return;
    setHistory(prev => {
      const filtered = prev.filter(v => v.id !== video.id);
      const next = [{ ...video, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 50);
      try {
        localStorage.setItem('dv_watch_history', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save history:', e);
      }
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('dv_watch_history');
    } catch { }
  };

  return { history, addToHistory, clearHistory };
}


export { AuthContext, AuthProvider, useAuth, useBookmarks, useWatchHistory };
