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
const RiskQuizWidget = lazy(() => import('./pages/RiskQuizWidget.jsx'));
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
      return <div className="py-8"><RiskQuizWidget /></div>;
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
      <div className="sticky-header-container sticky top-0 z-40 w-full shadow-md bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
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
              setToastMessage('🎉 Welcome! Your publisher profile is complete and visible to all users.');
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
