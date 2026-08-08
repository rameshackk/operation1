import React, { useState } from 'https://esm.sh/react@18.2.0';

export function MiniPlayer({ video, isVisible, onClose, onExpand }) {
  if (!video || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-700 shadow-2xl mini-player-shadow animate-slideUp">
      {/* Mini Player Video Wrapper */}
      <div className="relative aspect-video bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&mute=1`}
          title={video.title}
          className="w-full h-full pointer-events-none"
          allow="autoplay"
        />

        {/* Top Floating Controls */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button
            onClick={onExpand}
            className="p-1 rounded bg-slate-900/80 text-white hover:bg-amber-600 transition-colors"
            title="Expand to Full Player"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
            title="Close Mini Player"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mini Info Footer */}
      <div className="p-3 bg-slate-900 flex items-center justify-between gap-2 border-t border-slate-800">
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-bold uppercase text-amber-400">
            Playing in Mini Player
          </span>
          <h5 className="text-xs font-bold text-slate-100 truncate">
            {video.title}
          </h5>
        </div>
        <button
          onClick={onExpand}
          className="px-2.5 py-1 text-[11px] font-bold rounded bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shrink-0"
        >
          Expand
        </button>
      </div>
    </div>
  );
}
