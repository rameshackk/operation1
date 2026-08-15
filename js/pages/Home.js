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
      {/* 1. FEATURED NEWS TICKER ON LEFT + LATEST ARTICLES ON RIGHT */}
      <HeroSection news={translatedNews} onNavigate={onNavigate} />

      {/* 2. PUBLIC PREVIEW GRID OF LATEST VIDEOS (BEFORE TRENDING ARTICLES) */}
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

      {/* 3. TRENDING ARTICLES SECTION */}
      <TrendingArticlesSection onNavigate={onNavigate} />

      {/* 4. SIGN IN / REGISTER CALL TO ACTION BANNER */}
      <SignInCtaBanner onNavigate={onNavigate} />

      {/* 5. FINANCIAL CALCULATOR */}
      <SipCalculator />
    </div>
  );
}
