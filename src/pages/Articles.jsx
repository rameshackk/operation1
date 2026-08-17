import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';

export function Articles({ onNavigate, onShowToast }) {
  const { language, t } = useLanguage();
  const { session } = useAuth();
  const isTamil = language === 'ta';

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', labelTa: 'அனைத்து கட்டுரைகள்', labelEn: 'All Articles' },
    { id: 'mutual-fund', labelTa: '💰 மியூச்சுவல் ஃபண்ட்', labelEn: '💰 Mutual Funds' },
    { id: 'stock-market', labelTa: '📈 பங்குச் சந்தை', labelEn: '📈 Stock Market' },
    { id: 'personal-finance', labelTa: '💡 தனிநபர் நிதி & SIP', labelEn: '💡 Personal Finance' },
    { id: 'financial-education', labelTa: '🎓 நிதி அறிவு & வழிகாட்டி', labelEn: '🎓 Financial Education' }
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = session?.access_token || '';
        const res = await fetch(`/api/articles?category=${activeCategory}&search=${encodeURIComponent(searchQuery)}&sort=${sortBy}&limit=50`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          throw new Error(`Failed to load articles (${res.status})`);
        }

        const data = await res.json();
        if (isMounted) {
          setArticles(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchArticles();
    return () => { isMounted = false; };
  }, [session, activeCategory, searchQuery, sortBy]);

  const handleArticleClick = (slug) => {
    if (onNavigate) {
      onNavigate(`#/articles/${slug}`);
    } else {
      window.location.hash = `#/articles/${slug}`;
    }
  };

  return (
    <div className="min-h-screen pb-20 space-y-8 animate-fadeIn">
      {/* 1. HERO HEADER */}
      <div className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl space-y-3">
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {isTamil ? 'செய்திக் கட்டுரைகள்' : 'EDITORIAL & ARTICLES'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight leading-tight">
              {isTamil ? 'முதலீட்டு ஆய்வுக் கட்டுரைகள்' : 'In-Depth Investment Articles'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              {isTamil
                ? 'பட்ஜெட் பத்மநாபன் CFP® மற்றும் நிபுணர்களின் பிரத்யேக மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை மற்றும் தனிநபர் நிதி ஆழமான ஆய்வுக் கட்டுரைகள்.'
                : 'Exclusive original investment insights, mutual fund analyses, tax-saving strategies, and financial guidance written directly by Certified Financial Planner Padmanaban B.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTER BAR */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md scale-105'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
                  }`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. SEARCH & CONTROLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isTamil ? "கட்டுரைகளில் தேடுங்கள் (எ.கா: SIP, Nifty, Tax, Index)..." : "Search articles by title or keyword..."}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">{isTamil ? 'வரிசைப்படுத்து:' : 'Sort by:'}</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="newest">{isTamil ? 'சமீபத்தியவை' : 'Latest First'}</option>
              <option value="read_time">{isTamil ? 'ஆழமான வாசிப்பு (நீளமானது)' : 'Longest Read Time'}</option>
              <option value="oldest">{isTamil ? 'பழையவை' : 'Oldest First'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. ARTICLES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">{isTamil ? 'கட்டுரைகள் ஏற்றப்படுகின்றன...' : 'Loading published articles...'}</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-500/10 rounded-3xl border border-red-500/30 text-red-600 text-xs font-bold max-w-lg mx-auto">
            ⚠️ {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="text-4xl">📰</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isTamil ? 'கட்டுரைகள் எதுவும் கிடைக்கவில்லை' : 'No Articles Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isTamil
                ? 'உங்கள் தேடல் வார்த்தையை மாற்றவும் அல்லது அனைத்து பிரிவுகளையும் பார்வையிடவும்.'
                : 'Try adjusting your search criteria or explore other categories.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
              const excerpt = isTamil ? article.excerptTamil : (article.excerptEnglish || article.excerptTamil);
              const formattedDate = article.publishedAt
                ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(article.publishedAt))
                : '';

              return (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article.slug)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Cover Image */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                      <img
                        src={article.coverImage || '/favicon.svg'}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/favicon.svg'; }}
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-slate-950/85 text-amber-400 backdrop-blur-md">
                        {(article.category || 'FINANCE').replace('-', ' ')}
                      </span>
                      <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-black uppercase rounded-md bg-amber-600 text-white">
                        ✍️ ORIGINAL
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 font-serif leading-snug">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                          {excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 text-white font-black text-[9px] flex items-center justify-center">
                        BP
                      </div>
                      <span>{article.authorName || 'Budget Padmanaban'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{formattedDate}</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                        ⏱ {article.readTimeMinutes} {isTamil ? 'நிமிடம்' : 'min'}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
