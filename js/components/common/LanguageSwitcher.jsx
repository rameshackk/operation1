import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

function LanguageSwitcher() {
  const { language, setLanguage, isTranslating } = useLanguage();
  return (
    <div className="relative inline-flex items-center bg-white/80 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
      <button
        onClick={() => setLanguage('ta')}
        className={`px-3.5 py-1 text-xs font-black rounded-full transition-all duration-300 ${language === 'ta' ? 'bg-[#4A9E2C] text-white shadow-md scale-105' : 'text-slate-700 dark:text-slate-300 hover:text-[#4A9E2C]'
          }`}
      >
        தமிழ்
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3.5 py-1 text-xs font-black rounded-full transition-all duration-300 ${language === 'en' ? 'bg-[#4A9E2C] text-white shadow-md scale-105' : 'text-slate-700 dark:text-slate-300 hover:text-[#4A9E2C]'
          }`}
      >
        English
      </button>
      {isTranslating && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-[#4A9E2C] font-black whitespace-nowrap animate-pulse">
          Translating...
        </span>
      )}
    </div>
  );
}


export default LanguageSwitcher;
export { LanguageSwitcher };
