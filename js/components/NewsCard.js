import React from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';

export function NewsCard({ article, onSelect }) {
  const { t } = useLanguage();

  if (!article) return null;

  const formattedDate = new Intl.DateTimeFormat(
    article.activeLang === 'ta' ? 'ta-IN' : 'en-IN',
    { month: 'short', day: 'numeric', year: 'numeric' }
  ).format(new Date(article.publishedAt));

  return (
    <article
      onClick={() => onSelect(article)}
      className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-full transform hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
        <img
          src={article.thumbnail}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-950/80 text-amber-400 backdrop-blur-sm">
          {article.category}
        </span>
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-500 transition-colors font-serif leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 font-medium">
          <span>{formattedDate}</span>
          <span className="font-mono text-amber-600 dark:text-amber-400">
            ⏱ {article.readTimeMinutes} {t('minRead')}
          </span>
        </div>
      </div>
    </article>
  );
}
