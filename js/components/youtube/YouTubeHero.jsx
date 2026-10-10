import React from 'react';
import { formatCompactViews, formatRelativeTime, formatVideoDuration } from '../../utils/youtubeFormatters.js';

function YouTubeHero({ video, onWatch, isTamil = false }) {
  if (!video) return null;

  const videoId = video.video_id || video.youtubeId || video.id;
  const title = video.title || video.titleTamil || video.titleEnglish || 'Budget Padmanaban Video';
  const durationSeconds = video.duration_seconds || video.durationSeconds || 0;
  const durationText = video.duration || formatVideoDuration(durationSeconds);
  const views = video.view_count || video.views || 0;
  const publishedAt = video.published_at || video.publishedAt;
  const summary = (isTamil ? (video.ai_summary_ta || video.summaryTamil) : (video.ai_summary_en || video.summaryEnglish)) ||
    video.description || video.descriptionTamil || video.descriptionEnglish || '';

  const thumbnailUrl =
    video.thumbnail_url ||
    video.thumbnail ||
    (videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : '/assets/logo.png');

  // Check if published in last 48 hours
  const isNew = publishedAt && (Date.now() - new Date(publishedAt).getTime()) < 48 * 3600 * 1000;
  const compactViews = formatCompactViews(views, isTamil);
  const timeAgo = formatRelativeTime(publishedAt, isTamil);

  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-xl mb-8 group">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 p-5 sm:p-7 md:p-8 items-center">
        {/* Left: Large 16:9 Thumbnail (7 cols on lg) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onWatch && onWatch(video)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onWatch && onWatch(video)}
          className="lg:col-span-7 relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 cursor-pointer shadow-lg group/thumb focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <img
            src={thumbnailUrl}
            alt={title}
            loading="eager"
            onError={(e) => {
              if (videoId && !e.target.src.includes('hqdefault.jpg')) {
                e.target.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }
            }}
            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
          />

          {/* Centered Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl transform group-hover/thumb:scale-110 transition-transform">
              <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>

          {/* NEW Badge if in last 48 hours */}
          {isNew ? (
            <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md animate-pulse">
              NEW
            </div>
          ) : null}

          {/* Duration Badge */}
          {durationText ? (
            <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 text-white text-xs font-mono font-bold shadow">
              {durationText}
            </span>
          ) : null}
        </div>

        {/* Right: Video Info & Actions (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
                {video.category || 'Mutual Funds'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {compactViews} {timeAgo ? `· ${timeAgo}` : ''}
              </span>
            </div>

            <h2
              role="button"
              tabIndex={0}
              onClick={() => onWatch && onWatch(video)}
              className="text-lg sm:text-2xl font-bold font-serif leading-snug cursor-pointer hover:text-blue-400 transition-colors line-clamp-2"
            >
              {title}
            </h2>

            {summary ? (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 font-normal">
                {summary}
              </p>
            ) : null}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onWatch && onWatch(video)}
              className="btn-magnetic px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{isTamil ? 'இப்போதே பார்க்கவும்' : 'Watch Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YouTubeHero;
