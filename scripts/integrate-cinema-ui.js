import fs from 'fs';
import path from 'path';

const bundlePath = path.resolve('js/bundle.js');
let bundleCode = fs.readFileSync(bundlePath, 'utf8');

const cinemaComponents = `
/**
 * CINEMA INTERACTIVE UI SYSTEM (APPLE TV+ / NETFLIX STYLE)
 */
function CinemaVideoCard({
  video,
  aspectRatio = '16/9',
  onSelect,
  language = 'ta',
  onShowToast
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const isTamil = language === 'ta';
  const timerRef = useRef(null);

  const youtubeId = video?.youtubeId || '';
  const frames = [
    video?.thumbnail || (youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hqdefault.jpg\` : ''),
    youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hq1.jpg\` : '',
    youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hq2.jpg\` : '',
    youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hq3.jpg\` : ''
  ].filter(Boolean);

  useEffect(() => {
    if (!isHovered || frames.length <= 1) {
      setActiveFrameIndex(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % frames.length);
    }, 1200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, frames.length]);

  const title = isTamil
    ? (video.titleTamil || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title || 'Featured Video');

  const category = (video.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const duration = video.duration || 'Video';

  const isVertical = aspectRatio === '9/16' || video.isShort;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect && onSelect(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(video);
        }
      }}
      className={\`group relative select-none cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden
        bg-slate-900 border border-slate-800/80 hover:border-amber-500/60
        shadow-lg hover:shadow-2xl hover:shadow-amber-500/15
        transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.02]
        outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0
        \${isVertical ? 'w-[170px] sm:w-[210px] aspect-[9/16]' : 'w-full aspect-[16/10] sm:aspect-video'}\`}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
        <img
          src={frames[activeFrameIndex] || video.thumbnail}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 group-hover:via-slate-950/50 transition-colors duration-300" />
      </div>

      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-slate-950/85 backdrop-blur-md text-amber-400 border border-amber-400/25 shadow-sm">
          {category}
        </span>
        <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-full bg-slate-950/85 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm">
          {duration}
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl group-hover:border-amber-500/60">
          <svg className="w-5 h-5 text-amber-400 fill-current ml-0.5" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 pt-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-10 flex flex-col justify-end gap-1.5">
        <h3 className="text-xs sm:text-sm font-bold text-white font-serif line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
          <span className="truncate max-w-[140px] text-slate-300">
            {video.channelName || 'Budget Padmanaban'}
          </span>
          <span className="font-bold text-amber-400 group-hover:underline shrink-0">
            {isTamil ? 'பார்க்க' : 'Watch'} →
          </span>
        </div>
      </div>
    </div>
  );
}

function CinemaSpotlightHero({
  spotlightVideos = [],
  onWatchVideo,
  language = 'ta'
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isTamil = language === 'ta';

  const videos = spotlightVideos && spotlightVideos.length > 0 ? spotlightVideos.slice(0, 5) : [];
  const currentVideo = videos[currentIndex] || videos[0];

  useEffect(() => {
    if (videos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % videos.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [videos.length]);

  if (!currentVideo) return null;

  const title = isTamil
    ? (currentVideo.titleTamil || currentVideo.title || 'முக்கிய முதலீட்டு வழிகாட்டி')
    : (currentVideo.titleEnglish || currentVideo.title || 'Featured Investment Masterclass');

  const description = isTamil
    ? (currentVideo.descriptionTamil || currentVideo.description || 'பட்ஜெட் பத்மநாபன் CFP அவர்களின் விரிவான நிதி மற்றும் முதலீட்டு வழிகாட்டி.')
    : (currentVideo.descriptionEnglish || currentVideo.description || 'Exclusive financial masterclass and wealth-building insights directly from Certified Financial Planner Padmanaban B.');

  const category = (currentVideo.category || 'MUTUAL FUNDS').replace('-', ' ').toUpperCase();
  const duration = currentVideo.duration || '14:20';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl text-white select-none">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={currentVideo.thumbnail || \`https://img.youtube.com/vi/\${currentVideo.youtubeId}/hqdefault.jpg\`}
          alt={title}
          className="w-full h-full object-cover object-center filter blur-xl scale-110 opacity-30 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-500 text-slate-950 shadow-md">
              {isTamil ? 'சிறப்பு மாஸ்டர் கிளாஸ்' : 'FEATURED MASTERCLASS'}
            </span>
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/10 backdrop-blur-md text-amber-300 border border-white/10">
              {category} • {duration}
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-bold">
              CFP Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif text-white leading-tight tracking-tight drop-shadow-md">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed line-clamp-3">
            {description}
          </p>

          <div className="flex items-center gap-4 pt-2 flex-wrap">
            <button
              onClick={() => onWatchVideo && onWatchVideo(currentVideo)}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{isTamil ? 'இப்போதே பார்க்கவும்' : 'Watch Masterclass'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <span className="text-white">{currentVideo.channelName || 'Budget Padmanaban'}</span>
              <span>•</span>
              <span>882 Original Guides</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div
            onClick={() => onWatchVideo && onWatchVideo(currentVideo)}
            className="group relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-white/15 shadow-2xl cursor-pointer"
          >
            <img
              src={currentVideo.thumbnail || \`https://img.youtube.com/vi/\${currentVideo.youtubeId}/hqdefault.jpg\`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {videos.map((vid, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={vid.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={\`flex-1 min-w-[70px] sm:min-w-[80px] p-1.5 rounded-xl border transition-all text-left \${
                    isActive
                      ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
                  }\`}
                >
                  <div className="text-[9px] font-bold text-slate-300 truncate">
                    0\${idx + 1} • \${vid.duration || 'Video'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CinemaVideoRail({
  titleTamil,
  titleEnglish,
  subtitleTamil,
  subtitleEnglish,
  badgeText,
  videos = [],
  aspectRatio = '16/9',
  onSelectVideo,
  language = 'ta',
  onShowToast
}) {
  const scrollRef = useRef(null);
  const isTamil = language === 'ta';

  if (!videos || videos.length === 0) return null;

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const distance = direction === 'left' ? -380 : 380;
    scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const title = isTamil ? titleTamil : titleEnglish;
  const subtitle = isTamil ? subtitleTamil : subtitleEnglish;

  return (
    <section className="space-y-4 py-4 select-none">
      <div className="flex items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
              {title}
            </h2>
            {badgeText && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700"
          >
            ←
          </button>
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth"
      >
        {videos.map((video) => (
          <div
            key={\`rail-\${video.id}\`}
            className={aspectRatio === '9/16' || video.isShort ? 'shrink-0' : 'w-[260px] sm:w-[300px] md:w-[320px] shrink-0'}
          >
            <CinemaVideoCard
              video={video}
              aspectRatio={aspectRatio}
              onSelect={onSelectVideo}
              language={language}
              onShowToast={onShowToast}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function CinemaTheaterModal({
  video,
  allVideos = [],
  onClose,
  onSelectRelated,
  language = 'ta',
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('overview');
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
  const embedUrl = \`https://www.youtube-nocookie.com/embed/\${youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1\`;

  const title = isTamil
    ? (video.titleTamil || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title || 'Featured Video');

  const description = isTamil
    ? (video.descriptionTamil || video.description || 'விளக்கம் இல்லை')
    : (video.descriptionEnglish || video.description || 'No description available');

  const category = (video.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const duration = video.duration || 'Video';
  const views = video.views ? \`\${Number(video.views).toLocaleString()} views\` : '';

  const relatedVideos = (allVideos && allVideos.length > 0 ? allVideos : [])
    .filter(v => v.id !== video.id)
    .slice(0, 6);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(\`\${window.location.origin}/#/videos/\${video.id}\`);
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
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              {category} • {duration}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex p-0.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] font-bold">
              <button
                onClick={() => setActiveLang('ta')}
                className={\`px-2.5 py-1 rounded-lg transition-all \${isTamil ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}\`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={\`px-2.5 py-1 rounded-lg transition-all \${!isTamil ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}\`}
              >
                English
              </button>
            </div>

            <button
              onClick={handleShare}
              title="Share"
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors border border-slate-700"
            >
              {isTamil ? 'பகிர்க' : 'Share'}
            </button>

            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold border border-slate-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
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

              <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold shrink-0">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={\`px-3 py-1.5 rounded-lg transition-all \${activeTab === 'overview' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}\`}
                >
                  {isTamil ? 'விளக்கம்' : 'Overview'}
                </button>
                <button
                  onClick={() => setActiveTab('takeaways')}
                  className={\`px-3 py-1.5 rounded-lg transition-all \${activeTab === 'takeaways' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}\`}
                >
                  {isTamil ? 'முக்கிய குறிப்புகள்' : 'Key Takeaways'}
                </button>
                <button
                  onClick={() => setActiveTab('related')}
                  className={\`px-3 py-1.5 rounded-lg transition-all \${activeTab === 'related' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}\`}
                >
                  {isTamil ? 'தொடர்புடையவை' : 'Related'}
                </button>
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                {description}
              </div>
            )}

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

            {activeTab === 'related' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {relatedVideos.map((rel) => {
                  const relTitle = isTamil ? (rel.titleTamil || rel.title) : (rel.titleEnglish || rel.title);
                  return (
                    <div
                      key={\`modal-rel-\${rel.id}\`}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectRelated && onSelectRelated(rel)}
                      className="group flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer"
                    >
                      <div className="relative w-20 aspect-[16/10] rounded-lg overflow-hidden shrink-0 bg-slate-950">
                        <img
                          src={rel.thumbnail || \`https://img.youtube.com/vi/\${rel.youtubeId}/hqdefault.jpg\`}
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

function VideosPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleGridCount, setVisibleGridCount] = useState(24);
  const [viewMode, setViewMode] = useState('rails');

  const categoriesList = [
    { id: 'all', labelTa: 'அனைத்து வீடியோக்கள் (882)', labelEn: 'All Videos (882)' },
    { id: 'trending', labelTa: 'முக்கிய பதிவுகள்', labelEn: 'Featured & Trending' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
    { id: 'stocks', labelTa: 'பங்குச் சந்தை', labelEn: 'Stock Market' },
    { id: 'ipo', labelTa: 'IPO அலசல்', labelEn: 'IPO Analysis' },
    { id: 'gold-bonds', labelTa: 'தங்கம் & SGB பத்திரங்கள்', labelEn: 'Gold & SGB Bonds' },
    { id: 'tax-saving', labelTa: 'வரி சேமிப்பு திட்டமிடல்', labelEn: 'Tax Planning' },
    { id: 'retirement', labelTa: 'ஓய்வூதியம் (NPS & EPF)', labelEn: 'Retirement & NPS' },
    { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance' },
    { id: 'shorts', labelTa: 'குறுகிய வீடியோக்கள்', labelEn: 'Shorts' }
  ];

  const spotlightVideos = useMemo(() => {
    return videosData
      .filter(v => v.trending || v.category === 'mutual-funds')
      .slice(0, 5)
      .map(v => translateVideo(v, language));
  }, [language]);

  const railsData = useMemo(() => {
    const translated = videosData.map(v => translateVideo(v, language));
    return {
      masterclasses: translated.filter(v => v.trending || v.views > 25000).slice(0, 10),
      shorts: translated.filter(v => v.isShort || (v.tags && v.tags.includes('shorts'))).slice(0, 12),
      mutualFunds: translated.filter(v => v.category === 'mutual-funds').slice(0, 10),
      stocks: translated.filter(v => v.category === 'stocks' || v.category === 'ipo').slice(0, 10),
      taxRetirement: translated.filter(v => v.category === 'tax-saving' || v.category === 'retirement').slice(0, 10),
      personalFinance: translated.filter(v => v.category === 'personal-finance' || v.category === 'gold-bonds').slice(0, 10)
    };
  }, [language]);

  const filteredVideos = useMemo(() => {
    let list = [...videosData];

    if (activeCategory === 'trending') {
      list = list.filter(v => v.trending);
    } else if (activeCategory === 'shorts') {
      list = list.filter(v => v.isShort);
    } else if (activeCategory !== 'all') {
      list = list.filter(v => v.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(v => {
        const titleT = (v.titleTamil || v.title || "").toLowerCase();
        const titleE = (v.titleEnglish || v.title || "").toLowerCase();
        const descT = (v.descriptionTamil || v.description || "").toLowerCase();
        const descE = (v.descriptionEnglish || v.description || "").toLowerCase();
        const cat = (v.category || "").toLowerCase();
        return titleT.includes(q) || titleE.includes(q) || descT.includes(q) || descE.includes(q) || cat.includes(q);
      });
    }

    if (sortBy === 'views') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else if (sortBy === 'duration') {
      list.sort((a, b) => (b.duration || '').localeCompare(a.duration || ''));
    } else {
      list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    return list.map(v => translateVideo(v, language));
  }, [activeCategory, searchQuery, sortBy, language]);

  const isFiltering = activeCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen pb-24 space-y-8 animate-fadeIn text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <CinemaSpotlightHero
          spotlightVideos={spotlightVideos}
          onWatchVideo={(video) => setSelectedVideo(video)}
          language={language}
        />
      </div>

      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-y border-slate-200 dark:border-slate-800/80 shadow-md py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categoriesList.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setVisibleGridCount(24);
                  }}
                  className={\`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 \${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                  }\`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1">
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isTamil ? "இந்த 882 வீடியோக்களில் தேடுங்கள் (எ.கா: SIP, Nifty, Tax)..." : "Search 882 masterclasses (e.g. SIP, Nifty, Tax)..."}
                className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold hidden sm:inline">{isTamil ? 'வரிசை:' : 'Sort:'}</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="newest">{isTamil ? 'சமீபத்தியவை' : 'Latest Uploads'}</option>
                  <option value="views">{isTamil ? 'அதிக பார்வை' : 'Most Popular'}</option>
                  <option value="oldest">{isTamil ? 'பழையவை' : 'Oldest First'}</option>
                </select>
              </div>

              <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('rails')}
                  className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${
                    viewMode === 'rails' && !isFiltering
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }\`}
                >
                  {isTamil ? 'தனித்தனி வரிசைகள்' : 'Cinematic Rails'}
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${
                    viewMode === 'grid' || isFiltering
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }\`}
                >
                  {isTamil ? 'முழு கட்டம்' : 'Full Grid'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {(isFiltering || viewMode === 'grid') ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isTamil
                  ? \`மொத்தம் \${filteredVideos.length} வீடியோக்கள் கண்டறியப்பட்டன\`
                  : \`Showing \${filteredVideos.length} matching masterclasses\`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
              {filteredVideos.slice(0, visibleGridCount).map(video => (
                <CinemaVideoCard
                  key={\`grid-\${video.id}\`}
                  video={video}
                  aspectRatio={video.isShort ? '9/16' : '16/9'}
                  onSelect={(v) => setSelectedVideo(v)}
                  language={language}
                  onShowToast={onShowToast}
                />
              ))}
            </div>

            {visibleGridCount < filteredVideos.length && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setVisibleGridCount(prev => Math.min(prev + 24, filteredVideos.length))}
                  className="px-8 py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm border border-slate-700 shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isTamil ? 'மேலும் வீடியோக்களைக் காட்டு' : 'Load More Masterclasses'} ({\filteredVideos.length - visibleGridCount} {isTamil ? 'மீதமுள்ளன' : 'remaining'})
                </button>
              </div>
            )}
          </section>
        ) : (
          <div className="space-y-12">
            <CinemaVideoRail
              titleTamil="பிரதான முதலீட்டு வழிகாட்டிகள்"
              titleEnglish="Featured Wealth Masterclasses"
              subtitleTamil="பட்ஜெட் பத்மநாபன் CFP அவர்களின் தேர்ந்தெடுக்கப்பட்ட பிரதான வழிகாட்டிகள்"
              subtitleEnglish="Handpicked high-impact wealth-building masterclasses and investment blueprints"
              badgeText="POPULAR"
              videos={railsData.masterclasses}
              aspectRatio="16/9"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="குறுகிய நேர நிதி ஆலோசனைகள்"
              titleEnglish="Quick Takes & Shorts"
              subtitleTamil="1 நிமிடத்தில் தெரிந்து கொள்ள வேண்டிய முக்கிய நிதி உண்மைகள்"
              subtitleEnglish="Bite-sized high-yield financial wisdom and quick money rules"
              badgeText="SHORTS"
              videos={railsData.shorts}
              aspectRatio="9/16"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="மியூச்சுவல் ஃபண்ட் & SIP திட்டங்கள்"
              titleEnglish="Mutual Funds & Systematic Wealth"
              subtitleTamil="நீண்ட கால கூட்டு வட்டியின் மூலம் செல்வம் சேர்க்கும் வழிகள்"
              subtitleEnglish="Comprehensive fund analysis, category reviews, and compounding strategies"
              badgeText="SIP"
              videos={railsData.mutualFunds}
              aspectRatio="16/9"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="பங்குச் சந்தை & IPO அலசல்"
              titleEnglish="Stock Market & IPO Breakdowns"
              subtitleTamil="நிறுவனங்களின் நிதி நிலை மற்றும் சந்தை வாய்ப்புகள்"
              subtitleEnglish="Deep-dive fundamentals, valuation checks, and smart equity strategies"
              badgeText="STOCKS"
              videos={railsData.stocks}
              aspectRatio="16/9"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="வரி சேமிப்பு & ஓய்வூதிய திட்டம்"
              titleEnglish="Tax Planning & Retirement Blueprint"
              subtitleTamil="சரியான வரி திட்டமிடல் மற்றும் அமைதியான ஓய்வூதிய வாழ்க்கை"
              subtitleEnglish="NPS, EPF, Section 80C optimization, and retirement corpus calculators"
              badgeText="RETIREMENT"
              videos={railsData.taxRetirement}
              aspectRatio="16/9"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="தனிநபர் நிதி & தங்க முதலீடுகள்"
              titleEnglish="Personal Finance & Sovereign Gold"
              subtitleTamil="குடும்ப பட்ஜெட், அவசர கால நிதி மற்றும் தங்க பத்திரங்கள்"
              subtitleEnglish="Budgeting frameworks, emergency reserves, and Sovereign Gold Bonds"
              badgeText="WEALTH"
              videos={railsData.personalFinance}
              aspectRatio="16/9"
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />
          </div>
        )}
      </div>

      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={videosData}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(relVideo) => setSelectedVideo(relVideo)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}
`;

// Replace from 'function YouTubeVideoFeedCard(' to the end of VideosPage definition
const startMarker = 'function YouTubeVideoFeedCard(';
const endMarker = 'function ArticlesPage(';

if (bundleCode.includes(startMarker) && bundleCode.includes(endMarker)) {
  const startIndex = bundleCode.indexOf(startMarker);
  const endIndex = bundleCode.indexOf(endMarker);
  bundleCode = bundleCode.substring(0, startIndex) + `${cinemaComponents}\n\n` + bundleCode.substring(endIndex);
  console.log('Replaced YouTubeVideoFeedCard and VideosPage with Cinema components in bundle.js');
} else {
  console.log('Markers not found, appending definitions');
}

fs.writeFileSync(bundlePath, bundleCode, 'utf8');
console.log('Successfully updated js/bundle.js with Cinema UI system');
