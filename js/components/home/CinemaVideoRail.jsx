import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import CinemaVideoCard from './CinemaVideoCard.jsx';

function CinemaVideoRail({
  titleTamil,
  titleEnglish,
  subtitleTamil,
  subtitleEnglish,
  badgeText,
  videos = [],
  onSelectVideo,
  language = 'ta',
  onShowToast
}) {
  const scrollRef = useRef(null);
  const isTamil = language === 'ta';

  if (!videos || videos.length === 0) return null;

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const distance = direction === 'left' ? -320 : 320;
    scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const title = isTamil ? titleTamil : titleEnglish;
  const subtitle = isTamil ? subtitleTamil : subtitleEnglish;

  return (
    <section className="space-y-3 py-3 select-none">
      <div className="flex items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
              {title}
            </h2>
            {badgeText && (
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700 btn-magnetic text-xs"
          >
            ←
          </button>
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700 btn-magnetic text-xs"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth"
      >
        {videos.map((video, idx) => (
          <div key={`rail-${video.id || idx}`} className="w-[140px] sm:w-[165px] md:w-[185px] shrink-0">
            <CinemaVideoCard
              video={video}
              index={idx}
              onSelect={onSelectVideo}
              language={language}
              onShowToast={onShowToast}
            />
          </div>
        ))}
      </div>
    </section>
  );
}


export default CinemaVideoRail;
export { CinemaVideoRail };
