import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { updateHeadTags } from '../utils/formatters.js';

const CATEGORIES = [
  { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance' },
  { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
  { id: 'stocks', labelTa: 'பங்குச் சந்தை & வர்த்தகம்', labelEn: 'Stocks & Markets' },
  { id: 'tax-retirement', labelTa: 'வரி சேமிப்பு & ஓய்வூதியம்', labelEn: 'Tax & Retirement' },
  { id: 'financial-education', labelTa: 'நிதி அறிவு & வழிகாட்டி', labelEn: 'Financial Education' },
  { id: 'quick-takes', labelTa: 'விரைவு பார்வைகள்', labelEn: 'Quick Takes' }
];

export default function AdminArticleRequestsPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session, role } = useAuth();
  const isTamil = language === 'ta';
  const isAdmin = role === 'admin';

  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [search, setSearch] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  // Inspector & Editor Modal State
  const [selectedSub, setSelectedSub] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  const [activeEditorTab, setActiveEditorTab] = useState('edit'); // 'edit' | 'preview'
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState('');
  const [showRejectPrompt, setShowRejectPrompt] = useState(false);

  useEffect(() => {
    updateHeadTags({
      title: isTamil ? 'கட்டுரை கோரிக்கைகள் (Article Requests) | அட்மின் ஸ்டுடியோ' : 'Article Requests | Admin Moderation',
      description: 'Review, edit and publish reader-submitted articles with Community Contribution bylines.',
      pathname: '/admin/article-requests'
    });
  }, [isTamil]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/article-submissions?admin=1&status=${statusFilter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load submissions queue');
      setSubmissions(json.data || []);
      setPendingCount(json.pendingCount || 0);
    } catch (err) {
      console.error('Error fetching admin submissions:', err);
      if (onShowToast) onShowToast(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
    }
  }, [statusFilter, session, isAdmin]);

  const handleOpenInspector = (sub) => {
    setSelectedSub(sub);
    setEditTitle(sub.title || '');
    setEditCategory(sub.category || 'personal-finance');
    setEditDisplayName(sub.display_name || '');
    setEditSummary(sub.summary || '');
    setEditBody(sub.body || '');
    setEditCoverImage(sub.cover_image_url || '');
    setReviewNotes(sub.review_notes || '');
    setActionError('');
    setShowRejectPrompt(false);
    setActiveEditorTab('edit');
  };

  const handleCloseInspector = () => {
    setSelectedSub(null);
    setActionError('');
    setShowRejectPrompt(false);
  };

  // Execute Review Decision (Approve / Reject)
  const handleReviewAction = async (decision) => {
    if (!selectedSub) return;
    setIsProcessing(true);
    setActionError('');

    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/article-submissions?action=review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: selectedSub.id,
          decision,
          review_notes: reviewNotes.trim(),
          editedData: {
            title: editTitle.trim(),
            category: editCategory,
            display_name: editDisplayName.trim(),
            summary: editSummary.trim(),
            body: editBody.trim(),
            cover_image_url: editCoverImage.trim()
          }
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to execute review action');

      if (decision === 'approve') {
        if (onShowToast) onShowToast(isTamil ? 'கட்டுரை வெற்றிகரமாக வெளியிடப்பட்டது! "வாசகர் பங்களிப்பு" என நேரலையில் உள்ளது.' : 'Article published live with Community Contribution tag!');
      } else {
        if (onShowToast) onShowToast(isTamil ? 'கட்டுரை நிராகரிக்கப்பட்டது.' : 'Submission rejected.');
      }

      handleCloseInspector();
      fetchSubmissions();
    } catch (err) {
      setActionError(err.message || 'Action error');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredList = submissions.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (s.title || '').toLowerCase().includes(q) ||
           (s.display_name || '').toLowerCase().includes(q) ||
           (s.category || '').toLowerCase().includes(q) ||
           (s.submitter_email || '').toLowerCase().includes(q);
  });

  return (
    <div className="w-full min-h-[calc(100vh-120px)] pb-20 pt-4 bg-slate-50 dark:bg-slate-950 animate-fadeIn">
      <div className="w-full max-w-[96vw] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6">
        
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {isTamil ? 'அட்மின் மேலாண்மை' : 'Admin Moderation Queue'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
              {isTamil ? 'வாசகர் கட்டுரை கோரிக்கைகள் (Article Requests)' : 'Reader Article Requests'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isTamil
                ? 'வாசகர்கள் எழுதிய கட்டுரைகளை சரிபார்த்து, திருத்தி, வாசகர் பங்களிப்பாக நேரலையில் வெளியிடவும்.'
                : 'Review, edit, and publish reader-submitted articles with Community Contribution bylines.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('#/admin/articles')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all shadow-xs"
            >
              ← {isTamil ? 'கட்டுரைகள் ஸ்டுடியோ' : 'Articles Studio'}
            </button>
            <button
              type="button"
              onClick={fetchSubmissions}
              className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔄</span>
              <span>{isTamil ? 'புதுப்பிக்க' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-x-auto">
            {[
              { id: 'pending', labelTa: 'மதிப்பாய்வில் உள்ளவை', labelEn: 'Pending Review', count: pendingCount },
              { id: 'approved', labelTa: 'வெளியிடப்பட்டவை', labelEn: 'Approved & Live' },
              { id: 'rejected', labelTa: 'நிராகரிக்கப்பட்டவை', labelEn: 'Rejected' },
              { id: 'all', labelTa: 'அனைத்தும்', labelEn: 'All Submissions' }
            ].map(tab => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{isTamil ? tab.labelTa : tab.labelEn}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-2 py-0.2 rounded-full text-[11px] font-black ${active ? 'bg-white text-blue-600' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-80">
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isTamil ? "தலைப்பு அல்லது எழுத்தாளர் தேடுக..." : "Search by title or submitter..."}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-600 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Submissions List / Grid */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              {isTamil ? 'கோரிக்கைகள் ஏற்றப்படுகின்றன...' : 'Loading submission queue...'}
            </p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center text-3xl">
              📬
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isTamil ? 'இந்த பிரிவில் கோரிக்கைகள் எதுவும் இல்லை.' : 'No article requests found in this view.'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {statusFilter === 'pending'
                ? (isTamil ? 'அனைத்து வாசகர் கட்டுரைகளும் மதிப்பாய்வு செய்யப்பட்டுவிட்டன!' : 'All reader submissions have been reviewed!')
                : (isTamil ? 'வேறு வடிகட்டியை தேர்வு செய்யவும்.' : 'Try changing status filter or search query.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredList.map((sub) => {
              const isPending = sub.status === 'pending';
              const isApproved = sub.status === 'approved';
              const isRejected = sub.status === 'rejected';

              const formattedDate = new Date(sub.submitted_at).toLocaleDateString(
                isTamil ? 'ta-IN' : 'en-IN',
                { month: 'short', day: 'numeric', year: 'numeric' }
              );

              return (
                <div
                  key={sub.id}
                  onClick={() => handleOpenInspector(sub)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/80 dark:hover:border-blue-500/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.99]"
                >
                  {/* Top Thumbnail Image if available */}
                  <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {sub.cover_image_url ? (
                      <img src={sub.cover_image_url} alt={sub.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-1">
                        <span className="text-3xl">🖼️</span>
                        <span className="text-[11px] font-bold">No cover image</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {isPending && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-amber-500 text-slate-950 shadow-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                          <span>Pending Review</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-emerald-600 text-white shadow-md">
                          ✓ Live Article
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-red-600 text-white shadow-md">
                          ✕ Rejected
                        </span>
                      )}
                    </div>

                    {/* Category Badge */}
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider">
                      {sub.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {sub.title}
                      </h3>
                      {sub.summary && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {sub.summary}
                        </p>
                      )}
                    </div>

                    {/* Submitter & Date Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="space-y-0.5 truncate pr-2">
                        <div className="font-extrabold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                          <span>👤 {sub.display_name}</span>
                        </div>
                        {sub.submitter_email && (
                          <div className="text-[11px] text-slate-400 font-mono truncate">
                            {sub.submitter_email}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono text-slate-400 block">
                          {formattedDate}
                        </span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 inline-block transition-transform">
                          Inspect →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ================= EDITORIAL REVIEW & PUBLISH INSPECTOR MODAL ================= */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-4xl my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/70 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Editorial Review
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {selectedSub.id?.slice(0, 8)}...
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate max-w-lg">
                  {selectedSub.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit / Preview Tabs */}
                <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab('edit')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeEditorTab === 'edit' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                  >
                    Edit & Sanitize
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeEditorTab === 'preview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                  >
                    Live Preview
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCloseInspector}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {actionError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold">
                  {actionError}
                </div>
              )}

              {/* Submitter Info Card */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Submitter Profile</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">{selectedSub.display_name}</span>
                    {selectedSub.submitter_email && (
                      <span className="text-slate-500 font-mono">({selectedSub.submitter_email})</span>
                    )}
                  </div>
                </div>

                <div className="space-y-0.5 text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Submitted At</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {new Date(selectedSub.submitted_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {activeEditorTab === 'edit' ? (
                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200">
                      Article Title (Admin Editable)
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Category & Display Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200">
                        Category
                      </label>
                      <select
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-600"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.labelEn} ({c.labelTa})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200">
                        Author Byline (Reader Display Name)
                      </label>
                      <input
                        type="text"
                        value={editDisplayName}
                        onChange={e => setEditDisplayName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Cover Image URL */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={editCoverImage}
                      onChange={e => setEditCoverImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-600"
                    />
                    {editCoverImage && (
                      <div className="w-48 h-24 rounded-xl overflow-hidden mt-2 border border-slate-200 dark:border-slate-800">
                        <img src={editCoverImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200">
                      Excerpt / Summary
                    </label>
                    <textarea
                      value={editSummary}
                      onChange={e => setEditSummary(e.target.value)}
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600 resize-none"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200">
                      Article Body (Markdown / HTML)
                    </label>
                    <textarea
                      value={editBody}
                      onChange={e => setEditBody(e.target.value)}
                      rows={14}
                      className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Review Notes / Reason */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200">
                      Editorial Review Notes (Visible to Submitter)
                    </label>
                    <input
                      type="text"
                      value={reviewNotes}
                      onChange={e => setReviewNotes(e.target.value)}
                      placeholder="e.g. Excellent breakdown of index funds! Approved for publication."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              ) : (
                /* Live Preview Mode */
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white">
                      Community Contribution
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      By {editDisplayName}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif">
                    {editTitle}
                  </h1>

                  {editCoverImage && (
                    <div className="aspect-[16/9] w-full max-h-80 rounded-2xl overflow-hidden shadow">
                      <img src={editCoverImage} alt={editTitle} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {editSummary && (
                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs italic text-slate-600 dark:text-slate-300">
                      {editSummary}
                    </div>
                  )}

                  <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm pt-2">
                    <div dangerouslySetInnerHTML={{ __html: editBody.replace(/\n\n/g, '<br/><br/>') }} />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/70 shrink-0">
              <button
                type="button"
                onClick={handleCloseInspector}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* Reject Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    if (!showRejectPrompt) {
                      setShowRejectPrompt(true);
                      if (!reviewNotes) setReviewNotes('Does not meet current editorial guidelines.');
                    } else {
                      handleReviewAction('reject');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 font-bold text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {showRejectPrompt ? 'Confirm Reject ✕' : 'Reject Submission'}
                </button>

                {/* Approve & Publish Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleReviewAction('approve')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4A9E2C] hover:bg-[#3d8224] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Publishing...</span>
                  ) : (
                    <>
                      <span>Publish Live (Community Contribution) →</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
