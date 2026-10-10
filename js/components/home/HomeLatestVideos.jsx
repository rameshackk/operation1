import React, { useState, useEffect } from 'react';
import YouTubeVideoCard from '../youtube/YouTubeVideoCard.jsx';
import YouTubePlayerModal from '../youtube/YouTubePlayerModal.jsx';

function HomeLatestVideos({ initialVideos = [], language = 'ta', onShowToast }) {
  const isTamil = language === 'ta';
  const [videos, setVideos] = useState(initialVideos);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(initialVideos.length === 0);

  useEffect(() => {
    let isMounted = true;
    if (initialVideos && initialVideos.length >= 3) {
      setVideos(initialVideos.slice(0, 6));
      setIsLoading(false);
      return;
    }

    fetch('/api/youtube/videos?type=videos&limit=6')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (isMounted && data?.data && Array.isArray(data.data)) {
          setVideos(data.data.slice(0, 6));
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.warn('Home latest videos fetch warning:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialVideos]);

  return (
    <section className="w-full py-10 sm:py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {isTamil ? 'யூடியூப் வீடியோக்கள்' : 'YouTube Channel'}
              </span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
              {isTamil ? 'பட்ஜெட் பத்மநாபன் வீடியோக்கள்' : 'Latest from Budget Padmanaban'}
            </h2>
          </div>

          <a
            href="#/videos"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors group"
          >
            <span>{isTamil ? 'அனைத்து வீடியோக்களையும் காண்க' : 'View all videos'}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* 3-column Grid matching full-screen specification */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {videos.map((vid) => (
              <YouTubeVideoCard
                key={vid.video_id || vid.youtubeId || vid.id}
                video={vid}
                onSelect={(v) => setSelectedVideo(v)}
                isTamil={isTamil}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Video Player Modal */}
      {selectedVideo ? (
        <YouTubePlayerModal
          video={selectedVideo}
          allVideos={videos}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(v) => setSelectedVideo(v)}
          isTamil={isTamil}
          onShowToast={onShowToast}
        />
      ) : null}
    </section>
  );
}

export default HomeLatestVideos;
