import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { useVideos } from '../hooks/useVideos.js';
import { HeroSection } from '../components/HeroSection.js';
import { BreakingNewsTicker } from '../components/BreakingNewsTicker.js';
import { VideoCard } from '../components/VideoCard.js';
import { VideoGrid } from '../components/VideoGrid.js';
import { SipCalculator } from '../components/SipCalculator.js';
import { NewsCard } from '../components/NewsCard.js';
import { TrendingArticlesSection } from '../components/TrendingArticlesSection.js';
import { SignInCtaBanner } from '../components/SignInCtaBanner.js';
import { newsData } from '../data/news.js';
import { translateNewsArticle } from '../services/translationService.js';
import { getTrendingPreviewVideos } from '../services/youtubeService.js';

export function Home({ onNavigate }) {
  const { t, language } = useLanguage();
  const [previewVideos, setPreviewVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getTrendingPreviewVideos(language).then(data => {
      if (isMounted) {
        setPreviewVideos(data);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [language]);

  const translatedNews = newsData.map(item => translateNewsArticle(item, language));

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. FEATURED NEWS SLIDER (LEFT 7 COLS) + TRENDING ARTICLES (RIGHT 5 COLS) */}
      <HeroSection news={translatedNews} onNavigate={onNavigate} />

      {/* 2. CONTINUOUS BREAKING NEWS TICKER */}
      <BreakingNewsTicker onNavigate={onNavigate} />

      {/* 3. CONTINUOUSLY AUTO-SCROLLING TRENDING SHOWCASE CAROUSEL */}
      <TrendingArticlesSection onNavigate={onNavigate} />

      {/* 4. PUBLIC PREVIEW GRID OF TRENDING VIDEOS (6-8 ITEMS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
              {t('latestVideos') || 'சமீபத்திய வீடியோக்கள்'}
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            PREVIEW SHOWCASE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {previewVideos.slice(0, 8).map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={() => onNavigate && onNavigate(`#/videos/${video.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION FOR PUBLIC VISITORS */}
      <SignInCtaBanner onNavigate={onNavigate} />

      {/* 6. FINANCIAL CALCULATOR */}
      <SipCalculator />
    </div>
  );
}
