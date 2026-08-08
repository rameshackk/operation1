import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';

export function SipCalculator() {
  const { t, language } = useLanguage();
  const [calcMode, setCalcMode] = useState('sip'); // 'sip', 'lumpsum', 'stepup', 'compound'
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [timeYears, setTimeYears] = useState(15);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);

  const isTamil = language === 'ta';

  const applyPresetGoal = (amount, rate, years) => {
    setMonthlyInvest(amount);
    setReturnRate(rate);
    setTimeYears(years);
  };

  // Math Calculations
  const r = returnRate / 100;
  const i = r / 12;
  const n = timeYears * 12;

  let totalInvested = 0;
  let futureValue = 0;

  if (calcMode === 'sip') {
    totalInvested = monthlyInvest * n;
    futureValue = Math.round(monthlyInvest * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  } else if (calcMode === 'stepup') {
    let currentMonthly = monthlyInvest;
    let accumulated = 0;
    let totalPaid = 0;
    for (let yr = 1; yr <= timeYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        totalPaid += currentMonthly;
        accumulated = (accumulated + currentMonthly) * (1 + i);
      }
      currentMonthly = currentMonthly * (1 + stepUpPercent / 100);
    }
    totalInvested = Math.round(totalPaid);
    futureValue = Math.round(accumulated);
  } else if (calcMode === 'lumpsum') {
    totalInvested = monthlyInvest;
    futureValue = Math.round(monthlyInvest * Math.pow(1 + r, timeYears));
  } else if (calcMode === 'compound') {
    totalInvested = monthlyInvest;
    futureValue = Math.round(monthlyInvest * Math.pow(1 + r, timeYears));
  }

  const estimatedGain = Math.max(0, futureValue - totalInvested);
  const wealthMultiplier = totalInvested > 0 ? (futureValue / totalInvested).toFixed(1) : 1;

  const inflationFactor = Math.pow(1 + inflationRate / 100, timeYears);
  const realPurchasingPower = Math.round(futureValue / inflationFactor);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(isTamil ? 'ta-IN' : 'en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const calculatorCards = [
    {
      id: 'sip',
      titleTamil: 'SIP Calculator',
      titleEnglish: 'SIP Calculator',
      subtitleTamil: 'மாதாந்திர SIP கணக்கீடு',
      subtitleEnglish: 'Monthly Systematic Investment',
      icon: '📊',
      badge: 'POPULAR'
    },
    {
      id: 'lumpsum',
      titleTamil: 'Lump Sum Calculator',
      titleEnglish: 'Lump Sum Calculator',
      subtitleTamil: 'ஒரே முறை முதலீடு',
      subtitleEnglish: 'One-Time Investment Growth',
      icon: '💰',
      badge: 'SIMPLE'
    },
    {
      id: 'stepup',
      titleTamil: 'Investment Returns Calculator',
      titleEnglish: 'Returns Calculator',
      subtitleTamil: 'ஆண்டு உயர்வு +10% முதலீடு',
      subtitleEnglish: 'Step-Up Annual Incremental Growth',
      icon: '🚀',
      badge: 'HIGH GROWTH'
    },
    {
      id: 'compound',
      titleTamil: 'Compound Interest Calculator',
      titleEnglish: 'Compound Interest',
      subtitleTamil: 'கூட்டு வட்டி வளர்ச்சி',
      subtitleEnglish: 'Power of Compounding Growth',
      icon: '⚡',
      badge: 'WEALTH'
    }
  ];

  return (
    <section id="financial-calculators" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Section Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          FINANCIAL TOOLS
        </span>
        <h2 className="text-2xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white">
          {t('financialCalculators') || (isTamil ? "நிதி கணக்கீட்டுக் கருவிகள்" : "Financial Calculators")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {t('financialCalculatorsDesc') || (isTamil 
            ? "SIP, ஒரே முறை முதலீடு, முதலீட்டு வருவாய் மற்றும் கூட்டு வட்டி ஆகியவற்றைக் கணக்கிட உதவும் நிதிச் சாதனங்கள்." 
            : "Plan your long-term wealth creation with accurate returns, step-ups, and inflation adjustments.")}
        </p>
      </div>

      {/* 4 Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {calculatorCards.map((card) => {
          const isActive = calcMode === card.id;
          return (
            <div
              key={card.id}
              onClick={() => setCalcMode(card.id)}
              className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900 text-white border-amber-500 shadow-xl ring-2 ring-amber-500/50'
                  : 'bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{card.icon}</span>
                  <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm font-serif group-hover:text-amber-500 transition-colors">
                  {isTamil ? card.titleTamil : card.titleEnglish}
                </h3>
                <p className={`text-xs mt-1 ${isActive ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {isTamil ? card.subtitleTamil : card.subtitleEnglish}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/20 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className={isActive ? 'text-amber-400' : 'text-amber-600 dark:text-amber-400'}>
                  {isActive ? 'Active Calculator' : 'Use Calculator'}
                </span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Calculator Console */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
        
        {/* Header & Mode Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black font-serif text-white flex items-center gap-2">
              <span>⚡</span>
              <span>
                {calcMode === 'sip' && (isTamil ? "SIP முதலீட்டு கணக்கிடுவான்" : "SIP Returns Calculator")}
                {calcMode === 'lumpsum' && (isTamil ? "ஒரே முறை (Lump Sum) முதலீட்டு கணக்கிடுவான்" : "Lump Sum Returns Calculator")}
                {calcMode === 'stepup' && (isTamil ? "முதலீட்டு உயர்வு (Step-Up SIP) கணக்கிடுவான்" : "Step-Up SIP Calculator")}
                {calcMode === 'compound' && (isTamil ? "கூட்டு வட்டி (Compound Interest) கணக்கிடுவான்" : "Compound Interest Calculator")}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isTamil ? "உங்களின் நீண்ட கால முதலீட்டு இலக்கை அடைய துல்லியமான கணிப்பு" : "Interactive asset compounding and inflation-adjusted growth projections"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setCalcMode('sip')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                calcMode === 'sip' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              SIP
            </button>
            <button
              onClick={() => setCalcMode('lumpsum')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                calcMode === 'lumpsum' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lump Sum
            </button>
            <button
              onClick={() => setCalcMode('stepup')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                calcMode === 'stepup' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Step-Up
            </button>
            <button
              onClick={() => setCalcMode('compound')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                calcMode === 'compound' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Compound Interest
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Quick Goals:</span>
          <button onClick={() => applyPresetGoal(5000, 12, 15)} className="px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold">₹1 Crore Goal (₹5k/mo)</button>
          <button onClick={() => applyPresetGoal(10000, 14, 10)} className="px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold">₹50 Lakh Goal (₹10k/mo)</button>
          <button onClick={() => applyPresetGoal(25000, 12, 5)} className="px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold">₹20 Lakh Short Term</button>
        </div>

        {/* Sliders vs Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Inputs */}
          <div className="space-y-6 bg-slate-800/40 p-6 rounded-3xl border border-slate-800">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-300">
                  {calcMode === 'lumpsum' || calcMode === 'compound' ? (isTamil ? 'முதலீட்டுத் தொகை (₹)' : 'Initial Investment (₹)') : t('monthlyInvestment')}
                </label>
                <span className="text-amber-400 font-mono text-sm font-black">{formatCurrency(monthlyInvest)}</span>
              </div>
              <input
                type="range"
                min={calcMode === 'lumpsum' || calcMode === 'compound' ? "5000" : "500"}
                max={calcMode === 'lumpsum' || calcMode === 'compound' ? "2000000" : "100000"}
                step={calcMode === 'lumpsum' || calcMode === 'compound' ? "5000" : "500"}
                value={monthlyInvest}
                onChange={e => setMonthlyInvest(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {calcMode === 'stepup' && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-300">Annual Step-Up Increase (%)</label>
                  <span className="text-amber-400 font-mono text-sm font-black">+{stepUpPercent}% / Year</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={stepUpPercent}
                  onChange={e => setStepUpPercent(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            )}

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-300">{t('expectedReturnRate')}</label>
                <span className="text-amber-400 font-mono text-sm font-black">{returnRate}% / Year</span>
              </div>
              <input
                type="range"
                min="6"
                max="24"
                step="0.5"
                value={returnRate}
                onChange={e => setReturnRate(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-300">{t('timePeriod')}</label>
                <span className="text-amber-400 font-mono text-sm font-black">{timeYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={timeYears}
                onChange={e => setTimeYears(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-700/50">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-400">Expected Inflation Rate (%)</label>
                <span className="text-slate-300 font-mono text-xs">{inflationRate}%</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                step="0.5"
                value={inflationRate}
                onChange={e => setInflationRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="space-y-6 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-inner flex flex-col justify-between h-full">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Total Invested</span>
                <span className="text-lg font-black font-mono text-white">{formatCurrency(totalInvested)}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Interest Gain</span>
                <span className="text-lg font-black font-mono text-emerald-400">+{formatCurrency(estimatedGain)}</span>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Total Future Wealth</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">{formatCurrency(futureValue)}</div>
                <div className="text-[11px] text-slate-300 font-medium">Wealth multiplier: <strong className="text-white">{wealthMultiplier}x</strong> original capital</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
                <div className="flex justify-between font-bold">
                  <span>Real Purchasing Power (Inflation-Adjusted @ {inflationRate}%):</span>
                  <span className="text-white font-mono">{formatCurrency(realPurchasingPower)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
