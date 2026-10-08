// Core constants and translations
const OFFICIAL_CHANNEL_URL = "https://www.youtube.com/@budgetpadmanaban_";
const OFFICIAL_CHANNEL_HANDLE = "@budgetpadmanaban_";
const OFFICIAL_CHANNEL_NAME = "Budget Padmanaban";

const translations = {
  ta: {
    siteName: "முதலீட்டு திசை",
    welcome: "வரவேற்கிறோம்",
    tagline: "மியூச்சுவல் ஃபண்ட் & பங்குச் சந்தை செய்திகள்",
    budgetPadmanaban: "பட்ஜெட் பத்மநாபன் ஃபைனான்ஷியல்",
    nav: {
      home: "முகப்பு",
      articles: "செய்திக் கட்டுரைகள்",
      videos: "வீடியோக்கள்",
      news: "செய்திகள்",
      professionals: "நிபுணர்கள்",
      mutualFunds: "மியூச்சுவல் ஃபண்ட்",
      stocks: "பங்குச் சந்தை",
      personalFinance: "தனிநபர் நிதி",
      education: "நிதி அறிவு",
      calculator: "SIP கணக்கிடுவான்",
      quiz: "வினாடி வினா"
    },
    tickerLabel: "முக்கிய செய்திகள்",
    marketTitle: "சந்தை நிலவரம்",
    heroBadge: "சிறப்பு செய்தி",
    featuredNews: "சிறப்புச் செய்திகள்",
    trendingArticlesTitle: "டிரெண்டிங் செய்திகள்",
    latestVideos: "சமீபத்திய வீடியோக்கள்",
    mutualFundNewsTitle: "மியூச்சுவல் ஃபண்ட் செய்திகள்",
    stockMarketNewsTitle: "பங்குச் சந்தை செய்திகள்",
    personalFinanceNewsTitle: "SIP & தனிநபர் நிதி செய்திகள்",
    mutualFundVideos: "மியூச்சுவல் ஃபண்ட் வீடியோக்கள்",
    stockMarketVideos: "பங்குச் சந்தை வீடியோக்கள்",
    sipVideos: "SIP & முதலீட்டு வீடியோக்கள்",
    financialCalculators: "நிதி கணக்கீட்டுக் கருவிகள்",
    financialCalculatorsDesc: "SIP, ஒரே முறை முதலீடு, முதலீட்டு வருவாய் மற்றும் கூட்டு வட்டி ஆகியவற்றைக் கணக்கிட உதவும் நிதிச் சாதனங்கள்.",
    sipCalculator: "SIP Calculator",
    lumpsumCalculator: "Lump Sum Calculator",
    returnsCalculator: "Returns Calculator",
    compoundCalculator: "Compound Interest Calculator",
    searchPlaceholder: "வீடியோக்கள், செய்திகளைத் தேடுக... (Ctrl + K)",
    searchTitle: "தேடல்",
    recentSearches: "சமீபத்திய தேடல்கள்",
    trendingSearches: "பிரபலமான தலைப்புகள்",
    noResults: "முடிவுகள் எதுவும் கிடைக்கவில்லை",
    filterAll: "அனைத்தும்",
    views: "பார்வைகள்",
    publishedAt: "வெளியிடப்பட்ட நாள்",
    duration: "கால அளவு",
    watchNow: "இப்போது பாருங்கள்",
    readArticle: "மேலும் படிக்க",
    continueWatching: "தொடர்ந்து பாருங்கள்",
    recommendedForYou: "உங்களுக்கான பரிந்துரைகள்",
    newBadge: "புதியது",
    sipCalculatorTitle: "SIP முதலீட்டு கணக்கீட்டு கருவி",
    sipCalculatorDesc: "உங்கள் மாத வரவு வழி முதலீடு மூலம் 1 கோடி அல்லது உங்கள் இலக்கு தொகையை அடைய கூட்டு வட்டியின் வலிமையைக் கணக்கிடுங்கள்.",
    monthlyInvestment: "மாதாந்திர SIP தொகை (₹)",
    expectedReturnRate: "எதிர்பார்க்கும் ஆண்டு வட்டி விகிதம் (%)",
    timePeriod: "முதலீட்டுக் காலம் (ஆண்டுகள்)",
    totalInvested: "மொத்த முதலீடு",
    estimatedReturns: "மதிப்பிடப்பட்ட வட்டி லாபம்",
    totalWealthValue: "மொத்த செல்வம் மதிப்பு",
    newsLetterTitle: "தினசரி சந்தை செய்திகளை மின்னஞ்சலில் பெறுக",
    newsLetterDesc: "மியூச்சுவல் ஃபண்ட் மற்றும் முதலீட்டு உலகத்தின் முக்கிய நிகழ்வுகளை உடனுக்குடன் பெற பதிவு செய்யுங்கள்.",
    subscribe: "சப்ஸ்கிரைப் செய்க",
    subscribedToast: "நன்றி! உங்கள் மின்னஞ்சல் வெற்றிகரமாக பதிவு செய்யப்பட்டது.",
    copiedToast: "லிங்க் நகலெடுக்கப்பட்டது!",
    share: "பகிர்க",
    tableOfContents: "பொருளடக்கம்",
    readTime: "வாசிக்கும் நேரம்",
    minRead: "நிமிடம் வாசிக்க",
    relatedVideos: "தொடர்புடைய வீடியோக்கள்",
    relatedNews: "தொடர்புடைய செய்திகள்",
    footerDisclaimerTitle: "முக்கிய முதலீட்டு எச்சரிக்கை",
    footerDisclaimerText: "மியூச்சுவல் ஃபண்ட் முதலீடுகள் சந்தை அபாயங்களுக்கு உட்பட்டவை. முதலீடு செய்வதற்கு முன் திட்ட ஆவணங்களை கவனமாகப் படிக்கவும். முதலீட்டு திசை மற்றும் பட்ஜெட் பத்மநாபன் வழங்கும் தகவல்கள் கல்வி நோக்கங்களுக்காக மட்டுமே.",
    copyright: "© 2026 முதலீட்டு திசை மீடியா. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
  },
  en: {
    siteName: "Muthaleetu Thisai",
    welcome: "Welcome",
    tagline: "Mutual Fund & Market News",
    budgetPadmanaban: "Budget Padmanaban Financial",
    nav: {
      home: "Home",
      articles: "Articles",
      videos: "Videos",
      news: "News",
      professionals: "Professionals",
      mutualFunds: "Mutual Funds",
      stocks: "Stock Market",
      personalFinance: "Personal Finance",
      education: "Financial Education",
      calculator: "SIP Calculator",
      quiz: "Quiz"
    },
    tickerLabel: "BREAKING NEWS",
    marketTitle: "Live Markets",
    heroBadge: "FEATURED STORY",
    featuredNews: "Featured News",
    trendingArticlesTitle: "Trending Articles",
    latestVideos: "Latest Videos",
    mutualFundNewsTitle: "Mutual Funds — News",
    stockMarketNewsTitle: "Stock Market — News",
    personalFinanceNewsTitle: "SIP & Personal Finance — News",
    mutualFundVideos: "Mutual Fund Videos",
    stockMarketVideos: "Stock Market Videos",
    sipVideos: "SIP & Investment Videos",
    financialCalculators: "Financial Calculators",
    financialCalculatorsDesc: "Essential financial tools to plan SIPs, Lump Sum investments, returns, and compound interest growth.",
    sipCalculator: "SIP Calculator",
    lumpsumCalculator: "Lump Sum Calculator",
    returnsCalculator: "Returns Calculator",
    compoundCalculator: "Compound Interest Calculator",
    searchPlaceholder: "Search videos, news... (Ctrl + K)",
    searchTitle: "Search",
    recentSearches: "Recent Searches",
    trendingSearches: "Trending Topics",
    noResults: "No results found",
    filterAll: "All",
    views: "views",
    publishedAt: "Published",
    duration: "Duration",
    watchNow: "Watch Now",
    readArticle: "Read More",
    continueWatching: "Continue Watching",
    recommendedForYou: "Recommended For You",
    newBadge: "NEW",
    sipCalculatorTitle: "SIP Investment Return Calculator",
    sipCalculatorDesc: "Calculate the power of compounding to build ₹1 Crore or reach your financial goals through disciplined monthly SIPs.",
    monthlyInvestment: "Monthly SIP Amount (₹)",
    expectedReturnRate: "Expected Annual Return Rate (%)",
    timePeriod: "Time Horizon (Years)",
    totalInvested: "Total Investment",
    estimatedReturns: "Estimated Interest Gain",
    totalWealthValue: "Total Wealth Value",
    newsLetterTitle: "Get Daily Market & Investment Insights",
    newsLetterDesc: "Subscribe to receive daily curated mutual fund updates and financial news directly in your inbox.",
    subscribe: "Subscribe",
    subscribedToast: "Thank you! You have successfully subscribed to daily updates.",
    copiedToast: "Link copied to clipboard!",
    share: "Share",
    tableOfContents: "Table of Contents",
    readTime: "Read Time",
    minRead: "min read",
    relatedVideos: "Related Videos",
    relatedNews: "Related News",
    footerDisclaimerTitle: "Regulatory Disclaimer",
    footerDisclaimerText: "Mutual Fund investments are subject to market risks, read all scheme-related documents carefully before investing. Information provided by Muthaleetu Thisai and Budget Padmanaban is for educational purposes only.",
    copyright: "© 2026 Muthaleetu Thisai Media. All rights reserved."
  }
};


