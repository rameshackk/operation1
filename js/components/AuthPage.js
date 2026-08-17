import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export function AuthPage({ initialMode = 'login', onNavigate }) {
  const { t, language } = useLanguage();
  const { signInWithPassword, signUp, signInWithGoogle, sendPasswordReset, signInWithMagicLink } = useAuth();
  const isTamil = language === 'ta';

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setError(isTamil ? 'சரியான மின்னஞ்சலை உள்ளிடவும்.' : 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!password) throw new Error(isTamil ? 'கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter your password.');
        await signInWithPassword(email, password);
        setSuccessMessage(isTamil ? 'வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்!' : 'Logged in successfully!');
        const redirect = sessionStorage.getItem('auth_redirect_from') || '#/';
        sessionStorage.removeItem('auth_redirect_from');
        if (onNavigate) onNavigate(redirect);
        else window.location.hash = redirect;
      } else if (mode === 'signup') {
        if (!password || password.length < 6) throw new Error(isTamil ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.' : 'Password must be at least 6 characters.');
        await signUp(email, password, fullName);
        setSuccessMessage(isTamil ? 'கணக்கு உருவாக்கப்பட்டது! உங்கள் மின்னஞ்சலை சரிபார்க்கவும்.' : 'Account created successfully! Check your email.');
      } else if (mode === 'forgot') {
        await sendPasswordReset(email);
        setSuccessMessage(isTamil ? 'கடவுச்சொல் மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டது.' : 'Password reset link sent to your email.');
      } else if (mode === 'magic-link') {
        await signInWithMagicLink(email);
        setSuccessMessage(isTamil ? 'மேஜிக் லிங்க் மின்னஞ்சலுக்கு அனுப்பப்பட்டது.' : 'Magic login link sent to your email.');
      }
    } catch (err) {
      setError(err.message || (isTamil ? 'செயல்பாடு தோல்வியடைந்தது.' : 'Operation failed. Please check credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Branding Vault Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
                DV
              </div>
              <div>
                <h1 className="font-serif font-black text-lg text-white">Muthaleetu Thisai</h1>
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Wealth Platform</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                CFP Verified Advisory
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-white leading-tight">
                {isTamil
                  ? 'உங்கள் மியூச்சுவல் ஃபண்ட் முதலீடுகளுக்கான சிறந்த நிதி வழிகாட்டி.'
                  : 'Your trusted platform for mutual funds & compounding wealth.'}
              </h2>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 text-xs font-bold text-slate-400 flex items-center justify-between relative z-10">
            <span>Padmanaban B. Financial</span>
            <span className="text-amber-400">@budgetpadmanaban_</span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6 bg-slate-50/50 dark:bg-slate-900">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {mode === 'login' && (isTamil ? 'உள்நுழைவு' : 'SECURE SIGN IN')}
              {mode === 'signup' && (isTamil ? 'புதிய பதிவு' : 'JOIN THE PLATFORM')}
              {mode === 'forgot' && (isTamil ? 'மீட்டமைப்பு' : 'RECOVERY')}
              {mode === 'magic-link' && (isTamil ? 'மேஜிக் லிங்க்' : 'PASSWORDLESS')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-900 dark:text-white mt-1">
              {mode === 'login' && (isTamil ? 'மீண்டும் வருக!' : 'Welcome Back')}
              {mode === 'signup' && (isTamil ? 'கணக்கை உருவாக்குங்கள்' : 'Create Account')}
              {mode === 'forgot' && (isTamil ? 'கடவுச்சொல் மீட்டெடுப்பு' : 'Reset Password')}
              {mode === 'magic-link' && (isTamil ? 'மேஜிக் உள்நுழைவு' : 'Magic Sign In')}
            </h2>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              {successMessage}
            </div>
          )}

          {/* Google Sign In */}
          {(mode === 'login' || mode === 'signup') && (
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="btn-magnetic w-full py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isTamil ? 'கூகிள் மூலம் தொடர்க' : 'Continue with Google'}</span>
            </button>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">{isTamil ? 'அல்லது' : 'OR'}</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isTamil ? 'முழு பெயர்' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isTamil ? "உங்கள் பெயர்" : "Your Name"}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            {(mode === 'login' || mode === 'signup') && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isTamil ? 'கடவுச்சொல்' : 'Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      {isTamil ? 'மறந்துவிட்டதா?' : 'Forgot?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (isTamil ? 'மறை' : 'Hide') : (isTamil ? 'காட்டு' : 'Show')}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-magnetic w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isLoading
                ? (isTamil ? 'செயலாக்குகிறது...' : 'Processing...')
                : mode === 'login'
                ? (isTamil ? 'உள்நுழைக' : 'Sign In')
                : mode === 'signup'
                ? (isTamil ? 'கணக்கு தொடங்கு' : 'Create Account')
                : mode === 'forgot'
                ? (isTamil ? 'இணைப்பு அனுப்புக' : 'Send Reset Link')
                : (isTamil ? 'மேஜிக் லிங்க் அனுப்புக' : 'Send Magic Link')}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="pt-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 space-y-2">
            {mode === 'login' ? (
              <p>
                {isTamil ? 'கணக்கு இல்லையா?' : "Don't have an account?"}{' '}
                <button onClick={() => setMode('signup')} className="font-extrabold text-amber-600 dark:text-amber-400 hover:underline">
                  {isTamil ? 'இப்போதே பதிவு செய்யுங்கள்' : 'Sign up now'}
                </button>
              </p>
            ) : (
              <p>
                {isTamil ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'}{' '}
                <button onClick={() => setMode('login')} className="font-extrabold text-amber-600 dark:text-amber-400 hover:underline">
                  {isTamil ? 'உள்நுழைக' : 'Sign in'}
                </button>
              </p>
            )}

            {mode === 'login' && (
              <p>
                <button onClick={() => setMode('magic-link')} className="font-semibold text-slate-400 hover:text-slate-200">
                  {isTamil ? 'கடவுச்சொல் இன்றி உள்நுழைக' : 'Sign in with Magic Link'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
