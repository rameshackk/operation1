import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useWatchHistory } from '../context/AuthContext.jsx';
import { useVideos } from '../services/videos.js';
import YouTubePlayerModal from '../components/youtube/YouTubePlayerModal.jsx';

function WatchHistoryPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const { history, clearHistory } = useWatchHistory();
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Live catalog for the player's related-videos rail
  const { videos: playerCatalog = [] } = useVideos('all', 'newest', 48, language);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <button
            onClick={() => onNavigate && onNavigate('#/profile')}
            className="text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors inline-flex items-center gap-1 mb-1"
          >
            ← {isTamil ? 'சுயவிவரத்திற்குத் திரும்பு' : 'Back to Profile'}
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
            {isTamil ? 'பார்த்த வீடியோக்களின் வரலாறு' : 'Watch History'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {history.length} {isTamil ? 'வீடியோக்கள் பதிவு செய்யப்பட்டுள்ளன' : 'videos recorded'}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              if (onShowToast) onShowToast(isTamil ? 'வரலாறு அழிக்கப்பட்டது' : 'Watch history cleared');
            }}
            className="btn-magnetic px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 text-xs font-bold transition-all shrink-0"
          >
            {isTamil ? 'வரலாற்றை அழி (Clear All)' : 'Clear History'}
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {history.map((video, idx) => (
            <div
              key={`wh-${video.id || video.video_id || idx}`}
              onClick={() => setSelectedVideo(video)}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-3 shadow-sm hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between space-y-2.5"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                <img src={video.thumbnail || video.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shadow-xl">▶</span>
                </div>
                {video.duration && (
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-xs">
                    {video.duration}
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                  {video.category || 'FINANCE'}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5 font-serif leading-snug">
                  {video.title || video.titleTamil || video.titleEnglish}
                </h4>
              </div>

              {video.viewedAt && (
                <div className="text-xs text-slate-600 dark:text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
                  {new Date(video.viewedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white font-serif">
            {isTamil ? 'பார்த்த வீடியோக்கள் எதுவும் இல்லை' : 'No watch history yet'}
          </h3>
          <p className="text-xs text-slate-500">
            {isTamil ? 'முதலீட்டு வீடியோக்களைப் பார்த்து உங்கள் வரலாற்றை இங்கே காண்க.' : 'Watch financial masterclasses to automatically save your playback trail here.'}
          </p>
          <button
            onClick={() => onNavigate && onNavigate('#/videos')}
            className="btn-magnetic px-6 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs shadow-md mt-2"
          >
            {isTamil ? 'அனைத்து வீடியோக்களையும் காண்க' : 'Browse All Masterclasses'}
          </button>
        </div>
      )}

      {selectedVideo && (
        <YouTubePlayerModal
          video={selectedVideo}
          allVideos={playerCatalog}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(rel) => setSelectedVideo(rel)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}

export default WatchHistoryPage;
export { WatchHistoryPage };
