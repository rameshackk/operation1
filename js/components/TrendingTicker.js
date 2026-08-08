import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { getMarketSnapshot } from '../services/marketService.js';

export function TrendingTicker() {
  const { t, language } = useLanguage();
  const [snapshot, setSnapshot] = useState([]);

  useEffect(() => {
    getMarketSnapshot().then(setSnapshot);
  }, []);

  const tickerHeadlines = language === 'ta' ? [
    "SEBI மியூச்சுவல் ஃபண்ட் விதிகள் மாற்றம்: சிறு முதலீட்டாளர்களுக்கு சாதகமான புதிய அறிவிப்பு!",
    "NIFTY 50 புதிய வரலாற்று சாதனையான 24,850 புள்ளிகளைத் தொட்டது!",
    "ஆர்பிஐ வட்டி விகிதத்தில் மாற்றமில்லை - ஹோம் லோன் இஎம்ஐ சுமை அதிகரிக்காது!",
    "தங்கத்தின் விலை மீண்டும் ஏற்றம் - Sovereign Gold Bond முதலீடு செய்வதற்கு உகந்த நேரமா?"
  ] : [
    "SEBI updates mutual fund Expense Ratio guidelines to protect retail investors!",
    "NIFTY 50 touches all-time record milestone of 24,850 points!",
    "RBI keeps Repo Rate unchanged at 6.50% - Home Loan EMIs remain stable!",
    "Gold prices rally again - Is it the right time for Sovereign Gold Bond (SGB) investments?"
  ];

  return (
    <div className="bg-slate-950 text-slate-200 border-b border-slate-800 text-xs py-2 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        
        {/* Ticker Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-red-600 text-white font-bold px-2.5 py-0.5 rounded text-[10px] tracking-wider uppercase shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          {t('tickerLabel')}
        </div>

        {/* CSS Marquee Ticker */}
        <div className="overflow-hidden relative w-full flex items-center">
          <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
            
            {/* Live Market Snapshot Pills */}
            <div className="flex items-center gap-3 border-r border-slate-800 pr-6">
              <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">
                {t('marketTitle')}:
              </span>
              {snapshot.map((item, idx) => (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                    item.isUp ? 'market-up' : 'market-down'
                  }`}
                >
                  <span>{item.symbol}</span>
                  <span className="text-slate-200">{item.value}</span>
                  <span className="flex items-center text-[10px]">
                    {item.isUp ? '▲' : '▼'} {item.percent}
                  </span>
                </div>
              ))}
            </div>

            {/* Headlines */}
            <div className="flex items-center gap-8 font-medium">
              {tickerHeadlines.map((headline, idx) => (
                <span key={idx} className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  {headline}
                </span>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
