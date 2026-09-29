import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { marketSnapshotData } from '../../data/translations.js';


function TrendingTicker({ onNavigate }) {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const tickerHeadlines = isTamil ? [
    { text: "@budgetpadmanaban_ புதிய வீடியோ: மியூச்சுவல் ஃபண்ட் செய்ய வேண்டியவை & செய்யக்கூடாதவை!", link: "#/videos" },
    { text: "NIFTY 50 புதிய உச்சமான 24,850 புள்ளிகளைத் தொட்டது! சந்தை ஏற்றம் தொடர்கிறது!", link: "#/news" },
    { text: "ஆர்பிஐ வட்டி விகிதத்தில் மாற்றமில்லை - ஹோம் லோன் இஎம்ஐ சுமை அதிகரிக்காது!", link: "#/news" },
    { text: "SIP மூலம் ₹1 கோடி நிதி இலக்கை அடைவது எப்படி? புதிய கணக்கீட்டுக் கருவியைப் பாருங்கள்!", link: "#/calculator" },
    { text: "செபி புதிய மியூச்சுவல் ஃபண்ட் விதிமுறைகள் 2026: முதலீட்டாளர்கள் கவனத்திற்கு!", link: "#/articles" }
  ] : [
    { text: "@budgetpadmanaban_ New Video: Mutual Fund Do's & Don'ts Guide released!", link: "#/videos" },
    { text: "NIFTY 50 touches record all-time high of 24,850 points! Bull rally expands!", link: "#/news" },
    { text: "RBI keeps Repo Rate unchanged at 6.50% - Fixed Deposit & EMI outlook steady!", link: "#/news" },
    { text: "How to reach ₹1 Crore through disciplined SIPs? Try our interactive calculator!", link: "#/calculator" },
    { text: "SEBI Enforces Enhanced Transparency Regulations 2026 for Retail Mutual Funds!", link: "#/articles" }
  ];

  const handleHeadlineClick = (link) => {
    if (onNavigate) {
      onNavigate(link);
    } else if (typeof window !== 'undefined') {
      window.location.hash = link;
    }
  };

  const renderHeadlinesTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8">
      {tickerHeadlines.map((item, idx) => (
        <span
          key={`${keyPrefix}-hl-${idx}`}
          onClick={() => handleHeadlineClick(item.link)}
          className="group/hl text-[#FBBF24] hover:text-white cursor-pointer transition-all duration-150 flex items-center gap-2 font-bold text-xs sm:text-[13px] tracking-tight whitespace-nowrap select-none"
          title="Click to view details"
        >
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-sm bg-[#DC2626] text-white font-black text-xs shadow-sm animate-pulse shrink-0">
            ⚡
          </span>
          <span className="group-hover/hl:underline underline-offset-2 decoration-amber-400 decoration-2 font-bold text-[#FBBF24]">
            {item.text}
          </span>
        </span>
      ))}
    </div>
  );

  const renderMarketTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-5 shrink-0 pr-5 font-num text-xs sm:text-xs font-bold text-white leading-none">
      {marketSnapshotData.map((item, idx) => (
        <div key={`${keyPrefix}-mkt-${idx}`} className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-slate-600 dark:text-slate-400 font-semibold">{item.symbol}:</span>
          <span className="text-white font-bold">{item.value}</span>
          <span className={item.isUp ? 'text-[#16A34A] font-bold' : 'text-[#DC2626] font-bold'}>
            {item.isUp ? '▲' : '▼'} {item.percent}
          </span>
          <span className="text-slate-600 ml-1">•</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-full overflow-hidden min-w-0 bg-[#0F172A] text-white border-y border-slate-800 shadow-sm relative z-30 select-none">
      {/* Main Strip with 12px vertical padding and dark navy background */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3 flex items-center justify-between min-w-0">
        {/* Left Anchor Box with BREAKING NEWS Red Badge */}
        <div className="flex items-center shrink-0 pr-3 sm:pr-4">
          <div className="bg-[#DC2626] text-white font-extrabold text-xs sm:text-xs tracking-wider px-2.5 sm:px-3.5 py-1 rounded-md uppercase flex items-center justify-center gap-1.5 font-sans shadow-sm shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>{isTamil ? 'முக்கிய செய்திகள்' : 'BREAKING NEWS'}</span>
          </div>
        </div>

        {/* Right Scrolling Content in Amber-400 & Live Market Indicators */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden flex items-center pl-2">
          <div className="overflow-hidden relative w-full min-w-0 max-w-full flex items-center">
            <div className="animate-marquee flex items-center whitespace-nowrap">
              {renderHeadlinesTrack('navy-hl-1')}
              {renderMarketTrack('navy-mkt-1')}
              {renderHeadlinesTrack('navy-hl-2')}
              {renderMarketTrack('navy-mkt-2')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default TrendingTicker;
export { TrendingTicker };
