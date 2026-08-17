import React, { useEffect, useState } from 'https://esm.sh/react@18.2.0';

/**
 * VideoTheaterModal Component
 */
export function VideoTheaterModal({
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
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;

  const title = isTamil
    ? (video.titleTamil || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title || 'Featured Video');

  const description = isTamil
    ? (video.descriptionTamil || video.description || 'விளக்கம் இல்லை')
    : (video.descriptionEnglish || video.description || 'No description available');

  const category = (video.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const duration = video.duration || 'Video';
  const views = video.views ? `${video.views.toLocaleString()} views` : '';

  const relatedVideos = allVideos
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
                className={`px-2.5 py-1 rounded-lg transition-all ${isTamil ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setActiveLangTab('en')}
                className={`px-2.5 py-1 rounded-lg transition-all ${!isTamil ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
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
                      key={`related-${rel.id}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectRelated && onSelectRelated(rel)}
                      className="group flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/60 transition-all cursor-pointer"
                    >
                      <div className="relative w-20 aspect-[16/10] rounded-lg overflow-hidden shrink-0 bg-slate-950">
                        <img
                          src={rel.thumbnail || `https://img.youtube.com/vi/${rel.youtubeId}/hqdefault.jpg`}
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
