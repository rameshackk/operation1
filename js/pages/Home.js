import React, { useState, useMemo } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { HeroSection } from '../components/HeroSection.js';
import { CinemaVideoCard } from '../components/CinemaVideoCard.js';
import { CinemaTheaterModal } from '../components/CinemaTheaterModal.js';
import { SipCalculator } from '../components/SipCalculator.js';
import { TrendingArticlesSection } from '../components/TrendingArticlesSection.js';
import { SignInCtaBanner } from '../components/SignInCtaBanner.js';
import { newsData } from '../data/news.js';
import { videosData } from '../data/videos.js';
import { translateNewsArticle, translateVideo } from '../services/translationService.js';

export function HomeCinemaShowcase({ onNavigate, onShowToast, language = 'ta' }) {
  const isTamil = language === 'ta';
  const [activeCategory, setActiveCategory] = useState('featured');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const categories = [
    { id: 'featured', labelTa: 'முக்கிய பதிவுகள்', labelEn: 'Featured & Trending' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
    { id: 'stocks', labelTa: 'பங்குச் சந்தை & IPO', labelEn: 'Stocks & IPO' },
    { id: 'tax-saving', labelTa: 'வரி சேமிப்பு & ஓய்வூதியம்', labelEn: 'Tax & Retirement' },
    { id: 'shorts', labelTa: 'குறுகிய வீடியோக்கள் (Shorts)', labelEn: 'Quick Takes (Shorts)' }
  ];

  const showcaseVideos = useMemo(() => {
    let list = [...videosData];
    if (activeCategory === 'featured') {
      list = list.filter(v => v.trending || v.views > 20000).slice(0, 10);
    } else if (activeCategory === 'shorts') {
      list = list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts'))).slice(0, 10);
    } else if (activeCategory === 'mutual-funds') {
      list = list.filter(v => v.category === 'mutual-funds').slice(0, 10);
    } else if (activeCategory === 'stocks') {
      list = list.filter(v => v.category === 'stocks' || v.category === 'ipo').slice(0, 10);
    } else if (activeCategory === 'tax-saving') {
      list = list.filter(v => v.category === 'tax-saving' || v.category === 'retirement').slice(0, 10);
    }
    return list.map(v => translateVideo(v, language));
  }, [activeCategory, language]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 select-none space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              CINEMA VIDEO SUITE
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
            {isTamil ? 'பிரத்யேக வீடியோ அலசல் மற்றும் வழிகாட்டி' : 'Cinema Video Masterclasses'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isTamil
              ? 'பட்ஜெட் பத்மநாபன் CFP® வழங்கும் 3D இன்டராக்டிவ் மியூச்சுவல் ஃபண்ட் & பங்குச் சந்தை ஆய்வுகள்'
              : 'Interactive 3D masterclasses with real-time frame scrubbing, certified by Padmanaban B. CFP®'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate && onNavigate('#/videos')}
            className="btn-magnetic px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-600 dark:hover:bg-amber-500 text-white dark:hover:text-slate-950 text-xs font-black transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>{isTamil ? 'அனைத்து 882 வீடியோக்கள்' : 'Browse All 882 Videos'}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`btn-magnetic px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {isTamil ? cat.labelTa : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Compact Responsive Grid: 2 cols mobile, 3 sm, 4 md, 5 lg, 6 xl */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {showcaseVideos.map((video, idx) => (
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

      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={videosData}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(rel) => setSelectedVideo(rel)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </section>
  );
}

export function Home({ onNavigate, onShowToast }) {
  const { t, language } = useLanguage();
  const translatedNews = newsData.map(item => translateNewsArticle(item, language));

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. HERO SECTION: NEWS TICKER & LATEST ARTICLES */}
      <HeroSection news={translatedNews} onNavigate={onNavigate} />

      {/* 2. COMPACT CINEMA VIDEO CARDS SHOWCASE */}
      <HomeCinemaShowcase
        onNavigate={onNavigate}
        onShowToast={onShowToast}
        language={language}
      />

      {/* 3. TRENDING ARTICLES SECTION */}
      <TrendingArticlesSection onNavigate={onNavigate} />

      {/* 4. SIP & WEALTH COMPOUNDING CALCULATOR */}
      <SipCalculator />

      {/* 5. COMMUNITY SIGN IN CTA */}
      <SignInCtaBanner onNavigate={onNavigate} />
    </div>
  );
}
