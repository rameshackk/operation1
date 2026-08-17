import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';

/**
 * CinemaSpotlightHero Component
 * Interactive Luxury Spotlight Hero experience inspired by Apple TV+ and Netflix.
 * Replaces the generic YouTube header with an interactive Masterclass stage.
 */
export function CinemaSpotlightHero({
  spotlightVideos = [],
  onWatchVideo,
  language = 'ta'
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isTamil = language === 'ta';

  const videos = spotlightVideos && spotlightVideos.length > 0 ? spotlightVideos.slice(0, 5) : [];
  const currentVideo = videos[currentIndex] || videos[0];

  useEffect(() => {
    if (videos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % videos.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [videos.length]);

  if (!currentVideo) return null;

  const title = isTamil
    ? (currentVideo.titleTamil || currentVideo.title || 'முக்கிய முதலீட்டு வழிகாட்டி')
    : (currentVideo.titleEnglish || currentVideo.title || 'Featured Investment Masterclass');

  const description = isTamil
    ? (currentVideo.descriptionTamil || currentVideo.description || 'பட்ஜெட் பத்மநாபன் CFP அவர்களின் விரிவான நிதி மற்றும் முதலீட்டு வழிகாட்டி.')
    : (currentVideo.descriptionEnglish || currentVideo.description || 'Exclusive financial masterclass and wealth-building insights directly from Certified Financial Planner Padmanaban B.');

  const category = (currentVideo.category || 'MUTUAL FUNDS').replace('-', ' ').toUpperCase();
  const duration = currentVideo.duration || '14:20';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl text-white select-none">
      {/* AMBIENT GLOW & BACKDROP IMAGE */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={currentVideo.thumbnail || `https://img.youtube.com/vi/${currentVideo.youtubeId}/hqdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover object-center filter blur-xl scale-110 opacity-30 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

      {/* CONTENT GRID */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: HIGH-IMPACT METADATA & ACTIONS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-500 text-slate-950 shadow-md">
              {isTamil ? 'சிறப்பு மாஸ்டர் கிளாஸ்' : 'FEATURED MASTERCLASS'}
            </span>
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/10 backdrop-blur-md text-amber-300 border border-white/10">
              {category} • {duration}
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-bold">
              CFP Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif text-white leading-tight tracking-tight drop-shadow-md">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed line-clamp-3">
            {description}
          </p>

          <div className="flex items-center gap-4 pt-2 flex-wrap">
            <button
              onClick={() => onWatchVideo && onWatchVideo(currentVideo)}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{isTamil ? 'இப்போதே பார்க்கவும்' : 'Watch Masterclass'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <span className="text-white">{currentVideo.channelName || 'Budget Padmanaban'}</span>
              <span>•</span>
              <span>882 Original Guides</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW STAGE & QUEUE SWITCHER */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Stage Frame */}
          <div
            onClick={() => onWatchVideo && onWatchVideo(currentVideo)}
            className="group relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-white/15 shadow-2xl cursor-pointer"
          >
            <img
              src={currentVideo.thumbnail || `https://img.youtube.com/vi/${currentVideo.youtubeId}/hqdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Queue Selector Dots / Mini Cards */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {videos.map((vid, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={vid.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-1 min-w-[70px] sm:min-w-[80px] p-1.5 rounded-xl border transition-all text-left ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="text-[9px] font-bold text-slate-300 truncate">
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
