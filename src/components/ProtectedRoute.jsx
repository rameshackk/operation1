import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children, onNavigate }) {
  const { session, isAuthLoading } = useAuth();

  if (isAuthLoading) return null;

  if (!session) {
    if (typeof window !== 'undefined') {
      const current = window.location.hash || '#/';
      if (current !== '#/login' && current !== '#/signup' && current !== '#/register') {
        try {
          sessionStorage.setItem('auth_redirect_from', current);
        } catch (e) {}
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
