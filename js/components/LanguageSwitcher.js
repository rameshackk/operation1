import React from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';

export function LanguageSwitcher() {
  const { language, setLanguage, isTranslating } = useLanguage();

  return (
    <div className="relative inline-flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-full border border-slate-300 dark:border-slate-700">
      <button
        onClick={() => setLanguage('ta')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
          language === 'ta'
            ? 'bg-amber-600 text-white shadow-sm'
            : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400'
        }`}
        aria-label="Switch to Tamil"
      >
        தமிழ்
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
          language === 'en'
            ? 'bg-amber-600 text-white shadow-sm'
            : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400'
        }`}
        aria-label="Switch to English"
      >
        English
      </button>
      {isTranslating && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-amber-500 font-medium whitespace-nowrap animate-pulse">
          Translating...
        </span>
      )}
    </div>
  );
}
