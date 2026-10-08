
import React, { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { newsData } from '../../data/translations.js';
import { useLiveArticles, normalizeArticleItem } from '../../services/articles.js';

function HeroSection({ news, onNavigate }) {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const { liveArticles } = useLiveArticles();

  const combinedArticles = useMemo(() => {
    const liveList = (liveArticles || []).map(a => normalizeArticleItem(a, language)).filter(Boolean);
    const passedList = (news || newsData || []).map(a => normalizeArticleItem(a, language)).filter(Boolean);

    const seen = new Set();
    const merged = [];
    for (const a of liveList) {
      if (a.slug && !seen.has(a.slug)) {
        seen.add(a.slug);
        merged.push(a);
      }
    }
    for (const p of passedList) {
      if (p.slug && !seen.has(p.slug)) {
        seen.add(p.slug);
        merged.push(p);
      }
    }

    // Sort descending by date so newly uploaded/published articles dynamically appear at the top
    merged.sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0).getTime();
      const dateB = new Date(b.publishedAt || 0).getTime();
      return dateB - dateA;
    });

    return merged;
  }, [liveArticles, news, language]);

  const featuredStories = combinedArticles.slice(0, 8);
  const latestStories = combinedArticles.slice(0, 4);

  const getCategoryStyle = (cat = '') => {
    const c = (cat || '').toLowerCase();
    if (c.includes('mutual') || c.includes('sip')) {
      return { bg: 'bg-[#F0FDF4] dark:bg-emerald-950/50', text: 'text-[#15803d] dark:text-[#4ade80]', border: 'border-emerald-100 dark:border-emerald-900/40' };
    }
    if (c.includes('stock') || c.includes('market') || c.includes('ipo')) {
      return { bg: 'bg-[#EFF6FF] dark:bg-blue-950/50', text: 'text-[#2563EB] dark:text-[#60a5fa]', border: 'border-blue-100 dark:border-blue-900/40' };
    }
    if (c.includes('personal') || c.includes('finance') || c.includes('saving')) {
      return { bg: 'bg-[#FBF7EF] dark:bg-amber-950/40', text: 'text-amber-800', border: 'border-amber-100 dark:border-amber-900/40' };
    }
    if (c.includes('tax') || c.includes('retire')) {
      return { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/40' };
    }
    return { bg: 'bg-[#EFF6FF] dark:bg-slate-800/60', text: 'text-[#2563EB] dark:text-[#60a5fa]', border: 'border-blue-100 dark:border-slate-700' };
  };

  const renderFeaturedTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-stretch shrink-0 gap-4 pr-4">
      {featuredStories.map((item, idx) => {
        const formattedDate = new Intl.DateTimeFormat(
          language === 'ta' ? 'ta-IN' : 'en-IN',
          { month: 'short', day: 'numeric' }
        ).format(new Date(item.publishedAt || Date.now()));

        const isLcp = keyPrefix === 'f-track-1' && idx === 0;

        return (
          <article
            key={`${keyPrefix}-${item.id || idx}`}
            onClick={() => onNavigate && onNavigate(`#/articles/${item.slug}`)}
            className="group/item relative w-[260px] sm:w-[290px] md:w-[320px] h-[255px] sm:h-[275px] shrink-0 rounded-2xl overflow-hidden flex flex-col justify-end p-4 sm:p-5 select-none cursor-pointer bg-slate-950 shadow-md border border-slate-800/60 hover:border-slate-700 transition-all hover:scale-[1.02]"
          >
            <img
              src={item.thumbnail}
              srcSet={item.thumbnail?.includes('images.unsplash.com') ? `${item.thumbnail.split('?')[0]}?w=320&q=70&auto=format&fit=crop&fm=webp 320w, ${item.thumbnail.split('?')[0]}?w=480&q=70&auto=format&fit=crop&fm=webp 480w, ${item.thumbnail.split('?')[0]}?w=768&q=70&auto=format&fit=crop&fm=webp 768w` : undefined}
              sizes="(max-width: 640px) 290px, 320px"
              alt={item.title}
              fetchpriority={isLcp ? 'high' : 'auto'}
              loading={isLcp ? 'eager' : 'lazy'}
              decoding="async"
              width="320"
              height="275"
              className="absolute inset-0 w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700 opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <span className="px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-md bg-amber-500 text-slate-950 shadow-sm">
                {(item.category || 'FINANCE').replace('-', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-950/85 text-slate-200 text-xs font-num font-bold border border-white/15">
                {formattedDate}
              </span>
            </div>

            <div className="relative z-10 space-y-1 mt-10">
              <h3 className="text-sm sm:text-[15px] md:text-[16px] font-bold text-white leading-snug font-sans group-hover/item:text-amber-400 transition-colors drop-shadow line-clamp-2">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-xs text-slate-300/90 line-clamp-2 font-sans leading-relaxed">
                  {item.summary}
                </p>
              )}
              <div className="pt-1 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span className="flex items-center gap-1 group-hover/item:translate-x-1 transition-transform">
                  <span>{t('readArticle') || 'Read Full Story'}</span>
                  <span>→</span>
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-num">Tap to read</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <section className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0">
      <div className="w-full">
          
          {/* 1. DESKTOP VIEW (hidden lg:grid) - Preserved exactly as original */}
          <div className="hidden lg:grid grid-cols-12 gap-6 lg:gap-8 items-stretch min-w-0 max-w-full">
            {/* Left Column: Featured News Live Ticker Stream */}
            <div className="lg:col-span-7 xl:col-span-8 min-w-0 max-w-full flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5 min-w-0 truncate">
                  <span className="w-3 h-3 rounded-full bg-[#DC2626] animate-ping shrink-0" />
                  <h2 className="text-lg sm:text-xl md:text-2xl 2xl:text-[24px] font-black tracking-wide uppercase font-sans truncate">
                    {isTamil ? (
                      <>
                        <span className="text-slate-950 dark:text-white">சிறப்புச் </span>
                        <span className="text-[#4A9E2C]">செய்திகள்</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-950 dark:text-white">FEATURED </span>
                        <span className="text-[#4A9E2C]">NEWS</span>
                      </>
                    )}
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#2563EB] dark:text-[#60a5fa] bg-[#EFF6FF] dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full shrink-0 font-num">
                  LIVE TICKER SPOTLIGHT
                </span>
              </div>

              {/* Smooth Live Ticker Container */}
              <div className="featured-marquee-wrapper overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-950/90 w-full min-w-0 max-w-full shadow-inner p-2.5 sm:p-3 group/marquee">
                <div className="animate-featured-marquee flex items-stretch whitespace-normal">
                  {renderFeaturedTrack('f-track-1')}
                  {renderFeaturedTrack('f-track-2')}
                </div>
              </div>
            </div>

            {/* Right Column: Latest Articles List with Dynamic Image Thumbnails */}
            <div className="lg:col-span-5 xl:col-span-4 min-w-0 max-w-full overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5 min-w-0 truncate">
                  <span className="w-3 h-3 rounded-full bg-[#2563EB] shrink-0" />
                  <h3 className="text-lg sm:text-xl md:text-2xl 2xl:text-[24px] font-black uppercase tracking-wide font-sans truncate">
                    {isTamil ? (
                      <>
                        <span className="text-slate-950 dark:text-white">சமீபத்திய </span>
                        <span className="text-[#4A9E2C]">கட்டுரைகள்</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-950 dark:text-white">LATEST </span>
                        <span className="text-[#4A9E2C]">ARTICLES</span>
                      </>
                    )}
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#15803d] dark:text-[#4ade80] bg-[#DCFCE7] dark:bg-emerald-950/60 px-2 py-0.5 rounded-full shrink-0 font-num">
                  Latest
                </span>
              </div>

              <div className="space-y-2 flex-1 flex flex-col justify-between">
                {latestStories.map((article, idx) => {
                  const style = getCategoryStyle(article.category);
                  return (
                    <div
                      key={article.id || `latest-${idx}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
                      className="group flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      {/* Real Article Image Thumbnail with fallback badge */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl shrink-0 overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs group-hover:shadow-md transition-all">
                        <img
                          src={article.thumbnail || article.coverImage}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          width="56"
                          height="56"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div className={`hidden absolute inset-0 items-center justify-center ${style.bg} ${style.text}`}>
                          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-xs font-extrabold uppercase tracking-wider ${style.text}`}>
                            {(article.category || 'FINANCE').replace('-', ' ')}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-num font-medium">
                            • {new Date(article.publishedAt).toLocaleDateString(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-[14px] md:text-[15px] font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-[#2563EB] dark:group-hover:text-[#60a5fa] transition-colors leading-snug">
                          {article.title}
                        </h4>
                      </div>

                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-[#2563EB] dark:group-hover:text-[#60a5fa] group-hover:translate-x-1 transition-all shrink-0 text-xs font-bold pr-1">
                        →
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. MOBILE SINGLE-COLUMN VIEW (lg:hidden) - Generous vertical rhythm & Swipeable Rails */}
          <div className="lg:hidden space-y-6">
            {/* Top: Swipeable Featured News Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 min-w-0 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-ping shrink-0" />
                  <h2 className="text-base sm:text-lg font-black tracking-wide uppercase font-sans truncate">
                    {isTamil ? (
                      <>
                        <span className="text-slate-950 dark:text-white">சிறப்புச் </span>
                        <span className="text-[#4A9E2C]">செய்திகள்</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-950 dark:text-white">FEATURED </span>
                        <span className="text-[#4A9E2C]">NEWS</span>
                      </>
                    )}
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-[#2563EB] dark:text-[#60a5fa] bg-[#EFF6FF] dark:bg-blue-950/60 px-2 py-0.5 rounded-full shrink-0">
                  Swipe ↔
                </span>
              </div>

              {/* Touch-Gesture Enabled Horizontal Scroll Rail */}
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-2 no-scrollbar touch-pan-x -mx-1 px-1">
                {featuredStories.map((item, idx) => {
                  const formattedDate = new Intl.DateTimeFormat(
                    language === 'ta' ? 'ta-IN' : 'en-IN',
                    { month: 'short', day: 'numeric' }
                  ).format(new Date(item.publishedAt || Date.now()));

                  return (
                    <article
                      key={`mob-feat-${item.id || idx}`}
                      onClick={() => onNavigate && onNavigate(`#/articles/${item.slug}`)}
                      className="group relative w-[80vw] max-w-[300px] h-[260px] shrink-0 snap-center rounded-2xl overflow-hidden flex flex-col justify-end p-4 select-none cursor-pointer bg-slate-950 shadow-md border border-slate-800/80 active:scale-[0.98] transition-all"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="px-2 py-0.5 text-[11px] font-black uppercase tracking-wider rounded-md bg-amber-500 text-slate-950 shadow-sm">
                          {(item.category || 'FINANCE').replace('-', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-200 text-[11px] font-num font-bold border border-white/20">
                          {formattedDate}
                        </span>
                      </div>

                      <div className="relative z-10 space-y-1.5 mt-auto">
                        <h3 className="text-[15px] sm:text-base font-bold text-white leading-snug font-sans group-hover:text-amber-400 line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="pt-1 flex items-center justify-between text-xs text-amber-400 font-bold">
                          <span>{t('readArticle') || 'Read Story'} →</span>
                          <span className="text-[11px] text-slate-400 font-num">Tap to open</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Bottom: Latest Articles Single Column Stack */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shrink-0" />
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wide font-sans">
                    {isTamil ? (
                      <>
                        <span className="text-slate-950 dark:text-white">சமீபத்திய </span>
                        <span className="text-[#4A9E2C]">கட்டுரைகள்</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-950 dark:text-white">LATEST </span>
                        <span className="text-[#4A9E2C]">ARTICLES</span>
                      </>
                    )}
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('#/articles')}
                  className="text-xs font-bold text-[#2563EB] dark:text-[#60a5fa] hover:underline"
                >
                  {isTamil ? 'அனைத்தும்' : 'View all'} →
                </button>
              </div>

              <div className="space-y-2.5">
                {latestStories.map((article, idx) => {
                  const style = getCategoryStyle(article.category);
                  return (
                    <div
                      key={`mob-latest-${article.id || idx}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[56px] active:scale-[0.99]"
                    >
                      <div className="relative w-14 h-14 rounded-xl shrink-0 overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                        <img
                          src={article.thumbnail || article.coverImage}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[11px] font-extrabold uppercase tracking-wider ${style.text}`}>
                            {(article.category || 'FINANCE').replace('-', ' ')}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-num">
                            • {new Date(article.publishedAt).toLocaleDateString(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                      </div>

                      <span className="text-slate-400 group-hover:text-[#2563EB] shrink-0 text-sm font-bold pr-1">
                        →
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>
    );
  }

export default HeroSection;
export { HeroSection };
