import React from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { newsData } from '../data/news.js';

export function BreakingNewsTicker({ onNavigate }) {
  const { t, language } = useLanguage();

  const getHeadline = (item) => {
    return language === 'ta' ? item.titleTamil : (item.titleEnglish || item.titleTamil);
  };

  const renderBreakingTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-8 shrink-0 pr-8">
      {newsData.map((item, idx) => (
        <div
          key={`${keyPrefix}-${item.id}-${idx}`}
          onClick={() => onNavigate && onNavigate(`#/news/${item.slug}`)}
          className="inline-flex items-center gap-3 group cursor-pointer hover:bg-slate-900/80 px-3 py-1.5 rounded-2xl transition-all border border-transparent hover:border-slate-800"
        >
          {item.thumbnail && (
            <img
              src={item.thumbnail}
              alt=""
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-slate-700/80 shrink-0 group-hover:scale-105 transition-transform"
            />
          )}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-amber-500 text-slate-950">
                {item.category.replace('-', ' ')}
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1 font-serif">
              {getHeadline(item)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-950 text-white border-y border-slate-800 h-16 sm:h-20 overflow-hidden relative shadow-lg select-none">
      <div className="max-w-7xl mx-auto h-full flex items-center px-4">
        
        {/* Fixed Left Badge */}
        <div className="flex items-center gap-2 shrink-0 bg-red-600 text-white font-black px-3 py-1.5 rounded-xl text-xs tracking-wider uppercase shadow-md z-10 mr-4">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>{t('tickerLabel') || 'முக்கிய செய்திகள்'}</span>
        </div>

        {/* Continuous Horizontal Marquee Rail */}
        <div className="overflow-hidden relative w-full h-full flex items-center">
          <div className="animate-marquee flex items-center whitespace-nowrap py-2">
            {renderBreakingTrack('btrack-1')}
            {renderBreakingTrack('btrack-2')}
          </div>
        </div>

      </div>
    </div>
  );
}
