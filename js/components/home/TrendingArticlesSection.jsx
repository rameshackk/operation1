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

    // Sort descending by date
    merged.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
      const dateB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return merged.slice(0, 6);
  }, [liveArticles, language]);

  return (
    <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0">
      <div className="space-y-4">
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

        {/* 3 Columns x 2 Rows Grid with 20-24px gap on desktop, clean single column with generous vertical spacing on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {allArticles.map((article, idx) => {
            const rankStr = `0${idx + 1}`;

            return (
              <div
                key={article.id || `trend-${idx}`}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
                className="group flex items-start gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#ded7c8] dark:border-slate-800 hover:border-[#23645C]/60 shadow-sm hover:shadow-lg transition-all cursor-pointer select-none min-h-[56px] active:scale-[0.99]"
              >
                {/* Large Article Number in Rich Accent */}
                <span className="text-2xl sm:text-[36px] font-extrabold text-[#23645C] dark:text-[#60a5fa] font-num shrink-0 leading-none pt-0.5 select-none">
                  {rankStr}
                </span>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#23645C] dark:text-[#60a5fa] font-sans">
                        {article.category.replace('-', ' ')}
                      </span>
                      <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-num">
                        • {new Date(article.publishedAt).toLocaleDateString(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    
                    {/* Proper H3 heading for accessible hierarchy (14px+ on mobile) */}
                    <h3 className="text-sm sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#23645C] dark:group-hover:text-[#60a5fa] transition-colors leading-snug font-sans">
                      {article.title}
                    </h3>
                  </div>

                  {/* Byline in slate-600 */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="truncate max-w-[150px] font-medium text-slate-700 dark:text-slate-300">
                      {article.authorName || 'Budget Padmanaban'}
                    </span>
                    <span className="text-[#23645C] dark:text-[#60a5fa] font-bold group-hover:translate-x-1 transition-transform text-sm">
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
