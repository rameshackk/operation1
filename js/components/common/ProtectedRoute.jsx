import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

function ProtectedRoute({ children, onNavigate }) {
  const { session, isAuthLoading } = useAuth();
  if (isAuthLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!session) {
    if (typeof window !== 'undefined') {
      const current = window.location.hash || '#/';
      if (current !== '#/login' && current !== '#/signup' && current !== '#/register' && current !== '#/forgot-password' && current !== '#/reset-password') {
        try {
          sessionStorage.setItem('auth_redirect_from', current);
        } catch (e) { }
      }
      if (window.location.hash !== '#/login') {
        if (onNavigate) {
          onNavigate('#/login');
        } else {
          window.location.hash = '#/login';
        }
      }
    }
    return null;
  }
  return children;
}


export default ProtectedRoute;
export { ProtectedRoute };
