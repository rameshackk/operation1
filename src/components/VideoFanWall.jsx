import React, { useState, useMemo } from 'react';
import { VideoFanCard } from './VideoFanCard.jsx';
import { VideoTheaterModal } from './VideoTheaterModal.jsx';

/**
 * VideoFanWall Component
 * A sculptured, living wall of fanned, continuously animating video cards.
 */
export function VideoFanWall({
  videos = [],
  titleTamil = 'பிரத்யேக வீடியோக்கள்',
  titleEnglish = 'Living Video Showcase',
  subtitleTamil = 'பட்ஜெட் பத்மநாபனின் பிரத்யேக நிதி மற்றும் முதலீட்டு வீடியோ அலசல்கள்',
  subtitleEnglish = 'Continuous interactive video gallery featuring original insights and financial masterclasses',
  language = 'ta',
  onNavigate
}) {
  const isTamil = language === 'ta';
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'shorts' | 'mutual-funds' | 'personal-finance'
  const [startIndex, setStartIndex] = useState(0);

  // Filter pool based on active tab
  const filteredVideos = useMemo(() => {
    let list = videos && videos.length > 0 ? videos : [];
    if (activeTab === 'shorts') {
      list = list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts')));
      if (list.length === 0) list = videos.slice(0, 9);
    } else if (activeTab === 'mutual-funds') {
      list = list.filter(v => v.category === 'mutual-funds');
    } else if (activeTab === 'personal-finance') {
      list = list.filter(v => v.category === 'personal-finance');
    }
    return list.length > 0 ? list : videos;
  }, [videos, activeTab]);

  // Take a slice of 5-7 cards for the fan arc
  const visibleCount = Math.min(filteredVideos.length, 7);
  const fanCards = useMemo(() => {
    if (!filteredVideos.length) return [];
    const count = visibleCount;
    const cards = [];
    for (let i = 0; i < count; i++) {
      const idx = (startIndex + i) % filteredVideos.length;
      cards.push(filteredVideos[idx]);
    }
    return cards;
  }, [filteredVideos, visibleCount, startIndex]);

  const handlePrev = () => {
    setStartIndex(prev => (prev - 1 + filteredVideos.length) % filteredVideos.length);
  };

  const handleNext = () => {
    setStartIndex(prev => (prev + 1) % filteredVideos.length);
  };

  // Compute fan curve geometry for each card position in the arc
  const getFanGeometry = (index, total) => {
    const centerIndex = (total - 1) / 2;
    const offset = index - centerIndex; // e.g. for 7 cards: -3, -2, -1, 0, 1, 2, 3

    // Angle of rotation (e.g. -12deg to +12deg)
    const rotation = offset * 4.2;

    // Parabolic vertical dip (center sits highest, edges curve downward)
    const translateY = Math.pow(Math.abs(offset), 1.6) * 7.5;

    // Slight horizontal pull to overlap
    const translateX = offset * -6;

    return { rotation, translateY, translateX };
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-y border-slate-800/80 shadow-2xl select-none">
      {/* AMBIENT GLOW BACKDROP */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[250px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">

        {/* SECTION HEADER & FILTER PILLS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{isTamil ? 'நேரலை வீடியோ கேலரி' : 'Living Video Arc'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight">
              {isTamil ? titleTamil : titleEnglish}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              {isTamil ? subtitleTamil : subtitleEnglish}
            </p>
          </div>

          {/* TABS & ROTATION CONTROLS */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
            <div className="inline-flex p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
              <button
                onClick={() => { setActiveTab('all'); setStartIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isTamil ? 'அனைத்தும்' : 'All Featured'}
              </button>
              <button
                onClick={() => { setActiveTab('shorts'); setStartIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'shorts'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isTamil ? 'குறுகிய வீடியோக்கள்' : 'Quick Takes'}
              </button>
              <button
                onClick={() => { setActiveTab('mutual-funds'); setStartIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'mutual-funds'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isTamil ? 'மியூச்சுவல் ஃபண்ட்' : 'Mutual Funds'}
              </button>
            </div>

            {/* PREV / NEXT FAN SHIFT BUTTONS */}
            {filteredVideos.length > visibleCount && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  aria-label="Previous card in fan"
                  className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                >
                  ←
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next card in fan"
                  className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* LIVING FAN ARC CONTAINER */}
        <div className="relative py-8 px-2 sm:px-6 flex items-center justify-center overflow-x-auto no-scrollbar min-h-[380px] sm:min-h-[460px]">
          <div className="flex items-center justify-center -space-x-8 sm:-space-x-12 md:-space-x-16 transition-all duration-500">
            {fanCards.map((video, idx) => {
              const { rotation, translateY, translateX } = getFanGeometry(idx, fanCards.length);
              const isCardHovered = hoveredCardId === video.id;
              const anyCardHovered = Boolean(hoveredCardId);

              return (
                <VideoFanCard
                  key={`fan-${video.id}-${idx}`}
                  video={video}
                  index={idx}
                  totalCards={fanCards.length}
                  fanRotation={rotation}
                  fanTranslateY={translateY}
                  fanTranslateX={translateX}
                  isHovered={isCardHovered}
                  anyCardHovered={anyCardHovered}
                  onHoverStart={() => setHoveredCardId(video.id)}
                  onHoverEnd={() => setHoveredCardId(null)}
                  onSelect={(v) => setSelectedVideo(v)}
                  language={language}
                />
              );
            })}
          </div>
        </div>

        {/* BOTTOM HINT & EXPLORE LINK */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-4 flex-wrap gap-3">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {isTamil
              ? 'நேரலை மாதிரி: கார்டின் மீது கர்சரை வைத்து முழு விவரத்தைக் காணலாம்'
              : 'Interactive living showcase: Hover over any card to preview & expand'}
          </span>

          <button
            onClick={() => onNavigate ? onNavigate('#/videos') : (window.location.hash = '#/videos')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <span>{isTamil ? 'அனைத்து வீடியோக்களையும் காண்க' : 'Browse Full Video Catalog'}</span>
            <span>→</span>
          </button>
        </div>

      </div>

      {/* THEATER PLAYBACK MODAL */}
      {selectedVideo && (
        <VideoTheaterModal
          video={selectedVideo}
          allVideos={videos}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(relVideo) => setSelectedVideo(relVideo)}
          language={language}
        />
      )}
    </section>
  );
}
