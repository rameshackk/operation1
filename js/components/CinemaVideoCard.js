import React, { useState, useRef, useEffect } from 'https://esm.sh/react@18.2.0';

export function CinemaVideoCard({
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
    video?.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : ''),
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq1.jpg` : '',
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq2.jpg` : '',
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hq3.jpg` : ''
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

    cardRef.current.style.setProperty('--mouse-x', `${(pctX * 100).toFixed(1)}%`);

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
    ? `perspective(800px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-5px) scale(1.02)`
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
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-400
              ${isCrossfading ? 'scale-105 opacity-40 blur-[1px]' : 'scale-100 opacity-90 blur-0'}
              group-hover:scale-105 group-hover:opacity-100`}
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
          background: `radial-gradient(circle 180px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}), transparent 80%)`
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
                key={`scrub-${fIdx}`}
                className={`h-0.5 flex-1 rounded-full transition-all duration-150 ${
                  isActive ? 'bg-amber-400 shadow-sm' : 'bg-white/20'
                }`}
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
