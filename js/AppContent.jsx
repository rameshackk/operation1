import React, { Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import Header from './components/common/Header.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import Toast from './components/common/Toast.jsx';
import TrendingTicker from './components/home/TrendingTicker.jsx';
import Home from './components/home/Home.jsx';
import RouteLoadingSpinner from './components/common/RouteLoadingSpinner.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';

// Code-split pages and modals
const VideosPage = lazy(() => import('./pages/VideosPage.jsx'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage.jsx'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage.jsx'));
const NewsPage = lazy(() => import('./pages/NewsPage.jsx'));
const NewsDetailsPage = lazy(() => import('./pages/NewsDetailsPage.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const SipCalculator = lazy(() => import('./pages/SipCalculator.jsx'));
const ProfessionalsDirectoryPage = lazy(() => import('./pages/ProfessionalsDirectoryPage.jsx'));
const ProfessionalProfilePage = lazy(() => import('./pages/ProfessionalProfilePage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const WatchHistoryPage = lazy(() => import('./pages/WatchHistoryPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const AdminArticlesPage = lazy(() => import('./pages/AdminArticlesPage.jsx'));
const ArticleEditorPage = lazy(() => import('./pages/ArticleEditorPage.jsx'));
const PublisherOnboardingModal = lazy(() => import('./pages/PublisherOnboardingModal.jsx'));
const CommandPalette = lazy(() => import('./pages/CommandPalette.jsx'));
const LoginReminderModal = lazy(() => import('./pages/LoginReminderModal.jsx'));

export default function AppContent({ currentPath, navigate, isSearchOpen, setIsSearchOpen, toastMessage, setToastMessage }) {
  const { user, role, profile, setProfile } = useAuth();
  const [fabOpen, setFabOpen] = React.useState(false);
  const cleanPath = (currentPath || '/').toLowerCase().replace(/\/+$/, '') || '/';
  const isHome = cleanPath === '/' || cleanPath === '/home' || cleanPath === '#/' || cleanPath === '#';

  const renderRoute = () => {
    const p = cleanPath;

    // 1. PUBLIC LANDING PAGE (Immediate sync render)
    if (isHome) {
      return <Home onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    // 2. PUBLIC AUTHENTICATION ROUTES
    if (p === '/login' || p === '#/login') return <AuthPage initialMode="login" onNavigate={navigate} />;
    if (p === '/signup' || p === '/register' || p === '#/signup' || p === '#/register') return <AuthPage initialMode="signup" onNavigate={navigate} />;
    if (p === '/forgot-password' || p === '#/forgot-password') return <AuthPage initialMode="forgot" onNavigate={navigate} />;
    if (p === '/reset-password' || p === '#/reset-password') return <AuthPage initialMode="magic-link" onNavigate={navigate} />;

    // 3. PROTECTED USER & ADMIN ROUTES
    // 3.1 Profile & Watch History
    if (p === '/profile' || p === '#/profile') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <ProfilePage onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    if (p === '/history' || p === '/watch-history' || p === '#/history' || p === '#/watch-history') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <WatchHistoryPage onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    // 3.2 Admin & Publisher Studio Routes
    if (p.startsWith('/admin/articles/edit/') || p.startsWith('#/admin/articles/edit/')) {
      const articleId = p.replace('/admin/articles/edit/', '').replace('#/admin/articles/edit/', '');
      return (
        <AdminRoute onNavigate={navigate}>
          <ArticleEditorPage articleId={articleId} onNavigate={navigate} onShowToast={setToastMessage} />
        </AdminRoute>
      );
    }

    if (p === '/admin/articles/new' || p === '#/admin/articles/new') {
      return (
        <AdminRoute onNavigate={navigate}>
          <ArticleEditorPage articleId="new" onNavigate={navigate} onShowToast={setToastMessage} />
        </AdminRoute>
      );
    }

    if (p === '/admin/articles' || p === '/admin' || p === '#/admin/articles' || p === '#/admin') {
      return (
        <AdminRoute onNavigate={navigate}>
          <AdminArticlesPage onNavigate={navigate} onShowToast={setToastMessage} />
        </AdminRoute>
      );
    }

    // 3.3 Articles Routes (Public for user)
    if (p.startsWith('/articles/') || p.startsWith('#/articles/')) {
      const slug = p.replace('/articles/', '').replace('#/articles/', '');
      return <ArticleDetailPage slug={slug} onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    if (p === '/articles' || p === '#/articles') {
      return <ArticlesPage onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    // 3.4 Videos Routes (Public for user)
    if (p.startsWith('/videos/') || p.startsWith('#/videos/')) {
      const videoId = p.replace('/videos/', '').replace('#/videos/', '');
      return <VideosPage initialVideoId={videoId} onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    if (p === '/videos' || p === '#/videos') {
      return <VideosPage onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    // 3.5 News Routes (Public for user)
    if (p.startsWith('/news/') || p.startsWith('#/news/')) {
      const slug = p.replace('/news/', '').replace('#/news/', '');
      return <NewsDetailsPage slug={slug} onNavigate={navigate} />;
    }

    if (p === '/news' || p === '#/news') {
      return <NewsPage onNavigate={navigate} />;
    }

    // 3.6 Category Routes (Public for user)
    if (p.startsWith('/category/') || p.startsWith('#/category/')) {
      const categoryId = p.replace('/category/', '').replace('#/category/', '');
      return <CategoryPage categoryId={categoryId} onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    // 3.7 Tools (Public for user)
    if (p === '/calculator' || p === '#/calculator') {
      return <div className="py-8"><SipCalculator /></div>;
    }

    if (p === '/quiz' || p === '#/quiz') {
      return <div className="py-8"><SipCalculator initialTab="quiz" /></div>;
    }

    // 3.8 Public Professionals Directory & Publisher Profiles
    if (p.startsWith('/professionals/') || p.startsWith('#/professionals/')) {
      const profId = p.replace('/professionals/', '').replace('#/professionals/', '');
      return <ProfessionalProfilePage professionalId={profId} onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    if (p === '/professionals' || p === '#/professionals') {
      return <ProfessionalsDirectoryPage onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    // Default Fallback: Public Landing Page
    return <Home onNavigate={navigate} onShowToast={setToastMessage} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      {/* 1. FIXED TOP HEADER & NAVBAR STACK */}
      <div className="sticky-header-container sticky top-0 z-40 w-full shadow-md bg-white dark:bg-slate-950 border-b border-[#e2e8df] dark:border-slate-800">
        <Header onOpenSearch={() => setIsSearchOpen(true)} onNavigate={navigate} />
        <Navbar currentPath={currentPath} onNavigate={navigate} />
      </div>

      {/* 2. BREAKING NEWS TICKER ONLY ON HOMEPAGE */}
      {isHome && (
        <TrendingTicker onNavigate={navigate} />
      )}

      <main className="flex-1">
        <Suspense fallback={<RouteLoadingSpinner />}>
          {renderRoute()}
        </Suspense>
      </main>

      <Footer onNavigate={navigate} onShowToast={setToastMessage} />

      {isSearchOpen && (
        <Suspense fallback={null}>
          <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={navigate} />
        </Suspense>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Mobile Floating Action Button (FAB) above Bottom Tab Bar (md:hidden) */}
      <div className="fixed right-4 bottom-[calc(4.85rem+env(safe-area-inset-bottom,0px))] z-30 md:hidden flex flex-col items-end gap-2">
        {fabOpen && (
          <div className="flex flex-col items-end gap-2 animate-fadeIn">
            {/* Quick Action 1: Search */}
            <button
              type="button"
              onClick={() => {
                setFabOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-slate-800 text-xs font-bold tap-feedback active:scale-95"
            >
              <span>{currentPath.includes('ta') ? 'தேடுக' : 'Search'}</span>
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
            </button>

            {/* Quick Action 2: Calculator */}
            <button
              type="button"
              onClick={() => {
                setFabOpen(false);
                navigate('#/calculator');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-slate-800 text-xs font-bold tap-feedback active:scale-95"
            >
              <span>{currentPath.includes('ta') ? 'கால்குலேட்டர்' : 'Calculator'}</span>
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          type="button"
          onClick={() => setFabOpen(prev => !prev)}
          className={`w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center transition-all duration-200 tap-feedback active:scale-90 cursor-pointer ${
            fabOpen ? 'rotate-45 bg-slate-900' : ''
          }`}
          aria-label="Quick action menu"
          title="Quick actions"
        >
          {fabOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      {/* 15-Second Visitor Login Reminder Popup */}
      <Suspense fallback={null}>
        <LoginReminderModal currentHash={currentPath} onNavigate={navigate} />
      </Suspense>

      {/* Automatic First-Time Publisher Onboarding Modal */}
      {user && (role === 'publisher' || profile?.role === 'publisher') && (!profile?.is_onboarded || profile?.is_onboarded === false) && (
        <Suspense fallback={null}>
          <PublisherOnboardingModal
            profile={profile}
            onComplete={(updated) => {
              if (setProfile) setProfile(updated);
              setToastMessage('Welcome! Your publisher profile is complete and visible to all users.');
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
