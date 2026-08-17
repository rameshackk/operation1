import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';

export function ArticleDetail({ slug, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session } = useAuth();
  const isTamil = language === 'ta';

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Single Article by Slug
  useEffect(() => {
    let isMounted = true;
    const fetchArticle = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = session?.access_token || '';
        const res = await fetch(`/api/articles/${encodeURIComponent(slug)}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          throw new Error(res.status === 404 ? (isTamil ? 'கட்டுரை கிடைக்கவில்லை' : 'Article not found') : 'Failed to load article');
        }

        const data = await res.json();
        if (isMounted) {
          setArticle(data.data);
        }
      } catch (err) {
        console.error('Error loading article:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchArticle();
    return () => { isMounted = false; };
  }, [slug, session, isTamil]);

  // Inject Schema.org JSON-LD for SEO
  useEffect(() => {
    if (!article) return;

    const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
    const excerpt = isTamil ? article.excerptTamil : (article.excerptEnglish || article.excerptTamil);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `jsonld-article-${article.slug}`;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': title,
      'description': excerpt,
      'image': [article.coverImage || `${window.location.origin}/favicon.svg`],
      'datePublished': article.publishedAt,
      'dateModified': article.updatedAt || article.publishedAt,
      'author': [{
        '@type': 'Person',
        'name': article.authorName || 'Budget Padmanaban',
        'jobTitle': 'Certified Financial Planner (CFP®)',
        'url': 'https://www.youtube.com/@budgetpadmanaban_'
      }],
      'publisher': {
        '@type': 'Organization',
        'name': 'Muthaleetu Thisai',
        'logo': {
          '@type': 'ImageObject',
          'url': `${window.location.origin}/favicon.svg`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${window.location.origin}/#/articles/${article.slug}`
      }
    });

    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById(`jsonld-article-${article.slug}`);
      if (existing) existing.remove();
    };
  }, [article, isTamil]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article ? (isTamil ? article.titleTamil : article.titleEnglish) : 'Muthaleetu Thisai';

    if (platform === 'copy') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        if (onShowToast) onShowToast(isTamil ? 'லிங்க் நகலெடுக்கப்பட்டது!' : 'Article link copied to clipboard!');
      }
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500">{isTamil ? 'கட்டுரை ஏற்றப்படுகிறது...' : 'Loading article...'}</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
        <div className="text-4xl">📄</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {error || (isTamil ? 'கட்டுரை கிடைக்கவில்லை' : 'Article Not Found')}
        </h2>
        <p className="text-xs text-slate-500">
          {isTamil ? 'இந்தக் கட்டுரை நீக்கப்பட்டிருக்கலாம் அல்லது வெளியிடப்படாமல் இருக்கலாம்.' : 'The article may have been removed or is currently unpublished.'}
        </p>
        <button
          onClick={() => onNavigate ? onNavigate('#/articles') : (window.location.hash = '#/articles')}
          className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg transition-all"
        >
          ← {isTamil ? 'கட்டுரைகள் பக்கத்திற்குத் திரும்பு' : 'Back to Articles'}
        </button>
      </div>
    );
  }

  const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
  const excerpt = isTamil ? article.excerptTamil : (article.excerptEnglish || article.excerptTamil);
  const body = isTamil ? article.bodyTamil : (article.bodyEnglish || article.bodyTamil);
  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-IN', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(article.publishedAt))
    : '';

  return (
    <div className="min-h-screen pb-24 animate-fadeIn relative">
      {/* Pinned Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 dark:bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate ? onNavigate('#/articles') : (window.location.hash = '#/articles')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            ← {isTamil ? 'அனைத்து கட்டுரைகள்' : 'All Articles'}
          </button>
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            {(article.category || 'FINANCE').replace('-', ' ')}
          </span>
        </div>

        {/* Header Metadata */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-serif leading-tight sm:leading-snug">
            {title}
          </h1>

          {excerpt && (
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-l-4 border-amber-500 pl-4 py-1 italic">
              {excerpt}
            </p>
          )}

          {/* Author & Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 text-white font-black text-xs flex items-center justify-center shadow">
                BP
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{article.authorName || 'Budget Padmanaban'}</span>
                  <span className="text-blue-500 font-bold" title="Verified Creator">✓</span>
                </div>
                <div className="text-[11px] text-slate-400">CFP® Certified Financial Planner</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span>📅 {formattedDate}</span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                ⏱ {article.readTimeMinutes} {isTamil ? 'நிமிடம் வாசிக்க' : 'min read'}
              </span>
            </div>
          </div>
        </div>

        {/* Cover Image Banner */}
        {article.coverImage && (
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-200 dark:border-slate-800">
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Main Rich Text Content Body */}
        <div
          className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-normal text-base sm:text-lg selection:bg-amber-500 selection:text-white"
          dangerouslySetInnerHTML={{ __html: body }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">{isTamil ? 'குறிச்சொற்கள்:' : 'Tags:'}</span>
            {article.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Social Share Bar */}
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white font-serif">
              {isTamil ? 'இந்தக் கட்டுரையைப் பகிருங்கள்' : 'Share this investment analysis'}
            </h4>
            <p className="text-xs text-slate-500">
              {isTamil ? 'உங்கள் நண்பர்கள் மற்றும் குடும்பத்தினருடன் அறிவைப் பகிருங்கள்.' : 'Help friends and family take informed investment decisions.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
            >
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              X / Twitter
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition-colors"
            >
              🔗 {isTamil ? 'நகலெடு' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-red-600 to-amber-400 p-1 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-xl text-white">
              BP
            </div>
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Budget Padmanaban (Padmanaban B)</h3>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-amber-500/10 text-amber-700 dark:text-amber-400">CFP®</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isTamil
                ? 'பட்ஜெட் பத்மநாபன் CFP® சான்றளிக்கப்பட்ட நிதி திட்டமிடுபவர். மியூச்சுவல் ஃபண்ட், ஓய்வூதியத் திட்டமிடல், வரி சேமிப்பு மற்றும் தனிநபர் நிதி மேலாண்மையில் 10+ ஆண்டுகளுக்கும் மேலான அனுபவம் கொண்டவர்.'
                : 'Certified Financial Planner (CFP®) dedicated to simplifying Mutual Funds, Personal Finance, and Long-Term Wealth Creation for Tamil investors.'}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