/**
 * Official Videos Catalog - Budget Padmanaban YouTube Channel (@budgetpadmanaban_)
 * Channel URL: https://www.youtube.com/@budgetpadmanaban_
 * Channel ID: UCWD5lYsFycgIDyCB_EHpYOQ
 */

const CHANNEL_URL = "https://www.youtube.com/@budgetpadmanaban_";
const CHANNEL_HANDLE = "@budgetpadmanaban_";
const CHANNEL_NAME = "Budget Padmanaban";
const CHANNEL_ID = "UCWD5lYsFycgIDyCB_EHpYOQ";
const videosData = [
  {
    "id": "vid-bp-001",
    "youtubeId": "axV28NUz0VQ",
    "youtubeUrl": "https://www.youtube.com/shorts/axV28NUz0VQ",
    "isShort": true,
    "channelHandle": "@budgetpadmanaban_",
    "channelUrl": "https://www.youtube.com/@budgetpadmanaban_",
    "channelName": "Budget Padmanaban",
    "titleTamil": "School Fees கட்டமுடியலயா? | Budget Padmanaban",
    "titleEnglish": "School Fees கட்டமுடியலயா? | Budget Padmanaban",
    "title": "School Fees கட்டமுடியலயா? | Budget Padmanaban",
    "descriptionTamil": "School Fees கட்டமுடியலயா? | Budget Padmanaban",
    "descriptionEnglish": "School Fees கட்டமுடியலயா? | Budget Padmanaban",
    "description": "School Fees கட்டமுடியலயா? | Budget Padmanaban"
  }
];

