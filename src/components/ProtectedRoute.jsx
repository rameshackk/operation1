import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children, onNavigate }) {
  const { session, isAuthLoading } = useAuth();

  if (isAuthLoading) return null;

  if (!session) {
    if (typeof window !== 'undefined' && window.location.hash !== '#/login') {
      window.location.hash = '#/login';
    }
    return null;
  }

  return children;
}
