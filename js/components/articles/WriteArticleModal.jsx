import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const CATEGORIES = [
  { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance' },
  { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
  { id: 'stocks', labelTa: 'பங்குச் சந்தை & வர்த்தகம்', labelEn: 'Stocks & Markets' },
  { id: 'tax-retirement', labelTa: 'வரி சேமிப்பு & ஓய்வூதியம்', labelEn: 'Tax & Retirement' },
  { id: 'financial-education', labelTa: 'நிதி அறிவு & வழிகாட்டி', labelEn: 'Financial Education' },
  { id: 'quick-takes', labelTa: 'விரைவு பார்வைகள்', labelEn: 'Quick Takes' }
];

export default function WriteArticleModal({ isOpen, onClose, onSuccess, onShowToast }) {
  const { language } = useLanguage();
  const { user, profile, session } = useAuth();
  const isTamil = language === 'ta';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('personal-finance');
  const [displayName, setDisplayName] = useState(() => {
    return profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  });
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Optional inline images
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [isUploadingInline, setIsUploadingInline] = useState(false);

  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const inlineFileInputRef = useRef(null);
  const bodyTextareaRef = useRef(null);

  if (!isOpen) return null;

  // Handle Cover Image Upload
  const handleCoverFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(isTamil ? 'JPG, PNG, WEBP படங்கள் மட்டுமே அனுமதிக்கப்படும்.' : 'Only JPG, PNG, or WEBP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(isTamil ? 'படத்தின் அளவு 5MB-க்கு குறைவாக இருக்க வேண்டும்.' : 'Image size must be less than 5MB.');
      return;
    }

    setError('');
    setIsUploadingCover(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result;
        const token = session?.access_token || '';

        const res = await fetch('/api/article-submissions?action=upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileData,
            fileName: file.name,
            fileType: file.type
          })
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Failed to upload cover image');
        }

        setCoverImageUrl(json.data.url);
        if (onShowToast) onShowToast(isTamil ? 'முகப்புப் படம் வெற்றிகரமாக பதிவேற்றப்பட்டது!' : 'Cover image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message || 'Image upload failed');
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Handle Optional Inline Image Upload
  const handleInlineFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(isTamil ? 'படத்தின் அளவு 5MB-க்கு குறைவாக இருக்க வேண்டும்.' : 'Image size must be less than 5MB.');
      return;
    }

    setError('');
    setIsUploadingInline(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result;
        const token = session?.access_token || '';

        const res = await fetch('/api/article-submissions?action=upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileData,
            fileName: file.name,
            fileType: file.type
          })
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Failed to upload image');
        }

        const url = json.data.url;
        setInlineImageUrl(url);
        // Insert markdown image into textarea at cursor or append
        const markdownImg = `\n\n![Illustration](${url})\n\n`;
        setBody(prev => prev + markdownImg);
        if (onShowToast) onShowToast(isTamil ? 'படம் கட்டுரையில் சேர்க்கப்பட்டது!' : 'Image inserted into article body!');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message || 'Inline image upload failed');
    } finally {
      setIsUploadingInline(false);
    }
  };

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = bodyTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = body.substring(start, end);
    const replacement = `${prefix}${selected || (isTamil ? 'உரை' : 'text')}${suffix}`;
    const nextBody = body.substring(0, start) + replacement + body.substring(end);
    setBody(nextBody);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (title.trim().length < 10) {
      setError(isTamil ? 'கட்டுரை தலைப்பு குறைந்தது 10 எழுத்துகள் இருக்க வேண்டும்.' : 'Article title must be at least 10 characters.');
      return;
    }

    if (!displayName.trim()) {
      setError(isTamil ? 'எழுத்தாளர் பெயர் தேவை.' : 'Author name is required.');
      return;
    }

    if (body.trim().length < 50) {
      setError(isTamil ? 'கட்டுரை உள்ளடக்கம் குறைந்தது 50 எழுத்துகள் இருக்க வேண்டும்.' : 'Article content must be at least 50 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/article-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          displayName: displayName.trim(),
          summary: summary.trim(),
          body: body.trim(),
          coverImageUrl: coverImageUrl.trim()
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit article');
      }

      setSubmitSuccess(true);
      if (onSuccess) onSuccess(json.data);
      if (onShowToast) onShowToast(isTamil ? 'கட்டுரை சமர்ப்பிக்கப்பட்டது! ஆசிரியரின் மதிப்பாய்வுக்குப் பிறகு வெளியாகும்.' : 'Article submitted! Awaiting editorial review.');
    } catch (err) {
      setError(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-3xl my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/50 shrink-0">
          <div className="space-y-1 min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A9E2C] animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-serif truncate">
                {isTamil ? 'முதலீட்டு திசைக்கு கட்டுரை எழுதுங்கள்' : 'Write an Article for Muthaleetu Thisai'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isTamil
                ? 'உங்கள் கட்டுரை ஆசிரியரின் மதிப்பாய்வுக்குப் பிறகு "வாசகர் பங்களிப்பு" என வெளியிடப்படும்.'
                : 'Submissions are reviewed by our editorial team and published with your byline as a Community Contribution.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Success State */}
        {submitSuccess ? (
          <div className="p-8 sm:p-12 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-inner">
              ✓
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isTamil ? 'கட்டுரை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!' : 'Article Submitted Successfully!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {isTamil
                  ? 'உங்கள் கட்டுரை ஆசிரியர் குழுவின் பார்வைக்கு அனுப்பப்பட்டுள்ளது. ஏற்றுக்கொள்ளப்பட்டதும் நேரலையில் வெளியாகி அறிவிக்கப்படும். "என் கட்டுரைகள்" பக்கத்தில் இதன் நிலையைப் பார்க்கலாம்.'
                  : 'Your submission has been sent to our editorial desk. Once approved, it will be published live with your byline. You can track status under "My Submissions".'}
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#4A9E2C] hover:bg-[#3d8224] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {isTamil ? 'சரி' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold animate-fadeIn">
                {error}
              </div>
            )}

            {/* Article Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-extrabold text-slate-900 dark:text-slate-200">
                  {isTamil ? 'கட்டுரை தலைப்பு *' : 'Article Title *'}
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {title.length}/200
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={200}
                required
                placeholder={isTamil ? "எ.கா: SIP முதலீட்டின் கூட்டு வட்டி சக்தி: எளிய விளக்கம்" : "e.g. How to Build Long-Term Wealth Starting with Small Monthly SIPs"}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Category & Display Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200">
                  {isTamil ? 'பிரிவு (Category) *' : 'Category *'}
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-600 transition-colors cursor-pointer"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {isTamil ? c.labelTa : c.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Display Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-extrabold text-slate-900 dark:text-slate-200">
                    {isTamil ? 'எழுத்தாளர் பெயர் (Byline) *' : 'Author Byline / Name *'}
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {isTamil ? 'வாசகர் பங்களிப்பு' : 'Community Author'}
                  </span>
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  maxLength={100}
                  required
                  placeholder={isTamil ? "உங்கள் பெயர்" : "Your Name"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200">
                {isTamil ? 'முகப்புப் படம் (Cover Image)' : 'Cover Image (JPG, PNG, WEBP, max 5MB)'}
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCoverFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span>{isUploadingCover ? (isTamil ? 'பதிவேற்றுகிறது...' : 'Uploading...') : (isTamil ? 'படத்தை தேர்வு செய்க' : 'Choose Cover Image')}</span>
                </button>

                <div className="flex-1 w-full">
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={e => setCoverImageUrl(e.target.value)}
                    placeholder={isTamil ? "அல்லது பட இணைய முகவரியை (URL) ஒட்டவும்" : "Or paste image URL (https://...)"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              {coverImageUrl && (
                <div className="relative mt-2 w-full max-w-xs h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group">
                  <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl('')}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white text-xs hover:bg-red-600 transition-colors"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Brief Summary */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-extrabold text-slate-900 dark:text-slate-200">
                  {isTamil ? 'சுருக்கக் குறிப்பு (Summary / Excerpt)' : 'Short Summary / Excerpt'}
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {summary.length}/600
                </span>
              </div>
              <textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                maxLength={600}
                rows={2}
                placeholder={isTamil ? "கட்டுரையின் முக்கிய மையக்கருத்து (1-2 வாக்கியங்கள்)..." : "Brief 1-2 sentence overview of what the reader will learn..."}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-colors resize-none"
              />
            </div>

            {/* Body Content with Formatting Toolbar & Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs pb-1">
                <label className="font-extrabold text-slate-900 dark:text-slate-200">
                  {isTamil ? 'கட்டுரை உள்ளடக்கம் (Article Content) *' : 'Article Body Content *'}
                </label>
                
                {/* Write / Preview Tab Switcher */}
                <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${activeTab === 'write' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                  >
                    {isTamil ? 'எழுதுக' : 'Write'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                  >
                    {isTamil ? 'முன்னோட்டம்' : 'Preview'}
                  </button>
                </div>
              </div>

              {activeTab === 'write' ? (
                <div className="space-y-2">
                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      className="px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 italic font-serif"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n## ', '\n')}
                      className="px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-black"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n### ', '\n')}
                      className="px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-black"
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n- ', '\n')}
                      className="px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-mono"
                      title="Bullet list"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('> ', '\n')}
                      className="px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-mono"
                      title="Quote"
                    >
                      ” Quote
                    </button>

                    <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Inline Image Upload Trigger */}
                    <input
                      type="file"
                      ref={inlineFileInputRef}
                      onChange={handleInlineFileChange}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => inlineFileInputRef.current?.click()}
                      disabled={isUploadingInline}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold cursor-pointer"
                      title="Insert Image"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span>{isUploadingInline ? '...' : (isTamil ? '+ படம் சேர்க்க' : '+ Insert Image')}</span>
                    </button>
                  </div>

                  <textarea
                    ref={bodyTextareaRef}
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    required
                    rows={12}
                    placeholder={isTamil
                      ? "உங்கள் கட்டுரையை இங்கே எழுதுங்கள். தலைப்புகள் (##), குறிப்புகள் (-) மற்றும் தடிமனான எழுத்துகளைப் பயன்படுத்தலாம்..."
                      : "Write your article content here. You can use Markdown or HTML headings (##), lists (-), and bold text (**)..."}
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus:border-blue-600 transition-colors"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>{body.trim().split(/\s+/).filter(Boolean).length} words</span>
                    <span>{body.length}/30000 characters</span>
                  </div>
                </div>
              ) : (
                /* Live Preview Tab */
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 min-h-[280px] max-h-[360px] overflow-y-auto prose dark:prose-invert max-w-none text-xs sm:text-sm">
                  {body ? (
                    <div dangerouslySetInnerHTML={{ __html: body.replace(/\n\n/g, '<br/><br/>') }} />
                  ) : (
                    <p className="text-slate-400 italic">
                      {isTamil ? 'உள்ளடக்கம் எழுதப்பட்டதும் முன்னோட்டம் இங்கே தோன்றும்.' : 'Preview will render here once content is entered.'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Editorial Guidelines Notice */}
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-xs space-y-1">
              <strong className="font-extrabold flex items-center gap-1.5">
                <span>🛡️</span>
                <span>{isTamil ? 'பதிப்பக வழிகாட்டுதல்' : 'Editorial Policy'}</span>
              </strong>
              <p className="text-[11px] leading-relaxed text-blue-800/90 dark:text-blue-300/90">
                {isTamil
                  ? 'கட்டுரைகள் துல்லியமான நிதி வழிகாட்டல் மற்றும் விழிப்புணர்வு கொண்டதாக இருக்க வேண்டும். எந்தவொரு குறிப்பிட்ட பங்குகளையும் வாங்கவோ விற்கவோ தவறாக பரிந்துரைக்கக் கூடாது.'
                  : 'Articles must focus on educational financial principles. Misleading investment advice or unregistered stock recommendations will be rejected.'}
              </p>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                {isTamil ? 'ரத்து செய்க' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isUploadingCover}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4A9E2C] hover:bg-[#3d8224] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>{isTamil ? 'சமர்ப்பிக்கப்படுகிறது...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isTamil ? 'கட்டுரையை சமர்ப்பிக்கவும் →' : 'Submit for Review →'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
