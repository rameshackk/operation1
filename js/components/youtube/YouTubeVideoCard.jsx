import React from 'react';
import { formatCompactViews, formatRelativeTime, formatVideoDuration } from '../../utils/youtubeFormatters.js';

function YouTubeVideoCard({ video, onSelect, isTamil = false }) {
  if (!video) return null;

  const videoId = video.video_id || video.youtubeId || video.id;
  const title = video.title || video.titleTamil || video.titleEnglish || 'Budget Padmanaban Video';
  const durationSeconds = video.duration_seconds || video.durationSeconds || 0;
  const durationText = video.duration || formatVideoDuration(durationSeconds);
  const views = video.view_count || video.views || 0;
  const publishedAt = video.published_at || video.publishedAt;
  const thumbnailUrl =
    video.thumbnail_url ||
    video.thumbnail ||
    (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '/assets/logo.png');

  const compactViews = formatCompactViews(views, isTamil);
  const timeAgo = formatRelativeTime(publishedAt, isTamil);

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
      className="group cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl transition-all duration-200 flex flex-col"
      aria-label={title}
    >
      {/* 1. 16:9 Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shrink-0">
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

        {/* Hover Overlay with Centered Play Button */}
        <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/95 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg transform group-hover:scale-100 scale-90">
            <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>

        {/* Live / Premiere Badge (if is_live) */}
        {video.is_live ? (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>LIVE</span>
          </div>
        ) : null}

        {/* Duration Badge */}
        {durationText && !video.is_live ? (
          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-semibold leading-none shadow-sm">
            {durationText}
          </span>
        ) : null}
      </div>

      {/* 2. Video Title */}
      <h3
        className="mt-2.5 text-[14px] font-semibold text-slate-900 dark:text-white leading-[1.35] line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        title={title}
      >
        {title}
      </h3>

      {/* 3. Meta Line: Budget Padmanaban · 16K views · 1 mo ago */}
      <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400 font-medium flex items-center flex-wrap gap-x-1.5 leading-tight">
        <span>Budget Padmanaban</span>
        <span>·</span>
        <span>{compactViews}</span>
        {timeAgo ? (
          <>
            <span>·</span>
            <span>{timeAgo}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default YouTubeVideoCard;
