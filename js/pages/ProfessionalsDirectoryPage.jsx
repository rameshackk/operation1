import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { professionalsData } from '../data/translations.js';
import { updateHeadTags, SITE_URL } from '../utils/formatters.js';

function ProfessionalsDirectoryPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const isTamil = language === 'ta';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    updateHeadTags({
      title: isTamil ? 'AMFI பதிவுசெய்த விநியோகஸ்தர்கள் | முதலீட்டு திசை' : 'AMFI Registered Mutual Fund Distributors Directory | Muthaleetu Thisai',
      description: isTamil
        ? 'தமிழ்நாடு மற்றும் இந்தியாவின் AMFI பதிவுசெய்த மியூச்சுவல் ஃபண்ட் விநியோகஸ்தர்களின் அதிகாரப்பூர்வ பட்டியல்.'
        : 'Official directory of AMFI Registered Mutual Fund Distributors across Tamil Nadu and India.',
      canonical: `${SITE_URL}/professionals`,
      ogTitle: isTamil ? 'AMFI பதிவுசெய்த விநியோகஸ்தர்கள் | முதலீட்டு திசை' : 'AMFI Registered Mutual Fund Distributors Directory',
      ogDescription: isTamil
        ? 'தமிழ்நாடு மற்றும் இந்தியாவின் AMFI பதிவுசெய்த மியூச்சுவல் ஃபண்ட் விநியோகஸ்தர்களின் அதிகாரப்பூர்வ பட்டியல்.'
        : 'Official directory of AMFI Registered Mutual Fund Distributors across Tamil Nadu and India.',
      ogImage: `${SITE_URL}/assets/logo.png`,
      ogUrl: `${SITE_URL}/professionals`
    });
  }, [isTamil]);

  // 1. Instant Cache-First Initialization (Zero render delay)
  const [livePublishers, setLivePublishers] = useState(() => {
    try {
      const cached = localStorage.getItem('muthaleetu_publishers_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) { }
    return [];
  });
  const [isLoading, setIsLoading] = useState(() => livePublishers.length === 0);

  // Fetch live publishers from PostgreSQL /api/publishers with background cache sync
  useEffect(() => {
    let isMounted = true;
    async function loadPublishers(forceFresh = false) {
      try {
        const url = forceFresh ? `/api/publishers?t=${Date.now()}` : '/api/publishers';
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.data && Array.isArray(json.data)) {
            setLivePublishers(json.data);
            try {
              localStorage.setItem('muthaleetu_publishers_cache', JSON.stringify(json.data));
            } catch (_) { }
          }
        }
      } catch (err) {
        console.warn('Could not fetch live publishers:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadPublishers();

    const handleUpdate = () => loadPublishers(true);
    window.addEventListener('publisher-profile-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('publisher-profile-updated', handleUpdate);
    };
  }, []);

  const categories = [
    { id: 'all', labelTa: 'அனைத்து நிபுணர்கள்', labelEn: 'All Distributors' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & சந்தை', labelEn: 'Mutual Funds & SIP' },
    { id: 'fintech', labelTa: 'தொழில்நுட்பம் & உத்திகள்', labelEn: 'Tech & Strategy' },
    { id: 'research', labelTa: 'ஈக்விட்டி & ஃபண்ட் ஆராய்ச்சி', labelEn: 'Fund Research' },
    { id: 'client-services', labelTa: 'தனிநபர் நிதி & சேவைகள்', labelEn: 'Personal Wealth Desk' }
  ];

  // Merge live database publishers with platform seed professionals
  const allPublishers = useMemo(() => {
    const list = [];
    const seenIds = new Set();
    const seenNames = new Set();

    // 1. Live DB Publishers (All registered publishers stored in database)
    (livePublishers || []).forEach(p => {
      const displayName = p.display_name || p.email?.split('@')[0] || 'Distributor';
      const cleanName = displayName.trim();
      
      // Filter out internal admin or test / demo profiles
      if (cleanName.toLowerCase() === 'admin' && !p.avatar_url && !p.article_count) {
        return;
      }
      if (p.is_test || p.is_test === true || cleanName.toLowerCase().includes('demo') || cleanName.toLowerCase() === 'test') {
        return;
      }

      seenIds.add(p.id);
      seenNames.add(cleanName.toLowerCase());

      const isFounder = p.id === 'fe41c6c1-647f-4f8c-81b8-c39ca3666426' || cleanName.toLowerCase().includes('padmanaban');
      if (isFounder) {
        seenIds.add('budget-padmanaban');
        seenNames.add('b. padmanaban (budget padmanaban)');
      }
      const arn = p.arn_number || '';
      const badgeEn = isFounder
        ? 'AMFI-REGISTERED MFD | FOUNDER'
        : (arn ? `AMFI-REGISTERED MFD | ${arn}` : 'AMFI-REGISTERED MFD');
      const badgeTa = isFounder
        ? 'AMFI பதிவுசெய்த விநியோகஸ்தர் | நிறுவனர்'
        : (arn ? `AMFI பதிவுசெய்த விநியோகஸ்தர் | ${arn}` : 'AMFI பதிவுசெய்த விநியோகஸ்தர்');

      // Check if this card belongs to the currently logged in user
      const isCurrentUser = Boolean(
        (user?.id && (p.id === user.id || String(p.id) === String(user.id))) ||
        (user?.email && p.email && user.email.toLowerCase() === p.email.toLowerCase()) ||
        (profile?.display_name && cleanName.toLowerCase() === profile.display_name.trim().toLowerCase())
      );

      const activeUserAvatar = isCurrentUser
        ? (profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null)
        : null;

      const cardAvatar = p.avatar_url || activeUserAvatar || (isFounder ? '/assets/padmanaban.jpg' : `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=23645C&color=ffffff&bold=true`);

      list.push({
        id: isFounder ? 'budget-padmanaban' : p.id,
        isLive: true,
        nameEnglish: isFounder ? 'B. Padmanaban (Budget Padmanaban)' : cleanName,
        nameTamil: isFounder ? 'பி. பத்மநாபன் (பட்ஜெட் பத்மநாபன்)' : cleanName,
        titleEnglish: p.title || (isFounder ? 'Founder & Chief Market Commentator' : 'AMFI Registered Mutual Fund Distributor'),
        titleTamil: p.title || (isFounder ? 'நிறுவனர் & தலைமை சந்தை ஆய்வாளர்' : 'பதிவுசெய்யப்பட்ட மியூச்சுவல் ஃபண்ட் விநியோகஸ்தர்'),
        organization: isFounder ? 'Fortune Investment Services (FISPL)' : 'Fortune Investment Services (FISPL Partner)',
        arnNumber: arn,
        avatar: cardAvatar,
        badgeEnglish: badgeEn,
        badgeTamil: badgeTa,
        bioEnglish: p.bio || (isFounder
          ? 'Founder of FISPL with 15+ years of market authority, educating retail and HNI investors on Mutual Funds, Wealth Creation & Systematic Financial Planning across video masterclasses.'
          : 'Certified AMFI mutual fund distributor dedicated to investor financial freedom, portfolio diversification, and long-term compounding.'),
        bioTamil: p.bio_ta || p.bio || (isFounder
          ? 'FISPL நிறுவனர், 15+ ஆண்டுகால நிதி அனுபவத்துடன் மியூச்சுவல் ஃபண்ட் மற்றும் நீண்டகால செல்வ உருவாக்கம் குறித்த வழிகாட்டல்.'
          : 'முதலீட்டாளர்களின் நிதி சுதந்திரம் மற்றும் நீண்ட கால செல்வ உருவாக்கத்திற்கு வழிகாட்டும் AMFI பதிவுபெற்ற விநியோகஸ்தர்.'),
        category: 'mutual-funds',
        stats: {
          masterclasses: isFounder ? '800+' : 0,
          articles: parseInt(p.article_count || (isFounder ? '12' : '0'), 10)
        },
        specialties: Array.isArray(p.specialties) && p.specialties.length > 0
          ? p.specialties
          : ['Mutual Funds', 'SIP Portfolios', 'Wealth Planning', 'Tax Saving'],
        whatsapp: p.whatsapp_number || p.phone || '',
        articleCount: parseInt(p.article_count || (isFounder ? '12' : '0'), 10),
        socialLinks: {
          linkedin: p.linkedin_url || '',
          twitter: p.twitter_url || '',
          youtube: p.youtube_url || '',
          website: p.website_url || ''
        }
      });
    });

    // 2. Default Seed Specialists (only if not already in database)
    (professionalsData || []).forEach(seed => {
      const matchName = (seed.nameEnglish || '').toLowerCase();
      if (!seenIds.has(seed.id) && !seenNames.has(matchName)) {
        seenIds.add(seed.id);
        list.push({
          ...seed,
          avatar: seed.avatar || '/assets/padmanaban.jpg',
          isLive: false,
          stats: {
            masterclasses: seed.stats?.masterclasses || 0,
            articles: seed.stats?.articles || 5
          },
          articleCount: seed.stats?.articles || 5,
          specialties: seed.specializations ? seed.specializations.map(s => s.en) : ['Mutual Funds', 'Market Research']
        });
      }
    });

    return list;
  }, [livePublishers, user, profile]);

  const filteredProfessionals = useMemo(() => {
    let list = [...allPublishers];

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const nameT = (p.nameTamil || '').toLowerCase();
        const nameE = (p.nameEnglish || '').toLowerCase();
        const titleT = (p.titleTamil || '').toLowerCase();
        const titleE = (p.titleEnglish || '').toLowerCase();
        const bioT = (p.bioTamil || '').toLowerCase();
        const bioE = (p.bioEnglish || '').toLowerCase();
        const arn = (p.arnNumber || '').toLowerCase();
        return nameT.includes(q) || nameE.includes(q) || titleT.includes(q) || titleE.includes(q) || bioT.includes(q) || bioE.includes(q) || arn.includes(q);
      });
    }

    return list;
  }, [allPublishers, selectedCategory, searchQuery]);

  return (
    <div
      className="w-full min-h-[calc(100vh-140px)] py-6 sm:py-8 transition-colors duration-300 relative bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
        {/* Controls & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md scale-105'
                      : 'bg-white/80 hover:bg-white text-slate-800 dark:text-slate-200 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md'
                    }`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Compact Search Bar */}
          <div className="w-full sm:w-72 lg:w-80 shrink-0">
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-800 group-focus-within:text-[#008060] transition-colors pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTamil ? 'நிபுணர் பெயர், ARN தேடுக...' : 'Search specialists...'}
                className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white/95 text-slate-900 border-2 border-white/40 hover:border-white focus:border-white placeholder-slate-500 text-xs sm:text-sm font-bold focus:outline-none shadow-md transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 text-xs font-bold bg-slate-100 hover:bg-slate-200 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid of Professionals Cards or Skeleton Loaders */}
        {isLoading && livePublishers.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-white/30 shadow-xl space-y-5 animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="w-28 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <div className="w-1/2 h-4 rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="w-full h-3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-5/6 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                  <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((prof) => {
              const name = isTamil ? prof.nameTamil : prof.nameEnglish;
              const title = isTamil ? prof.titleTamil : prof.titleEnglish;
              const bio = isTamil ? prof.bioTamil : prof.bioEnglish;
              const badge = isTamil ? prof.badgeTamil : prof.badgeEnglish;

              return (
                <div
                  key={prof.id}
                  onClick={() => onNavigate && onNavigate(`#/professionals/${prof.id}`)}
                  className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:border-amber-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between space-y-5 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Avatar & Badges Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="relative">
                        <img
                          src={prof.avatar || '/assets/padmanaban.jpg'}
                          alt={name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 group-hover:border-amber-500 shadow-md transition-colors"
                          onError={(e) => {
                            e.target.src = prof.id === 'budget-padmanaban'
                              ? '/assets/padmanaban.jpg'
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(prof.nameEnglish || 'Advisor')}&background=23645C&color=ffffff&bold=true`;
                          }}
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Active Publisher" />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-800 border border-amber-500/20 text-right">
                          {badge}
                        </span>
                        {prof.arnNumber && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {prof.arnNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Identity */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-serif group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                        {name}
                      </h3>
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400/90 mt-0.5">
                        {title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {prof.organization}
                      </p>
                    </div>

                    {/* Short Bio */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {bio}
                    </p>

                    {/* Specialties Pills */}
                    {prof.specialties && Array.isArray(prof.specialties) && prof.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {prof.specialties.slice(0, 3).map((spec, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Metrics & Action Link */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="text-amber-500">🎬</span> {prof.stats?.masterclasses || 0}+ {isTamil ? 'வீடியோக்கள்' : 'Masterclasses'}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-blue-500">✍️</span> {prof.articleCount || prof.stats?.articles || 0}+ {isTamil ? 'கட்டுரைகள்' : 'Articles'}
                      </span>
                      {prof.whatsapp && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            const clean = prof.whatsapp.replace(/[^0-9]/g, '');
                            window.open(`https://wa.me/${clean}?text=${encodeURIComponent('Hello! I came across your profile on Muthaleetu Thisai and would like to connect.')}`, '_blank');
                          }}
                          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          <span>💬</span> WhatsApp
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-black text-amber-800 group-hover:text-amber-500 transition-colors pt-1">
                      <span>{isTamil ? 'சுயவிவரம் & கட்டுரைகளைக் காண்க' : 'View Insights & Feed'}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-white/40 shadow-xl space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-black text-slate-900 dark:text-white font-serif">
              {isTamil ? 'நிபுணர்கள் யாரும் பொருந்தவில்லை' : 'No specialists matched your search'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTamil ? 'வேறு வார்த்தைகளை பயன்படுத்தி தேடவும்.' : 'Try adjusting your search terms or filter.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function normalizeSocialUrl(raw, type = 'generic', channelId = null) {
  if (!raw && !channelId) return '';
  if (type === 'youtube') {
    if (channelId && String(channelId).startsWith('UC')) {
      return `https://www.youtube.com/channel/${channelId}`;
    }
    const clean = (raw || '').trim();
    if (!clean) return '';
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    if (clean.startsWith('www.youtube.com') || clean.startsWith('youtube.com') || clean.startsWith('youtu.be')) {
      return `https://${clean}`;
    }
    if (clean.startsWith('@')) return `https://www.youtube.com/${clean}`;
    if (clean.startsWith('UC') && clean.length === 24) return `https://www.youtube.com/channel/${clean}`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}`;
  }
  const clean = (raw || '').trim();
  if (!clean) return '';
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  if (type === 'linkedin') {
    if (clean.includes('linkedin.com')) return `https://${clean}`;
    return `https://www.linkedin.com/in/${clean.replace(/^in\//, '')}`;
  }
  if (type === 'twitter') {
    if (clean.includes('twitter.com') || clean.includes('x.com')) return `https://${clean}`;
    return `https://x.com/${clean.replace(/^@/, '')}`;
  }
  return `https://${clean}`;
}


export default ProfessionalsDirectoryPage;
export { ProfessionalsDirectoryPage };
