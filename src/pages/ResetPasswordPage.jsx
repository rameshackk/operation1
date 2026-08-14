import React, { useState } from 'react';
import { supabaseAnon } from '../lib/supabase.js';
import { useLanguage } from '../js/context/LanguageContext.js';
import { PasswordInput } from '../components/auth/PasswordInput.jsx';
import { PasswordStrengthMeter } from '../components/auth/PasswordStrengthMeter.jsx';

export function ResetPasswordPage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setConfirmError(isTamil ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match');
      return;
    }
    setConfirmError('');

    if (password.length < 6) {
      setServerError(isTamil ? 'கடவுச்சொல் குறைந்தபட்சம் 6 எழுத்துக்கள் இருக்க வேண்டும்.' : 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (!supabaseAnon) throw new Error('Supabase client not initialized');

      const { error } = await supabaseAnon.auth.updateUser({ password });
      if (error) throw error;

      setSuccessMessage(isTamil ? 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது! இப்போது உள்நுழையலாம்.' : 'Password updated successfully! You can now log in.');
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 2500);
    } catch (err) {
      setServerError(err.message || (isTamil ? 'கடவுச்சொல் மாற்றுவது தோல்வியடைந்தது.' : 'Failed to update password.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-8 px-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="space-y-1 text-center">
          <span className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl font-bold mb-2">
            🔑
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
            {isTamil ? 'புதிய கடவுச்சொல்லை அமைக்கவும்' : 'Set New Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isTamil ? 'உங்கள் புதிய கடவுச்சொல்லை உள்ளிட்டு உறுதிப்படுத்தவும்.' : 'Enter your new password below to update your account.'}
          </p>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between" role="alert">
            <span>{serverError}</span>
            <button onClick={() => setServerError('')} className="font-black text-xs">✕</button>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center" role="alert">
            ✓ {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <PasswordInput
              id="reset-password-new"
              label={isTamil ? 'புதிய கடவுச்சொல்' : 'New Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
            />
            <PasswordStrengthMeter password={password} />
          </div>

          <div className="space-y-1">
            <PasswordInput
              id="reset-password-confirm"
              label={isTamil ? 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்' : 'Confirm New Password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              error={confirmError}
              describedBy="reset-confirm-error"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>{isTamil ? 'புதுப்பிக்கப்படுகிறது...' : 'Updating Password...'}</span>
            ) : (
              <span>{isTamil ? 'கடவுச்சொல்லை புதுப்பி' : 'Update Password'}</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
