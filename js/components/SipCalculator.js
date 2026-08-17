import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';

export function SipCalculator() {
  const { t, language } = useLanguage();
  const [calcMode, setCalcMode] = useState('sip');
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
  } else if (calcMode === 'lumpsum' || calcMode === 'compound') {
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
      titleTamil: 'SIP கணக்கிடுவான்',
      titleEnglish: 'SIP Calculator',
      subtitleTamil: 'மாதாந்திர முறையான முதலீடு',
      subtitleEnglish: 'Monthly Systematic Investment',
      icon: '',
      badge: isTamil ? 'பிரபலம்' : 'POPULAR'
    },
    {
      id: 'lumpsum',
      titleTamil: 'ஒரே முறை முதலீடு',
      titleEnglish: 'Lump Sum Calculator',
      subtitleTamil: 'ஒரே முறை முதலீட்டு வளர்ச்சி',
      subtitleEnglish: 'One-Time Investment Growth',
      icon: '',
      badge: isTamil ? 'எளிது' : 'SIMPLE'
    },
    {
      id: 'stepup',
      titleTamil: 'முதலீட்டு வருவாய் உயர்வு',
      titleEnglish: 'Returns Calculator',
      subtitleTamil: 'ஆண்டு முதலீட்டு உயர்வு (+10%)',
      subtitleEnglish: 'Step-Up Annual Incremental Growth',
      icon: '',
      badge: isTamil ? 'அதிவேக வளர்ச்சி' : 'HIGH GROWTH'
    },
    {
      id: 'compound',
      titleTamil: 'கூட்டு வட்டி கணக்கீடு',
      titleEnglish: 'Compound Interest',
      subtitleTamil: 'கூட்டு வட்டியின் அபார வளர்ச்சி',
      subtitleEnglish: 'Power of Compounding Growth',
      icon: '',
      badge: isTamil ? 'செல்வ வளர்ச்சி' : 'WEALTH'
    }
  ];

  return (
    <section id="financial-calculators" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          {isTamil ? 'நிதி கணக்கீட்டுக் கருவிகள்' : 'FINANCIAL TOOLS'}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white">
          {isTamil ? 'நிதி கணக்கீட்டுக் கருவிகள்' : 'Financial Calculators'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {isTamil 
            ? 'SIP, ஒரே முறை முதலீடு, முதலீட்டு வருவாய் மற்றும் கூட்டு வட்டி ஆகியவற்றைக் கணக்கிட உதவும் சாதனங்கள்.' 
            : 'Essential financial tools to plan SIPs, Lump Sum investments, returns, and compound interest growth.'}
        </p>
      </div>

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
                  <span className="text-2xl">{card.icon}</span>
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
                  {isActive ? (isTamil ? 'செயலில் உள்ள கணக்கீடு' : 'Active Calculator') : (isTamil ? 'பயன்படுத்துக' : 'Use Calculator')}
                </span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black font-serif text-white flex items-center gap-2">
              <span className="text-amber-400"></span>
              <span>
                {calcMode === 'sip' && (isTamil ? 'SIP முதலீட்டுக் கணக்கீடு' : 'SIP Returns Calculator')}
                {calcMode === 'lumpsum' && (isTamil ? 'ஒரே முறை (Lump Sum) முதலீட்டுக் கணக்கீடு' : 'Lump Sum Returns Calculator')}
                {calcMode === 'stepup' && (isTamil ? 'முதலீட்டு உயர்வு (Step-Up SIP) கணக்கீடு' : 'Step-Up SIP Calculator')}
                {calcMode === 'compound' && (isTamil ? 'கூட்டு வட்டி (Compound Interest) கணக்கீடு' : 'Compound Interest Calculator')}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isTamil ? 'உங்கள் நீண்ட கால முதலீட்டு இலக்கை அடைய துல்லியமான கூட்டு வட்டி கணிப்பு' : 'Interactive asset compounding and inflation-adjusted growth projections'}
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
              {isTamil ? 'ஒரே முறை' : 'Lump Sum'}
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
              {isTamil ? 'கூட்டு வட்டி' : 'Compound Interest'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">{isTamil ? 'விரைவு இலக்குகள்:' : 'Quick Goals:'}</span>
          <button onClick={() => applyPresetGoal(5000, 12, 15)} className="px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold">{isTamil ? '₹1 கோடி இலக்கு (₹5k/மாதம்)' : '₹1 Crore Goal (₹5k/mo)'}</button>
          <button onClick={() => applyPresetGoal(10000, 14, 10)} className="px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold">{isTamil ? '₹50 லட்சம் இலக்கு (₹10k/மாதம்)' : '₹50 Lakh Goal (₹10k/mo)'}</button>
          <button onClick={() => applyPresetGoal(25000, 12, 5)} className="px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold">{isTamil ? '₹20 லட்சம் குறுகிய கால இலக்கு' : '₹20 Lakh Short Term'}</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 bg-slate-800/40 p-6 rounded-3xl border border-slate-800">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-300">
                  {calcMode === 'lumpsum' || calcMode === 'compound' 
                    ? (isTamil ? 'தொடக்க முதலீட்டுத் தொகை (₹)' : 'Initial Investment (₹)') 
                    : (isTamil ? 'மாதாந்திர SIP தொகை (₹)' : 'Monthly SIP Amount (₹)')}
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
                  <label className="text-slate-300">{isTamil ? 'ஆண்டு முதலீட்டு உயர்வு (%)' : 'Annual Step-Up Increase (%)'}</label>
                  <span className="text-amber-400 font-mono text-sm font-black">+{stepUpPercent}% / {isTamil ? 'ஆண்டுக்கு' : 'Year'}</span>
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
                <label className="text-slate-300">{isTamil ? 'எதிர்பார்க்கும் ஆண்டு வட்டி விகிதம் (%)' : 'Expected Annual Return Rate (%)'}</label>
                <span className="text-amber-400 font-mono text-sm font-black">{returnRate}% / {isTamil ? 'ஆண்டுக்கு' : 'Year'}</span>
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
                <label className="text-slate-300">{isTamil ? 'முதலீட்டுக் காலம் (ஆண்டுகள்)' : 'Time Horizon (Years)'}</label>
                <span className="text-amber-400 font-mono text-sm font-black">{timeYears} {isTamil ? 'ஆண்டுகள்' : 'Years'}</span>
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
                <label className="text-slate-400">{isTamil ? 'எதிர்பார்க்கப்படும் பணவீக்கம் (%)' : 'Expected Inflation Rate (%)'}</label>
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

          <div className="space-y-6 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-inner flex flex-col justify-between h-full">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{isTamil ? 'மொத்த முதலீடு' : 'Total Invested'}</span>
                <span className="text-lg font-black font-mono text-white">{formatCurrency(totalInvested)}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{isTamil ? 'மதிப்பிடப்பட்ட வட்டி லாபம்' : 'Estimated Interest Gain'}</span>
                <span className="text-lg font-black font-mono text-emerald-400">+{formatCurrency(estimatedGain)}</span>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">{isTamil ? 'மொத்த வருங்கால செல்வம் மதிப்பு' : 'Total Future Wealth'}</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">{formatCurrency(futureValue)}</div>
                <div className="text-[11px] text-slate-300 font-medium">
                  {isTamil ? `செல்வப் பெருக்கம்: அசல் முதலீட்டைப் போல ${wealthMultiplier} மடங்கு` : `Wealth multiplier: ${wealthMultiplier}x original capital`}
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
                <div className="flex justify-between font-bold">
                  <span>{isTamil ? `உண்மையான வாங்கும் திறன் (பணவீக்கம் @ ${inflationRate}%):` : `Real Purchasing Power (Inflation-Adjusted @ ${inflationRate}%):`}</span>
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
