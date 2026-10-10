import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useVideos } from '../services/videos.js';
import YouTubeVideoCard from '../components/youtube/YouTubeVideoCard.jsx';
import YouTubePlayerModal from '../components/youtube/YouTubePlayerModal.jsx';

function CategoryPage({ categoryId, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(24);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const sentinelRef = useRef(null);

  // Live category feed from the database
  const { videos: categoryVideos = [] } = useVideos(categoryId, sortBy, 100, language);

  const categoryTitles = {
    'mutual-funds': isTamil ? 'மியூச்சுவல் ஃபண்ட் & SIP' : 'Mutual Funds & SIP',
    'stocks': isTamil ? 'பங்குச் சந்தை & முதலீடு' : 'Stock Market & Equity',
    'personal-finance': isTamil ? 'தனிநபர் நிதி & சேமிப்பு' : 'Personal Finance & Wealth',
    'tax-saving': isTamil ? 'வரி சேமிப்பு & ஓய்வூதியம்' : 'Tax Planning & Retirement',
    'education': isTamil ? 'நிதி கல்வி' : 'Financial Education'
  };

  const title = categoryTitles[categoryId] || categoryId;

  // Filter & Sort
  const filtered = useMemo(() => {
    let list = [...categoryVideos];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(v => {
        const titleT = (v.titleTamil || v.title || "").toLowerCase();
        const titleE = (v.titleEnglish || v.title || "").toLowerCase();
        const descT = (v.descriptionTamil || v.description || "").toLowerCase();
        const descE = (v.descriptionEnglish || v.description || "").toLowerCase();
        return titleT.includes(q) || titleE.includes(q) || descT.includes(q) || descE.includes(q);
      });
    }

    if (sortBy === 'views') {
      list.sort((a, b) => (b.views || b.view_count || 0) - (a.views || a.view_count || 0));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.publishedAt || a.published_at) - new Date(b.publishedAt || b.published_at));
    } else {
      list.sort((a, b) => new Date(b.publishedAt || b.published_at) - new Date(a.publishedAt || a.published_at));
    }

    return list;
  }, [categoryVideos, searchQuery, sortBy]);

  // Auto-load next videos on scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => {
          if (prev < filtered.length) {
            return Math.min(prev + 24, filtered.length);
          }
          return prev;
        });
      }
    }, { rootMargin: '350px' });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount]);

  const displayedVideos = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  return (
    <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(24);
            }}
            placeholder={isTamil ? `${title} வீடியோக்களில் தேடுங்கள்...` : `Search within ${title}...`}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-200"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 font-bold">{isTamil ? 'வரிசை:' : 'Sort:'}</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setVisibleCount(24);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:border-blue-500"
          >
            <option value="newest">{isTamil ? 'சமீபத்தியவை' : 'Latest Uploads'}</option>
            <option value="views">{isTamil ? 'அதிக பார்வை' : 'Most Popular'}</option>
            <option value="oldest">{isTamil ? 'பழையவை' : 'Oldest First'}</option>
          </select>
        </div>
      </div>

      {/* Paginated Video Grid: 4 cols (>=1280px), 3 cols (>=1024px), 2 cols (>=640px), 1 col below */}
      {displayedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
          {displayedVideos.map((video) => (
            <YouTubeVideoCard
              key={video.id || video.video_id}
              video={video}
              onSelect={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm font-bold">
            {isTamil ? 'பொருத்தமான வீடியோக்கள் எதுவும் கிடைக்கவில்லை.' : 'No matching videos found.'}
          </p>
        </div>
      )}

      {/* Infinite Scroll Sentinel & Status Counter */}
      <div ref={sentinelRef} className="pt-6 pb-4 text-center">
        {visibleCount < filtered.length ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>
              {isTamil
                ? `${Math.min(visibleCount, filtered.length)} / ${filtered.length} வீடியோக்கள்`
                : `Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length}`}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
            <span>
              {isTamil
                ? `அனைத்து ${filtered.length} வீடியோக்களும் ஏற்றப்பட்டுவிட்டன`
                : `All ${filtered.length} videos loaded`}
            </span>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <YouTubePlayerModal
          video={selectedVideo}
          allVideos={categoryVideos}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(rel) => setSelectedVideo(rel)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}


export default CategoryPage;
export { CategoryPage };
