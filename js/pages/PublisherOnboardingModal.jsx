import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function PublisherOnboardingModal({ profile, onComplete, onClose }) {
  const { language } = useLanguage();
  const { session, setProfile } = useAuth();
  const isTamil = language === 'ta';
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [title, setTitle] = useState(profile?.title || 'AMFI Registered Mutual Fund Distributor');
  const [arnNumber, setArnNumber] = useState(profile?.arn_number || '');
  const [specialties, setSpecialties] = useState(
    Array.isArray(profile?.specialties)
      ? profile.specialties.join(', ')
      : (profile?.specialties || 'Mutual Funds, SIPs, Wealth Compounding, Tax Saving')
  );
  const [bio, setBio] = useState(profile?.bio || '');
  const [bioTa, setBioTa] = useState(profile?.bio_ta || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '');
  const [twitterUrl, setTwitterUrl] = useState(profile?.twitter_url || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');
  const [whatsappNumber, setWhatsappNumber] = useState(profile?.whatsapp_number || profile?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [photoMode, setPhotoMode] = useState('upload'); // 'upload' | 'url' | 'presets'

  // Curated professional avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
  ];

  // Handle local image file upload directly to Supabase Storage media bucket
  const handleImageFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(isTamil ? 'தயவுசெய்து சரியான படக் கோப்பைத் தேர்ந்தெடுக்கவும்.' : 'Please select a valid image file.');
      return;
    }

    setIsUploadingPhoto(true);
    setError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) {
        setIsUploadingPhoto(false);
        return;
      }

      try {
        const token = session?.access_token || '';
        // 1. Try server-side upload endpoint
        const res = await fetch('/api/admin/articles?action=upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fileData: dataUrl,
            fileName: file.name,
            fileType: file.type || 'image/jpeg',
            folder: 'avatars'
          })
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.data?.url) {
            setAvatarUrl(json.data.url);
            setIsUploadingPhoto(false);
            return;
          }
        }

        // 2. Direct client supabase fallback
        if (supabase && supabase.storage) {
          const fileExt = file.name.split('.').pop() || 'jpg';
          const userId = session?.user?.id || profile?.id || 'advisor';
          const filePath = `avatars/${userId}_${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file, { cacheControl: '31536000', upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(filePath);

            if (publicUrlData && publicUrlData.publicUrl) {
              setAvatarUrl(publicUrlData.publicUrl);
              setIsUploadingPhoto(false);
              return;
            }
          }
        }

        // 3. Fallback: Base64 data URL
        setAvatarUrl(dataUrl);
      } catch (err) {
        console.warn('Avatar upload fallback to dataUrl:', err);
        setAvatarUrl(dataUrl);
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    reader.onerror = () => {
      setError(isTamil ? 'படத்தை வாசிப்பதில் பிழை ஏற்பட்டது.' : 'Failed to read photo file.');
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const token = session?.access_token || '';
      const payload = {
        display_name: displayName.trim(),
        avatar_url: avatarUrl.trim(),
        title: title.trim(),
        arn_number: arnNumber.trim(),
        specialties: typeof specialties === 'string'
          ? specialties.split(',').map(s => s.trim()).filter(Boolean)
          : specialties,
        bio: bio.trim(),
        bio_ta: bioTa.trim(),
        linkedin_url: linkedinUrl.trim(),
        twitter_url: twitterUrl.trim(),
        website_url: websiteUrl.trim(),
        whatsapp_number: whatsappNumber.trim(),
        phone: whatsappNumber.trim()
      };

      const res = await fetch('/api/publisher/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save publisher profile');

      const updated = json.data || { ...profile, ...payload, is_onboarded: true };
      if (setProfile) setProfile(updated);
      try {
        localStorage.removeItem('muthaleetu_publishers_cache');
      } catch (_) {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('publisher-profile-updated', { detail: updated }));
      }
      if (onComplete) onComplete(updated);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85  animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Step Switcher */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 text-white border-b border-slate-800 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="flex items-center justify-between mb-2 pr-10">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
              PUBLISHER PROFILE & CREDENTIALS
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">
              Step {step} of 3
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
            {isTamil ? 'வெளியீட்டாளர் விவரங்கள் & சான்றுகள்' : 'Edit Publisher Profile & Credentials'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isTamil ? 'உங்கள் சுயவிவர புகைப்படம், AMFI பதிவு எண், சிறப்புத் துறைகள் மற்றும் சமூக வலைத்தள இணைப்புகள்.' : 'Update your profile photo, AMFI ARN number, bio, and consultation channels for investors.'}
          </p>

          {/* Interactive Step Switcher Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${step === 1 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-200'
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="truncate">1. Photo & Identity</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${step === 2 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-200'
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">2. Bio & Specialties</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${step === 3 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-200'
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="truncate">3. Social & Contact</span>
            </button>
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')} className="p-1 hover:text-red-800" aria-label="Dismiss error">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* STEP 1: PHOTO & CREDENTIALS */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Avatar Live Preview & Photo Uploader Box */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Avatar Large Preview */}
                  <div className="relative group/photo shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 overflow-hidden border-2 border-amber-500 flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span>{(displayName || 'P').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 rounded-3xl bg-slate-950/70  flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Photo Actions */}
                  <div className="space-y-3 flex-1 text-center sm:text-left w-full">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        {isTamil ? 'சுயவிவரப் புகைப்படம் (Profile Photo)' : 'Publisher Profile Photo'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isTamil ? 'உங்கள் சாதனத்திலிருந்து புகைப்படத்தைப் பதிவேற்றவும் அல்லது இணைப்பை உள்ளிடவும்.' : 'Upload directly from your device, choose a curated preset, or paste an image URL.'}
                      </p>
                    </div>

                    {/* Action Buttons: Upload & Presets */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>{isTamil ? 'படத்தை பதிவேற்றுக' : 'Upload from Device'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPhotoMode(photoMode === 'url' ? 'upload' : 'url')}
                        className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:border-amber-500 transition-all flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>{photoMode === 'url' ? 'Hide URL' : 'Image URL'}</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl('')}
                          className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>{isTamil ? 'அகற்று' : 'Clear'}</span>
                        </button>
                      )}
                    </div>

                    {/* Image URL Input (when toggled) */}
                    {photoMode === 'url' && (
                      <div className="space-y-1 pt-1 animate-fadeIn">
                        <input
                          type="url"
                          value={avatarUrl}
                          onChange={e => setAvatarUrl(e.target.value)}
                          placeholder="https://example.com/your-photo.jpg"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}

                    {/* Quick Avatar Presets */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Presets:</span>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                          {avatarPresets.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setAvatarUrl(preset)}
                              className={`w-7 h-7 rounded-full overflow-hidden border transition-all ${avatarUrl === preset
                                  ? 'border-amber-500 scale-110 shadow-md ring-2 ring-amber-500/40'
                                  : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                              <img src={preset} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Full Display Name *</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-normal">Shown publicly on all articles & directory</span>
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Ramesh V"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Title & ARN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Professional Designation
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="AMFI Registered Mutual Fund Distributor"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    AMFI ARN / SEBI Registration Number
                  </label>
                  <input
                    type="text"
                    value={arnNumber}
                    onChange={e => setArnNumber(e.target.value)}
                    placeholder="e.g. ARN-56291"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-amber-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BIO & SPECIALTIES */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Specialties */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Areas of Expertise / Specialties (Comma separated)
                </label>
                <input
                  type="text"
                  value={specialties}
                  onChange={e => setSpecialties(e.target.value)}
                  placeholder="Mutual Funds, Equity SIPs, Wealth Compounding, Tax Saving"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  e.g. Mutual Funds, SIP Strategies, Retirement Planning, Sovereign Gold Bonds, ELSS Tax Saving
                </p>
              </div>

              {/* Bio (English) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  About You & Investment Philosophy (English)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Share your experience, investment philosophy, and wealth compounding approach..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Bio (Tamil) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  சுயவிவரம் & முதலீட்டு நோக்கம் (தமிழ்)
                </label>
                <textarea
                  rows={3}
                  value={bioTa}
                  onChange={e => setBioTa(e.target.value)}
                  placeholder="உங்கள் நிதி ஆலோசனை அனுபவம் மற்றும் முதலீட்டாளர்களுக்கான வழிகாட்டல்..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-serif"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SOCIAL & CONNECT LINKS */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* WhatsApp Consultation */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.004 0C5.373 0 0 5.373 0 12.004c0 2.115.548 4.103 1.51 5.836L.062 23.938l6.273-1.411a11.947 11.947 0 005.669 1.481h.005c6.63 0 12.003-5.374 12.003-12.004 0-3.208-1.25-6.223-3.518-8.492C18.226 1.244 15.212 0 12.004 0zm0 21.993h-.004a9.94 9.94 0 01-5.074-1.393l-.364-.216-3.771.849.865-3.676-.237-.378a9.92 9.92 0 01-1.523-5.175c0-5.488 4.467-9.956 9.957-9.956 2.658 0 5.158 1.036 7.038 2.916 1.88 1.88 2.915 4.38 2.915 7.038 0 5.489-4.468 9.957-9.802 9.957z" />
                  </svg>
                  <span>Direct WhatsApp Consultation Number</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="+91 98400 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-xs text-emerald-600 dark:text-emerald-400/80">
                  Enables users to connect with you directly via WhatsApp on your profile and articles.
                </p>
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn Profile URL</span>
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Official Website URL */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <label className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>{isTamil ? 'அதிகாரப்பூர்வ வலைத்தளம் (Website URL)' : 'Official Website URL'}</span>
                  </span>
                  <span className="text-xs text-amber-800 font-semibold">{isTamil ? 'இணைப்பு' : 'Direct Link'}</span>
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  placeholder="https://www.yourwebsite.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-xs text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
                  {isTamil
                    ? 'உங்கள் தனிப்பட்ட அல்லது நிறுவன வலைத்தள இணைப்பை உள்ளிடவும். முதலீட்டாளர்கள் மற்றும் வாசகர்கள் உங்கள் சேவைகளைப் பற்றி மேலும் அறிய இந்த இணைப்பைப் பார்வையிடலாம்.'
                    : 'Enter your personal or advisory website URL. Readers and investors can visit your official website to learn more about your services.'}
                </p>
              </div>

              {/* Twitter / X */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>Twitter / X Profile URL or Handle</span>
                </label>
                <input
                  type="text"
                  value={twitterUrl}
                  onChange={e => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/yourhandle or @yourhandle"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 3 && (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !displayName.trim()) {
                    setError('Please enter your full display name');
                    return;
                  }
                  setError('');
                  setStep(s => s + 1);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <span>→</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !displayName.trim()}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Saving Profile...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/**
 * RICH TEXT EDITOR — Inline contentEditable editor with formatting toolbar.
 * Props: value (HTML string), onChange (fn), placeholder, language, minHeight
 */

export default PublisherOnboardingModal;
export { PublisherOnboardingModal };
