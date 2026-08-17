import fs from 'fs';
import path from 'path';

const bundlePath = path.resolve('js/bundle.js');
let bundleCode = fs.readFileSync(bundlePath, 'utf8');

const cinemaComponents = `
/**
 * CINEMA INTERACTIVE UI SYSTEM (OPTION 4: COMPACT SLEEK SUITE)
 */
function CinemaVideoCard({
  video,
  index = 0,
  onSelect,
  language = 'ta',
  onShowToast
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [nextFrameIndex, setNextFrameIndex] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [scrubPercent, setScrubPercent] = useState(null);

  const isTamil = language === 'ta';
  const timerRef = useRef(null);
  const fadeTimeoutRef = useRef(null);

  const youtubeId = video?.youtubeId || '';
  const frames = [
    video?.thumbnail || (youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hqdefault.jpg\` : ''),
    youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hq1.jpg\` : '',
    youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hq2.jpg\` : '',
    youtubeId ? \`https://img.youtube.com/vi/\${youtubeId}/hq3.jpg\` : ''
  ].filter(Boolean);

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

    const baseInterval = 3400;
    const staggerOffset = (index * 550) % 2000;
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
        }, 650);
      }, intervalTime);
    };

    scheduleNextCycle();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [frames, activeFrameIndex, isHovered, prefersReducedMotion, index]);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = Math.max(0, Math.min(1, x / rect.width));
    const pctY = Math.max(0, Math.min(1, y / rect.height));

    const tiltY = (pctX - 0.5) * 10;
    const tiltX = (0.5 - pctY) * 10;

    setTilt({ x: tiltX, y: tiltY });
    setGlare({ x: pctX * 100, y: pctY * 100, opacity: 0.3 });
    setScrubPercent(pctX);

    cardRef.current.style.setProperty('--mouse-x', \`\${(pctX * 100).toFixed(1)}%\`);

    if (frames.length > 1) {
      const frameIdx = Math.min(frames.length - 1, Math.floor(pctX * frames.length));
      if (frameIdx !== activeFrameIndex) {
        setActiveFrameIndex(frameIdx);
        setIsCrossfading(false);
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
    setScrubPercent(null);
    if (cardRef.current) {
      cardRef.current.style.removeProperty('--mouse-x');
    }
  };

  if (!video) return null;

  const title = isTamil
    ? (video.titleTamil || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title || 'Featured Video');

  const category = (video.category || 'FINANCE').replace('-', ' ');
  const duration = video.duration || (video.isShort ? '0:59' : '12:00');

  const currentFrame = frames[activeFrameIndex] || frames[0] || '';
  const nextFrame = nextFrameIndex !== null ? frames[nextFrameIndex] : null;

  const transformStyle = prefersReducedMotion
    ? 'none'
    : isHovered
    ? \`perspective(800px) rotateX(\${tilt.x.toFixed(2)}deg) rotateY(\${tilt.y.toFixed(2)}deg) translateY(-5px) scale(1.02)\`
    : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={() => onSelect && onSelect(video)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(video);
        }
      }}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.25s ease' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
      }}
      className="group relative select-none cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden
        w-full aspect-[9/13]
        bg-slate-900 border border-slate-800/90 hover:border-amber-500/60
        shadow-lg shadow-slate-950/70 hover:shadow-xl hover:shadow-amber-500/20
        outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0"
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          boxShadow: 'inset 0 0 0 1.5px rgba(245, 158, 11, 0.45)'
        }}
      />

      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
        {currentFrame && (
          <img
            src={currentFrame}
            alt={title}
            loading="lazy"
            className={\`absolute inset-0 w-full h-full object-cover object-center transition-all duration-400
              \${isCrossfading ? 'scale-105 opacity-40 blur-[1px]' : 'scale-100 opacity-90 blur-0'}
              group-hover:scale-105 group-hover:opacity-100\`}
          />
        )}
        {nextFrame && isCrossfading && (
          <img
            src={nextFrame}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-fadeIn transition-all duration-400 opacity-95 scale-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/40 opacity-85 group-hover:opacity-95 transition-opacity" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-15"
        style={{
          background: \`radial-gradient(circle 180px at \${glare.x}% \${glare.y}%, rgba(255, 255, 255, \${glare.opacity}), transparent 80%)\`
        }}
      />

      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
        <span className="px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider rounded-full bg-slate-950/85 backdrop-blur-md text-amber-400 border border-amber-400/25 shadow-sm">
          {category}
        </span>
        <span className="px-1.5 py-0.5 text-[8.5px] font-mono font-bold rounded-full bg-slate-950/85 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm">
          {duration}
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-250 shadow-xl group-hover:border-amber-500/60">
          <svg className="w-4 h-4 text-amber-400 fill-current ml-0.5" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      {scrubPercent !== null && frames.length > 1 && (
        <div className="absolute top-9 left-2.5 right-2.5 z-20 pointer-events-none flex items-center gap-0.5 bg-slate-950/70 backdrop-blur-md p-0.5 rounded-full border border-white/10">
          {frames.map((_, fIdx) => {
            const isActive = fIdx === activeFrameIndex;
            return (
              <div
                key={\`scrub-\${fIdx}\`}
                className={\`h-0.5 flex-1 rounded-full transition-all duration-150 \${
                  isActive ? 'bg-amber-400 shadow-sm' : 'bg-white/20'
                }\`}
              />
            );
          })}
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 p-3 pt-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 flex flex-col justify-end gap-1.5">
        <h3 className="text-[11px] sm:text-xs font-bold text-white font-serif line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between pt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] text-slate-400 font-medium truncate max-w-[100px]">
            {video.channelName || 'Budget Padmanaban'}
          </span>
          <span className="text-[9px] font-bold text-amber-400 group-hover:underline shrink-0 flex items-center gap-0.5 btn-magnetic">
            <span>{isTamil ? 'பார்க்க' : 'Watch'}</span>
            <span>→</span>
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

  if (!spotlightVideos || spotlightVideos.length === 0) return null;

  const currentVideo = spotlightVideos[currentIndex] || spotlightVideos[0];
  const title = isTamil
    ? (currentVideo.titleTamil || currentVideo.title)
    : (currentVideo.titleEnglish || currentVideo.title);
  const description = isTamil
    ? (currentVideo.descriptionTamil || currentVideo.description)
    : (currentVideo.descriptionEnglish || currentVideo.description);

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/70 border border-amber-500/30 p-5 sm:p-8 shadow-2xl text-white">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow">
              SPOTLIGHT MASTERCLASS
            </span>
            <span className="text-xs font-mono text-amber-400/90 font-bold">
              {currentVideo.category?.toUpperCase()}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black font-serif text-white leading-tight tracking-tight">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed font-sans max-w-2xl">
            {description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onWatchVideo && onWatchVideo(currentVideo)}
              className="btn-magnetic px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{isTamil ? 'இப்போதே பார்க்க' : 'Watch Masterclass'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <span className="text-white">{currentVideo.channelName || 'Budget Padmanaban'}</span>
              <span>•</span>
              <span>882 Original Guides</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div
            onClick={() => onWatchVideo && onWatchVideo(currentVideo)}
            className="group relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/15 shadow-2xl cursor-pointer"
          >
            <img
              src={currentVideo.thumbnail || \`https://img.youtube.com/vi/\${currentVideo.youtubeId}/hqdefault.jpg\`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {spotlightVideos.map((vid, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={vid.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={\`flex-1 min-w-[65px] sm:min-w-[75px] p-1.5 rounded-xl border transition-all text-left \${
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
  onSelectVideo,
  language = 'ta',
  onShowToast
}) {
  const scrollRef = useRef(null);
  const isTamil = language === 'ta';

  if (!videos || videos.length === 0) return null;

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const distance = direction === 'left' ? -320 : 320;
    scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const title = isTamil ? titleTamil : titleEnglish;
  const subtitle = isTamil ? subtitleTamil : subtitleEnglish;

  return (
    <section className="space-y-3 py-3 select-none">
      <div className="flex items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
              {title}
            </h2>
            {badgeText && (
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700 btn-magnetic text-xs"
          >
            ←
          </button>
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700 btn-magnetic text-xs"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth"
      >
        {videos.map((video, idx) => (
          <div key={\`rail-\${video.id || idx}\`} className="w-[140px] sm:w-[165px] md:w-[185px] shrink-0">
            <CinemaVideoCard
              video={video}
              index={idx}
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
  const { session } = useAuth();
  const isTamil = language === 'ta';
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!video) return null;

  const youtubeId = video.youtubeId || '';
  const embedUrl = youtubeId ? \`https://www.youtube.com/embed/\${youtubeId}?autoplay=1&rel=0&modestbranding=1\` : '';
  const youtubeWatchUrl = video.youtubeUrl || (youtubeId ? \`https://www.youtube.com/watch?v=\${youtubeId}\` : '');

  const title = isTamil
    ? (video.titleTamil || video.title)
    : (video.titleEnglish || video.title);
  const description = isTamil
    ? (video.descriptionTamil || video.description)
    : (video.descriptionEnglish || video.description);

  const relatedVideos = allVideos
    .filter(v => v.id !== video.id && (v.category === video.category || v.trending))
    .slice(0, 4)
    .map(v => translateVideo(v, language));

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto modal-backdrop-unified"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl transition-opacity"
      />

      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden z-10 text-white my-auto modal-card-unified">
        <div className="relative aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span>Video player unavailable</span>
            </div>
          )}

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-950/85 hover:bg-red-600 text-white flex items-center justify-center text-sm font-bold backdrop-blur-md border border-white/20 transition-colors shadow-2xl z-30"
          >
            ✕
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[45vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                  {(video.category || 'FINANCE').replace('-', ' ')}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {video.duration || 'Full Guide'}
                </span>
                <span className="text-xs text-amber-400 font-bold">• CFP Verified</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-serif text-white leading-snug">
                {title}
              </h2>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleShare}
                  className="btn-magnetic px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>{copied ? 'Copied' : (isTamil ? 'பகிர்' : 'Share')}</span>
                </button>

                {youtubeWatchUrl && (
                  <a
                    href={youtubeWatchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-magnetic px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition-colors shadow flex items-center gap-1.5"
                  >
                    <span>YouTube ↗</span>
                  </a>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                {description}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-6 pt-4 lg:pt-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isTamil ? 'தொடர்புடைய வீடியோக்கள்' : 'Related Insights'}
              </h3>

              <div className="space-y-2.5">
                {relatedVideos.map((rel) => {
                  const relTitle = isTamil
                    ? (rel.titleTamil || rel.title)
                    : (rel.titleEnglish || rel.title);

                  return (
                    <div
                      key={\`theater-related-\${rel.id}\`}
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

/**
 * HOME CINEMA VIDEO SHOWCASE (COMPACT SLEEK GRID ON HOMEPAGE)
 */
function HomeCinemaShowcase({ onNavigate, onShowToast, language = 'ta' }) {
  const isTamil = language === 'ta';
  const [activeCategory, setActiveCategory] = useState('featured');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const categories = [
    { id: 'featured', labelTa: 'முக்கிய பதிவுகள்', labelEn: 'Featured & Trending' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
    { id: 'stocks', labelTa: 'பங்குச் சந்தை & IPO', labelEn: 'Stocks & IPO' },
    { id: 'tax-saving', labelTa: 'வரி சேமிப்பு & ஓய்வூதியம்', labelEn: 'Tax & Retirement' },
    { id: 'shorts', labelTa: 'குறுகிய வீடியோக்கள் (Shorts)', labelEn: 'Quick Takes (Shorts)' }
  ];

  const showcaseVideos = useMemo(() => {
    let list = [...videosData];
    if (activeCategory === 'featured') {
      list = list.filter(v => v.trending || v.views > 20000).slice(0, 10);
    } else if (activeCategory === 'shorts') {
      list = list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts'))).slice(0, 10);
    } else if (activeCategory === 'mutual-funds') {
      list = list.filter(v => v.category === 'mutual-funds').slice(0, 10);
    } else if (activeCategory === 'stocks') {
      list = list.filter(v => v.category === 'stocks' || v.category === 'ipo').slice(0, 10);
    } else if (activeCategory === 'tax-saving') {
      list = list.filter(v => v.category === 'tax-saving' || v.category === 'retirement').slice(0, 10);
    }
    return list.map(v => translateVideo(v, language));
  }, [activeCategory, language]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 select-none space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              CINEMA VIDEO SUITE
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
            {isTamil ? 'பிரத்யேக வீடியோ அலசல் மற்றும் வழிகாட்டி' : 'Cinema Video Masterclasses'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isTamil
              ? 'பட்ஜெட் பத்மநாபன் CFP® வழங்கும் 3D இன்டராக்டிவ் மியூச்சுவல் ஃபண்ட் & பங்குச் சந்தை ஆய்வுகள்'
              : 'Interactive 3D masterclasses with real-time frame scrubbing, certified by Padmanaban B. CFP®'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate && onNavigate('#/videos')}
            className="btn-magnetic px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-600 dark:hover:bg-amber-500 text-white dark:hover:text-slate-950 text-xs font-black transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>{isTamil ? 'அனைத்து 882 வீடியோக்கள்' : 'Browse All 882 Videos'}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={\`btn-magnetic px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 \${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }\`}
            >
              {isTamil ? cat.labelTa : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Compact Sleek Grid: 2 cols on mobile, 3 on small, 4 on medium, 5 on lg, 6 on xl */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {showcaseVideos.map((video, idx) => (
          <CinemaVideoCard
            key={\`home-cinema-\${video.id || idx}\`}
            video={video}
            index={idx}
            onSelect={(v) => setSelectedVideo(v)}
            language={language}
            onShowToast={onShowToast}
          />
        ))}
      </div>

      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={videosData}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(rel) => setSelectedVideo(rel)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </section>
  );
}

/**
 * HOME PAGE
 */
function Home({ onNavigate, onShowToast }) {
  const { t, language } = useLanguage();
  const translatedNews = newsData.map(item => translateNewsArticle(item, language));

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. FEATURED NEWS TICKER ON LEFT + LATEST ARTICLES ON RIGHT */}
      <HeroSection news={translatedNews} onNavigate={onNavigate} />

      {/* 2. COMPACT CINEMA VIDEO CARDS SHOWCASE */}
      <HomeCinemaShowcase
        onNavigate={onNavigate}
        onShowToast={onShowToast}
        language={language}
      />

      {/* 3. TRENDING ARTICLES SECTION */}
      <TrendingArticlesSection onNavigate={onNavigate} />

      {/* 4. SIGN IN / REGISTER CALL TO ACTION BANNER */}
      <SignInCtaBanner onNavigate={onNavigate} />

      {/* 5. FINANCIAL CALCULATOR */}
      <SipCalculator />
    </div>
  );
}

/**
 * VIDEOS PAGE (FULL 882 VIDEOS PORTAL)
 */
function VideosPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleGridCount, setVisibleGridCount] = useState(30);
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
      masterclasses: translated.filter(v => v.trending || v.views > 25000).slice(0, 12),
      shorts: translated.filter(v => v.isShort || (v.tags && v.tags.includes('shorts'))).slice(0, 14),
      mutualFunds: translated.filter(v => v.category === 'mutual-funds').slice(0, 12),
      stocks: translated.filter(v => v.category === 'stocks' || v.category === 'ipo').slice(0, 12),
      taxRetirement: translated.filter(v => v.category === 'tax-saving' || v.category === 'retirement').slice(0, 12),
      personalFinance: translated.filter(v => v.category === 'personal-finance' || v.category === 'gold-bonds').slice(0, 12)
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
      {/* 1. LUXURY CINEMA SPOTLIGHT HERO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <CinemaSpotlightHero
          spotlightVideos={spotlightVideos}
          onWatchVideo={(video) => setSelectedVideo(video)}
          language={language}
        />
      </div>

      {/* 2. STICKY CATEGORY & SEARCH CONTROLS BAR */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-y border-slate-200 dark:border-slate-800/80 shadow-md py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categoriesList.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setVisibleGridCount(30);
                  }}
                  className={\`btn-magnetic px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 \${
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-0.5">
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
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="newest">{isTamil ? 'சமீபத்தியவை' : 'Latest Uploads'}</option>
                  <option value="views">{isTamil ? 'அதிக பார்வை' : 'Most Popular'}</option>
                  <option value="oldest">{isTamil ? 'பழையவை' : 'Oldest First'}</option>
                </select>
              </div>

              <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('rails')}
                  className={\`btn-magnetic px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${
                    viewMode === 'rails' && !isFiltering
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }\`}
                >
                  {isTamil ? 'தனித்தனி வரிசைகள்' : 'Cinematic Rails'}
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={\`btn-magnetic px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${
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

      {/* 3. MAIN CONTENT: CINEMATIC RAILS OR FULL 882 GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isFiltering || viewMode === 'grid' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                {isTamil
                  ? \`\${filteredVideos.length} வீடியோக்கள் கண்டறியப்பட்டன\`
                  : \`Found \${filteredVideos.length} masterclasses\`}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
              {filteredVideos.slice(0, visibleGridCount).map((video, idx) => (
                <CinemaVideoCard
                  key={\`grid-cinema-\${video.id || idx}\`}
                  video={video}
                  index={idx}
                  onSelect={(v) => setSelectedVideo(v)}
                  language={language}
                  onShowToast={onShowToast}
                />
              ))}
            </div>

            {visibleGridCount < filteredVideos.length && (
              <div className="pt-8 text-center">
                <button
                  onClick={() => setVisibleGridCount(prev => prev + 30)}
                  className="btn-magnetic px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105"
                >
                  {isTamil
                    ? \`மேலும் 30 வீடியோக்களைக் காட்டு (\${filteredVideos.length - visibleGridCount} மீதம்)\`
                    : \`Load 30 More Videos (\${filteredVideos.length - visibleGridCount} remaining)\`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <CinemaVideoRail
              titleTamil="பிரபலமான வீடியோக்கள் & Masterclasses"
              titleEnglish="Trending & Highly Watched Masterclasses"
              subtitleTamil="அதிக முதலீட்டாளர்களால் பார்க்கப்பட்ட முதன்மையான மியூச்சுவல் ஃபண்ட் மற்றும் பங்குச் சந்தை வழிகாட்டிகள்"
              subtitleEnglish="Top-rated investor masterclasses with over 25,000+ views"
              badgeText="FEATURED"
              videos={railsData.masterclasses}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="குறுகிய வீடியோக்கள் & Quick Takes"
              titleEnglish="Quick Takes & YouTube Shorts"
              subtitleTamil="1 நிமிடத்தில் புரியும் முக்கியமான முதலீட்டு ஆலோசனைகள் மற்றும் ரகசியங்கள்"
              subtitleEnglish="Bite-sized high-impact financial lessons in under 60 seconds"
              badgeText="SHORTS"
              videos={railsData.shorts}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="மியூச்சுவல் ஃபண்ட் & SIP திட்டங்கள்"
              titleEnglish="Mutual Funds & SIP Strategies"
              subtitleTamil="Small Cap, Mid Cap, Flexi Cap மற்றும் Index ஃபண்டுகளின் முழுமையான ஒப்பீடு"
              subtitleEnglish="Comprehensive fund reviews, CAGR calculations, and portfolio allocation"
              badgeText="MUTUAL FUNDS"
              videos={railsData.mutualFunds}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="பங்குச் சந்தை & IPO அலசல்"
              titleEnglish="Stock Market & IPO Breakdowns"
              subtitleTamil="நேரடி பங்கு முதலீடு, தொழில்நுட்ப பகுப்பாய்வு மற்றும் புதிய IPO மதிப்பீடுகள்"
              subtitleEnglish="Direct equity fundamentals, risk management, and live IPO reviews"
              badgeText="STOCKS"
              videos={railsData.stocks}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="வரி சேமிப்பு & ஓய்வூதியத் திட்டமிடல்"
              titleEnglish="Tax Optimization & Retirement Planning"
              subtitleTamil="NPS, EPF, Section 80C வரி சேமிப்பு மற்றும் ஓய்வூதிய நிதி கணக்கீடுகள்"
              subtitleEnglish="NPS, EPF, Section 80C optimization, and retirement corpus calculators"
              badgeText="RETIREMENT"
              videos={railsData.taxRetirement}
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

const startMarker = 'function CinemaVideoCard(';
const endMarker = 'function ArticlesPage(';

if (bundleCode.includes(startMarker) && bundleCode.includes(endMarker)) {
  const startIndex = bundleCode.indexOf(startMarker);
  const endIndex = bundleCode.indexOf(endMarker);
  bundleCode = bundleCode.substring(0, startIndex) + `${cinemaComponents}\n\n` + bundleCode.substring(endIndex);
  console.log('Replaced Cinema components and Home in bundle.js');
}

fs.writeFileSync(bundlePath, bundleCode, 'utf8');
console.log('Successfully updated js/bundle.js');
