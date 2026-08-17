import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { GoogleSignInButton } from './GoogleSignInButton.jsx';
import { PasswordStrengthMeter } from './PasswordStrengthMeter.jsx';

export function SignupPage({ onToggleLogin, onSignupSuccess }) {
  const { signUp, signInWithGoogle } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [shake, setShake] = useState(false);

  const triggerError = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!displayName.trim()) {
      triggerError('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      triggerError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      triggerError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, displayName);
      setSuccessMessage('Account created! Please check your email to verify your account.');
      if (onSignupSuccess) onSignupSuccess();
    } catch (err) {
      triggerError(err.message || 'Failed to create account.');
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
      triggerError(err.message || 'Google Sign-Up failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${shake ? 'animate-shake' : ''}`}>
      {/* Form Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
          Create an Account
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Join Muthaleetu Thisai for mutual fund analytics and personalized tracking.
        </p>
      </div>

      {/* Google OAuth Button */}
      <GoogleSignInButton onClick={handleGoogleSubmit} isLoading={isLoading} label="Sign up with Google" />

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
        <span className="bg-white/80 dark:bg-slate-900/80 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
          or register with email
        </span>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
          <span></span>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <span></span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSignupSubmit} className="space-y-4" noValidate>
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label htmlFor="signup-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Padmanaban B"
            required
            className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="investor@example.com"
            required
            className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              className="w-full h-11 px-4 pr-11 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold p-1"
            >
              {showPassword ? '' : 'View'}
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

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
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Switch to Sign In */}
      <div className="text-center border-t border-slate-200 dark:border-slate-800 pt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Already have an account?{' '}
          <button
            onClick={onToggleLogin}
            className="font-extrabold text-amber-600 hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
