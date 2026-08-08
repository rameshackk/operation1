import React, { useState, useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { searchVideos } from '../services/youtubeService.js';
import { useDebounce } from '../hooks/useDebounce.js';

export function CommandPalette({ isOpen, onClose, onNavigate }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 250);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Execute debounced search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchVideos(debouncedQuery, language).then(data => {
      setResults(data);
      setIsSearching(false);
      setSelectedIndex(0);
    });
  }, [debouncedQuery, language]);

  // Listen for global Cmd+K shortcut
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

  // Keyboard navigation within modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      onNavigate(`#/videos/${results[selectedIndex].id}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  const popularTags = ["SIP", "NIFTY 50", "Mutual Fund", "Large Cap", "Tax Saving", "Budget Padmanaban"];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base sm:text-lg font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          
          {isSearching && (
            <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
              {t('searchPlaceholder')}...
            </div>
          )}

          {!isSearching && query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              {t('noResults')} "{query}"
            </div>
          )}

          {!query.trim() && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {t('trendingSearches')}
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500/10 hover:text-amber-500 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate(`#/videos/${item.id}`);
                    onClose();
                  }}
                  className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                    idx === selectedIndex
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-16 h-10 object-cover rounded-lg shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
