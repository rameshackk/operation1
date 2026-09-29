import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { newsData } from '../data/translations.js';
import { translateNewsArticle } from '../services/api.js';
import NewsCard from './NewsCard.jsx';
import AggregatedNewsCard from './AggregatedNewsCard.jsx';

function NewsPage({ onNavigate }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // State for live aggregated investment news
  const [liveNews, setLiveNews] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveError, setLiveError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', labelTa: 'அனைத்து செய்திகள்', labelEn: 'All News' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட்', labelEn: 'Mutual Funds' },
    { id: 'markets', labelTa: 'பங்குச் சந்தை', labelEn: 'Markets & Stocks' },
    { id: 'regulatory', labelTa: 'ஒழுங்குமுறை & SEBI', labelEn: 'Regulatory & SEBI' },
    { id: 'general', labelTa: 'பொது நிதி & பொருளாதாரம்', labelEn: 'General & Economy' }
  ];

  const fetchLiveNews = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setIsLoadingLive(true);
    setLiveError(null);

    try {
      const categoryParam = activeCategory === 'all' ? '' : `&category=${activeCategory}`;
      const res = await fetch(`/api/news?limit=40${categoryParam}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLiveNews(data.data || []);
    } catch (err) {
      console.error('Error fetching live news:', err);
      setLiveError(err.message || 'Failed to load news');
    } finally {
      setIsLoadingLive(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
  }, [activeCategory]);

  // Filter live news based on in-page search input
  const filteredLiveNews = useMemo(() => {
    if (!searchQuery.trim()) return liveNews;
    const q = searchQuery.toLowerCase().trim();
    return liveNews.filter(item => {
      const titleEn = (item.titleEnglish || '').toLowerCase();
      const titleTa = (item.titleTamil || '').toLowerCase();
      const sumEn = (item.summaryEnglish || '').toLowerCase();
      const sumTa = (item.summaryTamil || '').toLowerCase();
      const src = (item.sourceName || '').toLowerCase();
      return titleEn.includes(q) || titleTa.includes(q) || sumEn.includes(q) || sumTa.includes(q) || src.includes(q);
    });
  }, [liveNews, searchQuery]);

  const editorialArticles = (newsData || []).map(item => translateNewsArticle(item, language));

  return (
    <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Filter Bar & In-Page Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 shrink-0 ${isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md scale-105'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
                    }`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <svg className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isTamil ? "செய்திகளில் தேடுங்கள்..." : "Filter news by keyword..."}
              className="w-full pl-9 pr-8 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-amber-500 shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Aggregated News Grid */}
      <section className="space-y-6">
        {isLoadingLive ? (
          <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">{isTamil ? 'சமீபத்திய நிதிச் செய்திகள் ஏற்றப்படுகின்றன...' : 'Loading latest external investment news...'}</p>
          </div>
        ) : liveError ? (
          <div className="p-8 text-center bg-red-500/10 rounded-3xl border border-red-500/30 text-red-600 text-xs font-bold max-w-lg mx-auto">
            {liveError}
          </div>
        ) : filteredLiveNews.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="text-4xl">📰</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isTamil ? 'செய்திகள் எதுவும் கிடைக்கவில்லை' : 'No News Articles Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isTamil ? 'தேடல் வார்த்தையை மாற்றவும் அல்லது பிற பிரிவுகளைத் தேர்ந்தெடுக்கவும்.' : 'Try adjusting your search criteria or switch category filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredLiveNews.map(item => (
              <AggregatedNewsCard
                key={item.id || item.sourceUrl}
                item={item}
                language={language}
              />
            ))}
          </div>
        )}

        {/* Mandatory Editorial & External Attribution Disclaimer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-slate-900 border border-amber-500/25 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-base shrink-0 mt-0.5">ℹ️</span>
          <div className="space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {isTamil ? 'அறிவிப்பு & மூல உரிமை:' : 'Attribution & Content Disclaimer:'}
            </p>
            <p className="leading-relaxed">
              {isTamil
                ? 'தகவல் நோக்கங்களுக்காக மட்டுமே வெளிப்புற மூலங்களிலிருந்து தொகுக்கப்பட்ட செய்திகள். முதலீட்டு ஆலோசனை அல்ல. அனைத்து செய்திகளும் அசல் வெளியீட்டாளரின் தளத்திற்கு நேரடியாக இணைக்கப்பட்டுள்ளன.'
                : 'News curated from external financial sources for informational purposes only. Not investment advice. Every article card provides direct source attribution and links out to the publisher’s own original site.'}
            </p>
          </div>
        </div>
      </section>

      {/* Curated Editorial Insights & In-Depth Breakdowns Section */}
      {editorialArticles && editorialArticles.length > 0 && (
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                {isTamil ? 'பிரத்யேக தலையங்கம்' : 'ORIGINAL EDITORIAL'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white">
                {isTamil ? 'முதலீட்டுத் திசை சிறப்புக் கட்டுரைகள்' : 'Muthaleetu Thisai Special Analyses'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {editorialArticles.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                onSelect={() => onNavigate && onNavigate(`#/news/${article.slug}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


export default NewsPage;
export { NewsPage };
