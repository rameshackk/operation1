import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { useVideos } from '../hooks/useVideos.js';
import { HeroSection } from '../components/HeroSection.js';
import { BreakingNewsTicker } from '../components/BreakingNewsTicker.js';
import { VideoGrid } from '../components/VideoGrid.js';
import { VideoSection } from '../components/VideoSection.js';
import { SipCalculator } from '../components/SipCalculator.js';
import { NewsCard } from '../components/NewsCard.js';
import { newsData } from '../data/news.js';
import { translateNewsArticle } from '../services/translationService.js';

export function Home({ onNavigate }) {
  const { t, language } = useLanguage();
  const { videos, isLoading } = useVideos('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const translatedNews = newsData.map(item => translateNewsArticle(item, language));

  // News category splits
  const mutualFundNews = translatedNews.filter(n => n.category === 'mutual-funds');
  const stockNews = translatedNews.filter(n => n.category === 'stocks');
  const personalFinanceNews = translatedNews.filter(n => n.category === 'personal-finance' || n.category === 'investment');

  // Video category splits
  const mutualFundVideos = videos.filter(v => v.category === 'mutual-funds');
  const stockVideos = videos.filter(v => v.category === 'stocks');
  const sipVideos = videos.filter(v => v.category === 'personal-finance' || v.category === 'education');

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">

      {/* 1. FEATURED NEWS SLIDER (LEFT 7 COLS) + TRENDING ARTICLES (RIGHT 5 COLS) */}
      <HeroSection news={translatedNews} onNavigate={onNavigate} />

      {/* 2. CONTINUOUS BREAKING NEWS TICKER */}
      <BreakingNewsTicker onNavigate={onNavigate} />

      {/* 3. LATEST VIDEOS (DYNAMIC YOUTUBE FEED) */}
      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)}
      />

      {/* 4. MUTUAL FUND NEWS */}
      {mutualFundNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
                {t('nav.mutualFunds')} — {t('nav.news')}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              MUTUAL FUNDS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mutualFundNews.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                onSelect={() => onNavigate(`#/news/${article.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. STOCK MARKET NEWS */}
      {stockNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
                {t('nav.stocks')} — {t('nav.news')}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              STOCKS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stockNews.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                onSelect={() => onNavigate(`#/news/${article.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. SIP / INVESTMENT NEWS */}
      {personalFinanceNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
                SIP & {t('nav.personalFinance')} — {t('nav.news')}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              INVESTMENTS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalFinanceNews.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                onSelect={() => onNavigate(`#/news/${article.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. MORE VIDEO SECTIONS */}
      <VideoSection
        title={t('mutualFundVideos') || 'மியூச்சுவல் ஃபண்ட் வீடியோக்கள்'}
        subtitle="Budget Padmanaban Mutual Fund Guides"
        videos={mutualFundVideos.length > 0 ? mutualFundVideos : videos.slice(0, 5)}
        onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)}
        categoryBadge="MUTUAL FUNDS"
      />

      <VideoSection
        title={t('stockMarketVideos') || 'பங்குச் சந்தை வீடியோக்கள்'}
        subtitle="Stock Market Analysis & Strategies"
        videos={stockVideos.length > 0 ? stockVideos : videos.slice(1, 5)}
        onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)}
        categoryBadge="STOCKS"
      />

      <VideoSection
        title={t('sipVideos') || 'SIP & முதலீட்டு வீடியோக்கள்'}
        subtitle="Financial Education & Wealth Building Tips"
        videos={sipVideos.length > 0 ? sipVideos : videos.slice(2, 5)}
        onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)}
        categoryBadge="SIP & INVESTMENTS"
      />

      {/* 8. FINANCIAL CALCULATORS (VERY BOTTOM) */}
      <SipCalculator />

    </div>
  );
}
