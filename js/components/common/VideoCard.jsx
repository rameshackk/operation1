import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { OFFICIAL_CHANNEL_URL } from '../../data/translations.js';

function VideoCard({ video, onSelect, onShowToast }) {
  const { t } = useLanguage();
  if (!video) return null;

  const publishedDate = video.publishedAt ? new Date(video.publishedAt) : new Date();
  const isNew = (Date.now() - publishedDate.getTime()) / (1000 * 3600 * 24) <= 30;

  const formattedDate = new Intl.DateTimeFormat(
    video.activeLang === 'ta' ? 'ta-IN' : 'en-IN',
    { month: 'short', day: 'numeric', year: 'numeric' }
  ).format(publishedDate);

  const formattedViews = new Intl.NumberFormat(
    video.activeLang === 'ta' ? 'ta-IN' : 'en-IN'
  ).format(video.views || 18500);

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (onShowToast) onShowToast(t('bookmarkToast') || 'Saved to bookmarks!');
  };

  const ytId = video.youtubeId || video.id || '';
  const thumbnail = video.thumbnail || (ytId ? `https://i.ytimg.com/vi_webp/${ytId}/mqdefault.webp` : '');

  return (
    <div
      onClick={() => onSelect(video)}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm card-hover-glow cursor-pointer flex flex-col h-full justify-between"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img
          src={thumbnail}
          srcSet={ytId ? `https://i.ytimg.com/vi_webp/${ytId}/mqdefault.webp 320w, https://i.ytimg.com/vi_webp/${ytId}/hqdefault.webp 480w, https://i.ytimg.com/vi_webp/${ytId}/sddefault.webp 640w` : undefined}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
          alt={video.title}
          loading="lazy"
          decoding="async"
          width="320"
          height="180"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/15 transition-colors flex items-center justify-center">
          <div className="w-13 h-13 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-xl play-button-ripple group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>

        {video.isShort ? (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-md bg-red-600 text-white shadow-md">SHORT</span>
        ) : isNew ? (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-md bg-amber-500 text-slate-950 font-black shadow-md">{t('newBadge')}</span>
        ) : null}

        <span className="absolute bottom-3 right-3 px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-slate-950/85 text-white  border border-white/10">{video.duration || (video.isShort ? 'Short' : '10:00')}</span>

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleBookmark}
            className="p-1.5 rounded-md bg-slate-950/70 text-white hover:bg-amber-600 transition-colors "
            title="Save to Watch Later"
            aria-label="Save to Watch Later"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </button>
          <a
            href={video.youtubeUrl || OFFICIAL_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md hover:bg-red-700 transition-colors"
          >
            YouTube
          </a>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-800 font-sans">
            {(video.category || 'General').replace('-', ' ')}
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {video.title}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
          <span>{formattedViews} {t('views')}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
export { VideoCard };
