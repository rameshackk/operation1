import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export function AdminRoute({ children }) {
  const { session, role, isAuthLoading } = useAuth();

  if (isAuthLoading) return null;

  // Unauthenticated -> redirect to /login
  if (!session) {
    if (typeof window !== 'undefined' && window.location.hash !== '#/login') {
      window.location.hash = '#/login';
    }
    return null;
  }

  // Authenticated non-admin -> redirect to homepage #/
  if (role !== 'admin') {
    if (typeof window !== 'undefined' && window.location.hash !== '#/') {
      window.location.hash = '#/';
    }
    return null;
  }

  return children;
}
