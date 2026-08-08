import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { newsData } from '../data/news.js';
import { translateNewsArticle } from '../services/translationService.js';

export function NewsDetails({ slug, onNavigate }) {
  const { t, language } = useLanguage();
  const [scrollPercent, setScrollPercent] = useState(0);

  const rawArticle = newsData.find(a => a.slug === slug) || newsData[0];
  const article = translateNewsArticle(rawArticle, language);

  // Scroll Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollPercent(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inject Schema.org JSON-LD
  useEffect(() => {
    if (!article) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-news-article';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "image": [article.thumbnail],
      "datePublished": article.publishedAt,
      "author": {
        "@type": "Organization",
        "name": "Dhanavriksha Wealth"
      }
    });
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('schema-news-article');
      if (existing) existing.remove();
    };
  }, [article]);

  if (!article) return null;

  const formattedDate = new Intl.DateTimeFormat(
    language === 'ta' ? 'ta-IN' : 'en-IN',
    { month: 'long', day: 'numeric', year: 'numeric' }
  ).format(new Date(article.publishedAt));

  return (
    <div className="relative animate-fadeIn">
      {/* Top Viewport Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <div
          className="h-full bg-amber-500 transition-all duration-150"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Article Header */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-amber-500/20 text-amber-500">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ⏱ {article.readTimeMinutes} {t('minRead')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>By {article.author}</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div
          className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 font-sans"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Back Button */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => onNavigate('#/news')}
            className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors"
          >
            ← Back to All News
          </button>
        </div>

      </div>
    </div>
  );
}
