// Polyfills for Node.js SSR
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    location: { hash: '', pathname: '/', search: '', href: 'https://www.muthaleetuthisai.com/' },
    addEventListener: () => {},
    removeEventListener: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    scrollTo: () => {}
  };
}
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: (k) => (k === 'muthaleetu_theme' ? 'light' : null),
    setItem: () => {},
    removeItem: () => {}
  };
}
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    documentElement: { setAttribute: () => {}, getAttribute: () => 'light' },
    title: ''
  };
}

import React from 'react';
import { renderToString } from 'react-dom/server';
import { ThemeProvider } from '../js/context/ThemeContext.jsx';
import { LanguageProvider } from '../js/context/LanguageContext.jsx';
import { AuthProvider } from '../js/context/AuthContext.jsx';
import Header from '../js/components/common/Header.jsx';
import Navbar from '../js/components/common/Navbar.jsx';
import Footer from '../js/components/common/Footer.jsx';
import TrendingTicker from '../js/components/home/TrendingTicker.jsx';
import Home from '../js/components/home/Home.jsx';
import { newsData, videosData } from '../js/data/translations.js';

export function getPrerenderedHomepage() {
  const serverData = {
    articles: newsData.slice(0, 12),
    videos: videosData.slice(0, 12)
  };

  const html = renderToString(
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
            <div className="sticky-header-container sticky top-0 z-40 w-full shadow-md bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <Header onOpenSearch={() => {}} onNavigate={() => {}} />
              <Navbar currentPath="/" onNavigate={() => {}} />
            </div>
            <TrendingTicker onNavigate={() => {}} />
            <main className="flex-1">
              <Home onNavigate={() => {}} onShowToast={() => {}} />
            </main>
            <Footer onNavigate={() => {}} onShowToast={() => {}} />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );

  return { html, serverData };
}

const { html, serverData } = getPrerenderedHomepage();
console.log(JSON.stringify({ html, serverData }));
