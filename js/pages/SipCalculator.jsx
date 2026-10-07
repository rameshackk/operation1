import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

function SipCalculator() {
  const { t, language } = useLanguage();
  const [calcMode, setCalcMode] = useState('sip'); // 'sip' | 'lumpsum'
  const [inputAmount, setInputAmount] = useState('150');
  const [lastValidAmount, setLastValidAmount] = useState(150);
  const [timeframe, setTimeframe] = useState('1Y'); // '1Y' | '3Y' | '5Y' | 'SI'
  const [analysisTab, setAnalysisTab] = useState('pie'); // 'pie' | 'statement'
  const [selectedFundName, setSelectedFundName] = useState('SBI Arbitrage Opportunities Fund');

  const isTamil = language === 'ta';

  // Benchmark returns data
  const RETURN_RATES = {
    sip: {
      '1Y': { years: 1, fund: 6.65, bench: 6.62, addBench: 4.28 },
      '3Y': { years: 3, fund: 7.85, bench: 7.30, addBench: 5.95 },
      '5Y': { years: 5, fund: 7.42, bench: 6.98, addBench: 5.82 },
      'SI': { years: 18.5, fund: 7.42, bench: 6.98, addBench: 5.82 }
    },
    lumpsum: {
      '1Y': { years: 1, fund: 6.64, bench: 7.02, addBench: 4.30 },
      '3Y': { years: 3, fund: 7.53, bench: 7.44, addBench: 6.27 },
      '5Y': { years: 5, fund: 6.78, bench: 6.54, addBench: 5.67 },
      'SI': { years: 18.5, fund: 6.54, bench: 5.83, addBench: 5.80 }
    }
  };

  const currentRates = RETURN_RATES[calcMode][timeframe];
  const years = currentRates.years;

  // Validate and parse amount
  const parsedNum = Number(inputAmount);
  const isInvalid = inputAmount === '' || isNaN(parsedNum) || parsedNum < 150 || parsedNum > 1000000;
  const activeAmount = isInvalid ? lastValidAmount : parsedNum;

  const handleAmountChange = (valStr) => {
    setInputAmount(valStr);
    const num = Number(valStr);
    if (!isNaN(num) && num >= 150 && num <= 1000000) {
      setLastValidAmount(num);
    }
  };

  // Calculation formulas
  const calculateMaturity = (rate, amt) => {
    const r = rate / 100;
    if (calcMode === 'sip') {
      const i = r / 12;
      const n = years * 12;
      if (i <= 0) return amt * n;
      return Math.round(amt * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    } else {
      return Math.round(amt * Math.pow(1 + r, years));
    }
  };

  const fundAmount = calculateMaturity(currentRates.fund, activeAmount);
  const benchAmount = calculateMaturity(currentRates.bench, activeAmount);
  const addBenchAmount = calculateMaturity(currentRates.addBench, activeAmount);

  const totalInvested = calcMode === 'sip' ? Math.round(activeAmount * years * 12) : activeAmount;
  const estimatedGain = Math.max(0, fundAmount - totalInvested);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatLakhs = (val) => {
    if (val >= 100000) {
      return '₹ ' + (val / 100000).toFixed(0) + ' Lakh' + (val >= 200000 ? 's' : '');
    }
    return '₹ ' + val.toLocaleString('en-IN');
  };

  const presetAmounts = [150, 500, 1000, 5000, 10000, 25000, 50000, 100000];

  // Pie Chart calculations - Never show 50/50 for zero
  const investedPct = fundAmount > 0 ? Math.min(100, Math.max(1, Math.round((totalInvested / fundAmount) * 100))) : 100;
  const gainPct = Math.max(0, 100 - investedPct);
  const multiplier = totalInvested > 0 ? (fundAmount / totalInvested).toFixed(2) : '1.00';

  // Yearly Breakdown Statement Data
  const yearlySchedule = useMemo(() => {
    const list = [];
    const maxYears = Math.min(Math.max(Math.ceil(years), 1), 30);
    const rFund = currentRates.fund / 100;
    const rBench = currentRates.bench / 100;
    const iFund = rFund / 12;
    const iBench = rBench / 12;

    for (let y = 1; y <= maxYears; y++) {
      const n = y * 12;
      let curInvested = 0;
      let curFund = 0;
      let curBench = 0;

      if (calcMode === 'sip') {
        curInvested = activeAmount * n;
        curFund = iFund > 0 ? Math.round(activeAmount * ((Math.pow(1 + iFund, n) - 1) / iFund) * (1 + iFund)) : curInvested;
        curBench = iBench > 0 ? Math.round(activeAmount * ((Math.pow(1 + iBench, n) - 1) / iBench) * (1 + iBench)) : curInvested;
      } else {
        curInvested = activeAmount;
        curFund = Math.round(activeAmount * Math.pow(1 + rFund, y));
        curBench = Math.round(activeAmount * Math.pow(1 + rBench, y));
      }

      list.push({
        year: y,
        invested: curInvested,
        gain: Math.max(0, curFund - curInvested),
        fundValue: curFund,
        benchValue: curBench,
        multiplier: (curFund / (curInvested || 1)).toFixed(2)
      });
    }
    return list;
  }, [calcMode, activeAmount, years, currentRates]);

  return (
    <section id="calculator" className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0">
      {/* Outer Container with Dark Gradient Theme */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#111C35] to-[#1E293B] rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl p-4 sm:p-6 lg:p-7 text-white transition-all">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              ⚡
            </div>
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-extrabold text-white tracking-tight font-sans">
                {isTamil ? 'முதலீட்டுக் கணிப்பான் & பகுப்பாய்வு' : 'Calculators & In-Depth Analysis'}
              </h2>
              <p className="text-xs sm:text-xs text-slate-300 font-medium font-sans">
                {isTamil ? 'மாதாந்திர SIP / மொத்த முதலீட்டு திட்டமிடல் & விரிவான நிதி வளர்ச்சி அறிக்கை' : 'Interactive SIP & Lumpsum wealth planner with visual asset chart & statement report'}
              </p>
            </div>
          </div>

          {/* Mode Switcher: SIP vs Lumpsum */}
          <div className="inline-flex p-1 bg-slate-900/90 rounded-full border border-slate-700/80 gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setCalcMode('sip')}
              className={'px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ' + (
                calcMode === 'sip'
                  ? 'bg-[#16A34A] text-white shadow-md shadow-green-600/30'
                  : 'text-slate-300 hover:text-white'
              )}
            >
              SIP
            </button>
            <button
              type="button"
              onClick={() => setCalcMode('lumpsum')}
              className={'px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ' + (
                calcMode === 'lumpsum'
                  ? 'bg-[#16A34A] text-white shadow-md shadow-green-600/30'
                  : 'text-slate-300 hover:text-white'
              )}
            >
              Lumpsum
            </button>
          </div>
        </div>

        {/* 2-PART SPLIT GRID: PART 1 (CALCULATION) | PART 2 (CHART & STATEMENT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* ================= PART 1: CALCULATION PART ================= */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-4">
            
            <div>
              {/* Part 1 Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">🧮</span>
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans">
                    {isTamil ? '1. முதலீட்டுக் கணக்கீடு' : '1. Calculation Part'}
                  </h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[#16A34A] dark:text-[#4ade80] font-sans">
                  {calcMode === 'sip' ? 'Monthly SIP' : 'One-Time Lumpsum'}
                </span>
              </div>

              {/* Amount Input & Number Box */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 font-sans">
                  {calcMode === 'sip' ? (isTamil ? 'மாதாந்திர முதலீடு' : 'Monthly Investment') : (isTamil ? 'முதலீட்டு தொகை' : 'Investment Amount')}
                </label>
                <div className={`flex items-center bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-1 transition-all ${isInvalid ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#16A34A]'}`}>
                  <span className="text-slate-500 font-bold text-sm mr-1">₹</span>
                  <input
                    type="number"
                    min="150"
                    max="1000000"
                    step="50"
                    value={inputAmount}
                    aria-label="Monthly Investment Amount in Rupees"
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-20 sm:w-24 bg-transparent text-right font-black text-slate-900 dark:text-white text-sm sm:text-base outline-none font-num"
                  />
                </div>
              </div>

              {/* Inline Validation Error */}
              {isInvalid && (
                <p className="text-xs text-red-500 font-medium mb-2 animate-fadeIn">
                  ⚠️ {isTamil ? 'தொகை ₹150 முதல் ₹10,00,000 வரை இருக்க வேண்டும் (கடைசி சரியான மதிப்பு காட்டப்படுகிறது).' : 'Amount must be between ₹150 and ₹10,00,000 (showing last valid calculation).'}
                </p>
              )}

              {/* Range Slider Track */}
              <div className="mb-3">
                <input
                  type="range"
                  min="150"
                  max="1000000"
                  step="50"
                  value={activeAmount}
                  aria-label="Monthly Investment Amount Slider"
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#15803d]"
                />
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400 mt-1 font-num">
                  <span>₹ 150</span>
                  <span>₹ 10 Lakhs</span>
                </div>
              </div>

              {/* Preset Quick Chips */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {presetAmounts.map((pVal) => (
                  <button
                    key={pVal}
                    type="button"
                    onClick={() => handleAmountChange(String(pVal))}
                    className={'px-2.5 py-1 rounded-lg text-xs font-bold font-num transition-all cursor-pointer ' + (
                      activeAmount === pVal
                        ? 'bg-[#0F172A] dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    )}
                  >
                    {formatLakhs(pVal)}
                  </button>
                ))}
              </div>

              {/* Timeframe Selector Pill Bar */}
              <div className="mb-4">
                <label className="text-xs font-extrabold uppercase text-slate-600 dark:text-slate-400 tracking-wider block mb-1.5 font-sans">
                  {isTamil ? 'முதலீட்டுக் காலம் (Time Horizon)' : 'Time Horizon (Years)'}
                </label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-1 overflow-x-auto">
                  {[
                    { id: '1Y', label: '1 Year' },
                    { id: '3Y', label: '3 Years' },
                    { id: '5Y', label: '5 Years' },
                    { id: 'SI', label: 'Since Inception' }
                  ].map((tItem) => (
                    <button
                      key={tItem.id}
                      type="button"
                      onClick={() => setTimeframe(tItem.id)}
                      className={'flex-1 py-1 px-2 rounded-lg text-xs font-bold font-sans whitespace-nowrap transition-all duration-200 text-center cursor-pointer ' + (
                        timeframe === tItem.id
                          ? 'bg-[#16A34A] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      )}
                    >
                      {tItem.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fund Returns vs Benchmark Comparison List */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 divide-y divide-slate-200/60 dark:divide-slate-700/60">
                {/* Row 1: Selected Fund Name */}
                <div className="pb-2 flex justify-between items-center">
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 font-sans truncate pr-2">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block shrink-0"></span>
                    <span className="truncate">{isTamil ? `${selectedFundName} (SBI ஆர்பிட்ரேஜ்)` : selectedFundName}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-num">
                      {formatCurrency(fundAmount)}
                    </span>
                    <span className="ml-1.5 text-xs font-bold text-[#16A34A] dark:text-[#4ade80] font-num">
                      +{currentRates.fund}%
                    </span>
                  </div>
                </div>

                {/* Row 2: Nifty 50 Arbitrage */}
                <div className="py-2 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-sans">
                    Nifty 50 Arbitrage Index
                  </span>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-num">
                      {formatCurrency(benchAmount)}
                    </span>
                    <span className="ml-1.5 text-xs font-bold text-slate-500 font-num">
                      +{currentRates.bench}%
                    </span>
                  </div>
                </div>

                {/* Row 3: CRISIL 1Y T-Bill */}
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-sans">
                    CRISIL 1 Year T-Bill Index
                  </span>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-num">
                      {formatCurrency(addBenchAmount)}
                    </span>
                    <span className="ml-1.5 text-xs font-bold text-slate-500 font-num">
                      +{currentRates.addBench}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Invested vs Estimated Gain Mini Footer */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-3 flex justify-between items-center text-xs font-sans">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">{isTamil ? 'மொத்த முதலீடு' : 'Total Capital Outlay'}</span>
                <span className="font-black text-slate-900 dark:text-white font-num text-sm">{formatCurrency(totalInvested)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">{isTamil ? 'மதிப்பிடப்பட்ட லாபம்' : 'Estimated Growth'}</span>
                <span className="font-black text-[#16A34A] dark:text-[#4ade80] font-num text-sm">+{formatCurrency(estimatedGain)}</span>
              </div>
            </div>

          </div>


          {/* ================= PART 2: CHART AND STATEMENT PART ================= */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-4">
            
            <div>
              {/* Part 2 Header & Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">📊</span>
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans">
                    {isTamil ? '2. சார்ட் & நிதி அறிக்கை' : '2. Chart & Statement Part'}
                  </h3>
                </div>

                {/* Analysis Subtab Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setAnalysisTab('pie')}
                    className={'px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ' + (
                      analysisTab === 'pie'
                        ? 'bg-white dark:bg-slate-900 text-[#16A34A] dark:text-[#4ade80] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    🍩 {isTamil ? 'பை-சார்ட்' : 'Pie Chart'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalysisTab('statement')}
                    className={'px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ' + (
                      analysisTab === 'statement'
                        ? 'bg-white dark:bg-slate-900 text-[#16A34A] dark:text-[#4ade80] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    📋 {isTamil ? 'அறிக்கை' : 'Statement'}
                  </button>
                </div>
              </div>

              {/* TAB CONTENT */}
              {analysisTab === 'pie' ? (
                <div className="space-y-3 animate-fadeIn">
                  {/* Visual Donut Chart + Legend */}
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200 dark:text-slate-700"
                          strokeWidth="3.8"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#0F172A] dark:text-slate-400 transition-all duration-700"
                          strokeDasharray={investedPct + ', 100'}
                          strokeWidth="3.8"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#16A34A] dark:text-[#4ade80] transition-all duration-700"
                          strokeDasharray={gainPct + ', 100'}
                          strokeDashoffset={'-' + investedPct}
                          strokeWidth="3.8"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      
                      <div className="absolute flex flex-col items-center justify-center text-center p-1">
                        <span className="text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-tight">{isTamil ? 'முதிர்வு' : 'Corpus'}</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-num leading-tight">{formatCurrency(fundAmount)}</span>
                        <span className="text-xs font-bold text-[#16A34A] dark:text-[#4ade80] bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-full mt-0.5 font-num">
                          {multiplier}x
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs font-bold font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0F172A] dark:bg-slate-400"></span>
                        <span className="text-slate-700 dark:text-slate-300">{isTamil ? 'அசல் முதலீடு' : 'Invested'}: {investedPct}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
                        <span className="text-[#16A34A] dark:text-[#4ade80]">{isTamil ? 'வளர்ச்சி லாபம்' : 'Gains'}: {gainPct}%</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Executive Summary Statements */}
                  <div className="space-y-2">
                    {/* Statement 1 */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-xs font-extrabold uppercase text-slate-600 dark:text-slate-400 tracking-wide block font-sans">
                          {isTamil ? '1. அசல் முதலீட்டு தொகை' : '1. Principal Capital'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {calcMode === 'sip' ? `${years * 12} ${isTamil ? 'தவணைகள்' : 'installments'}` : (isTamil ? 'ஒரே முறை முதலீடு' : 'Lumpsum')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 dark:text-white font-num">{formatCurrency(totalInvested)}</span>
                        <span className="block text-xs text-slate-600 dark:text-slate-400 font-num">({investedPct}%)</span>
                      </div>
                    </div>

                    {/* Statement 2 */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-xs font-extrabold uppercase text-slate-600 dark:text-slate-400 tracking-wide block font-sans">
                          {isTamil ? '2. வளர்ச்சி லாபம்' : '2. Compound Growth'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          @{currentRates.fund}% CAGR
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#16A34A] dark:text-[#4ade80] font-num">+{formatCurrency(estimatedGain)}</span>
                        <span className="block text-xs text-[#16A34A] dark:text-[#4ade80] font-num">({gainPct}%)</span>
                      </div>
                    </div>

                    {/* Statement 3 Banner */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white border border-slate-800 flex justify-between items-center shadow-md">
                      <div>
                        <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wide block font-sans">
                          {isTamil ? '3. எதிர்பார்க்கும் முதிர்வு நிதி' : '3. Projected Total Corpus'}
                        </span>
                        <span className="text-xs text-slate-300 font-medium">
                          {timeframe} {isTamil ? 'கால முடிவில்' : 'horizon value'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm sm:text-base font-extrabold text-white font-num">{formatCurrency(fundAmount)}</span>
                        <span className="block text-xs font-bold text-emerald-300 font-num">
                          +{((estimatedGain / (totalInvested || 1)) * 100).toFixed(1)}% {isTamil ? 'வளர்ச்சி' : 'net return'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW 2: COMPACT YEARLY FINANCIAL STATEMENT TABLE */
                <div className="overflow-x-auto max-h-[260px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner animate-fadeIn">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-700 font-sans">
                      <tr>
                        <th className="p-2">{isTamil ? 'ஆண்டு' : 'Period'}</th>
                        <th className="p-2">{isTamil ? 'அசல்' : 'Capital'}</th>
                        <th className="p-2">{isTamil ? 'லாபம்' : 'Growth'}</th>
                        <th className="p-2 truncate">{selectedFundName}</th>
                        <th className="p-2">{isTamil ? 'மடங்கு' : 'Multiple'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-num">
                      {yearlySchedule.map((d) => (
                        <tr key={d.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="p-2 font-bold text-slate-900 dark:text-white font-sans">Y{d.year}</td>
                          <td className="p-2 text-slate-600 dark:text-slate-400">{formatCurrency(d.invested)}</td>
                          <td className="p-2 text-[#16A34A] dark:text-[#4ade80] font-semibold">+{formatCurrency(d.gain)}</td>
                          <td className="p-2 font-bold text-slate-900 dark:text-white">{formatCurrency(d.fundValue)}</td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                              {d.multiplier}x
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Disclaimer note */}
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-tight pt-1">
              **Past performance may or may not be sustained in future. For performance in SEBI format refer scheme returns.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default SipCalculator;
export { SipCalculator };

