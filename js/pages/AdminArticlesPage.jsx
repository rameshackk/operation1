import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function AdminArticlesPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session, role, user, profile, setProfile } = useAuth();
  const isTamil = language === 'ta';
  const isAdmin = role === 'admin';

  // Admin Tab: 'articles' | 'publishers'
  // Admin Tab: 'articles' | 'publishers' | 'channels' | 'videos'
  const [activeTab, setActiveTab] = useState('articles');

  // Articles state
  const [articles, setArticles] = useState([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Publishers state
  const [publishers, setPublishers] = useState([]);
  const [isLoadingPublishers, setIsLoadingPublishers] = useState(false);
  const [publisherSearch, setPublisherSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [deletingPublisherId, setDeletingPublisherId] = useState(null);

  // Channel Approvals Queue state
  const [channels, setChannels] = useState([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [channelStatusFilter, setChannelStatusFilter] = useState('pending');
  const [processingChannelId, setProcessingChannelId] = useState(null);

  // Video Moderation Queue state
  const [adminVideos, setAdminVideos] = useState([]);
  const [isLoadingAdminVideos, setIsLoadingAdminVideos] = useState(false);
  const [videoStatusFilter, setVideoStatusFilter] = useState('pending');
  const [processingVideoId, setProcessingVideoId] = useState(null);

  // YouTube Auto-Sync Management state
  const [ytVideos, setYtVideos] = useState([]);
  const [ytLogs, setYtLogs] = useState([]);
  const [isLoadingYt, setIsLoadingYt] = useState(false);
  const [isSyncingYt, setIsSyncingYt] = useState(false);
  const [ytSearch, setYtSearch] = useState('');
  const [ytFilter, setYtFilter] = useState('all'); // all | hidden | pinned | shorts

  // Create Publisher Form State
  const [newPubName, setNewPubName] = useState('');
  const [newPubEmail, setNewPubEmail] = useState('');
  const [newPubPassword, setNewPubPassword] = useState('');
  const [newPubTitle, setNewPubTitle] = useState('AMFI Registered Mutual Fund Distributor');
  const [newPubArn, setNewPubArn] = useState('');
  const [newPubSpecialties, setNewPubSpecialties] = useState('Mutual Funds, SIP Portfolios, Wealth Planning');
  const [newPubLinkedin, setNewPubLinkedin] = useState('');
  const [newPubTwitter, setNewPubTwitter] = useState('');
  const [newPubWebsite, setNewPubWebsite] = useState('');
  const [newPubPhone, setNewPubPhone] = useState('');
  const [isSubmittingPublisher, setIsSubmittingPublisher] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const fetchArticles = async () => {
    setIsLoadingArticles(true);
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
      setIsLoadingArticles(false);
    }
  };

  const fetchPublishers = async () => {
    setIsLoadingPublishers(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/admin/publishers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPublishers(data.data || []);
    } catch (err) {
      console.error('Failed to load publishers:', err);
      if (onShowToast) onShowToast(err.message);
    } finally {
      setIsLoadingPublishers(false);
    }
  };

  const fetchChannels = async () => {
    setIsLoadingChannels(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/channels?status=${channelStatusFilter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setChannels(data.data || []);
    } catch (err) {
      console.error('Failed to load channels:', err);
      if (onShowToast) onShowToast(err.message);
    } finally {
      setIsLoadingChannels(false);
    }
  };

  const fetchAdminVideos = async () => {
    setIsLoadingAdminVideos(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/videos?status=${videoStatusFilter}&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAdminVideos(data.data?.videos || []);
    } catch (err) {
      console.error('Failed to load admin videos:', err);
      if (onShowToast) onShowToast(err.message);
    } finally {
      setIsLoadingAdminVideos(false);
    }
  };

  useEffect(() => {
    if (role === 'admin' || role === 'publisher') {
      fetchArticles();
    }
  }, [session, role, statusFilter, search]);

  useEffect(() => {
    if (role === 'admin' && activeTab === 'publishers') {
      fetchPublishers();
    }
  }, [session, role, activeTab]);

  useEffect(() => {
    if (role === 'admin' && activeTab === 'channels') {
      fetchChannels();
    }
  }, [session, role, activeTab, channelStatusFilter]);

  useEffect(() => {
    if (role === 'admin' && activeTab === 'videos') {
      fetchAdminVideos();
    }
  }, [session, role, activeTab, videoStatusFilter]);

  const fetchYtData = async () => {
    setIsLoadingYt(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/youtube/admin?type=${ytFilter}&search=${encodeURIComponent(ytSearch)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setYtVideos(data.data?.videos || []);
        setYtLogs(data.data?.logs || []);
      }
    } catch (err) {
      console.error('Failed to load YouTube admin data:', err);
      if (onShowToast) onShowToast(err.message);
    } finally {
      setIsLoadingYt(false);
    }
  };

  useEffect(() => {
    if (role === 'admin' && activeTab === 'youtube') {
      fetchYtData();
    }
  }, [session, role, activeTab, ytFilter, ytSearch]);

  const handleToggleYtHide = async (video) => {
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/youtube/admin', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: video.video_id, is_hidden: !video.is_hidden })
      });
      if (res.ok) {
        setYtVideos(prev => prev.map(v => v.video_id === video.video_id ? { ...v, is_hidden: !v.is_hidden } : v));
        if (onShowToast) onShowToast(video.is_hidden ? (isTamil ? 'வீடியோ காட்டப்படுகிறது' : 'Video unhidden') : (isTamil ? 'வீடியோ மறைக்கப்பட்டது' : 'Video hidden'));
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message);
    }
  };

  const handleToggleYtPin = async (video) => {
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/youtube/admin', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: video.video_id, is_pinned: !video.is_pinned })
      });
      if (res.ok) {
        setYtVideos(prev => prev.map(v => v.video_id === video.video_id ? { ...v, is_pinned: !v.is_pinned } : v));
        if (onShowToast) onShowToast(video.is_pinned ? (isTamil ? 'பின் நீக்கப்பட்டது' : 'Video unpinned') : (isTamil ? 'மேலே பின் செய்யப்பட்டது' : 'Video pinned to top'));
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message);
    }
  };

  const handleChangeYtCategory = async (video, newCategory) => {
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/youtube/admin', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: video.video_id, category: newCategory, category_locked: true })
      });
      if (res.ok) {
        setYtVideos(prev => prev.map(v => v.video_id === video.video_id ? { ...v, category: newCategory, category_locked: true } : v));
        if (onShowToast) onShowToast(isTamil ? 'பிரிவு மாற்றப்பட்டது' : 'Category updated & locked');
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message);
    }
  };

  const handleTriggerYtSync = async (full = false) => {
    setIsSyncingYt(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/youtube/admin', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', full })
      });
      const data = await res.json();
      if (res.ok) {
        if (onShowToast) onShowToast(data.message || (isTamil ? 'யூடியூப் ஒத்திசைவு முடிந்தது!' : 'YouTube Sync complete!'));
        fetchYtData();
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (err) {
      if (onShowToast) onShowToast(`Sync Error: ${err.message}`);
    } finally {
      setIsSyncingYt(false);
    }
  };

  const handleVerifyChannelAction = async (publisherId, isApprove) => {
    setProcessingChannelId(publisherId);
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/admin/channels', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publisherId, action: isApprove ? 'approve' : 'reject' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update channel');
      if (onShowToast) onShowToast(json.message);
      fetchChannels();
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    } finally {
      setProcessingChannelId(null);
    }
  };

  const handleUpdateVideoStatusAction = async (youtubeId, newStatus) => {
    setProcessingVideoId(youtubeId);
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/admin/videos', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ youtubeId, status: newStatus })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update video status');
      if (onShowToast) onShowToast(json.message);
      setAdminVideos(prev => prev.map(v => (v.youtubeId === youtubeId || v.id === youtubeId) ? { ...v, status: newStatus } : v));
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    } finally {
      setProcessingVideoId(null);
    }
  };

  const handleDeleteArticle = async (id, title) => {
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

  // Generate strong random password for new publisher
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'Pub@';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPubPassword(pass);
  };

  // Create Publisher Handler
  const handleCreatePublisher = async (e) => {
    e.preventDefault();
    if (!newPubName.trim() || !newPubEmail.trim() || !newPubPassword.trim()) {
      if (onShowToast) onShowToast(isTamil ? 'பெயர், மின்னஞ்சல் மற்றும் கடவுச்சொல் தேவை' : 'Name, email and password are required');
      return;
    }

    setIsSubmittingPublisher(true);
    try {
      const token = session?.access_token || '';
      const specialtiesArr = newPubSpecialties.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/admin/publishers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          display_name: newPubName.trim(),
          email: newPubEmail.trim(),
          password: newPubPassword.trim(),
          title: newPubTitle.trim(),
          arn_number: newPubArn.trim(),
          specialties: specialtiesArr,
          linkedin_url: newPubLinkedin.trim(),
          twitter_url: newPubTwitter.trim(),
          website_url: newPubWebsite.trim(),
          phone: newPubPhone.trim()
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create publisher');

      setCreatedCredentials({
        name: newPubName,
        email: newPubEmail,
        password: newPubPassword
      });

      if (onShowToast) onShowToast(isTamil ? 'வெளியீட்டாளர் வெற்றிகரமாக சேர்க்கப்பட்டார்!' : 'Publisher account created successfully!');
      fetchPublishers();

      // Reset form fields
      setNewPubName('');
      setNewPubEmail('');
      setNewPubPassword('');
      setNewPubArn('');
      setNewPubLinkedin('');
      setNewPubTwitter('');
      setNewPubWebsite('');
      setNewPubPhone('');
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    } finally {
      setIsSubmittingPublisher(false);
    }
  };

  // Delete Publisher Handler
  const handleDeletePublisher = async (pubId, pubName) => {
    if (!window.confirm(isTamil
      ? `"${pubName}" வெளியீட்டாளர் கணக்கை நிச்சயமாக நீக்க விரும்புகிறீர்களா?\nஇந்த செயல் திரும்பப்பெற முடியாது.`
      : `Are you sure you want to permanently delete publisher "${pubName}"?\nThis action cannot be undone.`)) {
      return;
    }

    setDeletingPublisherId(pubId);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/publishers/${pubId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete publisher');

      if (onShowToast) onShowToast(isTamil ? 'வெளியீட்டாளர் நீக்கப்பட்டார்' : 'Publisher deleted successfully');
      setPublishers(prev => prev.filter(p => p.id !== pubId));
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    } finally {
      setDeletingPublisherId(null);
    }
  };

  // Edit Publisher Update Handler
  const handleUpdatePublisher = async (e) => {
    e.preventDefault();
    if (!editingPublisher) return;

    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/publishers/${editingPublisher.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          display_name: editingPublisher.display_name,
          title: editingPublisher.title,
          arn_number: editingPublisher.arn_number,
          specialties: Array.isArray(editingPublisher.specialties) ? editingPublisher.specialties : editingPublisher.specialties?.split(',').map(s => s.trim()).filter(Boolean),
          bio: editingPublisher.bio,
          linkedin_url: editingPublisher.linkedin_url,
          twitter_url: editingPublisher.twitter_url,
          website_url: editingPublisher.website_url,
          phone: editingPublisher.phone
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update publisher');

      if (onShowToast) onShowToast(isTamil ? 'விவரங்கள் புதுப்பிக்கப்பட்டன' : 'Publisher updated successfully');
      setPublishers(prev => prev.map(p => p.id === editingPublisher.id ? json.data : p));
      setEditingPublisher(null);
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    }
  };

  if (role !== 'admin' && role !== 'publisher') return null;

  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;

  const filteredPublishers = publishers.filter(p => {
    if (!publisherSearch.trim()) return true;
    const q = publisherSearch.toLowerCase();
    return (p.display_name && p.display_name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.arn_number && p.arn_number.toLowerCase().includes(q)) ||
      (p.title && p.title.toLowerCase().includes(q));
  });

  return (
    <div className="w-full min-h-[calc(100vh-140px)] py-6 sm:py-8 transition-colors duration-300 relative bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* Unified Compact Hero Header Banner (Light & Dark mode) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full  pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 shadow-sm">
                {isAdmin ? 'ADMIN & PUBLISHER CONSOLE' : 'PUBLISHER STUDIO'}
              </span>
              <button
                onClick={() => onNavigate('#/admin')}
                className="text-xs text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 underline font-semibold"
              >
                ← YouTube Ingestion Console
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight leading-snug">
              {isAdmin
                ? (isTamil ? 'நிர்வாகம் & வெளியீட்டாளர் மேலாண்மை' : 'Admin & Content Management')
                : (isTamil ? 'வெளியீட்டாளர் கட்டுரை அரங்கம்' : 'Publisher Article Studio')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isTamil
                ? 'கட்டுரைகளை எழுதுங்கள், திருத்துங்கள், வெளியீட்டாளர்களை நிர்வகியுங்கள்.'
                : 'Create articles, manage certified financial publishers, and curate investor content.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAdmin && (
              <button
                onClick={() => {
                  setCreatedCredentials(null);
                  generateStrongPassword();
                  setIsCreateModalOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
              >
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{isTamil ? '+ புதிய வெளியீட்டாளர்' : '+ Create Publisher'}</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('#/admin/articles/new')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>{isTamil ? 'புதிய கட்டுரை எழுதுக' : '+ Write New Article'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation (Admin Only) */}
      {isAdmin && (
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${activeTab === 'articles'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span>{isTamil ? 'கட்டுரைகள் ஸ்டுடியோ' : 'Articles Studio'} ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('publishers')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${activeTab === 'publishers'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{isTamil ? 'வெளியீட்டாளர்கள் & நிபுணர்கள்' : 'Publishers & Advisors'} ({publishers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${activeTab === 'channels'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{isTamil ? 'சேனல் ஒப்புதல் வரிசை' : 'Channel Approvals'} ({channels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${activeTab === 'videos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{isTamil ? 'வீடியோக்கள் மதிப்பாய்வு' : 'Video Moderation'} ({adminVideos.filter(v => v.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${activeTab === 'youtube'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube (@budgetpadmanaban_)</span>
          </button>
        </div>
      )}

      {/* ================= TAB 1: ARTICLES STUDIO ================= */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">{isTamil ? 'மொத்த கட்டுரைகள்' : 'Total Articles'}</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{articles.length}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{isTamil ? 'வெளியிடப்பட்டவை' : 'Published Live'}</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{publishedCount}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800">{isTamil ? 'வரைவுகள் (Drafts)' : 'Saved Drafts'}</span>
              <div className="text-2xl font-black text-amber-800 font-mono">{draftCount}</div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{isTamil ? 'நிலை:' : 'Status:'}</span>
              <button onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${statusFilter === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>All ({articles.length})</button>
              <button onClick={() => setStatusFilter('published')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${statusFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>Published</button>
              <button onClick={() => setStatusFilter('draft')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${statusFilter === 'draft' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>Drafts</button>
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
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {isLoadingArticles ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'கட்டுரைகள் எதுவும் இல்லை' : 'No Articles Found'}
                </h3>
                <button
                  onClick={() => onNavigate('#/admin/articles/new')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-500 transition-colors shadow"
                >
                  {isTamil ? 'முதல் கட்டுரையை எழுதுங்கள்' : 'Write Your First Article'}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800">
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
                    {articles.map(article => {
                      const articleAuthorId = article.authorId || article.author_id;
                      const currentUserId = user?.id || session?.user?.id || profile?.id;
                      const isOwner = !articleAuthorId || (currentUserId && articleAuthorId === currentUserId);
                      const canManage = isAdmin || isOwner;

                      return (
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
                                  <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                    EN: {article.titleEnglish}
                                  </div>
                                )}
                                <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-0.5">
                                  /{article.slug}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {article.category}
                            </span>
                          </td>

                          <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{article.readTimeMinutes} min</span>
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {canManage ? (
                              <button
                                onClick={() => handleTogglePublish(article)}
                                title="Click to toggle publish/draft status"
                                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all ${article.status === 'published'
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                    : 'bg-amber-500/15 text-amber-800 border border-amber-500/30 hover:bg-amber-500/25'
                                  }`}
                              >
                                {article.status === 'published' ? 'Published' : 'Draft'}
                              </button>
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block ${article.status === 'published'
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                                  }`}
                              >
                                {article.status === 'published' ? 'Published' : 'Draft'}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unpublished'}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {article.status === 'published' && (
                                <button
                                  onClick={() => onNavigate(`#/articles/${article.slug}`)}
                                  title="View live article"
                                  className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                              )}
                              {canManage && (
                                <button
                                  onClick={() => onNavigate(`#/admin/articles/edit/${article.id}`)}
                                  title="Edit article"
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition-all flex items-center gap-1"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                  <span>Edit</span>
                                </button>
                              )}
                              {canManage && (
                                <button
                                  onClick={() => handleDeleteArticle(article.id, article.titleTamil)}
                                  disabled={deletingId === article.id}
                                  title="Delete article"
                                  className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PUBLISHERS & ADVISORS MANAGEMENT ================= */}
      {isAdmin && activeTab === 'publishers' && (
        <div className="space-y-6">
          {/* Publishers Overview Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">{isTamil ? 'மொத்த வெளியீட்டாளர்கள்' : 'Total Publishers'}</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{publishers.length}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{isTamil ? 'முழுமை அடைந்த விவரங்கள்' : 'Profile Complete'}</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {publishers.filter(p => p.is_onboarded).length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800">{isTamil ? 'முதல் உள்நுழைவு நிலுவை' : 'Pending First Login'}</span>
              <div className="text-2xl font-black text-amber-800 font-mono">
                {publishers.filter(p => !p.is_onboarded).length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">{isTamil ? 'மொத்த கட்டுரைகள்' : 'Publisher Articles'}</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {publishers.reduce((acc, p) => acc + parseInt(p.article_count || 0, 10), 0)}
              </div>
            </div>
          </div>

          {/* Search and Action Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={publisherSearch}
                onChange={e => setPublisherSearch(e.target.value)}
                placeholder={isTamil ? "வெளியீட்டாளர் பெயர், மின்னஞ்சல் அல்லது ARN தேடுக..." : "Search publishers by name, email or ARN..."}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              {publisherSearch && (
                <button onClick={() => setPublisherSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setCreatedCredentials(null);
                generateStrongPassword();
                setIsCreateModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>{isTamil ? 'புதிய வெளியீட்டாளர் சேர்க்க' : 'Add New Publisher'}</span>
            </button>
          </div>

          {/* Publishers Cards / Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {isLoadingPublishers ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading publishers list...</p>
              </div>
            ) : filteredPublishers.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'வெளியீட்டாளர்கள் எதுவும் இல்லை' : 'No Publishers Found'}
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-500 transition-colors shadow"
                >
                  {isTamil ? 'முதல் வெளியீட்டாளரைச் சேருங்கள்' : 'Add First Publisher'}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Publisher / Advisor</th>
                      <th className="px-6 py-4">ARN / License</th>
                      <th className="px-6 py-4">Role & Status</th>
                      <th className="px-6 py-4">Onboarding</th>
                      <th className="px-6 py-4">Articles</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredPublishers.map(pub => (
                      <tr key={pub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Avatar & Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black flex items-center justify-center text-sm uppercase overflow-hidden shrink-0 border border-amber-500/30">
                              {pub.avatar_url ? (
                                <img src={pub.avatar_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                <span>{(pub.display_name || pub.email || 'P').charAt(0)}</span>
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <div className="font-bold text-slate-900 dark:text-white truncate text-sm">
                                {pub.display_name || 'Publisher'}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 truncate font-mono">
                                {pub.email}
                              </div>
                              <div className="text-xs text-amber-800 truncate font-medium">
                                {pub.title || 'Mutual Fund Specialist'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ARN / Registration */}
                        <td className="px-6 py-4">
                          {pub.arn_number ? (
                            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/10 text-amber-800 border border-amber-500/20">
                              {pub.arn_number}
                            </span>
                          ) : (
                            <span className="text-slate-600 dark:text-slate-400 text-xs italic">Not Provided</span>
                          )}
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${pub.role === 'admin'
                              ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            }`}>
                            {pub.role || 'publisher'}
                          </span>
                        </td>

                        {/* Onboarding State */}
                        <td className="px-6 py-4">
                          {pub.is_onboarded ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-500/20">
                              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Pending 1st Login</span>
                            </span>
                          )}
                        </td>

                        {/* Article Count */}
                        <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300 font-bold">
                          {pub.article_count || 0}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit Publisher */}
                            <button
                              onClick={() => setEditingPublisher(pub)}
                              title="Edit publisher details"
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition-all flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              <span>Edit</span>
                            </button>

                            {/* Delete Publisher */}
                            {pub.id !== user?.id && (
                              <button
                                onClick={() => handleDeletePublisher(pub.id, pub.display_name || pub.email)}
                                disabled={deletingPublisherId === pub.id}
                                title="Delete publisher account"
                                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                              </button>
                            )}
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
      )}

      {/* ================= CREATE PUBLISHER MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80  animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-800 text-xs font-black uppercase tracking-wider">
                  AUTHOR ACCESS PROVISIONING
                </span>
                <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mt-1">
                  {isTamil ? 'புதிய வெளியீட்டாளரைச் சேர்க்கவும்' : 'Create Publisher Account'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {createdCredentials ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-900 dark:text-white space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Publisher account created successfully!</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Share these login credentials with the publisher. When they log in for the first time, they will be prompted to complete their profile (photo, bio, social links, ARN).
                  </p>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-1.5">
                    <div><span className="text-slate-600 dark:text-slate-400">Email:</span> <strong className="text-amber-800">{createdCredentials.email}</strong></div>
                    <div><span className="text-slate-600 dark:text-slate-400">Password:</span> <strong className="text-amber-800">{createdCredentials.password}</strong></div>
                    <div><span className="text-slate-600 dark:text-slate-400">Login URL:</span> <strong className="text-slate-600 dark:text-slate-300">{window.location.origin}/#/login</strong></div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Muthaleetu Thisai Publisher Credentials:\nLogin: ${window.location.origin}/#/login\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`);
                      if (onShowToast) onShowToast('Credentials copied to clipboard!');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Copy Credentials</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreatePublisher} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newPubName}
                        onChange={e => setNewPubName(e.target.value)}
                        placeholder="e.g. S. Ramanathan, CFP"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={newPubEmail}
                        onChange={e => setNewPubEmail(e.target.value)}
                        placeholder="publisher@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Password + Generator */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Initial Password *</label>
                      <button
                        type="button"
                        onClick={generateStrongPassword}
                        className="text-xs text-amber-800 hover:underline font-bold"
                      >
                        Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={newPubPassword}
                      onChange={e => setNewPubPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-amber-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Title & ARN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Professional Designation</label>
                      <input
                        type="text"
                        value={newPubTitle}
                        onChange={e => setNewPubTitle(e.target.value)}
                        placeholder="e.g. Certified Financial Planner"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">AMFI ARN / SEBI Reg</label>
                      <input
                        type="text"
                        value={newPubArn}
                        onChange={e => setNewPubArn(e.target.value)}
                        placeholder="e.g. ARN-123456"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Specialties (Comma Separated)</label>
                    <input
                      type="text"
                      value={newPubSpecialties}
                      onChange={e => setNewPubSpecialties(e.target.value)}
                      placeholder="Mutual Funds, Equity SIPs, Retirement, Tax Planning"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={newPubLinkedin}
                        onChange={e => setNewPubLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Website URL</label>
                      <input
                        type="url"
                        value={newPubWebsite}
                        onChange={e => setNewPubWebsite(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingPublisher}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      {isSubmittingPublisher ? 'Creating...' : 'Create Publisher'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CHANNEL APPROVALS QUEUE ================= */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {isTamil ? 'மொத்த சமர்ப்பிக்கப்பட்ட சேனல்கள்' : 'Total Submitted Channels'}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{channels.length}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                {isTamil ? 'சரிபார்ப்பு நிலுவையில்' : 'Pending Verification'}
              </span>
              <div className="text-2xl font-black text-amber-800 font-mono">
                {channels.filter(c => !c.youtube_channel_verified).length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {isTamil ? 'சரிபார்க்கப்பட்டு இணைக்கப்பட்டது' : 'Verified & Auto-Syncing'}
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {channels.filter(c => c.youtube_channel_verified).length}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{isTamil ? 'நிலை:' : 'Status:'}</span>
              <button
                onClick={() => setChannelStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${channelStatusFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                Pending Review
              </button>
              <button
                onClick={() => setChannelStatusFilter('verified')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${channelStatusFilter === 'verified'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                Verified Channels
              </button>
              <button
                onClick={() => setChannelStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${channelStatusFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                All Linked Channels
              </button>
            </div>

            <button
              onClick={fetchChannels}
              className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors self-end sm:self-auto flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Channels Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {isLoadingChannels ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading channel approval queue...</p>
              </div>
            ) : channels.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'சேனல் ஒப்புதல் வரிசை காலியாக உள்ளது' : 'No Channels in Approval Queue'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isTamil ? 'புதிய வெளியீட்டாளர்கள் தங்கள் YouTube சேனலை இணைக்கும்போது இங்கே தோன்றும்.' : 'When publishers link their YouTube channel URL during onboarding, they will appear here for verification.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Publisher</th>
                      <th className="px-6 py-4">Linked YouTube Channel</th>
                      <th className="px-6 py-4">Channel ID</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {channels.map(ch => (
                      <tr key={ch.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={ch.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(ch.display_name || 'Publisher')}&background=f59e0b&color=0f172a`}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {ch.display_name || 'Anonymous Publisher'}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                                {ch.email}
                              </div>
                              {ch.arn_number && (
                                <div className="text-xs font-mono text-amber-500 font-bold mt-0.5">
                                  ARN: {ch.arn_number}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {ch.youtube_channel_thumbnail ? (
                              <img
                                src={ch.youtube_channel_thumbnail}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover bg-slate-950 border border-red-500 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-base shrink-0">
                                ▶
                              </div>
                            )}
                            <div className="min-w-0 max-w-xs">
                              <div className="font-bold text-slate-900 dark:text-white truncate">
                                {ch.youtube_channel_title || 'YouTube Channel'}
                              </div>
                              <a
                                href={ch.youtube_channel_id ? `https://www.youtube.com/channel/${ch.youtube_channel_id}` : (ch.youtube_url || '#')}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-500 hover:underline flex items-center gap-1 truncate"
                              >
                                <span>{ch.youtube_url || `youtube.com/channel/${ch.youtube_channel_id}`}</span>
                                <span>↗</span>
                              </a>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                          {ch.youtube_channel_id || 'Not resolved'}
                        </td>

                        <td className="px-6 py-4">
                          {ch.youtube_channel_verified ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max">
                              <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Verified & Ingesting</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-800 border border-amber-500/20 flex items-center gap-1 w-max">
                              <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Pending Review</span>
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!ch.youtube_channel_verified ? (
                              <>
                                <button
                                  onClick={() => handleVerifyChannelAction(ch.id, true)}
                                  disabled={processingChannelId === ch.id}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 flex items-center gap-1"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleVerifyChannelAction(ch.id, false)}
                                  disabled={processingChannelId === ch.id}
                                  className="px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs border border-red-500/20 transition-all disabled:opacity-50 flex items-center gap-1"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <span>Reject</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleVerifyChannelAction(ch.id, false)}
                                disabled={processingChannelId === ch.id}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-500 text-xs font-bold transition-all disabled:opacity-50"
                              >
                                Revoke Sync
                              </button>
                            )}
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
      )}

      {/* ================= TAB 4: VIDEO MODERATION QUEUE ================= */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                {isTamil ? 'மதிப்பாய்வு நிலுவையில் (Pending)' : 'Pending Publisher Videos'}
              </span>
              <div className="text-2xl font-black text-amber-800 font-mono">
                {adminVideos.filter(v => v.status === 'pending').length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {isTamil ? 'நேரலையில் வெளியிடப்பட்டவை' : 'Published Live'}
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {adminVideos.filter(v => v.status === 'published').length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                {isTamil ? 'நிராகரிக்கப்பட்டவை' : 'Rejected Videos'}
              </span>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 font-mono">
                {adminVideos.filter(v => v.status === 'rejected').length}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{isTamil ? 'நிலை:' : 'Status:'}</span>
              <button
                onClick={() => setVideoStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${videoStatusFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                Pending Review
              </button>
              <button
                onClick={() => setVideoStatusFilter('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${videoStatusFilter === 'published'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                Published Live
              </button>
              <button
                onClick={() => setVideoStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${videoStatusFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                Rejected
              </button>
              <button
                onClick={() => setVideoStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${videoStatusFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                All Videos
              </button>
            </div>

            <button
              onClick={fetchAdminVideos}
              className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors self-end sm:self-auto flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Videos</span>
            </button>
          </div>

          {/* Videos Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {isLoadingAdminVideos ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading video moderation queue...</p>
              </div>
            ) : adminVideos.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'வீடியோக்கள் எதுவும் இல்லை' : 'No Videos Found in this Queue'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isTamil ? 'சரிபார்க்கப்பட்ட வெளியீட்டாளர்களின் புதிய வீடியோக்கள் தானாகவே இங்கே பட்டியலிடப்படும்.' : 'Videos ingested from verified publisher YouTube channels will appear here for admin review.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Video</th>
                      <th className="px-6 py-4">Source Publisher</th>
                      <th className="px-6 py-4">Duration & Views</th>
                      <th className="px-6 py-4">Translation</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {adminVideos.map(v => (
                      <tr key={v.id || v.youtubeId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800 group">
                              <img
                                src={v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <a
                                href={v.youtubeUrl || `https://www.youtube.com/watch?v=${v.youtubeId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                              >
                                ▶
                              </a>
                            </div>
                            <div className="min-w-0 max-w-md">
                              <div className="font-bold text-slate-900 dark:text-white truncate font-serif text-sm">
                                {v.titleTamil || v.title}
                              </div>
                              {v.titleEnglish && (
                                <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                  EN: {v.titleEnglish}
                                </div>
                              )}
                              <a
                                href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-mono text-blue-500 hover:underline inline-block mt-0.5"
                              >
                                {v.youtubeId} ↗
                              </a>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {v.sourcePublisherName ? (
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {v.sourcePublisherName}
                              </div>
                              {v.sourcePublisherArn && (
                                <div className="text-xs font-mono text-amber-500 font-bold">
                                  ARN: {v.sourcePublisherArn}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                              Budget Padmanaban (Main)
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{v.duration || '00:00'}</span>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{(v.views || 0).toLocaleString()} views</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {v.translatedAt ? (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 w-max">
                              <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Gemini Translated</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Untranslated
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {v.status === 'published' ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max">
                              <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Published</span>
                            </span>
                          ) : v.status === 'rejected' ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1 w-max">
                              <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Rejected</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-800 border border-amber-500/20 flex items-center gap-1 w-max">
                              <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Pending Review</span>
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {v.status !== 'published' && (
                              <button
                                onClick={() => handleUpdateVideoStatusAction(v.youtubeId, 'published')}
                                disabled={processingVideoId === v.youtubeId}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Publish</span>
                              </button>
                            )}
                            {v.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateVideoStatusAction(v.youtubeId, 'rejected')}
                                disabled={processingVideoId === v.youtubeId}
                                className="px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs border border-red-500/20 transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Reject</span>
                              </button>
                            )}
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
      )}

      {/* ================= TAB 5: YOUTUBE AUTO-SYNC STUDIO ================= */}
      {activeTab === 'youtube' && (
        <div className="space-y-6">
          {/* Header & Sync Actions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white font-serif">
                  Auto-Synced YouTube Studio
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-mono font-bold">
                  @budgetpadmanaban_
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage channel videos, lock AI-assigned categories, hide/pin videos, and monitor automatic WebSub & pg_cron sync logs.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => handleTriggerYtSync(false)}
                disabled={isSyncingYt}
                className="btn-magnetic px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSyncingYt ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Sync Now</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleTriggerYtSync(true)}
                disabled={isSyncingYt}
                className="btn-magnetic px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 disabled:opacity-50 cursor-pointer"
                title="Full refresh of all historical videos and view counts"
              >
                Full Refresh
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setYtFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${ytFilter === 'all' ? 'bg-blue-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                All Videos ({ytVideos.length})
              </button>
              <button
                onClick={() => setYtFilter('pinned')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${ytFilter === 'pinned' ? 'bg-blue-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                Pinned
              </button>
              <button
                onClick={() => setYtFilter('hidden')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${ytFilter === 'hidden' ? 'bg-blue-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                Hidden
              </button>
              <button
                onClick={() => setYtFilter('shorts')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${ytFilter === 'shorts' ? 'bg-blue-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                Shorts Only
              </button>
            </div>

            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={ytSearch}
                onChange={e => setYtSearch(e.target.value)}
                placeholder="Search videos by title..."
                className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              {ytSearch && (
                <button onClick={() => setYtSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 dark:text-slate-400">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* YouTube Videos Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {isLoadingYt ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading YouTube videos...</p>
              </div>
            ) : ytVideos.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <p className="text-sm font-bold text-slate-500">No YouTube videos found.</p>
                <button
                  onClick={() => handleTriggerYtSync(false)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Run Sync Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                    <tr>
                      <th className="px-5 py-3.5">Video</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Views / Duration</th>
                      <th className="px-5 py-3.5">Published</th>
                      <th className="px-5 py-3.5 text-center">Pin</th>
                      <th className="px-5 py-3.5 text-center">Visibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {ytVideos.map(video => (
                      <tr key={video.video_id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${video.is_hidden ? 'opacity-60 bg-slate-50/30 dark:bg-slate-900/40' : ''}`}>
                        <td className="px-5 py-3 max-w-md">
                          <div className="flex items-center gap-3">
                            <img
                              src={video.thumbnail_url}
                              alt=""
                              className="w-16 aspect-video rounded-lg object-cover shrink-0 bg-slate-950"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                {video.title}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {video.is_short && (
                                  <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-black uppercase">
                                    Short
                                  </span>
                                )}
                                {video.is_pinned && (
                                  <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase">
                                    PINNED
                                  </span>
                                )}
                                <a
                                  href={`https://www.youtube.com/watch?v=${video.video_id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] font-mono text-blue-500 hover:underline inline-flex items-center gap-0.5"
                                >
                                  {video.video_id} ↗
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3">
                          <select
                            value={video.category || 'Others'}
                            onChange={(e) => handleChangeYtCategory(video, e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                          >
                            <option value="Mutual Funds">Mutual Funds</option>
                            <option value="SIP & Planning">SIP & Planning</option>
                            <option value="Stock Market">Stock Market</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Retirement">Retirement</option>
                            <option value="Children & Education">Children & Education</option>
                            <option value="Gold & Bonds">Gold & Bonds</option>
                            <option value="Tax">Tax</option>
                            <option value="Others">Others</option>
                          </select>
                          {video.category_locked && (
                            <div className="text-[10px] text-amber-800 dark:text-amber-400 font-bold mt-0.5">
                              Manual Lock
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-3 font-mono">
                          <div className="text-slate-900 dark:text-white font-bold">
                            {(video.view_count || 0).toLocaleString()} views
                          </div>
                          <div className="text-xs text-slate-500">
                            {video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)}m ${video.duration_seconds % 60}s` : '—'}
                          </div>
                        </td>

                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {video.published_at ? new Date(video.published_at).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                        </td>

                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => handleToggleYtPin(video)}
                            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${video.is_pinned ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                            title={video.is_pinned ? 'Unpin video' : 'Pin video to top'}
                          >
                            {video.is_pinned ? 'Pinned' : 'Pin'}
                          </button>
                        </td>

                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => handleToggleYtHide(video)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${video.is_hidden ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'}`}
                          >
                            {video.is_hidden ? 'Hidden' : 'Visible'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sync History Logs Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white font-serif">
              Recent Sync Activity (Last 20 Runs)
            </h3>
            {ytLogs.length === 0 ? (
              <p className="text-xs text-slate-500">No sync logs recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="pb-2">Time (UTC)</th>
                      <th className="pb-2">Trigger Source</th>
                      <th className="pb-2">New Videos</th>
                      <th className="pb-2">Updated</th>
                      <th className="pb-2">Status / Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {ytLogs.map(log => (
                      <tr key={log.id}>
                        <td className="py-2.5 text-slate-700 dark:text-slate-300">
                          {new Date(log.ran_at).toLocaleString()}
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                            {log.source}
                          </span>
                        </td>
                        <td className="py-2.5 font-bold text-emerald-600 dark:text-emerald-400">
                          +{log.new_count || 0}
                        </td>
                        <td className="py-2.5 text-blue-600 dark:text-blue-400">
                          {log.updated_count || 0}
                        </td>
                        <td className="py-2.5">
                          {log.error ? (
                            <span className="text-red-500 font-sans font-bold">{log.error}</span>
                          ) : (
                            <span className="text-emerald-500 font-bold font-sans">Success</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EDIT PUBLISHER MODAL ================= */}
      {editingPublisher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80  animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-800 text-xs font-black uppercase tracking-wider">
                  UPDATE DETAILS
                </span>
                <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mt-1">
                  Edit Publisher: {editingPublisher.display_name}
                </h3>
              </div>
              <button
                onClick={() => setEditingPublisher(null)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdatePublisher} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Name</label>
                  <input
                    type="text"
                    value={editingPublisher.display_name || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, display_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Designation / Title</label>
                  <input
                    type="text"
                    value={editingPublisher.title || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">AMFI ARN / License</label>
                  <input
                    type="text"
                    value={editingPublisher.arn_number || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, arn_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={editingPublisher.phone || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={editingPublisher.linkedin_url || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Website URL</label>
                  <input
                    type="url"
                    value={editingPublisher.website_url || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, website_url: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bio & Summary</label>
                <textarea
                  rows={3}
                  value={editingPublisher.bio || ''}
                  onChange={e => setEditingPublisher({ ...editingPublisher, bio: e.target.value })}
                  placeholder="Short professional summary"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPublisher(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

/**
 * FIRST-TIME PUBLISHER ONBOARDING MODAL WIZARD
 * Prompts newly registered publishers for profile photo, title, ARN, bio, and social links.
 */

export default AdminArticlesPage;
export { AdminArticlesPage };
