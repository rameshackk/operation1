import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { professionalsData, videosData } from '../data/translations.js';
import { normalizeVideoRow, translateVideo } from '../services/api.js';
import { normalizeSocialUrl, updateHeadTags, SITE_URL } from '../utils/formatters.js';
import ProfessionalWidescreenVideoCard from './ProfessionalWidescreenVideoCard.jsx';
import CinemaTheaterModal from './CinemaTheaterModal.jsx';

function ProfessionalProfilePage({ professionalId, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [activeTab, setActiveTab] = useState('articles');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 1. Instant Cache-First Initialization
  const [livePublisher, setLivePublisher] = useState(() => {
    try {
      const cached = localStorage.getItem('muthaleetu_publishers_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const match = parsed.find(p => p.id === professionalId || p.arn_number === professionalId);
          if (match) return match;
        }
      }
    } catch (_) { }
    return null;
  });
  const [liveArticles, setLiveArticles] = useState([]);
  const [liveVideos, setLiveVideos] = useState([]);
  const [brandVideos, setBrandVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(() => !livePublisher);

  // Fetch publisher data by ID from /api/publishers?id=...
  useEffect(() => {
    let isMounted = true;
    async function loadPublisherDetail() {
      try {
        const res = await fetch(`/api/publishers?id=${encodeURIComponent(professionalId)}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.data) {
            setLivePublisher(json.data);
            if (Array.isArray(json.data.articles)) {
              setLiveArticles(json.data.articles);
            }
            if (Array.isArray(json.data.videos)) {
              setLiveVideos(json.data.videos);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch publisher details:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadPublisherDetail();
    return () => { isMounted = false; };
  }, [professionalId]);

  // Fallback to static seed data ONLY IF professionalId matches seed data
  const seedProf = professionalsData.find(p => p.id === professionalId || p.slug === professionalId);

  const prof = useMemo(() => {
    if (livePublisher) {
      return {
        id: livePublisher.id,
        nameEnglish: livePublisher.display_name || 'AMFI Registered Distributor',
        nameTamil: livePublisher.display_name || 'AMFI பதிவுசெய்த விநியோகஸ்தர்',
        titleEnglish: livePublisher.title || 'AMFI Registered Mutual Fund Distributor',
        titleTamil: livePublisher.title || 'பதிவுசெய்யப்பட்ட மியூச்சுவல் ஃபண்ட் விநியோகஸ்தர்',
        organization: 'Fortune Investment Services (FISPL Partner)',
        arnNumber: livePublisher.arn_number || '',
        avatar: livePublisher.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(livePublisher.display_name || 'MFD')}&background=f59e0b&color=0f172a&bold=true`,
        badgeEnglish: 'AMFI REGISTERED MFD',
        badgeTamil: 'சரிபார்க்கப்பட்ட விநியோகஸ்தர்',
        locationEnglish: 'Tamil Nadu, India',
        locationTamil: 'தமிழ்நாடு, இந்தியா',
        experience: 'AMFI Certified',
        fullBioEnglish: livePublisher.bio || 'Certified AMFI mutual fund distributor dedicated to investor financial freedom and long-term compounding.',
        fullBioTamil: livePublisher.bio_ta || livePublisher.bio || 'முதலீட்டாளர்களின் நிதி சுதந்திரம் மற்றும் நீண்ட கால செல்வ உருவாக்கத்திற்கு வழிகாட்டும் AMFI அங்கீகாரம் பெற்ற விநியோகஸ்தர்.',
        specializations: Array.isArray(livePublisher.specialties)
          ? livePublisher.specialties.map(s => ({ en: s, ta: s }))
          : [{ en: 'Mutual Funds', ta: 'மியூச்சுவல் ஃபண்ட்' }, { en: 'Equity SIPs', ta: 'ஈக்விட்டி SIP' }],
        whatsapp: livePublisher.whatsapp_number || livePublisher.phone || '',
        socialLinks: {
          linkedin: normalizeSocialUrl(livePublisher.linkedin_url, 'linkedin'),
          twitter: normalizeSocialUrl(livePublisher.twitter_url, 'twitter'),
          youtube: normalizeSocialUrl(livePublisher.youtube_url, 'youtube', livePublisher.youtube_channel_id),
          website: livePublisher.website_url ? (livePublisher.website_url.startsWith('http') ? livePublisher.website_url : `https://${livePublisher.website_url}`) : ''
        }
      };
    }
    return seedProf || null;
  }, [livePublisher, seedProf]);

  useEffect(() => {
    if (prof) {
      const pName = isTamil ? (prof.nameTamil || prof.nameEnglish) : (prof.nameEnglish || prof.nameTamil);
      const pBio = isTamil ? (prof.fullBioTamil || prof.fullBioEnglish) : (prof.fullBioEnglish || prof.fullBioTamil);
      const pCover = prof.avatar || `${SITE_URL}/assets/logo.png`;
      const arnText = prof.arnNumber ? ` (ARN: ${prof.arnNumber})` : '';

      updateHeadTags({
        title: `${pName}${arnText} - AMFI Registered Mutual Fund Distributor | முதலீட்டு திசை`,
        description: (pBio || '').slice(0, 160),
        canonical: `${SITE_URL}/professionals/${prof.id || professionalId}`,
        ogTitle: `${pName}${arnText} | முதலீட்டு திசை`,
        ogDescription: (pBio || '').slice(0, 200),
        ogImage: pCover,
        ogUrl: `${SITE_URL}/professionals/${prof.id || professionalId}`,
        ogType: 'profile'
      });
    }
  }, [prof, professionalId, isTamil]);

  // Skeleton state while profile is loading
  if (isLoading && !prof) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        <div className="w-36 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-3xl bg-slate-800 shrink-0" />
          <div className="space-y-4 flex-1 w-full text-center md:text-left">
            <div className="w-1/3 h-8 bg-slate-800 rounded-lg mx-auto md:mx-0" />
            <div className="w-1/4 h-4 bg-slate-800 rounded mx-auto md:mx-0" />
            <div className="w-full h-12 bg-slate-800 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Not Found state
  if (!prof) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
          {isTamil ? 'விநியோகஸ்தர் சுயவிவரம் கிடைக்கவில்லை' : 'Distributor Profile Not Found'}
        </h2>
        <p className="text-sm text-slate-500">
          {isTamil ? 'கோரப்பட்ட விநியோகஸ்தர் விவரங்கள் கிடைக்கவில்லை அல்லது நீக்கப்பட்டு இருக்கலாம்.' : 'The requested distributor profile may have been removed or does not exist.'}
        </p>
        <a
          href="/professionals"
          onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('/professionals'); }}
          className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          {isTamil ? 'அனைத்து விநியோகஸ்தர்கள் பட்டியல்' : 'Back to Distributors Directory'}
        </a>
      </div>
    );
  }

  const name = isTamil ? prof.nameTamil : prof.nameEnglish;
  const title = isTamil ? prof.titleTamil : prof.titleEnglish;
  const fullBio = isTamil ? prof.fullBioTamil : prof.fullBioEnglish;
  const badge = isTamil ? prof.badgeTamil : prof.badgeEnglish;
  const location = isTamil ? prof.locationTamil : prof.locationEnglish;

  // Only return live articles from database — no dead dummy links
  const publisherArticles = useMemo(() => {
    if (liveArticles && liveArticles.length > 0) {
      return liveArticles.map(a => ({
        id: a.id,
        slug: a.slug,
        title: isTamil && (a.title_ta || a.titleTa) ? (a.title_ta || a.titleTa) : (a.title || a.titleEnglish),
        titleTa: a.title_ta || a.titleTa,
        summary: isTamil && (a.summary_ta || a.summaryTa) ? (a.summary_ta || a.summaryTa) : (a.summary || a.summaryEnglish || a.excerpt || a.excerptEnglish || ''),
        summaryTa: a.summary_ta || a.summaryTa,
        coverImage: a.coverImage || a.cover_image_url || a.cover_image || a.thumbnail || a.image_url || '/favicon.svg',
        category: a.category || 'mutual-fund',
        views: a.views || a.view_count || a.viewCount || 0,
        readTimeMinutes: a.read_time_minutes || a.readTimeMinutes || 4,
        publishedAt: a.published_at || a.publishedAt || a.created_at,
        author: a.author_name || a.authorName || name,
        authorName: a.author_name || a.authorName || name,
        authorAvatar: a.author_avatar || a.authorAvatar || prof.avatar,
        authorArn: a.author_arn || a.authorArn || prof.arnNumber
      }));
    }
    return [];
  }, [liveArticles, prof, language, isTamil, name]);

  // Main brand channel videos carry no source_publisher_id, so /api/publishers returns
  // none for that profile — pull them straight from the catalog endpoint instead.
  const isBrandProfile = prof.id === 'budget-padmanaban' || !livePublisher ||
    (prof.nameEnglish && prof.nameEnglish.toLowerCase().includes('padmanaban'));

  useEffect(() => {
    if (!isBrandProfile || (liveVideos && liveVideos.length > 0)) return;
    let isMounted = true;
    fetch('/api/videos?limit=48&sort=newest')
      .then(res => (res.ok ? res.json() : null))
      .then(json => {
        if (isMounted && json && json.status === 'success' && Array.isArray(json.data)) {
          setBrandVideos(json.data.map(normalizeVideoRow));
        }
      })
      .catch(err => console.warn('Brand channel videos API fallback:', err));
    return () => { isMounted = false; };
  }, [isBrandProfile, liveVideos]);

  const publisherVideos = useMemo(() => {
    if (liveVideos && liveVideos.length > 0) {
      return liveVideos.map(v => translateVideo(v, language));
    }
    if (brandVideos.length > 0) {
      return brandVideos.map(v => translateVideo(v, language));
    }
    if (isBrandProfile) {
      return videosData.slice(0, 48).map(v => translateVideo(v, language));
    }
    return [];
  }, [liveVideos, brandVideos, isBrandProfile, language]);

  const cleanWhatsApp = (prof.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <div className="w-full min-h-[calc(100vh-140px)] py-8 transition-colors duration-300 relative" style={{ backgroundColor: '#23645C' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => onNavigate && onNavigate('#/professionals')}
        className="btn-magnetic px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <span>←</span>
        <span>{isTamil ? 'அனைத்து நிபுணர்கள் பட்டியல்' : 'Back to Advisors Directory'}</span>
      </button>

      {/* 1. IDENTITY HERO BANNER */}
      <div className="relative rounded-3xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 sm:gap-8">
          {/* Portrait Avatar */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            <img
              src={prof.avatar}
              alt={name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-2 border-amber-500 shadow-xl"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=0f172a&bold=true`;
              }}
            />
            {prof.experience && (
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/40 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 shadow-md">
                {prof.experience}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">{name}</h1>
              <span className="px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
                {badge}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400/90 font-mono">
                {title} • {prof.organization}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                📍 {location} {prof.arnNumber && `• AMFI Registration ARN: ${prof.arnNumber}`}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl font-medium">
              {fullBio}
            </p>

            {/* Specialization Tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
              {prof.specializations?.map((spec, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-amber-300 border border-slate-200 dark:border-amber-500/20 text-xs font-bold shadow-sm"
                >
                  {isTamil ? (spec.ta || spec.en) : spec.en}
                </span>
              ))}
            </div>

            {/* Action Buttons: WhatsApp Direct Consultation + Social Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-3">
              {cleanWhatsApp && (
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${name}, I read your profile on Muthaleetu Thisai and would like to request an investment consultation.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <span className="text-sm">💬</span>
                  <span>{isTamil ? 'வாட்ஸ்அப் வழியே ஆலோசனை பெறுக' : 'Direct WhatsApp Consultation'}</span>
                </a>
              )}

              {prof.socialLinks?.website && (
                <a
                  href={prof.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-amber-600 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>🌐</span>
                  <span>{isTamil ? 'வலைத்தளம்' : 'Website'}</span>
                </a>
              )}
              {prof.socialLinks?.youtube && (
                <a
                  href={prof.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-red-600 hover:text-white text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>▶</span>
                  <span>YouTube</span>
                </a>
              )}
              {prof.socialLinks?.linkedin && (
                <a
                  href={prof.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>in</span>
                  <span>LinkedIn</span>
                </a>
              )}
              {prof.socialLinks?.twitter && (
                <a
                  href={prof.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>𝕏</span>
                  <span>Twitter / X</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEED TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'articles'
              ? 'bg-[#4A9E2C] text-white shadow-md'
              : 'text-slate-700 dark:text-slate-400 bg-white/70 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
        >
          <span>✍️</span>
          <span>{isTamil ? 'கட்டுரைகள் & ஆய்வுகள்' : 'Articles & Research'}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-black ${activeTab === 'articles' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#4A9E2C] dark:text-emerald-400'
            }`}>
            {publisherArticles.length}
          </span>
        </button>

        {publisherVideos.length > 0 && (
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'videos'
                ? 'bg-[#03529A] text-white shadow-md'
                : 'text-slate-700 dark:text-slate-400 bg-white/70 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
          >
            <span>🎬</span>
            <span>{isTamil ? 'முக்கிய வீடியோக்கள் (Masterclasses)' : 'Video Masterclasses'}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${activeTab === 'videos' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#4A9E2C] dark:text-emerald-400'
              }`}>
              {publisherVideos.length}
            </span>
          </button>
        )}
      </div>

      {/* 3. FEED CONTENT */}

      {activeTab === 'videos' && publisherVideos.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-bold">
                {isTamil ? `${name} அவர்களின் வீடியோ வழிகாட்டிகள் (${publisherVideos.length})` : `Video masterclasses by ${name} (${publisherVideos.length})`}
              </p>
              {prof.socialLinks?.youtube && (
                <a
                  href={prof.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:underline"
                >
                  <span>▶</span>
                  <span>{isTamil ? 'அனைத்து வீடியோக்களும் YouTube-ல்' : 'View on YouTube'} →</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {publisherVideos.map((video, idx) => (
                <ProfessionalWidescreenVideoCard
                  key={video.id || idx}
                  video={video}
                  onSelect={(v) => setSelectedVideo(v)}
                  language={language}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="space-y-6">
          {publisherArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {publisherArticles.map(article => (
                <div
                  key={article.id || article.slug}
                  onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                      <img
                        src={article.coverImage || '/favicon.svg'}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/favicon.svg'; }}
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 text-xs font-extrabold uppercase rounded-md bg-slate-950/85 text-amber-400">
                        {(article.category || 'FINANCE').replace('-', ' ')}
                      </span>
                      <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-black uppercase rounded-md bg-amber-500 text-slate-950 font-black">
                        ORIGINAL
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      {article.summary && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                          {article.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <div className="flex items-center gap-2.5 font-mono">
                      <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                        👁 {(article.views || article.viewCount || 0).toLocaleString()}
                      </span>
                      <span>⏱ {article.readTimeMinutes} min read</span>
                    </div>
                    <span className="text-amber-800 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                      {isTamil ? 'படிக்க' : 'Read Article'} →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 max-w-xl mx-auto">
              <div className="text-3xl">✍️</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                {isTamil ? `${name} - கட்டுரைகள்` : `${name} - Articles & Research`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {isTamil
                  ? 'இந்த விநியோகஸ்தர் வெளியிடும் புதிய கட்டுரைகள் மற்றும் முதலீட்டு வழிகாட்டல்கள் விரைவில் இந்த பக்கத்தில் பிரசுரிக்கப்படும்.'
                  : 'Articles and educational guides published by this mutual fund distributor will appear here.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Video Cinema Modal */}
      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={publisherVideos}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(rel) => setSelectedVideo(rel)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
      </div>
    </div>
  );
}


export default ProfessionalProfilePage;
export { ProfessionalProfilePage };
