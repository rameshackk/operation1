import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { LanguageSwitcher } from './LanguageSwitcher.js';
import { ThemeToggle } from './ThemeToggle.js';

export function Header({ onOpenSearch }) {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 border-b border-slate-200 dark:border-slate-800 backdrop-blur-glass ${
      isScrolled ? 'py-2 shadow-md bg-white/90 dark:bg-slate-950/90' : 'py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left Side: Welcome Badge */}
        <div className="hidden sm:flex items-center gap-2 min-w-[140px] md:min-w-[180px] shrink-0">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>👋 {t('welcome')}</span>
          </span>
        </div>

        {/* Center: Brand Logo & Title (Mudhalidu Thesai / à®®à¯à®¤à®²à¯€à®Ÿà¯ à®¤à®¿à®šà¯ˆ) */}
        <a href="#/" className="flex items-center gap-3 group mx-auto text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300 border border-amber-400/40 shrink-0">
            <svg className="w-6 h-6 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" className="opacity-35" strokeWidth="1.5" />
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2" opacity="0.5" strokeWidth="1.5" />
              <path d="M16 8L8 16M16 8H10M16 8V14" stroke="#fef3c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-serif group-hover:text-amber-600 transition-colors whitespace-nowrap">
                {t('siteName')}
              </h1>
              <span className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('welcome')}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </a>

        {/* Right Actions: Search + Language + Theme */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 min-w-[140px] md:min-w-[180px] shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-medium border border-slate-200 dark:border-slate-700"
            aria-label="Open search dialog"
          >
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden md:inline">{t('searchTitle')}</span>
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}