import fs from 'fs';
import path from 'path';

const bundlePath = path.resolve('js/bundle.js');
let bundleCode = fs.readFileSync(bundlePath, 'utf8');

// 1. Definition of VideoFanCard, VideoTheaterModal, VideoFanWall
const videoFanWallDefinitions = `
/**
 * LIVING VIDEO FAN WALL & CARD CYCLE SYSTEM
 */
function useCardCycle(frames = [], index = 0, isHovered = false) {
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [nextFrameIndex, setNextFrameIndex] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const timerRef = useRef(null);
  const fadeTimeoutRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      }
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !frames || frames.length <= 1 || isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const baseInterval = 3600;
    const staggerOffset = (index * 680) % 1800;
    const intervalTime = baseInterval + staggerOffset;

    const scheduleNextCycle = () => {
      timerRef.current = setTimeout(() => {
        const nextIdx = (activeFrameIndex + 1) % frames.length;
        setNextFrameIndex(nextIdx);
        setIsCrossfading(true);

        fadeTimeoutRef.current = setTimeout(() => {
          setActiveFrameIndex(nextIdx);
          setNextFrameIndex(null);
          setIsCrossfading(false);
        }, 700);
      }, intervalTime);
    };

    scheduleNextCycle();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [frames, activeFrameIndex, isHovered, prefersReducedMotion, index]);

  const currentFrame = frames && frames.length > 0 ? frames[activeFrameIndex] : '';
  const nextFrame = nextFrameIndex !== null && frames && frames[nextFrameIndex] ? frames[nextFrameIndex] : null;

  return { currentFrame, nextFrame, isCrossfading, activeFrameIndex, prefersReducedMotion };
}

function VideoFanCard({
  video,
  index,
  totalCards,
  fanRotation = 0,
  fanTranslateY = 0,
  fanTranslateX = 0,
  isHovered = false,
  anyCardHovered = false,
  onHoverStart,
  onHoverEnd,
  onSelect,
  language = 'ta'
}) {
  const isTamil = language === 'ta';
  const youtubeId = video?.youtubeId || '';
  const frames = [
    video?.thumbnail || (youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hqdefault.jpg\` : ''),
    youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hq1.jpg\` : '',
    youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hq2.jpg\` : '',
    youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hq3.jpg\` : ''
  ].filter(Boolean);

  const { currentFrame, nextFrame, isCrossfading, prefersReducedMotion } = useCardCycle(frames, index, isHovered);

  let transformStyle = '';
  let zIndex = index + 10;

  if (prefersReducedMotion) {
    transformStyle = 'none';
  } else if (isHovered) {
    transformStyle = \`rotate(0deg) translateY(-16px) scale(1.06)\`;
    zIndex = 50;
  } else if (anyCardHovered) {
    transformStyle = \`rotate(\${fanRotation * 0.9}deg) translateY(\${fanTranslateY}px) translateX(\${fanTranslateX}px) scale(0.97)\`;
    zIndex = index + 10;
  } else {
    transformStyle = \`rotate(\${fanRotation}deg) translateY(\${fanTranslateY}px) translateX(\${fanTranslateX}px)\`;
    zIndex = index + 10;
  }

  const title = isTamil
    ? (video.titleTamil || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title || 'Featured Video');

  const category = (video.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const duration = video.duration || 'Video';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect && onSelect(video)}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(video);
        }
      }}
      style={{
        transform: transformStyle,
        zIndex,
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, z-index 0s'
      }}
      className={\`group relative select-none cursor-pointer shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden
        w-[160px] sm:w-[200px] md:w-[220px] aspect-[9/16]
        bg-slate-900 border border-white/10 dark:border-slate-800
        shadow-2xl shadow-slate-950/60 hover:shadow-amber-500/20 hover:border-amber-500/40
        outline-none focus-visible:ring-2 focus-visible:ring-amber-500\`}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
        {currentFrame && (
          <img
            src={currentFrame}
            alt={title}
            loading="lazy"
            className={\`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700
              \${isCrossfading ? 'scale-105 opacity-40 blur-[1px]' : 'scale-100 opacity-90 blur-0'}
              group-hover:scale-110\`}
          />
        )}
        {nextFrame && isCrossfading && (
          <img
            src={nextFrame}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-fadeIn transition-all duration-700 opacity-95 scale-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40 opacity-80 group-hover:opacity-95 transition-opacity" />
      </div>

      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/20 shadow-sm">
          {category}
        </span>
        <span className="px-2 py-1 text-[9px] font-mono font-bold rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 border border-white/10 shadow-sm">
          {duration}
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-xl">
          <svg className="w-5 h-5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 pt-10 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20 flex flex-col justify-end gap-2">
        <h3 className="text-xs sm:text-sm font-bold text-white font-serif line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-slate-400 font-medium line-clamp-1">
            {video.channelName || 'Budget Padmanaban'}
          </span>
          <span className="text-[10px] font-bold text-amber-400 group-hover:underline">
            {isTamil ? 'பார்க்க' : 'Watch'} →
          </span>
        </div>
      </div>
    </div>
  );
}

function VideoTheaterModal({
  video,
  allVideos = [],
  onClose,
  onSelectRelated,
  language = 'ta'
}) {
  const [activeLangTab, setActiveLangTab] = useState(language);
  const isTamil = activeLangTab === 'ta';

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
  const views = video.views ? \`\${video.views.toLocaleString()} views\` : '';

  const relatedVideos = (allVideos && allVideos.length > 0 ? allVideos : videosData)
    .filter(v => v.id !== video.id)
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-950 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              {category} • {duration}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex p-0.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] font-bold">
              <button
                onClick={() => setActiveLangTab('ta')}
                className={\`px-2.5 py-1 rounded-lg transition-all \${isTamil ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}\`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setActiveLangTab('en')}
                className={\`px-2.5 py-1 rounded-lg transition-all \${!isTamil ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}\`}
              >
                English
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h1 className="text-xl sm:text-2xl font-black text-white font-serif leading-snug">
                {title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
                <span className="text-amber-400 font-bold">
                  {video.channelName || 'Budget Padmanaban'}
                </span>
                <span>•</span>
                <span>{views}</span>
                {video.publishedAt && (
                  <>
                    <span>•</span>
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                {description}
              </div>
            </div>

            <div className="space-y-3 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-6 pt-4 lg:pt-0">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isTamil ? 'தொடர்புடைய வீடியோக்கள்' : 'Related Insights'}
              </h2>

              <div className="space-y-2.5">
                {relatedVideos.map((rel) => {
                  const relTitle = isTamil
                    ? (rel.titleTamil || rel.title)
                    : (rel.titleEnglish || rel.title);

                  return (
                    <div
                      key={\`related-\${rel.id}\`}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectRelated && onSelectRelated(rel)}
                      className="group flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/60 transition-all cursor-pointer"
                    >
                      <div className="relative w-20 aspect-[16/10] rounded-lg overflow-hidden shrink-0 bg-slate-950">
                        <img
                          src={rel.thumbnail || \`https://img.youtube.com/vi/\${rel.youtubeId}/hqdefault.jpg\`}
                          alt={relTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-slate-200">
                          {rel.duration || 'Video'}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 line-clamp-2 leading-tight transition-colors">
                          {relTitle}
                        </h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {rel.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoFanWall({
  videos = [],
  titleTamil = 'பிரத்யேக வீடியோக்கள்',
  titleEnglish = 'Living Video Showcase',
  subtitleTamil = 'பட்ஜெட் பத்மநாபனின் பிரத்யேக நிதி மற்றும் முதலீட்டு வீடியோ அலசல்கள்',
  subtitleEnglish = 'Continuous interactive video gallery featuring original insights and financial masterclasses',
  language = 'ta',
  onNavigate
}) {
  const isTamil = language === 'ta';
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [startIndex, setStartIndex] = useState(0);

  const videoPool = videos && videos.length > 0 ? videos : videosData;

  const filteredVideos = useMemo(() => {
    let list = [...videoPool];
    if (activeTab === 'shorts') {
      list = list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts')));
      if (list.length === 0) list = videoPool.slice(0, 9);
    } else if (activeTab === 'mutual-funds') {
      list = list.filter(v => v.category === 'mutual-funds');
    } else if (activeTab === 'personal-finance') {
      list = list.filter(v => v.category === 'personal-finance');
    }
    return list.length > 0 ? list : videoPool;
  }, [videoPool, activeTab]);

  const visibleCount = Math.min(filteredVideos.length, 7);
  const fanCards = useMemo(() => {
    if (!filteredVideos.length) return [];
    const count = visibleCount;
    const cards = [];
    for (let i = 0; i < count; i++) {
      const idx = (startIndex + i) % filteredVideos.length;
      cards.push(filteredVideos[idx]);
    }
    return cards;
  }, [filteredVideos, visibleCount, startIndex]);

  const handlePrev = () => {
    setStartIndex(prev => (prev - 1 + filteredVideos.length) % filteredVideos.length);
  };

  const handleNext = () => {
    setStartIndex(prev => (prev + 1) % filteredVideos.length);
  };

  const getFanGeometry = (index, total) => {
    const centerIndex = (total - 1) / 2;
    const offset = index - centerIndex;
    const rotation = offset * 4.2;
    const translateY = Math.pow(Math.abs(offset), 1.6) * 7.5;
    const translateX = offset * -6;
    return { rotation, translateY, translateX };
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-y border-slate-800/80 shadow-2xl select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[250px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{isTamil ? 'நேரலை வீடியோ கேலரி' : 'Living Video Arc'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight">
              {isTamil ? titleTamil : titleEnglish}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              {isTamil ? subtitleTamil : subtitleEnglish}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
            <div className="inline-flex p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
              <button
                onClick={() => { setActiveTab('all'); setStartIndex(0); }}
                className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all \${
                  activeTab === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }\`}
              >
                {isTamil ? 'அனைத்தும்' : 'All Featured'}
              </button>
              <button
                onClick={() => { setActiveTab('shorts'); setStartIndex(0); }}
                className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all \${
                  activeTab === 'shorts'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }\`}
              >
                {isTamil ? 'குறுகிய வீடியோக்கள்' : 'Quick Takes'}
              </button>
              <button
                onClick={() => { setActiveTab('mutual-funds'); setStartIndex(0); }}
                className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all \${
                  activeTab === 'mutual-funds'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }\`}
              >
                {isTamil ? 'மியூச்சுவல் ஃபண்ட்' : 'Mutual Funds'}
              </button>
            </div>

            {filteredVideos.length > visibleCount && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  aria-label="Previous card in fan"
                  className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                >
                  ←
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next card in fan"
                  className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative py-8 px-2 sm:px-6 flex items-center justify-center overflow-x-auto no-scrollbar min-h-[380px] sm:min-h-[460px]">
          <div className="flex items-center justify-center -space-x-8 sm:-space-x-12 md:-space-x-16 transition-all duration-500">
            {fanCards.map((video, idx) => {
              const { rotation, translateY, translateX } = getFanGeometry(idx, fanCards.length);
              const isCardHovered = hoveredCardId === video.id;
              const anyCardHovered = Boolean(hoveredCardId);

              return (
                <VideoFanCard
                  key={\`fan-\${video.id}-\${idx}\`}
                  video={video}
                  index={idx}
                  totalCards={fanCards.length}
                  fanRotation={rotation}
                  fanTranslateY={translateY}
                  fanTranslateX={translateX}
                  isHovered={isCardHovered}
                  anyCardHovered={anyCardHovered}
                  onHoverStart={() => setHoveredCardId(video.id)}
                  onHoverEnd={() => setHoveredCardId(null)}
                  onSelect={(v) => setSelectedVideo(v)}
                  language={language}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-4 flex-wrap gap-3">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {isTamil
              ? 'நேரலை மாதிரி: கார்டின் மீது கர்சரை வைத்து முழு விவரத்தைக் காணலாம்'
              : 'Interactive living showcase: Hover over any card to preview & expand'}
          </span>

          <button
            onClick={() => onNavigate ? onNavigate('#/videos') : (window.location.hash = '#/videos')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <span>{isTamil ? 'அனைத்து வீடியோக்களையும் காண்க' : 'Browse Full Video Catalog'}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {selectedVideo && (
        <VideoTheaterModal
          video={selectedVideo}
          allVideos={videoPool}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(relVideo) => setSelectedVideo(relVideo)}
          language={language}
        />
      )}
    </section>
  );
}
`;

