import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { newsData } from '../data/news.js';

export function HeroSection({ news = newsData, onNavigate }) {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isTamil = language === 'ta';

  const featuredStories = news && news.length > 0 ? news.filter(n => n.isFeatured) : newsData;
  const trendingStories = newsData.slice(0, 5);

  const activeFeatured = featuredStories.length > 0 ? featuredStories : newsData;

  const breakingNewsHeadlines = isTamil ? [
    { title: "ஆர்பிஐ ரெப்போ வட்டி விகிதத்தில் மாற்றமில்லை — நிலையான சேமிப்பு & ஹோம் லோன் முதலீட்டாளர்களுக்கு நல்ல செய்தி!", slug: "rbi-monetary-policy-repo-rate-fixed-deposits" },
    { title: "நிஃப்டி 50 புதிய உச்சமான 24,850 புள்ளிகளை எட்டியது — மியூச்சுவல் ஃபண்ட் எஸ்ஐபி முதலீடு அதிகரிப்பு!", slug: "nifty-record-high-market-rally-sip-growth" },
    { title: "செபி புதிய முதலீட்டாளர் பாதுகாப்பு வழிகாட்டு நெறிமுறைகள் வெளியீடு!", slug: "sebi-new-guidelines-retail-investors" },
    { title: "தங்கத்தின் விலை புதிய உச்சம் — மியூச்சுவல் ஃபண்ட் கோல்ட் இடிஎஃப் முதலீடு செய்வது எப்படி?", slug: "gold-rate-all-time-high-investment-strategy" }
  ] : [
    { title: "RBI keeps Repo Rate steady at 6.50% — Fixed Deposits & Home Loan borrowers benefit from steady rates!", slug: "rbi-monetary-policy-repo-rate-fixed-deposits" },
    { title: "NIFTY 50 touches record high of 24,850 — SIP monthly inflows cross record ₹21,000 Crores!", slug: "nifty-record-high-market-rally-sip-growth" },
    { title: "SEBI introduces enhanced transparency framework for Mutual Fund Index schemes!", slug: "sebi-new-guidelines-retail-investors" },
    { title: "Gold prices breach key resistance — How to balance your portfolio with Sovereign Gold Bonds & ETFs!", slug: "gold-rate-all-time-high-investment-strategy" }
  ];

  useEffect(() => {
    if (isPaused || activeFeatured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeFeatured.length);
    }, 5000); // Auto change every 5 seconds
    return () => clearInterval(interval);
  }, [isPaused, activeFeatured.length]);

  const activeStory = activeFeatured[currentIndex] || activeFeatured[0];

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeFeatured.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeFeatured.length) % activeFeatured.length);
  };

  const getHeadline = (item) => {
    return language === 'ta' ? item.titleTamil : (item.titleEnglish || item.titleTamil);
  };

  const getSummary = (item) => {
    return language === 'ta' ? item.summaryTamil : (item.summaryEnglish || item.summaryTamil);
  };

  const renderBreakingTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-8 shrink-0 pr-8">
      {breakingNewsHeadlines.map((item, idx) => (
        <span
          key={`${keyPrefix}-bn-${idx}`}
          onClick={() => onNavigate && onNavigate(`#/news/${item.slug}`)}
          className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-2.5 text-xs font-semibold text-slate-200 whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span>{item.title}</span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      {/* 1. TOP BREAKING NEWS ANIMATION TICKER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-950 border border-red-500/40 p-2 sm:p-2.5 shadow-xl select-none flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0 bg-red-600 text-white font-black px-3 py-1 rounded-xl text-[10px] sm:text-xs uppercase tracking-wider shadow-lg z-10 breaking-badge-pulse">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>{isTamil ? 'பிரேக்கிங் நியூஸ்' : 'BREAKING NEWS'}</span>
        </div>

        <div className="breaking-ticker-wrapper overflow-hidden relative w-full flex items-center">
          <div className="animate-breaking-ticker flex items-center whitespace-nowrap">
            {renderBreakingTrack('btrack-1')}
            {renderBreakingTrack('btrack-2')}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 shrink-0 text-[10px] font-mono text-red-400 font-bold bg-red-950/80 px-2 py-0.5 rounded-lg border border-red-500/30">
          <span>● LIVE</span>
        </div>
      </div>

      {/* 2. Top Header Label */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <h2 className="text-xs font-black tracking-widest uppercase text-amber-600 dark:text-amber-400 font-serif">
            {t('featuredNews') || 'சிறப்புச் செய்திகள் & டிரெண்டிங்'}
          </h2>
        </div>
        <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-2 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>LIVE FINANCIAL COVERAGE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN (7 COLS): LARGE FEATURED NEWS SLIDER */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => onNavigate && onNavigate(`#/news/${activeStory.slug}`)}
          className="lg:col-span-7 group relative rounded-3xl overflow-hidden bg-slate-950 aspect-[16/9] lg:aspect-auto lg:h-[420px] cursor-pointer shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-end p-5 sm:p-7 card-hover-glow select-none"
        >
          {/* Background Images with Fade Transition */}
          {activeFeatured.map((story, index) => (
            <div
              key={story.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={story.thumbnail}
                alt={getHeadline(story)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>
          ))}

          {/* Previous / Next Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-amber-600 text-white flex items-center justify-center backdrop-blur-sm transition-all border border-white/10 opacity-80 hover:opacity-100 shadow-lg"
          >
            ❮
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-amber-600 text-white flex items-center justify-center backdrop-blur-sm transition-all border border-white/10 opacity-80 hover:opacity-100 shadow-lg"
          >
            ❯
          </button>

          {/* Slide Text Content Overlay */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-500 text-slate-950 shadow">
                {(activeStory.category || 'FINANCE').replace('-', ' ')}
              </span>
              <span className="text-[10px] font-mono text-slate-200 font-bold bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-white/10">
                📅 {new Date(activeStory.publishedAt).toLocaleDateString()}
              </span>
              {isPaused && (
                <span className="text-[9px] font-bold text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
                  ⏸ Paused
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-snug font-serif group-hover:text-amber-400 transition-colors drop-shadow-md line-clamp-2">
              {getHeadline(activeStory)}
            </h1>

            {activeStory.titleEnglish && language === 'ta' && (
              <p className="text-xs text-amber-300/90 font-medium line-clamp-1">
                {activeStory.titleEnglish}
              </p>
            )}

            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 font-sans leading-relaxed">
              {getSummary(activeStory)}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <button className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-lg">
                <span>{t('readArticle')}</span>
                <span>→</span>
              </button>

              {/* Navigation Dots */}
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {activeFeatured.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-7 bg-amber-500'
                        : 'bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 COLS): TRENDING ARTICLES PANEL */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                {t('trendingArticlesTitle') || 'டிரெண்டிங் செய்திகள்'}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              🔥 Trending
            </span>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-around">
            {trendingStories.slice(0, 5).map((article, idx) => {
              const rankStr = article.rank || `0${idx + 1}`;
              const title = getHeadline(article);
              return (
                <div
                  key={article.id}
                  onClick={() => onNavigate && onNavigate(`#/news/${article.slug}`)}
                  className="group flex items-start gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50"
                >
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-serif w-7 shrink-0 text-center leading-none mt-1">
                    {rankStr}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                        {article.category.replace('-', ' ')}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        • {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif leading-snug">
                      {title}
                    </h4>
                  </div>

                  {article.thumbnail && (
                    <img
                      src={article.thumbnail}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
