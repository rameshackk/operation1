import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';

export function Navbar({ currentPath, onNavigate }) {
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const baseNavItems = [
    { id: 'home', hash: '#/', label: t('nav.home') },
    { id: 'videos', hash: '#/videos', label: t('nav.videos') },
    { id: 'news', hash: '#/news', label: t('nav.news') },
    { id: 'mutual-funds', hash: '#/category/mutual-funds', label: t('nav.mutualFunds') },
    { id: 'stocks', hash: '#/category/stocks', label: t('nav.stocks') },
    { id: 'personal-finance', hash: '#/category/personal-finance', label: t('nav.personalFinance') },
    { id: 'calculator', hash: '#/calculator', label: t('nav.calculator') },
    { id: 'quiz', hash: '#/quiz', label: t('nav.quiz') || 'Quiz' }
  ];

  const authNavItems = user ? [
    { id: 'profile', hash: '#/profile', label: `👤 ${language === 'ta' ? 'சுயவிவரம்' : 'Profile'}` },
    {
      id: 'logout',
      isAction: true,
      action: async () => {
        try {
          await signOut();
          onNavigate('#/login');
        } catch (e) {
          console.error(e);
        }
      },
      label: `🚪 ${language === 'ta' ? 'வெளியேறு' : 'Sign Out'}`
    }
  ] : [
    { id: 'login', hash: '#/login', label: `🔑 ${language === 'ta' ? 'உள்நுழைக' : 'Sign In'}` }
  ];

  const navItems = [...baseNavItems, ...authNavItems];

  const handleLinkClick = (item) => {
    if (item.isAction && item.action) {
      item.action();
    } else {
      onNavigate(item.hash);
    }
    setMobileOpen(false);
  };

  return (
    <nav className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Navigation Row */}
        <div className="hidden lg:flex items-center justify-between h-12 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              if (item.isAction) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item)}
                    className="relative px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors rounded-md whitespace-nowrap text-red-400 hover:text-white hover:bg-red-900/40 border border-red-500/20"
                  >
                    {item.label}
                  </button>
                );
              }
              const isActive = currentPath === item.hash || (item.hash === '#/' && currentPath === '');
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item)}
                  className={`relative px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-md whitespace-nowrap ${
                    isActive
                      ? 'text-amber-400 font-semibold bg-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full transition-all duration-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navbar Header */}
        <div className="lg:hidden flex items-center justify-between h-12">
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            {navItems.find(i => i.hash === currentPath)?.label || t('nav.home')}
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentPath === item.hash;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.isAction
                    ? 'text-red-400 hover:bg-red-950/40'
                    : isActive
                      ? 'bg-amber-500/10 text-amber-400 font-semibold border-l-2 border-amber-500'
                      : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
