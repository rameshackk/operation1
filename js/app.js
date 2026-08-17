import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { LanguageProvider } from './context/LanguageContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { Header } from './components/Header.js';
import { Navbar } from './components/Navbar.js';
import { TrendingTicker } from './components/TrendingTicker.js';
import { CommandPalette } from './components/CommandPalette.js';
import { Toast } from './components/Toast.js';
import { Footer } from './components/Footer.js';

// Pages
import { Home } from './pages/Home.js';
import { Articles } from './pages/Articles.js';
import { ArticleDetail } from './pages/ArticleDetail.js';
import { Videos } from './pages/Videos.js';
import { VideoDetails } from './pages/VideoDetails.js';
import { News } from './pages/News.js';
import { NewsDetails } from './pages/NewsDetails.js';
import { Category } from './pages/Category.js';
import { SipCalculator } from './components/SipCalculator.js';

export function App() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (hash) => {
    window.location.hash = hash;
    setCurrentHash(hash);
  };

  // Route Dispatcher
  const renderRoute = () => {
    if (currentHash.startsWith('#/articles/')) {
      const slug = currentHash.replace('#/articles/', '');
      return <ArticleDetail slug={slug} onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    if (currentHash === '#/articles') {
      return <Articles onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    if (currentHash.startsWith('#/videos/')) {
      const videoId = currentHash.replace('#/videos/', '');
      return <VideoDetails videoId={videoId} onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    if (currentHash === '#/videos') {
      return <Videos onNavigate={navigate} />;
    }

    if (currentHash.startsWith('#/news/')) {
      const slug = currentHash.replace('#/news/', '');
      return <NewsDetails slug={slug} onNavigate={navigate} />;
    }

    if (currentHash === '#/news') {
      return <News onNavigate={navigate} />;
    }

    if (currentHash.startsWith('#/category/')) {
      const categoryId = currentHash.replace('#/category/', '');
      return <Category categoryId={categoryId} onNavigate={navigate} />;
    }

    if (currentHash === '#/calculator') {
      return (
        <div className="py-8">
          <SipCalculator />
        </div>
      );
    }

    // Default Home Route
    return <Home onNavigate={navigate} />;
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-amber-500 selection:text-white">
          
          {/* Header & Navigation */}
          <Header onOpenSearch={() => setIsSearchOpen(true)} />
          <Navbar currentPath={currentHash} onNavigate={navigate} />

          {/* Breaking News & Live Market Ticker */}
          <TrendingTicker />

          {/* Page Content */}
          <main className="flex-1">
            {renderRoute()}
          </main>

          {/* Footer */}
          <Footer onNavigate={navigate} onShowToast={setToastMessage} />

          {/* Command Palette Modal */}
          <CommandPalette
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={navigate}
          />

          {/* Notification Toast */}
          <Toast message={toastMessage} onClose={() => setToastMessage('')} />

        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
