import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { RichTextEditor } from '../../components/RichTextEditor.jsx';

export function ArticleEditor({ articleId, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session, role, supabase } = useAuth();
  const isTamil = language === 'ta';

  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [titleTa, setTitleTa] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [excerptTa, setExcerptTa] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [bodyTa, setBodyTa] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [category, setCategory] = useState('mutual-fund');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('draft');
  const [activeTab, setActiveTab] = useState('ta'); // 'ta' | 'en'

  // Helper to generate URL-safe slug
  const slugify = (text) => {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate slug when title changes unless admin edited slug manually
  const handleTitleTaChange = (e) => {
    const val = e.target.value;
    setTitleTa(val);
    if (!isSlugManual && !articleId) {
      const generated = slugify(titleEn || val);
      if (generated) setSlug(generated);
    }
  };

  const handleTitleEnChange = (e) => {
    const val = e.target.value;
    setTitleEn(val);
    if (!isSlugManual && !articleId) {
      const generated = slugify(val);
      if (generated) setSlug(generated);
    }
  };

  // Load existing article if editing
  useEffect(() => {
    if (!articleId || articleId === 'new') return;

    let isMounted = true;
    const loadArticle = async () => {
      setIsLoading(true);
      try {
        const token = session?.access_token || '';
        const res = await fetch(`/api/admin/articles/${articleId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load article details');
        const data = await res.json();
        const a = data.data;

        if (isMounted && a) {
          setTitleTa(a.title_ta || a.titleTamil || '');
          setTitleEn(a.title_en || a.titleEnglish || '');
          setSlug(a.slug || '');
          setIsSlugManual(true);
          setExcerptTa(a.excerpt_ta || a.excerptTamil || '');
          setExcerptEn(a.excerpt_en || a.excerptEnglish || '');
          setBodyTa(a.body_ta || a.bodyTamil || '');
          setBodyEn(a.body_en || a.bodyEnglish || '');
          setCoverImageUrl(a.cover_image_url || a.coverImage || '');
          setCategory(a.category || 'mutual-fund');
          setTagsInput(Array.isArray(a.tags) ? a.tags.join(', ') : '');
          setStatus(a.status || 'draft');
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadArticle();
    return () => { isMounted = false; };
  }, [articleId, session]);

  // Handle Cover Image Upload to Supabase Storage
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setError('');

    try {
      if (supabase && supabase.storage) {
        const fileExt = file.name.split('.').pop();
        const fileName = `cover_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('article-covers')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('article-covers')
          .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
          setCoverImageUrl(publicUrlData.publicUrl);
          if (onShowToast) onShowToast(isTamil ? 'படம் பதிவேற்றப்பட்டது!' : 'Cover image uploaded!');
          setIsUploadingImage(false);
          return;
        }
      }

      // Fallback: Read as base64 data URL
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImageUrl(reader.result);
        if (onShowToast) onShowToast('Image loaded');
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);

    } catch (err) {
      console.error('Image upload failed:', err);
      setError(`Image upload error: ${err.message}`);
      setIsUploadingImage(false);
    }
  };

  // Auto-translate Tamil content to English
  const handleAutoTranslate = async () => {
    if (!titleTa && !bodyTa) {
      setError(isTamil ? 'மொழிபெயர்க்க தலைப்பு அல்லது உள்ளடக்கத்தை உள்ளிடவும்.' : 'Please enter a Tamil title or body to translate.');
      return;
    }

    setIsTranslating(true);
    setError('');

    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title_ta: titleTa,
          excerpt_ta: excerptTa,
          body_ta: bodyTa
        })
      });

      if (!res.ok) throw new Error('Translation API request failed');

      const result = await res.json();
      if (result.data) {
        if (result.data.title_en) {
          setTitleEn(result.data.title_en);
          if (!slug || !isSlugManual) {
            setSlug(slugify(result.data.title_en));
          }
        }
        if (result.data.excerpt_en) setExcerptEn(result.data.excerpt_en);
        if (result.data.body_en) setBodyEn(result.data.body_en);

        setActiveTab('en');
        if (onShowToast) onShowToast(isTamil ? 'ஆங்கில மொழிபெயர்ப்பு உருவாக்கப்பட்டது! சரிபார்க்கவும்.' : 'English translation generated! Please review.');
      }
    } catch (err) {
      console.error('Auto-translate error:', err);
      setError(`Translation error: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  // Save / Publish Article
  const handleSave = async (publishNow = false) => {
    setError('');

    if (!titleTa || !titleTa.trim()) {
      setError(isTamil ? 'தமிழ் தலைப்பு அவசியம்.' : 'Tamil Title is required.');
      return;
    }

    if (!bodyTa || !bodyTa.trim() || bodyTa === '<p><br></p>') {
      setError(isTamil ? 'தமிழ் உள்ளடக்கம் அவசியம்.' : 'Tamil Article Body is required.');
      return;
    }

    let finalSlug = slug ? slugify(slug) : slugify(titleEn || titleTa);
    if (!finalSlug) {
      finalSlug = `article-${Date.now()}`;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      slug: finalSlug,
      title_ta: titleTa.trim(),
      title_en: titleEn.trim() || null,
      excerpt_ta: excerptTa.trim() || null,
      excerpt_en: excerptEn.trim() || null,
      body_ta: bodyTa,
      body_en: bodyEn || null,
      cover_image_url: coverImageUrl || null,
      category,
      tags,
      status: publishNow ? 'published' : 'draft'
    };

    setIsLoading(true);

    try {
      const token = session?.access_token || '';
      const isEditing = articleId && articleId !== 'new';
      const endpoint = isEditing ? `/api/admin/articles/${articleId}` : '/api/admin/articles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save article');
      }

      if (onShowToast) {
        onShowToast(publishNow ? (isTamil ? 'கட்டுரை உடனடியாக வெளியிடப்பட்டது! 🎉' : 'Article published live! 🎉') : (isTamil ? 'வரைவு சேமிக்கப்பட்டது.' : 'Article draft saved.'));
      }

      if (publishNow && data.data?.slug) {
        if (onNavigate) {
          onNavigate(`#/articles/${data.data.slug}`);
        } else {
          window.location.hash = `#/articles/${data.data.slug}`;
        }
      } else {
        if (onNavigate) {
          onNavigate('#/admin/articles');
        } else {
          window.location.hash = '#/admin/articles';
        }
      }

    } catch (err) {
      console.error('Save article error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 text-center bg-red-500/10 rounded-3xl border border-red-500/30 text-red-600 font-bold">
        Access denied: Administrator role required.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <button
            onClick={() => onNavigate ? onNavigate('#/admin/articles') : (window.location.hash = '#/admin/articles')}
            className="text-xs font-bold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1"
          >
            ← {isTamil ? 'கட்டுரைகள் பட்டியலுக்குத் திரும்பு' : 'Back to Articles Studio'}
          </button>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif mt-2">
            {articleId && articleId !== 'new'
              ? (isTamil ? 'கட்டுரையைத் திருத்துக' : 'Edit Article')
              : (isTamil ? 'புதிய கட்டுரை எழுதுக' : 'Write New Article')}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all shadow-sm disabled:opacity-50"
          >
            💾 {isTamil ? 'வரைவாகச் சேமி (Draft)' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>🚀</span>
            <span>{isTamil ? 'உடனே வெளியிடு (Publish Live)' : 'Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form Grid */}
      <div className="space-y-6">
        {/* Row 1: Primary Titles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTamil ? 'தமிழ் தலைப்பு (முதன்மை)' : 'Tamil Title (Primary) *'}
              </label>
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">TAMIL</span>
            </div>
            <input
              type="text"
              value={titleTa}
              onChange={handleTitleTaChange}
              placeholder="எ.கா: 2026ல் முதலீடு செய்ய சிறந்த 5 Flexi Cap மியூச்சுவல் ஃபண்டுகள்"
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-serif"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTamil ? 'ஆங்கில தலைப்பு' : 'English Title'}
              </label>
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">ENGLISH</span>
            </div>
            <input
              type="text"
              value={titleEn}
              onChange={handleTitleEnChange}
              placeholder="e.g. Top 5 Flexi Cap Mutual Funds to Invest in 2026"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Row 2: Slug, Category & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* URL Slug */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'URL Slug (இணைப்பு முகவரி) *' : 'URL Slug *'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setIsSlugManual(true); }}
                placeholder="top-flexi-cap-funds-2026"
                required
                className="w-full pl-7 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'பிரிவு (Category)' : 'Category'}
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="mutual-fund">💰 Mutual Funds</option>
              <option value="stock-market">📈 Stock Market</option>
              <option value="personal-finance">💡 Personal Finance</option>
              <option value="financial-education">🎓 Financial Education</option>
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'குறிச்சொற்கள் (Tags, comma separated)' : 'Tags (comma separated)'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="SIP, NIFTY 50, Wealth, Tax"
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Row 3: Cover Image Upload & Preview */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTamil ? 'முகப்புப் படம் (Cover Image)' : 'Cover Image Upload & URL'}
              </label>
              <p className="text-[11px] text-slate-400">
                {isTamil ? 'Supabase Storage "article-covers" பக்கத்தில் பதிவேற்றப்படும்.' : 'Uploads directly to Supabase Storage "article-covers" bucket.'}
              </p>
            </div>
            {isUploadingImage && (
              <span className="text-xs font-bold text-amber-500 animate-pulse">
                Uploading image...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                disabled={isUploadingImage}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-6">
              <input
                type="text"
                value={coverImageUrl}
                onChange={e => setCoverImageUrl(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {coverImageUrl && (
            <div className="relative aspect-[21/9] max-h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md">
              <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverImageUrl('')}
                className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px] shadow"
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        {/* Row 4: Auto-Translate Toolbar */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950 border border-amber-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-base font-black">⚡</span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                {isTamil ? 'தானியங்கி ஆங்கில மொழிபெயர்ப்பு' : 'AI & Rule-Protected Auto Translation'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {isTamil
                ? 'தமிழ் தலைப்பு, சுருக்கம், கட்டுரையை ஆங்கிலத்தில் மொழிபெயர்த்து சரிபார்க்க உதவும்.'
                : 'Translates Tamil title, excerpt & body into English with financial terms protected (NIFTY, SIP, etc.) for admin review.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isTranslating}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all hover:scale-105 disabled:opacity-50 shrink-0"
          >
            {isTranslating ? 'Translating...' : (isTamil ? '🔄 ஆங்கிலத்தில் மொழிபெயர்க்க' : '🔄 Auto-Translate to English')}
          </button>
        </div>

        {/* Row 5: Excerpts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'சுருக்க உரை (Tamil Excerpt)' : 'Tamil Excerpt (Card Summary)'}
            </label>
            <textarea
              rows={3}
              value={excerptTa}
              onChange={e => setExcerptTa(e.target.value)}
              placeholder="கட்டுரையின் முக்கிய சிறப்பம்சங்கள் மற்றும் சுருக்கம்..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed font-serif"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'ஆங்கில சுருக்க உரை (English Excerpt)' : 'English Excerpt'}
            </label>
            <textarea
              rows={3}
              value={excerptEn}
              onChange={e => setExcerptEn(e.target.value)}
              placeholder="Short preview summary shown on the article cards..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Row 6: Language Tabs & Rich Text Body Editors */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('ta')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'ta'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                🇮🇳 தமிழ் உள்ளடக்கம் (Tamil Body) *
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'en'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                🌐 English Body (Reviewed)
              </button>
            </div>

            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
              Rich Text HTML Engine
            </span>
          </div>

          {activeTab === 'ta' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {isTamil ? 'தமிழ் கட்டுரையின் முழு உள்ளடக்கம் (Rich Text):' : 'Tamil Article Rich Body:'}
              </label>
              <RichTextEditor
                value={bodyTa}
                onChange={setBodyTa}
                placeholder="இங்கே உங்கள் கட்டுரையை தமிழில் விரிவாக எழுதுங்கள்..."
                language="ta"
                minHeight="380px"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {isTamil ? 'ஆங்கில கட்டுரையின் முழு உள்ளடக்கம் (சரிபார்க்கவும்):' : 'English Article Rich Body (Review & Polish):'}
              </label>
              <RichTextEditor
                value={bodyEn}
                onChange={setBodyEn}
                placeholder="English translation content for global/bilingual readers..."
                language="en"
                minHeight="380px"
              />
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('#/admin/articles') : (window.location.hash = '#/admin/articles')}
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            {isTamil ? 'ரத்து செய்க' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs shadow hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            💾 {isTamil ? 'வரைவாகச் சேமி (Save Draft)' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span>🚀</span>
            <span>{isTamil ? 'உடனே வெளியிடு (Publish Live)' : 'Publish Live'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
