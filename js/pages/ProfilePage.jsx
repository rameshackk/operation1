import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth, useBookmarks, useWatchHistory } from '../context/AuthContext.jsx';
import PublisherOnboardingModal from './PublisherOnboardingModal.jsx';

function ProfilePage({ onNavigate, onShowToast }) {
  const { user, profile, role, signOut, supabase, setProfile, verifyCurrentPassword, updateAccountPassword } = useAuth();
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { history, clearHistory } = useWatchHistory();

  const [displayName, setDisplayName] = useState(
    profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingPublisherModalOpen, setIsEditingPublisherModalOpen] = useState(false);

  // Dynamic Password Check & Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isCheckingPw, setIsCheckingPw] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isUpdatingPw, setIsUpdatingPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const handleCheckCurrentPassword = async (e) => {
    if (e) e.preventDefault();
    if (!currentPassword) {
      setPwError(isTamil ? 'தற்போதைய கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter your current password.');
      return;
    }
    setPwError('');
    setPwSuccess('');
    setIsCheckingPw(true);
    try {
      if (verifyCurrentPassword) {
        await verifyCurrentPassword(currentPassword);
      }
      setIsPasswordVerified(true);
      setPwSuccess(isTamil ? '✓ தற்போதைய கடவுச்சொல் சரிபார்க்கப்பட்டது! இப்போது உங்கள் புதிய கடவுச்சொல்லை அமைக்கலாம்.' : '✓ Current password verified! You can now set your new password.');
    } catch (err) {
      setIsPasswordVerified(false);
      setPwError(err.message || (isTamil ? 'தற்போதைய கடவுச்சொல் தவறானது. மீண்டும் சரிபார்க்கவும்.' : 'Current password does not match. Please try again.'));
    } finally {
      setIsCheckingPw(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPwError(isTamil ? 'புதிய கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.' : 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError(isTamil ? 'புதிய கடவுச்சொற்கள் பொருந்தவில்லை.' : 'New passwords do not match.');
      return;
    }
    setPwError('');
    setPwSuccess('');
    setIsUpdatingPw(true);
    try {
      if (updateAccountPassword) {
        await updateAccountPassword(newPassword);
      }
      setPwSuccess(isTamil ? '🎉 கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!' : '🎉 Password updated successfully!');
      if (onShowToast) onShowToast(isTamil ? 'கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' : 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordVerified(false);
    } catch (err) {
      setPwError(err.message || (isTamil ? 'கடவுச்சொல்லை மாற்றுவதில் பிழை ஏற்பட்டது.' : 'Failed to update password.'));
    } finally {
      setIsUpdatingPw(false);
    }
  };

  const handleResetPwFlow = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordVerified(false);
    setPwError('');
    setPwSuccess('');
  };

  const isPublisher = role === 'publisher' || profile?.role === 'publisher' || role === 'admin';

  const email = user?.email || '';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = (displayName || email || 'U').slice(0, 2).toUpperCase();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setIsSaving(true);
    try {
      if (supabase && user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
          .eq('id', user.id);
        if (error) throw error;
        if (setProfile) {
          setProfile(prev => ({ ...prev, display_name: displayName.trim() }));
        }
      }
      if (onShowToast) {
        onShowToast(isTamil ? 'சுயவிவரம் புதுப்பிக்கப்பட்டது!' : 'Profile updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      if (onShowToast) onShowToast(err.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#23645C] py-8 sm:py-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        {/* Header Banner - Solid White Content Card */}
        <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl overflow-hidden text-slate-900 dark:text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
            <div
              onClick={() => isPublisher ? setIsEditingPublisherModalOpen(true) : null}
              className={`relative group/avatar shrink-0 ${isPublisher ? 'cursor-pointer' : ''}`}
              title={isPublisher ? (isTamil ? 'சுயவிவரப் புகைப்படத்தை மாற்ற கிளிக் செய்யவும்' : 'Click to change profile photo & credentials') : ''}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#23645C] shadow-md shrink-0 group-hover/avatar:opacity-85 transition-opacity"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=23645C&color=ffffff&bold=true`; }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#23645C] text-white font-black text-2xl flex items-center justify-center border-2 border-emerald-300 shadow-md shrink-0">
                  {initials}
                </div>
              )}
              {isPublisher && (
                <div className="absolute inset-0 rounded-full bg-slate-950/70 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white text-xs font-black transition-opacity">
                  <span className="text-sm">📷</span>
                  <span>{isTamil ? 'புகைப்படம்' : 'Change'}</span>
                </div>
              )}
            </div>
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">{displayName || 'Investor'}</h1>
                <span className={`px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-full border ${role === 'admin'
                    ? 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-400/40'
                    : role === 'publisher'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#23645C] dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-black'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>
                  {role === 'admin' ? 'Administrator' : (role === 'publisher' ? 'AMFI Publisher / Advisor' : 'Investor')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">{email}</p>
              <p className="text-xs text-[#23645C] dark:text-emerald-400 font-semibold">
                {profile?.title || (isTamil ? 'முதலீட்டு திசை நிதி தளத்தின் உறுப்பினர்' : 'Muthaleetu Thisai Certified Member')}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isPublisher && (
                <button
                  onClick={() => setIsEditingPublisherModalOpen(true)}
                  className="btn-magnetic px-4 py-2 rounded-xl bg-[#23645C] hover:bg-[#1a4b45] text-white font-black text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>✏️</span>
                  <span>{isTamil ? 'சான்றுகளை திருத்து' : 'Edit Credentials'}</span>
                </button>
              )}
              <button
                onClick={signOut}
                className="btn-magnetic px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold transition-all shrink-0"
              >
                {isTamil ? 'வெளியேறு (Logout)' : 'Logout'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs on #23645C Canvas */}
        <div className="flex items-center gap-2 border-b border-white/20 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-white/90 bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-xs'
              }`}
          >
            {isTamil ? 'சுயவிவர விவரங்கள்' : 'Profile Settings'}
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'bookmarks'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-white/90 bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-xs'
              }`}
          >
            {isTamil ? `சேமிக்கப்பட்டவை (${bookmarks.length})` : `Saved Bookmarks (${bookmarks.length})`}
          </button>
        </div>

      {/* Tab Content: Settings */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Account Basics & Password Management */}
          <div className="space-y-6">
            {/* Account Basics Form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif flex items-center gap-2">
                <span>👤</span>
                <span>{isTamil ? 'கணக்கு அமைப்புகள்' : 'Personal Details'}</span>
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {isTamil ? 'முழு பெயர்' : 'Display Name'}
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-magnetic px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isSaving ? (isTamil ? 'சேமிக்கிறது...' : 'Saving...') : (isTamil ? 'மாற்றங்களைச் சேமி' : 'Save Changes')}
                </button>
              </form>
            </div>

            {/* Security & Dynamic Password Check / Change Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                      {isTamil ? 'பாதுகாப்பு & கடவுச்சொல் மாற்றம்' : 'Security & Password'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isTamil ? 'தற்போதைய கடவுச்சொல்லை சரிபார்த்து புதிய கடவுச்சொல்லை மாற்றவும்' : 'Verify current password to dynamically update password'}
                    </p>
                  </div>
                </div>
                {isPasswordVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {isTamil ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
                  </span>
                )}
              </div>

              {/* Dynamic Error Message Alert */}
              {pwError && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-start gap-2 animate-fadeIn">
                  <span className="text-sm">⚠️</span>
                  <span className="flex-1">{pwError}</span>
                </div>
              )}

              {/* Dynamic Success Message Alert */}
              {pwSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-start gap-2 animate-fadeIn">
                  <span className="text-sm">✓</span>
                  <span className="flex-1">{pwSuccess}</span>
                </div>
              )}

              {/* Step 1 & Step 2 Forms */}
              <form onSubmit={!isPasswordVerified ? handleCheckCurrentPassword : handleUpdatePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isTamil ? 'தற்போதைய கடவுச்சொல்' : 'Current Password'}
                    </label>
                    {isPasswordVerified && (
                      <button
                        type="button"
                        onClick={handleResetPwFlow}
                        className="text-xs font-bold text-amber-500 hover:underline"
                      >
                        {isTamil ? 'மறுதொடக்கம்' : 'Reset'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      required
                      disabled={isPasswordVerified || isCheckingPw}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (pwError) setPwError('');
                      }}
                      placeholder={isTamil ? "தற்போதைய கடவுச்சொல்லை உள்ளிடவும்" : "Enter current password"}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all pr-10 ${isPasswordVerified
                          ? 'bg-emerald-500/5 border-emerald-500/40 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500'
                        }`}
                    />
                    <button
                      type="button"
                      disabled={isPasswordVerified}
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrentPw ? (isTamil ? 'மறை' : 'Hide') : (isTamil ? 'காட்டு' : 'Show')}
                    </button>
                  </div>
                </div>

                {/* Password Check Action Button (Shown when not yet verified) */}
                {!isPasswordVerified && (
                  <button
                    type="submit"
                    disabled={isCheckingPw || !currentPassword.trim()}
                    className="btn-magnetic w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-700 disabled:opacity-50 shadow-sm"
                  >
                    {isCheckingPw ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>{isTamil ? 'சரிபார்க்கிறது...' : 'Checking Password...'}</span>
                      </>
                    ) : (
                      <>
                        <span>🔍</span>
                        <span>{isTamil ? 'கடவுச்சொல்லை சரிபார்' : 'Check Password'}</span>
                      </>
                    )}
                  </button>
                )}

                {/* Step 2: Dynamic New Password Fields (Rendered only after Condition is TRUE) */}
                {isPasswordVerified && (
                  <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-medium flex items-center gap-2">
                      <span>💡</span>
                      <span>{isTamil ? 'சரிபார்ப்பு முடிந்தது. புதிய கடவுச்சொல்லை அமைத்து சேமிக்கவும்.' : 'Verification passed! Enter your new password below.'}</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isTamil ? 'புதிய கடவுச்சொல்' : 'New Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (pwError) setPwError('');
                          }}
                          placeholder={isTamil ? "புதிய கடவுச்சொல் (குறைந்தது 6 எழுத்துகள்)" : "New password (min 6 characters)"}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showNewPw ? (isTamil ? 'மறை' : 'Hide') : (isTamil ? 'காட்டு' : 'Show')}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isTamil ? 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்' : 'Confirm New Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPw ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (pwError) setPwError('');
                          }}
                          placeholder={isTamil ? "புதிய கடவுச்சொல்லை மீண்டும் உள்ளிடவும்" : "Re-enter new password"}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw(!showConfirmPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showConfirmPw ? (isTamil ? 'மறை' : 'Hide') : (isTamil ? 'காட்டு' : 'Show')}
                        </button>
                      </div>
                    </div>

                    {/* Realtime Requirements Checklist */}
                    <div className="flex flex-wrap gap-2 text-xs font-bold">
                      <span className={`px-2 py-0.5 rounded-md ${newPassword.length >= 6
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                        {newPassword.length >= 6 ? '✓ ' : '• '} {isTamil ? 'குறைந்தது 6 எழுத்துகள்' : 'At least 6 chars'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md ${newPassword && confirmPassword && newPassword === confirmPassword
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                        {newPassword && confirmPassword && newPassword === confirmPassword ? '✓ ' : '• '} {isTamil ? 'கடவுச்சொற்கள் பொருந்துகின்றன' : 'Passwords match'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingPw || newPassword.length < 6 || newPassword !== confirmPassword}
                        className="btn-magnetic flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                      >
                        {isUpdatingPw ? (
                          <>
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>{isTamil ? 'மாற்றுகிறது...' : 'Updating...'}</span>
                          </>
                        ) : (
                          <>
                            <span>🔑</span>
                            <span>{isTamil ? 'புதிய கடவுச்சொல்லை சேமி' : 'Save New Password'}</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetPwFlow}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
                      >
                        {isTamil ? 'ரத்துசெய்' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Publisher Credentials Card or Quick Actions */}
          <div className="space-y-6">
            {isPublisher && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-slate-900 dark:text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💼</span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                      {isTamil ? 'வெளியீட்டாளர் & AMFI சான்றுகள்' : 'Publisher & AMFI Credentials'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsEditingPublisherModalOpen(true)}
                    className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <span>✏️</span>
                    <span>{isTamil ? 'திருத்து' : 'Edit'}</span>
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">{isTamil ? 'பதவி / பதவிப்பெயர்:' : 'Designation:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">{profile?.title || 'AMFI Registered MFD'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">{isTamil ? 'AMFI ARN எண்:' : 'ARN License:'}</span>
                    <span className="font-mono font-bold text-[#24874b] dark:text-[#32B363]">{profile?.arn_number || 'Not Set'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">{isTamil ? 'அதிகாரப்பூர்வ வலைத்தளம்:' : 'Official Website:'}</span>
                    <div className="text-right">
                      {profile?.website_url ? (
                        <a
                          href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#24874b] dark:text-[#32B363] hover:underline text-xs truncate max-w-[180px] block"
                        >
                          {profile.website_url.replace(/^https?:\/\//, '')} ↗
                        </a>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-xs italic">Not Set</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">{isTamil ? 'வாட்ஸ்அப் ஆலோசனை:' : 'WhatsApp:'}</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{profile?.whatsapp_number || profile?.phone || 'Not Set'}</span>
                  </div>
                  <div className="py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">{isTamil ? 'சிறப்புத் துறைகள்:' : 'Specialties:'}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile?.specialties && Array.isArray(profile.specialties) ? (
                        profile.specialties.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-600 dark:text-slate-400">Mutual Funds, SIPs, Wealth Planning</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate && onNavigate(`#/professionals/${profile?.id || user?.id}`)}
                    className="w-full py-2.5 rounded-xl bg-[#32B363] hover:bg-[#289a54] text-white font-bold text-xs shadow-md shadow-[#32B363]/25 transition-all text-center"
                  >
                    {isTamil ? 'உங்கள் பொது சுயவிவரத்தைக் காண்க →' : 'View Your Public Profile →'}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                {isTamil ? 'விரைவு வழிசெலுத்தல்' : 'Quick Actions'}
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => onNavigate && onNavigate('#/history')}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-500">▶</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {isTamil ? 'பார்த்த வீடியோக்களின் வரலாறு' : 'View Watch History'}
                    </span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">({history.length}) →</span>
                </button>

                <button
                  onClick={() => onNavigate && onNavigate('#/professionals')}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-500">👥</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {isTamil ? 'அனைத்து நிதி நிபுணர்கள் & ஆலோசகர்கள்' : 'Browse All Wealth Advisors'}
                    </span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publisher Edit Modal when opened from profile */}
      {isEditingPublisherModalOpen && (
        <PublisherOnboardingModal
          profile={profile}
          onClose={() => setIsEditingPublisherModalOpen(false)}
          onComplete={(updated) => {
            if (setProfile) setProfile(updated);
            setIsEditingPublisherModalOpen(false);
            if (onShowToast) onShowToast(isTamil ? 'வெளியீட்டாளர் சுயவிவரம் புதுப்பிக்கப்பட்டது!' : 'Publisher profile updated successfully!');
          }}
        />
      )}

      {/* Tab Content: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {bookmarks.map((item, idx) => (
                <div
                  key={`bm-${item.id || idx}`}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col justify-between space-y-3 shadow-sm hover:border-amber-500/50 transition-all cursor-pointer"
                  onClick={() => {
                    if (item.youtubeId || item.duration) {
                      if (onNavigate) onNavigate('#/videos');
                    } else if (item.slug) {
                      if (onNavigate) onNavigate(`#/news/${item.slug}`);
                    }
                  }}
                >
                  <div className="space-y-2">
                    {item.thumbnail && (
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                        <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 font-serif">
                      {item.title || item.titleTamil || item.titleEnglish}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black uppercase text-amber-500">
                      {item.category || 'SAVED'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item);
                        if (onShowToast) onShowToast(isTamil ? 'நீக்கப்பட்டது' : 'Removed from bookmarks');
                      }}
                      className="text-xs text-red-500 hover:text-red-600 font-bold"
                    >
                      {isTamil ? 'நீக்கு' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                {isTamil ? 'சேமிக்கப்பட்ட கட்டுரைகள் அல்லது வீடியோக்கள் எதுவும் இல்லை.' : 'No bookmarked videos or articles yet.'}
              </p>
              <button
                onClick={() => onNavigate && onNavigate('#/videos')}
                className="btn-magnetic px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs mt-2"
              >
                {isTamil ? 'வீடியோக்களைப் பார்வையிடு' : 'Explore Masterclasses'}
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}


export default ProfilePage;
export { ProfilePage };
