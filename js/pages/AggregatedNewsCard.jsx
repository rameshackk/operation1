import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { formatRelativeTime } from '../utils/formatters.js';

function AggregatedNewsCard({ item, language }) {
  const isTamil = language === 'ta';
  const title = isTamil ? (item.titleTamil || item.titleEnglish) : (item.titleEnglish || item.titleTamil);
  const summary = isTamil ? (item.summaryTamil || item.summaryEnglish) : (item.summaryEnglish || item.summaryTamil);
  const relativeTime = formatRelativeTime(item.publishedAt, isTamil);
  const source = item.sourceName || 'Financial News';
  const sourceUrl = item.sourceUrl;

  const handleOpenSource = (e) => {
    if (e) e.stopPropagation();
    if (sourceUrl) {
      window.open(sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getSourceBadgeColor = (src) => {
    const s = (src || '').toLowerCase();
    if (s.includes('economic times')) return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    if (s.includes('livemint') || s.includes('mint')) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    if (s.includes('business standard')) return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
    if (s.includes('moneycontrol')) return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
    return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
  };

  return (
    <article
      onClick={handleOpenSource}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-3.5">
        {/* Card Thumbnail / Header */}
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
          <img
            src={item.imageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          {/* Source Attribution Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-lg border backdrop-blur-md shadow-sm ${getSourceBadgeColor(source)}`}>
              {source}
            </span>
          </div>

          {/* Category Tag */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 text-xs font-black uppercase tracking-wider rounded-md bg-slate-950/80 text-amber-400 border border-slate-800 backdrop-blur-md">
              {(item.category || 'MARKETS').replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-1 space-y-2.5">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif leading-snug line-clamp-2">
            {title}
          </h3>
          {summary && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
              {summary}
            </p>
          )}
        </div>
      </div>

      {/* Footer Outbound Attribution Link */}
      <div className="px-5 pb-5 pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>{relativeTime || 'Recently'}</span>
        </div>

        <button
          onClick={handleOpenSource}
          className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 group-hover:text-amber-500 hover:underline transition-colors"
          title={`Open original article on ${source}`}
        >
          <span>{isTamil ? `${source}-ல் படிக்கவும்` : `Read on ${source}`}</span>
          <span>→</span>
        </button>
      </div>
    </article>
  );
}


export default AggregatedNewsCard;
export { AggregatedNewsCard };
