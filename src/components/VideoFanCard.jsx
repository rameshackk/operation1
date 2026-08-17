import React, { useState } from 'react';
import { useCardCycle } from '../hooks/useCardCycle.js';

/**
 * VideoFanCard Component
 * Represents a single vertical, continuous-cycling living card within the fan arc.
 */
export function VideoFanCard({
  video,
  index,
  totalCards,
  fanRotation = 0,
  fanTranslateY = 0,
  fanTranslateX = 0,
  isHovered = false,
  anyCardHovered = false,
  onHoverStart,
  onHoverEnd,
  onSelect,
  language = 'ta'
}) {
  const isTamil = language === 'ta';

  // Compute 3-4 preview storyboard frame URLs for the video
  const youtubeId = video?.youtubeId || '';
  const frames = [
    video?.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : ''),
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq1.jpg` : '',
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq2.jpg` : '',
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq3.jpg` : ''
  ].filter(Boolean);

  const {
    currentFrame,
    nextFrame,
    isCrossfading,
    prefersReducedMotion
  } = useCardCycle(frames, index, isHovered);

  // Compute dynamic transform style for fan arrangement & hover lift
  let transformStyle = '';
  let zIndex = index + 10;

  if (prefersReducedMotion) {
    transformStyle = 'none';
  } else if (isHovered) {
    transformStyle = `rotate(0deg) translateY(-16px) scale(1.06)`;
    zIndex = 50;
  } else if (anyCardHovered) {
    // Subtle shift if neighbor is hovered
    transformStyle = `rotate(${fanRotation * 0.9}deg) translateY(${fanTranslateY}px) translateX(${fanTranslateX}px) scale(0.97)`;
    zIndex = index + 10;
  } else {
    transformStyle = `rotate(${fanRotation}deg) translateY(${fanTranslateY}px) translateX(${fanTranslateX}px)`;
    zIndex = index + 10;
  }

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
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(video);
        }
      }}
      style={{
        transform: transformStyle,
        zIndex,
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, z-index 0s'
      }}
      className={`group relative select-none cursor-pointer shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden
        w-[160px] sm:w-[200px] md:w-[220px] aspect-[9/16]
        bg-slate-900 border border-white/10 dark:border-slate-800
        shadow-2xl shadow-slate-950/60 hover:shadow-amber-500/20 hover:border-amber-500/40
        outline-none focus-visible:ring-2 focus-visible:ring-amber-500`}
    >
      {/* BACKGROUND FRAMES WITH CROSSFADE AND SOFT BLUR */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
        {/* Base Frame */}
        {currentFrame && (
          <img
            src={currentFrame}
            alt={title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700
              ${isCrossfading ? 'scale-105 opacity-40 blur-[1px]' : 'scale-100 opacity-90 blur-0'}
              group-hover:scale-110`}
          />
        )}

        {/* Incoming Next Frame */}
        {nextFrame && isCrossfading && (
          <img
            src={nextFrame}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-fadeIn transition-all duration-700 opacity-95 scale-100"
          />
        )}

        {/* Shimmer / Living Glass Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40 opacity-80 group-hover:opacity-95 transition-opacity" />
      </div>

      {/* TOP STATUS PILL (Idle & Hover) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/20 shadow-sm">
          {category}
        </span>
        <span className="px-2 py-1 text-[9px] font-mono font-bold rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 border border-white/10 shadow-sm">
          {duration}
        </span>
      </div>

      {/* CENTER GLOW ACCENT (Subtle pulse) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-xl">
          <svg className="w-5 h-5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      {/* BOTTOM INFO PANEL (Reveals cleanly on hover) */}
      <div className="absolute bottom-0 inset-x-0 p-4 pt-10 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20 flex flex-col justify-end gap-2">
        <h3 className="text-xs sm:text-sm font-bold text-white font-serif line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-slate-400 font-medium line-clamp-1">
            {video.channelName || 'Budget Padmanaban'}
          </span>
          <span className="text-[10px] font-bold text-amber-400 group-hover:underline">
            {isTamil ? 'பார்க்க' : 'Watch'} →
          </span>
        </div>
      </div>
    </div>
  );
}
