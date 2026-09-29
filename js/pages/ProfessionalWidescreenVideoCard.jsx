import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

function ProfessionalWidescreenVideoCard({ video, onSelect, language = 'ta' }) {
  const isTamil = language === 'ta';
  if (!video) return null;

  const youtubeId = video?.youtubeId || video?.youtube_id || video?.id || '';
  const thumbnail = video?.thumbnail || video?.thumbnail_url || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '');
  const title = isTamil
    ? (video.titleTamil || video.title_ta || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title_en || video.title || 'Masterclass Video');
  const category = (video.category || 'MUTUAL-FUNDS').replace('-', ' ').toUpperCase();
  const duration = video.duration || (video.isShort ? 'Short' : '10:00');
  const dateStr = video.publishedAt || video.published_at
    ? new Date(video.publishedAt || video.published_at).toLocaleDateString(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect && onSelect(video)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(video);
        }
      }}
      className="group relative select-none cursor-pointer rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500 shadow-md hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-200 flex flex-col h-full"
    >
      {/* 16:9 Horizontal Widescreen Thumbnail Frame */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 shrink-0">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-full bg-slate-950/90 text-amber-400 border border-amber-400/30 ">
            {category}
          </span>
          <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-slate-950/90 text-white border border-white/20 ">
            {duration}
          </span>
        </div>

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 shadow-2xl">
            <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Video Content / Meta */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3 bg-slate-900/90">
        <h3 className="text-xs sm:text-sm font-bold text-white font-serif line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 mt-auto">
          {dateStr ? (
            <span className="font-medium flex items-center gap-1">
              <span>📅</span>
              <span>{dateStr}</span>
            </span>
          ) : <span />}
          <span className="font-bold text-amber-400 group-hover:underline inline-flex items-center gap-1">
            <span>{isTamil ? 'காணொளியை இயக்கு' : 'Play Masterclass'}</span>
            <span>▶</span>
          </span>
        </div>
      </div>
    </div>
  );
}


export default ProfessionalWidescreenVideoCard;
export { ProfessionalWidescreenVideoCard };