// Insert the definitions right before function Home
if (!bundleCode.includes('function VideoFanCard(')) {
  bundleCode = bundleCode.replace('function Home({ onNavigate, onShowToast }) {', `${videoFanWallDefinitions}\n\nfunction Home({ onNavigate, onShowToast }) {`);
}

// Update Home to render VideoFanWall in place of static preview grid
const oldHomeRender = `{/* 2. PUBLIC PREVIEW GRID OF LATEST VIDEOS (BEFORE TRENDING ARTICLES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
              {t('latestVideos') || 'சமீபத்திய வீடியோக்கள்'}
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            PREVIEW SHOWCASE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {previewVideos.slice(0, 8).map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={() => onNavigate && onNavigate(\`#/videos/\${video.id}\`)}
            />
          ))}
        </div>
      </section>`;

const newHomeRender = `{/* 2. LIVING VIDEO FAN WALL SHOWCASE */}
      <VideoFanWall
        videos={videosData}
        language={language}
        onNavigate={onNavigate}
        titleTamil="பிரத்யேக வீடியோ அலசல்"
        titleEnglish="Living Video Showcase"
        subtitleTamil="பட்ஜெட் பத்மநாபனின் பிரத்யேக நேரலை வீடியோ கேலரி மற்றும் ஆய்வுகள்"
        subtitleEnglish="Continuous interactive video gallery featuring original insights and financial masterclasses"
      />`;

