import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import CinemaSpotlightHero from '../components/home/CinemaSpotlightHero.jsx';
import CinemaVideoRail from '../components/home/CinemaVideoRail.jsx';
import CinemaVideoCard from '../components/home/CinemaVideoCard.jsx';
import CinemaTheaterModal from './CinemaTheaterModal.jsx';
import { useVideos } from '../services/videos.js';
import { videosData } from '../data/translations.js';


function VideosPage({ onNavigate, onShowToast, initialVideoId }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleGridCount, setVisibleGridCount] = useState(48);
  const [viewMode, setViewMode] = useState('rails');
  const sentinelRef = useRef(null);

  // Live video hook — pulls directly from Supabase /api/videos with built-in fallback
  const { videos: allLiveVideos = [], isLoading: isVideosLoading } = useVideos('all', sortBy, 48, language);

  useEffect(() => {
    if (initialVideoId && allLiveVideos && allLiveVideos.length > 0) {
      const found = allLiveVideos.find(v => v.id === initialVideoId || v.youtubeId === initialVideoId || v.youtube_id === initialVideoId || v.slug === initialVideoId);
      if (found) {
        setSelectedVideo(found);
      }
    }
  }, [initialVideoId, allLiveVideos]);

  const categoriesList = [
    { id: 'all', labelTa: `அனைத்து வீடியோக்கள்${allLiveVideos.length ? ` (${allLiveVideos.length})` : ''}`, labelEn: `All Videos${allLiveVideos.length ? ` (${allLiveVideos.length})` : ''}` },
    { id: 'trending', labelTa: 'முக்கிய பதிவுகள்', labelEn: 'Featured & Trending' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
    { id: 'stocks', labelTa: 'பங்குச் சந்தை', labelEn: 'Stock Market' },
    { id: 'ipo', labelTa: 'IPO அலசல்', labelEn: 'IPO Analysis' },
    { id: 'gold-bonds', labelTa: 'தங்கம் & SGB பத்திரங்கள்', labelEn: 'Gold & SGB Bonds' },
    { id: 'tax-saving', labelTa: 'வரி சேமிப்பு திட்டமிடல்', labelEn: 'Tax Planning' },
    { id: 'retirement', labelTa: 'ஓய்வூதியம் (NPS & EPF)', labelEn: 'Retirement & NPS' },
    { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance' },
    { id: 'shorts', labelTa: 'குறுகிய வீடியோக்கள்', labelEn: 'Shorts' }
  ];

  const spotlightVideos = useMemo(() => {
    const list = (allLiveVideos && allLiveVideos.length > 0) ? allLiveVideos : (videosData || []);
    const trending = list.filter(v => v.trending || v.category === 'mutual-funds');
    return (trending.length >= 3 ? trending : list).slice(0, 5);
  }, [allLiveVideos]);

  const railsData = useMemo(() => {
    const list = (allLiveVideos && allLiveVideos.length > 0) ? allLiveVideos : (videosData || []);
    const trendingList = list.filter(v => v.trending || (v.views && v.views > 15000));
    const shortsList = list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts')) || (v.duration && (v.duration.startsWith('0:') || v.duration === 'Short')));
    const mfList = list.filter(v => v.category === 'mutual-funds' || (v.title && (v.title.toLowerCase().includes('mutual') || v.title.toLowerCase().includes('sip'))));
    const stocksList = list.filter(v => v.category === 'stocks' || v.category === 'ipo' || (v.title && (v.title.toLowerCase().includes('stock') || v.title.toLowerCase().includes('ipo'))));
    const taxList = list.filter(v => v.category === 'tax-saving' || v.category === 'retirement' || (v.title && (v.title.toLowerCase().includes('tax') || v.title.toLowerCase().includes('nps'))));
    const pfList = list.filter(v => v.category === 'personal-finance' || v.category === 'gold-bonds' || (v.title && (v.title.toLowerCase().includes('gold') || v.title.toLowerCase().includes('saving'))));

    return {
      masterclasses: trendingList.length >= 2 ? trendingList.slice(0, 12) : list.slice(0, 12),
      shorts: shortsList.length >= 2 ? shortsList.slice(0, 14) : list.slice(2, 14),
      mutualFunds: mfList.length >= 2 ? mfList.slice(0, 12) : list.slice(0, 12),
      stocks: stocksList.length >= 2 ? stocksList.slice(0, 12) : list.slice(3, 15),
      taxRetirement: taxList.length >= 2 ? taxList.slice(0, 12) : list.slice(4, 16),
      personalFinance: pfList.length >= 2 ? pfList.slice(0, 12) : list.slice(5, 17)
    };
  }, [allLiveVideos]);

  const filteredVideos = useMemo(() => {
    let list = [...allLiveVideos];

    if (activeCategory === 'trending') {
      list = list.filter(v => v.trending);
    } else if (activeCategory === 'shorts') {
      list = list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts')));
    } else if (activeCategory !== 'all') {
      list = list.filter(v => v.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(v => {
        const titleT = (v.titleTamil || v.title || "").toLowerCase();
        const titleE = (v.titleEnglish || v.title || "").toLowerCase();
        const descT = (v.descriptionTamil || v.description || "").toLowerCase();
        const descE = (v.descriptionEnglish || v.description || "").toLowerCase();
        const cat = (v.category || "").toLowerCase();
        return titleT.includes(q) || titleE.includes(q) || descT.includes(q) || descE.includes(q) || cat.includes(q);
      });
    }

    if (sortBy === 'views') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else if (sortBy === 'duration') {
      list.sort((a, b) => (b.duration || '').localeCompare(a.duration || ''));
    } else {
      list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    return list;
  }, [allLiveVideos, activeCategory, searchQuery, sortBy]);

  // Seamless auto-load on scroll with generous threshold
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleGridCount(prev => {
          if (prev < filteredVideos.length) {
            return Math.min(prev + 48, filteredVideos.length);
          }
          return prev;
        });
      }
    }, { rootMargin: '600px' });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filteredVideos.length]);

  const handleLoadMore = () => {
    setVisibleGridCount(prev => Math.min(prev + 48, filteredVideos.length));
  };

  const handleLoadAll = () => {
    setVisibleGridCount(filteredVideos.length);
  };

  const isFiltering = activeCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen pb-24 space-y-6 text-slate-900 dark:text-white animate-fadeIn">
      {/* 1. CINEMA SPOTLIGHT HERO */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <CinemaSpotlightHero
          spotlightVideos={spotlightVideos}
          onWatchVideo={(v) => setSelectedVideo(v)}
          language={language}
        />
      </div>

      {/* 2. CATEGORY & SEARCH CONTROLS BAR */}
      <div className="bg-white/95 dark:bg-slate-950/95  border-y border-slate-200 dark:border-slate-800/80 shadow-sm py-3">
        <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categoriesList.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setVisibleGridCount(48);
                  }}
                  className={`btn-magnetic px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 ${isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                    }`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-0.5">
            <div className="relative flex-1">
              <svg className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setVisibleGridCount(48);
                }}
                placeholder={isTamil ? "வீடியோக்களில் தேடுங்கள் (எ.கா: SIP, Nifty, Tax)..." : "Search masterclasses (e.g. SIP, Nifty, Tax)..."}
                className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold hidden sm:inline">{isTamil ? 'வரிசை:' : 'Sort:'}</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="newest">{isTamil ? 'சமீபத்தியவை' : 'Latest Uploads'}</option>
                  <option value="views">{isTamil ? 'அதிக பார்வை' : 'Most Popular'}</option>
                  <option value="oldest">{isTamil ? 'பழையவை' : 'Oldest First'}</option>
                </select>
              </div>

              <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('rails')}
                  className={`btn-magnetic px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'rails' && !isFiltering
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                    }`}
                >
                  {isTamil ? 'தனித்தனி வரிசைகள்' : 'Cinematic Rails'}
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`btn-magnetic px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' || isFiltering
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                    }`}
                >
                  {isTamil ? 'முழு கட்டம்' : 'Full Grid'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: CINEMATIC RAILS OR FULL 882 GRID */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {isFiltering || viewMode === 'grid' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                {isTamil
                  ? `${filteredVideos.length} வீடியோக்கள் கண்டறியப்பட்டன (காண்பிக்கப்படுவது ${Math.min(visibleGridCount, filteredVideos.length)})`
                  : `Showing ${Math.min(visibleGridCount, filteredVideos.length)} of ${filteredVideos.length} masterclasses`}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
              {filteredVideos.slice(0, visibleGridCount).map((video, idx) => (
                <CinemaVideoCard
                  key={`grid-cinema-${video.id || idx}`}
                  video={video}
                  index={idx}
                  onSelect={(v) => setSelectedVideo(v)}
                  language={language}
                  onShowToast={onShowToast}
                />
              ))}
            </div>

            {/* Load More & Infinite Scroll Container */}
            <div ref={sentinelRef} className="pt-8 pb-10 text-center">
              {visibleGridCount < filteredVideos.length ? (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleLoadMore}
                    className="btn-magnetic px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <span>▶</span>
                    <span>
                      {isTamil
                        ? `மேலும் 48 வீடியோக்களைக் காட்டு (${Math.min(visibleGridCount, filteredVideos.length)} / ${filteredVideos.length})`
                        : `Load Next 48 Videos (${Math.min(visibleGridCount, filteredVideos.length)} / ${filteredVideos.length})`}
                    </span>
                  </button>

                  <button
                    onClick={handleLoadAll}
                    className="btn-magnetic px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
                  >
                    <span>{isTamil ? `அனைத்து ${filteredVideos.length} வீடியோக்களையும் ஏற்று` : `Show All ${filteredVideos.length} Videos`}</span>
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-emerald-500">✓</span>
                  <span>
                    {isTamil
                      ? `அனைத்து ${filteredVideos.length} வீடியோக்களும் ஏற்றப்பட்டன`
                      : `All ${filteredVideos.length} masterclasses loaded`}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <CinemaVideoRail
              titleTamil="பிரபலமான வீடியோக்கள் & Masterclasses"
              titleEnglish="Trending & Highly Watched Masterclasses"
              subtitleTamil="அதிக முதலீட்டாளர்களால் பார்க்கப்பட்ட முதன்மையான மியூச்சுவல் ஃபண்ட் மற்றும் பங்குச் சந்தை வழிகாட்டிகள்"
              subtitleEnglish="Top-rated investor masterclasses with over 25,000+ views"
              badgeText="FEATURED"
              videos={railsData.masterclasses}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="குறுகிய வீடியோக்கள் & Quick Takes"
              titleEnglish="Quick Takes & YouTube Shorts"
              subtitleTamil="1 நிமிடத்தில் புரியும் முக்கியமான முதலீட்டு ஆலோசனைகள் மற்றும் ரகசியங்கள்"
              subtitleEnglish="Bite-sized high-impact financial lessons in under 60 seconds"
              badgeText="SHORTS"
              videos={railsData.shorts}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="மியூச்சுவல் ஃபண்ட் & SIP திட்டங்கள்"
              titleEnglish="Mutual Funds & SIP Strategies"
              subtitleTamil="Small Cap, Mid Cap, Flexi Cap மற்றும் Index ஃபண்டுகளின் முழுமையான ஒப்பீடு"
              subtitleEnglish="Comprehensive fund reviews, CAGR calculations, and portfolio allocation"
              badgeText="MUTUAL FUNDS"
              videos={railsData.mutualFunds}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="பங்குச் சந்தை & IPO அலசல்"
              titleEnglish="Stock Market & IPO Breakdowns"
              subtitleTamil="நேரடி பங்கு முதலீடு, தொழில்நுட்ப பகுப்பாய்வு மற்றும் புதிய IPO மதிப்பீடுகள்"
              subtitleEnglish="Direct equity fundamentals, risk management, and live IPO reviews"
              badgeText="STOCKS"
              videos={railsData.stocks}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="வரி சேமிப்பு & ஓய்வூதியத் திட்டமிடல்"
              titleEnglish="Tax Optimization & Retirement Planning"
              subtitleTamil="NPS, EPF, Section 80C வரி சேமிப்பு மற்றும் ஓய்வூதிய நிதி கணக்கீடுகள்"
              subtitleEnglish="NPS, EPF, Section 80C optimization, and retirement corpus calculators"
              badgeText="RETIREMENT"
              videos={railsData.taxRetirement}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="தனிநபர் நிதி & தங்க முதலீடுகள்"
              titleEnglish="Personal Finance & Sovereign Gold"
              subtitleTamil="குடும்ப பட்ஜெட், அவசர கால நிதி மற்றும் தங்க பத்திரங்கள்"
              subtitleEnglish="Budgeting frameworks, emergency reserves, and Sovereign Gold Bonds"
              badgeText="WEALTH"
              videos={railsData.personalFinance}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />
          </div>
        )}
      </div>

      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={allLiveVideos}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(relVideo) => setSelectedVideo(relVideo)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}



export default VideosPage;
export { VideosPage };
