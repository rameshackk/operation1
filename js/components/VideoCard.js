import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';

export function VideoCard({ video, onSelect, watchProgress = 0 }) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  if (!video) return null;

  // Compute if video was published in last 24h
  const publishedDate = new Date(video.publishedAt);
  const hoursAgo = (Date.now() - publishedDate.getTime()) / (1000 * 3600);
  const isNew = hoursAgo <= 24;

  const formattedDate = new Intl.DateTimeFormat(
    video.activeLang === 'ta' ? 'ta-IN' : 'en-IN',
    { month: 'short', day: 'numeric', year: 'numeric' }
  ).format(publishedDate);

  const formattedViews = new Intl.NumberFormat(
    video.activeLang === 'ta' ? 'ta-IN' : 'en-IN'
  ).format(video.views || 0);

  return (
    <div
      onClick={() => onSelect(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-amber-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* NEW Badge */}
        {isNew && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded bg-red-600 text-white shadow-md badge-new">
            {t('newBadge')}
          </span>
        )}

        {/* Channel Badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-600/90 text-white text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-sm shadow-md">
          @budgetpadmanaban_
        </div>

        {/* Duration Chip */}
        <span
          className="absolute bottom-3 right-3 px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-slate-950/80 text-white backdrop-blur-sm"
          aria-label={`Duration ${video.duration}`}
        >
          {video.duration}
        </span>

        {/* Bottom Watch Progress Bar */}
        {watchProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${Math.min(100, watchProgress)}%` }}
            />
          </div>
        )}
      </div>

      {/* Content Meta */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {video.category}
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-1 group-hover:text-amber-500 transition-colors leading-snug">
            {video.title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 font-medium">
          <span>{formattedViews} {t('views')}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
