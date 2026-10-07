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
    <div className="w-full animate-fadeIn flex flex-col">
      {/* 1. SECTION 1: HERO & FEATURED NEWS (Pure White #FFFFFF) */}
      <section className="w-full bg-[#FFFFFF] dark:bg-slate-900/60 py-8 sm:py-12 border-b border-slate-100 dark:border-slate-800">
        <HeroSection onNavigate={onNavigate} />
      </section>

      {/* 2. SECTION 2: CINEMA VIDEO SHOWCASE (Frosted Glass White Aesthetic) */}
      <section className="w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 sm:py-14 border-b border-slate-200/80 dark:border-slate-800">
        <HomeCinemaShowcase
          onNavigate={onNavigate}
          onShowToast={onShowToast}
          language={language}
        />
      </section>

      {/* 3. SECTION 3: TRENDING ARTICLES (Pure White #FFFFFF) */}
      <section className="w-full bg-[#FFFFFF] dark:bg-slate-900/60 py-10 sm:py-14 border-b border-slate-100 dark:border-slate-800">
        <TrendingArticlesSection onNavigate={onNavigate} />
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
