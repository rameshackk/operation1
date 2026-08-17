import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useAuth } from '../../context/AuthContext.js';

export function AdminArticles({ onNavigate, onShowToast, onEditArticle }) {
  const { language } = useLanguage();
  const { session, role } = useAuth();
  const isTamil = language === 'ta';

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/articles?status=${statusFilter}&search=${encodeURIComponent(search)}&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setArticles(data.data || []);
    } catch (err) {
      console.error('Failed to load admin articles:', err);
      if (onShowToast) onShowToast(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchArticles();
    }
  }, [session, role, statusFilter, search]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(isTamil ? `இந்தக் கட்டுரையை நிச்சயமாக நீக்க விரும்புகிறீர்களா?\n"${title}"` : `Are you sure you want to delete this article?\n"${title}"`)) {
      return;
    }

    setDeletingId(id);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete article');

      if (onShowToast) onShowToast(isTamil ? 'கட்டுரை நீக்கப்பட்டது' : 'Article deleted successfully');
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();

      setArticles(prev => prev.map(a => a.id === article.id ? data.data : a));
      if (onShowToast) {
        onShowToast(newStatus === 'published' ? (isTamil ? 'வெளியிடப்பட்டது!' : 'Published live!') : (isTamil ? 'வரைவாக மாற்றப்பட்டது' : 'Reverted to draft'));
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 text-center bg-red-500/10 rounded-3xl border border-red-500/30 text-red-600 font-bold">
        Access denied: Administrator role required.
      </div>
    );
  }

  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              ADMIN ARTICLE STUDIO
            </span>
            <button
              onClick={() => onNavigate ? onNavigate('#/admin') : (window.location.hash = '#/admin')}
              className="text-xs text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 underline font-semibold"
            >
              ← YouTube Ingestion Console
            </button>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif mt-2">
            {isTamil ? 'கட்டுரைகள் மேலாண்மை' : 'Articles & Content Studio'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isTamil
              ? 'அசல் கட்டுரைகளை எழுதுங்கள், திருத்துங்கள், மொழிபெயர்த்து உடனே வெளியிடுங்கள்.'
              : 'Create, rich-text edit, auto-translate, and publish original articles directly to Supabase.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate ? onNavigate('#/admin/articles/new') : (window.location.hash = '#/admin/articles/new')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 shrink-0"
        >
          <span>✍️</span>
          <span>{isTamil ? 'புதிய கட்டுரை எழுதுக' : '+ Write New Article'}</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{isTamil ? 'மொத்த கட்டுரைகள்' : 'Total Articles'}</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{articles.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{isTamil ? 'வெளியிடப்பட்டவை' : 'Published Live'}</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{publishedCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">{isTamil ? 'வரைவுகள் (Drafts)' : 'Saved Drafts'}</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{draftCount}</div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">{isTamil ? 'நிலை:' : 'Status:'}</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${statusFilter === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            All ({articles.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${statusFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            Published
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${statusFilter === 'draft' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            Drafts
          </button>
        </div>

        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isTamil ? "கட்டுரைகளைத் தேடுக..." : "Search articles..."}
            className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">✕</button>
          )}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="text-3xl">📝</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isTamil ? 'கட்டுரைகள் எதுவும் இல்லை' : 'No Articles Found'}
            </h3>
            <button
              onClick={() => onNavigate ? onNavigate('#/admin/articles/new') : (window.location.hash = '#/admin/articles/new')}
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition-colors shadow"
            >
              {isTamil ? 'முதல் கட்டுரையை எழுதுங்கள்' : 'Write Your First Article'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Read Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {articles.map(article => (
                  <tr key={article.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={article.coverImage || '/favicon.svg'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800"
                          onError={(e) => { e.target.src = '/favicon.svg'; }}
                        />
                        <div className="min-w-0 max-w-md">
                          <div className="font-bold text-slate-900 dark:text-white truncate font-serif text-sm">
                            {article.titleTamil}
                          </div>
                          {article.titleEnglish && (
                            <div className="text-[11px] text-slate-400 truncate">
                              EN: {article.titleEnglish}
                            </div>
                          )}
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            /{article.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {article.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                      ⏱ {article.readTimeMinutes} min
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(article)}
                        title="Click to toggle publish/draft status"
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                          article.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                        }`}
                      >
                        {article.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unpublished'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {article.status === 'published' && (
                          <button
                            onClick={() => onNavigate ? onNavigate(`#/articles/${article.slug}`) : (window.location.hash = `#/articles/${article.slug}`)}
                            title="View live article"
                            className="p-2 rounded-xl text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            👁️
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (onEditArticle) {
                              onEditArticle(article);
                            } else if (onNavigate) {
                              onNavigate(`#/admin/articles/edit/${article.id}`);
                            } else {
                              window.location.hash = `#/admin/articles/edit/${article.id}`;
                            }
                          }}
                          title="Edit article"
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition-all"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.id, article.titleTamil)}
                          disabled={deletingId === article.id}
                          title="Delete article"
                          className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
