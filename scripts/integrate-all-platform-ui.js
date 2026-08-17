import fs from 'fs';
import path from 'path';

const bundlePath = path.resolve('js/bundle.js');
let bundleCode = fs.readFileSync(bundlePath, 'utf8');

// 1. REFINED HERO SECTION (Bento Box Wealth Studio with Preserved Ticker)
const heroSectionCode = `
function HeroSection({ news = newsData, onNavigate }) {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const featuredStories = news && news.length > 0 ? news : newsData;
  const latestStories = (news && news.length > 0 ? news : newsData).slice(0, 4);

  const getHeadline = (item) => {
    return language === 'ta' ? item.titleTamil : (item.titleEnglish || item.titleTamil);
  };

  const getSummary = (item) => {
    return language === 'ta' ? item.summaryTamil : (item.summaryEnglish || item.summaryTamil);
  };

  const renderFeaturedTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-stretch gap-0 shrink-0 h-full">
      {featuredStories.map((item, idx) => {
        const headline = getHeadline(item);
        const summary = getSummary(item);
        const formattedDate = new Intl.DateTimeFormat(
          language === 'ta' ? 'ta-IN' : 'en-IN',
          { month: 'short', day: 'numeric' }
        ).format(new Date(item.publishedAt || Date.now()));

        return (
          <article
            key={\`\${keyPrefix}-\${item.id}-\${idx}\`}
            onClick={() => onNavigate && onNavigate(\`#/news/\${item.slug}\`)}
            className="group relative w-[250px] sm:w-[280px] md:w-[310px] h-[300px] sm:h-[330px] shrink-0 border-r border-white/10 overflow-hidden flex flex-col justify-end p-4 sm:p-5 select-none cursor-pointer bg-slate-950"
          >
            <img
              src={item.thumbnail}
              alt={headline}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent pointer-events-none" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-amber-500 text-slate-950 shadow-md">
                {(item.category || 'FINANCE').replace('-', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-950/85 text-slate-200 text-[9px] font-mono font-bold backdrop-blur-sm border border-white/15">
                {formattedDate}
              </span>
            </div>

            <div className="relative z-10 space-y-2">
              <h3 className="text-sm sm:text-base font-black text-white leading-snug font-serif group-hover:text-amber-400 transition-colors drop-shadow-md line-clamp-2">
                {headline}
              </h3>
              {summary && (
                <p className="text-xs text-slate-300/95 line-clamp-2 font-sans leading-relaxed drop-shadow">
                  {summary}
                </p>
              )}
              <div className="pt-1 flex items-center justify-between text-xs text-amber-400 font-extrabold">
                <span className="flex items-center gap-1">
                  <span>{t('readArticle') || 'Read Article'}</span>
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden p-4 sm:p-5 text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-white font-serif flex items-center gap-1.5">
                <span>{t('featuredNews') || 'சிறப்புச் செய்திகள்'}</span>
              </h2>
            </div>
            <span className="text-[10px] font-mono text-amber-400/90 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              LIVE NEWS TICKER
            </span>
          </div>

          <div className="featured-marquee-wrapper overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 my-auto">
            <div className="animate-featured-marquee flex items-stretch gap-0 whitespace-normal">
              {renderFeaturedTrack('ftrack-1')}
              {renderFeaturedTrack('ftrack-2')}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                {isTamil ? 'சமீபத்திய கட்டுரைகள்' : 'Latest Articles'}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Latest
            </span>
          </div>

          <div className="space-y-2.5 flex-1 flex flex-col justify-between">
            {latestStories.map((article, idx) => {
              const title = getHeadline(article);
              return (
                <div
                  key={article.id || idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate && onNavigate(\`#/news/\${article.slug}\`)}
                  className="btn-magnetic group flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50"
                >
                  {article.thumbnail && (
                    <img
                      src={article.thumbnail}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                        {(article.category || 'FINANCE').replace('-', ' ')}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        • {new Date(article.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif leading-snug">
                      {title}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0">
                    →
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
`;

