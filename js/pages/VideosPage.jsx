import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { updateHeadTags } from '../utils/formatters.js';
import YouTubeHero from '../components/youtube/YouTubeHero.jsx';
import YouTubeVideoCard from '../components/youtube/YouTubeVideoCard.jsx';
import YouTubeShortCard from '../components/youtube/YouTubeShortCard.jsx';
import YouTubePlayerModal from '../components/youtube/YouTubePlayerModal.jsx';

const CATEGORIES = [
  { id: 'all', labelTa: 'அனைத்தும்', labelEn: 'All' },
  { id: 'Mutual Funds', labelTa: 'மியூச்சுவல் ஃபண்ட்', labelEn: 'Mutual Funds' },
  { id: 'SIP & Planning', labelTa: 'SIP & திட்டமிடல்', labelEn: 'SIP & Planning' },
  { id: 'Stock Market', labelTa: 'பங்குச் சந்தை', labelEn: 'Stock Market' },
  { id: 'Insurance', labelTa: 'இன்சூரன்ஸ்', labelEn: 'Insurance' },
  { id: 'Retirement', labelTa: 'ஓய்வூதியம் (NPS)', labelEn: 'Retirement' },
  { id: 'Children & Education', labelTa: 'குழந்தைகள் கல்வி & எதிர்காலம்', labelEn: 'Children & Education' },
  { id: 'Gold & Bonds', labelTa: 'தங்கம் & பத்திரங்கள்', labelEn: 'Gold & Bonds' },
  { id: 'Tax', labelTa: 'வரி சேமிப்பு', labelEn: 'Tax Planning' },
  { id: 'Others', labelTa: 'இதர தலைப்புகள்', labelEn: 'Others' }
];

