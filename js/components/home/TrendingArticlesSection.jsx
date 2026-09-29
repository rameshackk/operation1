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
      const dateA = new Date(a.publishedAt || 0).getTime();
      const dateB = new Date(b.publishedAt || 0).getTime();
      return dateB - dateA;
    });

    return merged.slice(0, 6);
  }, [liveArticles, language]);

  return (
    <section className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0">
      <div className="section-band bg-[#E8F5E9] dark:bg-slate-900/40 rounded-2xl sm:rounded-3xl border border-[#D5EBD9] dark:border-slate-800 p-4 sm:p-6 lg:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#D5EBD9] dark:border-slate-800">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
            <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#0F172A] dark:text-white font-sans truncate">
              {t('trendingArticlesTitle') || 'டிரெண்டிங் செய்திகள் & கட்டுரைகள்'}
            </h2>
          </div>
          <span className="text-xs sm:text-xs font-bold text-[#2563EB] dark:text-[#60a5fa] bg-white dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full font-num shrink-0 border border-[#D5EBD9] dark:border-slate-800 shadow-xs">
            Top 6 Trending
          </span>
        </div>

        {/* 3 Columns x 2 Rows Grid with 20-24px gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {allArticles.map((article, idx) => {
            const rankStr = `0${idx + 1}`;

            return (
              <div
                key={article.id || `trend-${idx}`}
                onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#D5EBD9] dark:border-slate-800/80 shadow-[0_4px_20px_rgba(22,163,74,0.07)] hover:shadow-[0_16px_32px_rgba(22,163,74,0.10)] hover:border-[#15803d]/40 dark:hover:border-slate-700 transition-all cursor-pointer select-none"
              >
                {/* Large Article Number in Deep Navy Blue */}
                <span className="text-[36px] font-extrabold text-[#03529A] dark:text-[#60a5fa] font-num shrink-0 leading-none pt-0.5 select-none">
                  {rankStr}
                </span>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60a5fa] font-sans">
                        {article.category.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-[#64748B] dark:text-slate-400 font-num">
                        • {new Date(article.publishedAt).toLocaleDateString(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    
                    {/* Proper H3 heading for accessible hierarchy */}
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-white line-clamp-2 group-hover:text-[#2563EB] dark:group-hover:text-[#60a5fa] transition-colors leading-snug font-sans">
                      {article.title}
                    </h3>
                  </div>

                  {/* Byline in --gray-500 */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400">
                    <span className="truncate max-w-[150px]">
                      ✍️ {article.authorName || 'Budget Padmanaban'}
                    </span>
                    <span className="text-[#2563EB] dark:text-[#60a5fa] font-bold group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrendingArticlesSection;
export { TrendingArticlesSection };
