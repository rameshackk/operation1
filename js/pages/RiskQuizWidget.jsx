import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

function RiskQuizWidget() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = [
    {
      title: isTamil ? "உங்கள் முதன்மையான முதலீட்டு இலக்கு என்ன?" : "What is your primary investment goal?",
      options: [
        {
          label: isTamil ? "நீண்ட கால செல்வ உருவாக்கம் (10+ ஆண்டுகள்)" : "Long-term wealth creation (10+ years)",
          score: "equity"
        },
        {
          label: isTamil ? "வீடு வாங்குதல் / குழந்தைகள் கல்வி (3-5 ஆண்டுகள்)" : "Buying a home / Children education (3-5 years)",
          score: "balanced"
        },
        {
          label: isTamil ? "அவசர கால பாதுகாப்பு & மூலதனப் பாதுகாப்பு" : "Emergency safety & capital protection",
          score: "debt"
        }
      ]
    },
    {
      title: isTamil ? "பங்குச் சந்தை 15% சரிந்தால் உங்கள் எதிர்வினை என்ன?" : "How would you react if the stock market dips 15%?",
      options: [
        {
          label: isTamil ? "டாப்-அப் SIP மூலம் கூடுதல் முதலீடு செய்வேன்! சிறந்த வாய்ப்பு." : "Invest more via Top-up SIP! Great buying opportunity.",
          score: "equity"
        },
        {
          label: isTamil ? "பொறுமையாக இருந்து எனது மாதாந்திர SIP-ஐ தொடர்வேன்." : "Hold steady and continue existing monthly SIP.",
          score: "balanced"
        },
        {
          label: isTamil ? "பயந்து முதலீட்டை எடுத்து ஃபிக்ஸட் டெபாசிட்டில் போடுவேன்." : "Feel anxious and move money to Fixed Deposits.",
          score: "debt"
        }
      ]
    }
  ];

  const handleOptionSelect = (score) => {
    const nextAnswers = { ...answers, [currentStep]: score };
    setAnswers(nextAnswers);
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const counts = Object.values(nextAnswers).reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
      if (counts.equity >= 1) {
        setResult(isTamil ? "ஃப்ளெக்ஸி கேப் / ஸ்மால் கேப் மியூச்சுவல் ஃபண்டுகள் (Flexi / Small Cap)" : "Flexi Cap / Small Cap Mutual Funds");
      } else if (counts.balanced >= 1) {
        setResult(isTamil ? "லார்ஜ் கேப் & ஹைபிரிட் ஃபண்டுகள் (Large Cap & Hybrid Funds)" : "Large Cap & Hybrid Funds");
      } else {
        setResult(isTamil ? "லிக்விட் & குறுகிய கால கடன் ஃபண்டுகள் (Liquid & Debt Funds)" : "Liquid & Short Duration Debt Funds");
      }
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <section id="quiz" className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Unified Compact Hero Header Banner (Light & Dark mode) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-emerald-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-emerald-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span>{isTamil ? 'முதலீட்டு இடர் & ஃபண்ட் தேர்வு வினாடி வினா' : 'INTERACTIVE RISK & MATCH QUIZ'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white leading-snug">
            {isTamil ? 'உங்கள் முதலீட்டு இலக்கிற்கு ஏற்ற மியூச்சுவல் ஃபண்ட்' : 'Find Your Mutual Fund Match'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {isTamil
              ? 'சில எளிய கேள்விகளுக்கு பதிலளிப்பதன் மூலம் உங்கள் இடர் ஏற்புத் திறனுக்கேற்ற சிறந்த முதலீட்டுத் திட்டத்தைக் கண்டறியுங்கள்.'
              : 'Answer quick questions to discover tailored asset allocation and investment strategies for your risk appetite.'}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {!result ? (
          <div className="space-y-5">
            <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200">{questions[currentStep].title}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {questions[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt.score)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-500/10 text-left border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-xs font-bold text-slate-900 dark:text-slate-100 transition-all hover:scale-102"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
              {isTamil ? 'உங்களுக்குப் பரிந்துரைக்கப்படும் ஃபண்ட் பிரிவு' : 'Recommended Fund Category'}
            </h4>
            <p className="text-xl font-black text-slate-900 dark:text-white font-serif">{result}</p>
            <button onClick={resetQuiz} className="px-5 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs">
              {isTamil ? 'மீண்டும் வினாடி வினாவைத் தொடங்கவும்' : 'Retake Quiz'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}


export default RiskQuizWidget;
export { RiskQuizWidget };
