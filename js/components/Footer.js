import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';

export function Footer({ onNavigate, onShowToast }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    onShowToast(t('subscribedToast'));
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid: Newsletter + Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-lg shadow-lg">
                தன
              </div>
              <span className="text-xl font-extrabold text-white font-serif">
                {t('siteName')}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {t('newsLetterDesc')}
            </p>

            {/* Form */}
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition-colors shadow-md shrink-0"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>

          {/* Sitemap Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              {t('nav.mutualFunds')} & {t('nav.stocks')}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><button onClick={() => onNavigate('#/category/mutual-funds')} className="hover:text-white transition-colors">{t('nav.mutualFunds')}</button></li>
              <li><button onClick={() => onNavigate('#/category/stocks')} className="hover:text-white transition-colors">{t('nav.stocks')}</button></li>
              <li><button onClick={() => onNavigate('#/category/personal-finance')} className="hover:text-white transition-colors">{t('nav.personalFinance')}</button></li>
              <li><button onClick={() => onNavigate('#/category/education')} className="hover:text-white transition-colors">{t('nav.education')}</button></li>
            </ul>
          </div>

          {/* Financial Tools */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              Financial Utilities
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><button onClick={() => onNavigate('#/calculator')} className="hover:text-white transition-colors">{t('sipCalculatorTitle')}</button></li>
              <li><button onClick={() => onNavigate('#/videos')} className="hover:text-white transition-colors">YouTube Video Feed</button></li>
              <li><button onClick={() => onNavigate('#/news')} className="hover:text-white transition-colors">Financial News Hub</button></li>
            </ul>
          </div>

        </div>

        {/* Regulatory Disclaimer */}
        <div className="space-y-2 text-[11px] text-slate-500 leading-relaxed max-w-5xl">
          <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            {t('footerDisclaimerTitle')}
          </h5>
          <p>
            {t('footerDisclaimerText')}
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-center text-xs text-slate-600 font-medium">
          {t('copyright')}
        </div>

      </div>
    </footer>
  );
}
