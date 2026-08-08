import React from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { newsData } from '../data/news.js';
import { translateNewsArticle } from '../services/translationService.js';
import { NewsCard } from '../components/NewsCard.js';

export function News({ onNavigate }) {
  const { t, language } = useLanguage();
  const articles = newsData.map(item => translateNewsArticle(item, language));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
          {t('nav.news')} Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('siteName')} Editorial Updates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map(article => (
          <NewsCard
            key={article.id}
            article={article}
            onSelect={() => onNavigate(`#/news/${article.slug}`)}
          />
        ))}
      </div>
    </div>
  );
}
