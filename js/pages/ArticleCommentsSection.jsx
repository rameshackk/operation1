import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

function ArticleCommentsSection({ slug, article, isTamil, onShowToast }) {
  const { session, user, profile, role } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Track liked comments to enforce exactly 1 like per user
  const [likedMap, setLikedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('muthaleetu_liked_comments') || '{}');
    } catch {
      return {};
    }
  });

  const loadComments = useCallback(async () => {
    if (!slug) return;
    try {
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&action=comments`);
      const json = await res.json();
      if (json && json.data) {
        setComments(json.data);
      }
    } catch (err) {
      console.error('Error fetching article comments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const currentUserName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || (isTamil ? 'வாசகர்' : 'Reader');
      const currentUserAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || null;
      const isPublisherOrAdvisor = role === 'admin' || role === 'publisher' || role === 'advisor' || (article && user?.id === article.authorId);

      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&action=add_comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          slug,
          content: newComment.trim(),
          userId: user?.id || 'guest',
          userName: currentUserName,
          userAvatar: currentUserAvatar,
          userRole: isPublisherOrAdvisor ? 'publisher' : 'user',
          isVerified: isPublisherOrAdvisor
        })
      });

      if (!res.ok) throw new Error('Failed to post comment');
      const json = await res.json();
      if (json.data) {
        setComments(prev => [...prev, json.data]);
        setNewComment('');
        if (onShowToast) onShowToast(isTamil ? 'உங்கள் கருத்து பதிவிடப்பட்டது!' : 'Comment posted successfully!');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      if (onShowToast) onShowToast(isTamil ? 'கருத்து பதிவிடுவதில் பிழை ஏற்பட்டது.' : 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      const currentUserName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || (isTamil ? 'வாசகர்' : 'Reader');
      const currentUserAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || null;
      const isPublisherOrAdvisor = role === 'admin' || role === 'publisher' || role === 'advisor' || (article && user?.id === article.authorId);

      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&action=add_comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          slug,
          content: replyText.trim(),
          parentId,
          userId: user?.id || 'guest',
          userName: currentUserName,
          userAvatar: currentUserAvatar,
          userRole: isPublisherOrAdvisor ? 'publisher' : 'user',
          isVerified: isPublisherOrAdvisor
        })
      });

      if (!res.ok) throw new Error('Failed to post reply');
      const json = await res.json();
      if (json.data) {
        setComments(prev => [...prev, json.data]);
        setReplyText('');
        setReplyingTo(null);
        if (onShowToast) onShowToast(isTamil ? 'பதில் பதிவிடப்பட்டது!' : 'Reply posted successfully!');
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      if (onShowToast) onShowToast(isTamil ? 'பதில் பதிவிடுவதில் பிழை ஏற்பட்டது.' : 'Failed to post reply.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Strictly 1-like-per-user with persistent lock & toggle
  const handleLike = async (commentId) => {
    const isAlreadyLiked = Boolean(likedMap[commentId]);
    const nextLikedMap = { ...likedMap };

    if (isAlreadyLiked) {
      delete nextLikedMap[commentId];
    } else {
      nextLikedMap[commentId] = true;
    }
    setLikedMap(nextLikedMap);

    try {
      localStorage.setItem('muthaleetu_liked_comments', JSON.stringify(nextLikedMap));
    } catch { }

    // Optimistic UI update
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const nextCount = isAlreadyLiked
          ? Math.max(0, (c.likesCount || 0) - 1)
          : (c.likesCount || 0) + 1;
        return { ...c, likesCount: nextCount };
      }
      return c;
    }));

    try {
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&action=like_comment&commentId=${commentId}&unlike=${isAlreadyLiked ? '1' : '0'}`, {
        method: 'POST'
      });
      if (res.ok) {
        const json = await res.json();
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, likesCount: json.likes } : c));
      }
    } catch (err) {
      console.error('Error updating like status:', err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm(isTamil ? 'இந்தக் கருத்தை நிச்சயமாக நீக்க விரும்புகிறீர்களா?' : 'Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&action=delete_comment&commentId=${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          userId: user?.id,
          userRole: role
        })
      });
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId));
        if (onShowToast) onShowToast(isTamil ? 'கருத்து நீக்கப்பட்டது.' : 'Comment deleted.');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const topComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const diffSec = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diffSec < 60) return isTamil ? 'சற்று முன்' : 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} ${isTamil ? 'நிமிடம் முன்' : 'm ago'}`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ${isTamil ? 'மணி நேரம் முன்' : 'h ago'}`;
    return `${Math.floor(diffSec / 86400)} ${isTamil ? 'நாள் முன்' : 'd ago'}`;
  };

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black font-serif text-slate-900 dark:text-white">
              {isTamil ? 'கருத்துகள் மற்றும் கலந்துரையாடல்' : 'Comments & Discussion'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isTamil ? 'வாசகர்கள் மற்றும் நிதி ஆலோசகர்களின் கலந்துரையாடல் பகுதி' : 'Community thoughts and verified publisher answers'}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-800 border border-amber-500/30">
          {comments.length} {isTamil ? 'கருத்துகள்' : 'Comments'}
        </span>
      </div>

      {/* Comment Input Box */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <div className="flex gap-3.5 items-start">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 p-0.5 shadow-sm shrink-0 flex items-center justify-center font-black text-white text-sm">
            {(profile?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 relative">
            <textarea
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isTamil ? 'உங்கள் கேள்விகள் அல்லது கருத்துக்களை இங்கே பகிருங்கள்...' : 'Ask a question, share your thoughts, or discuss with certified advisors...'}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white text-sm placeholder-slate-400 transition-all outline-none resize-y min-h-[90px]"
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {isTamil ? 'நிபுணத்துவம் வாய்ந்த ஆலோசகர்கள் பதில் அளிப்பார்கள்' : 'Certified advisors reply directly to questions'}
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <span>{isSubmitting ? (isTamil ? 'பதிவிடுகிறது...' : 'Posting...') : (isTamil ? 'கருத்து பதிவிடுக' : 'Post Comment')}</span>
            <span>→</span>
          </button>
        </div>
      </form>

      {/* Comments Listing */}
      {isLoading ? (
        <div className="py-8 text-center text-sm text-slate-600 dark:text-slate-400 animate-pulse">
          {isTamil ? 'கருத்துகள் ஏற்றப்படுகின்றன...' : 'Loading discussion...'}
        </div>
      ) : topComments.length === 0 ? (
        <div className="py-12 px-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {isTamil ? 'முதல் கருத்தை நீங்கள் பதிவிடுங்கள்!' : 'Be the first to start the discussion!'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isTamil ? 'இந்த கட்டுரை பற்றிய உங்கள் சந்தேகங்கள் அல்லது முதலீட்டு அனுபவங்களை பகிர்ந்து கொள்ளுங்கள்.' : 'Ask questions about mutual funds, risk factors, or wealth planning.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6 pt-2">
          {topComments.map(comment => {
            const replies = getReplies(comment.id);
            const isPublisher = comment.isVerified || comment.userRole === 'publisher' || comment.userRole === 'advisor' || comment.userRole === 'author';
            const isOwner = user?.id && user.id === comment.userId;
            const canDelete = isOwner || role === 'admin';

            return (
              <div key={comment.id} className="space-y-3">
                {/* Single Comment Card */}
                <div className={`p-5 rounded-2xl border transition-all ${isPublisher
                    ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 dark:border-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800'
                  }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {comment.userAvatar ? (
                        <img src={comment.userAvatar} alt="" className="w-9 h-9 rounded-xl object-cover border border-amber-500/30 shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${isPublisher ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                          {(comment.userName || 'R').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {comment.userName}
                          </span>
                          {isPublisher && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 tracking-wide shadow-sm">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors p-1"
                        title={isTamil ? 'நீக்குக' : 'Delete'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-3 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs font-bold">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg ${likedMap[comment.id]
                          ? 'text-red-500 bg-red-500/10 font-black'
                          : 'text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      title={likedMap[comment.id] ? (isTamil ? 'விருப்பத்தை நீக்குக' : 'Unlike') : (isTamil ? 'விருப்பம்' : 'Like')}
                    >
                      <svg className="w-3.5 h-3.5" fill={likedMap[comment.id] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                      <span>{comment.likesCount || 0}</span>
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(replyingTo === comment.id ? null : comment.id);
                        setReplyText('');
                      }}
                      className="text-amber-800 hover:underline flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-amber-500/10"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a5 5 0 015 5v2M3 10l6-6m-6 6l6 6"/></svg>
                      <span>{isTamil ? 'பதிலளி' : 'Reply'}</span>
                    </button>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                      <textarea
                        rows="2"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={isTamil ? `${comment.userName}-க்கு பதிலளிக்க...` : `Reply to ${comment.userName}...`}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-amber-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          {isTamil ? 'ரத்து' : 'Cancel'}
                        </button>
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={isSubmittingReply || !replyText.trim()}
                          className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs disabled:opacity-50"
                        >
                          {isSubmittingReply ? (isTamil ? 'பதிவிடுகிறது...' : 'Sending...') : (isTamil ? 'பதில் அனுப்புக' : 'Send Reply')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="pl-6 sm:pl-10 space-y-3 border-l-2 border-slate-200 dark:border-slate-800 ml-4">
                    {replies.map(reply => {
                      const isReplyPublisher = reply.isVerified || reply.userRole === 'publisher' || reply.userRole === 'advisor' || reply.userRole === 'author';
                      const isReplyOwner = user?.id && user.id === reply.userId;
                      const canDeleteReply = isReplyOwner || role === 'admin';

                      return (
                        <div
                          key={reply.id}
                          className={`p-4 rounded-xl border text-xs sm:text-sm ${isReplyPublisher
                              ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/30'
                              : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              {reply.userAvatar ? (
                                <img src={reply.userAvatar} alt="" className="w-7 h-7 rounded-lg object-cover border border-amber-500/30 shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${isReplyPublisher ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}>
                                  {(reply.userName || 'R').charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {reply.userName}
                                  </span>
                                  {isReplyPublisher && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                      <span>Verified</span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                            </div>

                            {canDeleteReply && (
                              <button
                                onClick={() => handleDelete(reply.id)}
                                className="text-xs text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors p-1"
                                title={isTamil ? 'நீக்குக' : 'Delete'}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-2.5 leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                          </p>

                          <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800 text-xs font-bold">
                            <button
                              onClick={() => handleLike(reply.id)}
                              className={`flex items-center gap-1 transition-colors px-2 py-1 rounded-lg ${likedMap[reply.id]
                                  ? 'text-red-500 bg-red-500/10 font-black'
                                  : 'text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                              title={likedMap[reply.id] ? (isTamil ? 'விருப்பத்தை நீக்குக' : 'Unlike') : (isTamil ? 'விருப்பம்' : 'Like')}
                            >
                              <svg className="w-3.5 h-3.5" fill={likedMap[reply.id] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                              <span>{reply.likesCount || 0}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


export default ArticleCommentsSection;
export { ArticleCommentsSection };
