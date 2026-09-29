import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { searchAllContent } from '../services/api.js';
import { useDebounce } from '../utils/formatters.js';

function CommandPalette({ isOpen, onClose, onNavigate }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [resultsObj, setResultsObj] = useState({ all: [], articles: [], videos: [], news: [], publishers: [] });
  const [filterType, setFilterType] = useState('all'); // 'all' | 'article' | 'video' | 'news' | 'publisher'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 350);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResultsObj({ all: [], articles: [], videos: [], news: [], publishers: [] });
      setFilterType('all');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResultsObj({ all: [], articles: [], videos: [], news: [], publishers: [] });
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    let isStale = false;
    searchAllContent(debouncedQuery, language).then(data => {
      if (isStale) return;
      setResultsObj(data || { all: [], articles: [], videos: [], news: [], publishers: [] });
      setIsSearching(false);
      setSelectedIndex(0);
    }).catch(() => {
      if (isStale) return;
      setResultsObj({ all: [], articles: [], videos: [], news: [], publishers: [] });
      setIsSearching(false);
    });
    return () => { isStale = true; };
  }, [debouncedQuery, language]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(window.location.hash || '#/');
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose, onNavigate]);

  const activeResults = useMemo(() => {
    if (filterType === 'article') return resultsObj.articles || [];
    if (filterType === 'video') return resultsObj.videos || [];
    if (filterType === 'news') return resultsObj.news || [];
    if (filterType === 'publisher') return resultsObj.publishers || [];
    return resultsObj.all || [];
  }, [resultsObj, filterType]);

  const handleSelectItem = (item) => {
    if (!item) return;
    if (item.sourceUrl) {
      window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
    } else if (item.contentType === 'publisher') {
      onNavigate(`#/professionals/${item.id || item.slug}`);
    } else if (item.contentType === 'article') {
      onNavigate(`#/articles/${item.slug || item.id}`);
    } else if (item.contentType === 'news') {
      onNavigate(`#/news/${item.slug || item.id}`);
    } else {
      onNavigate(`#/videos/${item.id}`);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < activeResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : activeResults.length - 1));
    } else if (e.key === 'Enter' && activeResults[selectedIndex]) {
      e.preventDefault();
      handleSelectItem(activeResults[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  const popularTags = ["@budgetpadmanaban_", "SIP", "NIFTY 50", "Mutual Fund", "Tax Saving", "NPS", "SGB", "IPO"];
  const totalCount = resultsObj.all.length;
  const articlesCount = resultsObj.articles.length;
  const videosCount = resultsObj.videos.length;
  const newsCount = resultsObj.news.length;
  const publishersCount = resultsObj.publishers.length;

  const isTa = language === 'ta';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] modal-card-unified"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Universal Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0">
            {isSearching ? (
              <svg className="w-4 h-4 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isTa ? "செய்திகள், கட்டுரைகள், வீடியோக்கள், நிபுணர்களில் தேடுங்கள்..." : "Search articles, videos, news, publishers..."}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base font-semibold"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 font-bold transition-colors"
            >
              {isTa ? 'அழி' : 'Clear'}
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Category Tabs with live counts */}
        {totalCount > 0 && (
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setFilterType('all'); setSelectedIndex(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${filterType === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                }`}
            >
              <span>{isTa ? 'அனைத்தும்' : 'All'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/15 text-xs">{totalCount}</span>
            </button>

            {articlesCount > 0 && (
              <button
                onClick={() => { setFilterType('article'); setSelectedIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${filterType === 'article'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                  }`}
              >
                <span>{isTa ? 'கட்டுரைகள்' : 'Articles'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-xs">{articlesCount}</span>
              </button>
            )}

            {videosCount > 0 && (
              <button
                onClick={() => { setFilterType('video'); setSelectedIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${filterType === 'video'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                  }`}
              >
                <span>{isTa ? 'வீடியோக்கள்' : 'Videos'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-xs">{videosCount}</span>
              </button>
            )}

            {newsCount > 0 && (
              <button
                onClick={() => { setFilterType('news'); setSelectedIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${filterType === 'news'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                  }`}
              >
                <span>{isTa ? 'செய்திகள்' : 'News'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-xs">{newsCount}</span>
              </button>
            )}

            {publishersCount > 0 && (
              <button
                onClick={() => { setFilterType('publisher'); setSelectedIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${filterType === 'publisher'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                  }`}
              >
                <span>{isTa ? 'நிபுணர்கள்' : 'Publishers'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-xs">{publishersCount}</span>
              </button>
            )}
          </div>
        )}

        {/* Results Stream */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {/* Loading Indicator */}
          {isSearching && (
            <div className="py-10 text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>{isTa ? 'தகவல்கள் தேடப்படுகின்றன...' : 'Searching all articles, videos, news & publishers...'}</span>
              </div>
            </div>
          )}

          {/* No Results Fallback */}
          {!isSearching && query.trim() && activeResults.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm font-medium space-y-2">
              <div className="text-3xl">🔍</div>
              <p>{isTa ? `"${query}" தொடர்பாக முடிவுகள் எதுவும் கிடைக்கவில்லை` : `No matching contents found for "${query}"`}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{isTa ? 'வேறு முக்கிய வார்த்தைகளைப் பயன்படுத்தி தேடவும்.' : 'Try searching for mutual funds, SIP, NIFTY 50, or advisor name.'}</p>
            </div>
          )}

          {/* Trending Searches Tags */}
          {!query.trim() && (
            <div className="py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                {t('trendingSearches')}
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(tag)}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered & Ranked Result Cards */}
          {!isSearching && activeResults.length > 0 && (
            <div className="space-y-2">
              {activeResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const isPub = item.contentType === 'publisher';
                const isArticle = item.contentType === 'article';
                const isNews = item.contentType === 'news';
                const isVideo = item.contentType === 'video';

                return (
                  <div
                    key={`${item.contentType}-${item.id || item.slug}-${idx}`}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all ${isSelected
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-200 shadow-sm'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                      }`}
                  >
                    {/* Visual Media / Avatar */}
                    {isPub ? (
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center">
                        <img src={item.avatar || item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="relative w-20 h-13 sm:w-24 sm:h-14 shrink-0 rounded-xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                        {isVideo && item.duration && (
                          <span className="absolute bottom-1 right-1 bg-black/85 text-white text-xs font-black px-1.5 py-0.2 rounded">
                            {item.duration}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Result Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-xs font-black uppercase px-2 py-0.5 rounded-full ${isPub
                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                              : isArticle
                                ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                                : isNews
                                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-red-500/20 text-red-700 dark:text-red-300'
                            }`}
                        >
                          {isPub ? (isTa ? 'நிபுணர்' : 'PUBLISHER') : isArticle ? (isTa ? 'கட்டுரை' : 'ARTICLE') : isNews ? (isTa ? 'செய்தி' : 'NEWS') : (isTa ? 'வீடியோ' : 'VIDEO')}
                        </span>

                        {item.arnNumber && (
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            {item.arnNumber}
                          </span>
                        )}

                        {item.category && !isPub && (
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                            {(item.category || '').replace('-', ' ')}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
                        {item.title || item.name}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {isPub ? item.designation || item.summary : item.summary || item.description || ''}
                      </p>
                    </div>

                    {/* Navigation Arrow */}
                    <div className="shrink-0 text-slate-600 dark:text-slate-400 group-hover:text-amber-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



export default CommandPalette;
export { CommandPalette };
