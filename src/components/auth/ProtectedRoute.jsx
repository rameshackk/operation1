import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { AuthCard } from './AuthCard.jsx';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Verifying session...</span>
        </div>
      </div>
    );
  }

  // Not authenticated -> Render Auth Card login
  if (!user) {
    return (
      <div className="py-8">
        <div className="max-w-md mx-auto mb-4 text-center px-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold border border-amber-500/20">
            Authentication Required
          </span>
        </div>
        <AuthCard initialMode="login" />
      </div>
    );
  }

  // Admin required but user is not admin
  if (requireAdmin && role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-red-500/30 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-2xl font-bold">
          
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white font-serif">Access Denied</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          You need Administrator permissions to access the Admin Dashboard.
        </p>
        <a
          href="#/"
          className="inline-block px-6 py-2.5 rounded-full bg-amber-600 text-white font-extrabold text-xs shadow-md hover:bg-amber-500 transition-colors"
        >
          Return to Homepage
        </a>
      </div>
    );
  }

  return children;
}
