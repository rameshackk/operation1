import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export function AdminVideoTable({ videos = [], onRefresh }) {
  const { session } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editTrending, setEditTrending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [retryingId, setRetryingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const handleOpenEdit = (video) => {
    setSelectedVideo(video);
    setEditCategory(video.category || 'personal-finance');
    setEditTrending(!!video.trending);
  };

  const handleSaveEdit = async () => {
    if (!selectedVideo || !session) return;
    setIsUpdating(true);
    setActionMessage('');

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          youtubeId: selectedVideo.youtubeId,
          category: editCategory,
          trending: editTrending
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update video');

      setActionMessage('Video updated successfully!');
      setSelectedVideo(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRetryTranslation = async (video) => {
    if (!session) return;
    setRetryingId(video.youtubeId);
    setActionMessage('');

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          youtubeId: video.youtubeId,
          retryTranslation: true
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Translation retry failed');

      setActionMessage(`Translation succeeded for "${video.titleTamil.slice(0, 20)}..."`);
      if (onRefresh) onRefresh();
    } catch (err) {
      setActionMessage(`Retry failed: ${err.message}`);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="text-xs font-black"></button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4">Video</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Published</th>
                <th className="py-3.5 px-4">Translation Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200">
              {videos.map((video) => {
                const isTranslated = !!video.translatedAt;
                const isRetrying = retryingId === video.youtubeId;

                return (
                  <tr key={video.youtubeId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 min-w-[280px]">
                        <img src={video.thumbnail} alt="" className="w-16 h-10 object-cover rounded-xl shrink-0 border border-slate-200 dark:border-slate-700" />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-900 dark:text-white line-clamp-1 font-serif">{video.titleTamil}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{video.titleEnglish || 'Translation pending'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        {video.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isTranslated ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <span></span> Translated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <span></span> Pending Retry
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {!isTranslated && (
                          <button
                            onClick={() => handleRetryTranslation(video)}
                            disabled={isRetrying}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-extrabold text-[11px] hover:bg-amber-500 transition-colors disabled:opacity-50"
                          >
                            {isRetrying ? 'Retrying...' : 'Retry Translation'}
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(video)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-[11px] border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-serif">Edit Video Parameters</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{selectedVideo.titleTamil}</p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs font-bold"
                >
                  <option value="mutual-funds">mutual-funds</option>
                  <option value="stocks">stocks</option>
                  <option value="personal-finance">personal-finance</option>
                  <option value="education">education</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-trending"
                  checked={editTrending}
                  onChange={e => setEditTrending(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-600"
                />
                <label htmlFor="edit-trending" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mark as Trending Video
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition-colors"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
