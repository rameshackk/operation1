import React from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { useVideos } from '../hooks/useVideos.js';
import { VideoGrid } from '../components/VideoGrid.js';

export function Category({ categoryId, onNavigate }) {
  const { t } = useLanguage();
  const { videos, isLoading } = useVideos(categoryId);

  const categoryTitles = {
    'mutual-funds': t('nav.mutualFunds'),
    'stocks': t('nav.stocks'),
    'personal-finance': t('nav.personalFinance'),
    'education': t('nav.education')
  };

  const title = categoryTitles[categoryId] || categoryId;

  return (
    <div className="py-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
          Category Feed
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
          {title}
        </h1>
      </div>

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        activeCategory={categoryId}
        onCategoryChange={(cat) => onNavigate(`#/category/${cat}`)}
        onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)}
      />
    </div>
  );
}
