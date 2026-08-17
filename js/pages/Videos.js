import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { useVideos } from '../hooks/useVideos.js';
import { VideoGrid } from '../components/VideoGrid.js';
import { VideoFanWall } from '../components/VideoFanWall.js';
import { videosData } from '../data/videos.js';

export function Videos({ onNavigate }) {
  const { t, language } = useLanguage();
  const [category, setCategory] = useState('all');
  const { videos, isLoading } = useVideos(category);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. LIVING FAN WALL HERO AREA */}
      <VideoFanWall
        videos={videosData}
        language={language}
        onNavigate={onNavigate}
        titleTamil="பிரத்யேக வீடியோக்கள்"
        titleEnglish="Living Video Showcase"
        subtitleTamil="பட்ஜெட் பத்மநாபனின் பிரத்யேக நிதி மற்றும் முதலீட்டு வீடியோ அலசல்கள்"
        subtitleEnglish="Continuous interactive video gallery featuring original insights and financial masterclasses"
      />

      {/* 2. FULL SCANNABLE CATALOG GRID */}
      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif">
            {t('nav.videos')} Feed
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('budgetPadmanaban')}
          </p>
        </div>

        <VideoGrid
          videos={videos}
          isLoading={isLoading}
          activeCategory={category}
          onCategoryChange={setCategory}
          onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)}
        />
      </div>
    </div>
  );
}
