import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../js/context/LanguageContext.js';
import { GoogleSignInButton } from './GoogleSignInButton.jsx';
import { PasswordInput } from './PasswordInput.jsx';

export function LoginForm({ onSwitchMode, onAuthSuccess }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const { signInWithPassword, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

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

  const triggerError = (msg) => {
    setServerError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const isEmailValid = validateEmail(email);
    if (!isEmailValid || !password) {
      triggerError(isTamil ? 'தயவுசெய்து அனைத்து விவரங்களையும் சரியாக நிரப்பவும்.' : 'Please fill in all fields correctly.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithPassword(email, password);
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      triggerError(err.message || (isTamil ? 'உள்நுழைவு தோல்வியடைந்தது. விவரங்களை சரிபார்க்கவும்.' : 'Login failed. Please check your credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setServerError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      triggerError(err.message || 'Google Sign-In failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-5 ${shake ? 'animate-shake' : ''}`}>
      {/* Google OAuth Button */}
      <GoogleSignInButton onClick={handleGoogleSignIn} isLoading={isLoading} />

      {/* Horizontal Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
        <span className="bg-white/80 dark:bg-slate-900/80 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
          {isTamil ? 'அல்லது மின்னஞ்சல் மூலம்' : 'or continue with email'}
        </span>
      </div>

      {/* Calm Inline Server Error Banner */}
      {serverError && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between animate-fadeIn" role="alert">
          <div className="flex items-center gap-2">
            <span></span>
            <span>{serverError}</span>
          </div>
          <button onClick={() => setServerError('')} className="p-1 hover:opacity-75 font-black text-xs" aria-label="Dismiss error"></button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
            onBlur={(e) => validateEmail(e.target.value)}
            placeholder="investor@example.com"
            required
            aria-invalid={!!emailError}
            aria-describedby="login-email-error"
            className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all ${
              emailError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-300 dark:border-slate-700'
            }`}
          />
          {emailError && (
            <p id="login-email-error" className="text-[11px] font-bold text-red-500 dark:text-red-400" role="alert">
              {emailError}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="login-password-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'கடவுச்சொல்' : 'Password'}
            </label>
            <button
              type="button"
              onClick={() => onSwitchMode('forgot')}
              className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              {isTamil ? 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?' : 'Forgot password?'}
            </button>
          </div>
          <PasswordInput
            id="login-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {/* Magic Link Option */}
        <div className="text-right pt-0.5">
          <button
            type="button"
            onClick={() => onSwitchMode('magic-link')}
            className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            {isTamil ? 'மின்னஞ்சல் மூலம் கடவுச்சொல்லற்ற லிங்க் பெற' : 'Email me a sign-in link instead'}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>{isTamil ? 'உள்நுழைகிறது...' : 'Signing in...'}</span>
            </>
          ) : (
            <span>{isTamil ? 'உள்நுழைக' : 'Sign In'}</span>
          )}
        </button>
      </form>
    </div>
  );
}
