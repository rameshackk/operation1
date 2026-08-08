import React from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { VideoCard } from './VideoCard.js';

export function VideoSection({ title, subtitle, videos = [], onSelectVideo, categoryBadge }) {
  const { t } = useLanguage();

  if (!videos || videos.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {categoryBadge && (
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {categoryBadge}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {videos.slice(0, 5).map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onSelect={onSelectVideo}
          />
        ))}
      </div>
    </section>
  );
}
