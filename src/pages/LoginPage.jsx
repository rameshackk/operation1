import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { AuthCard } from '../components/auth/AuthCard.jsx';

export function LoginPage({ initialMode = 'login', locationState }) {
  const [mode, setMode] = useState(initialMode);
  const { user, role } = useAuth();

  useEffect(() => {
    if (user) {
      handlePostAuthRedirect();
    }
  }, [user, role]);

  const handlePostAuthRedirect = () => {
    // Check if user was redirected from a protected route
    const fromPath = locationState?.from?.pathname || locationState?.from || null;

    if (role === 'admin') {
      window.location.hash = '#/admin';
    } else if (fromPath) {
      window.location.hash = `#${fromPath}`;
    } else {
      window.location.hash = '#/';
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center py-6 px-4 animate-fadeIn">
      <AuthCard
        mode={mode}
        onModeChange={setMode}
        onAuthSuccess={handlePostAuthRedirect}
      />
    </main>
  );
}

export default LoginPage;
