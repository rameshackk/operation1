import React from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';

export function SignInCtaBanner({ onNavigate }) {
  const { language } = useLanguage();
  const { session } = useAuth();
  const isTamil = language === 'ta';

  // If the user is already logged in, show a gentle active member badge
  if (session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 animate-fadeIn">
        <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs sm:text-sm font-bold font-sans">
              {isTamil 
                ? 'உறுப்பினர் கணக்கு செயலில் உள்ளது — முழு வீடியோ தொகுப்பு மற்றும் ஆராய்ச்சியை நீங்கள் அணுகலாம்.' 
                : 'Member Account Active — Full investment library and insights unlocked.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('#/videos')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors shadow-sm shrink-0"
          >
            {isTamil ? 'அனைத்து வீடியோக்கள் →' : 'Browse All Videos →'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 animate-fadeIn">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/80 border border-amber-500/30 dark:border-amber-500/20 p-6 sm:p-8 shadow-2xl text-white">
        {/* Ambient subtle glow overlay */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow">
                🔒 {isTamil ? 'உறுப்பினர் அணுகல்' : 'MEMBER ACCESS'}
              </span>
              <span className="text-[11px] font-mono text-amber-300/80 font-bold">
                {isTamil ? 'இலவச கணக்கு' : 'FREE ACCOUNT'}
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black font-serif text-white leading-snug">
              {isTamil
                ? 'முழு வீடியோ தொகுப்பு மற்றும் ஆராய்ச்சியைப் பார்க்க உள்நுழையவும்'
                : 'Sign in to watch the full library & in-depth research'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {isTamil
                ? 'இலவசமாக பதிவு செய்து பட்ஜெட் பத்மநாபனின் அனைத்து பிரத்தியேக நிதி வழிகாட்டிகள், மியூச்சுவல் ஃபண்ட் பகுப்பாய்வுகள் மற்றும் கண்காணிப்பு வரலாற்றை உடனே அணுகவும்.'
                : 'Register free to unlock the entire video archive, detailed mutual fund analysis, stock market strategies, and personalized watch history.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate && onNavigate('#/login')}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              {isTamil ? 'உள்நுழைக' : 'Sign In'}
            </button>
            <button
              onClick={() => onNavigate && onNavigate('#/signup')}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm border border-slate-700 hover:border-amber-500/40 transition-all text-center"
            >
              {isTamil ? 'இலவச பதிவு' : 'Register Free'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
