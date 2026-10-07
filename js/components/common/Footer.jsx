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

            <p className="text-sm md:text-xs text-slate-700 dark:text-slate-300 max-w-md leading-relaxed">
              {t('newsLetterDesc')}
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="flex-1 bg-white dark:bg-slate-900 border border-[#C9B59C] dark:border-slate-800 rounded-xl px-4 py-2.5 text-base md:text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 min-h-[44px]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors shadow-md shrink-0 min-h-[44px] flex items-center justify-center active:scale-95 cursor-pointer"
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
            <ul className="space-y-1 md:space-y-2 text-sm md:text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li>
                <a
                  href="/category/mutual-funds"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('#/category/mutual-funds');
                  }}
                  className="py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t('nav.mutualFunds')}
                </a>
              </li>
              <li>
                <a
                  href="/category/stocks"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('#/category/stocks');
                  }}
                  className="py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t('nav.stocks')}
                </a>
              </li>
              <li>
                <a
                  href="/category/personal-finance"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('#/category/personal-finance');
                  }}
                  className="py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t('nav.personalFinance')}
                </a>
              </li>
              <li>
                <a
                  href="/category/education"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('#/category/education');
                  }}
                  className="py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t('nav.education')}
                </a>
              </li>
            </ul>
          </div>

          {/* Financial Tools */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-400">
              {language === 'ta' ? 'நிதி கருவிகள்' : 'Financial Utilities'}
            </h4>
            <ul className="space-y-1 md:space-y-2 text-sm md:text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li>
                <a
                  href="/calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('#/calculator');
                  }}
                  className="py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t('sipCalculatorTitle')}
                </a>
              </li>
              <li>
                <a
                  href="/videos"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('#/videos');
                  }}
                  className="py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'வீடியோ தொகுப்பு' : 'YouTube Video Feed'}
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('#/news');
                  }}
                  className="py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'நிதிச் செய்திகள்' : 'Financial News Hub'}
                </a>
              </li>
              <li>
                <a
                  href="/professionals"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('#/professionals');
                  }}
                  className="py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'AMFI பதிவுசெய்த விநியோகஸ்தர்கள்' : 'AMFI Registered MFDs'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="space-y-2 text-xs md:text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-5xl">
          <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">
            {t('footerDisclaimerTitle')}
          </h5>
          <p className="text-xs md:text-xs leading-relaxed">
            {t('footerDisclaimerText')}
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-center text-xs md:text-xs text-slate-700 dark:text-slate-300 font-semibold">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
export { Footer };

