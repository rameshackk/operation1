import React from 'react';
import { formatCompactViews } from '../../utils/youtubeFormatters.js';

function YouTubeShortCard({ video, onSelect, isTamil = false }) {
  if (!video) return null;

  const videoId = video.video_id || video.youtubeId || video.id;
  const title = video.title || video.titleTamil || video.titleEnglish || 'Budget Padmanaban Short';
  const views = video.view_count || video.views || 0;
  const thumbnailUrl =
    video.thumbnail_url ||
    video.thumbnail ||
    (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '/assets/logo.png');

  const compactViews = formatCompactViews(views, isTamil);

  const handleClick = () => {
    if (onSelect) onSelect(video);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer select-none w-40 sm:w-48 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl transition-all duration-200 flex flex-col"
      aria-label={title}
    >
      {/* 9:16 Vertical Thumbnail Container */}
      <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (videoId && !e.target.src.includes('hqdefault.jpg')) {
              e.target.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            }
          }}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200 ease-out"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-transparent group-hover:bg-black/25 transition-colors duration-200 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/95 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
            <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>

        {/* Shorts Icon Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
          <span>SHORTS</span>
        </div>
      </div>

      {/* Title */}
      <h4
        className="mt-2 text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        title={title}
      >
        {title}
      </h4>

      {/* Views */}
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
        {compactViews}
      </p>
    </div>
  );
}

export default YouTubeShortCard;
