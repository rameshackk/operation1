import React, { Suspense, lazy } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import HeroSection from './HeroSection.jsx';
import TrendingArticlesSection from './TrendingArticlesSection.jsx';
import HomeLatestVideos from './HomeLatestVideos.jsx';

const SipCalculator = lazy(() => import('../../pages/SipCalculator.jsx'));

function LazyMount({ children, fallback }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current || isVisible) return;
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  return <div ref={ref}>{isVisible ? children : (fallback || null)}</div>;
}

function Home({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [pullY, setPullY] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [refreshSuccess, setRefreshSuccess] = React.useState(false);
  const touchStartY = React.useRef(0);
  const isPullingRef = React.useRef(false);

  const isTamil = language === 'ta';

  const handleTouchStart = (e) => {
    if (window.innerWidth >= 768) return;
    if (window.scrollY <= 5 && !isRefreshing) {
      touchStartY.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isPullingRef.current || isRefreshing || window.innerWidth >= 768) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff > 0 && window.scrollY <= 5) {
      // Apply rubber-band dampening
      const distance = Math.min(diff * 0.45, 80);
      setPullY(distance);
    } else {
      setPullY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isPullingRef.current || isRefreshing) return;
    isPullingRef.current = false;
    if (pullY >= 50) {
      setIsRefreshing(true);
      setPullY(58);
      // Trigger feed refresh
      setTimeout(() => {
        setRefreshKey(prev => prev + 1);
        setIsRefreshing(false);
        setRefreshSuccess(true);
        if (onShowToast) {
          onShowToast(isTamil ? 'செய்திகள் புதுப்பிக்கப்பட்டன ✓' : 'Feed updated successfully ✓');
        }
        setTimeout(() => {
          setRefreshSuccess(false);
          setPullY(0);
        }, 600);
      }, 900);
    } else {
      setPullY(0);
    }
  };

  return (
    <div 
      className="w-full animate-fadeIn flex flex-col relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile-Only Pull to Refresh Indicator (md:hidden) */}
      <div 
        className="md:hidden overflow-hidden transition-all duration-200 flex items-center justify-center pointer-events-none"
        style={{ 
          height: `${pullY}px`,
          opacity: pullY > 10 ? 1 : 0
        }}
      >
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
          {isRefreshing ? (
            <>
              {/* Branded loading spinner */}
              <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <span className="text-emerald-600 dark:text-emerald-400 font-sans">
                {isTamil ? 'செய்திகள் புதுப்பிக்கப்படுகிறது...' : 'Refreshing news feed...'}
              </span>
            </>
          ) : refreshSuccess ? (
            <>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-sans">
                {isTamil ? 'புதுப்பிக்கப்பட்டது!' : 'Feed Updated!'}
              </span>
            </>
          ) : pullY >= 50 ? (
            <>
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>{isTamil ? 'புதுப்பிக்க விடுவிக்கவும்' : 'Release to refresh'}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>{isTamil ? 'கீழே இழுக்கவும்' : 'Pull down to refresh'}</span>
            </>
          )}
        </div>
      </div>

      {/* 1. SECTION 1: HERO & FEATURED NEWS */}
      <section className="w-full bg-[#FFFFFF] dark:bg-slate-900/60 py-8 sm:py-12 border-b border-slate-100 dark:border-slate-800">
        <HeroSection key={`hero-${refreshKey}`} onNavigate={onNavigate} />
      </section>

      {/* 2. SECTION 2: LATEST YOUTUBE VIDEOS */}
      <HomeLatestVideos
        key={`videos-${refreshKey}`}
        onShowToast={onShowToast}
        language={language}
      />

      {/* 3. SECTION 3: TRENDING ARTICLES (Pure White #FFFFFF) */}
      <section className="w-full bg-[#FFFFFF] dark:bg-slate-900/60 py-10 sm:py-14 border-b border-slate-100 dark:border-slate-800">
        <TrendingArticlesSection key={`trending-${refreshKey}`} onNavigate={onNavigate} />
      </section>

      {/* 4. SECTION 4: SIP WEALTH CALCULATOR (Frosted Glass White Aesthetic) */}
      <section className="w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 sm:py-14 pb-16 sm:pb-20">
        <LazyMount fallback={
          <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 py-8 text-center text-sm font-medium text-emerald-200 min-h-[120px]">
            நிதி கணக்கீட்டுக் கருவி ஏற்றப்படுகிறது...
          </div>
        }>
          <Suspense fallback={
            <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 py-8 text-center text-sm font-medium text-emerald-200 min-h-[120px]">
              நிதி கணக்கீட்டுக் கருவி ஏற்றப்படுகிறது...
            </div>
          }>
            <SipCalculator />
          </Suspense>
        </LazyMount>
      </section>
    </div>
  );
}

export default Home;
export { Home };
