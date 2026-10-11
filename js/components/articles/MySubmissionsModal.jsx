import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function MySubmissionsModal({ isOpen, onClose, onOpenWrite, onNavigate }) {
  const { language } = useLanguage();
  const { session } = useAuth();
  const isTamil = language === 'ta';

  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMySubmissions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/article-submissions?mine=1', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load submissions');
      setSubmissions(json.data || []);
    } catch (err) {
      setError(err.message || 'Error fetching submissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMySubmissions();
    }
  }, [isOpen, session]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-2xl my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              📄
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-serif">
                {isTamil ? 'என் கட்டுரைகள் (My Submissions)' : 'My Article Submissions'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isTamil
                  ? 'நீங்கள் சமர்ப்பித்த கட்டுரைகளின் மதிப்பாய்வு நிலையை இங்கே கண்காணிக்கலாம்.'
                  : 'Track the editorial review status of articles you submitted.'}
              </p>
            </div>
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

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                {isTamil ? 'கட்டுரைகள் ஏற்றப்படுகின்றன...' : 'Loading your submissions...'}
              </p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center text-2xl">
                ✍️
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'நீங்கள் இன்னும் கட்டுரைகள் எதுவும் சமர்ப்பிக்கவில்லை.' : 'No article submissions yet.'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {isTamil
                    ? 'முதலீட்டு வழிகாட்டுதல்கள் மற்றும் அனுபவங்களை எழுதி சமர்ப்பியுங்கள். ஆசிரியர் குழுவின் மதிப்பாய்வுக்குப் பிறகு வெளியிடப்படும்.'
                    : 'Share your investment insights or financial guide. Once approved by our team, it goes live with your byline!'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenWrite) onOpenWrite();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A9E2C] hover:bg-[#3d8224] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>{isTamil ? '+ புதிய கட்டுரை எழுதுக' : '+ Write an Article'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => {
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
                    className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span>{isTamil ? 'மதிப்பாய்வில் உள்ளது (Pending Review)' : 'Pending Review'}</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{isTamil ? 'வெளியிடப்பட்டது (Approved & Live)' : 'Approved & Live'}</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span>{isTamil ? 'நிராகரிக்கப்பட்டது (Rejected)' : 'Rejected'}</span>
                          </span>
                        )}

                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                          {sub.category}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">
                        {formattedDate}
                      </span>
                    </div>

                    {/* Title & Excerpt */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {sub.title}
                      </h4>
                      {sub.summary && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {sub.summary}
                        </p>
                      )}
                    </div>

                    {/* Editorial Review Notes or Live Article CTA */}
                    {isRejected && sub.review_notes && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 space-y-1">
                        <strong className="font-extrabold block">
                          {isTamil ? 'ஆசிரியர் குறிப்பு (Editorial Feedback):' : 'Editorial Feedback:'}
                        </strong>
                        <p className="text-[11px] leading-relaxed">
                          {sub.review_notes}
                        </p>
                      </div>
                    )}

                    {isApproved && sub.published_slug && (
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {isTamil ? 'நேரலையில் வாசகர் கட்டுரையாக வாசிக்கலாம்' : 'Live as Community Contribution'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            if (onNavigate) onNavigate(`#/articles/${sub.published_slug}`);
                            else window.location.hash = `#/articles/${sub.published_slug}`;
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          <span>{isTamil ? 'கட்டுரையை காண்க →' : 'View Live Article →'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40 shrink-0">
          <button
            type="button"
            onClick={fetchMySubmissions}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <span>🔄</span>
            <span>{isTamil ? 'புதுப்பிக்க' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenWrite) onOpenWrite();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4A9E2C] hover:bg-[#3d8224] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>{isTamil ? '+ புதிய கட்டுரை எழுதுக' : '+ Write Another Article'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
