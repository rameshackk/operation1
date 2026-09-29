import React, { Suspense, lazy } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import HeroSection from './HeroSection.jsx';
import TrendingArticlesSection from './TrendingArticlesSection.jsx';
import HomeCinemaShowcase from './HomeCinemaShowcase.jsx';

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

  return (
    <div className="space-y-12 sm:space-y-14 pb-16 sm:pb-20 pt-4 sm:pt-6 animate-fadeIn">
      {/* 1. FEATURED NEWS TICKER ON LEFT + LATEST ARTICLES ON RIGHT */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. COMPACT CINEMA VIDEO CARDS SHOWCASE */}
      <HomeCinemaShowcase
        onNavigate={onNavigate}
        onShowToast={onShowToast}
        language={language}
      />

      {/* 3. TRENDING ARTICLES SECTION (DYNAMIC DB SYNC) */}
      <TrendingArticlesSection onNavigate={onNavigate} />

      {/* 4. FINANCIAL CALCULATOR & IN-DEPTH ANALYSIS (IntersectionObserver Lazy Mount) */}
      <LazyMount fallback={
        <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 py-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400 min-h-[120px]">
          நிதி கணக்கீட்டுக் கருவி ஏற்றப்படுகிறது...
        </div>
      }>
        <Suspense fallback={
          <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 py-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400 min-h-[120px]">
            நிதி கணக்கீட்டுக் கருவி ஏற்றப்படுகிறது...
          </div>
        }>
          <SipCalculator />
        </Suspense>
      </LazyMount>
    </div>
  );
}

export default Home;
export { Home };