const newsData = [
  {
    id: "news-001",
    slug: "sebi-new-mutual-fund-rules-2026",
    titleTamil: "SEBI புதிய மியூச்சுவல் ஃபண்ட் விதிகளை அறிவித்துள்ளது: சிறு முதலீட்டாளர்களுக்கு பெரும் நன்மை!",
    titleEnglish: "SEBI Announces New Mutual Fund Regulations: Major Advantage for Small Retail Investors!",
    summaryTamil: "இந்திய பங்கு மற்றும் பரிவர்த்தனை வாரியம் (SEBI) மியூச்சுவல் ஃபண்ட் கட்டண அமைப்பை மேலும் வெளிப்படையாக்கும் புதிய வழிகாட்டுதல்களை வெளியிட்டுள்ளது.",
    summaryEnglish: "Securities and Exchange Board of India (SEBI) has issued new guidelines to enhance transparency in Total Expense Ratios (TER) for retail mutual funds.",
    category: "mutual-funds",
    publishedAt: "2025-01-05T08:00:00.000Z",
    readTimeMinutes: 4,
    author: "Budget Padmanaban Editorial",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=70&fm=webp",
    isFeatured: true,
    isTrending: true,
    rank: "01"
  },
  {
    id: "news-002",
    slug: "rbi-monetary-policy-interest-rate-update",
    titleTamil: "ஆர்பிஐ வட்டி விகித முடிவு: வங்கி டெபாசிட்கள் மற்றும் ஹோம் லோன் இஎம்ஐ என்னவாகும்?",
    titleEnglish: "RBI Monetary Policy Stance: Impact on Fixed Deposits and Home Loan EMIs",
    summaryTamil: "இந்திய ரிசர்வ் வங்கியின் நாணயக் கொள்கைக் கூட்டத்தில் ரெப்போ வட்டி விகிதம் மாற்றமின்றி 6.50% ஆக தொடர்கிறது என ஆளுநர் அறிவித்தார்.",
    summaryEnglish: "Reserve Bank of India (RBI) Governor maintains the Repo Rate unchanged at 6.50% in the latest Monetary Policy Committee (MPC) meeting.",
    contentTamil: `
      <h2>ரிசர்வ் வங்கி அறிவிப்பின் முக்கிய அம்சங்கள்</h2>
      <p>இந்திய ரிசர்வ் வங்கி (RBI) நாட்டின் பணவீக்கத்தைக் கட்டுப்படுத்தவும் பொருளாதார வளர்ச்சியை ஊக்குவிக்கவும் தனது வட்டி விகித கொள்கையை வெளியிட்டுள்ளது.</p>
    `,
    contentEnglish: `
      <h2>Key Highlights of the RBI Announcement</h2>
      <p>The Reserve Bank of India (RBI) kept interest rates steady to balance inflation management with sustainable domestic growth.</p>
    `,
    category: "personal-finance",
    publishedAt: "2025-01-04T08:00:00.000Z",
    readTimeMinutes: 5,
    author: "பட்ஜெட் பத்மநாபன்",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=70&fm=webp",
    isFeatured: true,
    isTrending: true,
    rank: "02"
  },
  {
    id: "news-003",
    slug: "sip-investment-common-mistakes-to-avoid",
    titleTamil: "SIP முதலீட்டில் இந்த தவறுகளை ஒருபோதும் செய்யாதீர்கள்: 1 கோடி இலக்கை அடைவது எப்படி?",
    titleEnglish: "Common SIP Investment Errors to Avoid: How to Successfully Reach Your ₹1 Crore Milestone",
    summaryTamil: "முறையான SIP முதலீட்டை பாதியில் நிறுத்துவது மற்றும் சந்தை சரிவின் போது பயந்து வி விற்பது உங்கள் செல்வ உருவாக்கத்தைப் பாதிக்கும்.",
    summaryEnglish: "Stopping SIP investments during market corrections and failing to step up annually are major roadblocks to long-term compounding.",
    contentTamil: `
      <h2>SIP முதலீட்டாளர்கள் தவிர்க்க வேண்டிய 5 முக்கிய தவறுகள்</h2>
      <p>நீண்ட கால நோக்கில் கூட்டு வட்டியின் பயனைப் பெற ஒழுக்கமான முதலீடு மிக அவசியமானது.</p>
    `,
    contentEnglish: `
      <h2>5 Mistakes SIP Investors Must Avoid</h2>
      <p>Disciplined long-term investing is essential to unlock the power of compounding in equity mutual funds.</p>
    `,
    category: "investment",
    publishedAt: "2025-01-03T08:00:00.000Z",
    readTimeMinutes: 6,
    author: "பட்ஜெட் பத்மநாபன்",
    thumbnail: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=400&q=70&fm=webp",
    isFeatured: true,
    isTrending: true,
    rank: "03"
  },
  {
    id: "news-004",
    slug: "gold-price-rally-analysis-2026",
    titleTamil: "தங்கத்தின் விலை ஏன் தொடர்ந்து உயர்கிறது? சர்வதேச பொருளாதார காரணிகள் அலசல்",
    titleEnglish: "Why Gold Prices Continue to Surge: Analysis of Global Economic Factors",
    summaryTamil: "மத்திய வங்கிகளின் அதிகப்படியான தங்கம் கொள்முதல் மற்றும் உலகளாவிய பணவீக்க பயம் காரணமாக தங்கம் புதிய சாதனைகளை அடைந்துள்ளது.",
    summaryEnglish: "Increased central bank gold reserves and global macroeconomic hedge demand drive precious metal prices to historic highs.",
    contentTamil: `
      <h2>தங்க விலை உயர்வின் பின்னணி விவரங்கள்</h2>
      <p>முதலீட்டாளர்கள் தங்களின் போர்ட்ஃபோலியோவில் 10% வரை தங்கத்தில் முதலீடு செய்வதன் மூலம் பாதுகாப்பான ரிட்டர்ன்களை பெறலாம்.</p>
    `,
    contentEnglish: `
      <h2>Behind the Gold Price Rally</h2>
      <p>Financial advisors recommend allocating around 10% of portfolio assets into gold or Sovereign Gold Bonds for risk diversification.</p>
    `,
    category: "personal-finance",
    publishedAt: "2025-01-02T08:00:00.000Z",
    readTimeMinutes: 4,
    author: "Muthaleetu Thisai Research Desk",
    thumbnail: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=400&q=70&fm=webp",
    isFeatured: true,
    isTrending: true,
    rank: "04"
  },
  {
    id: "news-005",
    slug: "nifty-50-record-high-stock-market-today",
    titleTamil: "இன்றைய பங்குச்சந்தை நிலவரம்: NIFTY 50 புதிய வரலாற்று உச்சத்தை தொட்டது!",
    titleEnglish: "Stock Market Today: NIFTY 50 Touches Fresh All-Time High Driven by Banking Sector",
    summaryTamil: "வெளிநாட்டு முதலீட்டாளர்களின் (FII) தொடர் முதலீடு மற்றும் வங்கிப் பங்குகள் எழுச்சி காரணமாக இந்திய பங்குச்சந்தைகள் ஏற்றத்தில் முடிவடைந்தன.",
    summaryEnglish: "Strong foreign institutional inflows and stellar quarterly earnings in heavyweights lift benchmark indices to all-time highs.",
    contentTamil: `
      <h2>சந்தை ஏற்றத்திற்கு முக்கிய காரணங்கள்</h2>
      <p>ஐடி மற்றும் பேங்கிங் பங்குகள் சந்தையை முன்னெடுத்துச் சென்றன.</p>
    `,
    contentEnglish: `
      <h2>Factors Driving the Bull Run</h2>
      <p>Banking and IT sectors led today's market rally with robust volume support.</p>
    `,
    category: "stocks",
    publishedAt: "2025-01-01T08:00:00.000Z",
    readTimeMinutes: 3,
    author: "Budget Padmanaban Editorial",
    thumbnail: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=400&q=70&fm=webp",
    isFeatured: true,
    isTrending: true,
    rank: "05"
  }
];

