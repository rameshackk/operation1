import React, { useEffect, useState } from 'https://esm.sh/react@18.2.0';

/**
 * CinemaTheaterModal Component
 * Full-screen luxury cinema player with bilingual details, structured takeaways, and related rail.
 */
export function CinemaTheaterModal({
  video,
  allVideos = [],
  onClose,
  onSelectRelated,
  language = 'ta',
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'takeaways' | 'related'
  const [activeLang, setActiveLang] = useState(language);
  const isTamil = activeLang === 'ta';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const youtubeId = video.youtubeId || '';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;

  const title = isTamil
    ? (video.titleTamil || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title || 'Featured Video');

  const description = isTamil
    ? (video.descriptionTamil || video.description || 'விளக்கம் இல்லை')
    : (video.descriptionEnglish || video.description || 'No description available');

  const category = (video.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const duration = video.duration || 'Video';
  const views = video.views ? `${Number(video.views).toLocaleString()} views` : '';

  const relatedVideos = (allVideos && allVideos.length > 0 ? allVideos : [])
    .filter(v => v.id !== video.id)
    .slice(0, 6);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#/videos/${video.id}`);
      if (onShowToast) {
        onShowToast(isTamil ? 'இணைப்பு நகலெடுக்கப்பட்டது' : 'Video link copied to clipboard');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-2xl animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-950 overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              {category} • {duration}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="inline-flex p-0.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] font-bold">
              <button
                onClick={() => setActiveLang('ta')}
                className={`px-2.5 py-1 rounded-lg transition-all ${isTamil ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-all ${!isTamil ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                English
              </button>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              title="Share"
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors border border-slate-700"
            >
              {isTamil ? 'பகிர்க' : 'Share'}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold border border-slate-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* PLAYER FRAME */}
          <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
            {youtubeId ? (
              <iframe
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                Video not available
              </div>
            )}
          </div>

          {/* MAIN INFO & INTERACTIVE TABS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-white font-serif leading-snug">
                  {title}
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
                  <span className="text-amber-400 font-bold">{video.channelName || 'Budget Padmanaban'}</span>
                  <span>•</span>
                  <span>{views}</span>
                  {video.publishedAt && (
                    <>
                      <span>•</span>
                      <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>

              {/* TABS SELECTOR */}
              <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold shrink-0">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                >
                  {isTamil ? 'விளக்கம்' : 'Overview'}
                </button>
                <button
                  onClick={() => setActiveTab('takeaways')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'takeaways' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                >
                  {isTamil ? 'முக்கிய குறிப்புகள்' : 'Key Takeaways'}
                </button>
                <button
                  onClick={() => setActiveTab('related')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'related' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                >
                  {isTamil ? 'தொடர்புடையவை' : 'Related'}
                </button>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                {description}
              </div>
            )}

            {/* TAB 2: KEY TAKEAWAYS */}
            {activeTab === 'takeaways' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {isTamil ? 'முக்கிய முதலீட்டுப் பாடங்கள்' : 'Core Investment Principles'}
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{isTamil ? 'நீண்ட கால முதலீட்டு உத்திகள் மற்றும் கூட்டு வட்டியின் ஆற்றல்' : 'Long-term systematic compounding and risk mitigation'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{isTamil ? 'சந்தை ஏற்ற இறக்கங்களை எதிர்கொள்ளும் ஒழுங்கான SIP திட்டமிடல்' : 'Disciplined asset allocation across market cycles'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{isTamil ? 'வரி சேமிப்பு மற்றும் ஓய்வூதிய இலக்குகளுக்கான சரியான நிதி ஒதுக்கீடு' : 'Tax-efficient investment selection aligned with life goals'}</span>
                  </li>
                </ul>
              </div>
            )}

            {/* TAB 3: RELATED VIDEOS */}
            {activeTab === 'related' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {relatedVideos.map((rel) => {
                  const relTitle = isTamil ? (rel.titleTamil || rel.title) : (rel.titleEnglish || rel.title);
                  return (
                    <div
                      key={`modal-rel-${rel.id}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectRelated && onSelectRelated(rel)}
                      className="group flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer"
                    >
                      <div className="relative w-20 aspect-[16/10] rounded-lg overflow-hidden shrink-0 bg-slate-950">
                        <img
                          src={rel.thumbnail || `https://img.youtube.com/vi/${rel.youtubeId}/hqdefault.jpg`}
                          alt={relTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-slate-200">
                          {rel.duration || 'Video'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 line-clamp-2 leading-tight transition-colors">
                          {relTitle}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
