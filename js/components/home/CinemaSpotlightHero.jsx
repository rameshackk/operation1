import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

function CinemaSpotlightHero({
  spotlightVideos = [],
  onWatchVideo,
  language = 'ta'
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isTamil = language === 'ta';

  if (!spotlightVideos || spotlightVideos.length === 0) return null;

  const currentVideo = spotlightVideos[currentIndex] || spotlightVideos[0];
  const title = isTamil
    ? (currentVideo.titleTamil || currentVideo.title)
    : (currentVideo.titleEnglish || currentVideo.title);
  const description = isTamil
    ? (currentVideo.descriptionTamil || currentVideo.description)
    : (currentVideo.descriptionEnglish || currentVideo.description);

  const ytId = currentVideo?.youtubeId || currentVideo?.id || '';
  const thumbUrl = currentVideo?.thumbnail || (ytId ? `https://i.ytimg.com/vi_webp/${ytId}/hqdefault.webp` : '');

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-[#C9B59C] dark:border-amber-500/30 p-5 sm:p-8 shadow-xl text-slate-900 dark:text-white">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow">
              SPOTLIGHT MASTERCLASS
            </span>
            <span className="text-xs font-mono text-amber-800 dark:text-amber-400 font-bold">
              {currentVideo.category?.toUpperCase()}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black font-serif text-slate-900 dark:text-white leading-tight tracking-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed font-sans max-w-2xl">
            {description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onWatchVideo && onWatchVideo(currentVideo)}
              className="btn-magnetic px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{isTamil ? 'இப்போதே பார்க்க' : 'Watch Masterclass'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-bold">
              <span className="text-slate-900 dark:text-white">{currentVideo.channelName || 'Budget Padmanaban'}</span>
              <span>•</span>
              <span>Original Guides</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div
            onClick={() => onWatchVideo && onWatchVideo(currentVideo)}
            className="group relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-[#D9CFC7] dark:border-white/15 shadow-2xl cursor-pointer"
          >
            <img
              src={thumbUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              width="480"
              height="270"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {spotlightVideos.map((vid, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={vid.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-1 min-w-[65px] sm:min-w-[75px] p-1.5 rounded-xl border transition-all text-left ${isActive
                      ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50 text-amber-900 dark:text-amber-300'
                      : 'bg-[#EFE9E3] dark:bg-slate-900/80 border-[#C9B59C] dark:border-slate-800 hover:border-amber-500 text-slate-800 dark:text-slate-200'
                    }`}
                >
                  <div className="text-xs font-bold truncate">
                    0{idx + 1} • {vid.duration || 'Video'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CinemaSpotlightHero;
export { CinemaSpotlightHero };
