import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth, getSupabaseClient } from '../context/AuthContext.jsx';

function RiskQuizWidget() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isTamil = language === 'ta';
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const questions = [
    {
      id: 'age',
      title: isTamil ? "1. உங்கள் வயது வரம்பு என்ன?" : "1. What is your age group?",
      options: [
        { label: isTamil ? "30 வயதுக்கு கீழ் (Below 30 yrs)" : "Below 30 years", score: 3 },
        { label: isTamil ? "30 முதல் 45 வயது (30 - 45 yrs)" : "30 to 45 years", score: 2 },
        { label: isTamil ? "45 வயதுக்கு மேல் (Above 45 yrs)" : "Above 45 years", score: 1 }
      ]
    },
    {
      id: 'horizon',
      title: isTamil ? "2. உங்கள் முதலீட்டு கால அளவு என்ன?" : "2. What is your planned investment horizon?",
      options: [
        { label: isTamil ? "நீண்ட காலம் (7+ ஆண்டுகள்)" : "Long Term (7+ years)", score: 3 },
        { label: isTamil ? "நடுத்தர காலம் (3 - 7 ஆண்டுகள்)" : "Medium Term (3 - 7 years)", score: 2 },
        { label: isTamil ? "குறுகிய காலம் (1 - 3 ஆண்டுகள்)" : "Short Term (1 - 3 years)", score: 1 }
      ]
    },
    {
      id: 'income_stability',
      title: isTamil ? "3. உங்கள் வருமானத்தின் நிலைத்தன்மை எப்படி உள்ளது?" : "3. How stable is your primary source of income?",
      options: [
        { label: isTamil ? "மிகவும் நிலையானது & தொடர்ச்சியான வருமானம்" : "Highly stable & secure salary / business", score: 3 },
        { label: isTamil ? "மிதமான நிலைத்தன்மை (Moderate)" : "Moderately stable with occasional fluctuations", score: 2 },
        { label: isTamil ? "மாறிக்கொண்டே இருக்கும் / கணிக்க முடியாதது" : "Unpredictable / Highly variable income", score: 1 }
      ]
    },
    {
      id: 'existing_investments',
      title: isTamil ? "4. உங்களுக்கு இருக்கும் தற்போதைய முதலீட்டு அனுபவம் என்ன?" : "4. What is your prior investment experience?",
      options: [
        { label: isTamil ? "பங்குச்சந்தை / மியூச்சுவல் ஃபண்டுகளில் நேரடி அனுபவம் உண்டு" : "Experienced in Equities & Mutual Funds", score: 3 },
        { label: isTamil ? "FD, RD, தங்கம் போன்ற பாரம்பரிய சேமிப்புகள் மட்டுமே" : "Only Traditional FD, RD, Gold, PPF", score: 2 },
        { label: isTamil ? "முதலீட்டில் புதியவர் (Beginner)" : "Complete beginner to investing", score: 1 }
      ]
    },
    {
      id: 'loss_tolerance',
      title: isTamil ? "5. சந்தை 20% சரிந்தால் உங்கள் மனநிலை எப்படி இருக்கும்?" : "5. How would you react if the market drops 20% in a month?",
      options: [
        { label: isTamil ? "நல்ல வாய்ப்பாகக் கருதி கூடுதல் முதலீடு செய்வேன்" : "See it as a buying opportunity & invest more", score: 3 },
        { label: isTamil ? "பொறுமையாக எனது SIP முதலீட்டைத் தொடர்வேன்" : "Stay patient and continue regular investments", score: 2 },
        { label: isTamil ? "பயந்துபோய் முதலீட்டைத் திரும்பப் பெறுவேன்" : "Feel anxious and withdraw funds immediately", score: 1 }
      ]
    },
    {
      id: 'goal',
      title: isTamil ? "6. உங்கள் முதன்மையான முதலீட்டு நோக்கம் என்ன?" : "6. What is your primary investment goal?",
      options: [
        { label: isTamil ? "அதிக வருமானம் & நீண்ட கால செல்வப் பெருக்கம்" : "Aggressive capital appreciation & wealth growth", score: 3 },
        { label: isTamil ? "பணவீக்கத்தை வெல்லும் மிதமான வளர்ச்சி & பாதுகாப்பு" : "Balanced growth with moderate protection", score: 2 },
        { label: isTamil ? "மூலதனப் பாதுகாப்பு & அவசர கால நிதி" : "Capital preservation & liquidity safety", score: 1 }
      ]
    }
  ];

  const handleOptionSelect = async (score) => {
    const nextAnswers = { ...answers, [questions[currentStep].id]: score };
    setAnswers(nextAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate risk profile
      const totalScore = Object.values(nextAnswers).reduce((sum, val) => sum + val, 0);
      let calculatedResult = null;

      if (totalScore >= 14) {
        calculatedResult = {
          category: isTamil ? "அக்ரஸிவ் (Aggressive)" : "Aggressive",
          desc: isTamil 
            ? "நீண்ட கால அடிப்படையில் அதிக வருமானத்தை இலக்காகக் கொண்ட முதலீட்டாளர். தற்காலிக சந்தை ஏற்ற இறக்கங்களைத் தாங்கும் திறன் கொண்டவர்." 
            : "High tolerance for market fluctuations with a focus on maximizing long-term wealth growth.",
          equity: 80,
          debt: 15,
          gold: 5,
          color: "emerald"
        };
      } else if (totalScore >= 10) {
        calculatedResult = {
          category: isTamil ? "மிதமானது (Moderate)" : "Moderate",
          desc: isTamil 
            ? "வளர்ச்சி மற்றும் மூலதனப் பாதுகாப்பு இரண்டையும் சமநிலையில் விரும்பும் முதலீட்டாளர்." 
            : "Balanced approach seeking steady capital growth while maintaining safety against severe market dips.",
          equity: 55,
          debt: 35,
          gold: 10,
          color: "blue"
        };
      } else {
        calculatedResult = {
          category: isTamil ? "பாதுகாப்பானது (Conservative)" : "Conservative",
          desc: isTamil 
            ? "மூலதனப் பாதுகாப்பிற்கு முன்னுரிமை அளித்து நிலையான வருவாயை எதிர்பார்க்கும் முதலீட்டாளர்." 
            : "Prioritizes capital preservation, high liquidity, and lower volatility over high returns.",
          equity: 25,
          debt: 65,
          gold: 10,
          color: "amber"
        };
      }

      setResult(calculatedResult);

      // Save to Supabase if logged in
      if (user && user.id) {
        setIsSaving(true);
        try {
          const client = await getSupabaseClient();
          if (client) {
            await client.from('risk_profiles').upsert({
              user_id: user.id,
              risk_category: calculatedResult.category,
              equity_pct: calculatedResult.equity,
              debt_pct: calculatedResult.debt,
              gold_pct: calculatedResult.gold,
              answers: nextAnswers,
              updated_at: new Date().toISOString()
            });
            setSavedSuccess(true);
          }
        } catch (saveErr) {
          console.warn('Risk profile auto-save note:', saveErr.message);
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setSavedSuccess(false);
  };

  return (
    <section id="quiz" className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Unified Compact Hero Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-emerald-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-emerald-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span>{isTamil ? 'இடர் ஏற்புத்திறன் & சொத்துப் பகிர்வு மதிப்பீடு' : 'RISK PROFILING & ASSET ALLOCATION QUIZ'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white leading-snug">
            {isTamil ? 'உங்கள் முதலீட்டு இடர் வகை என்ன?' : 'Discover Your Risk Category'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {isTamil
              ? '6 எளிய கேள்விகளுக்கு பதிலளிப்பதன் மூலம் உங்கள் இடர் ஏற்புத் திறனைக் கண்டறிந்து அதற்கேற்ற சொத்துப் பகிர்வு (Asset Mix) மாதிரியைப் பெறுங்கள்.'
              : 'Answer 6 quick questions to determine your risk profile (Conservative / Moderate / Aggressive) and get an indicative asset mix.'}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {!result ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                {isTamil ? `கேள்வி ${currentStep + 1} / ${questions.length}` : `Question ${currentStep + 1} of ${questions.length}`}
              </span>
              <div className="w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-200">
              {questions[currentStep].title}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {questions[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt.score)}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-500/10 text-left border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 transition-all hover:scale-102 hover:shadow-md cursor-pointer"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                {isTamil ? 'உங்கள் இடர் வகைப்பாடு' : 'Your Risk Profile'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
                {result.category}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {result.desc}
              </p>

              {/* Indicative Asset Mix Only */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 max-w-xl mx-auto space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isTamil ? 'பரிந்துரைக்கப்படும் சொத்துப் பகிர்வு (Indicative Asset Mix)' : 'Indicative Asset Mix'}
                </h4>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="block text-xs text-slate-500 font-medium">{isTamil ? 'பங்கு (Equity)' : 'Equity'}</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">{result.equity}%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="block text-xs text-slate-500 font-medium">{isTamil ? 'கடன் (Debt)' : 'Debt'}</span>
                    <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">{result.debt}%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="block text-xs text-slate-500 font-medium">{isTamil ? 'தங்கம்/பணம் (Gold/Cash)' : 'Gold / Cash'}</span>
                    <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">{result.gold}%</span>
                  </div>
                </div>

                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div style={{ width: `${result.equity}%` }} className="bg-emerald-500 h-full" title="Equity" />
                  <div style={{ width: `${result.debt}%` }} className="bg-blue-500 h-full" title="Debt" />
                  <div style={{ width: `${result.gold}%` }} className="bg-amber-500 h-full" title="Gold/Cash" />
                </div>
              </div>
            </div>

            {/* SEBI Compliance Disclaimer */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-medium text-left">
              <span className="font-bold block mb-1">⚠️ {isTamil ? 'முக்கிய அறிவிப்பு (SEBI Disclaimer):' : 'Mandatory SEBI Disclaimer:'}</span>
              {isTamil
                ? 'மியூச்சுவல் ஃபண்ட் முதலீடுகள் சந்தை அபாயங்களுக்கு உட்பட்டவை, அனைத்து திட்டம் தொடர்பான ஆவணங்களையும் கவனமாகப் படிக்கவும்.'
                : 'Mutual fund investments are subject to market risks, read all scheme related documents carefully.'}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href="/professionals"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#/professionals';
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all transform hover:scale-105 cursor-pointer"
              >
                <span>{isTamil ? 'AMFI பதிவுசெய்த MFD-ஐ தொடர்பு கொள்ளவும்' : 'Talk to an MFD'}</span>
                <span>→</span>
              </a>
              <button
                onClick={resetQuiz}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                {isTamil ? 'மீண்டும் வினாடி வினாவைத் தொடங்கவும்' : 'Retake Quiz'}
              </button>
            </div>

            {savedSuccess && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ {isTamil ? 'உங்கள் இடர் விபரம் பாதுகாப்பாக சேமிக்கப்பட்டது.' : 'Your risk profile has been securely saved to your account.'}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default RiskQuizWidget;
export { RiskQuizWidget };

