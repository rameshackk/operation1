import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../js/context/LanguageContext.js';
import { LoginForm } from './LoginForm.jsx';
import { SignupForm } from './SignupForm.jsx';
import { ForgotPasswordForm } from './ForgotPasswordForm.jsx';
import { MagicLinkForm } from './MagicLinkForm.jsx';

export function AuthCard({ mode = 'login', onModeChange, onAuthSuccess }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // Taglines for rotating branded side panel
  const taglines = isTamil ? [
    'உங்கள் மியூச்சுவல் ஃபண்ட் முதலீடுகளுக்கான சிறந்த நிதி வழிகாட்டி.',
    'SIP மற்றும் கூட்டு வட்டியின் வலிமையுடன் செல்வத்தை உருவாக்குங்கள்.',
    'நம்பகமான தமிழ் & ஆங்கில நிதி பகுப்பாய்வுகள்.'
  ] : [
    'Your trusted bilingual platform for mutual funds & investments.',
    'Build compounding wealth with disciplined SIP strategy.',
    'Certified financial insights by Certified Financial Planner Padmanaban B.'
  ];

  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [taglines.length]);

  // Dynamic titles and subtitles based on mode
  const getHeaderInfo = () => {
    switch (mode) {
      case 'signup':
        return {
          title: isTamil ? 'கணக்கை உருவாக்குங்கள்' : 'Create your account',
          subtitle: isTamil ? 'மியூச்சுவல் ஃபண்ட் பகுப்பாய்வுகளை அணுக பதிவு செய்யுங்கள்.' : 'Join Muthaleetu Thisai for mutual fund analytics.'
        };
      case 'forgot':
        return {
          title: isTamil ? 'கடவுச்சொல்லை மீட்டெடுக்க' : 'Reset your password',
          subtitle: isTamil ? 'உங்கள் மின்னஞ்சலுக்கு மீட்டமைப்பு இணைப்பு அனுப்பப்படும்.' : 'Enter your email to receive a password reset link.'
        };
      case 'magic-link':
        return {
          title: isTamil ? 'மேஜிக் உள்நுழைவு' : 'Passwordless Magic Sign-In',
          subtitle: isTamil ? 'கடவுச்சொல் இன்றி மின்னஞ்சல் லிங்க் மூலம் உள்நுழைக.' : 'Sign in instantly via an email link without a password.'
        };
      case 'login':
      default:
        return {
          title: isTamil ? 'மீண்டும் வருக!' : 'Welcome back',
          subtitle: isTamil ? 'உங்கள் கணக்கில் உள்நுழைந்து முதலீட்டு தகவல்களைப் பாருங்கள்.' : 'Access your personalized investment dashboard.'
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4">
      {/* Mobile Slim Branded Header Strip (<768px) */}
      <div className="md:hidden mb-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-black text-lg text-slate-950 shadow">
            தன
          </div>
          <div>
            <h1 className="text-sm font-black font-serif">Muthaleetu Thisai</h1>
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Wealth Platform</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
          @budgetpadmanaban_
        </span>
      </div>

      {/* Main Split-Screen Layout (Desktop 55/45, Mobile Single Column) */}
      <div className="grid grid-cols-1 md:grid-cols-12 rounded-[var(--radius-card,1.5rem)] border border-[var(--color-border,rgba(226,232,240,0.8))] dark:border-slate-800 shadow-[var(--shadow-card,0_20px_25px_-5px_rgba(0,0,0,0.1))] overflow-hidden bg-[var(--color-surface,rgba(255,255,255,0.85))] dark:bg-slate-900/85 backdrop-blur-xl transition-all">
        
        {/* Left/Branded Panel (Desktop Only ≥768px) */}
        <div className="hidden md:flex md:col-span-5 lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-8 lg:p-10 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-black text-2xl text-slate-950 shadow-xl border border-amber-400/40">
                தன
              </div>
              <div>
                <h1 className="text-xl font-black font-serif text-white">Muthaleetu Thisai</h1>
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Wealth Platform</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                CFP Certified Advisory
              </span>
              <h2 className="text-xl lg:text-2xl font-black font-serif text-white leading-tight min-h-[64px] transition-all duration-500">
                {taglines[taglineIndex]}
              </h2>
            </div>
          </div>

          {/* Channel Attribution Footer */}
          <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Official Channel</span>
            <span className="text-red-400 font-extrabold">@budgetpadmanaban_</span>
          </div>
        </div>

        {/* Right Form Card Panel */}
        <div className="md:col-span-7 lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center max-w-[460px] mx-auto w-full">
          
          {/* Card Header */}
          <div className="space-y-1 mb-6 text-left">
            <h2 className="text-[clamp(1.25rem,4vw,1.75rem)] font-black text-slate-900 dark:text-white font-serif tracking-tight leading-snug">
              {title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Form Container with Smooth AnimatePresence Transition */}
          <div className="transition-all duration-200">
            {mode === 'signup' && (
              <SignupForm onAuthSuccess={onAuthSuccess} />
            )}

            {mode === 'forgot' && (
              <ForgotPasswordForm onBackToLogin={() => onModeChange('login')} />
            )}

            {mode === 'magic-link' && (
              <MagicLinkForm onBackToLogin={() => onModeChange('login')} />
            )}

            {mode === 'login' && (
              <LoginForm onSwitchMode={onModeChange} onAuthSuccess={onAuthSuccess} />
            )}
          </div>

          {/* Mode Switcher Toggle (Login <-> Sign Up) */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="text-center border-t border-slate-200 dark:border-slate-800 pt-5 mt-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {mode === 'login' ? (
                  <>
                    {isTamil ? 'கணக்கு இல்லையா?' : "Don't have an account?"}{' '}
                    <button
                      onClick={() => onModeChange('signup')}
                      className="font-extrabold text-amber-600 dark:text-amber-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-1"
                    >
                      {isTamil ? 'பதிவு செய்க' : 'Sign up'}
                    </button>
                  </>
                ) : (
                  <>
                    {isTamil ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'}{' '}
                    <button
                      onClick={() => onModeChange('login')}
                      className="font-extrabold text-amber-600 dark:text-amber-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-1"
                    >
                      {isTamil ? 'உள்நுழைக' : 'Sign in'}
                    </button>
                  </>
                )}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
