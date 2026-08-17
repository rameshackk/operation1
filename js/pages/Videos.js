import React, { useState, useMemo } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { CinemaSpotlightHero } from '../components/CinemaSpotlightHero.js';
import { VideoFanWall } from '../components/VideoFanWall.js';
import { CinemaVideoRail } from '../components/CinemaVideoRail.js';
import { CinemaVideoCard } from '../components/CinemaVideoCard.js';
import { CinemaTheaterModal } from '../components/CinemaTheaterModal.js';
import { videosData, CHANNEL_URL, CHANNEL_HANDLE } from '../data/videos.js';
import { translateVideo } from '../services/translationService.js';

export function VideosPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleGridCount, setVisibleGridCount] = useState(24);
  const [viewMode, setViewMode] = useState('rails'); // 'rails' or 'grid'

  const categoriesList = [
    { id: 'all', labelTa: 'அனைத்து வீடியோக்கள் (882)', labelEn: 'All Videos (882)' },
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

  // Top 5 spotlight masterclasses for the Hero stage
  const spotlightVideos = useMemo(() => {
    return videosData
      .filter(v => v.trending || v.category === 'mutual-funds')
      .slice(0, 5)
      .map(v => translateVideo(v, language));
  }, [language]);

  // Curated tracks for horizontal cinema rails
  const railsData = useMemo(() => {
    const translated = videosData.map(v => translateVideo(v, language));
    return {
      masterclasses: translated.filter(v => v.trending || v.views > 25000).slice(0, 10),
      shorts: translated.filter(v => v.isShort || (v.tags && v.tags.includes('shorts'))).slice(0, 12),
      mutualFunds: translated.filter(v => v.category === 'mutual-funds').slice(0, 10),
      stocks: translated.filter(v => v.category === 'stocks' || v.category === 'ipo').slice(0, 10),
      taxRetirement: translated.filter(v => v.category === 'tax-saving' || v.category === 'retirement').slice(0, 10),
      personalFinance: translated.filter(v => v.category === 'personal-finance' || v.category === 'gold-bonds').slice(0, 10)
    };
  }, [language]);

  // Filtered dataset for searchable grid view
  const filteredVideos = useMemo(() => {
    let list = [...videosData];

    if (activeCategory === 'trending') {
      list = list.filter(v => v.trending);
    } else if (activeCategory === 'shorts') {
      list = list.filter(v => v.isShort);
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

    return list.map(v => translateVideo(v, language));
  }, [activeCategory, searchQuery, sortBy, language]);

  const isFiltering = activeCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen pb-24 space-y-10 animate-fadeIn text-slate-900 dark:text-white">
      
      {/* 1. LUXURY CINEMA SPOTLIGHT HERO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <CinemaSpotlightHero
          spotlightVideos={spotlightVideos}
          onWatchVideo={(video) => setSelectedVideo(video)}
          language={language}
        />
      </div>

      {/* 2. LIVING FAN ARC WALL (CONTINUOUS ANIMATING 9:16 CARDS SHOWCASE) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VideoFanWall
          videos={videosData}
          language={language}
          onNavigate={onNavigate}
          titleTamil="பிரத்யேக நேரலை வீடியோ கேலரி"
          titleEnglish="Living Video Arc Showcase"
          subtitleTamil="பட்ஜெட் பத்மநாபனின் பிரத்யேக நிதி, மியூச்சுவல் ஃபண்ட் மற்றும் முதலீட்டு வீடியோ அலசல்கள்"
          subtitleEnglish="Continuous desynchronized animated fan arc with multi-frame previews and instant expandable inspection"
        />
      </div>

      {/* 3. STICKY CATEGORY & SEARCH CONTROLS BAR */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-y border-slate-200 dark:border-slate-800/80 shadow-md py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categoriesList.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setVisibleGridCount(24);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Search & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1">
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isTamil ? "இந்த 882 வீடியோக்களில் தேடுங்கள் (எ.கா: SIP, Nifty, Tax)..." : "Search 882 masterclasses (e.g. SIP, Nifty, Tax)..."}
                className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-200"
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
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="newest">{isTamil ? 'சமீபத்தியவை' : 'Latest Uploads'}</option>
                  <option value="views">{isTamil ? 'அதிக பார்வை' : 'Most Popular'}</option>
                  <option value="oldest">{isTamil ? 'பழையவை' : 'Oldest First'}</option>
                </select>
              </div>

              <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('rails')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'rails' && !isFiltering
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  {isTamil ? 'தனித்தனி வரிசைகள்' : 'Cinematic Rails'}
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'grid' || isFiltering
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

      {/* 4. MAIN CONTENT: CURATED CINEMATIC RAILS OR SEARCHABLE GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* If user is filtering or explicitly chose grid mode */}
        {(isFiltering || viewMode === 'grid') ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isTamil
                  ? `மொத்தம் ${filteredVideos.length} வீடியோக்கள் கண்டறியப்பட்டன`
                  : `Showing ${filteredVideos.length} matching masterclasses`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
              {filteredVideos.slice(0, visibleGridCount).map(video => (
                <CinemaVideoCard
                  key={`grid-${video.id}`}
                  video={video}
                  aspectRatio={video.isShort ? '9/16' : '16/9'}
                  onSelect={(v) => setSelectedVideo(v)}
                  language={language}
                  onShowToast={onShowToast}
                />
              ))}
            </div>

            {visibleGridCount < filteredVideos.length && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setVisibleGridCount(prev => Math.min(prev + 24, filteredVideos.length))}
                  className="px-8 py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm border border-slate-700 shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isTamil ? 'மேலும் வீடியோக்களைக் காட்டு' : 'Load More Masterclasses'} ({filteredVideos.length - visibleGridCount} {isTamil ? 'மீதமுள்ளன' : 'remaining'})
                </button>
              </div>
            )}
          </section>
        ) : (
          /* CURATED THEMATIC CINEMA RAILS (DEFAULT APPLE TV / NETFLIX EXPERIENCE) */
          <div className="space-y-12">
            
            {/* Rail 1: Featured Wealth Masterclasses */}
            <CinemaVideoRail
              titleTamil="பிரதான முதலீட்டு வழிகாட்டிகள்"
              titleEnglish="Featured Wealth Masterclasses"
              subtitleTamil="பட்ஜெட் பத்மநாபன் CFP அவர்களின் தேர்ந்தெடுக்கப்பட்ட பிரதான வழிகாட்டிகள்"
              subtitleEnglish="Handpicked high-impact wealth-building masterclasses and investment blueprints"
              badgeText="POPULAR"
              videos={railsData.masterclasses}
              aspectRatio="16/9"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            {/* Rail 2: Quick Takes & Shorts (Vertical 9:16 Cards) */}
            <CinemaVideoRail
              titleTamil="குறுகிய நேர நிதி ஆலோசனைகள்"
              titleEnglish="Quick Takes & Shorts"
              subtitleTamil="1 நிமிடத்தில் தெரிந்து கொள்ள வேண்டிய முக்கிய நிதி உண்மைகள்"
              subtitleEnglish="Bite-sized high-yield financial wisdom and quick money rules"
              badgeText="SHORTS"
              videos={railsData.shorts}
              aspectRatio="9/16"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            {/* Rail 3: Mutual Funds & SIP Masterclasses */}
            <CinemaVideoRail
              titleTamil="மியூச்சுவல் ஃபண்ட் & SIP திட்டங்கள்"
              titleEnglish="Mutual Funds & Systematic Wealth"
              subtitleTamil="நீண்ட கால கூட்டு வட்டியின் மூலம் செல்வம் சேர்க்கும் வழிகள்"
              subtitleEnglish="Comprehensive fund analysis, category reviews, and compounding strategies"
              badgeText="SIP"
              videos={railsData.mutualFunds}
              aspectRatio="16/9"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            {/* Rail 4: Stock Market & IPO Insights */}
            <CinemaVideoRail
              titleTamil="பங்குச் சந்தை & IPO அலசல்"
              titleEnglish="Stock Market & IPO Breakdowns"
              subtitleTamil="நிறுவனங்களின் நிதி நிலை மற்றும் சந்தை வாய்ப்புகள்"
              subtitleEnglish="Deep-dive fundamentals, valuation checks, and smart equity strategies"
              badgeText="STOCKS"
              videos={railsData.stocks}
              aspectRatio="16/9"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            {/* Rail 5: Tax Planning & Retirement Strategy */}
            <CinemaVideoRail
              titleTamil="வரி சேமிப்பு & ஓய்வூதிய திட்டம்"
              titleEnglish="Tax Planning & Retirement Blueprint"
              subtitleTamil="சரியான வரி திட்டமிடல் மற்றும் அமைதியான ஓய்வூதிய வாழ்க்கை"
              subtitleEnglish="NPS, EPF, Section 80C optimization, and retirement corpus calculators"
              badgeText="RETIREMENT"
              videos={railsData.taxRetirement}
              aspectRatio="16/9"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            {/* Rail 6: Personal Finance & Gold */}
            <CinemaVideoRail
              titleTamil="தனிநபர் நிதி & தங்க முதலீடுகள்"
              titleEnglish="Personal Finance & Sovereign Gold"
              subtitleTamil="குடும்ப பட்ஜெட், அவசர கால நிதி மற்றும் தங்க பத்திரங்கள்"
              subtitleEnglish="Budgeting frameworks, emergency reserves, and Sovereign Gold Bonds"
              badgeText="WEALTH"
              videos={railsData.personalFinance}
              aspectRatio="16/9"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

          </div>
        )}

      </div>

      {/* 5. LUXURY FULL-SCREEN CINEMA THEATER MODAL */}
      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={videosData}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(relVideo) => setSelectedVideo(relVideo)}
          language={language}
          onShowToast={onShowToast}
        />
      )}

    </div>
  );
}
