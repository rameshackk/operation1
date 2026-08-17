import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../js/context/LanguageContext.js';

export function MagicLinkForm({ onBackToLogin }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const { signInWithMagicLink } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (val) => {
    if (!val) {
      setEmailError(isTamil ? 'மின்னஞ்சல் முகவரியை உள்ளிடவும்' : 'Email address is required');
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) {
      setEmailError(isTamil ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்' : 'Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateEmail(email)) return;

    setIsLoading(true);
    try {
      await signInWithMagicLink(email);
      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || (isTamil ? 'மேஜிக் லிங்க் அனுப்புவது தோல்வியடைந்தது.' : 'Failed to send magic link.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-6 text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-bold">
          🪄
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white font-serif">
          {isTamil ? 'மேஜிக் லிங்க் அனுப்பப்பட்டது' : 'Magic Sign-In Link Sent'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
          {isTamil
            ? `உங்கள் ${email} முகவரிக்கு நேரடி உள்நுழைவு இணைப்பு அனுப்பப்பட்டுள்ளது.`
            : `We've emailed a passwordless sign-in link to ${email}. Click the link to log in instantly.`}
        </p>
        <button
          onClick={onBackToLogin}
          className="inline-block px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-colors"
        >
          ← {isTamil ? 'உள்நுழைவிற்கு திரும்பு' : 'Back to login'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {serverError && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between" role="alert">
          <span>{serverError}</span>
          <button onClick={() => setServerError('')} className="font-black text-xs"></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="magic-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
          </label>
          <input
            id="magic-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
            onBlur={(e) => validateEmail(e.target.value)}
            placeholder="investor@example.com"
            required
            aria-invalid={!!emailError}
            className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all ${
              emailError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-300 dark:border-slate-700'
            }`}
          />
          {emailError && (
            <p className="text-[11px] font-bold text-red-500 dark:text-red-400" role="alert">
              {emailError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span>{isTamil ? 'அனுப்பப்படுகிறது...' : 'Sending Link...'}</span>
          ) : (
            <span>{isTamil ? 'மேஜிக் லிங்க் அனுப்புக 🪄' : 'Send Magic Link 🪄'}</span>
          )}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600"
          >
            ← {isTamil ? 'கடவுச்சொல் மூலம் உள்நுழைய' : 'Sign in with password instead'}
          </button>
        </div>
      </form>
    </div>
  );
}
