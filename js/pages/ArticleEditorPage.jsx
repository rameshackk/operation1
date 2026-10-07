import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import RichTextEditor from './RichTextEditor.jsx';

function ArticleEditorPage({ articleId, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session, role, user, profile, supabase } = useAuth();
  const isTamil = language === 'ta';

  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');

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
  const [activeTab, setActiveTab] = useState('ta');

  const slugify = (text) => {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleTaChange = (e) => {
    const val = e.target.value;
    setTitleTa(val);
    if (!isSlugManual && (!articleId || articleId === 'new')) {
      const generated = slugify(titleEn || val);
      if (generated) setSlug(generated);
    }
  };

  const handleTitleEnChange = (e) => {
    const val = e.target.value;
    setTitleEn(val);
    if (!isSlugManual && (!articleId || articleId === 'new')) {
      const generated = slugify(val);
      if (generated) setSlug(generated);
    }
  };

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
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to load article details');
        }
        const data = await res.json();
        const a = data.data;

        if (isMounted && a) {
          const currentUserId = user?.id || session?.user?.id || profile?.id;
          const isSuperAdmin = role === 'admin';
          const authorId = a.author_id || a.authorId;
          if (!isSuperAdmin && authorId && currentUserId && authorId !== currentUserId) {
            setError(isTamil ? 'அனுமதி மறுக்கப்பட்டது: நீங்கள் உங்கள் சொந்த கட்டுரைகளை மட்டுமே திருத்த முடியும்.' : 'Access denied: You can only edit your own articles.');
            setIsReadOnly(true);
          }

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

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) {
        setIsUploadingImage(false);
        return;
      }

      try {
        const token = session?.access_token || '';
        // 1. Try server-side upload endpoint (uses supabaseAdmin service role for guaranteed storage)
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
            folder: 'articles/covers'
          })
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.data?.url) {
            setCoverImageUrl(json.data.url);
            if (onShowToast) onShowToast(isTamil ? 'படம் பதிவேற்றப்பட்டது!' : 'Cover image uploaded!');
            setIsUploadingImage(false);
            return;
          }
        }

        // 2. Direct client supabase fallback
        if (supabase && supabase.storage) {
          const fileExt = file.name.split('.').pop() || 'jpg';
          const fileName = `cover_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
          const filePath = `articles/covers/${fileName}`;
          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file, { cacheControl: '31536000', upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(filePath);

            if (publicUrlData && publicUrlData.publicUrl) {
              setCoverImageUrl(publicUrlData.publicUrl);
              if (onShowToast) onShowToast(isTamil ? 'படம் பதிவேற்றப்பட்டது!' : 'Cover image uploaded!');
              setIsUploadingImage(false);
              return;
            }
          }
        }

        // 3. Fallback: Use Base64 data URL directly
        setCoverImageUrl(dataUrl);
        if (onShowToast) onShowToast(isTamil ? 'படம் இணைக்கப்பட்டது!' : 'Cover image attached!');
      } catch (err) {
        console.warn('Upload fallback to dataUrl:', err);
        setCoverImageUrl(dataUrl);
        if (onShowToast) onShowToast(isTamil ? 'படம் இணைக்கப்பட்டது!' : 'Cover image attached!');
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.onerror = () => {
      setError(isTamil ? 'படத்தை வாசிப்பதில் பிழை ஏற்பட்டது.' : 'Failed to read image file.');
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

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

  const handleSave = async (publishNow = false) => {
    setError('');

    if (isReadOnly) {
      setError(isTamil ? 'அனுமதி மறுக்கப்பட்டது: நீங்கள் உங்கள் சொந்த கட்டுரைகளை மட்டுமே திருத்த முடியும்.' : 'Access denied: You can only edit your own articles.');
      return;
    }

    if (!titleTa || !titleTa.trim()) {
      setError(isTamil ? 'தமிழ் தலைப்பு அவசியம்.' : 'Tamil Title is required.');
      return;
    }

    if (!bodyTa || !bodyTa.trim() || bodyTa === '<p><br></p>') {
      setError(isTamil ? 'தமிழ் உள்ளடக்கம் அவசியம்.' : 'Tamil Article Body is required.');
      return;
    }

    let finalSlug = slug ? slugify(slug) : slugify(titleEn || titleTa);
    if (!finalSlug) finalSlug = `article-${Date.now()}`;

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
      if (!res.ok) throw new Error(data.error || 'Failed to save article');

      try {
        localStorage.removeItem('muthaleetu_articles_cache');
        window.dispatchEvent(new CustomEvent('articles_updated'));
      } catch (_) { }

      if (onShowToast) {
        onShowToast(publishNow ? (isTamil ? 'கட்டுரை உடனடியாக வெளியிடப்பட்டது! ' : 'Article published live! ') : (isTamil ? 'வரைவு சேமிக்கப்பட்டது.' : 'Article draft saved.'));
      }

      if (publishNow && data.data?.slug) {
        onNavigate(`#/articles/${data.data.slug}`);
      } else {
        onNavigate(role === 'admin' ? '#/admin/articles' : '#/profile');
      }

    } catch (err) {
      console.error('Save article error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (role !== 'admin' && role !== 'publisher') return null;

  return (
    <div className="w-full min-h-[calc(100vh-140px)] py-6 sm:py-8 transition-colors duration-300 relative bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* Unified Compact Hero Header Banner (Light & Dark mode) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full  pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <button
              onClick={() => onNavigate('#/admin/articles')}
              className="text-xs font-bold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              ← {isTamil ? 'கட்டுரைகள் பட்டியலுக்குத் திரும்பு' : 'Back to Articles Studio'}
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight leading-snug">
              {articleId && articleId !== 'new' ? (isTamil ? 'கட்டுரையைத் திருத்துக' : 'Edit Article') : (isTamil ? 'புதிய கட்டுரை எழுதுக' : 'Write New Article')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isTamil
                ? 'தமிழ் மற்றும் ஆங்கிலத்தில் தொழில்முறை முதலீட்டுக் கட்டுரைகளை எழுதி வெளியிடுங்கள்.'
                : 'Compose, format, translate, and publish certified financial analyses for investors.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isLoading || isReadOnly}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all shadow-sm disabled:opacity-50"
            >
              {isTamil ? 'வரைவாகச் சேமி (Draft)' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isLoading || isReadOnly}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>✍️</span>
              <span>{isTamil ? 'உடனே வெளியிடு (Publish Live)' : 'Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold flex items-center gap-2">
          <span></span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTamil ? 'தமிழ் தலைப்பு (முதன்மை)' : 'Tamil Title (Primary) *'}
              </label>
              <span className="text-xs font-black uppercase text-amber-800">TAMIL</span>
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
              <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">ENGLISH</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'URL Slug (இணைப்பு முகவரி) *' : 'URL Slug *'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-600 dark:text-slate-400">/</span>
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

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'பிரிவு (Category)' : 'Category'}
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="mutual-fund">Mutual Funds</option>
              <option value="stock-market">Stock Market</option>
              <option value="personal-finance">Personal Finance</option>
              <option value="financial-education">Financial Education</option>
            </select>
          </div>

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

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTamil ? 'முகப்புப் படம் (Cover Image)' : 'Cover Image Upload & URL'}
              </label>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isTamil ? 'Supabase Storage "article-covers" பக்கத்தில் பதிவேற்றப்படும்.' : 'Uploads directly to Supabase Storage "article-covers" bucket.'}
              </p>
            </div>
            {isUploadingImage && <span className="text-xs font-bold text-amber-500 animate-pulse">Uploading image...</span>}
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
                className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-red-600 text-white font-bold text-xs shadow"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950 border border-amber-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-base font-black"></span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                {isTamil ? 'தானியங்கி ஆங்கில மொழிபெயர்ப்பு' : 'AI & Rule-Protected Auto Translation'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {isTamil ? 'தமிழ் தலைப்பு, சுருக்கம், கட்டுரையை ஆங்கிலத்தில் மொழிபெயர்த்து சரிபார்க்க உதவும்.' : 'Translates Tamil title, excerpt & body into English with financial terms protected (NIFTY, SIP, etc.) for admin review.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isTranslating}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all hover:scale-105 disabled:opacity-50 shrink-0"
          >
            {isTranslating ? 'Translating...' : (isTamil ? ' ஆங்கிலத்தில் மொழிபெயர்க்க' : ' Auto-Translate to English')}
          </button>
        </div>

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

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('ta')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'ta' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                தமிழ் உள்ளடக்கம் (Tamil Body) *
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'en' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                English Body (Reviewed)
              </button>
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 hidden sm:inline">Rich Text HTML Engine</span>
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

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('#/admin/articles')}
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
            {isTamil ? 'வரைவாகச் சேமி (Save Draft)' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span></span>
            <span>{isTamil ? 'உடனே வெளியிடு (Publish Live)' : 'Publish Live'}</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

// ==================== 8. ROOT APP ====================



export default ArticleEditorPage;
export { ArticleEditorPage };
