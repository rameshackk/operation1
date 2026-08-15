import React, { useState, useRef } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { newsData } from '../data/news.js';
import { videosData } from '../data/videos.js';

/**
 * TrendingArticlesSection
 * Continuously auto-scrolling horizontal card carousel matching the
 * Squarespace homepage template showcase motion pattern:
 * - Smooth, constant speed leftward drift in an infinite loop (0 to -50% translateX)
 * - Next card peeking in at right, previous card exiting at left
 * - Pauses on hover, keyboard focus within, or active touch interaction
 * - Respects prefers-reduced-motion fallback
 * - Fully accessible links to articles and videos
 */
export function TrendingArticlesSection({ onNavigate }) {
  const { t, language } = useLanguage();
  const [isTouchPaused, setIsTouchPaused] = useState(false);
  const touchTimeoutRef = useRef(null);

  // Compile prioritized list of trending articles and videos
  const trendingNews = (newsData || [])
    .filter(n => n.isTrending !== false)
    .slice(0, 4)
    .map(n => ({
      id: n.id,
      slug: n.slug,
      type: 'article',
      titleTamil: n.titleTamil,
      titleEnglish: n.titleEnglish,
      title: n.titleTamil || n.titleEnglish,
      summaryTamil: n.summaryTamil,
      summaryEnglish: n.summaryEnglish,
      thumbnail: n.thumbnail,
      category: n.category || 'mutual-funds',
      publishedAt: n.publishedAt,
      readTimeMinutes: n.readTimeMinutes || 4,
      rank: n.rank
    }));

  const trendingVids = (videosData || [])
    .filter(v => v.trending !== false)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4)
    .map(v => ({
      id: v.id,
      type: 'video',
      titleTamil: v.titleTamil,
      titleEnglish: v.titleEnglish,
      title: v.titleTamil || v.titleEnglish || v.title,
      summaryTamil: v.descriptionTamil,
      summaryEnglish: v.descriptionEnglish,
      thumbnail: v.thumbnail,
      category: v.category || 'personal-finance',
      publishedAt: v.publishedAt,
      duration: v.duration || '10:00',
      views: v.views || 25000,
      rank: null
    }));

  // Interleave articles and videos for a rich, dynamic showcase
  const combinedTrending = [];
  const maxLen = Math.max(trendingNews.length, trendingVids.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < trendingNews.length) combinedTrending.push(trendingNews[i]);
    if (i < trendingVids.length) combinedTrending.push(trendingVids[i]);
  }

  const trendingItems = combinedTrending.length > 0 ? combinedTrending : trendingNews;

  // Infinite sequence: render the list twice in sequence for a seamless 0% to -50% CSS loop
  const sequence = [...trendingItems, ...trendingItems];

  const getHeadline = (item) => {
    return language === 'ta' ? (item.titleTamil || item.title) : (item.titleEnglish || item.title || item.titleTamil);
  };

  const getSummary = (item) => {
    return language === 'ta' ? (item.summaryTamil || item.summary) : (item.summaryEnglish || item.summary || item.summaryTamil);
  };

  const handleCardClick = (item) => {
    if (!onNavigate) return;
    if (item.type === 'video') {
      onNavigate(`#/videos/${item.id}`);
    } else {
      onNavigate(`#/news/${item.slug}`);
    }
  };

  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(item);
    }
  };

  const handleTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    setIsTouchPaused(true);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsTouchPaused(false);
    }, 1800);
  };

  return (
    <section
      className="py-6 space-y-4 select-none overflow-hidden"
      aria-label={t('trendingArticlesTitle') || 'Trending Articles & Videos'}
    >
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-serif tracking-tight flex items-center gap-2">
                <span>{t('trendingArticlesTitle') || 'டிரெண்டிங் செய்திகள் & வழிகாட்டிகள்'}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
              ⚡ LIVE DRIFT • HOVER TO PAUSE
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              🔥 Trending
            </span>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Drifting Carousel Track */}
      <div className={`trending-carousel-wrapper ${isTouchPaused ? 'trending-carousel-paused' : ''}`}>
        <div
          className="animate-trending-carousel py-3 px-4 flex items-stretch gap-5 sm:gap-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {sequence.map((item, idx) => {
            const isVideo = item.type === 'video';
            const headline = getHeadline(item);
            const summary = getSummary(item);
            const rankStr = item.rank || `0${(idx % trendingItems.length) + 1}`;

            const formattedDate = new Intl.DateTimeFormat(
              language === 'ta' ? 'ta-IN' : 'en-IN',
              { month: 'short', day: 'numeric' }
            ).format(new Date(item.publishedAt || Date.now()));

            return (
              <article
                key={`${item.id}-copy-${idx}`}
                tabIndex={0}
                role="link"
                aria-label={`${item.type === 'video' ? 'Video' : 'Article'}: ${headline}`}
                onClick={() => handleCardClick(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                className="trending-carousel-card group relative w-[280px] sm:w-[330px] md:w-[360px] lg:w-[380px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              >
                {/* Card Thumbnail Container (16:9 Aspect Ratio) */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.thumbnail}
                    alt={headline}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top-Left Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-lg bg-slate-950/85 text-amber-400 backdrop-blur-md border border-white/10 shadow-sm">
                    {(item.category || 'FINANCE').replace('-', ' ')}
                  </span>

                  {/* Top-Right Rank or Type Indicator */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-amber-500 text-slate-950 shadow-md">
                    {isVideo ? '▶ VIDEO' : `🔥 #${rankStr}`}
                  </span>

                  {/* Video Play Overlay */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-amber-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-500 transition-all">
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Bottom Duration or Read Time Pill */}
                  <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-slate-950/85 text-slate-200 text-[10px] font-mono font-bold backdrop-blur-sm border border-white/10">
                    {isVideo ? item.duration : `⏱ ${item.readTimeMinutes} ${t('minRead') || 'min'}`}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white line-clamp-2 font-serif group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                      {headline}
                    </h3>
                    {summary && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-sans leading-relaxed">
                        {summary}
                      </p>
                    )}
                  </div>

                  {/* Footer Meta Row */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-3 font-medium">
                    <span className="flex items-center gap-1 font-mono">
                      <span>📅</span>
                      <span>{formattedDate}</span>
                    </span>

                    <span className="font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>{isVideo ? (new Intl.NumberFormat(language === 'ta' ? 'ta-IN' : 'en-IN').format(item.views) + ' ' + (t('views') || 'views')) : (t('readArticle') || 'Read')}</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
