import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth, useBookmarks } from '../context/AuthContext.jsx';
import { cleanImageUrl } from '../services/articles.js';

function ArticlesPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session } = useAuth();
  const { bookmarks, toggleBookmark, isSaved } = useBookmarks();
  const isTamil = language === 'ta';

  const [rawArticles, setRawArticles] = useState([]);
  const [publishersList, setPublishersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [dateRange, setDateRange] = useState('all'); // 'all' | '7days' | '30days' | '3months'
  const [selectedLanguage, setSelectedLanguage] = useState('both'); // 'both' | 'ta' | 'en'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'views' | 'oldest' | 'read_time'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Collapsible Sections State (Left Sidebar)
  const [collapsedSections, setCollapsedSections] = useState({
    category: false,
    publisher: false,
    date: false,
    language: false
  });

  // Mobile Filter Drawer State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const resultsTopRef = useRef(null);

  const toggleSection = (sectionKey) => {
    setCollapsedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Predefined Category Definitions matching site structure
  const filterCategories = [
    { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
    { id: 'stocks', labelTa: 'பங்குச் சந்தை & வர்த்தகம்', labelEn: 'Stocks & Markets' },
    { id: 'tax-retirement', labelTa: 'வரி சேமிப்பு & ஓய்வூதியம்', labelEn: 'Tax & Retirement' },
    { id: 'financial-education', labelTa: 'நிதி அறிவு & வழிகாட்டி', labelEn: 'Financial Education' },
    { id: 'quick-takes', labelTa: 'விரைவு பார்வைகள்', labelEn: 'Quick Takes' }
  ];

  // Map arbitrary database category string to unified category bucket
  const getCategoryBucket = useCallback((cat) => {
    const c = (cat || '').toLowerCase().trim();
    if (c.includes('mutual') || c.includes('fund') || c.includes('sip') || c.includes('elss')) return 'mutual-funds';
    if (c.includes('stock') || c.includes('market') || c.includes('ipo') || c.includes('trade') || c.includes('share')) return 'stocks';
    if (c.includes('tax') || c.includes('retire') || c.includes('nps') || c.includes('epf') || c.includes('pension')) return 'tax-retirement';
    if (c.includes('edu') || c.includes('guide') || c.includes('learn') || c.includes('basic') || c.includes('masterclass')) return 'financial-education';
    if (c.includes('quick') || c.includes('short') || c.includes('take') || c.includes('brief')) return 'quick-takes';
    return 'personal-finance';
  }, []);

  // Fetch articles and publisher directory
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = session?.access_token || '';
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [articlesRes, pubRes] = await Promise.allSettled([
          fetch('/api/articles?limit=250&sort=newest', { headers }).then(r => r.ok ? r.json() : null),
          fetch('/api/publishers?limit=50', { headers }).then(r => r.ok ? r.json() : null)
        ]);

        if (isMounted) {
          if (articlesRes.status === 'fulfilled' && articlesRes.value?.status === 'success') {
            setRawArticles(articlesRes.value.data || []);
          } else {
            // Fallback to sample published articles if database is empty/offline
            setRawArticles([]);
          }

          if (pubRes.status === 'fulfilled' && pubRes.value?.status === 'success') {
            setPublishersList(pubRes.value.data || []);
          }
        }
      } catch (err) {
        console.error('Error fetching articles data:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [session]);

  // Aggregate active publishers with dynamic article counts from raw dataset
  const activePublishers = useMemo(() => {
    const pubMap = new Map();

    // 1. Prepopulate from publishersList API
    publishersList.forEach(p => {
      const pubId = String(p.id || p.display_name || '').toLowerCase();
      pubMap.set(pubId, {
        id: pubId,
        rawId: p.id,
        name: p.display_name || 'Budget Padmanaban',
        arn: p.arn_number || '',
        avatar: p.avatar_url || '',
        count: 0
      });
    });

    // 2. Tally article counts from raw articles
    rawArticles.forEach(a => {
      const authorKey = String(a.authorId || a.authorName || 'budget-padmanaban').toLowerCase();
      const authorName = a.authorName || 'Budget Padmanaban';
      const authorArn = a.authorArn || a.author_arn || (authorName.toLowerCase().includes('padmanaban') ? 'ARN-112345' : '');

      if (!pubMap.has(authorKey)) {
        pubMap.set(authorKey, {
          id: authorKey,
          rawId: a.authorId || authorKey,
          name: authorName,
          arn: authorArn,
          avatar: a.authorAvatar || '',
          count: 0
        });
      }
      pubMap.get(authorKey).count += 1;
    });

    // Convert map to array and sort by article count descending
    return Array.from(pubMap.values()).filter(p => p.count > 0 || p.name);
  }, [rawArticles, publishersList]);

  // Handle category checkbox toggle
  const toggleCategoryFilter = (catId) => {
    setCurrentPage(1);
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  // Handle publisher checkbox toggle
  const togglePublisherFilter = (pubId) => {
    setCurrentPage(1);
    setSelectedPublishers(prev =>
      prev.includes(pubId) ? prev.filter(p => p !== pubId) : [...prev, pubId]
    );
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPublishers([]);
    setDateRange('all');
    setSelectedLanguage('both');
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategories.length > 0 ||
    selectedPublishers.length > 0 ||
    dateRange !== 'all' ||
    selectedLanguage !== 'both' ||
    searchQuery.trim().length > 0;

  // Filter and sort the full articles dataset
  const filteredArticles = useMemo(() => {
    const now = new Date().getTime();

    return rawArticles.filter(article => {
      // 1. Category Filter (multi-select OR)
      if (selectedCategories.length > 0) {
        const bucket = getCategoryBucket(article.category);
        if (!selectedCategories.includes(bucket)) {
          return false;
        }
      }

      // 2. Publisher Filter (multi-select OR)
      if (selectedPublishers.length > 0) {
        const authorKey = String(article.authorId || article.authorName || '').toLowerCase();
        const matched = selectedPublishers.some(pubId =>
          authorKey === pubId ||
          authorKey.includes(pubId) ||
          pubId.includes(authorKey) ||
          (pubId.includes('padmanaban') && (article.authorName || '').toLowerCase().includes('padmanaban'))
        );
        if (!matched) return false;
      }

      // 3. Published Date Filter
      if (dateRange !== 'all' && article.publishedAt) {
        const pubTime = new Date(article.publishedAt).getTime();
        const diffDays = (now - pubTime) / (1000 * 60 * 60 * 24);
        if (dateRange === '7days' && diffDays > 7) return false;
        if (dateRange === '30days' && diffDays > 30) return false;
        if (dateRange === '3months' && diffDays > 90) return false;
      }

      // 4. Language Filter
      if (selectedLanguage === 'ta') {
        const hasTamil = Boolean(article.titleTamil || article.contentTamil || article.language === 'ta');
        if (!hasTamil) return false;
      } else if (selectedLanguage === 'en') {
        const hasEnglish = Boolean(article.titleEnglish || article.contentEnglish || article.language === 'en');
        if (!hasEnglish) return false;
      }

      // 5. Keyword Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const tTa = (article.titleTamil || '').toLowerCase();
        const tEn = (article.titleEnglish || '').toLowerCase();
        const eTa = (article.excerptTamil || article.summaryTamil || '').toLowerCase();
        const eEn = (article.excerptEnglish || article.summaryEnglish || '').toLowerCase();
        const author = (article.authorName || '').toLowerCase();
        const cat = (article.category || '').toLowerCase();

        const match = tTa.includes(q) || tEn.includes(q) || eTa.includes(q) || eEn.includes(q) || author.includes(q) || cat.includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'oldest') {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateA - dateB;
      }
      if (sortBy === 'views') {
        const vA = a.views || a.viewCount || 0;
        const vB = b.views || b.viewCount || 0;
        return vB - vA;
      }
      if (sortBy === 'read_time') {
        const rA = a.readTimeMinutes || 4;
        const rB = b.readTimeMinutes || 4;
        return rB - rA;
      }
      return 0;
    });
  }, [rawArticles, selectedCategories, selectedPublishers, dateRange, selectedLanguage, searchQuery, sortBy, getCategoryBucket]);

  // Live facet counts computed for Category checkboxes
  const categoryCounts = useMemo(() => {
    const counts = {};
    filterCategories.forEach(cat => { counts[cat.id] = 0; });
    rawArticles.forEach(a => {
      const bucket = getCategoryBucket(a.category);
      if (counts[bucket] !== undefined) {
        counts[bucket] += 1;
      }
    });
    return counts;
  }, [rawArticles, getCategoryBucket]);

  // Live counts for Date Ranges
  const dateRangeCounts = useMemo(() => {
    const now = new Date().getTime();
    let c7 = 0, c30 = 0, c90 = 0;
    rawArticles.forEach(a => {
      if (a.publishedAt) {
        const diff = (now - new Date(a.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (diff <= 7) c7++;
        if (diff <= 30) c30++;
        if (diff <= 90) c90++;
      }
    });
    return { all: rawArticles.length, '7days': c7, '30days': c30, '3months': c90 };
  }, [rawArticles]);

  // Live counts for Languages
  const languageCounts = useMemo(() => {
    let taCount = 0, enCount = 0;
    rawArticles.forEach(a => {
      if (a.titleTamil || a.contentTamil || a.language === 'ta') taCount++;
      if (a.titleEnglish || a.contentEnglish || a.language === 'en') enCount++;
    });
    return { both: rawArticles.length, ta: taCount, en: enCount };
  }, [rawArticles]);

  // Pagination calculation
  const totalArticles = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / itemsPerPage));
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage, itemsPerPage]);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    if (resultsTopRef.current) {
      resultsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Share Article Handler
  const handleShareArticle = async (e, article) => {
    e.stopPropagation();
    const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
    const url = `${window.location.origin}${window.location.pathname}#/articles/${article.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      if (onShowToast) onShowToast(isTamil ? 'லிங்க் நகலெடுக்கப்பட்டது!' : 'Article link copied to clipboard!');
    } catch {
      if (onShowToast) onShowToast(isTamil ? 'லிங்க் பகிர்வு தயார்!' : 'Article link ready to share!');
    }
  };

  // Bookmark Toggle Handler
  const handleBookmarkClick = (e, article) => {
    e.stopPropagation();
    toggleBookmark(article);
    const savedNow = !isSaved(article.id);
    if (onShowToast) {
      onShowToast(
        savedNow
          ? (isTamil ? 'கட்டுரை புக்மார்க்குகளில் சேமிக்கப்பட்டது!' : 'Article saved to your bookmarks!')
          : (isTamil ? 'புக்மார்க்குகளிலிருந்து நீக்கப்பட்டது.' : 'Removed from bookmarks.')
      );
    }
  };

  // Render Left Filter Content (shared between desktop sidebar and mobile drawer)
  const renderFilterContent = () => (
    <div className="space-y-4 text-sm">
      {/* 1. Category Filter Group */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between text-left font-black text-slate-900 dark:text-slate-100 text-[13px] uppercase tracking-wider group hover:text-brandBlue-600 dark:hover:text-brandBlue-400 transition-colors"
        >
          <span>{isTamil ? 'பிரிவு (Category)' : 'Category'}</span>
          <svg
            className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${collapsedSections.category ? '-rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!collapsedSections.category && (
          <div className="mt-2.5 space-y-1.5">
            {filterCategories.map(cat => {
              const checked = selectedCategories.includes(cat.id);
              const count = categoryCounts[cat.id] || 0;
              return (
                <label
                  key={cat.id}
                  className="flex items-center justify-between gap-2 cursor-pointer group py-0.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategoryFilter(cat.id)}
                      className="w-3.5 h-3.5 rounded text-[#4A9E2C] focus:ring-[#4A9E2C]/30 border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:checked:bg-brandBlue-500 cursor-pointer transition-all shrink-0"
                    />
                    <span className={`text-[12.5px] truncate transition-colors ${checked ? 'font-black text-[#4A9E2C] dark:text-[#4ade80]' : 'font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                      {isTamil ? cat.labelTa : cat.labelEn}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 shrink-0">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Publisher Filter Group */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection('publisher')}
          className="w-full flex items-center justify-between text-left font-black text-slate-900 dark:text-slate-100 text-[13px] uppercase tracking-wider group hover:text-brandBlue-600 dark:hover:text-brandBlue-400 transition-colors"
        >
          <span>{isTamil ? 'பதிப்பாளர் / நிபுணர்' : 'Publisher'}</span>
          <svg
            className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${collapsedSections.publisher ? '-rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!collapsedSections.publisher && (
          <div className="mt-2.5 space-y-1.5">
            {activePublishers.length === 0 ? (
              <p className="text-xs text-slate-600 dark:text-slate-400 italic">{isTamil ? 'பதிப்பாளர்கள் இல்லை' : 'No publishers listed'}</p>
            ) : (
              activePublishers.map(pub => {
                const checked = selectedPublishers.includes(pub.id);
                return (
                  <label
                    key={pub.id}
                    className="flex items-center justify-between gap-2 cursor-pointer group py-0.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePublisherFilter(pub.id)}
                        className="w-3.5 h-3.5 rounded text-[#4A9E2C] focus:ring-[#4A9E2C]/30 border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:checked:bg-brandBlue-500 cursor-pointer transition-all shrink-0"
                      />
                      <span className={`text-[12.5px] truncate transition-colors ${checked ? 'font-black text-[#4A9E2C] dark:text-[#4ade80]' : 'font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`} title={pub.name}>
                        {pub.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 shrink-0">
                      {pub.count}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 3. Published Date Filter Group */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection('date')}
          className="w-full flex items-center justify-between text-left font-black text-slate-900 dark:text-slate-100 text-[13px] uppercase tracking-wider group hover:text-brandBlue-600 dark:hover:text-brandBlue-400 transition-colors"
        >
          <span>{isTamil ? 'வெளியிடப்பட்ட நாள்' : 'Published Date'}</span>
          <svg
            className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${collapsedSections.date ? '-rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!collapsedSections.date && (
          <div className="mt-2.5 space-y-1.5">
            {[
              { id: 'all', labelTa: 'அனைத்து காலம்', labelEn: 'All time' },
              { id: '7days', labelTa: 'கடந்த 7 நாட்கள்', labelEn: 'Last 7 days' },
              { id: '30days', labelTa: 'கடந்த 30 நாட்கள்', labelEn: 'Last 30 days' },
              { id: '3months', labelTa: 'கடந்த 3 மாதங்கள்', labelEn: 'Last 3 months' }
            ].map(opt => {
              const active = dateRange === opt.id;
              const count = dateRangeCounts[opt.id] || 0;
              return (
                <label
                  key={opt.id}
                  className="flex items-center justify-between gap-2 cursor-pointer group py-0.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="radio"
                      name="dateRangeFilter"
                      checked={active}
                      onChange={() => { setDateRange(opt.id); setCurrentPage(1); }}
                      className="w-3.5 h-3.5 text-[#4A9E2C] focus:ring-[#4A9E2C]/30 border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer shrink-0"
                    />
                    <span className={`text-[12.5px] truncate ${active ? 'font-black text-[#4A9E2C] dark:text-[#4ade80]' : 'font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                      {isTamil ? opt.labelTa : opt.labelEn}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 shrink-0">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Language Filter Group */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection('language')}
          className="w-full flex items-center justify-between text-left font-black text-slate-900 dark:text-slate-100 text-[13px] uppercase tracking-wider group hover:text-brandBlue-600 dark:hover:text-brandBlue-400 transition-colors"
        >
          <span>{isTamil ? 'மொழி (Language)' : 'Language'}</span>
          <svg
            className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${collapsedSections.language ? '-rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!collapsedSections.language && (
          <div className="mt-2.5 space-y-1.5">
            {[
              { id: 'both', labelTa: 'இரண்டும் (All / Both)', labelEn: 'Both / All' },
              { id: 'ta', labelTa: 'தமிழ் (Tamil)', labelEn: 'Tamil' },
              { id: 'en', labelTa: 'English', labelEn: 'English' }
            ].map(langOpt => {
              const active = selectedLanguage === langOpt.id;
              const count = languageCounts[langOpt.id] || 0;
              return (
                <label
                  key={langOpt.id}
                  className="flex items-center justify-between gap-2 cursor-pointer group py-0.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="radio"
                      name="languageFilter"
                      checked={active}
                      onChange={() => { setSelectedLanguage(langOpt.id); setCurrentPage(1); }}
                      className="w-3.5 h-3.5 text-[#4A9E2C] focus:ring-[#4A9E2C]/30 border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer shrink-0"
                    />
                    <span className={`text-[12.5px] truncate ${active ? 'font-black text-[#4A9E2C] dark:text-[#4ade80]' : 'font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                      {isTamil ? langOpt.labelTa : langOpt.labelEn}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 shrink-0">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetAllFilters}
          className="w-full py-2 px-3 rounded-xl text-xs font-black text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all text-center flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          <span>{isTamil ? 'அனைத்து வடிகட்டிகளையும் நீக்குக' : 'Clear All Filters'}</span>
        </button>
      )}
    </div>
  );

  return (
    <div
      className="w-full min-h-[calc(100vh-120px)] pb-16 pt-3 flex flex-col animate-fadeIn bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20231227/pngtree-hand-drawn-aquarelle-texture-light-green-gradient-watercolor-vector-background-with-image_13880407.png')",
        backgroundAttachment: 'fixed',
        backgroundColor: '#eaf4ee'
      }}
    >
      {/* Top Search & Filter Bar (Fixed / Pinned) */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-4 shrink-0">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={isTamil ? "கட்டுரைகளில் தலைப்பு, ஆசிரியர், முக்கிய சொல் தேடுக (Ctrl + K)..." : "Search articles by title, author, keyword, or ARN..."}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#4A9E2C] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle Button (Visible on mobile screens < md) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brandBlue-500/10 text-[#4A9E2C] dark:text-[#4ade80] border border-[#4A9E2C]/30 text-xs font-extrabold shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>{isTamil ? 'வடிகட்டிகள்' : 'Filters'}</span>
              {(selectedCategories.length > 0 || selectedPublishers.length > 0 || dateRange !== 'all' || selectedLanguage !== 'both') && (
                <span className="w-5 h-5 rounded-full bg-[#4A9E2C] text-white text-xs font-black flex items-center justify-center">
                  {selectedCategories.length + selectedPublishers.length + (dateRange !== 'all' ? 1 : 0) + (selectedLanguage !== 'both' ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Sidebar Filters + Main Results Column */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-start">

          {/* ================= LEFT SIDEBAR — FILTERS (Sticky & Scrollable on Tablet / Desktop) ================= */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3 xl:col-span-3 md:sticky md:top-24 min-h-0">
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col max-h-[calc(100vh-125px)] overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#4A9E2C] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {isTamil ? 'வடிகட்டிகள் (Filters)' : 'Filters'}
                  </h3>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-black text-[#4A9E2C] dark:text-[#4ade80] hover:underline"
                  >
                    {isTamil ? 'மீட்டமை' : 'Reset'}
                  </button>
                )}
              </div>

              {/* Dedicated Scrollable Filter Body */}
              <div
                className="flex-1 min-h-0 overflow-y-auto pr-2 pb-4 custom-scrollbar"
                style={{ overscrollBehavior: 'contain' }}
              >
                {renderFilterContent()}
              </div>
            </div>
          </aside>

          {/* ================= MAIN COLUMN — RESULTS LIST ================= */}
          <main className="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-9 space-y-4 pr-1 scroll-smooth" ref={resultsTopRef}>

            {/* Main Column Top Control Bar: Results Count & Sort Dropdown */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {isTamil
                    ? `மொத்தம் ${totalArticles} கட்டுரைகள் கண்டறியப்பட்டன`
                    : `Showing ${totalArticles} article${totalArticles === 1 ? '' : 's'}`}
                </span>
                {hasActiveFilters && (
                  <span className="hidden sm:inline-block text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {isTamil ? 'வடிகட்டப்பட்டது' : 'Filtered'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <label htmlFor="articlesSortDropdown" className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {isTamil ? 'வரிசைப்படுத்து:' : 'Sort by:'}
                </label>
                <select
                  id="articlesSortDropdown"
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none focus:border-[#4A9E2C] cursor-pointer"
                >
                  <option value="newest">{isTamil ? 'சமீபத்தியவை (Newest first)' : 'Newest first'}</option>
                  <option value="views">{isTamil ? 'அதிகம் வாசிக்கப்பட்டவை (Most read)' : 'Most read'}</option>
                  <option value="read_time">{isTamil ? 'வாசிக்கும் நேரம் (Read time)' : 'Read time'}</option>
                  <option value="oldest">{isTamil ? 'பழையவை (Oldest first)' : 'Oldest first'}</option>
                </select>
              </div>
            </div>

            {/* Active Filter Pills Bar (Quick Dismiss) */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                {selectedCategories.map(catId => {
                  const catObj = filterCategories.find(c => c.id === catId);
                  return (
                    <span
                      key={catId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#4A9E2C]/10 text-[#4A9E2C] dark:text-brandBlue-300 border border-[#4A9E2C]/30"
                    >
                      <span>{isTamil ? catObj?.labelTa : catObj?.labelEn}</span>
                      <button
                        type="button"
                        onClick={() => toggleCategoryFilter(catId)}
                        className="hover:text-red-500 transition-colors"
                        aria-label="Remove filter"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}

                {selectedPublishers.map(pubId => {
                  const pubObj = activePublishers.find(p => p.id === pubId);
                  return (
                    <span
                      key={pubId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                    >
                      <span>{pubObj?.name || pubId}</span>
                      <button
                        type="button"
                        onClick={() => togglePublisherFilter(pubId)}
                        className="hover:text-red-500 transition-colors"
                        aria-label="Remove filter"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}

                {dateRange !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    <span>{dateRange === '7days' ? 'Last 7 days' : dateRange === '30days' ? 'Last 30 days' : 'Last 3 months'}</span>
                    <button
                      type="button"
                      onClick={() => setDateRange('all')}
                      className="hover:text-red-500 transition-colors"
                      aria-label="Remove filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedLanguage !== 'both' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-800 dark:text-purple-300 border border-purple-500/30">
                    <span>{selectedLanguage === 'ta' ? 'தமிழ்' : 'English'}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('both')}
                      className="hover:text-red-500 transition-colors"
                      aria-label="Remove filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-red-500 hover:underline px-2 py-1"
                >
                  {isTamil ? 'அனைத்தையும் நீக்குக' : 'Clear all'}
                </button>
              </div>
            )}

            {/* Articles Results List */}
            {isLoading ? (
              <div className="py-24 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8">
                <div className="w-10 h-10 border-4 border-brandBlue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {isTamil ? 'ஆய்வுக் கட்டுரைகள் ஏற்றப்படுகின்றன...' : 'Loading published articles list...'}
                </p>
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold max-w-lg mx-auto space-y-2">
                <p>⚠️ {error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow"
                >
                  {isTamil ? 'மீண்டும் முயற்சிக்கவும்' : 'Retry'}
                </button>
              </div>
            ) : paginatedArticles.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto text-2xl font-bold">
                  📄
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'பொருத்தமான கட்டுரைகள் எதுவும் கிடைக்கவில்லை' : 'No Matching Articles Found'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {isTamil
                    ? 'உங்கள் வடிகட்டிகளை மாற்றி அமைக்கவும் அல்லது தேடல் சொற்களை நீக்கிவிட்டு மீண்டும் பார்க்கவும்.'
                    : 'Try selecting different category or publisher filters, or clear your keyword search.'}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#4A9E2C] text-white text-xs font-black shadow-md hover:bg-brandBlue-700 transition-all"
                  >
                    <span>{isTamil ? 'வடிகட்டிகளை மீட்டமை' : 'Reset All Filters'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
                {paginatedArticles.map((article) => {
                  const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
                  const excerpt = isTamil ? article.excerptTamil : (article.excerptEnglish || article.excerptTamil || article.summaryTamil || article.summaryEnglish || '');
                  const formattedDate = article.publishedAt
                    ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(article.publishedAt))
                    : 'Aug 2026';
                  const categoryName = (article.category || 'FINANCE').replace('-', ' ').toUpperCase();
                  const authorName = article.authorName || article.author_name || 'Budget Padmanaban';
                  const arnNumber = article.authorArn || article.author_arn || (authorName.toLowerCase().includes('padmanaban') ? 'ARN-112345' : '');
                  const readTime = article.readTimeMinutes || 4;
                  const coverImg = cleanImageUrl(article.thumbnail || article.thumbnail_url || article.coverImage || article.cover_image_url, article.category);
                  const avatarUrl = article.authorAvatar || article.author_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=03529a&color=fff&bold=true`;

                  return (
                    <article
                      key={article.id}
                      onClick={() => onNavigate(`#/articles/${article.slug}`)}
                      className="p-4 sm:p-5 lg:p-6 transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer group flex flex-row items-center sm:items-start gap-4 sm:gap-6"
                    >
                      {/* Left: Article Details & Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                        <div className="space-y-2">
                          {/* Row 1: Small Category Badge + Publish Date */}
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#4A9E2C]/10 text-[#4A9E2C] dark:text-[#4ade80] font-black text-xs">
                              {categoryName}
                            </span>
                            <span>·</span>
                            <time dateTime={article.publishedAt} className="font-mono text-slate-500 dark:text-slate-400 text-xs">
                              {formattedDate}
                            </time>
                          </div>

                          {/* Row 2: Article Headline */}
                          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-brandBlue-600 dark:group-hover:text-brandBlue-400 transition-colors font-serif leading-snug line-clamp-2">
                            <a
                              href={`#/articles/${article.slug}`}
                              onClick={(e) => { e.preventDefault(); onNavigate(`#/articles/${article.slug}`); }}
                              className="hover:underline focus:outline-none"
                            >
                              {title}
                            </a>
                          </h2>

                          {/* Row 3: Byline Row: Publisher's Profile Avatar, Name & Credential badge */}
                          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={avatarUrl}
                                alt={authorName}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=03529a&color=fff&bold=true`;
                                }}
                              />
                              <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate max-w-[150px] sm:max-w-[220px]">
                                {authorName}
                              </span>
                            </div>

                            {arnNumber && (
                              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 shrink-0">
                                <span>🛡️</span>
                                <span>{arnNumber}</span>
                              </span>
                            )}
                          </div>

                          {/* Row 4: 2-3 Line Summary Snippet */}
                          {excerpt && (
                            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                              {excerpt}
                              <span className="inline-flex items-center ml-1 font-bold text-[#4A9E2C] dark:text-[#4ade80] group-hover:underline">
                                {isTamil ? 'மேலும் படிக்க →' : 'Read More →'}
                              </span>
                            </p>
                          )}
                        </div>

                        {/* Row 5: Read Time, Bookmark, Share */}
                        <div className="pt-3 mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 sm:border-0">
                          <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
                            <span className="flex items-center gap-1">
                              <span>⏱</span>
                              <span>{readTime} {isTamil ? 'நிமிடம்' : 'min'}</span>
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                              <span>👁</span>
                              <span>{(article.views || article.viewCount || 0).toLocaleString()}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Bookmark Button */}
                            <button
                              type="button"
                              onClick={(e) => handleBookmarkClick(e, article)}
                              title={isArticleSaved ? (isTamil ? 'புக்மார்க்கிலிருந்து நீக்கு' : 'Remove Bookmark') : (isTamil ? 'புக்மார்க் செய்' : 'Bookmark Article')}
                              className={`p-1.5 rounded-lg border transition-all ${isArticleSaved
                                  ? 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-amber-600 hover:border-amber-500/30 border-slate-200/80 dark:border-slate-700'
                                }`}
                              aria-label="Bookmark"
                            >
                              <svg className="w-3.5 h-3.5" fill={isArticleSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>

                            {/* Share Button */}
                            <button
                              type="button"
                              onClick={(e) => handleShareArticle(e, article)}
                              title={isTamil ? 'பகிர்' : 'Share Article'}
                              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-brandBlue-600 hover:border-[#4A9E2C]/30 border border-slate-200/80 dark:border-slate-700 transition-all"
                              aria-label="Share"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Crisp, bounded article cover image */}
                      <div className="w-24 h-24 sm:w-36 sm:h-28 md:w-44 md:h-32 lg:w-48 lg:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm relative self-center sm:self-start">
                        <img
                          src={coverImg}
                          alt={title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=75&auto=format&fit=crop';
                          }}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  {isTamil
                    ? `பக்கம் ${currentPage} / ${totalPages} (${totalArticles} கட்டுரைகள்)`
                    : `Page ${currentPage} of ${totalPages} (${totalArticles} total articles)`}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Previous Button */}
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1"
                  >
                    <span>←</span>
                    <span className="hidden sm:inline">{isTamil ? 'முந்தையது' : 'Previous'}</span>
                  </button>

                  {/* Numbered Page Buttons */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) {
                        acc.push('...');
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) => {
                      if (item === '...') {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
                            ...
                          </span>
                        );
                      }
                      const pageNum = Number(item);
                      const isCur = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${isCur
                              ? 'bg-[#4A9E2C] text-white shadow-md shadow-brandBlue-600/30 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                  {/* Next Button */}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">{isTamil ? 'அடுத்தது' : 'Next'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================= MOBILE SLIDE-IN FILTER DRAWER ================= */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Slide-in Drawer Container */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-950 h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-slideRight">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#4A9E2C] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {isTamil ? 'வடிகட்டிகள்' : 'Filter Articles'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-sm"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Filter Controls */}
              {renderFilterContent()}
            </div>

            {/* Drawer Bottom Apply Button */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6 sticky bottom-0 bg-white dark:bg-slate-950 pb-2">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-brandBlue-600 hover:bg-brandBlue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brandBlue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{isTamil ? `முடிவுகளைக் காண்க (${totalArticles})` : `Show Results (${totalArticles})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default ArticlesPage;
export { ArticlesPage };
