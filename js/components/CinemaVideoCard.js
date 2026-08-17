import React, { useState, useEffect, useRef } from 'https://esm.sh/react@18.2.0';

/**
 * LivingWallVideoCard Component (applied across all video rails & grids)
 * Features 9:16 portrait geometry, desynchronized multi-frame storyboard crossfade animation,
 * smooth hover lift, ambient gradient overlays, and zero emojis.
 */
export function CinemaVideoCard({
  video,
  index = 0,
  onSelect,
  language = 'ta',
  onShowToast
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [nextFrameIndex, setNextFrameIndex] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const isTamil = language === 'ta';
  const timerRef = useRef(null);
  const fadeTimeoutRef = useRef(null);

  const youtubeId = video?.youtubeId || '';
  const frames = [
    video?.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : ''),
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq1.jpg` : '',
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq2.jpg` : '',
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq3.jpg` : ''
  ].filter(Boolean);

  // Check reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      }
    }
  }, []);

  // Desynchronized continuous storyboard frame cycle
  useEffect(() => {
    if (prefersReducedMotion || !frames || frames.length <= 1 || isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const baseInterval = 3400;
    const staggerOffset = (index * 550) % 2000;
    const intervalTime = baseInterval + staggerOffset;

    const scheduleNextCycle = () => {
      timerRef.current = setTimeout(() => {
        const nextIdx = (activeFrameIndex + 1) % frames.length;
        setNextFrameIndex(nextIdx);
        setIsCrossfading(true);

        fadeTimeoutRef.current = setTimeout(() => {
          setActiveFrameIndex(nextIdx);
          setNextFrameIndex(null);
          setIsCrossfading(false);
        }, 650);
      }, intervalTime);
    };

    scheduleNextCycle();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [frames, activeFrameIndex, isHovered, prefersReducedMotion, index]);

  const currentFrame = frames && frames.length > 0 ? frames[activeFrameIndex] : '';
  const nextFrame = nextFrameIndex !== null && frames && frames[nextFrameIndex] ? frames[nextFrameIndex] : null;

  const title = isTamil
    ? (video.titleTamil || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title || 'Featured Video');

  const category = (video.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const duration = video.duration || 'Video';

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
        w-full aspect-[9/16]
        bg-slate-900 border border-slate-800/90 hover:border-amber-500/60
        shadow-xl shadow-slate-950/60 hover:shadow-2xl hover:shadow-amber-500/20
        transition-all duration-400 ease-out transform hover:-translate-y-2 hover:scale-[1.03]
        outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0`}
    >
      {/* LIVING MULTI-FRAME STORYBOARD BACKGROUND */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
        {currentFrame && (
          <img
            src={currentFrame}
            alt={title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700
              ${isCrossfading ? 'scale-105 opacity-40 blur-[1px]' : 'scale-100 opacity-90 blur-0'}
              group-hover:scale-110 group-hover:opacity-100`}
          />
        )}
        {nextFrame && isCrossfading && (
          <img
            src={nextFrame}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-fadeIn transition-all duration-700 opacity-95 scale-100"
          />
        )}

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40 opacity-85 group-hover:opacity-95 transition-opacity" />
      </div>

      {/* TOP BADGES */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-full bg-slate-950/85 backdrop-blur-md text-amber-400 border border-amber-400/25 shadow-sm">
          {category}
        </span>
        <span className="px-2.5 py-1 text-[9px] font-mono font-bold rounded-full bg-slate-950/85 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm">
          {duration}
        </span>
      </div>

      {/* CENTER GLOWING PLAY ICON ON HOVER */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-12 h-12 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl group-hover:border-amber-500/60">
          <svg className="w-5 h-5 text-amber-400 fill-current ml-0.5" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      {/* BOTTOM INFO PANEL WITH TITLE & WATCH ACTION */}
      <div className="absolute bottom-0 inset-x-0 p-4 pt-12 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-10 flex flex-col justify-end gap-2">
        <h3 className="text-xs sm:text-sm font-bold text-white font-serif line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[130px]">
            {video.channelName || 'Budget Padmanaban'}
          </span>
          <span className="text-[10px] font-bold text-amber-400 group-hover:underline shrink-0">
            {isTamil ? 'பார்க்க' : 'Watch'} →
          </span>
        </div>
      </div>
    </div>
  );
}
