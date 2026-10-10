import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';

function Navbar({ currentPath, onNavigate }) {
  const { t, language } = useLanguage();
  const { user, role, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cleanCurrent = (currentPath || '/').toLowerCase().replace(/\/+$/, '') || '/';

  const baseNavItems = [
    { id: 'home', path: '/', hash: '/', label: t('nav.home') },
    { id: 'articles', path: '/articles', hash: '/articles', label: t('nav.articles') },
    { id: 'videos', path: '/videos', hash: '/videos', label: t('nav.videos') },
    { id: 'news', path: '/news', hash: '/news', label: t('nav.news') },
    { id: 'professionals', path: '/professionals', hash: '/professionals', label: t('nav.professionals') || (language === 'ta' ? 'நிபுணர்கள்' : 'Professionals') },
    { id: 'calculator', path: '/calculator', hash: '/calculator', label: t('nav.calculator') },
    { id: 'quiz', path: '/quiz', hash: '/quiz', label: t('nav.quiz') || 'Quiz' }
  ];

  const authNavItems = user ? [
    { id: 'profile', path: '/profile', hash: '/profile', label: language === 'ta' ? 'சுயவிவரம்' : 'Profile' },
    ...(role === 'admin' || role === 'publisher' ? [
      { id: 'admin-articles', path: '/admin/articles', hash: '/admin/articles', label: language === 'ta' ? 'கட்டுரைகள் ஸ்டுடியோ' : 'Article Studio' }
    ] : [])
  ] : [
    { id: 'login', path: '/login', hash: '/login', label: language === 'ta' ? 'உள்நுழைக' : 'Sign In' }
  ];

  const navItems = [...baseNavItems, ...authNavItems];

  const activeItem = navItems.find(i => {
    const ci = (i.path || i.hash || '/').replace(/^#/, '').toLowerCase().replace(/\/+$/, '') || '/';
    return cleanCurrent === ci || (ci === '/' && (cleanCurrent === '' || cleanCurrent === '/home'));
  });

  return (
    <>
      <nav className="bg-[#F4F9F4] dark:bg-slate-950 text-slate-800 dark:text-slate-100 border-b border-[#D5EBD9] dark:border-slate-800 shadow-sm relative z-20">
        <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Desktop / Laptop Horizontal Bar */}
          <div className="hidden md:flex items-center justify-between gap-2 py-2">
            <div className="flex items-center justify-between flex-1 gap-1.5 xl:gap-2">
              {navItems.map((item) => {
                if (item.isAction) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => item.action && item.action()}
                      className="relative px-4 py-2 text-[13.5px] xl:text-[14px] font-bold transition-all rounded-[10px] whitespace-nowrap text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-500/20 cursor-pointer"
                    >
                      {item.label}
                    </button>
                  );
                }
                const cleanItem = (item.path || item.hash || '/').replace(/^#/, '').toLowerCase().replace(/\/+$/, '') || '/';
                const isActive = cleanCurrent === cleanItem || (cleanItem === '/' && (cleanCurrent === '' || cleanCurrent === '/home'));
                
                const activeClass = 'bg-[#2563EB] text-white font-extrabold shadow-md shadow-blue-600/30 ring-2 ring-blue-500/20';
                const inactiveClass = 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-900 font-semibold';

                return (
                  <a
                    key={item.id}
                    href={item.path || item.hash || '/'}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.path || item.hash);
                    }}
                    className={`relative px-3.5 py-2 text-[13px] xl:text-[14px] transition-all rounded-[10px] whitespace-nowrap inline-flex items-center justify-center cursor-pointer ${isActive ? activeClass : inactiveClass}`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Mobile & Tablet Compact Nav Trigger Header */}
          <div className="md:hidden flex items-center justify-between h-11 sm:h-12 min-w-0">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
              <span className="text-xs font-black text-[#2563EB] dark:text-[#60a5fa] uppercase tracking-wider truncate">
                {activeItem?.label || t('nav.home')}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open Navigation Menu"
                className="px-3.5 py-2 min-h-[44px] rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-black shadow-sm active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                <span>{language === 'ta' ? 'பட்டி' : 'Menu'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full-Screen / Slide-Over Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-[99999] flex" role="dialog" aria-modal="true">
            {/* Backdrop Blur */}
            <div
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer Panel */}
            <div className="relative ml-auto w-[88vw] max-w-sm h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideRight">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between pt-[max(1rem,env(safe-area-inset-top,1rem))]">
                <div className="flex items-center gap-2.5">
                  <img src="/assets/logo.png" alt="" className="w-8 h-8 object-contain" />
                  <span className="font-black text-sm font-serif">
                    <span className="text-[#03529A] dark:text-[#38bdf8]">முதலீட்டு </span>
                    <span className="text-[#4A9E2C] dark:text-[#4ade80]">திசை</span>
                  </span>
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center justify-center font-bold text-base border border-slate-200 dark:border-slate-800 active:scale-95 cursor-pointer"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Navigation Links with 44px+ tap heights */}
              <div className="p-4 space-y-2 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                  const cleanItem = (item.path || item.hash || '/').replace(/^#/, '').toLowerCase().replace(/\/+$/, '') || '/';
                  const isActive = cleanCurrent === cleanItem || (cleanItem === '/' && (cleanCurrent === '' || cleanCurrent === '/home'));
                  
                  if (item.isAction) {
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.action) item.action();
                          setMobileOpen(false);
                        }}
                        className="w-full text-left px-4 py-3.5 min-h-[48px] rounded-2xl text-sm font-black transition-all flex items-center justify-between text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-[14px]">{item.label}</span>
                        </span>
                      </button>
                    );
                  }

                  return (
                    <a
                      key={item.id}
                      href={item.path || item.hash || '/'}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.path || item.hash);
                        setMobileOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3.5 min-h-[48px] rounded-2xl text-sm font-black transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md border border-blue-500'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-slate-400 dark:bg-slate-600'}`} />
                        <span className="text-[14px]">{item.label}</span>
                      </span>
                      {isActive && <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
                    </a>
                  );
                })}
              </div>

              {/* Drawer Footer with Quick Switchers & User Auth */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3.5 bg-slate-50 dark:bg-slate-900/60 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {language === 'ta' ? 'அமைப்புகள்' : 'Settings'}
                  </span>
                  <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>

                {user ? (
                  <button
                    onClick={() => {
                      signOut && signOut();
                      setMobileOpen(false);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-extrabold hover:bg-red-100 transition-colors active:scale-95 cursor-pointer"
                  >
                    {language === 'ta' ? 'வெளியேறுக' : 'Sign Out'}
                  </button>
                ) : (
                  <a
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('/login');
                      setMobileOpen(false);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#2563EB] text-white text-xs font-extrabold hover:bg-blue-700 transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                    <span>{language === 'ta' ? 'உள்நுழைக' : 'Sign In'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 3. MOBILE STICKY BOTTOM TAB BAR (md:hidden) - Fixed 375px & Small screens overflow */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-[#D5EBD9] dark:border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] select-none max-w-full overflow-hidden">
        <div className="grid grid-cols-5 w-full max-w-full px-1 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))]">
          {/* Tab 1: Home */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className={`flex flex-col items-center justify-center min-w-0 py-1 min-h-[44px] rounded-lg transition-all active:scale-95 cursor-pointer ${
              cleanCurrent === '/' || cleanCurrent === '' || cleanCurrent === '/home'
                ? 'text-[#2563EB] dark:text-[#60a5fa] font-black'
                : 'text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white'
            }`}
            aria-label="Home"
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span className="text-[11px] leading-none tracking-tight truncate max-w-full px-0.5">
              {language === 'ta' ? 'முகப்பு' : 'Home'}
            </span>
          </a>

          {/* Tab 2: Articles */}
          <a
            href="/articles"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/articles');
            }}
            className={`flex flex-col items-center justify-center min-w-0 py-1 min-h-[44px] rounded-lg transition-all active:scale-95 cursor-pointer ${
              cleanCurrent === '/articles' || cleanCurrent.startsWith('/articles/')
                ? 'text-[#2563EB] dark:text-[#60a5fa] font-black'
                : 'text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white'
            }`}
            aria-label="Articles"
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
            <span className="text-[11px] leading-none tracking-tight truncate max-w-full px-0.5">
              {language === 'ta' ? 'கட்டுரை' : 'Articles'}
            </span>
          </a>

          {/* Tab 3: Videos */}
          <a
            href="/videos"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/videos');
            }}
            className={`flex flex-col items-center justify-center min-w-0 py-1 min-h-[44px] rounded-lg transition-all active:scale-95 cursor-pointer ${
              cleanCurrent === '/videos' || cleanCurrent.startsWith('/videos/')
                ? 'text-[#2563EB] dark:text-[#60a5fa] font-black'
                : 'text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white'
            }`}
            aria-label="Videos"
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span className="text-[11px] leading-none tracking-tight truncate max-w-full px-0.5">
              {language === 'ta' ? 'வீடியோ' : 'Videos'}
            </span>
          </a>

          {/* Tab 4: Calculator */}
          <a
            href="/calculator"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/calculator');
            }}
            className={`flex flex-col items-center justify-center min-w-0 py-1 min-h-[44px] rounded-lg transition-all active:scale-95 cursor-pointer ${
              cleanCurrent === '/calculator'
                ? 'text-[#2563EB] dark:text-[#60a5fa] font-black'
                : 'text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white'
            }`}
            aria-label="Calculator"
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            <span className="text-[11px] leading-none tracking-tight truncate max-w-full px-0.5">
              {language === 'ta' ? 'கால்குலேட்டர்' : 'Calculator'}
            </span>
          </a>

          {/* Tab 5: Menu Drawer Trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`flex flex-col items-center justify-center min-w-0 py-1 min-h-[44px] rounded-lg transition-all active:scale-95 cursor-pointer ${
              mobileOpen
                ? 'text-[#2563EB] dark:text-[#60a5fa] font-black'
                : 'text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white'
            }`}
            aria-label="Open full menu"
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
            <span className="text-[11px] leading-none tracking-tight truncate max-w-full px-0.5">
              {language === 'ta' ? 'பட்டி' : 'Menu'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
export { Navbar };

