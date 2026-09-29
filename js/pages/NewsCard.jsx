import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

function NewsCard({ article, onSelect }) {
  const { language } = useLanguage();
  if (!article) return null;

  const isTamil = language === 'ta';
  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(article.publishedAt))
    : '';

  return (
    <article
      onClick={() => onSelect && onSelect(article)}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
        <img
          src={article.thumbnail || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"}
          srcSet={(article.thumbnail || "").includes('images.unsplash.com') ? `${article.thumbnail.split('?')[0]}?w=320&q=70&auto=format&fit=crop 320w, ${article.thumbnail.split('?')[0]}?w=480&q=70&auto=format&fit=crop 480w, ${article.thumbnail.split('?')[0]}?w=768&q=70&auto=format&fit=crop 768w` : undefined}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          alt={article.title}
          loading="lazy"
          decoding="async"
          width="380"
          height="214"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-slate-950/80 text-amber-400">
          {article.category || 'FINANCE'}
        </span>
        <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-black uppercase rounded-md bg-amber-500 text-slate-950 font-black">
          EDITORIAL
        </span>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-500 transition-colors font-serif leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 font-medium">
          <span>{formattedDate}</span>
          <div className="flex items-center gap-2.5 font-bold font-mono">
            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              👁 {(article.views || article.viewCount || 0).toLocaleString()}
            </span>
            <span className="text-amber-800 dark:text-amber-400">
              ⏱ {article.readTimeMinutes || 4} {isTamil ? 'நிமிட வாசிப்பு' : 'min read'}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}


export default NewsCard;
export { NewsCard };
