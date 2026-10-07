import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import CinemaSpotlightHero from './CinemaSpotlightHero.jsx';
import CinemaVideoRail from './CinemaVideoRail.jsx';
import CinemaVideoCard from './CinemaVideoCard.jsx';
import CinemaTheaterModal from '../../pages/CinemaTheaterModal.jsx';
import { getTrendingPreviewVideos } from '../../services/api.js';
import { useVideos } from '../../services/videos.js';

function HomeCinemaShowcase({ onNavigate, onShowToast, language = 'ta' }) {
  const isTamil = language === 'ta';
  const [activeCategory, setActiveCategory] = useState('featured');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { videos: allVideos = [], isLoading } = useVideos('all', 'newest');

  const categories = [
    { id: 'featured', labelTa: 'சமீபத்திய & முக்கிய வீடியோக்கள்', labelEn: 'Latest & Featured' },
    { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
    { id: 'stocks', labelTa: 'பங்குச் சந்தை & IPO', labelEn: 'Stocks & Markets' },
    { id: 'tax-saving', labelTa: 'வரி சேமிப்பு & ஓய்வூதியம்', labelEn: 'Tax & Retirement' },
    { id: 'education', labelTa: 'முதலீட்டுக் கல்வி', labelEn: 'Financial Education' },
    { id: 'shorts', labelTa: 'குறுகிய வீடியோக்கள் (Shorts)', labelEn: 'Quick Takes (Shorts)' }
  ];

  const showcaseVideos = useMemo(() => {
    let list = [...allVideos];
    if (activeCategory === 'featured') {
      return list.slice(0, 12);
    } else if (activeCategory === 'shorts') {
      return list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts'))).slice(0, 12);
    } else if (activeCategory === 'personal-finance') {
      return list.filter(v => v.category === 'personal-finance').slice(0, 12);
    } else if (activeCategory === 'mutual-funds') {
      return list.filter(v => v.category === 'mutual-funds').slice(0, 12);
    } else if (activeCategory === 'stocks') {
      return list.filter(v => v.category === 'stocks' || v.category === 'ipo').slice(0, 12);
    } else if (activeCategory === 'tax-saving') {
      return list.filter(v => v.category === 'tax-saving' || v.category === 'retirement').slice(0, 12);
    } else if (activeCategory === 'education') {
      return list.filter(v => v.category === 'education').slice(0, 12);
    }
    return list.slice(0, 12);
  }, [allVideos, activeCategory]);

  return (
    <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0">
      <div className="space-y-4">
        {/* Category Tabs & View All Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 touch-pan-x">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2.5 min-h-[44px] rounded-full text-xs sm:text-[12.5px] whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 shadow-sm ${isActive
                      ? 'bg-emerald-700 text-white font-black ring-2 ring-emerald-500 shadow-md shadow-emerald-700/20'
                      : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:bg-white hover:text-slate-950 font-bold border border-slate-200/80 dark:border-slate-800'
                    }`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('#/videos');
              else if (typeof window !== 'undefined') window.location.hash = '#/videos';
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-extrabold text-emerald-700 dark:text-amber-400 hover:text-emerald-900 dark:hover:text-amber-300 transition-colors shrink-0 self-end sm:self-center min-h-[44px] py-1"
          >
            <span>{isTamil ? 'அனைத்து வீடியோக்கள் (800+)' : 'View All Videos (800+)'}</span>
            <span className="font-bold">→</span>
          </button>
        </div>

        {/* 1. DESKTOP VIEW (hidden md:grid) - Strictly 5-column single row on desktop */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {isLoading && showcaseVideos.length === 0 ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-200 dark:bg-slate-800/60 aspect-[9/13] p-4 space-y-3 animate-pulse">
                <div className="aspect-video bg-slate-300 dark:bg-slate-700/60 rounded-xl" />
                <div className="h-4 bg-slate-300 dark:bg-slate-700/60 rounded w-3/4" />
                <div className="h-3 bg-slate-300 dark:bg-slate-700/60 rounded w-1/2" />
              </div>
            ))
          ) : (
            showcaseVideos.slice(0, 5).map((video, idx) => (
              <CinemaVideoCard
                key={`home-cinema-desk-${video.id || idx}`}
                video={video}
                index={idx}
                onSelect={(v) => setSelectedVideo(v)}
                language={language}
                onShowToast={onShowToast}
              />
            ))
          )}
        </div>

        {/* 2. MOBILE VIEW (md:hidden) - Strictly ONE SINGLE ROW horizontal swipe rail */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-3.5 py-1.5 no-scrollbar touch-pan-x -mx-1 px-1">
          {isLoading && showcaseVideos.length === 0 ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-[72vw] max-w-[280px] shrink-0 snap-center rounded-2xl bg-slate-200 dark:bg-slate-800/60 aspect-[9/13] p-4 space-y-3 animate-pulse">
                <div className="aspect-video bg-slate-300 dark:bg-slate-700/60 rounded-xl" />
                <div className="h-4 bg-slate-300 dark:bg-slate-700/60 rounded w-3/4" />
              </div>
            ))
          ) : (
            showcaseVideos.slice(0, 8).map((video, idx) => (
              <div key={`home-cinema-mob-${video.id || idx}`} className="w-[72vw] max-w-[280px] shrink-0 snap-center">
                <CinemaVideoCard
                  video={video}
                  index={idx}
                  onSelect={(v) => setSelectedVideo(v)}
                  language={language}
                  onShowToast={onShowToast}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={allVideos}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(rel) => setSelectedVideo(rel)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}

/**
 * HOME PAGE
 */

export default HomeCinemaShowcase;
export { HomeCinemaShowcase };
