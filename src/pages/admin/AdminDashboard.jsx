import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { AdminVideoTable } from './AdminVideoTable.jsx';

export function AdminDashboard() {
  const { session } = useAuth();
  const [metrics, setMetrics] = useState({
    totalVideos: 0,
    pendingTranslations: 0,
    totalRegisteredUsers: 0,
    signupsThisWeek: 0
  });
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!session) return;
    setIsLoading(true);

    try {
      // Fetch Metrics
      const mRes = await fetch('/api/admin/metrics', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (mRes.ok) {
        const mData = await mRes.json();
        if (mData.data) setMetrics(mData.data);
      }

      // Fetch Videos for Admin Table
      const vRes = await fetch('/api/admin/videos?limit=50', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (vRes.ok) {
        const vData = await vRes.json();
        if (vData.data?.videos) setVideos(vData.data.videos);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [session]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20">
            ADMIN CONSOLE
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif mt-1">
            Platform Management & Telemetry
          </h1>
        </div>

        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 rounded-2xl bg-amber-600 text-white text-xs font-extrabold shadow-md hover:bg-amber-500 transition-colors self-start sm:self-auto"
        >
           Refresh Metrics
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Videos</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.totalVideos}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending Translation</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {metrics.pendingTranslations}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Registered Users</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {metrics.totalRegisteredUsers}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Signups This Week</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {metrics.signupsThisWeek}
          </div>
        </div>
      </div>

      {/* Video Catalog Management Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-white font-serif">
          Ingested YouTube Catalog
        </h3>
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 font-bold">Loading Video Catalog...</div>
        ) : (
          <AdminVideoTable videos={videos} onRefresh={fetchDashboardData} />
        )}
      </div>
    </div>
  );
}
