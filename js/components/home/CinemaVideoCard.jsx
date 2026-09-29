import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

function CinemaVideoCard({
  video,
  index = 0,
  onSelect,
  language = 'ta',
  onShowToast
}) {
  const isTamil = language === 'ta';
  if (!video) return null;

  const youtubeId = video?.youtubeId || video?.id || '';
  const thumbnail = video?.thumbnail || (youtubeId ? `https://i.ytimg.com/vi_webp/${youtubeId}/mqdefault.webp` : '');

  const title = isTamil
    ? (video.titleTamil || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title || 'Featured Video');

  const category = (video.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const duration = video.duration || (video.isShort ? '0:59' : '12:00');

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
      className="group relative select-none cursor-pointer rounded-2xl overflow-hidden
        w-full aspect-[9/13]
        bg-slate-900 border border-slate-800/80 hover:border-[#2563EB]/60
        shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)]
        transition-all duration-300 shrink-0"
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
        {thumbnail && (
          <img
            src={thumbnail}
            srcSet={youtubeId ? `https://i.ytimg.com/vi_webp/${youtubeId}/mqdefault.webp 320w, https://i.ytimg.com/vi_webp/${youtubeId}/hqdefault.webp 480w, https://i.ytimg.com/vi_webp/${youtubeId}/sddefault.webp 640w` : undefined}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            alt={title}
            loading="lazy"
            decoding="async"
            width="320"
            height="180"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
      </div>

      {/* Dark semi-transparent pills over thumbnail */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        <span className="px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-white/10 font-sans">
          {category}
        </span>
        <span className="px-2 py-1 text-xs font-num font-bold rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10">
          {duration}
        </span>
      </div>

      {/* Centered Play-Icon Circle Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-[#2563EB] group-hover:border-[#2563EB] group-hover:scale-110 transition-all duration-300 shadow-xl">
          <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 pt-10 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 flex flex-col justify-end gap-2">
        <h3 className="text-xs sm:text-sm font-bold text-white font-sans line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between pt-1 opacity-80 group-hover:opacity-100">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate max-w-[120px]">
            {video.channelName || 'Budget Padmanaban'}
          </span>
          <span className="text-xs font-bold text-[#60a5fa] group-hover:underline shrink-0 flex items-center gap-1 font-sans">
            <span>{isTamil ? 'பார்க்க' : 'Watch'}</span>
            <span>→</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default CinemaVideoCard;
export { CinemaVideoCard };
