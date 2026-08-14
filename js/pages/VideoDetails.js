import React, { useState, useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { getVideoById, getRelatedVideos } from '../services/youtubeService.js';
import { useWatchHistory } from '../hooks/useWatchHistory.js';
import { MiniPlayer } from '../components/MiniPlayer.js';
import { VideoCard } from '../components/VideoCard.js';

export function VideoDetails({ videoId, onNavigate, onShowToast }) {
  const { t, language } = useLanguage();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);
  const { addToHistory } = useWatchHistory();
  const playerRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    let isMounted = true;

    getVideoById(videoId, language).then(data => {
      if (isMounted) {
        setVideo(data);
        setIsLoading(false);
        if (data) {
          addToHistory(data);
        }
      }
    });

    getRelatedVideos(videoId, language).then(rel => {
      if (isMounted) setRelated(rel);
    });

    return () => { isMounted = false; };
  }, [videoId, language]);

  // Scroll listener for floating mini-player
  useEffect(() => {
    const handleScroll = () => {
      if (!playerRef.current) return;
      const rect = playerRef.current.getBoundingClientRect();
      // If primary player top goes offscreen by 200px
      if (rect.bottom < 0) {
        setIsMiniPlayerVisible(true);
      } else {
        setIsMiniPlayerVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: video?.title || 'Financial Update',
      text: video?.description || 'Check out this video on Muthaleetu Thisai',
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast(t('copiedToast'));
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400 animate-pulse">
        Loading Video...
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Video Not Found
        </h2>
        <button
          onClick={() => onNavigate('#/videos')}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold"
        >
          Back to Videos
        </button>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat(
    language === 'ta' ? 'ta-IN' : 'en-IN',
    { month: 'long', day: 'numeric', year: 'numeric' }
  ).format(new Date(video.publishedAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Video & Details Section */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Video Player Container */}
          <div
            ref={playerRef}
            className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800"
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Title & Metadata */}
          <div className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 text-xs font-extrabold uppercase rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                {video.category}
              </span>

              <button
                onClick={handleShare}
                className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.367 3 3 0 000 5.367zm0 8.002a3 3 0 100-5.367 3 3 0 000 5.367z" />
                </svg>
                {t('share')}
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-serif leading-snug">
              {video.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-b border-slate-100 dark:border-slate-800 py-3 font-medium">
              <span>{video.views?.toLocaleString()} {t('views')}</span>
              <span>•</span>
              <span>{t('publishedAt')}: {formattedDate}</span>
              <span>•</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">⏱ {video.duration}</span>
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line pt-2">
              {video.description}
            </div>

            {/* Tags */}
            {video.tags && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                {video.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Related Videos Rail */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-serif border-b border-slate-200 dark:border-slate-800 pb-3">
            {t('relatedVideos')}
          </h3>

          <div className="space-y-4">
            {related.map((relVideo) => (
              <VideoCard
                key={relVideo.id}
                video={relVideo}
                onSelect={(v) => onNavigate(`#/videos/${v.id}`)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Floating Picture-in-Picture Mini Player */}
      <MiniPlayer
        video={video}
        isVisible={isMiniPlayerVisible}
        onClose={() => setIsMiniPlayerVisible(false)}
        onExpand={() => {
          setIsMiniPlayerVisible(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
