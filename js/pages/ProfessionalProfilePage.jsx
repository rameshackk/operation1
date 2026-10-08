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
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
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
    <div className="w-full min-h-[calc(100vh-140px)] py-8 transition-colors duration-300 relative bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => onNavigate && onNavigate('#/professionals')}
        className="btn-magnetic px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:bg-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <span>←</span>
        <span>{isTamil ? 'அனைத்து நிபுணர்கள் பட்டியல்' : 'Back to Advisors Directory'}</span>
      </button>

      {/* 1. IDENTITY HERO BANNER */}
      <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-xl">
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
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-1">
                <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location} {prof.arnNumber && `• AMFI Registration ARN: ${prof.arnNumber}`}</span>
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
                  <svg className="w-4 h-4 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.477-.15-.678.15-.2.301-.778.98-1.028 1.206-.251.226-.452.251-.753.1-.301-.15-1.272-.469-2.423-1.496-.897-.799-1.503-1.786-1.68-2.086-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.101-.201.05-.376-.025-.526-.075-.15-.678-1.635-.929-2.238-.244-.588-.493-.508-.678-.517-.175-.01-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.029-1.054 2.509c0 1.48 1.079 2.909 1.23 3.11.15.201 2.123 3.242 5.143 4.547.719.311 1.28.497 1.718.636.723.23 1.381.197 1.901.12.579-.086 1.78-.727 2.032-1.43.251-.703.251-1.305.175-1.43-.075-.126-.276-.201-.577-.351z" />
                    <path d="M12.004 0C5.373 0 0 5.373 0 12.004c0 2.115.548 4.103 1.51 5.836L.062 23.938l6.273-1.411a11.947 11.947 0 005.669 1.481h.005c6.63 0 12.003-5.374 12.003-12.004 0-3.208-1.25-6.223-3.518-8.492C18.226 1.244 15.212 0 12.004 0zm0 21.993h-.004a9.94 9.94 0 01-5.074-1.393l-.364-.216-3.771.849.865-3.676-.237-.378a9.92 9.92 0 01-1.523-5.175c0-5.488 4.467-9.956 9.957-9.956 2.658 0 5.158 1.036 7.038 2.916 1.88 1.88 2.915 4.38 2.915 7.038 0 5.489-4.468 9.957-9.802 9.957z" />
                  </svg>
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
                  <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
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
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
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
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
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
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{(article.views || article.viewCount || 0).toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{article.readTimeMinutes} min read</span>
                      </span>
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
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
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