function VideosPage({ onNavigate, onShowToast, initialVideoId }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [heroVideo, setHeroVideo] = useState(null);
  const [liveVideos, setLiveVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sentinelRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // SEO metadata
  useEffect(() => {
    updateHeadTags({
      title: isTamil ? 'வீடியோக்கள் & Masterclasses | முதலீட்டு திசை' : 'Videos & Masterclasses | Muthaleetu Thisai',
      description: isTamil
        ? 'மியூச்சுவல் ஃபண்ட், SIP, பங்குச் சந்தை மற்றும் தனிநபர் நிதி வழிகாட்டல் வீடியோக்கள் - பட்ஜெட் பத்மநாபன்.'
        : 'Watch top mutual funds, SIP, stock market, and personal finance masterclasses by Budget Padmanaban.',
      pathname: '/videos'
    });
  }, [isTamil]);

  // Handle URL direct deep link (#/videos/watch/<id> or initialVideoId)
  useEffect(() => {
    if (initialVideoId) {
      fetch(`/api/youtube/videos?id=${encodeURIComponent(initialVideoId)}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.data) {
            setSelectedVideo(data.data);
            updateHeadTags({
              title: `${data.data.title} | முதலீட்டு திசை`,
              description: data.data.description?.slice(0, 160) || data.data.title,
              image: data.data.thumbnail_url,
              pathname: `/videos/watch/${initialVideoId}`
            });
          }
        })
        .catch(() => {});
    }
  }, [initialVideoId]);

  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery]);

  // Fetch initial data (Hero, Live, Shorts, and First 24 Videos)
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Parallel requests for optimal LCP performance
      const [videosRes, shortsRes, liveRes] = await Promise.all([
        fetch(
          `/api/youtube/videos?type=videos&category=${encodeURIComponent(activeCategory)}&q=${encodeURIComponent(debouncedSearch)}&limit=24&include_hero=1`
        ).then(r => (r.ok ? r.json() : { data: [], hero: null })),
        fetch('/api/youtube/videos?type=shorts&limit=16').then(r => (r.ok ? r.json() : { data: [] })),
        fetch('/api/youtube/videos?type=live&limit=4').then(r => (r.ok ? r.json() : { data: [] }))
      ]);

      setVideos(videosRes.data || []);
      setHeroVideo(videosRes.hero || (videosRes.data?.[0] || null));
      setCursor(videosRes.nextCursor || null);
      setHasMore(!!videosRes.hasMore);

      setShorts(shortsRes.data || []);
      setLiveVideos(liveRes.data || []);
    } catch (err) {
      console.warn('Failed to load initial YouTube videos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, debouncedSearch]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Infinite Scroll: Load Next 24 Videos via Cursor
  const loadMoreVideos = useCallback(async () => {
    if (isLoadingMore || !hasMore || !cursor) return;
    setIsLoadingMore(true);

    try {
      const res = await fetch(
        `/api/youtube/videos?type=videos&category=${encodeURIComponent(activeCategory)}&q=${encodeURIComponent(debouncedSearch)}&limit=24&cursor=${encodeURIComponent(cursor)}`
      );
      if (res.ok) {
        const data = await res.json();
        const newItems = data.data || [];
        setVideos(prev => [...prev, ...newItems]);
        setCursor(data.nextCursor || null);
        setHasMore(!!data.hasMore);
      }
    } catch (err) {
      console.warn('Error loading more videos:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, cursor, activeCategory, debouncedSearch]);

  // IntersectionObserver for Infinite Scroll
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMoreVideos();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, loadMoreVideos]);

  const handleSelectVideo = (vid) => {
    setSelectedVideo(vid);
    const vidId = vid.video_id || vid.youtubeId || vid.id;
    if (vidId) {
      window.location.hash = `#/videos/watch/${vidId}`;
    }
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    window.location.hash = '#/videos';
  };

  return (
    <div className="min-h-screen pb-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white animate-fadeIn">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-6 sm:pt-8 space-y-8">
        
        {/* ================= CONTROLS BAR (SEARCH + CATEGORY CHIPS) ================= */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative max-w-xl">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isTamil
                  ? 'வீடியோக்களைத் தேடுங்கள் (எ.கா: SIP, Nifty, Tax, Mutual Fund)...'
                  : 'Search videos (e.g. SIP, Nifty, Tax, Mutual Fund)...'
              }
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-200"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : null}
          </div>

          {/* Horizontally Scrollable Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`btn-magnetic px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= 4. SHORTS RAIL (9:16 Horizontal Rail) ================= */}
        {shorts.length > 0 && !searchQuery && activeCategory === 'all' ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isTamil ? 'குறுகிய வீடியோக்கள் (Shorts)' : 'YouTube Shorts'}
              </h3>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 pt-1">
              {shorts.map((shortVid) => (
                <YouTubeShortCard
                  key={shortVid.video_id || shortVid.youtubeId || shortVid.id}
                  video={shortVid}
                  onSelect={handleSelectVideo}
                  isTamil={isTamil}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* ================= 5. MAIN LONG VIDEOS GRID (4 cols xl, 3 lg, 2 sm, 1 below) ================= */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif">
              {isTamil ? 'அனைத்து வீடியோ பதிவுகள்' : 'All Masterclasses & Videos'}
            </h3>
            {videos.length > 0 ? (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isTamil ? `${videos.length} வீடியோக்கள் ஏற்றப்பட்டுள்ளன` : `${videos.length} videos loaded`}
              </span>
            ) : null}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {videos.map((vid) => (
                <YouTubeVideoCard
                  key={vid.video_id || vid.youtubeId || vid.id}
                  video={vid}
                  onSelect={handleSelectVideo}
                  isTamil={isTamil}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isTamil ? 'வீடியோக்கள் எதுவும் கிடைக்கவில்லை' : 'No videos found'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isTamil
                  ? 'தேடல் சொல் அல்லது வகையை மாற்றி முயற்சிக்கவும்.'
                  : 'Try adjusting your search terms or selecting another category.'}
              </p>
            </div>
          )}

          {/* Infinite Scroll Sentinel & Loading Indicator */}
          <div ref={sentinelRef} className="py-6 text-center">
            {isLoadingMore ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>{isTamil ? 'மேலும் வீடியோக்கள் ஏற்றப்படுகின்றன...' : 'Loading more videos...'}</span>
              </div>
            ) : !hasMore && videos.length > 0 ? (
              <div className="text-xs text-slate-400 font-medium">
                {isTamil ? 'அனைத்து வீடியோக்களும் ஏற்றப்பட்டுவிட்டன' : 'All available videos loaded'}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ================= 6. VIDEO PLAYER MODAL ================= */}
      {selectedVideo ? (
        <YouTubePlayerModal
          video={selectedVideo}
          allVideos={videos}
          onClose={handleCloseModal}
          onSelectRelated={handleSelectVideo}
          isTamil={isTamil}
          onShowToast={onShowToast}
        />
      ) : null}
    </div>
  );
}

export default VideosPage;
