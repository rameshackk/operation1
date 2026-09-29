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
    <section className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0">
      {/* Section Band Container: #E8F5E9 in light theme */}
      <div className="section-band bg-[#E8F5E9] dark:bg-slate-900/40 rounded-2xl sm:rounded-3xl border border-[#D5EBD9] dark:border-slate-800 p-4 sm:p-6 lg:p-7 shadow-sm space-y-4">
        {/* Category Tabs & View All Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[#D5EBD9] dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-[12.5px] font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${isActive
                      ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-600/20'
                      : 'bg-white dark:bg-slate-900 text-[#475569] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-[#D5EBD9] dark:border-slate-800 hover:border-emerald-300'
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
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#2563EB] dark:text-[#60a5fa] hover:text-blue-700 transition-colors shrink-0 self-end sm:self-center"
          >
            <span>{isTamil ? 'அனைத்து வீடியோக்கள் (800+)' : 'View All Videos (800+)'}</span>
            <span className="font-bold">→</span>
          </button>
        </div>

        {/* Responsive Grid — Strictly ONE SINGLE ROW of video cards filling the wide screen */}
        {isLoading && showcaseVideos.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6 animate-pulse">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-200 dark:bg-slate-800/60 aspect-[9/13] p-4 space-y-3">
                <div className="aspect-video bg-slate-300 dark:bg-slate-700/60 rounded-xl" />
                <div className="h-4 bg-slate-300 dark:bg-slate-700/60 rounded w-3/4" />
                <div className="h-3 bg-slate-300 dark:bg-slate-700/60 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {showcaseVideos.slice(0, 5).map((video, idx) => (
              <CinemaVideoCard
                key={`home-cinema-${video.id || idx}`}
                video={video}
                index={idx}
                onSelect={(v) => setSelectedVideo(v)}
                language={language}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        )}
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
    </section>
  );
}

/**
 * HOME PAGE
 */

export default HomeCinemaShowcase;
export { HomeCinemaShowcase };
