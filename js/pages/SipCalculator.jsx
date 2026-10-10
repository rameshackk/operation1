import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

// Indian Number & Currency Formatter Helper
function formatINR(val, isLakhCr = false) {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const num = Math.round(val);
  if (isLakhCr) {
    if (Math.abs(num) >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(num) >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
  }
  return '₹' + num.toLocaleString('en-IN');
}

function parseCleanNumber(valStr, fallback = 0) {
  if (typeof valStr === 'number') return isNaN(valStr) ? fallback : valStr;
  const clean = String(valStr).replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? fallback : num;
}

export default function SipCalculator({ initialTab, isEmbedded = false }) {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  // Active Tab State (with localStorage memory)
  const [activeTab, setActiveTab] = useState(() => {
    if (initialTab) return initialTab;
    try {
      const saved = localStorage.getItem('muthaleetu_calc_tab');
      if (saved && ['quick', 'stepup', 'quiz'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'quick';
  });

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    try {
      localStorage.setItem('muthaleetu_calc_tab', tabKey);
    } catch (e) {}
  };

  // Synchronize initialTab if provided as prop
  useEffect(() => {
    if (initialTab && ['quick', 'stepup', 'quiz'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <section className="calc-light w-full py-6 sm:py-10">
      <div className="w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6 sm:space-y-8">
        
        {/* ================= 1. PAGE HEADER ================= */}
        {!isEmbedded && (
          <div className="space-y-4 pb-2 border-b border-[#E6E3F0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-[28px] font-bold text-[#17142E] tracking-tight">
                  {isTa ? 'கணக்கீட்டுக் கருவிகள்' : 'Calculators'}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#5B5875]">
                  {isTa
                    ? 'SIP மற்றும் மொத்த முதலீட்டுக்கான உடனடி கணிப்புகள்.'
                    : 'Quick estimates for SIPs and lumpsums.'}
                </p>
              </div>
            </div>

            {/* Page Tabs */}
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pt-2">
              <button
                type="button"
                onClick={() => handleTabChange('quick')}
                className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  activeTab === 'quick'
                    ? 'text-[#17142E] border-[#4F46E5]'
                    : 'text-[#5B5875] border-transparent hover:text-[#17142E]'
                }`}
              >
                {isTa ? 'விரைவு கால்குலேட்டர்' : 'Quick Calculator'}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('stepup')}
                className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  activeTab === 'stepup'
                    ? 'text-[#17142E] border-[#4F46E5]'
                    : 'text-[#5B5875] border-transparent hover:text-[#17142E]'
                }`}
              >
                {isTa ? 'SIP ஸ்டெப்-அப் கால்குலேட்டர்' : 'SIP Step-up Calculator'}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('quiz')}
                className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'text-[#17142E] border-[#4F46E5]'
                    : 'text-[#5B5875] border-transparent hover:text-[#17142E]'
                }`}
              >
                {isTa ? 'ரிஸ்க் சுயவிவர வினாடிவினா' : 'Risk Profile Quiz'}
              </button>
            </div>
          </div>
        )}

        {/* ================= 2. TAB CONTENTS ================= */}
        {activeTab === 'quick' && <QuickCalculatorTab isTa={isTa} isEmbedded={isEmbedded} />}
        {activeTab === 'stepup' && <StepUpCalculatorTab isTa={isTa} />}
        {activeTab === 'quiz' && <RiskProfileQuizTab isTa={isTa} />}

      </div>
    </section>
  );
}

/* ==========================================================================
   TAB 1: QUICK CALCULATOR
   ========================================================================== */
function QuickCalculatorTab({ isTa, isEmbedded }) {
  // Mode: 'sip' | 'lumpsum'
  const [mode, setMode] = useState('sip');

  // Frequency in SIP: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'half_yearly' | 'yearly'
  const [freq, setFreq] = useState('monthly');

  // Inputs
  const [amount, setAmount] = useState(10000);
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);
  const [months, setMonths] = useState(0);

  // Step-up in SIP
  const [isStepUp, setIsStepUp] = useState(false);
  const [stepUpBy, setStepUpBy] = useState('percent'); // 'percent' | 'amount'
  const [stepUpFreq, setStepUpFreq] = useState('yearly'); // 'yearly' | 'half_yearly'
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [stepUpAmount, setStepUpAmount] = useState(1000);

  // Sub-tabs: 'summary' | 'breakdown'
  const [subTab, setSubTab] = useState('summary');

  // Reset to defaults
  const handleReset = () => {
    setMode('sip');
    setFreq('monthly');
    setAmount(10000);
    setLumpsumAmount(100000);
    setAnnualRate(12);
    setYears(10);
    setMonths(0);
    setIsStepUp(false);
    setStepUpBy('percent');
    setStepUpFreq('yearly');
    setStepUpPercent(10);
    setStepUpAmount(1000);
    setSubTab('summary');
  };

  // Periods per year
  const periodsPerYear = useMemo(() => {
    switch (freq) {
      case 'daily': return 365;
      case 'weekly': return 52;
      case 'quarterly': return 4;
      case 'half_yearly': return 2;
      case 'yearly': return 1;
      case 'monthly':
      default: return 12;
    }
  }, [freq]);

  // Frequency Label for Input 2
  const frequencyLabel = useMemo(() => {
    if (mode === 'lumpsum') return isTa ? 'மொத்த முதலீட்டுத் தொகை (₹)' : 'Lumpsum amount (₹)';
    switch (freq) {
      case 'daily': return isTa ? 'தினசரி முதலீடு (₹)' : 'Daily investment (₹)';
      case 'weekly': return isTa ? 'வாராந்திர முதலீடு (₹)' : 'Weekly investment (₹)';
      case 'quarterly': return isTa ? 'காலாண்டு முதலீடு (₹)' : 'Quarterly investment (₹)';
      case 'half_yearly': return isTa ? 'அரையாண்டு முதலீடு (₹)' : 'Half yearly investment (₹)';
      case 'yearly': return isTa ? 'ஆண்டு முதலீடு (₹)' : 'Yearly investment (₹)';
      case 'monthly':
      default: return isTa ? 'மாதாந்திர முதலீடு (₹)' : 'Monthly investment (₹)';
    }
  }, [freq, mode, isTa]);

  // Calculation Engine
  const calcResult = useMemo(() => {
    const totalYears = years + months / 12;
    if (totalYears <= 0 || annualRate <= 0) {
      return { totalInvested: 0, estReturns: 0, totalValue: 0, donutReturnsPercent: 0, yearlyBreakdown: [] };
    }

    if (mode === 'lumpsum') {
      const L = lumpsumAmount;
      const FV = L * Math.pow(1 + annualRate / 100, totalYears);
      const totalInvested = L;
      const totalValue = Math.round(FV);
      const estReturns = Math.max(0, totalValue - totalInvested);
      const donutReturnsPercent = totalValue > 0 ? Math.round((estReturns / totalValue) * 100) : 0;

      // Yearly breakdown for Lumpsum
      const yearlyBreakdown = [];
      const wholeYears = Math.ceil(totalYears);
      for (let y = 1; y <= wholeYears; y++) {
        const curY = Math.min(y, totalYears);
        const curFV = Math.round(L * Math.pow(1 + annualRate / 100, curY));
        const prevFV = y === 1 ? L : Math.round(L * Math.pow(1 + annualRate / 100, y - 1));
        const returnThisYear = Math.max(0, curFV - prevFV);
        yearlyBreakdown.push({
          year: y,
          periodicAmount: 0,
          investedThisYear: y === 1 ? L : 0,
          returnEarned: returnThisYear,
          cumulativeInvested: L,
          balanceEnd: curFV
        });
      }

      return { totalInvested, estReturns, totalValue, donutReturnsPercent, yearlyBreakdown };
    }

    // SIP Mode
    const n = periodsPerYear;
    const r = Math.pow(1 + annualRate / 100, 1 / n) - 1; // Effective periodic rate
    const totalPeriods = Math.round(n * totalYears);

    if (!isStepUp) {
      // Flat SIP Annuity Due Formula:
      // FV = P * [((1+r)^N - 1) / r] * (1+r)
      const P = amount;
      const FV = r > 0 ? P * ((Math.pow(1 + r, totalPeriods) - 1) / r) * (1 + r) : P * totalPeriods;
      const totalInvested = Math.round(P * totalPeriods);
      const totalValue = Math.round(FV);
      const estReturns = Math.max(0, totalValue - totalInvested);
      const donutReturnsPercent = totalValue > 0 ? Math.round((estReturns / totalValue) * 100) : 0;

      // Yearly breakdown
      const yearlyBreakdown = [];
      const wholeYears = Math.ceil(totalYears);
      let cumInvested = 0;
      for (let y = 1; y <= wholeYears; y++) {
        const periodsInYear = y === wholeYears && totalPeriods % n !== 0 ? totalPeriods % n : n;
        const investedThisYear = P * periodsInYear;
        cumInvested += investedThisYear;
        const curPeriods = Math.min(y * n, totalPeriods);
        const curFV = Math.round(r > 0 ? P * ((Math.pow(1 + r, curPeriods) - 1) / r) * (1 + r) : P * curPeriods);
        const prevPeriods = (y - 1) * n;
        const prevFV = prevPeriods > 0 ? Math.round(r > 0 ? P * ((Math.pow(1 + r, prevPeriods) - 1) / r) * (1 + r) : P * prevPeriods) : 0;
        const returnEarned = Math.max(0, curFV - (prevFV + investedThisYear));

        yearlyBreakdown.push({
          year: y,
          periodicAmount: P,
          investedThisYear,
          returnEarned,
          cumulativeInvested: cumInvested,
          balanceEnd: curFV
        });
      }

      return { totalInvested, estReturns, totalValue, donutReturnsPercent, yearlyBreakdown };
    }

    // Step-up SIP simulation
    const periodsPerStep = stepUpFreq === 'half_yearly' ? Math.max(1, Math.floor(n / 2)) : n;
    let totalInvested = 0;
    let totalFV = 0;
    const yearlyBreakdown = [];
    const wholeYears = Math.ceil(totalYears);

    // Period by period evaluation
    const paymentSchedule = [];
    for (let t = 0; t < totalPeriods; t++) {
      const stepCount = Math.floor(t / periodsPerStep);
      let P_t = amount;
      if (stepUpBy === 'percent') {
        P_t = amount * Math.pow(1 + stepUpPercent / 100, stepCount);
      } else {
        P_t = amount + stepCount * stepUpAmount;
      }
      totalInvested += P_t;
      totalFV += P_t * Math.pow(1 + r, totalPeriods - t);
      paymentSchedule.push(P_t);
    }

    let runningInvested = 0;
    for (let y = 1; y <= wholeYears; y++) {
      const startIdx = (y - 1) * n;
      const endIdx = Math.min(y * n, totalPeriods);
      let investedThisYear = 0;
      for (let i = startIdx; i < endIdx; i++) {
        investedThisYear += paymentSchedule[i] || 0;
      }
      runningInvested += investedThisYear;

      // Cumulative FV up to end of year y
      let curFV = 0;
      for (let i = 0; i < endIdx; i++) {
        curFV += paymentSchedule[i] * Math.pow(1 + r, endIdx - i);
      }

      // FV up to start of year
      let prevFV = 0;
      for (let i = 0; i < startIdx; i++) {
        prevFV += paymentSchedule[i] * Math.pow(1 + r, startIdx - i);
      }

      const returnEarned = Math.max(0, Math.round(curFV - (prevFV + investedThisYear)));

      yearlyBreakdown.push({
        year: y,
        periodicAmount: Math.round(paymentSchedule[startIdx] || amount),
        investedThisYear: Math.round(investedThisYear),
        returnEarned,
        cumulativeInvested: Math.round(runningInvested),
        balanceEnd: Math.round(curFV)
      });
    }

    const roundedInvested = Math.round(totalInvested);
    const roundedTotal = Math.round(totalFV);
    const estReturns = Math.max(0, roundedTotal - roundedInvested);
    const donutReturnsPercent = roundedTotal > 0 ? Math.round((estReturns / roundedTotal) * 100) : 0;

    return { totalInvested: roundedInvested, estReturns, totalValue: roundedTotal, donutReturnsPercent, yearlyBreakdown };
  }, [mode, freq, amount, lumpsumAmount, annualRate, years, months, isStepUp, stepUpBy, stepUpFreq, stepUpPercent, stepUpAmount, periodsPerYear]);

  // Total months slider handling
  const totalMonths = years * 12 + months;
  const handleSliderMonthsChange = (val) => {
    const total = Math.max(1, Math.min(480, Number(val)));
    setYears(Math.floor(total / 12));
    setMonths(total % 12);
  };

  return (
    <div className="calc-card p-5 sm:p-7 space-y-6">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E3F0]">
        <div>
          <h2 className="text-lg font-bold text-[#17142E]">
            {isTa ? 'விரைவு கால்குலேட்டர்' : 'Quick Calculator'}
          </h2>
          <p className="text-xs text-[#5B5875] mt-0.5">
            {isTa
              ? 'சாதாரண அல்லது ஸ்டெப்-அப் SIP, அல்லது ஒரு முறை மொத்த முதலீட்டிற்கான விரைவு கணிப்பு.'
              : 'A quick estimate for a flat or step-up SIP, or a one-time lumpsum.'}
          </p>
        </div>

        {/* Mode Toggle Chips */}
        <div className="flex items-center p-1 bg-[#F3F1FA] rounded-full self-start sm:self-auto border border-[#E6E3F0]">
          <button
            type="button"
            onClick={() => setMode('sip')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'sip'
                ? 'bg-[#4F46E5] text-white shadow-xs'
                : 'text-[#5B5875] hover:bg-[#E9E6F5]'
            }`}
          >
            SIP
          </button>
          <button
            type="button"
            onClick={() => setMode('lumpsum')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'lumpsum'
                ? 'bg-[#4F46E5] text-white shadow-xs'
                : 'text-[#5B5875] hover:bg-[#E9E6F5]'
            }`}
          >
            {isTa ? 'மொத்த முதலீடு (Lumpsum)' : 'Lumpsum'}
          </button>
        </div>
      </div>

      {/* Main 5 / 7 Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT COLUMN: INPUTS (5 Cols) ================= */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. Frequency Chips (SIP mode only) */}
          {mode === 'sip' && (
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#5B5875]">
                {isTa ? 'முதலீட்டு இடைவெளி' : 'Investment frequency'}
              </label>
              <div className="flex flex-wrap gap-1.5 p-1 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0]">
                {[
                  { id: 'daily', en: 'Daily', ta: 'தினசரி' },
                  { id: 'weekly', en: 'Weekly', ta: 'வாராந்திர' },
                  { id: 'monthly', en: 'Monthly', ta: 'மாதாந்திர' },
                  { id: 'quarterly', en: 'Quarterly', ta: 'காலாண்டு' },
                  { id: 'half_yearly', en: 'Half Yearly', ta: 'அரையாண்டு' },
                  { id: 'yearly', en: 'Yearly', ta: 'வருடாந்திர' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFreq(item.id)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      freq === item.id
                        ? 'bg-[#4F46E5] text-white shadow-xs'
                        : 'text-[#5B5875] hover:bg-[#E9E6F5]'
                    }`}
                  >
                    {isTa ? item.ta : item.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Amount Input + Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#5B5875]">
                {frequencyLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={mode === 'sip' ? amount.toLocaleString('en-IN') : lumpsumAmount.toLocaleString('en-IN')}
                  onChange={(e) => {
                    const clean = parseCleanNumber(e.target.value, 0);
                    if (mode === 'sip') {
                      setAmount(clean);
                    } else {
                      setLumpsumAmount(clean);
                    }
                  }}
                  className="calc-input w-36 px-3 text-sm"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8BA6]">
                  ₹
                </span>
              </div>
            </div>

            {mode === 'sip' ? (
              <input
                type="range"
                min="500"
                max="2500000"
                step="500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="calc-range"
              />
            ) : (
              <input
                type="range"
                min="10000"
                max="100000000"
                step="10000"
                value={lumpsumAmount}
                onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                className="calc-range"
              />
            )}
            <div className="flex justify-between text-[11px] text-[#8E8BA6] font-medium">
              <span>{mode === 'sip' ? '₹500' : '₹10,000'}</span>
              <span>{mode === 'sip' ? '₹25 L' : '₹10 Cr'}</span>
            </div>
          </div>

          {/* 3. Expected Return Rate (%) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#5B5875]">
                {isTa ? 'எதிர்பார்க்கப்படும் ஆண்டு வருமானம் (%)' : 'Expected return rate p.a. (%)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="30"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value) || 1)}
                  className="calc-input w-24 pr-7 px-3 text-sm"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8BA6]">
                  %
                </span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="calc-range"
            />
            <div className="flex justify-between text-[11px] text-[#8E8BA6] font-medium">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* 4. Time Period: Years + Months */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#5B5875]">
                {isTa ? 'முதலீட்டுக் காலம்' : 'Time period'}
              </label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={years}
                    onChange={(e) => setYears(Math.max(0, Math.min(40, Number(e.target.value) || 0)))}
                    className="calc-input w-20 pr-7 px-2 text-sm"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8BA6]">
                    {isTa ? 'ஆ' : 'yrs'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={months}
                    onChange={(e) => setMonths(Math.max(0, Math.min(11, Number(e.target.value) || 0)))}
                    className="calc-input w-18 pr-7 px-2 text-sm"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8BA6]">
                    {isTa ? 'மா' : 'mo'}
                  </span>
                </div>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="480"
              step="1"
              value={totalMonths}
              onChange={(e) => handleSliderMonthsChange(e.target.value)}
              className="calc-range"
            />
            <div className="flex justify-between text-[11px] text-[#8E8BA6] font-medium">
              <span>1 {isTa ? 'மாதம்' : 'mo'}</span>
              <span>40 {isTa ? 'ஆண்டுகள்' : 'yrs'} (480 {isTa ? 'மாதங்கள்' : 'mo'})</span>
            </div>
          </div>

          {/* 5. Step-up Option (SIP Mode Only) */}
          {mode === 'sip' && (
            <div className="p-4 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17142E]">
                  {isTa ? 'SIP தொகையை படிப்படியாக அதிகரிக்கவா (Step-up)?' : 'Step-up the SIP?'}
                </span>
                <div className="flex items-center p-0.5 bg-white rounded-full border border-[#E6E3F0]">
                  <button
                    type="button"
                    onClick={() => setIsStepUp(false)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      !isStepUp
                        ? 'bg-[#4F46E5] text-white shadow-xs'
                        : 'text-[#5B5875] hover:bg-[#F3F1FA]'
                    }`}
                  >
                    {isTa ? 'இல்லை' : 'No'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStepUp(true)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isStepUp
                        ? 'bg-[#4F46E5] text-white shadow-xs'
                        : 'text-[#5B5875] hover:bg-[#F3F1FA]'
                    }`}
                  >
                    {isTa ? 'ஆம்' : 'Yes'}
                  </button>
                </div>
              </div>

              {isStepUp && (
                <div className="space-y-3 pt-2 border-t border-[#E6E3F0]">
                  {/* Step-up By: % or Amount */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[#5B5875]">
                      {isTa ? 'அதிகரிக்கும் முறை:' : 'Step-up by:'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setStepUpBy('percent')}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                          stepUpBy === 'percent'
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-white text-[#5B5875] border border-[#E6E3F0]'
                        }`}
                      >
                        {isTa ? 'சதவீதம் (%)' : 'Percentage'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStepUpBy('amount')}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                          stepUpBy === 'amount'
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-white text-[#5B5875] border border-[#E6E3F0]'
                        }`}
                      >
                        {isTa ? 'தொகை (₹)' : 'Amount (₹)'}
                      </button>
                    </div>
                  </div>

                  {/* Step-up Frequency: Yearly / Half Yearly */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[#5B5875]">
                      {isTa ? 'அதிகரிக்கும் காலம்:' : 'Step-up every:'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setStepUpFreq('yearly')}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                          stepUpFreq === 'yearly'
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-white text-[#5B5875] border border-[#E6E3F0]'
                        }`}
                      >
                        {isTa ? 'ஆண்டுதோறும்' : 'Yearly'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStepUpFreq('half_yearly')}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                          stepUpFreq === 'half_yearly'
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-white text-[#5B5875] border border-[#E6E3F0]'
                        }`}
                      >
                        {isTa ? 'அரையாண்டு' : 'Half yearly'}
                      </button>
                    </div>
                  </div>

                  {/* Increase Value Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#5B5875]">
                      <span>{isTa ? 'அதிகரிக்கும் அளவு:' : 'Yearly increase:'}</span>
                      <span className="font-bold text-[#17142E]">
                        {stepUpBy === 'percent' ? `${stepUpPercent}%` : formatINR(stepUpAmount)}
                      </span>
                    </div>
                    {stepUpBy === 'percent' ? (
                      <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={stepUpPercent}
                        onChange={(e) => setStepUpPercent(Number(e.target.value))}
                        className="calc-range"
                      />
                    ) : (
                      <input
                        type="range"
                        min="500"
                        max="50000"
                        step="500"
                        value={stepUpAmount}
                        onChange={(e) => setStepUpAmount(Number(e.target.value))}
                        className="calc-range"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ghost Clear Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white border border-[#E6E3F0] text-xs font-bold text-[#5B5875] hover:text-[#17142E] hover:border-[#4F46E5] transition-all cursor-pointer shadow-2xs"
            >
              {isTa ? 'மீட்டமைக்க (Clear)' : 'Clear / Reset'}
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: OUTPUTS (7 Cols) ================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 3 Stat Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1">
              <span className="text-xs font-semibold text-[#5B5875] uppercase tracking-wider block">
                {isTa ? 'முதலீடு செய்த தொகை' : 'Invested amount'}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#17142E] tabular-nums block">
                {formatINR(calcResult.totalInvested)}
              </span>
            </div>

            <div className="p-4 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1">
              <span className="text-xs font-semibold text-[#5B5875] uppercase tracking-wider block">
                {isTa ? 'மதிப்பிடப்பட்ட வருமானம்' : 'Est. returns'}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#0F9D58] tabular-nums block">
                {formatINR(calcResult.estReturns)}
              </span>
            </div>

            <div className="p-4 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1">
              <span className="text-xs font-semibold text-[#5B5875] uppercase tracking-wider block">
                {isTa ? 'மொத்த மதிப்பு' : 'Total value'}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#4F46E5] tabular-nums block">
                {formatINR(calcResult.totalValue)}
              </span>
            </div>
          </div>

          {/* Donut & Legend Display */}
          <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#E6E3F0] flex flex-col sm:flex-row items-center justify-around gap-6 shadow-xs">
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring (Invested Base: #C7C4F5) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#C7C4F5"
                  strokeWidth="4.5"
                />
                {/* Returns Arc: #4F46E5 */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="4.5"
                  strokeDasharray={`${Math.min(100, Math.max(0, calcResult.donutReturnsPercent * 0.88))} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              {/* Centre Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                <span className="text-[11px] font-semibold text-[#5B5875]">
                  {isTa ? 'வருமானம்' : 'Returns'}
                </span>
                <span className="text-lg font-black text-[#17142E] tabular-nums">
                  {calcResult.donutReturnsPercent}%
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded bg-[#C7C4F5] shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-[#5B5875]">
                    {isTa ? 'அசல் முதலீடு:' : 'Invested:'}
                  </span>{' '}
                  <span className="font-bold text-[#17142E]">
                    {formatINR(calcResult.totalInvested)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded bg-[#4F46E5] shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-[#5B5875]">
                    {isTa ? 'ஈட்டிய லாபம்:' : 'Returns:'}
                  </span>{' '}
                  <span className="font-bold text-[#0F9D58]">
                    {formatINR(calcResult.estReturns)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-tabs: Summary vs Return Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-[#E6E3F0]">
              <button
                type="button"
                onClick={() => setSubTab('summary')}
                className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  subTab === 'summary'
                    ? 'text-[#17142E] border-[#4F46E5]'
                    : 'text-[#5B5875] border-transparent hover:text-[#17142E]'
                }`}
              >
                {isTa ? 'சுருக்கம் (Summary Chart)' : 'Summary'}
              </button>
              <button
                type="button"
                onClick={() => setSubTab('breakdown')}
                className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  subTab === 'breakdown'
                    ? 'text-[#17142E] border-[#4F46E5]'
                    : 'text-[#5B5875] border-transparent hover:text-[#17142E]'
                }`}
              >
                {isTa ? 'ஆண்டு வாரியான விவரம்' : 'Return breakdown, year on year'}
              </button>
            </div>

            {/* Sub-Tab 1: Stacked Area Growth Chart */}
            {subTab === 'summary' && (
              <QuickStackedAreaChart
                data={calcResult.yearlyBreakdown}
                isTa={isTa}
              />
            )}

            {/* Sub-Tab 2: Year on Year Table */}
            {subTab === 'breakdown' && (
              <div className="overflow-x-auto rounded-xl border border-[#E6E3F0]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F3F1FA] text-[11px] uppercase font-bold text-[#5B5875] border-b border-[#E6E3F0]">
                    <tr>
                      <th className="px-3 py-2.5 whitespace-nowrap">{isTa ? 'ஆண்டு' : 'YEAR'}</th>
                      <th className="px-3 py-2.5 whitespace-nowrap text-right">{mode === 'lumpsum' ? (isTa ? 'வகை' : 'TYPE') : (isTa ? 'முதலீட்டுத் தொகை' : 'PERIODIC AMOUNT')}</th>
                      <th className="px-3 py-2.5 whitespace-nowrap text-right">{isTa ? 'இந்த ஆண்டு முதலீடு' : 'INVESTED THIS YEAR'}</th>
                      <th className="px-3 py-2.5 whitespace-nowrap text-right">{isTa ? 'வருமானம்' : 'RETURN EARNED'}</th>
                      <th className="px-3 py-2.5 whitespace-nowrap text-right">{isTa ? 'மொத்த முதலீடு' : 'CUMULATIVE INVESTED'}</th>
                      <th className="px-3 py-2.5 whitespace-nowrap text-right">{isTa ? 'ஆண்டு இறுதி மதிப்பு' : 'BALANCE AT YEAR END'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E3F0]">
                    {calcResult.yearlyBreakdown.map((row, idx) => (
                      <tr key={row.year} className={idx % 2 === 1 ? 'bg-[#FBFAFE]' : 'bg-white'}>
                        <td className="px-3 py-2.5 font-bold text-[#17142E] whitespace-nowrap">
                          {isTa ? `${row.year}-ம் ஆண்டு` : `Year ${row.year}`}
                        </td>
                        <td className="px-3 py-2.5 text-right font-medium text-[#5B5875] whitespace-nowrap">
                          {mode === 'lumpsum' ? (isTa ? 'மொத்த முதலீடு' : 'Lumpsum') : formatINR(row.periodicAmount)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-medium text-[#17142E] whitespace-nowrap">
                          {formatINR(row.investedThisYear)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-[#0F9D58] whitespace-nowrap">
                          +{formatINR(row.returnEarned)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-medium text-[#5B5875] whitespace-nowrap">
                          {formatINR(row.cumulativeInvested)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-[#4F46E5] whitespace-nowrap">
                          {formatINR(row.balanceEnd)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footnote */}
          <p className="text-[12px] text-[#8E8BA6] leading-relaxed pt-2">
            {isTa
              ? 'விளக்கக் காட்சி மட்டுமே. கணக்கீடு நிலையான வருமான விகிதத்தில் செய்யப்பட்டுள்ளது. மியூச்சுவல் ஃபண்ட் முதலீடுகள் சந்தை அபாயங்களுக்கு உட்பட்டவை, திட்டம் தொடர்பான அனைத்து ஆவணங்களையும் கவனமாகப் படிக்கவும்.'
              : 'Illustration only, at an assumed constant rate of return. Mutual fund investments are subject to market risks, read all scheme related documents carefully.'}
          </p>
        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   CHART COMPONENT FOR TAB 1: STACKED AREA CHART
   ========================================================================== */
function QuickStackedAreaChart({ data, isTa }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 bg-white rounded-xl border border-[#E6E3F0] flex items-center justify-center text-xs text-[#8E8BA6]">
        {isTa ? 'விவரங்கள் இல்லை' : 'No chart data'}
      </div>
    );
  }

  const [hoverIndex, setHoverIndex] = useState(null);

  const maxVal = Math.max(...data.map(d => d.balanceEnd), 1000);
  const width = 600;
  const height = 220;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const points = data.map((d, i) => {
    const x = padLeft + (i / Math.max(1, data.length - 1)) * plotW;
    const yTotal = padTop + plotH - (d.balanceEnd / maxVal) * plotH;
    const yInvested = padTop + plotH - (d.cumulativeInvested / maxVal) * plotH;
    return { x, yTotal, yInvested, ...d };
  });

  // Area path for Total Balance (Returns on top: #4F46E5 with opacity)
  const totalAreaPath = `
    M ${points[0].x} ${padTop + plotH}
    ${points.map(p => `L ${p.x} ${p.yTotal}`).join(' ')}
    L ${points[points.length - 1].x} ${padTop + plotH}
    Z
  `;

  // Area path for Invested (Base: #C7C4F5)
  const investedAreaPath = `
    M ${points[0].x} ${padTop + plotH}
    ${points.map(p => `L ${p.x} ${p.yInvested}`).join(' ')}
    L ${points[points.length - 1].x} ${padTop + plotH}
    Z
  `;

  const hoveredItem = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="relative bg-white rounded-xl border border-[#E6E3F0] p-3 sm:p-4 shadow-xs">
      <svg
        className="w-full h-auto overflow-visible select-none"
        viewBox={`0 0 ${width} ${height}`}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Horizontal Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
          const y = padTop + plotH - frac * plotH;
          const val = maxVal * frac;
          return (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#EEEDF4"
                strokeWidth="1"
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] fill-[#8E8BA6] font-medium"
              >
                {formatINR(val, true)}
              </text>
            </g>
          );
        })}

        {/* Stacked Area Fills */}
        <path d={totalAreaPath} fill="#4F46E5" fillOpacity="0.85" />
        <path d={investedAreaPath} fill="#C7C4F5" fillOpacity="0.9" />

        {/* Boundary Lines */}
        <polyline
          fill="none"
          stroke="#4F46E5"
          strokeWidth="2"
          points={points.map(p => `${p.x},${p.yTotal}`).join(' ')}
        />
        <polyline
          fill="none"
          stroke="#7A74D4"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          points={points.map(p => `${p.x},${p.yInvested}`).join(' ')}
        />

        {/* X Axis Labels (Y2, Y4, Y6...) */}
        {points.map((p, idx) => {
          const isEvenYear = p.year % 2 === 0 || p.year === 1 || p.year === data.length;
          if (!isEvenYear && data.length > 8) return null;
          return (
            <text
              key={p.year}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[10px] fill-[#8E8BA6] font-bold"
            >
              Y{p.year}
            </text>
          );
        })}

        {/* Interactive Hover Hitboxes */}
        {points.map((p, idx) => (
          <rect
            key={`hit-${idx}`}
            x={p.x - (plotW / data.length) / 2}
            y={padTop}
            width={plotW / data.length}
            height={plotH}
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => setHoverIndex(idx)}
            onTouchStart={() => setHoverIndex(idx)}
          />
        ))}

        {/* Hover Highlight Marker */}
        {hoveredItem && (
          <g>
            <line
              x1={hoveredItem.x}
              y1={padTop}
              x2={hoveredItem.x}
              y2={padTop + plotH}
              stroke="#17142E"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle cx={hoveredItem.x} cy={hoveredItem.yTotal} r="4" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx={hoveredItem.x} cy={hoveredItem.yInvested} r="4" fill="#C7C4F5" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Floating Tooltip Card */}
      {hoveredItem && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-[#E6E3F0] px-3.5 py-2 rounded-xl shadow-md text-xs pointer-events-none z-10 flex items-center gap-4"
        >
          <span className="font-bold text-[#17142E]">
            {isTa ? `${hoveredItem.year}-ம் ஆண்டு` : `Year ${hoveredItem.year}`}
          </span>
          <div>
            <span className="text-[#5B5875] text-[11px] block">{isTa ? 'முதலீடு' : 'Invested'}:</span>
            <span className="font-bold text-[#17142E]">{formatINR(hoveredItem.cumulativeInvested)}</span>
          </div>
          <div>
            <span className="text-[#5B5875] text-[11px] block">{isTa ? 'மொத்த மதிப்பு' : 'Total'}:</span>
            <span className="font-extrabold text-[#4F46E5]">{formatINR(hoveredItem.balanceEnd)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   TAB 2: SIP STEP-UP CALCULATOR
   ========================================================================== */
function StepUpCalculatorTab({ isTa }) {
  const [monthlySip, setMonthlySip] = useState(10000);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [assumedReturn, setAssumedReturn] = useState(12);
  const [periodYears, setPeriodYears] = useState(15);
  const [lumpsum, setLumpsum] = useState(0);

  // Calculation for Step-up Calculator
  // Standard simple monthly rate: r = (assumedReturn / 100) / 12
  const outcome = useMemo(() => {
    const N = periodYears * 12;
    const r = (assumedReturn / 100) / 12;

    let totalInvested = 0;
    let totalFV = 0;
    const yearlyData = [];

    // Simulate month by month
    const monthlySchedule = [];
    for (let t = 0; t < N; t++) {
      const yearIdx = Math.floor(t / 12);
      const P_t = monthlySip * Math.pow(1 + stepUpPercent / 100, yearIdx);
      totalInvested += P_t;
      totalFV += P_t * Math.pow(1 + r, N - t);
      monthlySchedule.push(P_t);
    }

    // Add Lumpsum if present
    if (lumpsum > 0) {
      totalInvested += lumpsum;
      totalFV += lumpsum * Math.pow(1 + assumedReturn / 100, periodYears);
    }

    // Year by Year plot data
    let runningInvested = lumpsum;
    for (let y = 1; y <= periodYears; y++) {
      const endMonth = y * 12;
      let curInvested = lumpsum;
      let curFV = lumpsum > 0 ? lumpsum * Math.pow(1 + assumedReturn / 100, y) : 0;

      for (let i = 0; i < endMonth; i++) {
        curInvested += monthlySchedule[i];
        curFV += monthlySchedule[i] * Math.pow(1 + r, endMonth - i);
      }

      yearlyData.push({
        year: y,
        invested: Math.round(curInvested),
        projectedValue: Math.round(curFV)
      });
    }

    const investedRounded = Math.round(totalInvested);
    const valueRounded = Math.round(totalFV);
    const gainsRounded = Math.max(0, valueRounded - investedRounded);

    return {
      totalInvested: investedRounded,
      estimatedGains: gainsRounded,
      projectedValue: valueRounded,
      yearlyData
    };
  }, [monthlySip, stepUpPercent, assumedReturn, periodYears, lumpsum]);

  return (
    <div className="calc-card p-5 sm:p-7 space-y-7">
      {/* Header */}
      <div className="pb-4 border-b border-[#E6E3F0]">
        <h2 className="text-lg font-bold text-[#17142E]">
          {isTa ? 'SIP முதலீட்டு வருமானக் கால்குலேட்டர்' : 'SIP Investment Return Calculator'}
        </h2>
        <p className="text-xs text-[#5B5875] mt-0.5">
          {isTa
            ? 'ஆண்டு ஸ்டெப்-அப் உடன் மாதாந்திர SIP எவ்வாறு வளர்கிறது என்பதைக் காண ஸ்லைடர்களை நகர்த்தவும். புள்ளிவிவரங்கள் அனுமானிக்கப்பட்ட விகிதத்தில் விளக்கப்படமாகும்.'
            : 'Move the sliders to see how a monthly SIP with an annual step-up can grow. Figures are illustrative at an assumed rate.'}
        </p>
      </div>

      {/* Grid: 5 Sliders on Left, Outcomes & Line Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sliders Column */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* 1. Monthly SIP */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5B5875]">
              <span>{isTa ? 'மாதாந்திர SIP' : 'Monthly SIP'}</span>
              <span className="text-sm font-extrabold text-[#17142E]">{formatINR(monthlySip)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="200000"
              step="500"
              value={monthlySip}
              onChange={(e) => setMonthlySip(Number(e.target.value))}
              className="calc-range"
            />
            <div className="flex justify-between text-[11px] text-[#8E8BA6]">
              <span>₹500</span>
              <span>₹2,00,000</span>
            </div>
          </div>

          {/* 2. Annual Step-up */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5B5875]">
              <span>{isTa ? 'ஆண்டு ஸ்டெப்-அப் (%)' : 'Annual step-up'}</span>
              <span className="text-sm font-extrabold text-[#17142E]">{stepUpPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={stepUpPercent}
              onChange={(e) => setStepUpPercent(Number(e.target.value))}
              className="calc-range"
            />
            <div className="flex justify-between text-[11px] text-[#8E8BA6]">
              <span>0%</span>
              <span>25%</span>
            </div>
          </div>

          {/* 3. Assumed return p.a. */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5B5875]">
              <span>{isTa ? 'எதிர்பார்க்கப்படும் ஆண்டு வருமானம் (%)' : 'Assumed return p.a.'}</span>
              <span className="text-sm font-extrabold text-[#17142E]">{assumedReturn}%</span>
            </div>
            <input
              type="range"
              min="4"
              max="18"
              step="0.5"
              value={assumedReturn}
              onChange={(e) => setAssumedReturn(Number(e.target.value))}
              className="calc-range"
            />
            <div className="flex justify-between text-[11px] text-[#8E8BA6]">
              <span>4%</span>
              <span>18%</span>
            </div>
          </div>

          {/* 4. Investment period */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5B5875]">
              <span>{isTa ? 'முதலீட்டுக் காலம்' : 'Investment period'}</span>
              <span className="text-sm font-extrabold text-[#17142E]">{periodYears} {isTa ? 'ஆண்டுகள்' : 'yrs'}</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={periodYears}
              onChange={(e) => setPeriodYears(Number(e.target.value))}
              className="calc-range"
            />
            <div className="flex justify-between text-[11px] text-[#8E8BA6]">
              <span>1 {isTa ? 'ஆண்டு' : 'yr'}</span>
              <span>40 {isTa ? 'ஆண்டுகள்' : 'yrs'}</span>
            </div>
          </div>

          {/* 5. One-time lumpsum */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5B5875]">
              <span>{isTa ? 'ஒரு முறை மொத்த முதலீடு (விருப்பமானது)' : 'One-time lumpsum'}</span>
              <span className="text-sm font-extrabold text-[#17142E]">{formatINR(lumpsum)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000000"
              step="10000"
              value={lumpsum}
              onChange={(e) => setLumpsum(Number(e.target.value))}
              className="calc-range"
            />
            <div className="flex justify-between text-[11px] text-[#8E8BA6]">
              <span>₹0</span>
              <span>₹50,00,000</span>
            </div>
          </div>

        </div>

        {/* Projected Outcome & Chart Column */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Projected Outcome Header & 3 Stat Tiles */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B5875] block">
              {isTa ? 'மதிப்பிடப்பட்ட வளர்ச்சி முடிவு' : 'Projected outcome'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1">
                <span className="text-[11px] font-semibold text-[#5B5875] block">
                  {isTa ? 'மொத்த முதலீடு' : 'Total invested'}
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-[#17142E] tabular-nums block">
                  {formatINR(outcome.totalInvested, true)}
                </span>
              </div>

              <div className="p-3.5 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1">
                <span className="text-[11px] font-semibold text-[#5B5875] block">
                  {isTa ? 'மதிப்பிடப்பட்ட லாபம்' : 'Estimated gains'}
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-[#0F9D58] tabular-nums block">
                  {formatINR(outcome.estimatedGains, true)}
                </span>
              </div>

              <div className="p-3.5 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1">
                <span className="text-[11px] font-semibold text-[#5B5875] block">
                  {isTa ? 'எதிர்பார்க்கப்படும் மதிப்பு' : 'Projected value'}
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-[#4F46E5] tabular-nums block">
                  {formatINR(outcome.projectedValue, true)}
                </span>
              </div>
            </div>
          </div>

          {/* Line Chart: Projected Value vs Amount Invested */}
          <StepUpLineChart data={outcome.yearlyData} isTa={isTa} />

          {/* Footnote */}
          <p className="text-[12px] text-[#8E8BA6] leading-relaxed">
            {isTa
              ? 'விளக்கக் காட்சி மட்டுமே. கணக்கீடு நிலையான வருமான விகிதத்தில் செய்யப்பட்டுள்ளது. மியூச்சுவல் ஃபண்ட் வருமானம் சந்தை சார்ந்தது மற்றும் ஆண்டுதோறும் மாறுபடும்.'
              : 'Illustration only, at an assumed constant return. Mutual fund returns are market-linked and will vary year to year.'}
          </p>

        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   CHART COMPONENT FOR TAB 2: STEP-UP LINE CHART
   ========================================================================== */
function StepUpLineChart({ data, isTa }) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.projectedValue), 1000);
  const width = 500;
  const height = 200;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const points = data.map((d, i) => {
    const x = padLeft + (i / Math.max(1, data.length - 1)) * plotW;
    const yVal = padTop + plotH - (d.projectedValue / maxVal) * plotH;
    const yInv = padTop + plotH - (d.invested / maxVal) * plotH;
    return { x, yVal, yInv, ...d };
  });

  return (
    <div className="bg-white rounded-xl border border-[#E6E3F0] p-3 sm:p-4 shadow-xs">
      <div className="flex items-center justify-between pb-2 text-[11px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
            <span className="font-bold text-[#17142E]">{isTa ? 'எதிர்பார்க்கப்படும் மதிப்பு' : 'Projected value'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C7C4F5]" />
            <span className="font-medium text-[#5B5875]">{isTa ? 'முதலீடு செய்த தொகை' : 'Amount invested'}</span>
          </div>
        </div>
      </div>

      <svg className="w-full h-auto overflow-visible select-none" viewBox={`0 0 ${width} ${height}`}>
        {/* Gridlines */}
        {[0, 0.33, 0.66, 1].map((frac, idx) => {
          const y = padTop + plotH - frac * plotH;
          return (
            <g key={idx}>
              <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#EEEDF4" strokeWidth="1" />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-[#8E8BA6]">
                {formatINR(maxVal * frac, true)}
              </text>
            </g>
          );
        })}

        {/* Projected Value Line */}
        <polyline
          fill="none"
          stroke="#4F46E5"
          strokeWidth="2.5"
          strokeLinecap="round"
          points={points.map(p => `${p.x},${p.yVal}`).join(' ')}
        />

        {/* Invested Amount Line */}
        <polyline
          fill="none"
          stroke="#C7C4F5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
          points={points.map(p => `${p.x},${p.yInv}`).join(' ')}
        />

        {/* X Axis Labels */}
        {points.map((p, idx) => {
          const show = p.year === 1 || p.year % 2 === 0 || p.year === data.length;
          if (!show && data.length > 8) return null;
          return (
            <text
              key={p.year}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[9px] fill-[#8E8BA6] font-bold"
            >
              Y{p.year}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ==========================================================================
   TAB 3: RISK PROFILE QUIZ
   ========================================================================== */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    qEn: 'What is your age?',
    qTa: 'உங்கள் வயது என்ன?',
    options: [
      { textEn: 'Above 45', textTa: '45 வயதுக்கு மேல்', score: 1 },
      { textEn: '30 to 45', textTa: '30 முதல் 45', score: 2 },
      { textEn: 'Under 30', textTa: '30 வயதுக்கு கீழ்', score: 3 }
    ]
  },
  {
    id: 2,
    qEn: 'When will you need most of this money?',
    qTa: 'இந்த பணம் உங்களுக்கு எப்போது அதிகம் தேவைப்படும்?',
    options: [
      { textEn: 'Within 3 years', textTa: '3 ஆண்டுகளுக்குள்', score: 1 },
      { textEn: '3 to 7 years', textTa: '3 முதல் 7 ஆண்டுகள்', score: 2 },
      { textEn: 'After 7 years', textTa: '7 ஆண்டுகளுக்குப் பிறகு', score: 3 }
    ]
  },
  {
    id: 3,
    qEn: 'If your portfolio fell 20% in a month, you would:',
    qTa: 'உங்கள் முதலீடு ஒரு மாதத்தில் 20% குறைந்தால் என்ன செய்வீர்கள்?',
    options: [
      { textEn: 'Sell to stop further loss', textTa: 'மேலும் இழப்பைத் தவிர்க்க விற்றுவிடுவேன்', score: 1 },
      { textEn: 'Hold and wait', textTa: 'பொறுமையாக காத்திருப்பேன்', score: 2 },
      { textEn: 'Invest more at lower prices', textTa: 'குறைந்த விலையில் மேலும் முதலீடு செய்வேன்', score: 3 }
    ]
  },
  {
    id: 4,
    qEn: 'Your main aim for this money is:',
    qTa: 'இந்த பணத்திற்கான உங்கள் முக்கிய நோக்கம் என்ன?',
    options: [
      { textEn: 'Protect what I have', textTa: 'இருப்பதை பாதுகாப்பது', score: 1 },
      { textEn: 'Steady growth', textTa: 'நிலையான வளர்ச்சி', score: 2 },
      { textEn: 'Maximum long-term growth', textTa: 'அதிகபட்ச நீண்டகால வளர்ச்சி', score: 3 }
    ]
  },
  {
    id: 5,
    qEn: 'Your investing experience:',
    qTa: 'உங்கள் முதலீட்டு அனுபவம்:',
    options: [
      { textEn: 'New to mutual funds', textTa: 'மியூச்சுவல் ஃபண்டிற்கு புதியவர்', score: 1 },
      { textEn: 'A few years of SIPs', textTa: 'சில ஆண்டுகள் SIP அனுபவம்', score: 2 },
      { textEn: 'Experienced across equity and debt', textTa: 'பங்கு மற்றும் கடன் சந்தைகளில் அனுபவம்', score: 3 }
    ]
  },
  {
    id: 6,
    qEn: "Do you have an emergency fund of 6 months' expenses?",
    qTa: 'உங்களிடம் 6 மாத செலவுகளுக்கான அவசரகால நிதி உள்ளதா?',
    options: [
      { textEn: 'Not yet', textTa: 'இன்னும் இல்லை', score: 1 },
      { textEn: 'Partly', textTa: 'பகுதியளவு உள்ளது', score: 2 },
      { textEn: 'Yes, fully', textTa: 'ஆம், முழுமையாக உள்ளது', score: 3 }
    ]
  }
];

function RiskProfileQuizTab({ isTa }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (score) => {
    const updated = [...answers];
    updated[currentQuestionIdx] = score;
    setAnswers(updated);

    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const handleRetake = () => {
    setAnswers([]);
    setCurrentQuestionIdx(0);
    setIsCompleted(false);
  };

  // Total Score (6 to 18)
  const totalScore = answers.reduce((acc, s) => acc + (s || 0), 0);

  // Profile Determination
  const profile = useMemo(() => {
    if (totalScore <= 9) {
      return {
        key: 'conservative',
        nameEn: 'Conservative',
        nameTa: 'பாதுகாப்பானது (Conservative)',
        descEn: 'Your priority is capital preservation with minimal fluctuations. A debt-heavy portfolio protects your capital.',
        descTa: 'உங்கள் முதன்மை நோக்கம் குறைந்தபட்ச ஏற்ற இறக்கங்களுடன் மூலதனத்தைப் பாதுகாப்பதாகும். கடன் சார்ந்த ஃபண்டுகள் உங்கள் மூலதனத்தைப் பாதுகாக்கின்றன.',
        allocations: [
          { labelEn: 'Debt / Short Duration', labelTa: 'கடன் / குறுகிய கால ஃபண்டுகள்', percent: 45, color: '#3B82F6' },
          { labelEn: 'Hybrid / Balanced Advantage', labelTa: 'ஹைபிரிட் / பேலன்ஸ்டு அட்வான்டேஜ்', percent: 25, color: '#10B981' },
          { labelEn: 'Large Cap / Index', labelTa: 'லார்ஜ் கேப் / இன்டெக்ஸ்', percent: 15, color: '#4F46E5' },
          { labelEn: 'Gold', labelTa: 'தங்கம் (Gold)', percent: 15, color: '#F5B700' }
        ]
      };
    }
    if (totalScore <= 14) {
      return {
        key: 'balanced',
        nameEn: 'Balanced',
        nameTa: 'சமநிலையானது (Balanced)',
        descEn: 'You can sit through normal market swings for steady growth. A blend of large cap, flexi cap and hybrid funds suits you.',
        descTa: 'நிலையான வளர்ச்சிக்காக சாதாரண சந்தை மாற்றங்களை நீங்கள் சமாளிக்க முடியும். லார்ஜ் கேப், ஃபிளெக்சி கேப் மற்றும் ஹைபிரிட் ஃபண்டுகளின் கலவை உங்களுக்கு ஏற்றது.',
        allocations: [
          { labelEn: 'Large Cap / Index', labelTa: 'லார்ஜ் கேப் / இன்டெக்ஸ்', percent: 30, color: '#4F46E5' },
          { labelEn: 'Flexi Cap', labelTa: 'ஃபிளெக்சி கேப் (Flexi Cap)', percent: 30, color: '#06B6D4' },
          { labelEn: 'Hybrid / Balanced Advantage', labelTa: 'ஹைபிரிட் / பேலன்ஸ்டு அட்வான்டேஜ்', percent: 20, color: '#10B981' },
          { labelEn: 'Debt / Short Duration', labelTa: 'கடன் / குறுகிய காலம்', percent: 10, color: '#3B82F6' },
          { labelEn: 'Gold', labelTa: 'தங்கம் (Gold)', percent: 10, color: '#F5B700' }
        ]
      };
    }
    return {
      key: 'aggressive',
      nameEn: 'Aggressive',
      nameTa: 'தீவிர வளர்ச்சி (Aggressive)',
      descEn: 'You aim for maximum wealth creation and can handle high volatility for superior long-term returns.',
      descTa: 'நீங்கள் அதிகபட்ச செல்வ உருவாக்கத்தை நோக்கமாகக் கொண்டுள்ளீர்கள் மற்றும் நீண்ட கால வருமானத்திற்காக ஏற்ற இறக்கங்களை கையாள முடியும்.',
      allocations: [
        { labelEn: 'Flexi Cap', labelTa: 'ஃபிளெக்சி கேப் (Flexi Cap)', percent: 30, color: '#06B6D4' },
        { labelEn: 'Mid / Small Cap', labelTa: 'மிட் & ஸ்மால் கேப் (Mid/Small Cap)', percent: 30, color: '#8B5CF6' },
        { labelEn: 'Large Cap / Index', labelTa: 'லார்ஜ் கேப் / இன்டெக்ஸ்', percent: 25, color: '#4F46E5' },
        { labelEn: 'Hybrid', labelTa: 'ஹைபிரிட்', percent: 5, color: '#10B981' },
        { labelEn: 'Gold', labelTa: 'தங்கம் (Gold)', percent: 10, color: '#F5B700' }
      ]
    };
  }, [totalScore]);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];

  return (
    <div className="calc-card p-5 sm:p-8 max-w-2xl mx-auto space-y-6">
      
      {!isCompleted ? (
        /* QUIZ IN PROGRESS */
        <div className="space-y-6">
          {/* Header & Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#5B5875] uppercase tracking-wider">
              <span>{isTa ? 'ரிஸ்க் சுயவிவர வினாடிவினா' : 'RISK PROFILE QUIZ'}</span>
              <span>
                {isTa
                  ? `கேள்வி ${currentQuestionIdx + 1} / 6`
                  : `Question ${currentQuestionIdx + 1} of 6`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#F3F1FA] overflow-hidden border border-[#E6E3F0]">
              <div
                className="h-full bg-[#4F46E5] transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="text-base sm:text-lg font-bold text-[#17142E] leading-relaxed">
              {isTa ? currentQ.qTa : currentQ.qEn}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentQuestionIdx] === opt.score;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(opt.score)}
                  className={`w-full p-4 rounded-[14px] text-left text-xs sm:text-sm font-semibold transition-all border cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#EEF0FF] border-[#4F46E5] text-[#17142E] shadow-xs'
                      : 'bg-white border-[#E6E3F0] text-[#17142E] hover:border-[#4F46E5] hover:bg-[#F8F7FC]'
                  }`}
                >
                  <span>{isTa ? opt.textTa : opt.textEn}</span>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ml-3 ${
                      isSelected
                        ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                        : 'border-[#E6E3F0] text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls (Back Button) */}
          {currentQuestionIdx > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B5875] hover:text-[#17142E] transition-colors cursor-pointer"
              >
                <span>← {isTa ? 'முந்தைய கேள்வி' : 'Back'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* QUIZ RESULTS CARD */
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center space-y-2 pb-4 border-b border-[#E6E3F0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
              {isTa ? 'உங்கள் ரிஸ்க் சுயவிவரம்' : 'YOUR RISK PROFILE'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#17142E]">
              {isTa ? profile.nameTa : profile.nameEn}
            </h3>
            <p className="text-xs sm:text-sm text-[#5B5875] max-w-lg mx-auto leading-relaxed pt-1">
              {isTa ? profile.descTa : profile.descEn}
            </p>
          </div>

          {/* Asset Allocation Bars */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B5875] block">
              {isTa ? 'பரிந்துரைக்கப்படும் முதலீட்டுக் கலவை (Asset Allocation)' : 'Recommended Asset Allocation'}
            </span>

            <div className="space-y-2.5">
              {profile.allocations.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#17142E]">
                    <span>{isTa ? item.labelTa : item.labelEn}</span>
                    <span className="font-bold">{item.percent}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#F3F1FA] overflow-hidden border border-[#E6E3F0]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button: Retake Quiz */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleRetake}
              className="w-full sm:w-auto px-5 py-2.5 rounded-[10px] bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#4338CA] transition-colors shadow-xs cursor-pointer"
            >
              {isTa ? 'மீண்டும் வினாடிவினா செய்ய' : 'Retake quiz'}
            </button>

            <a
              href="#/articles"
              className="w-full sm:w-auto px-5 py-2.5 rounded-[10px] bg-white border border-[#E6E3F0] text-xs font-bold text-[#17142E] hover:border-[#4F46E5] transition-colors text-center cursor-pointer"
            >
              {isTa ? 'பொருத்தமான கட்டுரைகளைப் படிக்க' : 'Read relevant guides'}
            </a>
          </div>

          {/* Footnote */}
          <p className="text-[12px] text-[#8E8BA6] leading-relaxed pt-2 border-t border-[#E6E3F0]">
            {isTa
              ? 'இந்த வினாடிவினா கல்வி நோக்கத்திற்கான ஒரு எளிய சுய மதிப்பீடு மட்டுமே. முதலீடு செய்வதற்கு முன் உங்கள் விநியோகஸ்தருடன் முழுமையான சுயவிவரத்தை பூர்த்தி செய்யுங்கள்.'
              : 'This quiz is a simple self-assessment for education. A full risk profile is completed with your distributor before investing.'}
          </p>
        </div>
      )}

    </div>
  );
}

export { SipCalculator };
