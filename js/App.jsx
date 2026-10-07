import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { updateHeadTags, SITE_URL } from './utils/formatters.js';
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
    updateHeadTags({
      title: 'முதலீட்டு திசை | Tamil Mutual Fund & Investment Guide - Budget Padmanaban',
      description: 'பட்ஜெட் பத்மநாபன் ஃபைனான்ஷியல் - மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை, தனிநபர் நிதி மற்றும் முதலீட்டு வழிகாட்டி. Tamil & English mutual fund investing platform.',
      canonical: `${SITE_URL}/`,
      ogImage: `${SITE_URL}/assets/logo.png`
    });
  } else if (clean === '/videos') {
    updateHeadTags({
      title: 'வீடியோக்கள் | Investment Videos - முதலீட்டு திசை',
      description: 'பட்ஜெட் பத்மநாபன் வழங்கும் மியூச்சுவல் ஃபண்ட், SIP மற்றும் பங்குச் சந்தை வீடியோக்கள்.',
      canonical: `${SITE_URL}/videos`
    });
  } else if (clean === '/articles') {
    updateHeadTags({
      title: 'செய்திக் கட்டுரைகள் | Mutual Fund Articles - முதலீட்டு திசை',
      description: 'மியூச்சுவல் ஃபண்ட் முதலீட்டு உத்திகள், வரி சேமிப்பு மற்றும் நிதி வழிகாட்டல் கட்டுரைகள்.',
      canonical: `${SITE_URL}/articles`
    });
  } else if (clean === '/news') {
    updateHeadTags({
      title: 'சந்தை செய்திகள் | Live Market News - முதலீட்டு திசை',
      description: 'நேரலை பங்குச் சந்தை, ரிசர்வ் வங்கி மற்றும் மியூச்சுவல் ஃபண்ட் செய்திகள்.',
      canonical: `${SITE_URL}/news`
    });
  } else if (clean === '/calculator') {
    updateHeadTags({
      title: 'SIP & Return Calculator (தமிழ்) | முதலீட்டு திசை',
      description: 'Calculate your SIP, Lumpsum, and Goal Planning mutual fund returns with our instant Tamil financial calculator.',
      canonical: `${SITE_URL}/calculator`
    });
  } else if (clean === '/quiz') {
    updateHeadTags({
      title: 'Investment & Risk Profile Quiz | முதலீட்டு திசை',
      description: 'Find your ideal asset allocation and investment personality with our quick 2-minute financial quiz in Tamil.',
      canonical: `${SITE_URL}/quiz`
    });
  } else if (clean === '/professionals') {
    updateHeadTags({
      title: 'AMFI Registered Mutual Fund Distributors Directory | முதலீட்டு திசை',
      description: 'Verified AMFI Registered Mutual Fund Distributors directory in Tamil Nadu and India.',
      canonical: `${SITE_URL}/professionals`
    });
  } else if (clean === '/profile') {
    updateHeadTags({
      title: 'My Profile | முதலீட்டு திசை',
      canonical: `${SITE_URL}/profile`
    });
  } else if (clean === '/history') {
    updateHeadTags({
      title: 'Watch History | முதலீட்டு திசை',
      canonical: `${SITE_URL}/history`
    });
  } else if (clean === '/login') {
    updateHeadTags({
      title: 'Sign In | முதலீட்டு திசை',
      canonical: `${SITE_URL}/login`
    });
  } else if (clean === '/signup') {
    updateHeadTags({
      title: 'Register | முதலீட்டு திசை',
      canonical: `${SITE_URL}/signup`
    });
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
