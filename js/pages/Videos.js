import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { useVideos } from '../hooks/useVideos.js';
import { VideoGrid } from '../components/VideoGrid.js';

export function Videos({ onNavigate }) {
  const { t } = useLanguage();
  const [category, setCategory] = useState('all');
  const { videos, isLoading } = useVideos(category);

  return (
    <div className="py-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
          {t('nav.videos')} Feed
        </h1>
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
  );
}
