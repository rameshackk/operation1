import React, { useState, useEffect, useRef } from 'https://esm.sh/react@18.2.0';

/**
 * CinemaVideoCard Component
 * Ultra-smooth interactive video card inspired by Apple TV+ & Netflix cinema cards.
 * Features multi-frame preview cycling on hover, smooth spring scale, and rich overlay.
 */
export function CinemaVideoCard({
  video,
  aspectRatio = '16/9', // '16/9' or '9/16'
  onSelect,
  language = 'ta',
  onShowToast
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const isTamil = language === 'ta';
  const timerRef = useRef(null);

  const youtubeId = video?.youtubeId || '';
  const frames = [
    video?.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : ''),
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq1.jpg` : '',
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq2.jpg` : '',
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq3.jpg` : ''
  ].filter(Boolean);

  // Cycle preview frames smoothly when hovered
  useEffect(() => {
    if (!isHovered || frames.length <= 1) {
      setActiveFrameIndex(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % frames.length);
    }, 1200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, frames.length]);

  const title = isTamil
    ? (video.titleTamil || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title || 'Featured Video');

  const category = (video.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const duration = video.duration || 'Video';
  const views = video.views ? `${Number(video.views).toLocaleString()} views` : '';

  const isVertical = aspectRatio === '9/16' || video.isShort;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect && onSelect(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(video);
        }
      }}
      className={`group relative select-none cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden
        bg-slate-900 border border-slate-800/80 hover:border-amber-500/50
        shadow-lg hover:shadow-2xl hover:shadow-amber-500/10
        transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.02]
        outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0
        ${isVertical ? 'w-[170px] sm:w-[210px] aspect-[9/16]' : 'w-full aspect-[16/10] sm:aspect-video'}`}
    >
      {/* BACKGROUND THUMBNAIL / PREVIEW FRAMES */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
        <img
          src={frames[activeFrameIndex] || video.thumbnail}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 group-hover:via-slate-950/50 transition-colors duration-300" />
      </div>

      {/* TOP PILLS */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-slate-950/85 backdrop-blur-md text-amber-400 border border-amber-400/25 shadow-sm">
          {category}
        </span>
        <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-full bg-slate-950/85 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm">
          {duration}
        </span>
      </div>

      {/* CENTER PLAY BUTTON (Glow on hover) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl group-hover:border-amber-500/60">
          <svg className="w-5 h-5 text-amber-400 fill-current ml-0.5" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      {/* BOTTOM INFO PANEL */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 pt-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-10 flex flex-col justify-end gap-1.5">
        <h3 className="text-xs sm:text-sm font-bold text-white font-serif line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
          <span className="truncate max-w-[140px] text-slate-300">
            {video.channelName || 'Budget Padmanaban'}
          </span>
          <span className="font-bold text-amber-400 group-hover:underline shrink-0">
            {isTamil ? 'பார்க்க' : 'Watch'} →
          </span>
        </div>
      </div>
    </div>
  );
}
