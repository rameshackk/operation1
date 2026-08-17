import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../js/context/LanguageContext.js';
import { GoogleSignInButton } from './GoogleSignInButton.jsx';
import { PasswordInput } from './PasswordInput.jsx';
import { PasswordStrengthMeter } from './PasswordStrengthMeter.jsx';

export function SignupForm({ onAuthSuccess }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const { signUp, signInWithGoogle } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
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

  const validateConfirmPassword = (val) => {
    if (val !== password) {
      setConfirmError(isTamil ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match');
      return false;
    }
    setConfirmError('');
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
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!displayName.trim()) {
      triggerError(isTamil ? 'உங்கள் முழு பெயரை உள்ளிடவும்.' : 'Please enter your full name.');
      return;
    }

    if (!isEmailValid || !isConfirmValid) {
      triggerError(isTamil ? 'தயவுசெய்து அனைத்து விவரங்களையும் சரியாக நிரப்பவும்.' : 'Please fill in all fields correctly.');
      return;
    }

    if (password.length < 6) {
      triggerError(isTamil ? 'கடவுச்சொல் குறைந்தபட்சம் 6 எழுத்துக்கள் இருக்க வேண்டும்.' : 'Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      triggerError(isTamil ? 'விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்க வேண்டும்.' : 'You must agree to the Terms and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, displayName);
      setIsSuccess(true);
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      triggerError(err.message || (isTamil ? 'கணக்கு உருவாக்குவது தோல்வியடைந்தது.' : 'Failed to create account.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setServerError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      triggerError(err.message || 'Google Sign-Up failed.');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl font-bold shadow-lg">
          
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white font-serif">
          {isTamil ? 'சரிபார்ப்பு மின்னஞ்சல் அனுப்பப்பட்டது!' : 'Check your email to verify your account'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
          {isTamil
            ? `உங்கள் ${email} முகவரிக்கு சரிபார்ப்பு இணைப்பு அனுப்பப்பட்டுள்ளது. உங்கள் கணக்கை இயக்க அதில் கிளிக் செய்யவும்.`
            : `We've sent a verification link to ${email}. Please click the link to activate your account and start investing.`}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-5 ${shake ? 'animate-shake' : ''}`}>
      {/* Google OAuth Button */}
      <GoogleSignInButton onClick={handleGoogleSignUp} isLoading={isLoading} label={isTamil ? 'கூகிள் மூலம் பதிவு செய்க' : 'Sign up with Google'} />

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
        <span className="bg-white/80 dark:bg-slate-900/80 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
          {isTamil ? 'அல்லது மின்னஞ்சல் மூலம் பதிவு செய்க' : 'or register with email'}
        </span>
      </div>

      {/* Inline Server Error Banner */}
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
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Full Name Field */}
        <div className="space-y-1">
          <label htmlFor="signup-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {isTamil ? 'முழு பெயர்' : 'Full Name'}
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
        <div className="space-y-1">
          <label htmlFor="signup-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
            onBlur={(e) => validateEmail(e.target.value)}
            placeholder="investor@example.com"
            required
            aria-invalid={!!emailError}
            aria-describedby="signup-email-error"
            className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all ${
              emailError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-300 dark:border-slate-700'
            }`}
          />
          {emailError && (
            <p id="signup-email-error" className="text-[11px] font-bold text-red-500 dark:text-red-400" role="alert">
              {emailError}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <PasswordInput
            id="signup-password-input"
            label={isTamil ? 'கடவுச்சொல்' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
          />
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <PasswordInput
            id="signup-confirm-password"
            label={isTamil ? 'கடவுச்சொல்லை உறுதிப்படுத்தவும்' : 'Confirm Password'}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); if (confirmError) validateConfirmPassword(e.target.value); }}
            onBlur={(e) => validateConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            error={confirmError}
            describedBy="signup-confirm-error"
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="agree-terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            required
            className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500 accent-amber-600 shrink-0"
          />
          <label htmlFor="agree-terms" className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-snug">
            {isTamil ? (
              <>நான் <a href="#/terms" className="font-bold underline text-amber-600 hover:text-amber-500">விதிமுறைகள்</a> மற்றும் <a href="#/privacy" className="font-bold underline text-amber-600 hover:text-amber-500">தனியுரிமைக் கொள்கையை</a> ஏற்கிறேன்.</>
            ) : (
              <>I agree to the <a href="#/terms" className="font-bold underline text-amber-600 hover:text-amber-500">Terms</a> and <a href="#/privacy" className="font-bold underline text-amber-600 hover:text-amber-500">Privacy Policy</a>.</>
            )}
          </label>
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
              <span>{isTamil ? 'கணக்கு உருவாக்கப்படுகிறது...' : 'Creating Account...'}</span>
            </>
          ) : (
            <span>{isTamil ? 'கணக்கை உருவாக்கு' : 'Create Account'}</span>
          )}
        </button>
      </form>
    </div>
  );
}