const professionalsData = [
  {
    id: "budget-padmanaban",
    slug: "budget-padmanaban",
    nameTamil: "பி. பத்மநாபன் (பட்ஜெட் பத்மநாபன்)",
    nameEnglish: "B. Padmanaban (Budget Padmanaban)",
    avatar: "/assets/padmanaban.jpg",
    titleTamil: "நிறுவனர் & தலைமை நிதி வர்ணனையாளர்",
    titleEnglish: "Founder & Chief Market Commentator",
    badgeTamil: "AMFI பதிவுபெற்ற விநியோகஸ்தர் (MFD)",
    badgeEnglish: "AMFI-Registered MFD | Founder",
    organization: "Fortune Investment Services (FISPL)",
    locationTamil: "சென்னை, தமிழ்நாடு",
    locationEnglish: "Chennai, Tamil Nadu",
    experience: "15+ Years",
    bioTamil: "15+ ஆண்டுகளுக்கும் மேலாக மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை மற்றும் தனிநபர் நிதி வழிகாட்டுதலில் முன்னணி வர்ணனையாளர். வீடியோ வழிகாட்டிகள் மூலம் ஆயிரக்கணக்கான முதலீட்டாளர்களுக்கு விழிப்புணர்வு ஏற்படுத்தியுள்ளார்.",
    bioEnglish: "Founder of FISPL with 15+ years of market authority, educating retail and HNI investors on Mutual Funds, Wealth Creation & Systematic Financial Planning across video masterclasses.",
    fullBioTamil: "பி. பத்மநாபன் அவர்கள் 2008 இல் பார்ச்சூன் இன்வெஸ்ட்மென்ட் சர்வீசஸ் (FISPL) நிறுவனத்தை நிறுவி, ₹630 கோடிக்கும் அதிகமான சொத்து நிர்வாகத்தை (AUM) திறம்பட வழிநடத்தி வருகிறார். தமிழ் மற்றும் ஆங்கிலத்தில் எளிய முறையில் மியூச்சுவல் ஃபண்ட் முதலீட்டு உத்திகளை விளக்கும் இவரது காணொளிகள் லட்சக்கணக்கான முதலீட்டாளர்களின் நன்மதிப்பைப் பெற்றுள்ளன.",
    fullBioEnglish: "B. Padmanaban founded Fortune Investment Services Private Limited (FISPL) in 2008, managing over ₹630 Cr AUM with a client-first approach. Known as 'Budget Padmanaban', his market masterclasses demystify mutual funds, asset allocation, and systematic wealth compounding.",
    category: "mutual-funds",
    stats: {
      masterclasses: "800+",
      articles: 12,
      aumGuided: "₹630+ Cr",
      experienceYears: "15+ Yrs"
    },
    socialLinks: {
      youtube: "https://www.youtube.com/@budgetpadmanaban_",
      website: "https://fortuneinvestment.in",
      twitter: "https://twitter.com/budgetpadmanaban_",
      instagram: "https://www.instagram.com/budgetpadmanaban_/"
    },
    specializations: [
      { ta: "மியூச்சுவல் ஃபண்ட் & SIP", en: "Mutual Funds & SIP Planning" },
      { ta: "ரூ.1 கோடி இலக்கு திட்டமிடல்", en: "₹1 Crore Wealth Blueprint" },
      { ta: "சொத்து ஒதுக்கீடு உத்தி", en: "Strategic Asset Allocation" },
      { ta: "ஓய்வூதிய நிதி பாதுகாப்பு", en: "Retirement & Pension Architecture" }
    ],
    featuredArticleSlugs: [
      "sebi-new-mutual-fund-rules-2026",
      "sip-investment-common-mistakes-to-avoid",
      "rbi-monetary-policy-interest-rate-update"
    ]
  }
];

const marketSnapshotData = [
  { symbol: "NIFTY 50", value: "24,850.40", change: "+142.30", percent: "+0.58%", isUp: true },
  { symbol: "SENSEX", value: "81,420.10", change: "+418.50", percent: "+0.52%", isUp: true },
  { symbol: "BANK NIFTY", value: "52,110.30", change: "-64.20", percent: "-0.12%", isUp: false },
  { symbol: "GOLD 24K", value: "₹74,250", change: "+260", percent: "+0.35%", isUp: true },
  { symbol: "SILVER (1kg)", value: "₹87,100", change: "+690", percent: "+0.80%", isUp: true },
  { symbol: "NIFTY MIDCAP", value: "58,940.80", change: "+310.15", percent: "+0.53%", isUp: true }
];


export {
  OFFICIAL_CHANNEL_URL,
  OFFICIAL_CHANNEL_HANDLE,
  OFFICIAL_CHANNEL_NAME,
  translations,
  CHANNEL_URL,
  CHANNEL_HANDLE,
  CHANNEL_NAME,
  CHANNEL_ID,
  videosData,
  newsData,
  professionalsData,
  marketSnapshotData
};
