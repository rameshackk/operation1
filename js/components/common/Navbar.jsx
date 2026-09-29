import React, { useState, useEffect } from 'react';
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
    { id: 'home', path: '/', hash: '/', label: t('nav.home'), icon: '🏠' },
    { id: 'articles', path: '/articles', hash: '/articles', label: t('nav.articles'), icon: '📰' },
    { id: 'videos', path: '/videos', hash: '/videos', label: t('nav.videos'), icon: '🎥' },
    { id: 'news', path: '/news', hash: '/news', label: t('nav.news'), icon: '⚡' },
    { id: 'professionals', path: '/professionals', hash: '/professionals', label: t('nav.professionals') || (language === 'ta' ? 'நிபுணர்கள்' : 'Professionals'), icon: '💼' },
    { id: 'calculator', path: '/calculator', hash: '/calculator', label: t('nav.calculator'), icon: '🧮' },
    { id: 'quiz', path: '/quiz', hash: '/quiz', label: t('nav.quiz') || 'Quiz', icon: '🎯' }
  ];

  const authNavItems = user ? [
    { id: 'profile', path: '/profile', hash: '/profile', label: `👤 ${language === 'ta' ? 'சுயவிவரம்' : 'Profile'}` },
    ...(role === 'admin' || role === 'publisher' ? [
      { id: 'admin-articles', path: '/admin/articles', hash: '/admin/articles', label: `✍️ ${language === 'ta' ? 'கட்டுரைகள் ஸ்டுடியோ' : 'Article Studio'}` }
    ] : [])
  ] : [
    { id: 'login', path: '/login', hash: '/login', label: `🔐 ${language === 'ta' ? 'உள்நுழைக' : 'Sign In'}` }
  ];

  const navItems = [...baseNavItems, ...authNavItems];

  const activeItem = navItems.find(i => {
    const ci = (i.path || i.hash || '/').replace(/^#/, '').toLowerCase().replace(/\/+$/, '') || '/';
    return cleanCurrent === ci || (ci === '/' && (cleanCurrent === '' || cleanCurrent === '/home'));
  });

  return (
    <nav className="bg-[#F4F9F4] dark:bg-slate-950 text-slate-800 dark:text-slate-100 border-b border-[#D5EBD9] dark:border-slate-800 shadow-sm relative z-20">
      <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Desktop / Laptop Horizontal Bar */}
        <div className="hidden lg:flex items-center justify-between gap-2 py-2">
          <div className="flex items-center justify-between flex-1 gap-1.5 xl:gap-2">
            {navItems.map((item) => {
              if (item.isAction) {
                return (
                  <button
                    key={item.id}
                    onClick={() => item.action && item.action()}
                    className="relative px-4 py-2 text-[13.5px] xl:text-[14px] font-bold transition-all rounded-[10px] whitespace-nowrap text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-500/20"
                  >
                    {item.label}
                  </button>
                );
              }
              const cleanItem = (item.path || item.hash || '/').replace(/^#/, '').toLowerCase().replace(/\/+$/, '') || '/';
              const isActive = cleanCurrent === cleanItem || (cleanItem === '/' && (cleanCurrent === '' || cleanCurrent === '/home'));
              
              // Active: filled solid blue (#2563EB bg, white text, bold)
              // Inactive: subtle hover
              const activeClass = 'bg-[#2563EB] text-white font-extrabold shadow-md shadow-blue-600/30 ring-2 ring-blue-500/20';
              const inactiveClass = 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-900 font-semibold';

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.path || item.hash)}
                  className={`relative px-3.5 py-2 text-[13px] xl:text-[14px] transition-all rounded-[10px] whitespace-nowrap ${isActive ? activeClass : inactiveClass}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet Compact Nav Trigger Header */}
        <div className="lg:hidden flex items-center justify-between h-11 sm:h-12 min-w-0">
          {/* Active section breadcrumb pill */}
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
              className="px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-xs font-black shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen / Slide-Over Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[99999] flex" role="dialog" aria-modal="true">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-[85vw] max-w-sm h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideRight">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/assets/logo.png" alt="" className="w-7 h-7 object-contain" />
                <span className="font-black text-sm font-serif">
                  <span className="text-[#03529A] dark:text-[#38bdf8]">முதலீட்டு </span>
                  <span className="text-[#4A9E2C] dark:text-[#4ade80]">திசை</span>
                </span>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-sm"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const cleanItem = (item.path || item.hash || '/').replace(/^#/, '').toLowerCase().replace(/\/+$/, '') || '/';
                const isActive = cleanCurrent === cleanItem || (cleanItem === '/' && (cleanCurrent === '' || cleanCurrent === '/home'));
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isAction) {
                        if (item.action) item.action();
                      } else {
                        onNavigate(item.path || item.hash);
                      }
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-black transition-all flex items-center justify-between ${item.isAction
                        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40'
                        : isActive
                          ? 'bg-[#2563EB] text-white shadow-md border border-blue-500'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900'
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>{item.icon || '•'}</span>
                      <span>{item.label}</span>
                    </span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer with Quick Switchers & User Auth */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Settings</span>
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
                  className="w-full py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  {language === 'ta' ? 'வெளியேறுக' : 'Sign Out'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('/login');
                    setMobileOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {language === 'ta' ? 'உள்நுழைக' : 'Sign In'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


export default Navbar;
export { Navbar };
