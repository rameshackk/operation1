import React, { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { newsData } from '../../data/translations.js';
import { useLiveArticles, normalizeArticleItem } from '../../services/articles.js';

function TrendingArticlesSection({ onNavigate }) {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const { liveArticles } = useLiveArticles();

  const allArticles = useMemo(() => {
    const liveList = (liveArticles || []).map(a => normalizeArticleItem(a, language)).filter(Boolean);
    const seedList = (newsData || []).map(a => normalizeArticleItem(a, language)).filter(Boolean);

    const seenSlugs = new Set();
    const merged = [];

    // Prioritize live published articles added by admin or publisher
    for (const a of liveList) {
      if (a.slug && !seenSlugs.has(a.slug)) {
        seenSlugs.add(a.slug);
        merged.push(a);
      }
    }
    for (const s of seedList) {
      if (s.slug && !seenSlugs.has(s.slug)) {
        seenSlugs.add(s.slug);
        merged.push(s);
      }
    }

    // Sort descending by highest views first, then by date
    merged.sort((a, b) => {
      const viewsA = Number(a.views_count ?? a.views ?? 0);
      const viewsB = Number(b.views_count ?? b.views ?? 0);
      if (viewsB !== viewsA) return viewsB - viewsA;
      const dateA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
      const dateB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return merged.slice(0, 6);
  }, [liveArticles, language]);

  return (
    <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0">
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A9E2C] shrink-0 shadow-xs" />
            <h2 className="text-base sm:text-lg md:text-xl font-black font-sans truncate drop-shadow-xs">
              {isTamil ? (
                <>
                  <span className="text-slate-950 dark:text-white">டிரெண்டிங் </span>
                  <span className="text-[#4A9E2C]">செய்திகள் & கட்டுரைகள்</span>
                </>
              ) : (
                <>
                  <span className="text-slate-950 dark:text-white">TRENDING </span>
                  <span className="text-[#4A9E2C]">ARTICLES</span>
                </>
              )}
            </h2>
          </div>
          <span className="text-xs sm:text-xs font-bold text-[#4A9E2C] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full font-num shrink-0 shadow-xs">
            Top 6 Trending
          </span>
        </div>

        {/* 3 Columns x 2 Rows Grid with clean article thumbnail images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {allArticles.map((article, idx) => {
            const formattedDate = new Date(article.publishedAt).toLocaleDateString(
              isTamil ? 'ta-IN' : 'en-IN',
              { month: 'short', day: 'numeric' }
            );

            return (
              <div
                key={article.id || `trend-${idx}`}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
                className="group flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer select-none active:scale-[0.99]"
              >
                {/* Article Thumbnail Image */}
                <div className="w-20 sm:w-24 h-20 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-800">
                  <img
                    src={article.thumbnail || article.coverImage}
                    alt={article.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Article Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-sans">
                        {(article.category || 'FINANCE').replace('-', ' ')}
                      </span>
                      <span className="text-[10.5px] sm:text-[11px] text-slate-400 font-num">
                        • {formattedDate}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug font-sans">
                      {article.title}
                    </h3>
                  </div>

                  {/* Byline / Publisher */}
                  <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[140px] font-medium text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">
                      {article.authorName || 'Budget Padmanaban'}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform text-xs sm:text-sm">
                      →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TrendingArticlesSection;
export { TrendingArticlesSection };

