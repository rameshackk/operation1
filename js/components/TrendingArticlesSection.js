import React from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { newsData } from '../data/news.js';

export function TrendingArticlesSection({ onNavigate }) {
  const { t, language } = useLanguage();
  const trendingArticles = newsData.slice(0, 5);

  const getHeadline = (item) => {
    return language === 'ta' ? item.titleTamil : (item.titleEnglish || item.titleTamil);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
            {t('trendingArticlesTitle') || 'டிரெண்டிங் செய்திகள்'}
          </h2>
        </div>
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
          🔥 Trending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingArticles.map((article, idx) => {
          const rankStr = article.rank || `0${idx + 1}`;
          const title = getHeadline(article);
          return (
            <div
              key={article.id}
              onClick={() => onNavigate && onNavigate(`#/news/${article.slug}`)}
              className="group flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all cursor-pointer"
            >
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-serif w-7 shrink-0 text-center">
                {rankStr}
              </span>

              {article.thumbnail && (
                <img
                  src={article.thumbnail}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                    {article.category.replace('-', ' ')}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    • {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif leading-snug">
                  {title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
