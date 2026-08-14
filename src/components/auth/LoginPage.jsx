import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../js/context/LanguageContext.js';
import { GoogleSignInButton } from './GoogleSignInButton.jsx';

export function LoginPage({ onToggleSignup, onLoginSuccess }) {
  const { t } = useLanguage();
  const { signInWithPassword, signInWithGoogle, signInWithMagicLink, sendPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [shake, setShake] = useState(false);

  const triggerError = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      triggerError('Please enter a valid email address.');
      return;
    }

    if (!isMagicLink && !password) {
      triggerError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      if (isMagicLink) {
        await signInWithMagicLink(email);
        setSuccessMessage('Magic login link sent to your email!');
      } else {
        await signInWithPassword(email, password);
        setSuccessMessage('Logged in successfully!');
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      triggerError(err.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      triggerError(err.message || 'Google Sign-In failed.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      triggerError('Enter your email address above to receive a reset link.');
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      setSuccessMessage('Password reset link sent to your email!');
    } catch (err) {
      triggerError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${shake ? 'animate-shake' : ''}`}>
      {/* Form Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
          {isMagicLink ? 'Passwordless Sign In' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Access your personalized mutual fund insights & portfolio.
        </p>
      </div>

      {/* Google OAuth Button */}
      <GoogleSignInButton onClick={handleGoogleSubmit} isLoading={isLoading} label="Continue with Google" />

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
        <span className="bg-white/80 dark:bg-slate-900/80 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
          or continue with email
        </span>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleEmailPasswordSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="investor@example.com"
            required
            aria-describedby="login-email-desc"
            className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        {/* Password Field (hidden if Magic Link mode) */}
        {!isMagicLink && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-extrabold text-amber-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 pr-11 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top.1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <span>{isMagicLink ? 'Send Magic Link 🪄' : 'Sign In'}</span>
          )}
        </button>

        {/* Magic Link Switcher */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => { setIsMagicLink(!isMagicLink); setError(''); setSuccessMessage(''); }}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
          >
            {isMagicLink ? '← Back to Email & Password Sign In' : 'Use Passwordless Magic Link Email Sign-In instead'}
          </button>
        </div>
      </form>

      {/* Switch to Sign Up */}
      <div className="text-center border-t border-slate-200 dark:border-slate-800 pt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Don't have an account?{' '}
          <button
            onClick={onToggleSignup}
            className="font-extrabold text-amber-600 hover:underline cursor-pointer"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
}
