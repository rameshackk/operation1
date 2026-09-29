import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { newsData } from '../data/translations.js';
import { translateNewsArticle } from '../services/api.js';

function NewsDetailsPage({ slug, onNavigate }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const rawArticle = (newsData || []).find(a => a.slug === slug) || newsData[0];
  const article = translateNewsArticle(rawArticle, language);

  if (!article) return null;

  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-IN', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(article.publishedAt))
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <button
        onClick={() => onNavigate && onNavigate('#/news')}
        className="btn-magnetic px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5"
      >
        <span>←</span>
        <span>{isTamil ? 'அனைத்து செய்திகள்' : 'Back to News'}</span>
      </button>

      <div className="space-y-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-amber-500/20 text-amber-800">
            {article.category || 'FINANCE'}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            ⏱ {article.readTimeMinutes || 4} {isTamil ? 'நிமிட வாசிப்பு' : 'min read'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <button
            onClick={() => onNavigate && onNavigate('#/professionals/budget-padmanaban')}
            className="hover:text-amber-500 font-bold transition-colors flex items-center gap-1"
          >
            <span>{isTamil ? 'ஆசிரியர்:' : 'By'} {article.author || 'Budget Padmanaban Editorial'}</span>
            <span className="text-amber-500">→</span>
          </button>
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/50">
        <img
          src={article.thumbnail || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="article-blue-card rounded-3xl border-2 border-white/25 bg-[#4A9E2C] shadow-2xl p-6 sm:p-8 my-4 text-white">
        <div
          className="prose prose-invert max-w-none text-white text-sm sm:text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}


export default NewsDetailsPage;
export { NewsDetailsPage };
