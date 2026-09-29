import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';


function Footer({ onNavigate, onShowToast }) {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    if (onShowToast) onShowToast(t('subscribedToast') || 'Subscribed successfully!');
    setEmail('');
  };

  return (
    <footer className="bg-[#EFE9E3] dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-t border-[#C9B59C] dark:border-slate-800 pt-10 pb-8">
      <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-10">
        {/* Top Grid: Newsletter + Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#D9CFC7] dark:border-slate-800">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <picture className="shrink-0">
                <source srcSet="/assets/logo-96.webp 2x, /assets/logo-48.webp 1x" type="image/webp" />
                <img
                  src="/assets/logo-48.webp"
                  alt="Muthaleetu Thisai"
                  width="48"
                  height="48"
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-md shrink-0"
                />
              </picture>
              <span className="text-2xl sm:text-3xl font-black font-serif">
                {language === 'ta' ? (
                  <>
                    <span className="text-[#03529A] dark:text-[#38bdf8]">முதலீட்டு </span>
                    <span className="text-[#2e7d32] dark:text-[#4ade80]">திசை</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#03529A] dark:text-[#38bdf8]">Muthaleetu </span>
                    <span className="text-[#2e7d32] dark:text-[#4ade80]">Thisai</span>
                  </>
                )}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-md leading-relaxed">
              {t('newsLetterDesc')}
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="flex-1 bg-white dark:bg-slate-900 border border-[#C9B59C] dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors shadow-md shrink-0"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>

          {/* Sitemap Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-400">
              {t('nav.mutualFunds')} & {t('nav.stocks')}
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li><button onClick={() => onNavigate && onNavigate('#/category/mutual-funds')} className="hover:text-slate-950 dark:hover:text-white transition-colors">{t('nav.mutualFunds')}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('#/category/stocks')} className="hover:text-slate-950 dark:hover:text-white transition-colors">{t('nav.stocks')}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('#/category/personal-finance')} className="hover:text-slate-950 dark:hover:text-white transition-colors">{t('nav.personalFinance')}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('#/category/education')} className="hover:text-slate-950 dark:hover:text-white transition-colors">{t('nav.education')}</button></li>
            </ul>
          </div>

          {/* Financial Tools */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-400">
              Financial Utilities
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li><button onClick={() => onNavigate && onNavigate('#/calculator')} className="hover:text-slate-950 dark:hover:text-white transition-colors">{t('sipCalculatorTitle')}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('#/videos')} className="hover:text-slate-950 dark:hover:text-white transition-colors">YouTube Video Feed</button></li>
              <li><button onClick={() => onNavigate && onNavigate('#/news')} className="hover:text-slate-950 dark:hover:text-white transition-colors">Financial News Hub</button></li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-5xl">
          <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">
            {t('footerDisclaimerTitle')}
          </h5>
          <p>
            {t('footerDisclaimerText')}
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-center text-xs text-slate-700 dark:text-slate-300 font-semibold">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}

// ==================== 6. PAGES ====================

export default Footer;
export { Footer };
