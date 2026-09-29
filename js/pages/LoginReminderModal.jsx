import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function LoginReminderModal({ currentHash, onNavigate }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Do not show if user is already logged in
    if (user) {
      setIsOpen(false);
      return;
    }

    // Do not show if currently on any auth screen
    const isAuthPage = ['#/login', '#/signup', '#/register', '#/forgot-password', '#/reset-password'].includes(currentHash);
    if (isAuthPage) {
      setIsOpen(false);
      return;
    }

    // Check if dismissed in this browsing session
    try {
      if (sessionStorage.getItem('login_reminder_dismissed') === 'true') {
        return;
      }
    } catch (e) { }

    // Popup after 30 seconds for new visitors (optional login reminder)
    const popupTimer = setTimeout(() => {
      const currentlyOnAuthPage = ['#/login', '#/signup', '#/register', '#/forgot-password', '#/reset-password'].includes(window.location.hash);
      if (!currentlyOnAuthPage) {
        setIsOpen(true);
      }
    }, 30000);

    return () => clearTimeout(popupTimer);
  }, [user, currentHash]);

  // Once popped up, automatically close in 5 seconds
  useEffect(() => {
    if (!isOpen) return;

    const autoCloseTimer = setTimeout(() => {
      setIsOpen(false);
    }, 5000);

    return () => clearTimeout(autoCloseTimer);
  }, [isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('login_reminder_dismissed', 'true');
    } catch (e) { }
  };

  const handleGoToLogin = () => {
    handleDismiss();
    onNavigate('#/login');
  };

  if (!isOpen || user) return null;

  const isTa = language === 'ta';

  return (
    <div
      className="notification-banner-right w-[calc(100vw-2rem)] sm:w-auto max-w-[340px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-2.5 sm:p-3 shadow-2xl shadow-slate-900/15 dark:shadow-black/60 text-slate-900 dark:text-slate-100 overflow-hidden"
      role="alert"
    >
      <div className="flex items-center gap-2.5">
        {/* Minimal Icon */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brandBlue-500 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-md shadow-brandBlue-500/25">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        {/* Minimal Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {isTa ? 'உள்நுழைக' : 'Sign In'}
            </h4>
            <span className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-500 font-medium">
              {isTa ? '(விருப்பமானது)' : '(Optional)'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {isTa ? 'தினசரி அறிவிப்புகள் பெற' : 'For updates & features'}
          </p>
        </div>

        {/* Minimal Action & Close */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleGoToLogin}
            className="py-1 px-2.5 rounded-lg bg-brandBlue-500 hover:bg-brandBlue-600 active:scale-95 text-white font-bold text-xs shadow-sm transition-all"
          >
            {isTa ? 'உள்நுழைக' : 'Sign In'}
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isTa ? 'மூடுக' : 'Close'}
            aria-label="Dismiss"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 5-second auto-close animated progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="h-full bg-brandBlue-500/80 animate-shrink-5s origin-left" />
      </div>
    </div>
  );
}

function getCurrentAppPath() {
  if (typeof window === 'undefined') return '/';
  const hash = window.location.hash || '';
  const pathname = window.location.pathname || '/';

  // Legacy hash links e.g. #/videos/xyz or #/articles/abc -> upgrade to clean path
  if (hash.startsWith('#/')) {
    const clean = hash.replace(/^#/, '');
    try {
      window.history.replaceState(null, '', clean + window.location.search);
    } catch (e) {}
    return clean;
  }

  // OAuth token fragments in hash (Supabase auth redirect) -> stay on path
  if (hash.includes('access_token=') || hash.includes('refresh_token=')) {
    return pathname === '/' ? '/' : pathname;
  }

  return pathname;
}

function updateDocumentSEO(path) {
  if (typeof document === 'undefined') return;
  const clean = (path || '/').toLowerCase().replace(/\/+$/, '') || '/';
  
  if (clean === '/' || clean === '/home') {
    document.title = 'முதலீட்டு திசை | Tamil Mutual Fund & Investment Guide - Budget Padmanaban';
  } else if (clean === '/videos') {
    document.title = 'வீடியோக்கள் | Investment Videos - முதலீட்டு திசை';
  } else if (clean === '/articles') {
    document.title = 'செய்திக் கட்டுரைகள் | Mutual Fund Articles - முதலீட்டு திசை';
  } else if (clean === '/news') {
    document.title = 'சந்தை செய்திகள் | Live Market News - முதலீட்டு திசை';
  } else if (clean === '/calculator') {
    document.title = 'SIP & Return Calculator (தமிழ்) | முதலீட்டு திசை';
  } else if (clean === '/quiz') {
    document.title = 'Investment & Risk Profile Quiz | முதலீட்டு திசை';
  } else if (clean === '/professionals') {
    document.title = 'AMFI Registered Advisors Directory | முதலீட்டு திசை';
  } else if (clean === '/profile') {
    document.title = 'My Profile | முதலீட்டு திசை';
  } else if (clean === '/history') {
    document.title = 'Watch History | முதலீட்டு திசை';
  } else if (clean === '/login') {
    document.title = 'Sign In | முதலீட்டு திசை';
  } else if (clean === '/signup') {
    document.title = 'Register | முதலீட்டு திசை';
  }
}


export default LoginReminderModal;
export { LoginReminderModal };
