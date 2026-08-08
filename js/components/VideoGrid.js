import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { VideoCard } from './VideoCard.js';
import { SkeletonCard } from './SkeletonCard.js';

export function VideoGrid({
  videos = [],
  isLoading = false,
  onSelectVideo,
  activeCategory = 'all',
  onCategoryChange
}) {
  const { t } = useLanguage();
  const [displayCount, setDisplayCount] = useState(10);

  const categories = [
    { id: 'all', label: t('filterAll') },
    { id: 'mutual-funds', label: t('nav.mutualFunds') },
    { id: 'stocks', label: t('nav.stocks') },
    { id: 'personal-finance', label: t('nav.personalFinance') },
    { id: 'education', label: t('nav.education') }
  ];

  const visibleVideos = videos.slice(0, displayCount);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
            {t('latestVideos') || 'சமீபத்திய வீடியோக்கள்'}
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onCategoryChange && onCategoryChange(cat.id);
                setDisplayCount(10);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 5 columns desktop, 3 tablet, 1-2 mobile */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : visibleVideos.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t('noResults')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {visibleVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={onSelectVideo}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {displayCount < videos.length && !isLoading && (
        <div className="text-center pt-4">
          <button
            onClick={() => setDisplayCount(prev => prev + 5)}
            className="px-5 py-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white transition-colors"
          >
            Load More Videos
          </button>
        </div>
      )}
    </section>
  );
}
