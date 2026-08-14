import React, { createContext, useContext, useState, useEffect } from 'react';
import { setUnauthorizedHandler } from '../lib/apiClient.js';

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  role: 'user',
  isAuthLoading: true,
  signInWithPassword: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPasswordForEmail: async () => {},
  signInWithGoogle: async () => {},
  signInWithMagicLink: async () => {}
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('user');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Helper to fetch matching profiles row from Supabase
  const fetchUserProfile = async (userId, userEmail) => {
    if (!userId || !window.supabaseClient) return null;
    try {
      const { data, error } = await window.supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching user profile:', error.message);
      }

      if (data) {
        setProfile(data);
        setRole(data.role || 'user');
        return data;
      } else {
        // Fallback profile if row not created yet
        const fallback = {
          id: userId,
          email: userEmail || '',
          display_name: userEmail ? userEmail.split('@')[0] : 'User',
          role: 'user'
        };
        setProfile(fallback);
        setRole('user');
        return fallback;
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Single central auth state listener driving the application
    const initAuth = async () => {
      if (!window.supabaseClient) {
        if (isMounted) setIsAuthLoading(false);
        return;
      }

      try {
        // 1. Initial Session Check on App Load
        const { data: { session: initialSession } } = await window.supabaseClient.auth.getSession();
        if (isMounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchUserProfile(initialSession.user?.id, initialSession.user?.email);
          } else {
            setSession(null);
            setUser(null);
            setProfile(null);
            setRole('user');
          }
        }
      } catch (err) {
        console.error('Error during initial session check:', err);
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }

      // 2. Subscribe to auth state changes (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED)
      const { data: { subscription } } = window.supabaseClient.auth.onAuthStateChange(async (event, currentSession) => {
        if (!isMounted) return;

        console.log(`[Supabase Auth Event]: ${event}`);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id, currentSession.user.email);
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear context auth state & redirect to /login
          setSession(null);
          setUser(null);
          setProfile(null);
          setRole('user');
          if (window.location.hash !== '#/login') {
            window.location.hash = '#/login';
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    const cleanupPromise = initAuth();

    // Register 401 interception handler
    setUnauthorizedHandler(() => {
      handleSignOut();
    });

    return () => {
      isMounted = false;
      cleanupPromise.then(cleanup => cleanup && cleanup()).catch(() => {});
    };
  }, []);

  // Robust Sign Out handler with fallback for network failures
  const handleSignOut = async () => {
    try {
      if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
      }
    } catch (err) {
      console.warn('Network error during Supabase signOut call, forcing local state reset:', err);
    } finally {
      // Clear in-memory auth state
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole('user');

      // Clear in-memory watch progress
      try {
        sessionStorage.removeItem('dhanavriksha_current_tab_progress');
      } catch (e) {}

      // Preserve device preferences (language & theme)
      // Redirect to /login
      window.location.hash = '#/login';
    }
  };

  const signInWithPassword = async (email, password) => {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const res = await window.supabaseClient.auth.signInWithPassword({ email, password });
    if (res.error) throw res.error;
    return res.data;
  };

  const signUp = async (email, password, options = {}) => {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const res = await window.supabaseClient.auth.signUp({ email, password, options });
    if (res.error) throw res.error;
    return res.data;
  };

  const resetPasswordForEmail = async (email, options = {}) => {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const res = await window.supabaseClient.auth.resetPasswordForEmail(email, options);
    if (res.error) throw res.error;
    return res.data;
  };

  const signInWithGoogle = async () => {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const res = await window.supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (res.error) throw res.error;
    return res.data;
  };

  const signInWithMagicLink = async (email) => {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const res = await window.supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (res.error) throw res.error;
    return res.data;
  };

  // Branded Loading Screen during initial session check
  if (isAuthLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white p-6 select-none">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 animate-spin opacity-80 blur-sm" />
          <div className="absolute w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-xl">
            <span className="text-xl font-black text-slate-950">DV</span>
          </div>
        </div>
        <h1 className="text-lg font-extrabold tracking-wide font-serif text-amber-400 mb-2">
          முதலீட்டு திசை | Muthaleetu Thisai
        </h1>
        <p className="text-xs text-slate-400 font-medium animate-pulse">
          Loading Auth Session...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role,
        isAuthLoading,
        signInWithPassword,
        signUp,
        signOut: handleSignOut,
        resetPasswordForEmail,
        signInWithGoogle,
        signInWithMagicLink
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