// 2. UPGRADED SIP CALCULATOR (Real-time Analytics + Asset Breakdown)
const sipCalculatorCode = `
function SipCalculator() {
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

  const investedPercent = futureValue > 0 ? Math.round((totalInvested / futureValue) * 100) : 50;
  const gainPercent = 100 - investedPercent;

  const calculatorCards = [
    {
      id: 'sip',
      titleTamil: 'SIP கணக்கிடுவான்',
      titleEnglish: 'SIP Calculator',
      subtitleTamil: 'மாதாந்திர முறையான முதலீடு',
      subtitleEnglish: 'Monthly Systematic Investment',
      badge: isTamil ? 'பிரபலம்' : 'POPULAR'
    },
    {
      id: 'lumpsum',
      titleTamil: 'ஒரே முறை முதலீடு',
      titleEnglish: 'Lump Sum Calculator',
      subtitleTamil: 'ஒரே முறை முதலீட்டு வளர்ச்சி',
      subtitleEnglish: 'One-Time Investment Growth',
      badge: isTamil ? 'எளிது' : 'SIMPLE'
    },
    {
      id: 'stepup',
      titleTamil: 'முதலீட்டு வருவாய் உயர்வு',
      titleEnglish: 'Returns Calculator',
      subtitleTamil: 'ஆண்டு முதலீட்டு உயர்வு (+10%)',
      subtitleEnglish: 'Step-Up Annual Incremental Growth',
      badge: isTamil ? 'அதிவேக வளர்ச்சி' : 'HIGH GROWTH'
    },
    {
      id: 'compound',
      titleTamil: 'கூட்டு வட்டி கணக்கீடு',
      titleEnglish: 'Compound Interest',
      subtitleTamil: 'கூட்டு வட்டியின் அபார வளர்ச்சி',
      subtitleEnglish: 'Power of Compounding Growth',
      badge: isTamil ? 'செல்வ வளர்ச்சி' : 'WEALTH'
    }
  ];

  return (
    <section id="financial-calculators" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
          {isTamil ? 'நிதி கணக்கீட்டுக் கருவிகள்' : 'FINANCIAL WEALTH STUDIO'}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white tracking-tight">
          {isTamil ? 'நிதி கணக்கீட்டுக் கருவிகள்' : 'Interactive Wealth Studio'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {isTamil
            ? 'SIP, ஒரே முறை முதலீடு, முதலீட்டு வருவாய் மற்றும் கூட்டு வட்டி ஆகியவற்றைக் கணக்கிட உதவும் சாதனங்கள்.'
            : 'Plan SIPs, Lump Sum investments, returns, and compound interest growth with real-time analytics.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {calculatorCards.map((card) => {
          const isActive = calcMode === card.id;
          return (
            <div
              key={card.id}
              role="button"
              tabIndex={0}
              onClick={() => setCalcMode(card.id)}
              className={\`btn-magnetic group cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between \${
                isActive
                  ? 'bg-slate-900 dark:bg-slate-950 text-white border-amber-500 shadow-xl ring-1 ring-amber-500/50'
                  : 'bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm hover:shadow-md'
              }\`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span
                    className={\`text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full \${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }\`}
                  >
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm font-serif group-hover:text-amber-500 transition-colors">
                  {isTamil ? card.titleTamil : card.titleEnglish}
                </h3>
                <p className={\`text-xs mt-1 \${isActive ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}\`}>
                  {isTamil ? card.subtitleTamil : card.subtitleEnglish}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/20 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className={isActive ? 'text-amber-400' : 'text-amber-600 dark:text-amber-400'}>
                  {isActive
                    ? (isTamil ? 'செயலில் உள்ள கணக்கீடு' : 'Active Studio')
                    : (isTamil ? 'பயன்படுத்துக' : 'Use Calculator')}
                </span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black font-serif text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>
                {calcMode === 'sip' && (isTamil ? 'SIP முதலீட்டுக் கணக்கீடு' : 'SIP Wealth Studio')}
                {calcMode === 'lumpsum' && (isTamil ? 'ஒரே முறை முதலீட்டுக் கணக்கீடு' : 'Lump Sum Wealth Studio')}
                {calcMode === 'stepup' && (isTamil ? 'முதலீட்டு உயர்வு (Step-Up SIP) கணக்கீடு' : 'Step-Up SIP Studio')}
                {calcMode === 'compound' && (isTamil ? 'கூட்டு வட்டி கணக்கீடு' : 'Compound Interest Studio')}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isTamil
                ? 'உங்கள் நீண்ட கால முதலீட்டு இலக்கை அடைய துல்லியமான கூட்டு வட்டி கணிப்பு'
                : 'Interactive asset compounding and inflation-adjusted growth projections'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px]">
              {isTamil ? 'இலக்குகள்:' : 'Goals:'}
            </span>
            <button
              onClick={() => applyPresetGoal(5000, 12, 15)}
              className="btn-magnetic px-3 py-1.5 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold text-xs border border-slate-700"
            >
              {isTamil ? '₹1 கோடி இலக்கு' : '₹1 Crore Goal'}
            </button>
            <button
              onClick={() => applyPresetGoal(10000, 14, 10)}
              className="btn-magnetic px-3 py-1.5 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold text-xs border border-slate-700"
            >
              {isTamil ? '₹50 லட்சம் இலக்கு' : '₹50 Lakh Goal'}
            </button>
            <button
              onClick={() => applyPresetGoal(25000, 12, 5)}
              className="btn-magnetic px-3 py-1.5 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold text-xs border border-slate-700"
            >
              {isTamil ? '₹20 லட்சம் குறுகிய காலம்' : '₹20 Lakh Short Term'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 space-y-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-300">
                    {calcMode === 'lumpsum' || calcMode === 'compound'
                      ? (isTamil ? 'தொடக்க முதலீட்டுத் தொகை (₹)' : 'Initial Investment (₹)')
                      : (isTamil ? 'மாதாந்திர SIP தொகை (₹)' : 'Monthly SIP Amount (₹)')}
                  </label>
                  <span className="text-amber-400 font-mono text-sm font-black">
                    {formatCurrency(monthlyInvest)}
                  </span>
                </div>
                <input
                  type="range"
                  min={calcMode === 'lumpsum' || calcMode === 'compound' ? '5000' : '500'}
                  max={calcMode === 'lumpsum' || calcMode === 'compound' ? '2000000' : '100000'}
                  step={calcMode === 'lumpsum' || calcMode === 'compound' ? '5000' : '500'}
                  value={monthlyInvest}
                  onChange={(e) => setMonthlyInvest(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {calcMode === 'stepup' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <label className="text-slate-300">
                      {isTamil ? 'ஆண்டு முதலீட்டு உயர்வு (%)' : 'Annual Step-Up Increase (%)'}
                    </label>
                    <span className="text-amber-400 font-mono text-sm font-black">
                      +{stepUpPercent}% / {isTamil ? 'ஆண்டுக்கு' : 'Year'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={stepUpPercent}
                    onChange={(e) => setStepUpPercent(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-300">
                    {isTamil ? 'எதிர்பார்க்கும் ஆண்டு வட்டி விகிதம் (%)' : 'Expected Annual Return Rate (%)'}
                  </label>
                  <span className="text-amber-400 font-mono text-sm font-black">
                    {returnRate}% / {isTamil ? 'ஆண்டுக்கு' : 'Year'}
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="24"
                  step="0.5"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-300">
                    {isTamil ? 'முதலீட்டுக் காலம் (ஆண்டுகள்)' : 'Time Horizon (Years)'}
                  </label>
                  <span className="text-amber-400 font-mono text-sm font-black">
                    {timeYears} {isTamil ? 'ஆண்டுகள்' : 'Years'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={timeYears}
                  onChange={(e) => setTimeYears(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-400">
                    {isTamil ? 'எதிர்பார்க்கப்படும் பணவீக்கம் (%)' : 'Expected Inflation Rate (%)'}
                  </label>
                  <span className="text-slate-300 font-mono text-xs">
                    {inflationRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <span>{isTamil ? 'முதலீடு' : 'Invested'}: {investedPercent}%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>{isTamil ? 'வட்டி லாபம்' : 'Wealth Gain'}: {gainPercent}%</span>
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
                <div style={{ width: \`\${investedPercent}%\` }} className="bg-slate-600 transition-all duration-300" />
                <div style={{ width: \`\${gainPercent}%\` }} className="bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/50" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  {isTamil ? 'மொத்த முதலீடு' : 'Total Invested'}
                </span>
                <span className="text-lg font-black font-mono text-white">
                  {formatCurrency(totalInvested)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  {isTamil ? 'மதிப்பிடப்பட்ட வட்டி லாபம்' : 'Estimated Growth Returns'}
                </span>
                <span className="text-lg font-black font-mono text-emerald-400">
                  +{formatCurrency(estimatedGain)}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    {isTamil ? 'மொத்த முதிர்வுத் தொகை' : 'Projected Wealth Corpus'}
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-amber-400 text-slate-950">
                    {wealthMultiplier}x Wealth
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  {formatCurrency(futureValue)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>{isTamil ? 'பணவீக்கத்திற்குப் பின் உண்மையான மதிப்பு' : 'Inflation-Adjusted Purchasing Value'}</span>
                  <span className="font-mono text-slate-200">{formatCurrency(realPurchasingPower)}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {isTamil
                    ? \`\${inflationRate}% பணவீக்கத்தைக் கணக்கிடும் போது உங்கள் ₹\${(futureValue / 100000).toFixed(1)} லட்சத்தின் உண்மையான மதிப்பு.\`
                    : \`Purchasing power equivalent in today's money at \${inflationRate}% average inflation rate.\`}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-bold border-t border-slate-800">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>CFP Verified Math</span>
              </span>
              <span>Padmanaban B. Financial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`;