bundleCode = bundleCode.replace(oldHomeRender, newHomeRender);

// Update VideosPage in bundle.js to render VideoFanWall before the catalog
const oldVideosPageHeader = `  return (
    <div className="min-h-screen pb-20 space-y-6 animate-fadeIn">
      {/* 1. OFFICIAL YOUTUBE CHANNEL HEADER BANNER */}`;

const newVideosPageHeader = `  return (
    <div className="min-h-screen pb-20 space-y-6 animate-fadeIn">
      {/* LIVING FAN WALL HERO AREA */}
      <VideoFanWall
        videos={videosData}
        language={language}
        onNavigate={onNavigate}
        titleTamil="பிரத்யேக வீடியோக்கள்"
        titleEnglish="Living Video Showcase"
        subtitleTamil="பட்ஜெட் பத்மநாபனின் பிரத்யேக நிதி மற்றும் முதலீட்டு வீடியோ அலசல்கள்"
        subtitleEnglish="Continuous interactive video gallery featuring original insights and financial masterclasses"
      />

      {/* 1. OFFICIAL YOUTUBE CHANNEL HEADER BANNER */}`;

if (bundleCode.includes(oldVideosPageHeader)) {
  bundleCode = bundleCode.replace(oldVideosPageHeader, newVideosPageHeader);
}

fs.writeFileSync(bundlePath, bundleCode, 'utf8');
console.log('Successfully integrated VideoFanWall into js/bundle.js');
