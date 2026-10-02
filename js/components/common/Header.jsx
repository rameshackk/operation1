import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { ProfileMenu } from './ProfileMenu.jsx';

function Header({ onOpenSearch, onNavigate }) {
  const { t, language } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      if (onNavigate) onNavigate('#/login');
      else if (typeof window !== 'undefined') window.location.hash = '#/login';
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={`relative z-40 w-full max-w-full overflow-visible transition-all duration-200 border-b border-[#D5EBD9] dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pt-[env(safe-area-inset-top,0px)] ${isScrolled ? 'py-1.5 shadow-sm' : 'py-2 sm:py-2.5 shadow-sm'
      }`}>
      {/* 1. DESKTOP VIEW (hidden md:flex) */}
      <div className="hidden md:flex w-full max-w-[98vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 items-center justify-between gap-4">
        {/* Left Side: Search Trigger + Language Switcher */}
        <div className="flex items-center gap-3 justify-start shrink-0">
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 cursor-pointer min-h-[44px]"
            aria-label="Search"
            title="Search (Ctrl + K)"
          >
            <svg className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="font-bold">{t('searchTitle')}</span>
            <span className="text-xs px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-num font-bold">⌘K</span>
          </button>

          {/* Language Switcher beside Search Bar */}
          <div className="shrink-0">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Center: Centered Brand Logo & Title (Never overlapped) */}
        <div className="flex items-center justify-center shrink-0 px-2">
          <a href="#/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <picture className="shrink-0">
              <source srcSet="/assets/logo-96.webp 2x, /assets/logo-48.webp 1x" type="image/webp" />
              <img
                src="/assets/logo-48.webp"
                alt="Muthaleetu Thisai"
                width="48"
                height="48"
                className={`${isScrolled ? 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10' : 'w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12'} object-contain drop-shadow-md group-hover:scale-105 transition-all duration-300 shrink-0`}
              />
            </picture>
            <div className="text-left shrink-0">
              <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                <h1 className={`${isScrolled ? 'text-sm sm:text-base md:text-lg' : 'text-base sm:text-lg md:text-[1.35rem]'} font-extrabold tracking-tight whitespace-nowrap leading-none font-sans transition-all duration-300`}>
                  {language === 'ta' ? (
                    <>
                      <span className="text-[#03529A] dark:text-[#38bdf8]">முதலீட்டு </span>
                      <span className="text-[#4A9E2C] dark:text-[#4ade80]">திசை</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#03529A] dark:text-[#38bdf8]">Muthaleetu </span>
                      <span className="text-[#4A9E2C] dark:text-[#4ade80]">Thisai</span>
                    </>
                  )}
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium pt-0.5 whitespace-nowrap leading-none">
                {t('tagline')}
              </p>
            </div>
          </a>
        </div>

        {/* Right Side Controls: Theme Toggle + Login / User Card */}
        <div className="flex items-center justify-end gap-2.5 shrink-0">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2 shrink-0">
              <ProfileMenu onNavigate={onNavigate || ((route) => { if (typeof window !== 'undefined') window.location.hash = route; })} />
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="hidden xl:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all shrink-0 disabled:opacity-50 border border-red-500/30 cursor-pointer min-h-[44px]"
                title={language === 'ta' ? 'வெளியேறு' : 'Logout'}
              >
                {isLoggingOut ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                <span>{language === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onNavigate) onNavigate('#/login');
                else if (typeof window !== 'undefined') window.location.hash = '#/login';
              }}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs shadow-blue-600/20 transition-all shrink-0 active:scale-95 cursor-pointer min-h-[44px]"
            >
              <span>{language === 'ta' ? 'உள்நுழைக' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MOBILE SINGLE-ROW COMPACT HEADER (md:hidden) */}
      <div className="flex md:hidden w-full items-center justify-between px-3 min-h-[48px] gap-2">
        {/* Left: Brand Logo & Title */}
        <a href="#/" className="flex items-center gap-2 min-w-0 shrink truncate group py-1">
          <picture className="shrink-0">
            <source srcSet="/assets/logo-96.webp 2x, /assets/logo-48.webp 1x" type="image/webp" />
            <img
              src="/assets/logo-48.webp"
              alt="Muthaleetu Thisai"
              width="36"
              height="36"
              className="w-9 h-9 object-contain drop-shadow-sm shrink-0"
            />
          </picture>
          <div className="min-w-0 truncate">
            <h1 className="text-sm font-extrabold tracking-tight whitespace-nowrap leading-none font-sans">
              {language === 'ta' ? (
                <>
                  <span className="text-[#03529A] dark:text-[#38bdf8]">முதலீட்டு </span>
                  <span className="text-[#4A9E2C] dark:text-[#4ade80]">திசை</span>
                </>
              ) : (
                <>
                  <span className="text-[#03529A] dark:text-[#38bdf8]">Muthaleetu </span>
                  <span className="text-[#4A9E2C] dark:text-[#4ade80]">Thisai</span>
                </>
              )}
            </h1>
          </div>
        </a>

        {/* Right: Compact Search Trigger + Menu Trigger (44x44px touch targets with 8px spacing) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSearch}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
            aria-label="Search"
            title="Search"
          >
            <svg className="w-5 h-5 text-[#2563EB] dark:text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {user ? (
            <ProfileMenu onNavigate={onNavigate || ((route) => { if (typeof window !== 'undefined') window.location.hash = route; })} />
          ) : (
            <button
              onClick={() => {
                if (onNavigate) onNavigate('#/login');
                else if (typeof window !== 'undefined') window.location.hash = '#/login';
              }}
              className="h-11 min-h-[44px] px-3.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 flex items-center justify-center active:scale-95"
            >
              <span>{language === 'ta' ? 'உள்நுழைக' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
export { Header };