// 3. COMPLETE AUTHPAGE COMPONENT
const authPageCode = `
function AuthPage({ initialMode = 'login', onNavigate }) {
  const { t, language } = useLanguage();
  const { signInWithPassword, signUp, signInWithGoogle, sendPasswordReset, signInWithMagicLink } = useAuth();
  const isTamil = language === 'ta';

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setError(isTamil ? 'சரியான மின்னஞ்சலை உள்ளிடவும்.' : 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!password) throw new Error(isTamil ? 'கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter your password.');
        await signInWithPassword(email, password);
        setSuccessMessage(isTamil ? 'வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்!' : 'Logged in successfully!');
        const redirect = sessionStorage.getItem('auth_redirect_from') || '#/';
        sessionStorage.removeItem('auth_redirect_from');
        if (onNavigate) onNavigate(redirect);
        else window.location.hash = redirect;
      } else if (mode === 'signup') {
        if (!password || password.length < 6) throw new Error(isTamil ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.' : 'Password must be at least 6 characters.');
        await signUp(email, password, fullName);
        setSuccessMessage(isTamil ? 'கணக்கு உருவாக்கப்பட்டது! உங்கள் மின்னஞ்சலை சரிபார்க்கவும்.' : 'Account created successfully! Check your email.');
      } else if (mode === 'forgot') {
        await sendPasswordReset(email);
        setSuccessMessage(isTamil ? 'கடவுச்சொல் மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டது.' : 'Password reset link sent to your email.');
      } else if (mode === 'magic-link') {
        await signInWithMagicLink(email);
        setSuccessMessage(isTamil ? 'மேஜிக் லிங்க் மின்னஞ்சலுக்கு அனுப்பப்பட்டது.' : 'Magic login link sent to your email.');
      }
    } catch (err) {
      setError(err.message || (isTamil ? 'செயல்பாடு தோல்வியடைந்தது.' : 'Operation failed. Please check credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
                DV
              </div>
              <div>
                <h1 className="font-serif font-black text-lg text-white">Muthaleetu Thisai</h1>
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Wealth Platform</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                CFP Verified Advisory
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-white leading-tight">
                {isTamil
                  ? 'உங்கள் மியூச்சுவல் ஃபண்ட் முதலீடுகளுக்கான சிறந்த நிதி வழிகாட்டி.'
                  : 'Your trusted platform for mutual funds & compounding wealth.'}
              </h2>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 text-xs font-bold text-slate-400 flex items-center justify-between relative z-10">
            <span>Padmanaban B. Financial</span>
            <span className="text-amber-400">@budgetpadmanaban_</span>
          </div>
        </div>

        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6 bg-slate-50/50 dark:bg-slate-900">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {mode === 'login' && (isTamil ? 'உள்நுழைவு' : 'SECURE SIGN IN')}
              {mode === 'signup' && (isTamil ? 'புதிய பதிவு' : 'JOIN THE PLATFORM')}
              {mode === 'forgot' && (isTamil ? 'மீட்டமைப்பு' : 'RECOVERY')}
              {mode === 'magic-link' && (isTamil ? 'மேஜிக் லிங்க்' : 'PASSWORDLESS')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-900 dark:text-white mt-1">
              {mode === 'login' && (isTamil ? 'மீண்டும் வருக!' : 'Welcome Back')}
              {mode === 'signup' && (isTamil ? 'கணக்கை உருவாக்குங்கள்' : 'Create Account')}
              {mode === 'forgot' && (isTamil ? 'கடவுச்சொல் மீட்டெடுப்பு' : 'Reset Password')}
              {mode === 'magic-link' && (isTamil ? 'மேஜிக் உள்நுழைவு' : 'Magic Sign In')}
            </h2>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              {successMessage}
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="btn-magnetic w-full py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isTamil ? 'கூகிள் மூலம் தொடர்க' : 'Continue with Google'}</span>
            </button>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">{isTamil ? 'அல்லது' : 'OR'}</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isTamil ? 'முழு பெயர்' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isTamil ? "உங்கள் பெயர்" : "Your Name"}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            {(mode === 'login' || mode === 'signup') && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isTamil ? 'கடவுச்சொல்' : 'Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      {isTamil ? 'மறந்துவிட்டதா?' : 'Forgot?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (isTamil ? 'மறை' : 'Hide') : (isTamil ? 'காட்டு' : 'Show')}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-magnetic w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isLoading
                ? (isTamil ? 'செயலாக்குகிறது...' : 'Processing...')
                : mode === 'login'
                ? (isTamil ? 'உள்நுழைக' : 'Sign In')
                : mode === 'signup'
                ? (isTamil ? 'கணக்கு தொடங்கு' : 'Create Account')
                : mode === 'forgot'
                ? (isTamil ? 'இணைப்பு அனுப்புக' : 'Send Reset Link')
                : (isTamil ? 'மேஜிக் லிங்க் அனுப்புக' : 'Send Magic Link')}
            </button>
          </form>

          <div className="pt-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 space-y-2">
            {mode === 'login' ? (
              <p>
                {isTamil ? 'கணக்கு இல்லையா?' : "Don't have an account?"}{' '}
                <button onClick={() => setMode('signup')} className="font-extrabold text-amber-600 dark:text-amber-400 hover:underline">
                  {isTamil ? 'இப்போதே பதிவு செய்யுங்கள்' : 'Sign up now'}
                </button>
              </p>
            ) : (
              <p>
                {isTamil ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'}{' '}
                <button onClick={() => setMode('login')} className="font-extrabold text-amber-600 dark:text-amber-400 hover:underline">
                  {isTamil ? 'உள்நுழைக' : 'Sign in'}
                </button>
              </p>
            )}

            {mode === 'login' && (
              <p>
                <button onClick={() => setMode('magic-link')} className="font-semibold text-slate-400 hover:text-slate-200">
                  {isTamil ? 'கடவுச்சொல் இன்றி உள்நுழைக' : 'Sign in with Magic Link'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

// REPLACE IN BUNDLE CODE
// 1. Replace HeroSection
const heroStart = 'function HeroSection({ news = newsData';
const heroEnd = 'function TrendingArticlesSection(';
if (bundleCode.includes(heroStart) && bundleCode.includes(heroEnd)) {
  const sIdx = bundleCode.indexOf(heroStart);
  const eIdx = bundleCode.indexOf(heroEnd);
  bundleCode = bundleCode.substring(0, sIdx) + `${heroSectionCode}\n\n` + bundleCode.substring(eIdx);
  console.log('Replaced HeroSection in bundle.js');
}

// 2. Replace SipCalculator
const sipStart = 'function SipCalculator() {';
const sipEnd = 'function RiskQuizWidget() {';
if (bundleCode.includes(sipStart) && bundleCode.includes(sipEnd)) {
  const sIdx = bundleCode.indexOf(sipStart);
  const eIdx = bundleCode.indexOf(sipEnd);
  bundleCode = bundleCode.substring(0, sIdx) + `${sipCalculatorCode}\n\n` + bundleCode.substring(eIdx);
  console.log('Replaced SipCalculator in bundle.js');
}

// 3. Inject AuthPage before function App()
const appStart = 'function App() {';
if (bundleCode.includes(appStart)) {
  const appIdx = bundleCode.indexOf(appStart);
  if (!bundleCode.includes('function AuthPage(')) {
    bundleCode = bundleCode.substring(0, appIdx) + `${authPageCode}\n\n` + bundleCode.substring(appIdx);
    console.log('Injected AuthPage in bundle.js');
  }
}

fs.writeFileSync(bundlePath, bundleCode, 'utf8');
console.log('Successfully updated js/bundle.js with all platform UI improvements and AuthPage!');
