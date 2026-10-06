import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { translateVideo } from '../services/api.js';
import { videosData } from '../data/translations.js';

function extractYoutubeId(val) {
  if (!val || typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : (trimmed.length === 11 ? trimmed : '');
}

function CinemaTheaterModal({
  video,
  allVideos = [],
  onClose,
  onSelectRelated,
  language = 'ta',
  onShowToast
}) {
  const { session } = useAuth();
  const isTamil = language === 'ta';
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'takeaways' | 'tools'
  const [sidebarFilter, setSidebarFilter] = useState('all'); // 'all' | 'category' | 'shorts'
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  if (!video) return null;

  const youtubeId = extractYoutubeId(video.youtubeId || video.youtube_id || video.id || video.youtubeUrl || video.youtube_url) || 'GizYMQfl9CY';
  const embedUrl = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1` : '';
  const youtubeWatchUrl = video.youtubeUrl || video.youtube_url || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : '');

  const title = isTamil
    ? (video.titleTamil || video.title)
    : (video.titleEnglish || video.title);
  const description = isTamil
    ? (video.descriptionTamil || video.description)
    : (video.descriptionEnglish || video.description);

  const rawVideos = (allVideos && allVideos.length > 0 ? allVideos : (typeof videosData !== 'undefined' ? videosData : []));

  const filteredPlaylist = useMemo(() => {
    let list = rawVideos.filter(v => v.id !== video.id);
    if (sidebarFilter === 'category' && video.category) {
      list = list.filter(v => v.category === video.category);
    } else if (sidebarFilter === 'shorts') {
      list = list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts')));
    }
    if (sidebarSearch.trim()) {
      const q = sidebarSearch.toLowerCase();
      list = list.filter(v =>
        (v.titleTamil && v.titleTamil.toLowerCase().includes(q)) ||
        (v.titleEnglish && v.titleEnglish.toLowerCase().includes(q)) ||
        (v.title && v.title.toLowerCase().includes(q)) ||
        (v.category && v.category.toLowerCase().includes(q))
      );
    }
    return list.slice(0, 25).map(v => (typeof translateVideo === 'function' ? translateVideo(v, language) : v));
  }, [rawVideos, video.id, video.category, sidebarFilter, sidebarSearch, language]);

  const handleShare = async () => {
    const shareUrl = youtubeWatchUrl || window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        if (onShowToast) onShowToast(isTamil ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[999999] w-screen h-screen bg-[#070b14] flex flex-col overflow-hidden text-white animate-fadeIn"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 999999 }}
    >
      {/* 1. CINEMA STUDIO NAVIGATION BAR */}
      <div className="h-12 sm:h-14 bg-[#090e1a] border-b border-slate-800/90 flex items-center justify-between px-3 sm:px-6 shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-all text-xs font-black border border-slate-700 shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">{isTamil ? 'அனைத்து வீடியோக்கள்' : 'Back to Videos'}</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 truncate min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider shrink-0">
              {(video.category || 'FINANCE').replace('-', ' ')}
            </span>
            <span className="text-xs text-slate-300 font-bold truncate hidden md:inline">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleShare}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>{copied ? '✓' : (isTamil ? 'பகிர்' : 'Share')}</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Exit Fullscreen"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold border border-slate-700"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. STUDIO SPLIT VIEW (LEFT STAGE + RIGHT PLAYLIST) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">

        {/* LEFT COLUMN: Large HD Cinema Stage & Interactive Tabs (8 Cols on LG, 9 on XL) */}
        <main className="lg:col-span-8 xl:col-span-9 flex flex-col min-h-0 bg-[#040711] overflow-y-auto">
          {/* 16:9 Video Canvas Frame */}
          <div className="w-full bg-black flex items-center justify-center p-0 sm:p-2 lg:p-4 shrink-0 shadow-2xl">
            <div className="w-full max-w-5xl aspect-video max-h-[55vh] sm:max-h-[62vh] rounded-none sm:rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-900">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 dark:text-slate-400">
                  <span>Video player unavailable</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Information & Details Container */}
          <div className="p-5 sm:p-8 space-y-6 max-w-5xl">
            {/* Title & Channel Header */}
            <div className="space-y-3 border-b border-slate-800/80 pb-5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif text-white leading-snug tracking-tight">
                {title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                {/* Channel Pill */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
                    BP
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">
                        {video.channelName || 'Budget Padmanaban'}
                      </span>
                      <span className="text-emerald-400 text-xs font-bold" title="CFP Certified">✓ CFP®</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Certified Financial Planner • Video Masterclasses
                    </p>
                  </div>
                </div>

                {/* Meta stats */}
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold">{video.views ? `${video.views.toLocaleString()} views` : 'Masterclass'}</span>
                  <span>•</span>
                  <span>{video.duration || '12:00'}</span>
                  {video.publishedAt && (
                    <>
                      <span>•</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Tabs Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'overview'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800'
                  }`}
              >
                {isTamil ? '📖 விளக்கம் & விவரங்கள்' : '📖 Overview & Details'}
              </button>

              <button
                onClick={() => setActiveTab('takeaways')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'takeaways'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800'
                  }`}
              >
                {isTamil ? '💡 முக்கிய ஆலோசனைகள்' : '💡 Key Takeaways'}
              </button>

              <button
                onClick={() => setActiveTab('tools')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'tools'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800'
                  }`}
              >
                {isTamil ? '🧮 SIP கால்குலேட்டர்' : '🧮 SIP Calculator'}
              </button>
            </div>

            {/* Tab Content Display */}
            {activeTab === 'overview' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line space-y-4">
                <p>{description || (isTamil ? 'இந்த வீடியோவிற்கான விளக்கம் விரைவில் புதுப்பிக்கப்படும்.' : 'No detailed description available.')}</p>
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-amber-400 border border-slate-800">
                    #{(video.category || 'finance').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-800">
                    #BudgetPadmanaban
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-800">
                    #MutualFunds
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-800">
                    #SIPCompounding
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'takeaways' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
                <h3 className="text-sm font-bold text-amber-400">
                  {isTamil ? 'பட்ஜெட் பத்மநாபன் CFP® முக்கிய ஆலோசனைகள்:' : 'Core Principles & Financial Takeaways:'}
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    <span>{isTamil ? 'நீண்ட கால கூட்டு வட்டி (Compounding) பயனை முழுமையாகப் பயன்படுத்த ஒழுங்கான SIP முதலீட்டை தொடரவும்.' : 'Maintain disciplined SIP investments to harness long-term compounding benefits.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    <span>{isTamil ? 'சந்தையின் குறுகிய கால ஏற்ற இறக்கங்களைப் பார்த்து அவசரப்பட்டு முதலீட்டை திரும்பப் பெறாதீர்கள்.' : 'Avoid emotional exits during market corrections; stay focused on your financial goals.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    <span>{isTamil ? 'உங்கள் குடும்பத்தின் மருத்துவ காப்பீடு மற்றும் அவசர கால நிதியை எப்போதும் உறுதி செய்யுங்கள்.' : 'Ensure adequate health insurance and 6-month emergency reserve before investing.'}</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/30 space-y-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">
                    {isTamil ? 'உங்கள் SIP இலக்கை உடனடியாகக் கணக்கிடுங்கள்' : 'Calculate Your SIP Wealth Growth'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isTamil ? '₹5,000 மாத SIP முதலீட்டின் 10-15 வருட கூட்டு வட்டி வளர்ச்சி மதிப்பை அறியுங்கள்.' : 'Simulate your future portfolio returns with our interactive compounding tool.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose && onClose();
                    window.location.hash = '#/calculator';
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 whitespace-nowrap transition-transform hover:scale-105 shrink-0"
                >
                  {isTamil ? 'கால்குலேட்டரைத் திறக்க →' : 'Launch SIP Calculator →'}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT COLUMN: Interactive Playlist & Search Sidebar (4 Cols on LG, 3 on XL) */}
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col min-h-0 bg-[#090e1a] overflow-hidden">
          {/* Sidebar Header with Filter Tabs & Search */}
          <div className="p-3.5 border-b border-slate-800 bg-[#070b14] space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{isTamil ? 'அடுத்த வீடியோக்கள்' : 'Up Next & Playlist'}</span>
              </h2>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                {filteredPlaylist.length} {isTamil ? 'பதிவுகள்' : 'items'}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSidebarFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${sidebarFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800'
                  }`}
              >
                {isTamil ? 'அனைத்தும்' : 'All'}
              </button>
              <button
                onClick={() => setSidebarFilter('category')}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${sidebarFilter === 'category'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800'
                  }`}
              >
                {isTamil ? 'இதே பிரிவு' : 'Same Category'}
              </button>
              <button
                onClick={() => setSidebarFilter('shorts')}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${sidebarFilter === 'shorts'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800'
                  }`}
              >
                Shorts
              </button>
            </div>

            {/* Search within playlist */}
            <div className="relative">
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder={isTamil ? 'வீடியோக்களைத் தேடுங்கள்...' : 'Filter playlist...'}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
              {sidebarSearch && (
                <button
                  onClick={() => setSidebarSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Playlist Cards */}
          <div className="p-3 space-y-2 overflow-y-auto flex-1 divide-y divide-slate-800/40">
            {filteredPlaylist.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                {isTamil ? 'வீடியோக்கள் எதுவும் கிடைக்கவில்லை' : 'No matching videos found'}
              </div>
            ) : (
              filteredPlaylist.map((rel) => {
                const relTitle = isTamil
                  ? (rel.titleTamil || rel.title)
                  : (rel.titleEnglish || rel.title);

                return (
                  <div
                    key={`theater-related-${rel.id}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectRelated && onSelectRelated(rel)}
                    className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/90 border border-transparent hover:border-amber-500/40 transition-all cursor-pointer pt-3 first:pt-1"
                  >
                    <div className="relative w-28 sm:w-32 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-950 shadow">
                      <img
                        src={rel.thumbnail || `https://img.youtube.com/vi/${rel.youtubeId}/hqdefault.jpg`}
                        alt={relTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-xs font-mono font-bold text-slate-200">
                        {rel.duration || '12:00'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 line-clamp-2 leading-tight transition-colors">
                        {relTitle}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <span className="text-amber-500 font-semibold uppercase text-xs">
                          {(rel.category || 'FINANCE').replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
}

/**
 * HOME CINEMA VIDEO SHOWCASE (COMPACT SLEEK GRID ON HOMEPAGE)
 */

export default CinemaTheaterModal;
export { CinemaTheaterModal };
