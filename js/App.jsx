import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import AppContent from './AppContent.jsx';

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

export default function App({ initialData }) {
  const [currentPath, setCurrentPath] = useState(() => getCurrentAppPath());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleLocationChange = () => {
      const p = getCurrentAppPath();
      setCurrentPath(p);
      window.scrollTo(0, 0);
      updateDocumentSEO(p);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (toPath) => {
    if (!toPath) return;
    let clean = toPath.toString().trim();
    if (clean.startsWith('#/')) clean = clean.replace(/^#/, '');
    else if (clean === '#') clean = '/';
    else if (!clean.startsWith('/')) clean = '/' + clean;

    if (window.location.pathname !== clean) {
      window.history.pushState(null, '', clean);
    }
    setCurrentPath(clean);
    window.scrollTo(0, 0);
    updateDocumentSEO(clean);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent
            currentPath={currentPath}
            navigate={navigate}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            toastMessage={toastMessage}
            setToastMessage={setToastMessage}
          />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export { App, getCurrentAppPath, updateDocumentSEO };
