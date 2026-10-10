import React, { useEffect } from 'react';
import { formatCompactViews, formatRelativeTime, formatVideoDuration } from '../../utils/youtubeFormatters.js';

function YouTubePlayerModal({ video, allVideos = [], onClose, onSelectRelated, isTamil = false, onShowToast }) {
  if (!video) return null;

  const videoId = video.video_id || video.youtubeId || video.id;
  const title = video.title || video.titleTamil || video.titleEnglish || 'Budget Padmanaban Video';
  const views = video.view_count || video.views || 0;
  const publishedAt = video.published_at || video.publishedAt;
  const summary = (isTamil ? (video.ai_summary_ta || video.summaryTamil) : (video.ai_summary_en || video.summaryEnglish)) ||
    video.description || video.descriptionTamil || video.descriptionEnglish || '';

  const compactViews = formatCompactViews(views, isTamil);
  const timeAgo = formatRelativeTime(publishedAt, isTamil);

  // Keyboard Esc handler & Body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  // "Up Next" list of 8 related videos (same category preferred)
  const relatedVideos = (allVideos || [])
    .filter(v => (v.video_id || v.youtubeId || v.id) !== videoId && !v.is_short && !v.isShort)
    .sort((a, b) => {
      const aCat = a.category === video.category ? 1 : 0;
      const bCat = b.category === video.category ? 1 : 0;
      return bCat - aCat;
    })
    .slice(0, 8);

  const handleShareWhatsApp = () => {
    const shareUrl = `https://www.muthaleetuthisai.com/#/videos/watch/${videoId}`;
    const text = encodeURIComponent(`Watch "${title}" on Muthaleetu Thisai: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    const shareUrl = `https://www.muthaleetuthisai.com/#/videos/watch/${videoId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      if (onShowToast) onShowToast(isTamil ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-md"
          title="Close (Esc)"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Column: Player + Metadata (65% width on lg) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-4">
          {/* Responsive 16:9 YouTube iFrame */}
          <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-lg">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          {/* Title & Metadata */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
                {video.category || 'Mutual Funds'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {compactViews} {timeAgo ? `· ${timeAgo}` : ''}
              </span>
            </div>

            <h2 className="text-base sm:text-xl font-bold font-serif text-white leading-snug">
              {title}
            </h2>

            {/* AI Summary Box */}
            {summary ? (
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1 text-xs sm:text-sm text-slate-200">
                <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  {isTamil ? 'சுருக்கமான பார்வை (Key Takeaway)' : 'AI Key Takeaway'}
                </div>
                <p className="leading-relaxed">{summary}</p>
              </div>
            ) : null}

            {/* Action Buttons: Subscribe, YouTube, WhatsApp, SIP Calc */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              <a
                href="https://www.youtube.com/@budgetpadmanaban_?sub_confirmation=1"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                <span>{isTamil ? 'சப்ஸ்கிரைப்' : 'Subscribe'}</span>
              </a>

              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span>{isTamil ? 'YouTube-ல் திறக்க' : 'Open on YouTube'}</span>
                <span>↗</span>
              </a>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
              >
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                {isTamil ? 'இணைப்பை நகலெடு' : 'Copy Link'}
              </button>

              <a
                href="#/tools"
                onClick={() => onClose && onClose()}
                className="ml-auto px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span>{isTamil ? 'SIP கால்குலேட்டர்' : 'SIP Calculator'}</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: "Up Next" List (35% width on lg) */}
        {relatedVideos.length > 0 ? (
          <div className="w-full lg:w-80 lg:max-w-xs border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 overflow-y-auto no-scrollbar bg-slate-900/90 shrink-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              {isTamil ? 'அடுத்து பார்க்க (Up Next)' : 'Up Next'}
            </h3>

            <div className="space-y-3">
              {relatedVideos.map((item) => {
                const relId = item.video_id || item.youtubeId || item.id;
                const relTitle = item.title || item.titleTamil || item.titleEnglish;
                const relDuration = item.duration || formatVideoDuration(item.duration_seconds || item.durationSeconds);
                const relThumb =
                  item.thumbnail_url ||
                  item.thumbnail ||
                  (relId ? `https://i.ytimg.com/vi/${relId}/hqdefault.jpg` : '/assets/logo.png');

                return (
                  <div
                    key={relId}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectRelated && onSelectRelated(item)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectRelated && onSelectRelated(item)}
                    className="group flex items-start gap-2.5 cursor-pointer rounded-lg p-1.5 hover:bg-slate-800 transition-colors select-none"
                  >
                    <div className="relative aspect-video w-24 rounded-lg overflow-hidden bg-slate-950 shrink-0">
                      <img
                        src={relThumb}
                        alt={relTitle}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {relDuration ? (
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[10px] text-white font-mono">
                          {relDuration}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                        {relTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {formatCompactViews(item.view_count || item.views, isTamil)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default YouTubePlayerModal;
