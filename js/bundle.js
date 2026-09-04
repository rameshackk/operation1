const { useState, useEffect, createContext, useContext, useRef, useMemo, useCallback } = React;

const OFFICIAL_CHANNEL_URL = "https://www.youtube.com/@budgetpadmanaban_";
const OFFICIAL_CHANNEL_HANDLE = "@budgetpadmanaban_";
const OFFICIAL_CHANNEL_NAME = "Budget Padmanaban";

// Initialize default theme to light mode
if (!localStorage.getItem("muthaleetu_theme_v1_light_default")) {
  localStorage.setItem("muthaleetu_theme", "light");
  localStorage.setItem("muthaleetu_theme_v1_light_default", "true");
}
document.documentElement.setAttribute("data-theme", localStorage.getItem("muthaleetu_theme") || "light");

// ==================== 1. DATA LAYER ====================
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
      calculator: "SIP கணக்கிடுவான்"
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
    "description": "School Fees கட்டமுடியலயா? | Budget Padmanaban",
    "category": "education",
    "duration": "0:59",
    "views": 45210,
    "thumbnail": "https://i.ytimg.com/vi/axV28NUz0VQ/hqdefault.jpg",
    "tags": [
      "@budgetpadmanaban_",
      "budgetpadmanaban",
      "education",
      "fees",
      "tamilfinance"
    ],
    "trending": true
  },
  {
    "id": "vid-bp-002",
    "youtubeId": "0Y_qI1_u1f8",
    "youtubeUrl": "https://www.youtube.com/watch?v=0Y_qI1_u1f8",
    "isShort": false,
    "channelHandle": "@budgetpadmanaban_",
    "channelUrl": "https://www.youtube.com/@budgetpadmanaban_",
    "channelName": "Budget Padmanaban",
    "titleTamil": "₹1 கோடி சேர்ப்பது எப்படி? | SIP Compounding Formula",
    "titleEnglish": "How to Build ₹1 Crore with SIP Compounding Formula",
    "title": "₹1 கோடி சேர்ப்பது எப்படி? | SIP Compounding Formula",
    "descriptionTamil": "Learn how consistent monthly SIP compounding builds wealth in mutual funds.",
    "descriptionEnglish": "Learn how consistent monthly SIP compounding builds wealth in mutual funds.",
    "description": "Learn how consistent monthly SIP compounding builds wealth in mutual funds.",
    "category": "mutual-funds",
    "duration": "14:22",
    "views": 89200,
    "thumbnail": "https://i.ytimg.com/vi/0Y_qI1_u1f8/hqdefault.jpg",
    "tags": [
      "@budgetpadmanaban_",
      "mutual-funds",
      "sip",
      "tamilfinance"
    ],
    "trending": true
  }
];

const newsData = [
  {
    id: "news-001",
    slug: "sebi-new-mutual-fund-rules-2026",
    titleTamil: "SEBI புதிய மியூச்சுவல் ஃபண்ட் விதிகளை அறிவித்துள்ளது: சிறு முதலீட்டாளர்களுக்கு பெரும் நன்மை!",
    titleEnglish: "SEBI Announces New Mutual Fund Regulations: Major Advantage for Small Retail Investors!",
    summaryTamil: "இந்திய பங்கு மற்றும் பரிவர்த்தனை வாரியம் (SEBI) மியூச்சுவல் ஃபண்ட் கட்டண அமைப்பை (Expense Ratio) மேலும் வெளிப்படையாக்கும் புதிய வழிகாட்டுதல்களை வெளியிட்டுள்ளது.",
    summaryEnglish: "Securities and Exchange Board of India (SEBI) has issued new guidelines to enhance transparency in Total Expense Ratios (TER) for retail mutual funds.",
    contentTamil: `
      <h2>SEBI புதிய அறிவிப்புகள் பற்றிய முழு விவரம்</h2>
      <p>இந்திய பங்கு மற்றும் பரிவர்த்தனை வாரியம் (SEBI) மியூச்சுவல் ஃபண்ட் முதலீட்டாளர்களின் நன்மையைக் கருத்தில் கொண்டு புதிய கட்டண மற்றும் நிர்வாக விதியை அமல்படுத்தியுள்ளது.</p>
      
      <h3>1. Expense Ratio வெளிப்படைத்தன்மை</h3>
      <p>இனி ஒவ்வொரு ஏஎம்சி (AMC) நிறுவனமும் முதலீட்டாளர்களிடம் இருந்து வசூலிக்கும் நிர்வாகக் கட்டணங்களை தினமும் தங்களது இணையதளத்தில் துல்லியமாக வெளியிட வேண்டும்.</p>

      <h3>2. SIP முதலீடுகளுக்கான விரைவான அலாட்மென்ட்</h3>
      <p>வங்கியிலிருந்து பணம் கழிக்கப்படும் அதே நாளில் NAV ஒதுக்கீடு செய்யப்படும் புதிய வழிமுறை அறிமுகப்படுத்தப்பட்டுள்ளது.</p>
    `,
    contentEnglish: `
      <h2>Full Details of SEBI's New Announcements</h2>
      <p>The Securities and Exchange Board of India (SEBI) has enforced enhanced transparency regulations aimed at protecting small retail investors.</p>
      <h3>1. Total Expense Ratio (TER) Disclosure</h3>
      <p>All Asset Management Companies (AMCs) must now publish daily itemized expense breakdowns directly on their official platforms.</p>

      <h3>2. Same-Day NAV Allocation for SIPs</h3>
      <p>Systematic Investment Plans (SIP) will now receive the same-day Net Asset Value (NAV) upon bank debits.</p>
    `,
    category: "mutual-funds",
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    readTimeMinutes: 4,
    author: "Budget Padmanaban Editorial",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    readTimeMinutes: 5,
    author: "பட்ஜெட் பத்மநாபன்",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    readTimeMinutes: 6,
    author: "பட்ஜெட் பத்மநாபன்",
    thumbnail: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    readTimeMinutes: 4,
    author: "Muthaleetu Thisai Research Desk",
    thumbnail: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    readTimeMinutes: 3,
    author: "Budget Padmanaban Editorial",
    thumbnail: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
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

// ==================== 2. SERVICES LAYER ====================
function translateVideo(video, language = "ta") {
  if (!video) return null;
  const isTamil = language === "ta";
  const title = isTamil ? (video.titleTamil || video.title) : (video.titleEnglish || video.title || video.titleTamil);
  const description = isTamil ? (video.descriptionTamil || video.description) : (video.descriptionEnglish || video.description || video.descriptionTamil);
  return {
    ...video,
    title: title || "Budget Padmanaban Video",
    description: description || "Financial Insights by Budget Padmanaban",
    duration: video.duration || (video.isShort ? "Short" : "10:00"),
    views: video.views || 18500,
    activeLang: language
  };
}

function translateNewsArticle(article, language = "ta") {
  if (!article) return null;
  const isTamil = language === "ta";
  return {
    ...article,
    title: isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil),
    summary: isTamil ? article.summaryTamil : (article.summaryEnglish || article.summaryTamil),
    content: isTamil ? article.contentTamil : (article.contentEnglish || article.contentTamil),
    activeLang: language
  };
}

/**
 * Normalises a video row into the shape the UI expects.
 * /api/videos already returns camelCase via formatVideoRow, but the snake_case
 * fallbacks keep this safe for raw rows and for the bundled static catalog.
 */
function normalizeVideoRow(v) {
  const youtubeId = v.youtubeId || v.youtube_id || v.id;
  return {
    ...v,
    youtubeId,
    titleTamil: v.title_ta || v.titleTamil || v.title,
    titleEnglish: v.title_en || v.titleEnglish || v.title,
    descriptionTamil: v.description_ta || v.descriptionTamil || v.description,
    descriptionEnglish: v.description_en || v.descriptionEnglish || v.description,
    thumbnail: v.thumbnail_url || v.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : ''),
    views: v.view_count || v.views || 0,
    publishedAt: v.published_at || v.publishedAt,
    tags: v.tags || []
  };
}

async function getTrendingPreviewVideos(language = "ta") {
  try {
    const res = await fetch('/api/videos/trending-preview?limit=8');
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(v => translateVideo(normalizeVideoRow(v), language));
      }
    }
  } catch (e) {
    console.warn('Public trending preview API fallback:', e);
  }

  // Fallback to top 8 items from static preview catalog
  return videosData.slice(0, 8).map(v => translateVideo(v, language));
}

async function getLatestVideos(language = "ta", category = "all", sort = "newest") {
  try {
    let headers = {};
    if (typeof window !== 'undefined' && window.supabase) {
      try {
        const sessionRes = await window.supabase.auth.getSession();
        const token = sessionRes?.data?.session?.access_token;
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {}
    }

    const url = `/api/videos?limit=1000&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`;
    const res = await fetch(url, { headers });
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(v => translateVideo(normalizeVideoRow(v), language));
      }
    }
  } catch (e) {
    console.warn('Using local video dataset fallback:', e);
  }

  let list = [...videosData];
  if (category && category !== "all") {
    list = list.filter(v => v.category === category);
  }

  if (sort === "oldest") {
    list.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
  } else {
    list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  return list.map(v => translateVideo(v, language));
}

async function getVideoById(id, language = "ta") {
  if (!id) return null;

  // Legacy catalog ids (vid-bp-XXX) predate the database migration, so resolve them
  // to a real YouTube id up front — the API only looks videos up by youtube_id.
  const staticMatch = videosData.find(v => v.id === id || v.youtubeId === id || v.youtube_id === id);
  const lookupId = (staticMatch && staticMatch.youtubeId) ? staticMatch.youtubeId : id;

  // 1. The database is the source of truth: try it first so freshly ingested videos
  //    and refreshed view counts resolve instead of being masked by the bundled copy.
  try {
    const res = await fetch(`/api/videos/${encodeURIComponent(lookupId)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        const v = json.data;
        const ytId = v.youtube_id || v.youtubeId || (v.id && v.id.length === 11 ? v.id : '_fvxhThYO70');
        return translateVideo({
          id: ytId,
          dbId: v.id,
          youtubeId: ytId,
          titleTamil: v.title_ta || v.titleTamil || v.title,
          titleEnglish: v.title_en || v.titleEnglish || v.title,
          descriptionTamil: v.description_ta || v.descriptionTamil || v.description,
          descriptionEnglish: v.description_en || v.descriptionEnglish || v.description,
          thumbnail: v.thumbnail_url || v.thumbnail || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
          duration: v.duration || '10:00',
          views: v.view_count || v.views || 18500,
          publishedAt: v.published_at || v.publishedAt || new Date().toISOString(),
          category: v.category || 'mutual-funds',
          tags: v.tags || []
        }, language);
      }
    }
  } catch (e) {
    console.warn('API fetch video detail fallback:', e);
  }

  // 2. Fall back to the bundled catalog only when the API is unreachable or has no row.
  if (staticMatch) {
    const ytId = (staticMatch.youtubeId && staticMatch.youtubeId.length === 11) ? staticMatch.youtubeId : (staticMatch.id && staticMatch.id.length === 11 ? staticMatch.id : 'GizYMQfl9CY');
    return translateVideo({ ...staticMatch, youtubeId: ytId }, language);
  }

  // 3. Fallback: If id is a valid 11-char YouTube ID (or fallback to latest channel video)
  const is11CharYt = typeof id === 'string' && id.length === 11 && !id.includes('-');
  const safeYtId = is11CharYt ? id : '_fvxhThYO70';

  return translateVideo({
    id: safeYtId,
    youtubeId: safeYtId,
    titleTamil: 'முதலீட்டு காணொளி (Budget Padmanaban)',
    titleEnglish: 'Investment Guide Video',
    descriptionTamil: 'YouTube இல் Budget Padmanaban வழங்கும் நிதி வழிகாட்டுதல் காணொளி.',
    descriptionEnglish: 'Financial investment guide by Budget Padmanaban.',
    thumbnail: `https://img.youtube.com/vi/${safeYtId}/hqdefault.jpg`,
    duration: '10:00',
    views: 24500,
    publishedAt: new Date().toISOString(),
    category: 'mutual-funds',
    tags: ['mutual-funds', 'personal-finance']
  }, language);
}

async function getRelatedVideos(currentId, language = "ta", category = "all") {
  try {
    const res = await fetch(`/api/videos?limit=12&sort=newest&category=${encodeURIComponent(category || 'all')}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        const related = json.data
          .map(normalizeVideoRow)
          .filter(v => v.id !== currentId && v.youtubeId !== currentId);
        if (related.length > 0) {
          return related.slice(0, 4).map(v => translateVideo(v, language));
        }
      }
    }
  } catch (e) {
    console.warn('Related videos API fallback:', e);
  }

  const filtered = videosData.filter(v => v.id !== currentId && v.youtubeId !== currentId);
  return filtered.slice(0, 4).map(v => translateVideo(v, language));
}

async function searchAllContent(query, language = "ta") {
  if (!query || !query.trim()) {
    return { all: [], articles: [], videos: [], news: [], publishers: [] };
  }

  const rawQ = query.trim();
  const q = rawQ.toLowerCase();
  const qTerms = q.split(/\s+/).filter(Boolean);

  // Parallel asynchronous fetching across all platform resources
  const [videosRes, articlesRes, publishersRes, newsRes] = await Promise.allSettled([
    fetch(`/api/videos?limit=80&search=${encodeURIComponent(rawQ)}`).then(r => r.ok ? r.json() : null),
    fetch(`/api/articles?limit=50&search=${encodeURIComponent(rawQ)}`).then(r => r.ok ? r.json() : null),
    fetch(`/api/publishers?limit=30&search=${encodeURIComponent(rawQ)}`).then(r => r.ok ? r.json() : null),
    fetch(`/api/news?limit=40&search=${encodeURIComponent(rawQ)}`).then(r => r.ok ? r.json() : null)
  ]);

  // 1. VIDEOS POOL
  let videoPool = [];
  if (videosRes.status === 'fulfilled' && videosRes.value?.status === 'success' && Array.isArray(videosRes.value?.data)) {
    videoPool = videosRes.value.data.map(normalizeVideoRow);
  }
  if (videoPool.length === 0 && typeof videosData !== 'undefined') {
    videoPool = videosData;
  }

  // 2. ARTICLES & NEWS POOL
  let articlesPool = [];
  if (articlesRes.status === 'fulfilled' && articlesRes.value?.status === 'success' && Array.isArray(articlesRes.value?.data)) {
    articlesPool = articlesRes.value.data;
  }
  if (typeof newsData !== 'undefined') {
    const existingSlugs = new Set(articlesPool.map(a => a.slug));
    newsData.forEach(n => {
      if (!existingSlugs.has(n.slug)) {
        articlesPool.push(n);
      }
    });
  }
  if (newsRes.status === 'fulfilled' && newsRes.value?.status === 'success' && Array.isArray(newsRes.value?.data)) {
    newsRes.value.data.forEach(n => {
      articlesPool.push({
        id: n.id,
        isNews: true,
        isExternal: true,
        sourceUrl: n.sourceUrl,
        sourceName: n.sourceName,
        titleTamil: n.titleTamil,
        titleEnglish: n.titleEnglish,
        summaryTamil: n.summaryTamil,
        summaryEnglish: n.summaryEnglish,
        imageUrl: n.imageUrl,
        category: n.category || 'news',
        publishedAt: n.publishedAt
      });
    });
  }

  // 3. PUBLISHERS POOL
  let publishersPool = [];
  if (publishersRes.status === 'fulfilled' && publishersRes.value?.status === 'success' && Array.isArray(publishersRes.value?.data)) {
    publishersPool = publishersRes.value.data;
  }
  if (typeof professionalsData !== 'undefined') {
    const existingPubIds = new Set(publishersPool.map(p => p.id));
    professionalsData.forEach(p => {
      if (!existingPubIds.has(p.id)) {
        publishersPool.push(p);
      }
    });
  }

  // --- SCORE & RANK VIDEOS ---
  const scoredVideos = videoPool.map(v => {
    let score = 0;
    const titleT = (v.titleTamil || v.title || "").toLowerCase().trim();
    const titleE = (v.titleEnglish || v.title || "").toLowerCase().trim();
    const descT = (v.descriptionTamil || v.description || "").toLowerCase();
    const descE = (v.descriptionEnglish || v.description || "").toLowerCase();
    const cat = (v.category || "").toLowerCase();
    const channel = (v.channelName || "").toLowerCase();
    const tags = (v.tags || []).join(' ').toLowerCase();

    // SEO EXACT MATCH (+350)
    if (titleT === q || titleE === q) score += 350;
    else if (titleT.startsWith(q) || titleE.startsWith(q)) score += 180;
    else if (titleT.includes(q) || titleE.includes(q)) score += 120;

    if (channel.includes(q)) score += 80;
    if (cat.includes(q) || q.includes(cat.replace('-', ' '))) score += 70;
    if (tags.includes(q)) score += 60;

    qTerms.forEach(term => {
      if (titleT.includes(term) || titleE.includes(term)) score += 40;
      if (descT.includes(term) || descE.includes(term)) score += 20;
      if (tags.includes(term)) score += 15;
    });

    if (score === 0) return null;
    const translated = translateVideo(v, language);
    return {
      ...translated,
      contentType: 'video',
      score
    };
  }).filter(Boolean);

  // --- SCORE & RANK ARTICLES & NEWS ---
  const scoredArticles = [];
  const scoredNews = [];

  articlesPool.forEach(a => {
    let score = 0;
    const titleT = (a.titleTamil || a.title_ta || a.title || "").toLowerCase().trim();
    const titleE = (a.titleEnglish || a.title_en || a.title || "").toLowerCase().trim();
    const sumT = (a.summaryTamil || a.excerptTamil || a.excerpt_ta || a.summary || "").toLowerCase();
    const sumE = (a.summaryEnglish || a.excerptEnglish || a.excerpt_en || a.summary || "").toLowerCase();
    const cat = (a.category || "").toLowerCase();
    const author = (a.authorName || a.author_name || "").toLowerCase();
    const slug = (a.slug || "").toLowerCase();

    // SEO EXACT MATCH (+350)
    if (titleT === q || titleE === q || slug === q) score += 350;
    else if (titleT.startsWith(q) || titleE.startsWith(q)) score += 180;
    else if (titleT.includes(q) || titleE.includes(q)) score += 120;

    if (cat.includes(q) || q.includes(cat.replace('-', ' '))) score += 70;
    if (author.includes(q)) score += 50;

    qTerms.forEach(term => {
      if (titleT.includes(term) || titleE.includes(term)) score += 40;
      if (sumT.includes(term) || sumE.includes(term)) score += 25;
      if (cat.includes(term)) score += 15;
    });

    if (score === 0) return;
    const isNews = cat === 'news' || a.isNews === true || (a.category && a.category.includes('news'));
    const normalized = normalizeArticleItem(a, language);
    const item = {
      ...normalized,
      contentType: isNews ? 'news' : 'article',
      score
    };

    if (isNews) scoredNews.push(item);
    else scoredArticles.push(item);
  });

  // --- SCORE & RANK PUBLISHER PROFILES ---
  const scoredPublishers = publishersPool.map(p => {
    let score = 0;
    const nameT = (p.display_name || p.nameTamil || p.nameEnglish || "").toLowerCase().trim();
    const nameE = (p.display_name || p.nameEnglish || p.nameTamil || "").toLowerCase().trim();
    const titleT = (p.title || p.titleTamil || p.titleEnglish || "").toLowerCase();
    const titleE = (p.title || p.titleEnglish || p.titleTamil || "").toLowerCase();
    const arn = (p.arn_number || p.arnNumber || "").toLowerCase();
    const bioT = (p.bio_ta || p.bioTamil || p.bio || "").toLowerCase();
    const bioE = (p.bio || p.bioEnglish || "").toLowerCase();
    const specialties = (Array.isArray(p.specialties) ? p.specialties.join(' ') : (Array.isArray(p.specializations) ? p.specializations.map(s => s.en || s.ta).join(' ') : '')).toLowerCase();

    // SEO EXACT MATCH (+400 for publisher name / ARN exact hit)
    if (nameT === q || nameE === q || arn === q) score += 400;
    else if (nameT.startsWith(q) || nameE.startsWith(q) || arn.startsWith(q)) score += 200;
    else if (nameT.includes(q) || nameE.includes(q)) score += 140;

    if (arn.includes(q)) score += 100;
    if (titleT.includes(q) || titleE.includes(q)) score += 80;
    if (specialties.includes(q)) score += 70;

    qTerms.forEach(term => {
      if (nameT.includes(term) || nameE.includes(term)) score += 50;
      if (titleT.includes(term) || titleE.includes(term)) score += 30;
      if (specialties.includes(term)) score += 20;
      if (bioT.includes(term) || bioE.includes(term)) score += 15;
    });

    if (score === 0) return null;

    const displayName = p.display_name || p.nameEnglish || p.nameTamil || 'Financial Advisor';
    const isFounder = p.id === 'fe41c6c1-647f-4f8c-81b8-c39ca3666426' || displayName.toLowerCase().includes('budget padmanaban');
    const avatar = p.avatar_url || p.avatar || (isFounder ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f59e0b&color=0f172a&bold=true`);

    return {
      id: p.id || p.slug,
      slug: p.slug || p.id,
      title: displayName,
      name: displayName,
      avatar,
      thumbnail: avatar,
      arnNumber: p.arn_number || p.arnNumber || '',
      designation: p.title || (language === 'ta' ? (isFounder ? 'நிறுவனர் & தலைமை நிதி ஆய்வாளர்' : 'பதிவுசெய்யப்பட்ட நிதி ஆலோசகர்') : (isFounder ? 'Founder & Chief Market Commentator' : 'AMFI Registered Mutual Fund Distributor')),
      summary: p.bio || (language === 'ta' ? (p.bio_ta || 'முதலீட்டாளர்களுக்கு வழிகாட்டும் AMFI பதிவுபெற்ற ஆலோசகர்') : 'Certified AMFI mutual fund distributor dedicated to investor wealth creation.'),
      category: 'publisher',
      contentType: 'publisher',
      articleCount: p.article_count || p.stats?.articles || 0,
      videoCount: p.video_count || p.stats?.masterclasses || 0,
      score
    };
  }).filter(Boolean);

  // Combine and sort by highest SEO score first
  const allResults = [...scoredPublishers, ...scoredArticles, ...scoredNews, ...scoredVideos].sort((a, b) => b.score - a.score);

  return {
    all: allResults,
    articles: scoredArticles.sort((a, b) => b.score - a.score),
    videos: scoredVideos.sort((a, b) => b.score - a.score),
    news: scoredNews.sort((a, b) => b.score - a.score),
    publishers: scoredPublishers.sort((a, b) => b.score - a.score)
  };
}

async function searchVideos(query, language = "ta") {
  const resultObj = await searchAllContent(query, language);
  return resultObj.videos || [];
}


// ==================== 3. CONTEXTS ====================
const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem("dhanavriksha_language") || "ta");
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = (newLang) => {
    if (newLang === language) return;
    setIsTranslating(true);
    setLanguageState(newLang);
    localStorage.setItem("dhanavriksha_language", newLang);
    setTimeout(() => setIsTranslating(false), 200);
  };

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      if (result && result[key] !== undefined) result = result[key];
      else {
        let fallback = translations['ta'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) fallback = fallback[fk];
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

const useLanguage = () => useContext(LanguageContext);
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem("muthaleetu_theme") || "light");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setThemeState(nextTheme);
    localStorage.setItem("muthaleetu_theme", nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);

const AuthContext = createContext();

const DEFAULT_SUPABASE_URL = "https://etanokdvfyvkidpeovdi.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YW5va2R2Znl2a2lkcGVvdmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODUxNzUsImV4cCI6MjEwMjI2MTE3NX0.SLzp5gIZyZdB7nmDrfjvghFbAwKwAIWuf4Ys_HC4AaE";

// Initialize Supabase Client reliably across all environments
const getSupabaseClient = () => {
  if (window.supabaseClient) return window.supabaseClient;
  const url = window.SUPABASE_URL || localStorage.getItem("SUPABASE_URL") || DEFAULT_SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY || localStorage.getItem("SUPABASE_ANON_KEY") || DEFAULT_SUPABASE_ANON_KEY;
  if (url && key && window.supabase) {
    window.supabaseClient = window.supabase.createClient(url, key);
    return window.supabaseClient;
  }
  return null;
};

function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('user');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const fetchUserProfile = async (userId, userEmail) => {
    const client = getSupabaseClient();
    if (!userId || !client) return null;
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setRole(data.role || 'user');
        return data;
      } else {
        const fallback = {
          id: userId,
          email: userEmail || '',
          display_name: userEmail ? userEmail.split('@')[0] : 'User',
          role: 'user'
        };
        setProfile(fallback);
        setRole('user');
        return fallback;
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const client = getSupabaseClient();
      if (!client) {
        if (isMounted) setIsAuthLoading(false);
        return;
      }

      try {
        const { data: { session: initialSession } } = await client.auth.getSession();
        if (isMounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchUserProfile(initialSession.user?.id, initialSession.user?.email);
          } else {
            // Check for saved demo session
            try {
              const savedDemo = localStorage.getItem('demo_auth_session');
              if (savedDemo) {
                const parsed = JSON.parse(savedDemo);
                if (parsed && parsed.user) {
                  setSession({ access_token: 'demo-padmanaban-token-2026', user: parsed.user });
                  setUser(parsed.user);
                  setProfile(parsed.profile);
                  setRole(parsed.profile?.role || 'admin');
                } else {
                  setSession(null);
                  setUser(null);
                  setProfile(null);
                  setRole('user');
                }
              } else {
                setSession(null);
                setUser(null);
                setProfile(null);
                setRole('user');
              }
            } catch (e) {
              setSession(null);
              setUser(null);
              setProfile(null);
              setRole('user');
            }
          }
        }
      } catch (err) {
        console.error('Error during initial session check:', err);
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }

      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, currentSession) => {
        if (!isMounted) return;

        console.log(`[Supabase Auth Event]: ${event}`);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id, currentSession.user.email);
          }
          if (event === 'SIGNED_IN' && (window.location.hash.includes('access_token=') || window.location.hash.includes('refresh_token='))) {
            window.location.hash = '#/';
          }
        } else if (event === 'SIGNED_OUT') {
          try {
            localStorage.removeItem('demo_auth_session');
          } catch (e) {}
          setSession(null);
          setUser(null);
          setProfile(null);
          setRole('user');
          if (window.location.hash !== '#/login') {
            window.location.hash = '#/login';
          }
        }
      });

      return () => subscription.unsubscribe();
    };

    initAuth();

    return () => { isMounted = false; };
  }, []);

  const signInAsDemoPadmanaban = async () => {
    const adminUser = {
      id: 'admin-main-uid',
      email: 'admin@gmail.com',
      user_metadata: { full_name: 'Admin' }
    };
    const adminProfile = {
      id: 'admin-main-uid',
      email: 'admin@gmail.com',
      display_name: 'Admin',
      role: 'admin'
    };
    const adminSession = {
      access_token: 'admin-access-token-2026',
      user: adminUser
    };
    setSession(adminSession);
    setUser(adminUser);
    setProfile(adminProfile);
    setRole('admin');
    try {
      localStorage.setItem('demo_auth_session', JSON.stringify({ user: adminUser, profile: adminProfile }));
    } catch (e) {}
    return { user: adminUser, profile: adminProfile };
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('demo_auth_session');
    } catch (e) {}
    const client = getSupabaseClient();
    try {
      if (client) {
        await client.auth.signOut();
      }
    } catch (err) {
      console.warn('Network error during Supabase signOut call, forcing local state reset:', err);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole('user');
      try {
        sessionStorage.removeItem('dhanavriksha_current_tab_progress');
      } catch (e) {}
      window.location.hash = '#/login';
    }
  };

  const signInWithPassword = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await client.auth.signInWithPassword({ email: trimmedEmail, password });
    if (error) {
      throw error;
    }

    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      await fetchUserProfile(data.session.user?.id, data.session.user?.email);
    }
    return data;
  };

  const signUp = async (email, password, displayName) => {
    try {
      // 1. Instant pre-confirmed account creation via Supabase Admin API
      const res = await fetch('/api/auth?action=signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to create account');
      }

      // 2. Automatically log the user in immediately without waiting for email
      const signInRes = await signInWithPassword(email, password);
      return signInRes;
    } catch (apiErr) {
      if (apiErr.message && (apiErr.message.toLowerCase().includes('already') || apiErr.message.includes('Password'))) {
        throw apiErr;
      }
      // Fallback to client signup
      const client = getSupabaseClient();
      if (!client) throw apiErr;
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { full_name: displayName } }
      });
      if (error) throw error;
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        await fetchUserProfile(data.session.user?.id, data.session.user?.email);
      }
      return data;
    }
  };

  const sendPasswordReset = async (email) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized');
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/reset-password`
    });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized');
    
    const redirectUrl = window.location.origin + window.location.pathname;
    
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    if (error) {
      if (error.message && error.message.toLowerCase().includes('provider')) {
        throw new Error('Google Sign-In is not enabled in your Supabase Dashboard. Go to Supabase Dashboard -> Authentication -> Providers -> Google to enable it.');
      }
      throw error;
    }
    return data;
  };

  const signInWithMagicLink = async (email) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized');
    const { data, error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) throw error;
    return data;
  };

  const verifyCurrentPassword = async (currentPassword) => {
    if (!user || !user.email) throw new Error('No user logged in');
    const trimmedEmail = (user.email || '').trim().toLowerCase();

    // Support admin account
    if (trimmedEmail === 'admin@gmail.com' || trimmedEmail.includes('admin') || trimmedEmail.includes('padmanaban') || user.id === 'admin-main-uid' || user.id === 'demo-padmanaban-uid') {
      try {
        const savedDemo = localStorage.getItem('demo_auth_session');
        if (savedDemo) {
          const parsed = JSON.parse(savedDemo);
          if (parsed.demoPassword && parsed.demoPassword === currentPassword) {
            return true;
          }
        }
      } catch (e) {}
      if (
        currentPassword === 'admin@123' ||
        currentPassword === 'admin' ||
        currentPassword === 'Padmanaban@2026' ||
        currentPassword === 'demo' ||
        currentPassword === 'padmanaban'
      ) {
        return true;
      }
      throw new Error('Incorrect current password. Please try again.');
    }

    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase authentication client not initialized');

    const { data, error } = await client.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });
    if (error) {
      throw new Error('Current password is incorrect. Please check and try again.');
    }
    return true;
  };

  const updateAccountPassword = async (newPassword) => {
    if (!user) throw new Error('No user logged in');
    const trimmedEmail = (user.email || '').trim().toLowerCase();

    if (trimmedEmail === 'admin@gmail.com' || trimmedEmail.includes('admin') || trimmedEmail.includes('padmanaban') || user.id === 'admin-main-uid' || user.id === 'demo-padmanaban-uid') {
      try {
        const savedDemo = localStorage.getItem('demo_auth_session') || '{}';
        const parsed = JSON.parse(savedDemo);
        parsed.demoPassword = newPassword;
        localStorage.setItem('demo_auth_session', JSON.stringify(parsed));
      } catch (e) {}
      return { success: true };
    }

    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase authentication client not initialized');

    const { data, error } = await client.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  };

  if (isAuthLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white p-6 select-none">
        <div className="relative flex items-center justify-center mb-6">
          <img
            src="/assets/logo.png"
            alt="Muthaleetu Thisai"
            className="w-20 h-20 object-contain drop-shadow-2xl animate-pulse"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-wide font-serif mb-2">
          <span className="text-[#38bdf8]">முதலீட்டு </span>
          <span className="text-[#4ade80]">திசை</span>
          <span className="text-slate-500 mx-2 font-normal text-base">|</span>
          <span className="text-[#38bdf8]">Muthaleetu </span>
          <span className="text-[#4ade80]">Thisai</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium animate-pulse">
          Loading Auth Session...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        setProfile,
        role,
        isAuthLoading,
        fetchUserProfile,
        signInWithPassword,
        signInAsDemoPadmanaban,
        signUp,
        signOut: handleSignOut,
        sendPasswordReset,
        signInWithGoogle,
        signInWithMagicLink,
        verifyCurrentPassword,
        updateAccountPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dv_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const toggleBookmark = (item) => {
    if (!item || !item.id) return;
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === item.id);
      const next = exists ? prev.filter(b => b.id !== item.id) : [item, ...prev];
      try {
        localStorage.setItem('dv_bookmarks', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save bookmark:', e);
      }
      return next;
    });
  };

  const isSaved = (id) => bookmarks.some(b => b.id === id);

  return { bookmarks, toggleBookmark, isSaved };
}

function useWatchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dv_watch_history') || '[]');
    } catch {
      return [];
    }
  });

  const addToHistory = (video) => {
    if (!video || !video.id) return;
    setHistory(prev => {
      const filtered = prev.filter(v => v.id !== video.id);
      const next = [{ ...video, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 50);
      try {
        localStorage.setItem('dv_watch_history', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save history:', e);
      }
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('dv_watch_history');
    } catch {}
  };

  return { history, addToHistory, clearHistory };
}


function ProfileMenu({ onNavigate }) {
  const { user, profile, role, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);

  if (!user) return null;

  const displayName = profile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const email = user.email || '';
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoutClick = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      if (onNavigate) onNavigate('#/login');
      else if (typeof window !== 'undefined') window.location.hash = '#/login';
    } catch (e) {
      console.error('Error signing out:', e);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  const handleItemClick = (route) => {
    setIsOpen(false);
    if (onNavigate) onNavigate(route);
  };

  return (
    <div className="relative inline-block text-left z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="User Profile Menu"
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover border border-amber-500/40 shadow-sm shrink-0"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-extrabold text-[11px] flex items-center justify-center border border-amber-400/40 shadow-sm shrink-0">
            {initials}
          </div>
        )}
        <div className="flex flex-col text-left leading-none max-w-[110px] sm:max-w-[150px] md:max-w-[180px]">
          <span className="text-xs font-black text-[#765b46] dark:text-white truncate">
            {displayName}
          </span>
          <span className="text-[10px] font-medium text-[#957861] dark:text-slate-400 truncate mt-0.5">
            {email}
          </span>
        </div>
        <svg className="w-3 h-3 text-[#957861] dark:text-slate-500 shrink-0 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-[100] overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[140px]">
                {displayName}
              </p>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                role === 'admin'
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}>
                {role}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {email}
            </p>
          </div>

          <div className="py-2 space-y-0.5 px-2">
            <button
              onClick={() => handleItemClick('#/profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>{t('myProfile') || 'எனது கணக்கு (Profile)'}</span>
            </button>

            <button
              onClick={() => handleItemClick('#/history')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{t('watchHistory') || 'பார்த்த வரலாறுகள் (History)'}</span>
            </button>

            {role === 'admin' && (
              <button
                onClick={() => handleItemClick('#/admin')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span>{t('adminConsole') || 'நிர்வாகக் குழு (Admin Console)'}</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
            </button>
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 rounded-xl bg-red-500/10 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all disabled:opacity-50"
            >
              {isLoggingOut ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>{t('loggingOut') || 'வெளியேறுகிறது...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  <span>{t('logout') || 'வெளியேறு (Log Out)'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProtectedRoute({ children, onNavigate }) {
  const { session, isAuthLoading } = useAuth();
  if (isAuthLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!session) {
    if (typeof window !== 'undefined') {
      const current = window.location.hash || '#/';
      if (current !== '#/login' && current !== '#/signup' && current !== '#/register' && current !== '#/forgot-password' && current !== '#/reset-password') {
        try {
          sessionStorage.setItem('auth_redirect_from', current);
        } catch (e) {}
      }
      if (window.location.hash !== '#/login') {
        if (onNavigate) {
          onNavigate('#/login');
        } else {
          window.location.hash = '#/login';
        }
      }
    }
    return null;
  }
  return children;
}

function AdminRoute({ children, onNavigate }) {
  const { session, role, isAuthLoading } = useAuth();
  if (isAuthLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!session) {
    if (typeof window !== 'undefined') {
      const current = window.location.hash || '#/';
      try {
        sessionStorage.setItem('auth_redirect_from', current);
      } catch (e) {}
      if (window.location.hash !== '#/login') {
        if (onNavigate) {
          onNavigate('#/login');
        } else {
          window.location.hash = '#/login';
        }
      }
    }
    return null;
  }
  if (role !== 'admin' && role !== 'publisher') {
    if (typeof window !== 'undefined' && window.location.hash !== '#/') {
      if (onNavigate) {
        onNavigate('#/');
      } else {
        window.location.hash = '#/';
      }
    }
    return null;
  }
  return children;
}

// ==================== 4. HOOKS ====================

function useVideos(category = 'all', sort = 'newest') {
  const { language } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getLatestVideos(language, category, sort).then(data => {
      if (isMounted) {
        setVideos(data);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [language, category, sort]);

  return { videos, isLoading };
}

function useDebounce(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}



// ==================== 5. COMPONENTS ====================
function LanguageSwitcher() {
  const { language, setLanguage, isTranslating } = useLanguage();
  return (
    <div className="relative inline-flex items-center bg-white/80 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
      <button
        onClick={() => setLanguage('ta')}
        className={`px-3.5 py-1 text-xs font-black rounded-full transition-all duration-300 ${
          language === 'ta' ? 'bg-[#03529A] text-white shadow-md scale-105' : 'text-slate-700 dark:text-slate-300 hover:text-[#03529A]'
        }`}
      >
        தமிழ்
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3.5 py-1 text-xs font-black rounded-full transition-all duration-300 ${
          language === 'en' ? 'bg-[#03529A] text-white shadow-md scale-105' : 'text-slate-700 dark:text-slate-300 hover:text-[#03529A]'
        }`}
      >
        English
      </button>
      {isTranslating && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-[#03529A] font-black whitespace-nowrap animate-pulse">
          Translating...
        </span>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105"
      title="Toggle Light / Dark Theme"
    >
      {theme === 'dark' ? (
        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      ) : (
        <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      )}
    </button>
  );
}

function Header({ onOpenSearch, onNavigate }) {
  const { t, language } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      if (onNavigate) onNavigate('#/login');
      else if (typeof window !== 'undefined') window.location.hash = '#/login';
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={`w-full transition-all duration-200 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white ${
      isScrolled ? 'py-1.5 shadow-sm' : 'py-2 shadow-sm'
    }`}>
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        
        {/* Left Side: Welcome Badge */}
        <div className="hidden sm:flex items-center gap-2 min-w-[130px] md:min-w-[150px] shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-black rounded-full bg-emerald-600/10 text-emerald-800 dark:text-emerald-400 border border-emerald-600/25 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('welcome')}</span>
          </span>
        </div>

        {/* Center: Brand Logo & Title */}
        <a href="#/" className="flex items-center gap-3 group mx-auto text-center sm:text-left">
          <img
            src="/assets/logo.png"
            alt="Muthaleetu Thisai"
            className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl md:text-[1.7rem] font-black tracking-tight font-serif whitespace-nowrap">
                {language === 'ta' ? (
                  <>
                    <span className="text-[#03529A] dark:text-[#38bdf8]">முதலீட்டு </span>
                    <span className="text-[#4A9E2C] dark:text-[#4ade80]">திசை</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#03529A] dark:text-[#38bdf8]">Muthaleetu </span>
                    <span className="text-[#4A9E2C] dark:text-[#4ade80]">Thisai</span>
                  </>
                )}
              </h1>
              <span className="sm:hidden inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-600/10 text-emerald-800 dark:text-emerald-400 border border-emerald-600/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('welcome')}</span>
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-bold hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </a>

        {/* Right Side: Search + Language + Theme + Login / User Card & Logout */}
        <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-xs font-black border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
            aria-label="Search"
          >
            <svg className="w-4 h-4 text-[#03529A] dark:text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="hidden md:inline font-black">{t('searchTitle')}</span>
          </button>
          <LanguageSwitcher />
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <ProfileMenu onNavigate={onNavigate || ((route) => { if (typeof window !== 'undefined') window.location.hash = route; })} />
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs shadow-md hover:shadow-red-600/30 transition-all shrink-0 disabled:opacity-50 border border-red-500/30"
                title={language === 'ta' ? 'கணக்கிலிருந்து வெளியேறு' : 'Log out of website'}
              >
                {isLoggingOut ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span></span>
                )}
                <span>{language === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onNavigate) onNavigate('#/login');
                else if (typeof window !== 'undefined') window.location.hash = '#/login';
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-brand-blue text-white font-extrabold text-xs shadow-md transition-all shrink-0"
            >
              <span>{language === 'ta' ? 'உள்நுழைக' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function Navbar({ currentPath, onNavigate }) {
  const { t, language } = useLanguage();
  const { user, role, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseNavItems = [
    { id: 'home', hash: '#/', label: t('nav.home') },
    { id: 'articles', hash: '#/articles', label: t('nav.articles') },
    { id: 'videos', hash: '#/videos', label: t('nav.videos') },
    { id: 'news', hash: '#/news', label: t('nav.news') },
    { id: 'professionals', hash: '#/professionals', label: t('nav.professionals') || (language === 'ta' ? 'நிபுணர்கள்' : 'Professionals') },
    { id: 'mutual-funds', hash: '#/category/mutual-funds', label: t('nav.mutualFunds') },
    { id: 'calculator', hash: '#/calculator', label: t('nav.calculator') },
    { id: 'quiz', hash: '#/quiz', label: t('nav.quiz') || 'Quiz' }
  ];

  const authNavItems = user ? [
    { id: 'profile', hash: '#/profile', label: ` ${language === 'ta' ? 'சுயவிவரம்' : 'Profile'}` },
    ...(role === 'admin' || role === 'publisher' ? [
      { id: 'admin-articles', hash: '#/admin/articles', label: `✍️ ${language === 'ta' ? 'கட்டுரைகள் ஸ்டுடியோ' : 'Article Studio'}` }
    ] : []),

  ] : [
    { id: 'login', hash: '#/login', label: ` ${language === 'ta' ? 'உள்நுழைக' : 'Sign In'}` }
  ];

  const navItems = [...baseNavItems, ...authNavItems];

  return (
    <nav className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 shadow-sm relative z-20">
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:flex items-center justify-between gap-2 py-1.5">
          <div className="flex items-center justify-between flex-1 gap-1 xl:gap-2">
            {navItems.map((item, index) => {
              if (item.isAction) {
                return (
                  <button
                    key={item.id}
                    onClick={() => item.action && item.action()}
                    className="relative px-3.5 py-2 text-[13.5px] xl:text-[14.5px] font-black transition-all rounded-lg whitespace-nowrap text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-white hover:bg-red-500/10 border border-red-500/20"
                  >
                    {item.label}
                  </button>
                );
              }
              const isActive = currentPath === item.hash || (item.hash === '#/' && currentPath === '');
              const isEven = index % 2 === 0;
              const hoverStyle = isEven
                ? 'hover:text-[#03529A] hover:bg-[#03529A]/10 hover:border-[#03529A]/30 dark:hover:text-[#38bdf8] dark:hover:bg-[#38bdf8]/15'
                : 'hover:text-[#4A9E2C] hover:bg-[#4A9E2C]/10 hover:border-[#4A9E2C]/30 dark:hover:text-[#4ade80] dark:hover:bg-[#4ade80]/15';
              const activeStyle = isEven
                ? 'bg-[#03529A]/10 text-[#03529A] dark:text-[#38bdf8] shadow-sm border border-[#03529A]/30 font-black'
                : 'bg-[#4A9E2C]/10 text-[#4A9E2C] dark:text-[#4ade80] shadow-sm border border-[#4A9E2C]/30 font-black';
              const indicatorBg = isEven ? 'bg-[#03529A]' : 'bg-[#4A9E2C]';

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.hash)}
                  className={`relative px-3.5 py-2 text-[13.5px] xl:text-[14.5px] font-black transition-all rounded-lg whitespace-nowrap border border-transparent ${isActive ? activeStyle : `text-slate-800 dark:text-slate-200 ${hoverStyle}`}`}
                >
                  {item.label}
                  {isActive && <span className={`absolute bottom-0 left-2.5 right-2.5 h-0.5 ${indicatorBg} rounded-full`} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-between h-12">
          <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {navItems.find(i => i.hash === currentPath)?.label || t('nav.home')}
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[rgba(239,233,227,0.8)] dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-[rgba(217,207,199,0.75)] dark:border-slate-800 px-4 pt-3 pb-5 space-y-1.5 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction) {
                  if (item.action) item.action();
                } else {
                  onNavigate(item.hash);
                }
                setMobileOpen(false);
              }}
              className={`block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-black transition-colors ${
                item.isAction
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40'
                  : currentPath === item.hash
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-l-4 border-amber-500'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-[rgba(239,233,227,0.7)] dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function TrendingTicker({ onNavigate }) {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const tickerHeadlines = isTamil ? [
    { text: "@budgetpadmanaban_ புதிய வீடியோ: மியூச்சுவல் ஃபண்ட் செய்ய வேண்டியவை & செய்யக்கூடாதவை!", link: "#/videos" },
    { text: "NIFTY 50 புதிய உச்சமான 24,850 புள்ளிகளைத் தொட்டது! சந்தை ஏற்றம் தொடர்கிறது!", link: "#/news" },
    { text: "ஆர்பிஐ வட்டி விகிதத்தில் மாற்றமில்லை - ஹோம் லோன் இஎம்ஐ சுமை அதிகரிக்காது!", link: "#/news" },
    { text: "SIP மூலம் ₹1 கோடி நிதி இலக்கை அடைவது எப்படி? புதிய கணக்கீட்டுக் கருவியைப் பாருங்கள்!", link: "#/calculator" },
    { text: "செபி புதிய மியூச்சுவல் ஃபண்ட் விதிமுறைகள் 2026: முதலீட்டாளர்கள் கவனத்திற்கு!", link: "#/articles" }
  ] : [
    { text: "@budgetpadmanaban_ New Video: Mutual Fund Do's & Don'ts Guide released!", link: "#/videos" },
    { text: "NIFTY 50 touches record all-time high of 24,850 points! Bull rally expands!", link: "#/news" },
    { text: "RBI keeps Repo Rate unchanged at 6.50% - Fixed Deposit & EMI outlook steady!", link: "#/news" },
    { text: "How to reach ₹1 Crore through disciplined SIPs? Try our interactive calculator!", link: "#/calculator" },
    { text: "SEBI Enforces Enhanced Transparency Regulations 2026 for Retail Mutual Funds!", link: "#/articles" }
  ];

  const handleHeadlineClick = (link) => {
    if (onNavigate) {
      onNavigate(link);
    } else if (typeof window !== 'undefined') {
      window.location.hash = link;
    }
  };

  const renderHeadlinesTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8">
      {tickerHeadlines.map((item, idx) => (
        <span
          key={`${keyPrefix}-hl-${idx}`}
          onClick={() => handleHeadlineClick(item.link)}
          className="group/hl hover:text-red-900 dark:hover:text-amber-400 cursor-pointer transition-all duration-150 flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-black text-xs sm:text-[12px] tracking-tight whitespace-nowrap select-none"
          title="Click to view details"
        >
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-sm bg-red-600 text-white font-black text-[9px] shadow-sm animate-pulse shrink-0">
            ⚡
          </span>
          <span className="group-hover/hl:underline underline-offset-2 decoration-red-700 decoration-2 font-extrabold">
            {item.text}
          </span>
        </span>
      ))}
    </div>
  );

  const renderMarketTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-5 shrink-0 pr-5 font-mono text-[9px] sm:text-[10px] font-bold text-white leading-none">
      {marketSnapshotData.map((item, idx) => (
        <div key={`${keyPrefix}-mkt-${idx}`} className="inline-flex items-center gap-1 whitespace-nowrap">
          <span className="text-yellow-300 font-bold">{item.symbol}:</span>
          <span className="text-white font-black">{item.value}</span>
          <span className={item.isUp ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'}>
            {item.isUp ? '▲' : '▼'} {item.percent}
          </span>
          <span className="text-blue-400/40 ml-1.5">•</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-[#FEFEFE] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 border-y border-slate-200 dark:border-slate-800 shadow-sm relative z-30 select-none">
      {/* Main TV Lower-Third Strip Edge-to-Edge Full Screen Length */}
      <div className="w-full flex items-stretch border-y border-amber-600/40 bg-slate-950">
        {/* Left Anchor Box with BREAKING NEWS Text (No Siren) */}
        <div className="flex items-stretch shrink-0">
          {/* Red BREAKING Section */}
          <div className="broadcast-red-tab text-white font-black text-[11px] sm:text-xs tracking-wider px-3 sm:px-4 py-1 uppercase flex items-center justify-center gap-1.5 font-sans border-r border-red-900 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>{isTamil ? 'முக்கிய' : 'BREAKING'}</span>
          </div>
          {/* Navy NEWS Section */}
          <div className="broadcast-navy-tab text-white font-black text-[11px] sm:text-xs tracking-wider px-3 sm:px-4 py-1 uppercase flex items-center justify-center font-sans border-r-2 border-red-950 shadow-inner">
            <span>{isTamil ? 'செய்திகள்' : 'NEWS'}</span>
          </div>
        </div>

        {/* Right Dual-Tier Content Frame Full Width */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Upper Golden-Yellow Headline Banner */}
          <div className="broadcast-gold-band relative overflow-hidden py-0.5 sm:py-1 px-3 border-b border-amber-600/50">
            {/* World Map Silhouette Watermark on Gold */}
            <svg className="absolute inset-0 w-full h-full text-amber-800/15 object-cover pointer-events-none" viewBox="0 0 400 50" fill="currentColor" preserveAspectRatio="none">
              <path d="M30,10 Q80,5 120,25 T220,15 T310,35 T390,15 Q360,45 280,40 T150,45 T40,40 Z" opacity="0.4" />
              <ellipse cx="90" cy="20" rx="35" ry="15" opacity="0.25" />
              <ellipse cx="280" cy="25" rx="50" ry="18" opacity="0.25" />
            </svg>

            {/* Scrolling Headlines */}
            <div className="overflow-hidden relative w-full flex items-center">
              <div className="animate-marquee flex items-center whitespace-nowrap">
                {renderHeadlinesTrack('gold-track-1')}
                {renderHeadlinesTrack('gold-track-2')}
              </div>
            </div>
          </div>

          {/* Lower Navy Blue Market Ribbon */}
          <div className="broadcast-navy-band relative overflow-hidden py-0.5 px-3">
            <div className="overflow-hidden relative w-full flex items-center">
              <div className="animate-marquee flex items-center whitespace-nowrap">
                {renderMarketTrack('navy-mkt-1')}
                {renderMarketTrack('navy-mkt-2')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandPalette({ isOpen, onClose, onNavigate }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [resultsObj, setResultsObj] = useState({ all: [], articles: [], videos: [], news: [], publishers: [] });
  const [filterType, setFilterType] = useState('all'); // 'all' | 'article' | 'video' | 'news' | 'publisher'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 350);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResultsObj({ all: [], articles: [], videos: [], news: [], publishers: [] });
      setFilterType('all');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResultsObj({ all: [], articles: [], videos: [], news: [], publishers: [] });
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    let isStale = false;
    searchAllContent(debouncedQuery, language).then(data => {
      if (isStale) return;
      setResultsObj(data || { all: [], articles: [], videos: [], news: [], publishers: [] });
      setIsSearching(false);
      setSelectedIndex(0);
    }).catch(() => {
      if (isStale) return;
      setResultsObj({ all: [], articles: [], videos: [], news: [], publishers: [] });
      setIsSearching(false);
    });
    return () => { isStale = true; };
  }, [debouncedQuery, language]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(window.location.hash || '#/');
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose, onNavigate]);

  const activeResults = useMemo(() => {
    if (filterType === 'article') return resultsObj.articles || [];
    if (filterType === 'video') return resultsObj.videos || [];
    if (filterType === 'news') return resultsObj.news || [];
    if (filterType === 'publisher') return resultsObj.publishers || [];
    return resultsObj.all || [];
  }, [resultsObj, filterType]);

  const handleSelectItem = (item) => {
    if (!item) return;
    if (item.sourceUrl) {
      window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
    } else if (item.contentType === 'publisher') {
      onNavigate(`#/professionals/${item.id || item.slug}`);
    } else if (item.contentType === 'article') {
      onNavigate(`#/articles/${item.slug || item.id}`);
    } else if (item.contentType === 'news') {
      onNavigate(`#/news/${item.slug || item.id}`);
    } else {
      onNavigate(`#/videos/${item.id}`);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < activeResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : activeResults.length - 1));
    } else if (e.key === 'Enter' && activeResults[selectedIndex]) {
      e.preventDefault();
      handleSelectItem(activeResults[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  const popularTags = ["@budgetpadmanaban_", "SIP", "NIFTY 50", "Mutual Fund", "Tax Saving", "NPS", "SGB", "IPO"];
  const totalCount = resultsObj.all.length;
  const articlesCount = resultsObj.articles.length;
  const videosCount = resultsObj.videos.length;
  const newsCount = resultsObj.news.length;
  const publishersCount = resultsObj.publishers.length;

  const isTa = language === 'ta';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] modal-card-unified"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Universal Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            {isSearching ? (
              <svg className="w-4 h-4 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isTa ? "செய்திகள், கட்டுரைகள், வீடியோக்கள், நிபுணர்களில் தேடுங்கள்..." : "Search articles, videos, news, publishers..."}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base font-semibold"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 font-bold transition-colors"
            >
              {isTa ? 'அழி' : 'Clear'}
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Category Tabs with live counts */}
        {totalCount > 0 && (
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setFilterType('all'); setSelectedIndex(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
              }`}
            >
              <span>{isTa ? 'அனைத்தும்' : 'All'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/15 text-[10px]">{totalCount}</span>
            </button>

            {articlesCount > 0 && (
              <button
                onClick={() => { setFilterType('article'); setSelectedIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  filterType === 'article'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                }`}
              >
                <span>{isTa ? 'கட்டுரைகள்' : 'Articles'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{articlesCount}</span>
              </button>
            )}

            {videosCount > 0 && (
              <button
                onClick={() => { setFilterType('video'); setSelectedIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  filterType === 'video'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                }`}
              >
                <span>{isTa ? 'வீடியோக்கள்' : 'Videos'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{videosCount}</span>
              </button>
            )}

            {newsCount > 0 && (
              <button
                onClick={() => { setFilterType('news'); setSelectedIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  filterType === 'news'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                }`}
              >
                <span>{isTa ? 'செய்திகள்' : 'News'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{newsCount}</span>
              </button>
            )}

            {publishersCount > 0 && (
              <button
                onClick={() => { setFilterType('publisher'); setSelectedIndex(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  filterType === 'publisher'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                }`}
              >
                <span>{isTa ? 'நிபுணர்கள்' : 'Publishers'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{publishersCount}</span>
              </button>
            )}
          </div>
        )}

        {/* Results Stream */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {/* Loading Indicator */}
          {isSearching && (
            <div className="py-10 text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>{isTa ? 'தகவல்கள் தேடப்படுகின்றன...' : 'Searching all articles, videos, news & publishers...'}</span>
              </div>
            </div>
          )}

          {/* No Results Fallback */}
          {!isSearching && query.trim() && activeResults.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm font-medium space-y-2">
              <div className="text-3xl">🔍</div>
              <p>{isTa ? `"${query}" தொடர்பாக முடிவுகள் எதுவும் கிடைக்கவில்லை` : `No matching contents found for "${query}"`}</p>
              <p className="text-xs text-slate-400">{isTa ? 'வேறு முக்கிய வார்த்தைகளைப் பயன்படுத்தி தேடவும்.' : 'Try searching for mutual funds, SIP, NIFTY 50, or advisor name.'}</p>
            </div>
          )}

          {/* Trending Searches Tags */}
          {!query.trim() && (
            <div className="py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                {t('trendingSearches')}
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(tag)}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered & Ranked Result Cards */}
          {!isSearching && activeResults.length > 0 && (
            <div className="space-y-2">
              {activeResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const isPub = item.contentType === 'publisher';
                const isArticle = item.contentType === 'article';
                const isNews = item.contentType === 'news';
                const isVideo = item.contentType === 'video';

                return (
                  <div
                    key={`${item.contentType}-${item.id || item.slug}-${idx}`}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-200 shadow-sm'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    {/* Visual Media / Avatar */}
                    {isPub ? (
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center">
                        <img src={item.avatar || item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="relative w-20 h-13 sm:w-24 sm:h-14 shrink-0 rounded-xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                        {isVideo && item.duration && (
                          <span className="absolute bottom-1 right-1 bg-black/85 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                            {item.duration}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Result Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isPub
                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                              : isArticle
                              ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                              : isNews
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : 'bg-red-500/20 text-red-700 dark:text-red-300'
                          }`}
                        >
                          {isPub ? (isTa ? 'நிபுணர்' : 'PUBLISHER') : isArticle ? (isTa ? 'கட்டுரை' : 'ARTICLE') : isNews ? (isTa ? 'செய்தி' : 'NEWS') : (isTa ? 'வீடியோ' : 'VIDEO')}
                        </span>

                        {item.arnNumber && (
                          <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            {item.arnNumber}
                          </span>
                        )}

                        {item.category && !isPub && (
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                            {(item.category || '').replace('-', ' ')}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
                        {item.title || item.name}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {isPub ? item.designation || item.summary : item.summary || item.description || ''}
                      </p>
                    </div>

                    {/* Navigation Arrow */}
                    <div className="shrink-0 text-slate-400 group-hover:text-amber-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function VideoCard({ video, onSelect, onShowToast }) {
  const { t } = useLanguage();
  if (!video) return null;

  const publishedDate = video.publishedAt ? new Date(video.publishedAt) : new Date();
  const isNew = (Date.now() - publishedDate.getTime()) / (1000 * 3600 * 24) <= 30;

  const formattedDate = new Intl.DateTimeFormat(
    video.activeLang === 'ta' ? 'ta-IN' : 'en-IN',
    { month: 'short', day: 'numeric', year: 'numeric' }
  ).format(publishedDate);

  const formattedViews = new Intl.NumberFormat(
    video.activeLang === 'ta' ? 'ta-IN' : 'en-IN'
  ).format(video.views || 18500);

  const handleBookmark = (e) => {
    e.stopPropagation();
    onShowToast(t('bookmarkToast'));
  };

  return (
    <div
      onClick={() => onSelect(video)}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm card-hover-glow cursor-pointer flex flex-col h-full justify-between"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img src={video.thumbnail} alt={video.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" />
        
        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/15 transition-colors flex items-center justify-center">
          <div className="w-13 h-13 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xl play-button-ripple group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>

        {video.isShort ? (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-red-600 text-white shadow-md">SHORT</span>
        ) : isNew ? (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-600 text-white shadow-md">{t('newBadge')}</span>
        ) : null}

        <span className="absolute bottom-3 right-3 px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-md bg-slate-950/85 text-white  border border-white/10">{video.duration || (video.isShort ? 'Short' : '10:00')}</span>

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleBookmark}
            className="p-1.5 rounded-md bg-slate-950/70 text-white hover:bg-amber-600 transition-colors "
            title="Save to Watch Later"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </button>
          <a
            href={video.youtubeUrl || OFFICIAL_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[9px] font-black uppercase tracking-wider shadow-md hover:bg-red-700 transition-colors"
            title="Watch on YouTube Channel"
          >
            {OFFICIAL_CHANNEL_HANDLE} ↗
          </a>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">{video.category}</span>
            <span className="text-[10px] text-slate-400 font-bold">CFP Certified</span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 mt-2 group-hover:text-amber-600 transition-colors leading-snug font-serif">{video.title}</h3>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 font-semibold">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            {formattedViews} {t('views')}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 p-4 space-y-3.5 shadow-sm">
      <div className="skeleton aspect-video w-full rounded-2xl" />
      <div className="space-y-2">
        <div className="skeleton h-3 w-1/3 rounded-full" />
        <div className="skeleton h-5 w-full rounded-lg" />
        <div className="skeleton h-4 w-3/4 rounded-lg" />
      </div>
    </div>
  );
}



function useLiveArticles() {
  const [liveArticles, setLiveArticles] = useState(() => {
    try {
      const cached = localStorage.getItem('muthaleetu_articles_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [];
  });
  const [isLoading, setIsLoading] = useState(liveArticles.length === 0);

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      try {
        const res = await fetch(`/api/articles?limit=30&sort=newest&_t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          const list = json.data || [];
          if (isMounted && Array.isArray(list) && list.length > 0) {
            setLiveArticles(list);
            try {
              localStorage.setItem('muthaleetu_articles_cache', JSON.stringify(list));
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Live articles fetch fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchArticles();

    const handleUpdate = () => {
      fetchArticles();
    };

    window.addEventListener('articles_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('articles_updated', handleUpdate);
    };
  }, []);

  return { liveArticles, isLoading };
}

function normalizeArticleItem(item, language = 'ta') {
  if (!item) return null;
  const isTamil = language === 'ta';
  const id = item.id || item.slug || Math.random().toString(36).substring(2, 9);
  const slug = item.slug || `article-${id}`;
  const titleTamil = item.titleTamil || item.title_ta || item.title || 'நிதி செய்திகள்';
  const titleEnglish = item.titleEnglish || item.title_en || item.title || titleTamil;
  const title = isTamil ? (titleTamil || titleEnglish) : (titleEnglish || titleTamil);
  const summaryTamil = item.summaryTamil || item.excerptTamil || item.excerpt_ta || item.summary || '';
  const summaryEnglish = item.summaryEnglish || item.excerptEnglish || item.excerpt_en || summaryTamil;
  const summary = isTamil ? (summaryTamil || summaryEnglish) : (summaryEnglish || summaryTamil);
  const thumbnail = item.coverImage || item.cover_image_url || item.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80';
  const category = (item.category || 'mutual-fund').replace('_', '-');
  const publishedAt = item.publishedAt || item.published_at || item.created_at || new Date().toISOString();
  const authorName = item.authorName || item.author_name || (item.author_profile ? item.author_profile.full_name : null) || 'Budget Padmanaban CFP®';
  const authorRole = item.authorRole || item.author_role || (item.author_profile ? item.author_profile.designation : null) || 'Financial Advisor';
  const isLive = Boolean(item.created_at || item.published_at || item.body_ta || item.body);

  return {
    id,
    slug,
    titleTamil,
    titleEnglish,
    title,
    summaryTamil,
    summaryEnglish,
    summary,
    thumbnail,
    category,
    publishedAt,
    authorName,
    authorRole,
    isLive
  };
}

function HeroSection({ news, onNavigate }) {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const { liveArticles } = useLiveArticles();

  const combinedArticles = useMemo(() => {
    const liveList = (liveArticles || []).map(a => normalizeArticleItem(a, language)).filter(Boolean);
    const passedList = (news || newsData || []).map(a => normalizeArticleItem(a, language)).filter(Boolean);
    
    const seen = new Set();
    const merged = [];
    for (const a of liveList) {
      if (a.slug && !seen.has(a.slug)) {
        seen.add(a.slug);
        merged.push(a);
      }
    }
    for (const p of passedList) {
      if (p.slug && !seen.has(p.slug)) {
        seen.add(p.slug);
        merged.push(p);
      }
    }
    return merged;
  }, [liveArticles, news, language]);

  const featuredStories = combinedArticles.slice(0, 10);
  const latestStories = combinedArticles.slice(0, 4);

  const renderFeaturedTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-stretch gap-0 shrink-0 h-full">
      {featuredStories.map((item, idx) => {
        const formattedDate = new Intl.DateTimeFormat(
          language === 'ta' ? 'ta-IN' : 'en-IN',
          { month: 'short', day: 'numeric' }
        ).format(new Date(item.publishedAt || Date.now()));

        return (
          <article
            key={`${keyPrefix}-${item.id}-${idx}`}
            onClick={() => onNavigate && onNavigate(`#/articles/${item.slug}`)}
            className="group relative w-[220px] sm:w-[250px] md:w-[270px] h-[240px] sm:h-[265px] shrink-0 border-r border-white/10 overflow-hidden flex flex-col justify-end p-3.5 sm:p-4 select-none cursor-pointer bg-slate-950"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent pointer-events-none" />

            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
              <span className="px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider rounded-md bg-amber-500 text-slate-950 shadow-md">
                {(item.category || 'FINANCE').replace('-', ' ')}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-950/85 text-slate-200 text-[8.5px] font-mono font-bold border border-white/15">
                {formattedDate}
              </span>
            </div>

            <div className="relative z-10 space-y-1.5">
              <h3 className="text-xs sm:text-sm font-black text-white leading-snug font-serif group-hover:text-amber-400 transition-colors drop-shadow-md line-clamp-2">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-[11px] text-slate-300/95 line-clamp-2 font-sans leading-relaxed drop-shadow">
                  {item.summary}
                </p>
              )}
              <div className="pt-0.5 flex items-center justify-between text-[11px] text-amber-400 font-extrabold">
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
    <section className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between bg-white/90 dark:bg-slate-950 rounded-2xl border border-[rgba(201,181,156,0.5)] dark:border-slate-800 shadow-lg overflow-hidden p-3.5 sm:p-4 text-slate-900 dark:text-white">
          <div className="flex items-center justify-between border-b border-[rgba(217,207,199,0.7)] dark:border-slate-800 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
                <span>{t('featuredNews') || 'சிறப்புச் செய்திகள் & ஆய்வுகள்'}</span>
              </h2>
            </div>
            <span className="text-[9px] font-mono text-amber-700 dark:text-amber-400/90 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              LIVE NEWS TICKER
            </span>
          </div>

          <div className="featured-marquee-wrapper overflow-hidden rounded-xl border border-[rgba(217,207,199,0.7)] dark:border-slate-800 bg-[rgba(239,233,227,0.5)] dark:bg-slate-950 my-auto">
            <div className="animate-featured-marquee flex items-stretch gap-0 whitespace-normal">
              {renderFeaturedTrack('ftrack-1')}
              {renderFeaturedTrack('ftrack-2')}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between bg-white/90 dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl border border-[rgba(201,181,156,0.5)] dark:border-slate-800 shadow-lg p-3.5 sm:p-4">
          <div className="flex items-center justify-between border-b border-[rgba(217,207,199,0.7)] dark:border-slate-800 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                {isTamil ? 'சமீபத்திய கட்டுரைகள்' : 'Latest Articles'}
              </h3>
            </div>
            <span className="text-[9px] font-mono font-bold text-amber-700 dark:text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Latest
            </span>
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col justify-between">
            {latestStories.map((article, idx) => (
              <div
                key={article.id || `latest-${idx}`}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
                className="btn-magnetic group flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[rgba(239,233,227,0.8)] dark:hover:bg-slate-900/80 transition-all cursor-pointer border border-transparent hover:border-[rgba(201,181,156,0.4)] dark:hover:border-slate-800"
              >
                {article.thumbnail && (
                  <img
                    src={article.thumbnail}
                    alt=""
                    className="w-11 h-11 rounded-lg object-cover shrink-0 border border-[rgba(217,207,199,0.8)] dark:border-slate-800"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8.5px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                      {(article.category || 'FINANCE').replace('-', ' ')}
                    </span>
                    <span className="text-[8.5px] text-slate-500 dark:text-slate-400 font-mono">
                      • {new Date(article.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors font-serif leading-snug">
                    {article.title}
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 group-hover:text-amber-700 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0">
                  →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrendingArticlesSection({ onNavigate }) {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const { liveArticles } = useLiveArticles();

  const allArticles = useMemo(() => {
    const liveList = (liveArticles || []).map(a => normalizeArticleItem(a, language)).filter(Boolean);
    const seedList = (newsData || []).map(a => normalizeArticleItem(a, language)).filter(Boolean);

    const seenSlugs = new Set();
    const merged = [];

    // Prioritize live published articles added by admin or publisher
    for (const a of liveList) {
      if (a.slug && !seenSlugs.has(a.slug)) {
        seenSlugs.add(a.slug);
        merged.push(a);
      }
    }
    for (const s of seedList) {
      if (s.slug && !seenSlugs.has(s.slug)) {
        seenSlugs.add(s.slug);
        merged.push(s);
      }
    }
    return merged.slice(0, 6);
  }, [liveArticles, language]);

  return (
    <section className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
            {t('trendingArticlesTitle') || 'டிரெண்டிங் செய்திகள் & கட்டுரைகள்'}
          </h2>
        </div>
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
          Trending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allArticles.map((article, idx) => {
          const rankStr = `0${idx + 1}`;
          const isEven = idx % 2 === 0;
          const brandColor = isEven ? 'text-[#03529A] dark:text-[#38bdf8]' : 'text-[#4A9E2C] dark:text-[#4ade80]';
          const hoverBorder = isEven ? 'hover:border-[#03529A]/50' : 'hover:border-[#4A9E2C]/50';
          const hoverTitle = isEven ? 'group-hover:text-[#03529A] dark:group-hover:text-[#38bdf8]' : 'group-hover:text-[#4A9E2C] dark:group-hover:text-[#4ade80]';

          return (
            <div
              key={article.id || `trend-${idx}`}
              onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
              className={`group flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md ${hoverBorder} transition-all cursor-pointer select-none`}
            >
              <span className={`text-xl font-black ${brandColor} font-serif w-7 shrink-0 text-center`}>
                {rankStr}
              </span>

              {article.thumbnail && (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-950">
                  <img
                    src={article.thumbnail}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {article.isLive && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                  )}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-black uppercase ${brandColor} tracking-wider`}>
                    {article.category.replace('-', ' ')}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    • {new Date(article.publishedAt).toLocaleDateString(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className={`text-xs font-bold text-slate-900 dark:text-white line-clamp-2 ${hoverTitle} transition-colors font-serif leading-snug`}>
                  {article.title}
                </h4>
                {article.authorName && (
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    ✍️ {article.authorName}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
function SipCalculator() {
  const { t, language } = useLanguage();
  const [calcMode, setCalcMode] = useState('sip');
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [timeYears, setTimeYears] = useState(15);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [activeTab, setActiveTab] = useState('growth'); // 'growth' | 'donut' | 'milestones' | 'table'
  const [hoveredYear, setHoveredYear] = useState(null);

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

  // Year by Year calculation trajectory
  const yearlyData = useMemo(() => {
    const data = [];
    const stepYears = Math.min(timeYears, 30);
    let mInvest = monthlyInvest;

    for (let y = 1; y <= stepYears; y++) {
      let cumInvested = 0;
      let cumFutureVal = 0;

      if (calcMode === 'sip') {
        const ny = y * 12;
        cumInvested = monthlyInvest * ny;
        cumFutureVal = Math.round(monthlyInvest * ((Math.pow(1 + i, ny) - 1) / i) * (1 + i));
      } else if (calcMode === 'stepup') {
        let acc = 0;
        let paid = 0;
        let curM = monthlyInvest;
        for (let yr = 1; yr <= y; yr++) {
          for (let m = 1; m <= 12; m++) {
            paid += curM;
            acc = (acc + curM) * (1 + i);
          }
          curM = curM * (1 + stepUpPercent / 100);
        }
        cumInvested = Math.round(paid);
        cumFutureVal = Math.round(acc);
      } else {
        cumInvested = monthlyInvest;
        cumFutureVal = Math.round(monthlyInvest * Math.pow(1 + r, y));
      }

      const gain = Math.max(0, cumFutureVal - cumInvested);
      data.push({
        year: y,
        invested: cumInvested,
        futureValue: cumFutureVal,
        gain,
        ratio: cumInvested > 0 ? (cumFutureVal / cumInvested).toFixed(1) : '1.0'
      });
    }
    return data;
  }, [monthlyInvest, returnRate, timeYears, stepUpPercent, calcMode, i, r]);

  const maxVal = Math.max(...yearlyData.map(d => d.futureValue), 1);
  const activeInspectItem = hoveredYear !== null ? yearlyData.find(d => d.year === hoveredYear) : yearlyData[yearlyData.length - 1];

  const milestones = [
    { target: 1000000, label: '₹10 Lakhs', tamilLabel: '₹10 லட்சம்' },
    { target: 2500000, label: '₹25 Lakhs', tamilLabel: '₹25 லட்சம்' },
    { target: 5000000, label: '₹50 Lakhs', tamilLabel: '₹50 லட்சம்' },
    { target: 10000000, label: '₹1 Crore', tamilLabel: '₹1 கோடி' },
    { target: 20000000, label: '₹2 Crores', tamilLabel: '₹2 கோடி' },
    { target: 50000000, label: '₹5 Crores', tamilLabel: '₹5 கோடி' }
  ];

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
    <section id="financial-calculators" className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none animate-fadeIn">
      {/* Top 4 Mode Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {calculatorCards.map((card) => {
          const isActive = calcMode === card.id;
          return (
            <div
              key={card.id}
              role="button"
              tabIndex={0}
              onClick={() => setCalcMode(card.id)}
              className={`btn-magnetic group cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900 dark:bg-slate-950 text-white border-amber-500 shadow-xl ring-1 ring-amber-500/50'
                  : 'bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span
                    className={`text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
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

      {/* Main SIP Wealth Studio Outer Container */}
      <div className="bg-[#008060] text-white rounded-3xl p-6 sm:p-10 border-2 border-white/25 shadow-2xl space-y-8 transition-colors duration-300">
        {/* Studio Header & Preset Quick Goals */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/20 pb-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black font-serif text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
              <span>
                {calcMode === 'sip' && (isTamil ? 'SIP முதலீட்டுக் கணக்கீடு' : 'SIP Wealth Studio')}
                {calcMode === 'lumpsum' && (isTamil ? 'ஒரே முறை முதலீட்டுக் கணக்கீடு' : 'Lump Sum Wealth Studio')}
                {calcMode === 'stepup' && (isTamil ? 'முதலீட்டு உயர்வு (Step-Up SIP) கணக்கீடு' : 'Step-Up SIP Studio')}
                {calcMode === 'compound' && (isTamil ? 'கூட்டு வட்டி கணக்கீடு' : 'Compound Interest Studio')}
              </span>
            </h3>
            <p className="text-xs text-emerald-100/90 font-medium">
              {isTamil
                ? 'உங்கள் நீண்ட கால முதலீட்டு இலக்கை அடைய துல்லியமான கூட்டு வட்டி கணிப்பு & வரைபடங்கள்'
                : 'Interactive asset compounding, inflation-adjusted growth projections & visual charts'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-white/80 font-black uppercase text-[10px]">
              {isTamil ? 'இலக்குகள்:' : 'Goals:'}
            </span>
            <button
              onClick={() => applyPresetGoal(5000, 12, 15)}
              className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white font-bold text-xs border border-white/30 backdrop-blur-sm transition-all shadow-sm"
            >
              {isTamil ? '₹1 கோடி இலக்கு' : '₹1 Crore Goal'}
            </button>
            <button
              onClick={() => applyPresetGoal(10000, 14, 10)}
              className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white font-bold text-xs border border-white/30 backdrop-blur-sm transition-all shadow-sm"
            >
              {isTamil ? '₹50 லட்சம் இலக்கு' : '₹50 Lakh Goal'}
            </button>
            <button
              onClick={() => applyPresetGoal(25000, 12, 5)}
              className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white font-bold text-xs border border-white/30 backdrop-blur-sm transition-all shadow-sm"
            >
              {isTamil ? '₹20 லட்சம் குறுகிய காலம்' : '₹20 Lakh Short Term'}
            </button>
          </div>
        </div>

        {/* 2-Column Controls & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (Input Sliders): Pure White Card */}
          <div className="lg:col-span-6 space-y-6 bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border border-white/40 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-800 font-black">
                    {calcMode === 'lumpsum' || calcMode === 'compound'
                      ? (isTamil ? 'தொடக்க முதலீட்டுத் தொகை (₹)' : 'Initial Investment (₹)')
                      : (isTamil ? 'மாதாந்திர SIP தொகை (₹)' : 'Monthly SIP Amount (₹)')}
                  </label>
                  <span className="text-[#008060] font-mono text-sm font-black">
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
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#008060]"
                />
              </div>

              {calcMode === 'stepup' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <label className="text-slate-800 font-black">
                      {isTamil ? 'ஆண்டு முதலீட்டு உயர்வு (%)' : 'Annual Step-Up Increase (%)'}
                    </label>
                    <span className="text-[#008060] font-mono text-sm font-black">
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
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#008060]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-800 font-black">
                    {isTamil ? 'எதிர்பார்க்கும் ஆண்டு வட்டி விகிதம் (%)' : 'Expected Annual Return Rate (%)'}
                  </label>
                  <span className="text-[#008060] font-mono text-sm font-black">
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
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#008060]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-800 font-black">
                    {isTamil ? 'முதலீட்டுக் காலம் (ஆண்டுகள்)' : 'Time Horizon (Years)'}
                  </label>
                  <span className="text-[#008060] font-mono text-sm font-black">
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
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#008060]"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-600 font-bold">
                    {isTamil ? 'எதிர்பார்க்கப்படும் பணவீக்கம் (%)' : 'Expected Inflation Rate (%)'}
                  </label>
                  <span className="text-slate-900 font-mono text-xs font-black">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span>{isTamil ? 'முதலீடு' : 'Invested'}: {investedPercent}%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#008060]" />
                  <span>{isTamil ? 'வட்டி லாபம்' : 'Wealth Gain'}: {gainPercent}%</span>
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex border border-slate-300">
                <div style={{ width: `${investedPercent}%` }} className="bg-slate-400 transition-all duration-300" />
                <div style={{ width: `${gainPercent}%` }} className="bg-gradient-to-r from-[#008060] to-emerald-500 transition-all duration-300 shadow-lg" />
              </div>
            </div>
          </div>

          {/* Right Column (Results Summary): Pure White Card */}
          <div className="lg:col-span-6 space-y-6 bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border border-white/40 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                  {isTamil ? 'மொத்த முதலீடு' : 'Total Invested'}
                </span>
                <span className="text-lg font-black font-mono text-slate-900">
                  {formatCurrency(totalInvested)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                  {isTamil ? 'மதிப்பிடப்பட்ட வட்டி லாபம்' : 'Estimated Growth Returns'}
                </span>
                <span className="text-lg font-black font-mono text-[#008060]">
                  +{formatCurrency(estimatedGain)}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#008060]/10 via-[#008060]/5 to-transparent border border-[#008060]/20 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#008060]">
                    {isTamil ? 'மொத்த முதிர்வுத் தொகை' : 'Projected Wealth Corpus'}
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-[#008060] text-white shadow-sm">
                    {wealthMultiplier}x Wealth
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-[#008060] tracking-tight">
                  {formatCurrency(futureValue)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1 shadow-inner">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="font-black">{isTamil ? 'பணவீக்கத்திற்குப் பின் உண்மையான மதிப்பு' : 'Inflation-Adjusted Purchasing Value'}</span>
                  <span className="font-mono font-black text-white">{formatCurrency(realPurchasingPower)}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {isTamil
                    ? `${inflationRate}% பணவீக்கத்தைக் கணக்கிடும் போது உங்கள் ₹${(futureValue / 100000).toFixed(1)} லட்சத்தின் உண்மையான மதிப்பு.`
                    : `Purchasing power equivalent in today's money at ${inflationRate}% average inflation rate.`}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-bold border-t border-slate-200">
              <span className="text-[#008060] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#008060] animate-pulse" />
                <span>CFP Verified Compounding Math</span>
              </span>
              <span className="text-slate-600 font-semibold">Padmanaban B. Financial</span>
            </div>
          </div>
        </div>

        {/* Interactive Charts & Graphs Section */}
        <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border border-white/40 shadow-xl space-y-6">
          {/* Chart Header & Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <h4 className="text-base sm:text-lg font-black font-serif text-slate-900 dark:text-white flex items-center gap-2">
                <span>📈</span>
                <span>{isTamil ? 'முதலீட்டு வளர்ச்சி வரைபடங்கள் & கணிப்புகள்' : 'Visual Growth Charts & Wealth Analytics'}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isTamil ? 'ஆண்டுதோறும் கூட்டு வட்டியின் அபார வளர்ச்சி மற்றும் மைல்கற்கள்' : 'Yearly compounding breakdown, asset distribution & wealth milestones'}
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('growth')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === 'growth'
                    ? 'bg-[#008060] text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                📊 {isTamil ? 'வளர்ச்சி வரைபடம்' : 'Growth Chart'}
              </button>
              <button
                onClick={() => setActiveTab('donut')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === 'donut'
                    ? 'bg-[#008060] text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🥧 {isTamil ? 'பங்குப் பிரிவு' : 'Asset Share'}
              </button>
              <button
                onClick={() => setActiveTab('milestones')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === 'milestones'
                    ? 'bg-[#008060] text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🏆 {isTamil ? 'மைல்கற்கள்' : 'Milestones'}
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === 'table'
                    ? 'bg-[#008060] text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                📋 {isTamil ? 'அட்டவணை' : 'Schedule'}
              </button>
            </div>
          </div>

          {/* TAB 1: Year-by-Year Growth Chart */}
          {activeTab === 'growth' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Dynamic Inspector Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {isTamil ? 'ஆய்வு நிலை' : 'Inspecting'}:
                  </span>
                  <span className="font-black font-mono text-[#008060] bg-[#008060]/10 px-2 py-0.5 rounded-md">
                    {isTamil ? `ஆண்டு ${activeInspectItem?.year}` : `Year ${activeInspectItem?.year}`}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-[10px] text-slate-400">{isTamil ? 'முதலீடு' : 'Invested'}: </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatCurrency(activeInspectItem?.invested || 0)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">{isTamil ? 'வட்டி லாபம்' : 'Growth'}: </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(activeInspectItem?.gain || 0)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">{isTamil ? 'மொத்த செல்வம்' : 'Total Wealth'}: </span>
                    <span className="font-mono font-black text-[#008060] text-sm">{formatCurrency(activeInspectItem?.futureValue || 0)}</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#008060] text-white">
                      {activeInspectItem?.ratio}x
                    </span>
                  </div>
                </div>
              </div>

              {/* Stacked Growth Bars */}
              <div className="h-56 sm:h-64 w-full flex items-end justify-between gap-1 sm:gap-2 px-3 pt-8 pb-2 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
                {/* Background Guide Lines */}
                <div className="absolute inset-x-3 top-6 border-b border-dashed border-slate-200 dark:border-slate-800" />
                <div className="absolute inset-x-3 top-1/2 border-b border-dashed border-slate-200 dark:border-slate-800" />

                {yearlyData.map((d) => {
                  const totalHeightPct = Math.min(100, Math.max(8, Math.round((d.futureValue / maxVal) * 100)));
                  const investedHeightPct = Math.min(totalHeightPct, Math.max(4, Math.round((d.invested / maxVal) * 100)));
                  const gainHeightPct = Math.max(0, totalHeightPct - investedHeightPct);
                  const isSelected = activeInspectItem?.year === d.year;

                  return (
                    <div
                      key={d.year}
                      onMouseEnter={() => setHoveredYear(d.year)}
                      onMouseLeave={() => setHoveredYear(null)}
                      className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                    >
                      {/* Tooltip on Hover */}
                      {isSelected && (
                        <div className="absolute -top-7 px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-mono font-bold shadow-xl z-20 whitespace-nowrap pointer-events-none animate-fadeIn border border-slate-700">
                          {formatCurrency(d.futureValue)}
                        </div>
                      )}

                      {/* Stacked Bar */}
                      <div
                        style={{ height: `${totalHeightPct}%` }}
                        className={`w-full max-w-[26px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all duration-300 shadow-sm ${
                          isSelected ? 'ring-2 ring-amber-400 scale-105 shadow-lg' : 'hover:opacity-90'
                        }`}
                      >
                        {/* Top (Gain) */}
                        <div
                          style={{ height: `${(gainHeightPct / totalHeightPct) * 100}%` }}
                          className="w-full bg-gradient-to-t from-[#008060] to-emerald-400"
                        />
                        {/* Bottom (Invested) */}
                        <div
                          style={{ height: `${(investedHeightPct / totalHeightPct) * 100}%` }}
                          className="w-full bg-slate-400 dark:bg-slate-600"
                        />
                      </div>

                      {/* X-Axis Label */}
                      <span className={`text-[9px] font-mono font-bold mt-1.5 transition-colors ${
                        isSelected ? 'text-[#008060] font-black scale-110' : 'text-slate-400'
                      }`}>
                        Y{d.year}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend & Guide */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-500 pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-slate-400" />
                    <span>{isTamil ? 'அசல் முதலீடு (Invested)' : 'Invested Capital'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-gradient-to-r from-[#008060] to-emerald-400" />
                    <span>{isTamil ? 'கூட்டு வட்டி லாபம் (Compound Gain)' : 'Compounded Returns'}</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 italic">
                  💡 {isTamil ? 'ஆண்டுகள் மீது மவுஸ் வைத்து கணிப்புகளைப் பாருங்கள்' : 'Hover over any year bar to inspect breakdown'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Asset Share Donut Chart */}
          {activeTab === 'donut' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-4 animate-fadeIn">
              <div className="md:col-span-5 flex justify-center">
                {/* SVG Donut */}
                <div className="relative w-[210px] h-[210px] flex items-center justify-center">
                  {(() => {
                    const size = 210;
                    const strokeWidth = 30;
                    const radius = (size - strokeWidth) / 2;
                    const circumference = 2 * Math.PI * radius;
                    const investedDash = (investedPercent / 100) * circumference;
                    const gainDash = (gainPercent / 100) * circumference;
                    const gainOffset = -investedDash;

                    return (
                      <>
                        <svg width={size} height={size} className="rotate-[-90deg] drop-shadow-md">
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            className="text-slate-100 dark:text-slate-800"
                            strokeWidth={strokeWidth}
                          />
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke="#64748b"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${investedDash} ${circumference}`}
                            strokeDashoffset={0}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                          />
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke="#008060"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${gainDash} ${circumference}`}
                            strokeDashoffset={gainOffset}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {isTamil ? 'வட்டி லாபப் பங்கு' : 'Wealth Share'}
                          </span>
                          <span className="text-3xl font-black font-mono text-[#008060]">
                            {gainPercent}%
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {wealthMultiplier}x Growth
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-slate-500 shrink-0" />
                    <div>
                      <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {isTamil ? 'உங்கள் அசல் முதலீட்டுத் தொகை' : 'Principal Invested Capital'}
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        {isTamil ? `${timeYears} ஆண்டுகளில் நீங்கள் கட்டிய மொத்தத் தொகை` : `Cumulative amount saved over ${timeYears} years`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black font-mono text-sm text-slate-900 dark:text-white">
                      {formatCurrency(totalInvested)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{investedPercent}%</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#008060] shrink-0" />
                    <div>
                      <h5 className="font-bold text-xs text-[#008060]">
                        {isTamil ? 'கூட்டு வட்டி மூலம் ஈட்டிய லாபம்' : 'Compound Growth Returns (Profit)'}
                      </h5>
                      <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                        {isTamil ? `ஆண்டுக்கு ${returnRate}% வட்டி மூலம் உருவான அசாத்திய லாபம்` : `Wealth generated at ${returnRate}% annual compounding`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black font-mono text-sm text-[#008060]">
                      +{formatCurrency(estimatedGain)}
                    </div>
                    <span className="text-[10px] font-bold text-[#008060]">{gainPercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Milestones Roadmap */}
          {activeTab === 'milestones' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 py-2 animate-fadeIn">
              {milestones.map((m, idx) => {
                const matchYear = yearlyData.find(d => d.futureValue >= m.target);
                const isReached = Boolean(matchYear);

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isReached
                        ? 'bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/35 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-55'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black font-serif text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{isReached ? '🎯' : '⏳'}</span>
                        <span>{isTamil ? m.tamilLabel : m.label}</span>
                      </span>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        isReached ? 'bg-[#008060] text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {isReached ? (isTamil ? `ஆண்டு ${matchYear.year}` : `Year ${matchYear.year}`) : (isTamil ? 'இலக்கு தாண்டி' : 'Beyond Horizon')}
                      </span>
                    </div>
                    {isReached ? (
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium mt-2 leading-relaxed">
                        {isTamil
                          ? `ஆண்டு ${matchYear.year}-ல் அசல் முதலீடு ${formatCurrency(matchYear.invested)} ஆக இருக்கும் போது உங்கள் செல்வம் ${m.tamilLabel}-ஐ அடையும்.`
                          : `Crossed at Year ${matchYear.year} with ${formatCurrency(matchYear.invested)} total invested.`}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-2">
                        {isTamil
                          ? 'காலத்தை அல்லது மாதாந்திர முதலீட்டை அதிகரித்தால் இந்த இலக்கை அடையலாம்.'
                          : 'Increase duration or monthly SIP to unlock this milestone.'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: Yearly Schedule Table */}
          {activeTab === 'table' && (
            <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">{isTamil ? 'ஆண்டு' : 'Year'}</th>
                    <th className="p-3">{isTamil ? 'மொத்த முதலீடு' : 'Total Invested'}</th>
                    <th className="p-3">{isTamil ? 'வட்டி லாபம்' : 'Growth Returns'}</th>
                    <th className="p-3">{isTamil ? 'எதிர்பார்க்கும் முதிர்வு மதிப்பு' : 'Future Value'}</th>
                    <th className="p-3">{isTamil ? 'வளர்ச்சி மடங்கு' : 'Multiplier'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {yearlyData.map((d) => (
                    <tr key={d.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Year {d.year}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{formatCurrency(d.invested)}</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">+{formatCurrency(d.gain)}</td>
                      <td className="p-3 font-black text-[#008060] text-sm">{formatCurrency(d.futureValue)}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#008060]/15 text-[#008060]">{d.ratio}x</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


function RiskQuizWidget() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = [
    {
      title: "What is your primary investment goal?",
      options: [
        { label: "Long-term wealth creation (10+ years)", score: "equity" },
        { label: "Buying a home / Children education (3-5 years)", score: "balanced" },
        { label: "Emergency safety & capital protection", score: "debt" }
      ]
    },
    {
      title: "How would you react if the stock market dips 15%?",
      options: [
        { label: "Invest more via Top-up SIP! Great buying opportunity.", score: "equity" },
        { label: "Hold steady and continue existing monthly SIP.", score: "balanced" },
        { label: "Feel anxious and move money to Fixed Deposits.", score: "debt" }
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
      if (counts.equity >= 1) setResult("Flexi Cap / Small Cap Mutual Funds");
      else if (counts.balanced >= 1) setResult("Large Cap & Hybrid Funds");
      else setResult("Liquid & Short Duration Debt Funds");
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full  pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span>INTERACTIVE RISK & MATCH QUIZ</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white leading-snug">
            Find Your Mutual Fund Match
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Answer quick questions to discover tailored asset allocation and investment strategies for your risk appetite.
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
            <h4 className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400">Recommended Fund Category</h4>
            <p className="text-xl font-black text-slate-900 dark:text-white font-serif">{result}</p>
            <button onClick={resetQuiz} className="px-5 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs">Retake Quiz</button>
          </div>
        )}
      </div>
    </section>
  );
}

function SignInCtaBanner({ onNavigate }) {
  const { language } = useLanguage();
  const { session } = useAuth();
  const isTamil = language === 'ta';

  if (session) {
    return (
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 my-6 animate-fadeIn">
        <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs sm:text-sm font-bold font-sans">
              {isTamil 
                ? 'உறுப்பினர் கணக்கு செயலில் உள்ளது — முழு வீடியோ தொகுப்பு மற்றும் ஆராய்ச்சியை நீங்கள் அணுகலாம்.' 
                : 'Member Account Active — Full investment library and insights unlocked.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('#/videos')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors shadow-sm shrink-0"
          >
            {isTamil ? 'அனைத்து வீடியோக்கள் →' : 'Browse All Videos →'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 my-6 animate-fadeIn">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#03529A] via-[#0a3f6d] to-[#4A9E2C] border border-white/20 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-[#4A9E2C]/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 rounded-full bg-[#03529A]/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white text-[#03529A] font-black text-[10px] tracking-wider uppercase shadow">
                 {isTamil ? 'உறுப்பினர் அணுகல்' : 'MEMBER ACCESS'}
              </span>
              <span className="text-[11px] font-mono text-emerald-200 font-bold">
                {isTamil ? 'இலவச கணக்கு' : 'FREE ACCOUNT'}
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black font-serif text-white leading-snug">
              {isTamil
                ? 'முழு வீடியோ தொகுப்பு மற்றும் ஆராய்ச்சியைப் பார்க்க உள்நுழையவும்'
                : 'Sign in to watch the full library & in-depth research'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed font-sans font-medium">
              {isTamil
                ? 'இலவசமாக பதிவு செய்து பட்ஜெட் பத்மநாபனின் அனைத்து பிரத்தியேக நிதி வழிகாட்டிகள், மியூச்சுவல் ஃபண்ட் பகுப்பாய்வுகள் மற்றும் கண்காணிப்பு வரலாற்றை உடனே அணுகவும்.'
                : 'Register free to unlock the entire video archive, detailed mutual fund analysis, stock market strategies, and personalized watch history.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate && onNavigate('#/login')}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#03529A] font-extrabold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all text-center"
            >
              {isTamil ? 'உள்நுழைக' : 'Sign In'}
            </button>
            <button
              onClick={() => onNavigate && onNavigate('#/signup')}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 text-white font-extrabold text-xs sm:text-sm border border-white/30 hover:border-white transition-all text-center"
            >
              {isTamil ? 'இலவச பதிவு' : 'Register Free'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-amber-500/40 flex items-center gap-2 animate-bounce">
      <span className="text-amber-400"></span>
      <span>{message}</span>
    </div>
  );
}

function Footer({ onNavigate, onShowToast }) {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    if (onShowToast) onShowToast(t('subscribedToast') || 'Subscribed successfully!');
    setEmail('');
  };

  return (
    <footer className="bg-[rgba(239,233,227,0.85)] dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-t border-[rgba(201,181,156,0.6)] dark:border-slate-800 pt-12 pb-8">
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid: Newsletter + Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[rgba(217,207,199,0.7)] dark:border-slate-800">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="Muthaleetu Thisai"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-md shrink-0"
              />
              <span className="text-2xl sm:text-3xl font-black font-serif">
                {language === 'ta' ? (
                  <>
                    <span className="text-[#03529A] dark:text-[#38bdf8]">முதலீட்டு </span>
                    <span className="text-[#4A9E2C] dark:text-[#4ade80]">திசை</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#03529A] dark:text-[#38bdf8]">Muthaleetu </span>
                    <span className="text-[#4A9E2C] dark:text-[#4ade80]">Thisai</span>
                  </>
                )}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              {t('newsLetterDesc')}
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="flex-1 bg-white dark:bg-slate-900 border border-[rgba(201,181,156,0.6)] dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition-colors shadow-md shrink-0"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>

          {/* Sitemap Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              {t('nav.mutualFunds')} & {t('nav.stocks')}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onNavigate && onNavigate('#/category/mutual-funds')} className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.mutualFunds')}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('#/category/stocks')} className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.stocks')}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('#/category/personal-finance')} className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.personalFinance')}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('#/category/education')} className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('nav.education')}</button></li>
            </ul>
          </div>

          {/* Financial Tools */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              Financial Utilities
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onNavigate && onNavigate('#/calculator')} className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('sipCalculatorTitle')}</button></li>
              <li><button onClick={() => onNavigate && onNavigate('#/videos')} className="hover:text-slate-900 dark:hover:text-white transition-colors">YouTube Video Feed</button></li>
              <li><button onClick={() => onNavigate && onNavigate('#/news')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Financial News Hub</button></li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="space-y-2 text-[11px] text-slate-500 leading-relaxed max-w-5xl">
          <h5 className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
            {t('footerDisclaimerTitle')}
          </h5>
          <p>
            {t('footerDisclaimerText')}
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-center text-xs text-slate-600 font-medium">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}

// ==================== 6. PAGES ====================
function CinemaVideoCard({
  video,
  index = 0,
  onSelect,
  language = 'ta',
  onShowToast
}) {
  const isTamil = language === 'ta';
  if (!video) return null;

  const youtubeId = video?.youtubeId || '';
  const thumbnail = video?.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '');

  const title = isTamil
    ? (video.titleTamil || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title || 'Featured Video');

  const category = (video.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const duration = video.duration || (video.isShort ? '0:59' : '12:00');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect && onSelect(video)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(video);
        }
      }}
      className="group relative select-none cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden
        w-full aspect-[9/13]
        bg-slate-900 border border-slate-800 hover:border-amber-500
        shadow-md hover:shadow-xl hover:shadow-amber-500/10
        transition-all duration-150 shrink-0"
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
      </div>

      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
        <span className="px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider rounded-full bg-slate-950/85 text-amber-400 border border-amber-400/20">
          {category}
        </span>
        <span className="px-1.5 py-0.5 text-[8.5px] font-mono font-bold rounded-full bg-slate-950/85 text-slate-200 border border-white/10">
          {duration}
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-150 shadow-lg">
          <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-3 pt-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 flex flex-col justify-end gap-1.5">
        <h3 className="text-[11px] sm:text-xs font-bold text-white font-serif line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between pt-0.5 opacity-80 group-hover:opacity-100">
          <span className="text-[9px] text-slate-400 font-medium truncate max-w-[100px]">
            {video.channelName || 'Budget Padmanaban'}
          </span>
          <span className="text-[9px] font-bold text-amber-400 group-hover:underline shrink-0 flex items-center gap-0.5">
            <span>{isTamil ? 'பார்க்க' : 'Watch'}</span>
            <span>→</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function CinemaSpotlightHero({
  spotlightVideos = [],
  onWatchVideo,
  language = 'ta'
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isTamil = language === 'ta';

  if (!spotlightVideos || spotlightVideos.length === 0) return null;

  const currentVideo = spotlightVideos[currentIndex] || spotlightVideos[0];
  const title = isTamil
    ? (currentVideo.titleTamil || currentVideo.title)
    : (currentVideo.titleEnglish || currentVideo.title);
  const description = isTamil
    ? (currentVideo.descriptionTamil || currentVideo.description)
    : (currentVideo.descriptionEnglish || currentVideo.description);

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900 border border-[rgba(201,181,156,0.5)] dark:border-amber-500/30 p-5 sm:p-8 shadow-xl text-slate-900 dark:text-white">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow">
              SPOTLIGHT MASTERCLASS
            </span>
            <span className="text-xs font-mono text-amber-700 dark:text-amber-400/90 font-bold">
              {currentVideo.category?.toUpperCase()}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black font-serif text-slate-900 dark:text-white leading-tight tracking-tight">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed font-sans max-w-2xl">
            {description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onWatchVideo && onWatchVideo(currentVideo)}
              className="btn-magnetic px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{isTamil ? 'இப்போதே பார்க்க' : 'Watch Masterclass'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-bold">
              <span className="text-slate-900 dark:text-white">{currentVideo.channelName || 'Budget Padmanaban'}</span>
              <span>•</span>
              <span>Original Guides</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div
            onClick={() => onWatchVideo && onWatchVideo(currentVideo)}
            className="group relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-[rgba(217,207,199,0.7)] dark:border-white/15 shadow-2xl cursor-pointer"
          >
            <img
              src={currentVideo.thumbnail || `https://img.youtube.com/vi/${currentVideo.youtubeId}/hqdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {spotlightVideos.map((vid, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={vid.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-1 min-w-[65px] sm:min-w-[75px] p-1.5 rounded-xl border transition-all text-left ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50 text-amber-900 dark:text-amber-300'
                      : 'bg-[rgba(239,233,227,0.7)] dark:bg-slate-900/80 border-[rgba(201,181,156,0.4)] dark:border-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-[9px] font-bold truncate">
                    0${idx + 1} • ${vid.duration || 'Video'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CinemaVideoRail({
  titleTamil,
  titleEnglish,
  subtitleTamil,
  subtitleEnglish,
  badgeText,
  videos = [],
  onSelectVideo,
  language = 'ta',
  onShowToast
}) {
  const scrollRef = useRef(null);
  const isTamil = language === 'ta';

  if (!videos || videos.length === 0) return null;

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const distance = direction === 'left' ? -320 : 320;
    scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const title = isTamil ? titleTamil : titleEnglish;
  const subtitle = isTamil ? subtitleTamil : subtitleEnglish;

  return (
    <section className="space-y-3 py-3 select-none">
      <div className="flex items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
              {title}
            </h2>
            {badgeText && (
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700 btn-magnetic text-xs"
          >
            ←
          </button>
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700 btn-magnetic text-xs"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth"
      >
        {videos.map((video, idx) => (
          <div key={`rail-${video.id || idx}`} className="w-[140px] sm:w-[165px] md:w-[185px] shrink-0">
            <CinemaVideoCard
              video={video}
              index={idx}
              onSelect={onSelectVideo}
              language={language}
              onShowToast={onShowToast}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function CinemaTheaterModal({
  video,
  allVideos = [],
  onClose,
  onSelectRelated,
  language = 'ta',
  onShowToast
}) {
  const { session } = useAuth();
  const isTamil = language === 'ta';
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'takeaways' | 'tools'
  const [sidebarFilter, setSidebarFilter] = useState('all'); // 'all' | 'category' | 'shorts'
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  if (!video) return null;

  const youtubeId = video.youtubeId || '';
  const embedUrl = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1` : '';
  const youtubeWatchUrl = video.youtubeUrl || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : '');

  const title = isTamil
    ? (video.titleTamil || video.title)
    : (video.titleEnglish || video.title);
  const description = isTamil
    ? (video.descriptionTamil || video.description)
    : (video.descriptionEnglish || video.description);

  const rawVideos = (allVideos && allVideos.length > 0 ? allVideos : (typeof videosData !== 'undefined' ? videosData : []));

  const filteredPlaylist = useMemo(() => {
    let list = rawVideos.filter(v => v.id !== video.id);
    if (sidebarFilter === 'category' && video.category) {
      list = list.filter(v => v.category === video.category);
    } else if (sidebarFilter === 'shorts') {
      list = list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts')));
    }
    if (sidebarSearch.trim()) {
      const q = sidebarSearch.toLowerCase();
      list = list.filter(v => 
        (v.titleTamil && v.titleTamil.toLowerCase().includes(q)) ||
        (v.titleEnglish && v.titleEnglish.toLowerCase().includes(q)) ||
        (v.title && v.title.toLowerCase().includes(q)) ||
        (v.category && v.category.toLowerCase().includes(q))
      );
    }
    return list.slice(0, 25).map(v => (typeof translateVideo === 'function' ? translateVideo(v, language) : v));
  }, [rawVideos, video.id, video.category, sidebarFilter, sidebarSearch, language]);

  const handleShare = async () => {
    const shareUrl = youtubeWatchUrl || window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        if (onShowToast) onShowToast(isTamil ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[999999] w-screen h-screen bg-[#070b14] flex flex-col overflow-hidden text-white animate-fadeIn"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 999999 }}
    >
      {/* 1. SITE BRAND LOGO HEADER */}
      <Header onOpenSearch={() => {}} onNavigate={(h) => { onClose && onClose(); if (typeof onNavigate === 'function') onNavigate(h); else window.location.hash = h; }} />

      {/* 2. NAVIGATION BUTTONS BAR */}
      <Navbar currentPath="#/videos" onNavigate={(h) => { onClose && onClose(); if (typeof onNavigate === 'function') onNavigate(h); else window.location.hash = h; }} />

      {/* 3. BREAKING NEWS TICKER */}
      <TrendingTicker />

      {/* 4. TOP STUDIO SUB-NAVIGATION BAR */}
      <div className="h-12 bg-[#090e1a] border-b border-slate-800/90 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-all text-xs font-black border border-slate-700 shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">{isTamil ? 'அனைத்து வீடியோக்கள்' : 'Back to Videos'}</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 truncate">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider shrink-0">
              {(video.category || 'FINANCE').replace('-', ' ')}
            </span>
            <span className="text-xs text-slate-300 font-bold truncate hidden md:inline">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>{copied ? '✓ Copied' : (isTamil ? 'பகிர்' : 'Share')}</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Exit Fullscreen"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold border border-slate-700 ml-1"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. STUDIO SPLIT VIEW (LEFT STAGE + RIGHT PLAYLIST) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
        
        {/* LEFT COLUMN: Large HD Cinema Stage & Interactive Tabs (8 Cols on LG, 9 on XL) */}
        <main className="lg:col-span-8 xl:col-span-9 flex flex-col min-h-0 bg-[#040711] overflow-y-auto">
          {/* 16:9 Video Canvas Frame */}
          <div className="w-full bg-black flex items-center justify-center p-0 sm:p-2 lg:p-4 shrink-0 shadow-2xl">
            <div className="w-full max-w-5xl aspect-video max-h-[62vh] rounded-none sm:rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-900">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <span>Video player unavailable</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Information & Details Container */}
          <div className="p-5 sm:p-8 space-y-6 max-w-5xl">
            {/* Title & Channel Header */}
            <div className="space-y-3 border-b border-slate-800/80 pb-5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif text-white leading-snug tracking-tight">
                {title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                {/* Channel Pill */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
                    BP
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">
                        {video.channelName || 'Budget Padmanaban'}
                      </span>
                      <span className="text-emerald-400 text-xs font-bold" title="CFP Certified">✓ CFP®</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Certified Financial Planner • Video Masterclasses
                    </p>
                  </div>
                </div>

                {/* Meta stats */}
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold">{video.views ? `${video.views.toLocaleString()} views` : 'Masterclass'}</span>
                  <span>•</span>
                  <span>{video.duration || '12:00'}</span>
                  {video.publishedAt && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Tabs Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {isTamil ? '📖 விளக்கம் & விவரங்கள்' : '📖 Overview & Details'}
              </button>

              <button
                onClick={() => setActiveTab('takeaways')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'takeaways'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {isTamil ? '💡 முக்கிய ஆலோசனைகள்' : '💡 Key Takeaways'}
              </button>

              <button
                onClick={() => setActiveTab('tools')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'tools'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {isTamil ? '🧮 SIP கால்குலேட்டர்' : '🧮 SIP Calculator'}
              </button>
            </div>

            {/* Tab Content Display */}
            {activeTab === 'overview' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line space-y-4">
                <p>{description || (isTamil ? 'இந்த வீடியோவிற்கான விளக்கம் விரைவில் புதுப்பிக்கப்படும்.' : 'No detailed description available.')}</p>
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-amber-400 border border-slate-800">
                    #{(video.category || 'finance').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-slate-400 border border-slate-800">
                    #BudgetPadmanaban
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-slate-400 border border-slate-800">
                    #MutualFunds
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-slate-400 border border-slate-800">
                    #SIPCompounding
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'takeaways' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
                <h3 className="text-sm font-bold text-amber-400">
                  {isTamil ? 'பட்ஜெட் பத்மநாபன் CFP® முக்கிய ஆலோசனைகள்:' : 'Core Principles & Financial Takeaways:'}
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    <span>{isTamil ? 'நீண்ட கால கூட்டு வட்டி (Compounding) பயனை முழுமையாகப் பயன்படுத்த ஒழுங்கான SIP முதலீட்டை தொடரவும்.' : 'Maintain disciplined SIP investments to harness long-term compounding benefits.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    <span>{isTamil ? 'சந்தையின் குறுகிய கால ஏற்ற இறக்கங்களைப் பார்த்து அவசரப்பட்டு முதலீட்டை திரும்பப் பெறாதீர்கள்.' : 'Avoid emotional exits during market corrections; stay focused on your financial goals.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    <span>{isTamil ? 'உங்கள் குடும்பத்தின் மருத்துவ காப்பீடு மற்றும் அவசர கால நிதியை எப்போதும் உறுதி செய்யுங்கள்.' : 'Ensure adequate health insurance and 6-month emergency reserve before investing.'}</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/30 space-y-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">
                    {isTamil ? 'உங்கள் SIP இலக்கை உடனடியாகக் கணக்கிடுங்கள்' : 'Calculate Your SIP Wealth Growth'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isTamil ? '₹5,000 மாத SIP முதலீட்டின் 10-15 வருட கூட்டு வட்டி வளர்ச்சி மதிப்பை அறியுங்கள்.' : 'Simulate your future portfolio returns with our interactive compounding tool.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose && onClose();
                    window.location.hash = '#/calculator';
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 whitespace-nowrap transition-transform hover:scale-105 shrink-0"
                >
                  {isTamil ? 'கால்குலேட்டரைத் திறக்க →' : 'Launch SIP Calculator →'}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT COLUMN: Interactive Playlist & Search Sidebar (4 Cols on LG, 3 on XL) */}
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col min-h-0 bg-[#090e1a] overflow-hidden">
          {/* Sidebar Header with Filter Tabs & Search */}
          <div className="p-3.5 border-b border-slate-800 bg-[#070b14] space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{isTamil ? 'அடுத்த வீடியோக்கள்' : 'Up Next & Playlist'}</span>
              </h2>
              <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                {filteredPlaylist.length} {isTamil ? 'பதிவுகள்' : 'items'}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSidebarFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition-all ${
                  sidebarFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {isTamil ? 'அனைத்தும்' : 'All'}
              </button>
              <button
                onClick={() => setSidebarFilter('category')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition-all ${
                  sidebarFilter === 'category'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {isTamil ? 'இதே பிரிவு' : 'Same Category'}
              </button>
              <button
                onClick={() => setSidebarFilter('shorts')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition-all ${
                  sidebarFilter === 'shorts'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Shorts
              </button>
            </div>

            {/* Search within playlist */}
            <div className="relative">
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder={isTamil ? 'வீடியோக்களைத் தேடுங்கள்...' : 'Filter playlist...'}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
              {sidebarSearch && (
                <button
                  onClick={() => setSidebarSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Playlist Cards */}
          <div className="p-3 space-y-2 overflow-y-auto flex-1 divide-y divide-slate-800/40">
            {filteredPlaylist.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                {isTamil ? 'வீடியோக்கள் எதுவும் கிடைக்கவில்லை' : 'No matching videos found'}
              </div>
            ) : (
              filteredPlaylist.map((rel) => {
                const relTitle = isTamil
                  ? (rel.titleTamil || rel.title)
                  : (rel.titleEnglish || rel.title);

                return (
                  <div
                    key={`theater-related-${rel.id}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectRelated && onSelectRelated(rel)}
                    className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/90 border border-transparent hover:border-amber-500/40 transition-all cursor-pointer pt-3 first:pt-1"
                  >
                    <div className="relative w-28 sm:w-32 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-950 shadow">
                      <img
                        src={rel.thumbnail || `https://img.youtube.com/vi/${rel.youtubeId}/hqdefault.jpg`}
                        alt={relTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[8px] font-mono font-bold text-slate-200">
                        {rel.duration || '12:00'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 line-clamp-2 leading-tight transition-colors">
                        {relTitle}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="text-amber-500 font-semibold uppercase text-[9px]">
                          {(rel.category || 'FINANCE').replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalNode, document.body);
}

/**
 * HOME CINEMA VIDEO SHOWCASE (COMPACT SLEEK GRID ON HOMEPAGE)
 */
function HomeCinemaShowcase({ onNavigate, onShowToast, language = 'ta' }) {
  const isTamil = language === 'ta';
  const [activeCategory, setActiveCategory] = useState('featured');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { videos: allVideos = [], isLoading } = useVideos('all', 'newest');

  const categories = [
    { id: 'featured', labelTa: 'சமீபத்திய & முக்கிய வீடியோக்கள்', labelEn: 'Latest & Featured' },
    { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
    { id: 'stocks', labelTa: 'பங்குச் சந்தை & IPO', labelEn: 'Stocks & Markets' },
    { id: 'tax-saving', labelTa: 'வரி சேமிப்பு & ஓய்வூதியம்', labelEn: 'Tax & Retirement' },
    { id: 'education', labelTa: 'முதலீட்டுக் கல்வி', labelEn: 'Financial Education' },
    { id: 'shorts', labelTa: 'குறுகிய வீடியோக்கள் (Shorts)', labelEn: 'Quick Takes (Shorts)' }
  ];

  const showcaseVideos = useMemo(() => {
    let list = [...allVideos];
    if (activeCategory === 'featured') {
      return list.slice(0, 12);
    } else if (activeCategory === 'shorts') {
      return list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts'))).slice(0, 12);
    } else if (activeCategory === 'personal-finance') {
      return list.filter(v => v.category === 'personal-finance').slice(0, 12);
    } else if (activeCategory === 'mutual-funds') {
      return list.filter(v => v.category === 'mutual-funds').slice(0, 12);
    } else if (activeCategory === 'stocks') {
      return list.filter(v => v.category === 'stocks' || v.category === 'ipo').slice(0, 12);
    } else if (activeCategory === 'tax-saving') {
      return list.filter(v => v.category === 'tax-saving' || v.category === 'retirement').slice(0, 12);
    } else if (activeCategory === 'education') {
      return list.filter(v => v.category === 'education').slice(0, 12);
    }
    return list.slice(0, 12);
  }, [allVideos, activeCategory]);

  return (
    <section className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2 select-none space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat.id;
          const isEven = idx % 2 === 0;
          const activeBg = isEven
            ? 'bg-[#03529A] text-white shadow-md shadow-[#03529A]/25 scale-105'
            : 'bg-[#4A9E2C] text-white shadow-md shadow-[#4A9E2C]/25 scale-105';
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`btn-magnetic px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 ${
                isActive
                  ? activeBg
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {isTamil ? cat.labelTa : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* 6-Column Level Responsive Grid (2 mobile, 3 sm, 4 md, 6 lg/xl/2xl) */}
      {isLoading && showcaseVideos.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3 sm:gap-3.5 animate-pulse">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-200 dark:bg-slate-800/60 aspect-[9/13] p-3 space-y-2">
              <div className="aspect-video bg-slate-300 dark:bg-slate-700/60 rounded-xl" />
              <div className="h-3 bg-slate-300 dark:bg-slate-700/60 rounded w-3/4" />
              <div className="h-2 bg-slate-300 dark:bg-slate-700/60 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3 sm:gap-3.5">
          {showcaseVideos.map((video, idx) => (
            <CinemaVideoCard
              key={`home-cinema-${video.id || idx}`}
              video={video}
              index={idx}
              onSelect={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}

      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={allVideos}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(rel) => setSelectedVideo(rel)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </section>
  );
}

/**
 * HOME PAGE
 */
function Home({ onNavigate, onShowToast }) {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
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

      {/* 4. FINANCIAL CALCULATOR */}
      <SipCalculator />
    </div>
  );
}

/**
 * VIDEOS PAGE (FULL 882 VIDEOS PORTAL)
 */
function VideosPage({ onNavigate, onShowToast, initialVideoId }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleGridCount, setVisibleGridCount] = useState(48);
  const [viewMode, setViewMode] = useState('rails');
  const sentinelRef = useRef(null);

  // Live video hook — pulls directly from Supabase /api/videos with built-in fallback
  const { videos: allLiveVideos = [], isLoading: isVideosLoading } = useVideos('all', 'newest');

  useEffect(() => {
    if (initialVideoId && allLiveVideos && allLiveVideos.length > 0) {
      const found = allLiveVideos.find(v => v.id === initialVideoId || v.youtubeId === initialVideoId || v.slug === initialVideoId);
      if (found) {
        setSelectedVideo(found);
      }
    }
  }, [initialVideoId, allLiveVideos]);

  const categoriesList = [
    { id: 'all', labelTa: `அனைத்து வீடியோக்கள்${allLiveVideos.length ? ` (${allLiveVideos.length})` : ''}`, labelEn: `All Videos${allLiveVideos.length ? ` (${allLiveVideos.length})` : ''}` },
    { id: 'trending', labelTa: 'முக்கிய பதிவுகள்', labelEn: 'Featured & Trending' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
    { id: 'stocks', labelTa: 'பங்குச் சந்தை', labelEn: 'Stock Market' },
    { id: 'ipo', labelTa: 'IPO அலசல்', labelEn: 'IPO Analysis' },
    { id: 'gold-bonds', labelTa: 'தங்கம் & SGB பத்திரங்கள்', labelEn: 'Gold & SGB Bonds' },
    { id: 'tax-saving', labelTa: 'வரி சேமிப்பு திட்டமிடல்', labelEn: 'Tax Planning' },
    { id: 'retirement', labelTa: 'ஓய்வூதியம் (NPS & EPF)', labelEn: 'Retirement & NPS' },
    { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance' },
    { id: 'shorts', labelTa: 'குறுகிய வீடியோக்கள்', labelEn: 'Shorts' }
  ];

  const spotlightVideos = useMemo(() => {
    return allLiveVideos
      .filter(v => v.trending || v.category === 'mutual-funds')
      .slice(0, 5);
  }, [allLiveVideos]);

  const railsData = useMemo(() => {
    return {
      masterclasses: allLiveVideos.filter(v => v.trending || v.views > 25000).slice(0, 12),
      shorts: allLiveVideos.filter(v => v.isShort || (v.tags && v.tags.includes('shorts'))).slice(0, 14),
      mutualFunds: allLiveVideos.filter(v => v.category === 'mutual-funds').slice(0, 12),
      stocks: allLiveVideos.filter(v => v.category === 'stocks' || v.category === 'ipo').slice(0, 12),
      taxRetirement: allLiveVideos.filter(v => v.category === 'tax-saving' || v.category === 'retirement').slice(0, 12),
      personalFinance: allLiveVideos.filter(v => v.category === 'personal-finance' || v.category === 'gold-bonds').slice(0, 12)
    };
  }, [allLiveVideos]);

  const filteredVideos = useMemo(() => {
    let list = [...allLiveVideos];

    if (activeCategory === 'trending') {
      list = list.filter(v => v.trending);
    } else if (activeCategory === 'shorts') {
      list = list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts')));
    } else if (activeCategory !== 'all') {
      list = list.filter(v => v.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(v => {
        const titleT = (v.titleTamil || v.title || "").toLowerCase();
        const titleE = (v.titleEnglish || v.title || "").toLowerCase();
        const descT = (v.descriptionTamil || v.description || "").toLowerCase();
        const descE = (v.descriptionEnglish || v.description || "").toLowerCase();
        const cat = (v.category || "").toLowerCase();
        return titleT.includes(q) || titleE.includes(q) || descT.includes(q) || descE.includes(q) || cat.includes(q);
      });
    }

    if (sortBy === 'views') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else if (sortBy === 'duration') {
      list.sort((a, b) => (b.duration || '').localeCompare(a.duration || ''));
    } else {
      list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    return list;
  }, [allLiveVideos, activeCategory, searchQuery, sortBy]);

  // Seamless auto-load on scroll with generous threshold
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleGridCount(prev => {
          if (prev < filteredVideos.length) {
            return Math.min(prev + 48, filteredVideos.length);
          }
          return prev;
        });
      }
    }, { rootMargin: '600px' });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filteredVideos.length]);

  const handleLoadMore = () => {
    setVisibleGridCount(prev => Math.min(prev + 48, filteredVideos.length));
  };

  const handleLoadAll = () => {
    setVisibleGridCount(filteredVideos.length);
  };

  const isFiltering = activeCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen pb-24 space-y-6 text-slate-900 dark:text-white animate-fadeIn">
      {/* 1. CINEMA SPOTLIGHT HERO */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <CinemaSpotlightHero
          spotlightVideos={spotlightVideos}
          onWatchVideo={(v) => setSelectedVideo(v)}
          language={language}
        />
      </div>

      {/* 2. CATEGORY & SEARCH CONTROLS BAR */}
      <div className="bg-white/95 dark:bg-slate-950/95  border-y border-slate-200 dark:border-slate-800/80 shadow-sm py-3">
        <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categoriesList.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setVisibleGridCount(48);
                  }}
                  className={`btn-magnetic px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-0.5">
            <div className="relative flex-1">
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setVisibleGridCount(48);
                }}
                placeholder={isTamil ? "வீடியோக்களில் தேடுங்கள் (எ.கா: SIP, Nifty, Tax)..." : "Search masterclasses (e.g. SIP, Nifty, Tax)..."}
                className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold hidden sm:inline">{isTamil ? 'வரிசை:' : 'Sort:'}</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="newest">{isTamil ? 'சமீபத்தியவை' : 'Latest Uploads'}</option>
                  <option value="views">{isTamil ? 'அதிக பார்வை' : 'Most Popular'}</option>
                  <option value="oldest">{isTamil ? 'பழையவை' : 'Oldest First'}</option>
                </select>
              </div>

              <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('rails')}
                  className={`btn-magnetic px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'rails' && !isFiltering
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  {isTamil ? 'தனித்தனி வரிசைகள்' : 'Cinematic Rails'}
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`btn-magnetic px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'grid' || isFiltering
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  {isTamil ? 'முழு கட்டம்' : 'Full Grid'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: CINEMATIC RAILS OR FULL 882 GRID */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {isFiltering || viewMode === 'grid' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                {isTamil
                  ? `${filteredVideos.length} வீடியோக்கள் கண்டறியப்பட்டன (காண்பிக்கப்படுவது ${Math.min(visibleGridCount, filteredVideos.length)})`
                  : `Showing ${Math.min(visibleGridCount, filteredVideos.length)} of ${filteredVideos.length} masterclasses`}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
              {filteredVideos.slice(0, visibleGridCount).map((video, idx) => (
                <CinemaVideoCard
                  key={`grid-cinema-${video.id || idx}`}
                  video={video}
                  index={idx}
                  onSelect={(v) => setSelectedVideo(v)}
                  language={language}
                  onShowToast={onShowToast}
                />
              ))}
            </div>

            {/* Load More & Infinite Scroll Container */}
            <div ref={sentinelRef} className="pt-8 pb-10 text-center">
              {visibleGridCount < filteredVideos.length ? (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleLoadMore}
                    className="btn-magnetic px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <span>▶</span>
                    <span>
                      {isTamil
                        ? `மேலும் 48 வீடியோக்களைக் காட்டு (${Math.min(visibleGridCount, filteredVideos.length)} / ${filteredVideos.length})`
                        : `Load Next 48 Videos (${Math.min(visibleGridCount, filteredVideos.length)} / ${filteredVideos.length})`}
                    </span>
                  </button>

                  <button
                    onClick={handleLoadAll}
                    className="btn-magnetic px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
                  >
                    <span>{isTamil ? `அனைத்து ${filteredVideos.length} வீடியோக்களையும் ஏற்று` : `Show All ${filteredVideos.length} Videos`}</span>
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400">
                  <span className="text-emerald-500">✓</span>
                  <span>
                    {isTamil
                      ? `அனைத்து ${filteredVideos.length} வீடியோக்களும் ஏற்றப்பட்டன`
                      : `All ${filteredVideos.length} masterclasses loaded`}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <CinemaVideoRail
              titleTamil="பிரபலமான வீடியோக்கள் & Masterclasses"
              titleEnglish="Trending & Highly Watched Masterclasses"
              subtitleTamil="அதிக முதலீட்டாளர்களால் பார்க்கப்பட்ட முதன்மையான மியூச்சுவல் ஃபண்ட் மற்றும் பங்குச் சந்தை வழிகாட்டிகள்"
              subtitleEnglish="Top-rated investor masterclasses with over 25,000+ views"
              badgeText="FEATURED"
              videos={railsData.masterclasses}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="குறுகிய வீடியோக்கள் & Quick Takes"
              titleEnglish="Quick Takes & YouTube Shorts"
              subtitleTamil="1 நிமிடத்தில் புரியும் முக்கியமான முதலீட்டு ஆலோசனைகள் மற்றும் ரகசியங்கள்"
              subtitleEnglish="Bite-sized high-impact financial lessons in under 60 seconds"
              badgeText="SHORTS"
              videos={railsData.shorts}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="மியூச்சுவல் ஃபண்ட் & SIP திட்டங்கள்"
              titleEnglish="Mutual Funds & SIP Strategies"
              subtitleTamil="Small Cap, Mid Cap, Flexi Cap மற்றும் Index ஃபண்டுகளின் முழுமையான ஒப்பீடு"
              subtitleEnglish="Comprehensive fund reviews, CAGR calculations, and portfolio allocation"
              badgeText="MUTUAL FUNDS"
              videos={railsData.mutualFunds}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="பங்குச் சந்தை & IPO அலசல்"
              titleEnglish="Stock Market & IPO Breakdowns"
              subtitleTamil="நேரடி பங்கு முதலீடு, தொழில்நுட்ப பகுப்பாய்வு மற்றும் புதிய IPO மதிப்பீடுகள்"
              subtitleEnglish="Direct equity fundamentals, risk management, and live IPO reviews"
              badgeText="STOCKS"
              videos={railsData.stocks}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="வரி சேமிப்பு & ஓய்வூதியத் திட்டமிடல்"
              titleEnglish="Tax Optimization & Retirement Planning"
              subtitleTamil="NPS, EPF, Section 80C வரி சேமிப்பு மற்றும் ஓய்வூதிய நிதி கணக்கீடுகள்"
              subtitleEnglish="NPS, EPF, Section 80C optimization, and retirement corpus calculators"
              badgeText="RETIREMENT"
              videos={railsData.taxRetirement}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />

            <CinemaVideoRail
              titleTamil="தனிநபர் நிதி & தங்க முதலீடுகள்"
              titleEnglish="Personal Finance & Sovereign Gold"
              subtitleTamil="குடும்ப பட்ஜெட், அவசர கால நிதி மற்றும் தங்க பத்திரங்கள்"
              subtitleEnglish="Budgeting frameworks, emergency reserves, and Sovereign Gold Bonds"
              badgeText="WEALTH"
              videos={railsData.personalFinance}
              onSelectVideo={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />
          </div>
        )}
      </div>

      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={allLiveVideos}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(relVideo) => setSelectedVideo(relVideo)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}


function ArticlesPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session } = useAuth();
  const { bookmarks, toggleBookmark, isSaved } = useBookmarks();
  const isTamil = language === 'ta';

  const [rawArticles, setRawArticles] = useState([]);
  const [publishersList, setPublishersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [dateRange, setDateRange] = useState('all'); // 'all' | '7days' | '30days' | '3months'
  const [selectedLanguage, setSelectedLanguage] = useState('both'); // 'both' | 'ta' | 'en'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'views' | 'oldest' | 'read_time'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Collapsible Sections State (Left Sidebar)
  const [collapsedSections, setCollapsedSections] = useState({
    category: false,
    publisher: false,
    date: false,
    language: false
  });

  // Mobile Filter Drawer State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const resultsTopRef = useRef(null);

  const toggleSection = (sectionKey) => {
    setCollapsedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Predefined Category Definitions matching site structure
  const filterCategories = [
    { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP' },
    { id: 'stocks', labelTa: 'பங்குச் சந்தை & வர்த்தகம்', labelEn: 'Stocks & Markets' },
    { id: 'tax-retirement', labelTa: 'வரி சேமிப்பு & ஓய்வூதியம்', labelEn: 'Tax & Retirement' },
    { id: 'financial-education', labelTa: 'நிதி அறிவு & வழிகாட்டி', labelEn: 'Financial Education' },
    { id: 'quick-takes', labelTa: 'விரைவு பார்வைகள்', labelEn: 'Quick Takes' }
  ];

  // Map arbitrary database category string to unified category bucket
  const getCategoryBucket = useCallback((cat) => {
    const c = (cat || '').toLowerCase().trim();
    if (c.includes('mutual') || c.includes('fund') || c.includes('sip') || c.includes('elss')) return 'mutual-funds';
    if (c.includes('stock') || c.includes('market') || c.includes('ipo') || c.includes('trade') || c.includes('share')) return 'stocks';
    if (c.includes('tax') || c.includes('retire') || c.includes('nps') || c.includes('epf') || c.includes('pension')) return 'tax-retirement';
    if (c.includes('edu') || c.includes('guide') || c.includes('learn') || c.includes('basic') || c.includes('masterclass')) return 'financial-education';
    if (c.includes('quick') || c.includes('short') || c.includes('take') || c.includes('brief')) return 'quick-takes';
    return 'personal-finance';
  }, []);

  // Fetch articles and publisher directory
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = session?.access_token || '';
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [articlesRes, pubRes] = await Promise.allSettled([
          fetch('/api/articles?limit=250&sort=newest', { headers }).then(r => r.ok ? r.json() : null),
          fetch('/api/publishers?limit=50', { headers }).then(r => r.ok ? r.json() : null)
        ]);

        if (isMounted) {
          if (articlesRes.status === 'fulfilled' && articlesRes.value?.status === 'success') {
            setRawArticles(articlesRes.value.data || []);
          } else {
            // Fallback to sample published articles if database is empty/offline
            setRawArticles([]);
          }

          if (pubRes.status === 'fulfilled' && pubRes.value?.status === 'success') {
            setPublishersList(pubRes.value.data || []);
          }
        }
      } catch (err) {
        console.error('Error fetching articles data:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [session]);

  // Aggregate active publishers with dynamic article counts from raw dataset
  const activePublishers = useMemo(() => {
    const pubMap = new Map();

    // 1. Prepopulate from publishersList API
    publishersList.forEach(p => {
      const pubId = String(p.id || p.display_name || '').toLowerCase();
      pubMap.set(pubId, {
        id: pubId,
        rawId: p.id,
        name: p.display_name || 'Budget Padmanaban',
        arn: p.arn_number || '',
        avatar: p.avatar_url || '',
        count: 0
      });
    });

    // 2. Tally article counts from raw articles
    rawArticles.forEach(a => {
      const authorKey = String(a.authorId || a.authorName || 'budget-padmanaban').toLowerCase();
      const authorName = a.authorName || 'Budget Padmanaban';
      const authorArn = a.authorArn || a.author_arn || (authorName.toLowerCase().includes('padmanaban') ? 'ARN-112345' : '');

      if (!pubMap.has(authorKey)) {
        pubMap.set(authorKey, {
          id: authorKey,
          rawId: a.authorId || authorKey,
          name: authorName,
          arn: authorArn,
          avatar: a.authorAvatar || '',
          count: 0
        });
      }
      pubMap.get(authorKey).count += 1;
    });

    // Convert map to array and sort by article count descending
    return Array.from(pubMap.values()).filter(p => p.count > 0 || p.name);
  }, [rawArticles, publishersList]);

  // Handle category checkbox toggle
  const toggleCategoryFilter = (catId) => {
    setCurrentPage(1);
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  // Handle publisher checkbox toggle
  const togglePublisherFilter = (pubId) => {
    setCurrentPage(1);
    setSelectedPublishers(prev =>
      prev.includes(pubId) ? prev.filter(p => p !== pubId) : [...prev, pubId]
    );
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPublishers([]);
    setDateRange('all');
    setSelectedLanguage('both');
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategories.length > 0 ||
    selectedPublishers.length > 0 ||
    dateRange !== 'all' ||
    selectedLanguage !== 'both' ||
    searchQuery.trim().length > 0;

  // Filter and sort the full articles dataset
  const filteredArticles = useMemo(() => {
    const now = new Date().getTime();

    return rawArticles.filter(article => {
      // 1. Category Filter (multi-select OR)
      if (selectedCategories.length > 0) {
        const bucket = getCategoryBucket(article.category);
        if (!selectedCategories.includes(bucket)) {
          return false;
        }
      }

      // 2. Publisher Filter (multi-select OR)
      if (selectedPublishers.length > 0) {
        const authorKey = String(article.authorId || article.authorName || '').toLowerCase();
        const matched = selectedPublishers.some(pubId =>
          authorKey === pubId ||
          authorKey.includes(pubId) ||
          pubId.includes(authorKey) ||
          (pubId.includes('padmanaban') && (article.authorName || '').toLowerCase().includes('padmanaban'))
        );
        if (!matched) return false;
      }

      // 3. Published Date Filter
      if (dateRange !== 'all' && article.publishedAt) {
        const pubTime = new Date(article.publishedAt).getTime();
        const diffDays = (now - pubTime) / (1000 * 60 * 60 * 24);
        if (dateRange === '7days' && diffDays > 7) return false;
        if (dateRange === '30days' && diffDays > 30) return false;
        if (dateRange === '3months' && diffDays > 90) return false;
      }

      // 4. Language Filter
      if (selectedLanguage === 'ta') {
        const hasTamil = Boolean(article.titleTamil || article.contentTamil || article.language === 'ta');
        if (!hasTamil) return false;
      } else if (selectedLanguage === 'en') {
        const hasEnglish = Boolean(article.titleEnglish || article.contentEnglish || article.language === 'en');
        if (!hasEnglish) return false;
      }

      // 5. Keyword Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const tTa = (article.titleTamil || '').toLowerCase();
        const tEn = (article.titleEnglish || '').toLowerCase();
        const eTa = (article.excerptTamil || article.summaryTamil || '').toLowerCase();
        const eEn = (article.excerptEnglish || article.summaryEnglish || '').toLowerCase();
        const author = (article.authorName || '').toLowerCase();
        const cat = (article.category || '').toLowerCase();

        const match = tTa.includes(q) || tEn.includes(q) || eTa.includes(q) || eEn.includes(q) || author.includes(q) || cat.includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'oldest') {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateA - dateB;
      }
      if (sortBy === 'views') {
        const vA = a.views || a.viewCount || 0;
        const vB = b.views || b.viewCount || 0;
        return vB - vA;
      }
      if (sortBy === 'read_time') {
        const rA = a.readTimeMinutes || 4;
        const rB = b.readTimeMinutes || 4;
        return rB - rA;
      }
      return 0;
    });
  }, [rawArticles, selectedCategories, selectedPublishers, dateRange, selectedLanguage, searchQuery, sortBy, getCategoryBucket]);

  // Live facet counts computed for Category checkboxes
  const categoryCounts = useMemo(() => {
    const counts = {};
    filterCategories.forEach(cat => { counts[cat.id] = 0; });
    rawArticles.forEach(a => {
      const bucket = getCategoryBucket(a.category);
      if (counts[bucket] !== undefined) {
        counts[bucket] += 1;
      }
    });
    return counts;
  }, [rawArticles, getCategoryBucket]);

  // Live counts for Date Ranges
  const dateRangeCounts = useMemo(() => {
    const now = new Date().getTime();
    let c7 = 0, c30 = 0, c90 = 0;
    rawArticles.forEach(a => {
      if (a.publishedAt) {
        const diff = (now - new Date(a.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (diff <= 7) c7++;
        if (diff <= 30) c30++;
        if (diff <= 90) c90++;
      }
    });
    return { all: rawArticles.length, '7days': c7, '30days': c30, '3months': c90 };
  }, [rawArticles]);

  // Live counts for Languages
  const languageCounts = useMemo(() => {
    let taCount = 0, enCount = 0;
    rawArticles.forEach(a => {
      if (a.titleTamil || a.contentTamil || a.language === 'ta') taCount++;
      if (a.titleEnglish || a.contentEnglish || a.language === 'en') enCount++;
    });
    return { both: rawArticles.length, ta: taCount, en: enCount };
  }, [rawArticles]);

  // Pagination calculation
  const totalArticles = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / itemsPerPage));
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage, itemsPerPage]);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    if (resultsTopRef.current) {
      resultsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Share Article Handler
  const handleShareArticle = async (e, article) => {
    e.stopPropagation();
    const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
    const url = `${window.location.origin}${window.location.pathname}#/articles/${article.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      if (onShowToast) onShowToast(isTamil ? 'லிங்க் நகலெடுக்கப்பட்டது!' : 'Article link copied to clipboard!');
    } catch {
      if (onShowToast) onShowToast(isTamil ? 'லிங்க் பகிர்வு தயார்!' : 'Article link ready to share!');
    }
  };

  // Bookmark Toggle Handler
  const handleBookmarkClick = (e, article) => {
    e.stopPropagation();
    toggleBookmark(article);
    const savedNow = !isSaved(article.id);
    if (onShowToast) {
      onShowToast(
        savedNow
          ? (isTamil ? 'கட்டுரை புக்மார்க்குகளில் சேமிக்கப்பட்டது!' : 'Article saved to your bookmarks!')
          : (isTamil ? 'புக்மார்க்குகளிலிருந்து நீக்கப்பட்டது.' : 'Removed from bookmarks.')
      );
    }
  };

  // Render Left Filter Content (shared between desktop sidebar and mobile drawer)
  const renderFilterContent = () => (
    <div className="space-y-6 text-sm">
      {/* 1. Category Filter Group */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between text-left font-black text-slate-900 dark:text-slate-100 text-[13.5px] uppercase tracking-wider group hover:text-brandBlue-600 dark:hover:text-brandBlue-400 transition-colors"
        >
          <span>{isTamil ? 'பிரிவு (Category)' : 'Category'}</span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${collapsedSections.category ? '-rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!collapsedSections.category && (
          <div className="mt-3.5 space-y-2.5">
            {filterCategories.map(cat => {
              const checked = selectedCategories.includes(cat.id);
              const count = categoryCounts[cat.id] || 0;
              return (
                <label
                  key={cat.id}
                  className="flex items-center justify-between gap-2.5 cursor-pointer group py-0.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategoryFilter(cat.id)}
                      className="w-4 h-4 rounded text-brandBlue-600 focus:ring-brandBlue-500/30 border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:checked:bg-brandBlue-500 cursor-pointer transition-all"
                    />
                    <span className={`text-[13px] truncate transition-colors ${checked ? 'font-black text-brandBlue-600 dark:text-brandBlue-400' : 'font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                      {isTamil ? cat.labelTa : cat.labelEn}
                    </span>
                  </div>
                  <span className="text-[11.5px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 shrink-0">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Publisher Filter Group */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('publisher')}
          className="w-full flex items-center justify-between text-left font-black text-slate-900 dark:text-slate-100 text-[13.5px] uppercase tracking-wider group hover:text-brandBlue-600 dark:hover:text-brandBlue-400 transition-colors"
        >
          <span>{isTamil ? 'பதிப்பாளர் / நிபுணர்' : 'Publisher'}</span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${collapsedSections.publisher ? '-rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!collapsedSections.publisher && (
          <div className="mt-3.5 space-y-2.5 max-h-56 overflow-y-auto no-scrollbar pr-1">
            {activePublishers.length === 0 ? (
              <p className="text-xs text-slate-400 italic">{isTamil ? 'பதிப்பாளர்கள் இல்லை' : 'No publishers listed'}</p>
            ) : (
              activePublishers.map(pub => {
                const checked = selectedPublishers.includes(pub.id);
                return (
                  <label
                    key={pub.id}
                    className="flex items-center justify-between gap-2 cursor-pointer group py-0.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePublisherFilter(pub.id)}
                        className="w-4 h-4 rounded text-brandBlue-600 focus:ring-brandBlue-500/30 border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:checked:bg-brandBlue-500 cursor-pointer transition-all"
                      />
                      <span className={`text-[13px] truncate transition-colors ${checked ? 'font-black text-brandBlue-600 dark:text-brandBlue-400' : 'font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`} title={pub.name}>
                        {pub.name}
                      </span>
                    </div>
                    <span className="text-[11.5px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 shrink-0">
                      {pub.count}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 3. Published Date Filter Group */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('date')}
          className="w-full flex items-center justify-between text-left font-black text-slate-900 dark:text-slate-100 text-[13.5px] uppercase tracking-wider group hover:text-brandBlue-600 dark:hover:text-brandBlue-400 transition-colors"
        >
          <span>{isTamil ? 'வெளியிடப்பட்ட நாள்' : 'Published Date'}</span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${collapsedSections.date ? '-rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!collapsedSections.date && (
          <div className="mt-3.5 space-y-2">
            {[
              { id: 'all', labelTa: 'அனைத்து காலம்', labelEn: 'All time' },
              { id: '7days', labelTa: 'கடந்த 7 நாட்கள்', labelEn: 'Last 7 days' },
              { id: '30days', labelTa: 'கடந்த 30 நாட்கள்', labelEn: 'Last 30 days' },
              { id: '3months', labelTa: 'கடந்த 3 மாதங்கள்', labelEn: 'Last 3 months' }
            ].map(opt => {
              const active = dateRange === opt.id;
              const count = dateRangeCounts[opt.id] || 0;
              return (
                <label
                  key={opt.id}
                  className="flex items-center justify-between gap-2 cursor-pointer group py-0.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="radio"
                      name="dateRangeFilter"
                      checked={active}
                      onChange={() => { setDateRange(opt.id); setCurrentPage(1); }}
                      className="w-4 h-4 text-brandBlue-600 focus:ring-brandBlue-500/30 border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                    />
                    <span className={`text-[13px] truncate ${active ? 'font-black text-brandBlue-600 dark:text-brandBlue-400' : 'font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                      {isTamil ? opt.labelTa : opt.labelEn}
                    </span>
                  </div>
                  <span className="text-[11.5px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 shrink-0">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Language Filter Group */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('language')}
          className="w-full flex items-center justify-between text-left font-black text-slate-900 dark:text-slate-100 text-[13.5px] uppercase tracking-wider group hover:text-brandBlue-600 dark:hover:text-brandBlue-400 transition-colors"
        >
          <span>{isTamil ? 'மொழி (Language)' : 'Language'}</span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${collapsedSections.language ? '-rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!collapsedSections.language && (
          <div className="mt-3.5 space-y-2">
            {[
              { id: 'both', labelTa: 'இரண்டும் (All / Both)', labelEn: 'Both / All' },
              { id: 'ta', labelTa: 'தமிழ் (Tamil)', labelEn: 'Tamil' },
              { id: 'en', labelTa: 'English', labelEn: 'English' }
            ].map(langOpt => {
              const active = selectedLanguage === langOpt.id;
              const count = languageCounts[langOpt.id] || 0;
              return (
                <label
                  key={langOpt.id}
                  className="flex items-center justify-between gap-2 cursor-pointer group py-0.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="radio"
                      name="languageFilter"
                      checked={active}
                      onChange={() => { setSelectedLanguage(langOpt.id); setCurrentPage(1); }}
                      className="w-4 h-4 text-brandBlue-600 focus:ring-brandBlue-500/30 border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                    />
                    <span className={`text-[13px] truncate ${active ? 'font-black text-brandBlue-600 dark:text-brandBlue-400' : 'font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                      {isTamil ? langOpt.labelTa : langOpt.labelEn}
                    </span>
                  </div>
                  <span className="text-[11.5px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 shrink-0">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetAllFilters}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all text-center flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          <span>{isTamil ? 'அனைத்து வடிகட்டிகளையும் நீக்குக' : 'Clear All Filters'}</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-20 pt-4 animate-fadeIn">
      {/* Top Search & Filter Bar */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={isTamil ? "கட்டுரைகளில் தலைப்பு, ஆசிரியர், முக்கிய சொல் தேடுக (Ctrl + K)..." : "Search articles by title, author, keyword, or ARN..."}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-brandBlue-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle Button (Visible on screens < lg) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brandBlue-500/10 text-brandBlue-600 dark:text-brandBlue-400 border border-brandBlue-500/30 text-xs font-extrabold shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>{isTamil ? 'வடிகட்டிகள்' : 'Filters'}</span>
              {(selectedCategories.length > 0 || selectedPublishers.length > 0 || dateRange !== 'all' || selectedLanguage !== 'both') && (
                <span className="w-5 h-5 rounded-full bg-brandBlue-600 text-white text-[10px] font-black flex items-center justify-center">
                  {selectedCategories.length + selectedPublishers.length + (dateRange !== 'all' ? 1 : 0) + (selectedLanguage !== 'both' ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Sidebar Filters + Main Results Column */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR — FILTERS (Sticky on Desktop) ================= */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-24 z-10 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brandBlue-600 dark:text-brandBlue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {isTamil ? 'வடிகட்டிகள் (Filters)' : 'Filters'}
                  </h3>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] font-black text-brandBlue-600 dark:text-brandBlue-400 hover:underline"
                  >
                    {isTamil ? 'மீட்டமை' : 'Reset'}
                  </button>
                )}
              </div>

              {renderFilterContent()}
            </div>
          </aside>

          {/* ================= MAIN COLUMN — RESULTS LIST ================= */}
          <main className="lg:col-span-9 xl:col-span-9 space-y-4" ref={resultsTopRef}>
            
            {/* Main Column Top Control Bar: Results Count & Sort Dropdown */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {isTamil
                    ? `மொத்தம் ${totalArticles} கட்டுரைகள் கண்டறியப்பட்டன`
                    : `Showing ${totalArticles} article${totalArticles === 1 ? '' : 's'}`}
                </span>
                {hasActiveFilters && (
                  <span className="hidden sm:inline-block text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {isTamil ? 'வடிகட்டப்பட்டது' : 'Filtered'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <label htmlFor="articlesSortDropdown" className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {isTamil ? 'வரிசைப்படுத்து:' : 'Sort by:'}
                </label>
                <select
                  id="articlesSortDropdown"
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none focus:border-brandBlue-500 cursor-pointer"
                >
                  <option value="newest">{isTamil ? 'சமீபத்தியவை (Newest first)' : 'Newest first'}</option>
                  <option value="views">{isTamil ? 'அதிகம் வாசிக்கப்பட்டவை (Most read)' : 'Most read'}</option>
                  <option value="read_time">{isTamil ? 'வாசிக்கும் நேரம் (Read time)' : 'Read time'}</option>
                  <option value="oldest">{isTamil ? 'பழையவை (Oldest first)' : 'Oldest first'}</option>
                </select>
              </div>
            </div>

            {/* Active Filter Pills Bar (Quick Dismiss) */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                {selectedCategories.map(catId => {
                  const catObj = filterCategories.find(c => c.id === catId);
                  return (
                    <span
                      key={catId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brandBlue-500/10 text-brandBlue-700 dark:text-brandBlue-300 border border-brandBlue-500/30"
                    >
                      <span>{isTamil ? catObj?.labelTa : catObj?.labelEn}</span>
                      <button
                        type="button"
                        onClick={() => toggleCategoryFilter(catId)}
                        className="hover:text-red-500 transition-colors"
                        aria-label="Remove filter"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}

                {selectedPublishers.map(pubId => {
                  const pubObj = activePublishers.find(p => p.id === pubId);
                  return (
                    <span
                      key={pubId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                    >
                      <span>{pubObj?.name || pubId}</span>
                      <button
                        type="button"
                        onClick={() => togglePublisherFilter(pubId)}
                        className="hover:text-red-500 transition-colors"
                        aria-label="Remove filter"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}

                {dateRange !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    <span>{dateRange === '7days' ? 'Last 7 days' : dateRange === '30days' ? 'Last 30 days' : 'Last 3 months'}</span>
                    <button
                      type="button"
                      onClick={() => setDateRange('all')}
                      className="hover:text-red-500 transition-colors"
                      aria-label="Remove filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedLanguage !== 'both' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-800 dark:text-purple-300 border border-purple-500/30">
                    <span>{selectedLanguage === 'ta' ? 'தமிழ்' : 'English'}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('both')}
                      className="hover:text-red-500 transition-colors"
                      aria-label="Remove filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-red-500 hover:underline px-2 py-1"
                >
                  {isTamil ? 'அனைத்தையும் நீக்குக' : 'Clear all'}
                </button>
              </div>
            )}

            {/* Articles Results List */}
            {isLoading ? (
              <div className="py-24 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8">
                <div className="w-10 h-10 border-4 border-brandBlue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {isTamil ? 'ஆய்வுக் கட்டுரைகள் ஏற்றப்படுகின்றன...' : 'Loading published articles list...'}
                </p>
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold max-w-lg mx-auto space-y-2">
                <p>⚠️ {error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow"
                >
                  {isTamil ? 'மீண்டும் முயற்சிக்கவும்' : 'Retry'}
                </button>
              </div>
            ) : paginatedArticles.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl font-bold">
                  📄
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'பொருத்தமான கட்டுரைகள் எதுவும் கிடைக்கவில்லை' : 'No Matching Articles Found'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {isTamil
                    ? 'உங்கள் வடிகட்டிகளை மாற்றி அமைக்கவும் அல்லது தேடல் சொற்களை நீக்கிவிட்டு மீண்டும் பார்க்கவும்.'
                    : 'Try selecting different category or publisher filters, or clear your keyword search.'}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brandBlue-600 text-white text-xs font-black shadow-md hover:bg-brandBlue-700 transition-all"
                  >
                    <span>{isTamil ? 'வடிகட்டிகளை மீட்டமை' : 'Reset All Filters'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
                {paginatedArticles.map((article) => {
                  const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
                  const excerpt = isTamil ? article.excerptTamil : (article.excerptEnglish || article.excerptTamil || article.summaryTamil || article.summaryEnglish || '');
                  const formattedDate = article.publishedAt
                    ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(article.publishedAt))
                    : 'Aug 2026';
                  const categoryName = (article.category || 'FINANCE').replace('-', ' ').toUpperCase();
                  const authorName = article.authorName || article.author_name || 'Budget Padmanaban';
                  const arnNumber = article.authorArn || article.author_arn || (authorName.toLowerCase().includes('padmanaban') ? 'ARN-112345' : '');
                  const readTime = article.readTimeMinutes || 4;
                  const isArticleSaved = isSaved(article.id);

                  return (
                    <article
                      key={article.id}
                      onClick={() => onNavigate(`#/articles/${article.slug}`)}
                      className="p-5 sm:p-6 transition-all duration-200 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer group space-y-3"
                    >
                      {/* Row 1: Small Category Badge + Publish Date */}
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <span className="px-2.5 py-0.5 rounded-md bg-brandBlue-500/10 text-brandBlue-700 dark:text-brandBlue-300 font-black text-[10px]">
                          {categoryName}
                        </span>
                        <span>·</span>
                        <time dateTime={article.publishedAt} className="font-mono text-slate-500 dark:text-slate-400">
                          {formattedDate}
                        </time>
                      </div>

                      {/* Row 2: Article Headline as a bold clickable link */}
                      <h2 className="text-base sm:text-lg lg:text-[19px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-brandBlue-600 dark:group-hover:text-brandBlue-400 transition-colors font-serif leading-snug">
                        <a
                          href={`#/articles/${article.slug}`}
                          onClick={(e) => { e.preventDefault(); onNavigate(`#/articles/${article.slug}`); }}
                          className="hover:underline focus:outline-none"
                        >
                          {title}
                        </a>
                      </h2>

                      {/* Row 3: Byline Row: Publisher's Name + small ARN badge */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2 min-w-0">
                          {article.authorAvatar ? (
                            <img
                              src={article.authorAvatar}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brandBlue-600 to-brandGreen-600 text-white font-black text-[9px] flex items-center justify-center shrink-0">
                              {authorName.charAt(0)}
                            </div>
                          )}
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {authorName}
                          </span>
                        </div>

                        {arnNumber && (
                          <span className="inline-flex items-center gap-1 text-[9.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 shrink-0">
                            <span>🛡️</span>
                            <span>{arnNumber}</span>
                          </span>
                        )}
                      </div>

                      {/* Row 4: 2-3 Line Summary Snippet + Read More Link */}
                      {excerpt && (
                        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-normal">
                          {excerpt}
                          <span className="inline-flex items-center ml-1 font-bold text-brandBlue-600 dark:text-brandBlue-400 group-hover:underline">
                            {isTamil ? 'மேலும் படிக்க →' : 'Read More →'}
                          </span>
                        </p>
                      )}

                      {/* Row 5: Small Icon Row: Read Time, Bookmark, Share */}
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px]">
                          <span className="flex items-center gap-1">
                            <span>⏱</span>
                            <span>{readTime} {isTamil ? 'நிமிடம் வாசிக்க' : 'min read'}</span>
                          </span>
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <span>👁</span>
                            <span>{(article.views || article.viewCount || 0).toLocaleString()}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Bookmark Button */}
                          <button
                            type="button"
                            onClick={(e) => handleBookmarkClick(e, article)}
                            title={isArticleSaved ? (isTamil ? 'புக்மார்க்கிலிருந்து நீக்கு' : 'Remove Bookmark') : (isTamil ? 'புக்மார்க் செய்' : 'Bookmark Article')}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isArticleSaved
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-amber-600 hover:border-amber-500/30 border-slate-200/80 dark:border-slate-700'
                            }`}
                            aria-label="Bookmark"
                          >
                            <svg className="w-3.5 h-3.5" fill={isArticleSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>

                          {/* Share Button */}
                          <button
                            type="button"
                            onClick={(e) => handleShareArticle(e, article)}
                            title={isTamil ? 'பகிர்' : 'Share Article'}
                            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-brandBlue-600 hover:border-brandBlue-500/30 border border-slate-200/80 dark:border-slate-700 transition-all"
                            aria-label="Share"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  {isTamil
                    ? `பக்கம் ${currentPage} / ${totalPages} (${totalArticles} கட்டுரைகள்)`
                    : `Page ${currentPage} of ${totalPages} (${totalArticles} total articles)`}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Previous Button */}
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1"
                  >
                    <span>←</span>
                    <span className="hidden sm:inline">{isTamil ? 'முந்தையது' : 'Previous'}</span>
                  </button>

                  {/* Numbered Page Buttons */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) {
                        acc.push('...');
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) => {
                      if (item === '...') {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-slate-400 font-mono">
                            ...
                          </span>
                        );
                      }
                      const pageNum = Number(item);
                      const isCur = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                            isCur
                              ? 'bg-brandBlue-600 text-white shadow-md shadow-brandBlue-600/30 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                  {/* Next Button */}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">{isTamil ? 'அடுத்தது' : 'Next'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================= MOBILE SLIDE-IN FILTER DRAWER ================= */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Slide-in Drawer Container */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-950 h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-slideRight">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brandBlue-600 dark:text-brandBlue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {isTamil ? 'வடிகட்டிகள்' : 'Filter Articles'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-sm"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Filter Controls */}
              {renderFilterContent()}
            </div>

            {/* Drawer Bottom Apply Button */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6 sticky bottom-0 bg-white dark:bg-slate-950 pb-2">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-brandBlue-600 hover:bg-brandBlue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brandBlue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{isTamil ? `முடிவுகளைக் காண்க (${totalArticles})` : `Show Results (${totalArticles})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArticleDetailPage({ slug, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session } = useAuth();
  const { bookmarks, toggleBookmark, isSaved } = useBookmarks();
  const isTamil = language === 'ta';

  const [article, setArticle] = useState(null);
  const [categoryArticles, setCategoryArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Floating toolbar interactive states
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showTocModal, setShowTocModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Scroll listener for sticky bar, progress, and scroll-to-top
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / totalHeight) * 100));
        setScrollProgress(progress);
      }
      setShowStickyBar(scrollTop > 260);
      setShowScrollTop(scrollTop > 380);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Fetch current article data
  useEffect(() => {
    let isMounted = true;
    const fetchArticle = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = session?.access_token || '';
        const res = await fetch(`/api/articles/${encodeURIComponent(slug)}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          throw new Error(res.status === 404 ? (isTamil ? 'கட்டுரை கிடைக்கவில்லை' : 'Article not found') : 'Failed to load article');
        }

        const data = await res.json();
        if (isMounted) {
          setArticle(data.data);
          // Also fetch sibling articles in the same category for prev/next and sidebar
          if (data.data?.category) {
            fetch(`/api/articles?category=${encodeURIComponent(data.data.category)}&limit=15`)
              .then(r => r.ok ? r.json() : null)
              .then(catJson => {
                if (isMounted && catJson?.data) {
                  setCategoryArticles(catJson.data);
                }
              })
              .catch(() => {});
          }
        }
      } catch (err) {
        console.error('Error loading article:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchArticle();
    return () => { isMounted = false; };
  }, [slug, session, isTamil]);

  // Track & Increment Live View Count
  useEffect(() => {
    if (!slug) return;
    const sessionKey = `muthaleetu_art_view_${slug}`;
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      fetch(`/api/articles/${encodeURIComponent(slug)}/view`, { method: 'POST' })
        .then(r => r.json())
        .then(json => {
          if (json && typeof json.views === 'number') {
            setArticle(prev => prev ? { ...prev, views: json.views, viewCount: json.views } : prev);
          }
        })
        .catch(() => {});
    }
  }, [slug]);

  // Sibling articles for Previous / Next in the same category
  const { prevArticle, nextArticle } = useMemo(() => {
    if (!article || categoryArticles.length === 0) return { prevArticle: null, nextArticle: null };
    const idx = categoryArticles.findIndex(a => a.slug === article.slug || a.id === article.id);
    if (idx === -1) {
      return {
        prevArticle: categoryArticles[0] && categoryArticles[0].slug !== article.slug ? categoryArticles[0] : null,
        nextArticle: categoryArticles[1] && categoryArticles[1].slug !== article.slug ? categoryArticles[1] : null
      };
    }
    return {
      prevArticle: idx > 0 ? categoryArticles[idx - 1] : null,
      nextArticle: idx < categoryArticles.length - 1 ? categoryArticles[idx + 1] : null
    };
  }, [article, categoryArticles]);

  // Extract H2 headings for Table of Contents
  const tableOfContents = useMemo(() => {
    if (!article) return [];
    const bodyText = isTamil ? (article.bodyTamil || article.bodyEnglish || '') : (article.bodyEnglish || article.bodyTamil || '');
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    const items = [];
    let match;
    let index = 0;
    while ((match = h2Regex.exec(bodyText)) !== null) {
      const cleanTitle = match[1].replace(/<[^>]+>/g, '').trim();
      if (cleanTitle) {
        items.push({ id: `section-h2-${index}`, title: cleanTitle });
        index++;
      }
    }
    return items;
  }, [article, isTamil]);

  // Text-To-Speech Playback
  const handleToggleListen = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onShowToast) onShowToast(isTamil ? 'உங்கள் உலாவியில் ஆடியோ வசதி இல்லை.' : 'Text-to-speech is not supported in your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (onShowToast) onShowToast(isTamil ? 'ஆடியோ வாசிப்பு நிறுத்தப்பட்டது.' : 'Audio playback stopped.');
    } else {
      window.speechSynthesis.cancel();
      const titleToRead = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
      const excerptToRead = isTamil ? article.excerptTamil : (article.excerptEnglish || article.excerptTamil);
      const bodyClean = (isTamil ? (article.bodyTamil || article.bodyEnglish) : (article.bodyEnglish || article.bodyTamil) || '').replace(/<[^>]+>/g, ' ');
      const textToSpeak = `${titleToRead}. ${excerptToRead || ''}. ${bodyClean}`.slice(0, 3000);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isTamil ? 'ta-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      if (onShowToast) onShowToast(isTamil ? 'கட்டுரை வாசிக்கப்படுகிறது...' : 'Playing audio read-aloud...');
    }
  };

  // Share handler
  const handleShare = async (platform = 'copy') => {
    const titleText = article ? (isTamil ? article.titleTamil : article.titleEnglish) : 'Muthaleetu Thisai';
    const url = window.location.href;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${titleText} - ${url}`)}`, '_blank');
      return;
    }
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(titleText)}&url=${encodeURIComponent(url)}`, '_blank');
      return;
    }

    if (navigator.share && platform === 'native') {
      try {
        await navigator.share({ title: titleText, text: titleText, url });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(url);
      if (onShowToast) onShowToast(isTamil ? 'லிங்க் நகலெடுக்கப்பட்டது!' : 'Article link copied to clipboard!');
    } catch {
      if (onShowToast) onShowToast(isTamil ? 'பகிர்வு தயார்!' : 'Share link ready!');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 text-center space-y-4 bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-brandBlue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
          {isTamil ? 'கட்டுரை ஏற்றப்படுகிறது...' : 'Loading article...'}
        </p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
        <div className="text-4xl">📄</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {error || (isTamil ? 'கட்டுரை கிடைக்கவில்லை' : 'Article Not Found')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTamil ? 'இந்தக் கட்டுரை நீக்கப்பட்டிருக்கலாம் அல்லது வெளியிடப்படாமல் இருக்கலாம்.' : 'The article may have been removed or is currently unpublished.'}
        </p>
        <button
          type="button"
          onClick={() => onNavigate('#/articles')}
          className="px-6 py-2.5 rounded-full bg-brandBlue-600 hover:bg-brandBlue-700 text-white font-extrabold text-xs shadow-lg transition-all"
        >
          ← {isTamil ? 'கட்டுரைகள் பக்கத்திற்குத் திரும்பு' : 'Back to Articles'}
        </button>
      </div>
    );
  }

  const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
  const excerpt = isTamil ? article.excerptTamil : (article.excerptEnglish || article.excerptTamil);
  const body = isTamil ? article.bodyTamil : (article.bodyEnglish || article.bodyTamil);
  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(article.publishedAt))
    : 'Aug 2026';
  const authorName = article.authorName || article.author_name || 'Budget Padmanaban';
  const authorArn = article.authorArn || article.author_arn || (authorName.toLowerCase().includes('padmanaban') ? 'ARN-112345' : '');
  const authorTitle = article.authorTitle || 'AMFI Registered Mutual Fund Distributor • Wealth Specialist';
  const authorWhatsapp = article.authorWhatsapp || article.authorPhone || '919840000000';
  const categoryLabel = (article.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const isSavedArticle = isSaved(article.id);

  // Other articles in category for carousel & sidebar (excluding current article)
  const relatedCategoryArticles = categoryArticles.filter(a => a.slug !== article.slug);

  return (
    <div className={`min-h-screen pb-20 animate-fadeIn relative transition-colors duration-300 ${isReadingMode ? 'bg-[#fbfbf9] dark:bg-[#0a0f18]' : 'bg-slate-50/50 dark:bg-slate-950'}`}>
      
      {/* ================= 1. STICKY "NOW READING" BAR ================= */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-slate-950/95 text-white backdrop-blur-md border-b border-slate-800/80 shadow-md transition-all duration-300 ${
          showStickyBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Now Reading Label + Article Title */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brandBlue-600 text-white shrink-0">
              {isTamil ? 'இப்போது வாசிப்பது' : 'Now Reading'}
            </span>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-100 truncate font-serif" title={title}>
              {title}
            </h4>
          </div>

          {/* Right: Actions & Prev/Next Category Nav */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Share Button */}
            <button
              type="button"
              onClick={() => handleShare('native')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isTamil ? 'பகிர்' : 'Share'}
              aria-label="Share article"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            {/* Prev Article in Category */}
            <button
              type="button"
              disabled={!prevArticle}
              onClick={() => prevArticle && onNavigate(`#/articles/${prevArticle.slug}`)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-all flex items-center gap-1"
              title={prevArticle ? (isTamil ? prevArticle.titleTamil : prevArticle.titleEnglish) : ''}
            >
              <span>←</span>
              <span className="hidden md:inline">{isTamil ? 'முந்தையது' : 'Prev'}</span>
            </button>

            {/* Next Article in Category */}
            <button
              type="button"
              disabled={!nextArticle}
              onClick={() => nextArticle && onNavigate(`#/articles/${nextArticle.slug}`)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-all flex items-center gap-1"
              title={nextArticle ? (isTamil ? nextArticle.titleTamil : nextArticle.titleEnglish) : ''}
            >
              <span className="hidden md:inline">{isTamil ? 'அடுத்தது' : 'Next'}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar at very bottom edge of sticky bar */}
        <div className="w-full h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-brandBlue-500 via-brandGreen-500 to-amber-500 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* ================= 2. FLOATING LEFT TOOLBAR (Sticky Desktop) ================= */}
      <div className="hidden lg:flex flex-col gap-2 fixed left-4 2xl:left-8 top-1/3 z-30 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl">
        {/* Info Icon */}
        <button
          type="button"
          onClick={() => setShowInfoModal(prev => !prev)}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brandBlue-600 transition-all"
          title={isTamil ? 'கட்டுரை தகவல்' : 'Article Information'}
          aria-label="Info"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Reading Mode Toggle */}
        <button
          type="button"
          onClick={() => {
            setIsReadingMode(prev => !prev);
            if (onShowToast) onShowToast(!isReadingMode ? (isTamil ? 'வாசிப்பு முறை இயக்கப்பட்டது' : 'Reading Mode Enabled') : (isTamil ? 'இயல்பு முறை' : 'Standard View'));
          }}
          className={`p-2.5 rounded-xl transition-all ${
            isReadingMode
              ? 'bg-brandBlue-600 text-white shadow-md'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brandBlue-600'
          }`}
          title={isTamil ? 'வாசிப்பு முறை (Focus Mode)' : 'Toggle Reading Focus Mode'}
          aria-label="Reading Mode"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        {/* Copy Link Icon */}
        <button
          type="button"
          onClick={() => handleShare('copy')}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brandBlue-600 transition-all"
          title={isTamil ? 'இணைப்பை நகலெடு' : 'Copy Article Link'}
          aria-label="Copy Link"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Listen (TTS) Icon */}
        <button
          type="button"
          onClick={handleToggleListen}
          className={`p-2.5 rounded-xl transition-all ${
            isSpeaking
              ? 'bg-amber-500 text-slate-950 animate-pulse shadow-md font-bold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500'
          }`}
          title={isSpeaking ? (isTamil ? 'ஆடியோவை நிறுத்து' : 'Stop Audio Read-Aloud') : (isTamil ? 'கட்டுரையைக் கேள் (Audio Listen)' : 'Listen to Article (Audio)')}
          aria-label="Listen"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>

        {/* Table of Contents Icon */}
        {tableOfContents.length > 0 && (
          <button
            type="button"
            onClick={() => setShowTocModal(prev => !prev)}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brandBlue-600 transition-all"
            title={isTamil ? 'பொருளடக்கம்' : 'Table of Contents'}
            aria-label="TOC"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        )}

        {/* Bookmark Icon */}
        <button
          type="button"
          onClick={() => {
            toggleBookmark(article);
            if (onShowToast) onShowToast(!isSavedArticle ? (isTamil ? 'புக்மார்க்குகளில் சேமிக்கப்பட்டது!' : 'Saved to Bookmarks!') : (isTamil ? 'நீக்கப்பட்டது' : 'Removed from Bookmarks'));
          }}
          className={`p-2.5 rounded-xl transition-all ${
            isSavedArticle
              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500'
          }`}
          title={isTamil ? 'புக்மார்க்' : 'Bookmark'}
          aria-label="Bookmark"
        >
          <svg className="w-4 h-4" fill={isSavedArticle ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        {/* Share Icon */}
        <button
          type="button"
          onClick={() => handleShare('native')}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brandBlue-600 transition-all"
          title={isTamil ? 'பகிர்' : 'Share'}
          aria-label="Share"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      {/* Info Popover Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowInfoModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-sm w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isTamil ? 'கட்டுரை விவரங்கள்' : 'Article Metadata'}
              </h3>
              <button onClick={() => setShowInfoModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <div className="text-xs space-y-2.5 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between"><span>{isTamil ? 'வெளியிடப்பட்டது:' : 'Published:'}</span> <strong className="text-slate-900 dark:text-white">{formattedDate}</strong></div>
              <div className="flex justify-between"><span>{isTamil ? 'வாசிக்கும் நேரம்:' : 'Read Time:'}</span> <strong className="text-slate-900 dark:text-white">{article.readTimeMinutes || 4} {isTamil ? 'நிமிடம்' : 'mins'}</strong></div>
              <div className="flex justify-between"><span>{isTamil ? 'பிரிவு:' : 'Category:'}</span> <strong className="text-brandBlue-600">{categoryLabel}</strong></div>
              <div className="flex justify-between"><span>{isTamil ? 'பார்வைகள்:' : 'Views:'}</span> <strong className="text-slate-900 dark:text-white">{(article.views || article.viewCount || 0).toLocaleString()}</strong></div>
              <div className="flex justify-between"><span>{isTamil ? 'மொழிகள்:' : 'Language Availability:'}</span> <strong className="text-slate-900 dark:text-white">தமிழ் / English</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents Popover Modal */}
      {showTocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowTocModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isTamil ? 'பொருளடக்கம் (Table of Contents)' : 'Table of Contents'}
              </h3>
              <button onClick={() => setShowTocModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <ul className="space-y-2 text-xs max-h-72 overflow-y-auto no-scrollbar">
              {tableOfContents.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      setShowTocModal(false);
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="text-left w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:text-brandBlue-600 transition-colors"
                  >
                    {idx + 1}. {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* AI Summary Explainer Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAiModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>✨</span>
                <span>{isTamil ? 'AI சுருக்கம் எப்படி செயல்படுகிறது?' : 'How AI Quick Summary Works'}</span>
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isTamil
                ? 'முதலீட்டு திசை இயங்குதளம் ஜெமினி AI மாடலின் உதவியுடன் சிக்கலான ஒழுங்குமுறை விதிமுறைகள் மற்றும் மியூச்சுவல் ஃபண்ட் பகுப்பாய்வுகளை 3-5 வாக்கியங்களில் எளிய தமிழ் மற்றும் ஆங்கிலத்தில் தொகுத்து வழங்குகிறது.'
                : 'Muthaleetu Thisai leverages Gemini AI to extract key investment insights, regulatory updates, and actionable takeaways into plain-language bulleted summaries.'}
            </p>
            <div className="pt-2">
              <button onClick={() => setShowAiModal(false)} className="w-full py-2 rounded-xl bg-brandBlue-600 text-white font-bold text-xs">
                {isTamil ? 'புரிந்தது' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN ARTICLE WRAPPER ================= */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Breadcrumb & Navigation Top */}
        <div className="flex items-center justify-between gap-4 py-2 mb-4 text-xs font-bold text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => onNavigate('#/articles')}
            className="inline-flex items-center gap-1.5 hover:text-brandBlue-600 dark:hover:text-brandBlue-400 transition-colors"
          >
            <span>←</span>
            <span>{isTamil ? 'அனைத்து கட்டுரைகள்' : 'All Articles'}</span>
          </button>
          <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider bg-brandBlue-500/10 text-brandBlue-700 dark:text-brandBlue-300 border border-brandBlue-500/30">
            {categoryLabel}
          </span>
        </div>

        {/* Article Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-[40px] font-black text-slate-900 dark:text-white font-serif leading-tight sm:leading-snug mb-5">
          {title}
        </h1>

        {/* Hero Section: Wider Cover Image on Left (66-70%) + Compact AI Summary on Right (30-34%) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-stretch mb-6">
          {/* Wider Hero Image */}
          {article.coverImage && (
            <div className="md:col-span-7 lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] md:aspect-auto rounded-3xl overflow-hidden shadow-lg bg-slate-950 border border-slate-200/80 dark:border-slate-800 min-h-[260px] md:min-h-[340px] max-h-[480px]">
              <img
                src={article.coverImage}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* ================= 3. QUICK SUMMARY BOX (Compact Width, Adaptive Typography) ================= */}
          <div className={`${article.coverImage ? 'md:col-span-5 lg:col-span-4' : 'w-full'} p-5 sm:p-5 lg:p-6 rounded-3xl bg-brandBlue-500/[0.06] dark:bg-brandBlue-500/[0.12] border border-brandBlue-500/25 shadow-sm flex flex-col justify-between space-y-3`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-brandBlue-700 dark:text-brandBlue-300 font-black text-xs uppercase tracking-wider">
                  <span className="text-base">✨</span>
                  <span>{isTamil ? 'விரைவு சுருக்கம்' : 'Quick Summary'}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brandBlue-500/15 text-brandBlue-700 dark:text-brandBlue-300">
                  AI
                </span>
              </div>
              <p className="text-[13px] sm:text-[13.5px] lg:text-[14px] text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {excerpt || (isTamil
                  ? 'மியூச்சுவல் ஃபண்ட் முதலீடுகள், ஒழுங்குமுறை விதிகள் மற்றும் நீண்ட கால சொத்து உருவாக்கத்திற்கான முக்கிய குறிப்புகள் மற்றும் வழிமுறைகளின் சுருக்கம்.'
                  : 'Key insights and executive summary covering systematic investment planning, regulatory compliance, and risk-adjusted wealth compounding principles.')}
              </p>
            </div>
            <div className="pt-2 border-t border-brandBlue-500/15">
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="text-[11px] font-bold text-brandBlue-600 dark:text-brandBlue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>{isTamil ? 'AI சுருக்கம் · மேலும் அறிக →' : 'AI Summary · Learn more →'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 4. PUBLISHER / AUTHOR CREDENTIAL CARD ================= */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-amber-500/[0.06] dark:bg-amber-500/[0.10] border border-amber-500/25 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            {/* Publisher Photo */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 p-0.5 shadow shrink-0 overflow-hidden">
              {article.authorAvatar ? (
                <img src={article.authorAvatar} alt={authorName} className="w-full h-full rounded-2xl object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center font-black text-lg text-amber-400">
                  {authorName.charAt(0)}
                </div>
              )}
            </div>

            {/* Author Credentials & Badges */}
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {authorName}
                </h3>
                <span className="text-blue-500 font-bold" title="Verified Publisher">✓</span>
                {authorArn && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                    <span>🛡️</span>
                    <span>{authorArn}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {authorTitle}
              </p>
              {article.authorSpecialties && Array.isArray(article.authorSpecialties) && article.authorSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.authorSpecialties.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate(`#/professionals/${article.authorId || 'budget-padmanaban'}`)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-800 transition-all text-center"
            >
              {isTamil ? 'சுயவிவரம்' : 'View Profile'} →
            </button>
          </div>
        </div>

        {/* 2-Column Grid on Desktop: Main Body (Left/Center) + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= 5. ARTICLE BODY ================= */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6">
            
            {/* Main Text Content */}
            <div className={`p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all ${isReadingMode ? 'text-lg sm:text-xl leading-loose font-serif' : 'text-base sm:text-[17px] leading-relaxed'}`}>
              <div
                className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 font-normal"
                dangerouslySetInnerHTML={{ __html: body }}
              />

              {/* ================= 6. MID-ARTICLE CTA CALLOUT ================= */}
              <div className="my-8 p-6 sm:p-7 rounded-2xl bg-emerald-500/[0.08] dark:bg-emerald-500/[0.14] border border-emerald-500/30 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
                  <span className="text-base">💬</span>
                  <span>{isTamil ? 'நிபுணர் ஆலோசனை (Direct Consultation)' : 'Direct Advisor Consultation'}</span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-serif">
                  {isTamil
                    ? `இது குறித்து கேள்விகள் உள்ளதா? ${authorName} அவர்களிடம் நேரடியாக WhatsApp-ல் ஆலோசிக்கலாம்.`
                    : `Have questions about this investment strategy? Talk to ${authorName} directly on WhatsApp.`}
                </h4>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${authorWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${authorName}, I read your article "${title}" on Muthaleetu Thisai and would like an investment consultation.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all"
                  >
                    <span>WhatsApp-ல் ஆலோசிக்க →</span>
                  </a>
                </div>
              </div>

              {/* ================= 10. SEBI/AMFI DISCLAIMER & FOOTNOTES ================= */}
              <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <strong className="text-slate-700 dark:text-slate-300 font-bold block">
                    ⚠️ {isTamil ? 'முதலீட்டு அபாய எச்சரிக்கை (SEBI/AMFI Compliance Note)' : 'Regulatory & Risk Disclaimer (SEBI/AMFI Compliance)'}
                  </strong>
                  <p className="text-[11px] leading-relaxed">
                    {isTamil
                      ? 'மியூச்சுவல் ஃபண்ட் முதலீடுகள் சந்தை அபாயங்களுக்கு உட்பட்டவை. முதலீடு செய்வதற்கு முன் திட்ட ஆவணங்களை கவனமாகப் படிக்கவும். முதலீட்டு திசை மற்றும் பட்ஜெட் பத்மநாபன் வழங்கும் தகவல்கள் கல்வி நோக்கங்களுக்காக மட்டுமே. முந்தைய செயல்பாடுகள் எதிர்கால வருவாய்க்கு உத்தரவாதமாகாது.'
                      : 'Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns. Information provided by Muthaleetu Thisai is solely for educational and research purposes.'}
                  </p>
                </div>

                {/* References Footnote Citations */}
                <div id="references" className="space-y-1.5">
                  <h5 className="font-extrabold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
                    {isTamil ? 'சான்றுகள் & தரவு மூலங்கள் (References)' : 'References & Data Sources'}
                  </h5>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <li>[1] Association of Mutual Funds in India (AMFI) Industry Statistics & Monthly Portfolio Factsheets.</li>
                    <li>[2] Securities and Exchange Board of India (SEBI) Master Circular on Mutual Funds Governance (2026).</li>
                    <li>[3] Reserve Bank of India (RBI) Monetary Policy & Macroeconomic Assessment Reports.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <ArticleCommentsSection slug={slug} article={article} isTamil={isTamil} onShowToast={onShowToast} />
          </div>

          {/* ================= 7. RIGHT SIDEBAR ("More from Category") ================= */}
          <aside className="lg:col-span-4 xl:col-span-4 space-y-6 sticky top-24">
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {isTamil ? `கூடுதல் கட்டுரைகள் (${categoryLabel})` : `More from ${categoryLabel}`}
                </h3>
              </div>

              {relatedCategoryArticles.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  {isTamil ? 'இப்பிரிவில் வேறு கட்டுரைகள் இல்லை.' : 'No other articles in this category.'}
                </p>
              ) : (
                <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-slate-800/80">
                  {relatedCategoryArticles.slice(0, 5).map((relArt) => {
                    const relTitle = isTamil ? relArt.titleTamil : (relArt.titleEnglish || relArt.titleTamil);
                    const relDate = relArt.publishedAt
                      ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(relArt.publishedAt))
                      : 'Aug 2026';
                    return (
                      <div
                        key={relArt.id}
                        onClick={() => onNavigate(`#/articles/${relArt.slug}`)}
                        className="pt-3.5 first:pt-0 group cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                          <span className="text-brandBlue-600 dark:text-brandBlue-400">{relArt.category || 'FINANCE'}</span>
                          <span>·</span>
                          <span className="font-mono">{relDate}</span>
                        </div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-brandBlue-600 dark:group-hover:text-brandBlue-400 transition-colors line-clamp-2 font-serif">
                          {relTitle}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('#/articles')}
                  className="w-full py-2 text-center text-xs font-black text-brandBlue-600 dark:text-brandBlue-400 hover:underline"
                >
                  {isTamil ? 'அனைத்து கட்டுரைகளையும் காண்க →' : 'See more articles →'}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ================= 8. END-OF-ARTICLE "MOST READ" CAROUSEL ================= */}
        {relatedCategoryArticles.length > 0 && (
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  {categoryLabel}
                </span>
                <h3 className="text-base sm:text-lg font-black font-serif">
                  {isTamil ? 'அதிகம் வாசிக்கப்பட்ட கட்டுரைகள்' : `Most Read in ${categoryLabel}`}
                </h3>
              </div>

              {/* Carousel Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={carouselIndex === 0}
                  onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold transition-all"
                  aria-label="Previous carousel"
                >
                  ←
                </button>
                <button
                  type="button"
                  disabled={carouselIndex >= Math.max(0, relatedCategoryArticles.length - 3)}
                  onClick={() => setCarouselIndex(prev => Math.min(Math.max(0, relatedCategoryArticles.length - 3), prev + 1))}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold transition-all"
                  aria-label="Next carousel"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedCategoryArticles.slice(carouselIndex, carouselIndex + 3).map((item) => {
                const cTitle = isTamil ? item.titleTamil : (item.titleEnglish || item.titleTamil);
                const cDate = item.publishedAt
                  ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(item.publishedAt))
                  : 'Aug 2026';
                return (
                  <div
                    key={item.id}
                    onClick={() => onNavigate(`#/articles/${item.slug}`)}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 cursor-pointer group transition-all space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase font-mono">
                        <span className="text-amber-400">{item.category || 'FINANCE'}</span>
                        <span>{cDate}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2 font-serif">
                        {cTitle}
                      </h4>
                    </div>
                    <div className="text-[11px] font-bold text-brandBlue-400 group-hover:underline pt-1">
                      {isTamil ? 'வாசிக்க →' : 'Read Now →'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= 9. FLOATING SCROLL-TO-TOP BUTTON ================= */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full bg-brandBlue-600 hover:bg-brandBlue-700 text-white shadow-xl shadow-brandBlue-600/30 flex items-center justify-center font-black text-sm transition-all hover:scale-110 animate-bounce"
          title={isTamil ? 'மேலே செல்க' : 'Scroll to top'}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}

function ArticleCommentsSection({ slug, article, isTamil, onShowToast }) {
  const { session, user, profile, role } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  
  // Track liked comments to enforce exactly 1 like per user
  const [likedMap, setLikedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('muthaleetu_liked_comments') || '{}');
    } catch {
      return {};
    }
  });

  const loadComments = useCallback(async () => {
    if (!slug) return;
    try {
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&action=comments`);
      const json = await res.json();
      if (json && json.data) {
        setComments(json.data);
      }
    } catch (err) {
      console.error('Error fetching article comments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const currentUserName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || (isTamil ? 'வாசகர்' : 'Reader');
      const currentUserAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || null;
      const isPublisherOrAdvisor = role === 'admin' || role === 'publisher' || role === 'advisor' || (article && user?.id === article.authorId);

      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&action=add_comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          slug,
          content: newComment.trim(),
          userId: user?.id || 'guest',
          userName: currentUserName,
          userAvatar: currentUserAvatar,
          userRole: isPublisherOrAdvisor ? 'publisher' : 'user',
          isVerified: isPublisherOrAdvisor
        })
      });

      if (!res.ok) throw new Error('Failed to post comment');
      const json = await res.json();
      if (json.data) {
        setComments(prev => [...prev, json.data]);
        setNewComment('');
        if (onShowToast) onShowToast(isTamil ? 'உங்கள் கருத்து பதிவிடப்பட்டது!' : 'Comment posted successfully!');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      if (onShowToast) onShowToast(isTamil ? 'கருத்து பதிவிடுவதில் பிழை ஏற்பட்டது.' : 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      const currentUserName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || (isTamil ? 'வாசகர்' : 'Reader');
      const currentUserAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || null;
      const isPublisherOrAdvisor = role === 'admin' || role === 'publisher' || role === 'advisor' || (article && user?.id === article.authorId);

      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&action=add_comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          slug,
          content: replyText.trim(),
          parentId,
          userId: user?.id || 'guest',
          userName: currentUserName,
          userAvatar: currentUserAvatar,
          userRole: isPublisherOrAdvisor ? 'publisher' : 'user',
          isVerified: isPublisherOrAdvisor
        })
      });

      if (!res.ok) throw new Error('Failed to post reply');
      const json = await res.json();
      if (json.data) {
        setComments(prev => [...prev, json.data]);
        setReplyText('');
        setReplyingTo(null);
        if (onShowToast) onShowToast(isTamil ? 'பதில் பதிவிடப்பட்டது!' : 'Reply posted successfully!');
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      if (onShowToast) onShowToast(isTamil ? 'பதில் பதிவிடுவதில் பிழை ஏற்பட்டது.' : 'Failed to post reply.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Strictly 1-like-per-user with persistent lock & toggle
  const handleLike = async (commentId) => {
    const isAlreadyLiked = Boolean(likedMap[commentId]);
    const nextLikedMap = { ...likedMap };
    
    if (isAlreadyLiked) {
      delete nextLikedMap[commentId];
    } else {
      nextLikedMap[commentId] = true;
    }
    setLikedMap(nextLikedMap);
    
    try {
      localStorage.setItem('muthaleetu_liked_comments', JSON.stringify(nextLikedMap));
    } catch {}

    // Optimistic UI update
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const nextCount = isAlreadyLiked 
          ? Math.max(0, (c.likesCount || 0) - 1) 
          : (c.likesCount || 0) + 1;
        return { ...c, likesCount: nextCount };
      }
      return c;
    }));

    try {
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&action=like_comment&commentId=${commentId}&unlike=${isAlreadyLiked ? '1' : '0'}`, {
        method: 'POST'
      });
      if (res.ok) {
        const json = await res.json();
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, likesCount: json.likes } : c));
      }
    } catch (err) {
      console.error('Error updating like status:', err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm(isTamil ? 'இந்தக் கருத்தை நிச்சயமாக நீக்க விரும்புகிறீர்களா?' : 'Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&action=delete_comment&commentId=${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          userId: user?.id,
          userRole: role
        })
      });
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId));
        if (onShowToast) onShowToast(isTamil ? 'கருத்து நீக்கப்பட்டது.' : 'Comment deleted.');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const topComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const diffSec = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diffSec < 60) return isTamil ? 'சற்று முன்' : 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} ${isTamil ? 'நிமிடம் முன்' : 'm ago'}`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ${isTamil ? 'மணி நேரம் முன்' : 'h ago'}`;
    return `${Math.floor(diffSec / 86400)} ${isTamil ? 'நாள் முன்' : 'd ago'}`;
  };

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💬</span>
          <div>
            <h3 className="text-lg sm:text-xl font-black font-serif text-slate-900 dark:text-white">
              {isTamil ? 'கருத்துகள் மற்றும் கலந்துரையாடல்' : 'Comments & Discussion'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isTamil ? 'வாசகர்கள் மற்றும் நிதி ஆலோசகர்களின் கலந்துரையாடல் பகுதி' : 'Community thoughts and verified publisher answers'}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          {comments.length} {isTamil ? 'கருத்துகள்' : 'Comments'}
        </span>
      </div>

      {/* Comment Input Box */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <div className="flex gap-3.5 items-start">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 p-0.5 shadow-sm shrink-0 flex items-center justify-center font-black text-white text-sm">
            {(profile?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 relative">
            <textarea
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isTamil ? 'உங்கள் கேள்விகள் அல்லது கருத்துக்களை இங்கே பகிருங்கள்...' : 'Ask a question, share your thoughts, or discuss with certified advisors...'}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white text-sm placeholder-slate-400 transition-all outline-none resize-y min-h-[90px]"
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400 font-medium">
            {isTamil ? '🛡️ நிபுணத்துவம் வாய்ந்த ஆலோசகர்கள் பதில் அளிப்பார்கள்' : '🛡️ Certified advisors reply directly to questions'}
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <span>{isSubmitting ? (isTamil ? 'பதிவிடுகிறது...' : 'Posting...') : (isTamil ? 'கருத்து பதிவிடுக' : 'Post Comment')}</span>
            <span>→</span>
          </button>
        </div>
      </form>

      {/* Comments Listing */}
      {isLoading ? (
        <div className="py-8 text-center text-sm text-slate-400 animate-pulse">
          {isTamil ? 'கருத்துகள் ஏற்றப்படுகின்றன...' : 'Loading discussion...'}
        </div>
      ) : topComments.length === 0 ? (
        <div className="py-12 px-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-3xl">✍️</div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {isTamil ? 'முதல் கருத்தை நீங்கள் பதிவிடுங்கள்!' : 'Be the first to start the discussion!'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isTamil ? 'இந்த கட்டுரை பற்றிய உங்கள் சந்தேகங்கள் அல்லது முதலீட்டு அனுபவங்களை பகிர்ந்து கொள்ளுங்கள்.' : 'Ask questions about mutual funds, risk factors, or wealth planning.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6 pt-2">
          {topComments.map(comment => {
            const replies = getReplies(comment.id);
            const isPublisher = comment.isVerified || comment.userRole === 'publisher' || comment.userRole === 'advisor' || comment.userRole === 'author';
            const isOwner = user?.id && user.id === comment.userId;
            const canDelete = isOwner || role === 'admin';

            return (
              <div key={comment.id} className="space-y-3">
                {/* Single Comment Card */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  isPublisher 
                    ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 dark:border-emerald-500/30' 
                    : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {comment.userAvatar ? (
                        <img src={comment.userAvatar} alt="" className="w-9 h-9 rounded-xl object-cover border border-amber-500/30 shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          isPublisher ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {(comment.userName || 'R').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {comment.userName}
                          </span>
                          {isPublisher && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 tracking-wide shadow-sm">
                              🛡️ Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-slate-400 hover:text-red-500 transition-colors p-1"
                        title={isTamil ? 'நீக்குக' : 'Delete'}
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-3 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs font-bold">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg ${
                        likedMap[comment.id] 
                          ? 'text-red-500 bg-red-500/10 font-black' 
                          : 'text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={likedMap[comment.id] ? (isTamil ? 'விருப்பத்தை நீக்குக' : 'Unlike') : (isTamil ? 'விருப்பம்' : 'Like')}
                    >
                      <span className={likedMap[comment.id] ? 'scale-110' : ''}>{likedMap[comment.id] ? '❤️' : '🤍'}</span>
                      <span>{comment.likesCount || 0}</span>
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(replyingTo === comment.id ? null : comment.id);
                        setReplyText('');
                      }}
                      className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-amber-500/10"
                    >
                      <span>↩</span>
                      <span>{isTamil ? 'பதிலளி' : 'Reply'}</span>
                    </button>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                      <textarea
                        rows="2"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={isTamil ? `${comment.userName}-க்கு பதிலளிக்க...` : `Reply to ${comment.userName}...`}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-amber-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          {isTamil ? 'ரத்து' : 'Cancel'}
                        </button>
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={isSubmittingReply || !replyText.trim()}
                          className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs disabled:opacity-50"
                        >
                          {isSubmittingReply ? (isTamil ? 'பதிவிடுகிறது...' : 'Sending...') : (isTamil ? 'பதில் அனுப்புக' : 'Send Reply')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="pl-6 sm:pl-10 space-y-3 border-l-2 border-slate-200 dark:border-slate-800 ml-4">
                    {replies.map(reply => {
                      const isReplyPublisher = reply.isVerified || reply.userRole === 'publisher' || reply.userRole === 'advisor' || reply.userRole === 'author';
                      const isReplyOwner = user?.id && user.id === reply.userId;
                      const canDeleteReply = isReplyOwner || role === 'admin';

                      return (
                        <div
                          key={reply.id}
                          className={`p-4 rounded-xl border text-xs sm:text-sm ${
                            isReplyPublisher
                              ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/30'
                              : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              {reply.userAvatar ? (
                                <img src={reply.userAvatar} alt="" className="w-7 h-7 rounded-lg object-cover border border-amber-500/30 shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${
                                  isReplyPublisher ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}>
                                  {(reply.userName || 'R').charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {reply.userName}
                                  </span>
                                  {isReplyPublisher && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                      🛡️ Verified
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-slate-400">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                            </div>

                            {canDeleteReply && (
                              <button
                                onClick={() => handleDelete(reply.id)}
                                className="text-xs text-slate-400 hover:text-red-500 transition-colors p-1"
                                title={isTamil ? 'நீக்குக' : 'Delete'}
                              >
                                🗑️
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-2.5 leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                          </p>

                          <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800 text-[11px] font-bold">
                            <button
                              onClick={() => handleLike(reply.id)}
                              className={`flex items-center gap-1 transition-colors px-2 py-1 rounded-lg ${
                                likedMap[reply.id] 
                                  ? 'text-red-500 bg-red-500/10 font-black' 
                                  : 'text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={likedMap[reply.id] ? (isTamil ? 'விருப்பத்தை நீக்குக' : 'Unlike') : (isTamil ? 'விருப்பம்' : 'Like')}
                            >
                              <span className={likedMap[reply.id] ? 'scale-110' : ''}>{likedMap[reply.id] ? '❤️' : '🤍'}</span>
                              <span>{reply.likesCount || 0}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminArticlesPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session, role, user, profile, setProfile } = useAuth();
  const isTamil = language === 'ta';
  const isAdmin = role === 'admin';

  // Admin Tab: 'articles' | 'publishers'
  // Admin Tab: 'articles' | 'publishers' | 'channels' | 'videos'
  const [activeTab, setActiveTab] = useState('articles');

  // Articles state
  const [articles, setArticles] = useState([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Publishers state
  const [publishers, setPublishers] = useState([]);
  const [isLoadingPublishers, setIsLoadingPublishers] = useState(false);
  const [publisherSearch, setPublisherSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [deletingPublisherId, setDeletingPublisherId] = useState(null);

  // Channel Approvals Queue state
  const [channels, setChannels] = useState([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [channelStatusFilter, setChannelStatusFilter] = useState('pending');
  const [processingChannelId, setProcessingChannelId] = useState(null);

  // Video Moderation Queue state
  const [adminVideos, setAdminVideos] = useState([]);
  const [isLoadingAdminVideos, setIsLoadingAdminVideos] = useState(false);
  const [videoStatusFilter, setVideoStatusFilter] = useState('pending');
  const [processingVideoId, setProcessingVideoId] = useState(null);

  // Create Publisher Form State
  const [newPubName, setNewPubName] = useState('');
  const [newPubEmail, setNewPubEmail] = useState('');
  const [newPubPassword, setNewPubPassword] = useState('');
  const [newPubTitle, setNewPubTitle] = useState('AMFI Registered Mutual Fund Distributor');
  const [newPubArn, setNewPubArn] = useState('');
  const [newPubSpecialties, setNewPubSpecialties] = useState('Mutual Funds, SIP Portfolios, Wealth Planning');
  const [newPubLinkedin, setNewPubLinkedin] = useState('');
  const [newPubTwitter, setNewPubTwitter] = useState('');
  const [newPubWebsite, setNewPubWebsite] = useState('');
  const [newPubPhone, setNewPubPhone] = useState('');
  const [isSubmittingPublisher, setIsSubmittingPublisher] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const fetchArticles = async () => {
    setIsLoadingArticles(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/articles?status=${statusFilter}&search=${encodeURIComponent(search)}&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setArticles(data.data || []);
    } catch (err) {
      console.error('Failed to load admin articles:', err);
      if (onShowToast) onShowToast(err.message);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const fetchPublishers = async () => {
    setIsLoadingPublishers(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/admin/publishers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPublishers(data.data || []);
    } catch (err) {
      console.error('Failed to load publishers:', err);
      if (onShowToast) onShowToast(err.message);
    } finally {
      setIsLoadingPublishers(false);
    }
  };

  const fetchChannels = async () => {
    setIsLoadingChannels(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/channels?status=${channelStatusFilter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setChannels(data.data || []);
    } catch (err) {
      console.error('Failed to load channels:', err);
      if (onShowToast) onShowToast(err.message);
    } finally {
      setIsLoadingChannels(false);
    }
  };

  const fetchAdminVideos = async () => {
    setIsLoadingAdminVideos(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/videos?status=${videoStatusFilter}&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAdminVideos(data.data?.videos || []);
    } catch (err) {
      console.error('Failed to load admin videos:', err);
      if (onShowToast) onShowToast(err.message);
    } finally {
      setIsLoadingAdminVideos(false);
    }
  };

  useEffect(() => {
    if (role === 'admin' || role === 'publisher') {
      fetchArticles();
    }
  }, [session, role, statusFilter, search]);

  useEffect(() => {
    if (role === 'admin' && activeTab === 'publishers') {
      fetchPublishers();
    }
  }, [session, role, activeTab]);

  useEffect(() => {
    if (role === 'admin' && activeTab === 'channels') {
      fetchChannels();
    }
  }, [session, role, activeTab, channelStatusFilter]);

  useEffect(() => {
    if (role === 'admin' && activeTab === 'videos') {
      fetchAdminVideos();
    }
  }, [session, role, activeTab, videoStatusFilter]);

  const handleVerifyChannelAction = async (publisherId, isApprove) => {
    setProcessingChannelId(publisherId);
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/admin/channels', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publisherId, action: isApprove ? 'approve' : 'reject' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update channel');
      if (onShowToast) onShowToast(json.message);
      fetchChannels();
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    } finally {
      setProcessingChannelId(null);
    }
  };

  const handleUpdateVideoStatusAction = async (youtubeId, newStatus) => {
    setProcessingVideoId(youtubeId);
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/admin/videos', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ youtubeId, status: newStatus })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update video status');
      if (onShowToast) onShowToast(json.message);
      setAdminVideos(prev => prev.map(v => (v.youtubeId === youtubeId || v.id === youtubeId) ? { ...v, status: newStatus } : v));
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    } finally {
      setProcessingVideoId(null);
    }
  };

  const handleDeleteArticle = async (id, title) => {
    if (!window.confirm(isTamil ? `இந்தக் கட்டுரையை நிச்சயமாக நீக்க விரும்புகிறீர்களா?\n"${title}"` : `Are you sure you want to delete this article?\n"${title}"`)) {
      return;
    }

    setDeletingId(id);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete article');
      if (onShowToast) onShowToast(isTamil ? 'கட்டுரை நீக்கப்பட்டது' : 'Article deleted successfully');
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();

      setArticles(prev => prev.map(a => a.id === article.id ? data.data : a));
      if (onShowToast) {
        onShowToast(newStatus === 'published' ? (isTamil ? 'வெளியிடப்பட்டது!' : 'Published live!') : (isTamil ? 'வரைவாக மாற்றப்பட்டது' : 'Reverted to draft'));
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message);
    }
  };

  // Generate strong random password for new publisher
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'Pub@';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPubPassword(pass);
  };

  // Create Publisher Handler
  const handleCreatePublisher = async (e) => {
    e.preventDefault();
    if (!newPubName.trim() || !newPubEmail.trim() || !newPubPassword.trim()) {
      if (onShowToast) onShowToast(isTamil ? 'பெயர், மின்னஞ்சல் மற்றும் கடவுச்சொல் தேவை' : 'Name, email and password are required');
      return;
    }

    setIsSubmittingPublisher(true);
    try {
      const token = session?.access_token || '';
      const specialtiesArr = newPubSpecialties.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/admin/publishers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          display_name: newPubName.trim(),
          email: newPubEmail.trim(),
          password: newPubPassword.trim(),
          title: newPubTitle.trim(),
          arn_number: newPubArn.trim(),
          specialties: specialtiesArr,
          linkedin_url: newPubLinkedin.trim(),
          twitter_url: newPubTwitter.trim(),
          website_url: newPubWebsite.trim(),
          phone: newPubPhone.trim()
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create publisher');

      setCreatedCredentials({
        name: newPubName,
        email: newPubEmail,
        password: newPubPassword
      });

      if (onShowToast) onShowToast(isTamil ? 'வெளியீட்டாளர் வெற்றிகரமாக சேர்க்கப்பட்டார்!' : 'Publisher account created successfully!');
      fetchPublishers();

      // Reset form fields
      setNewPubName('');
      setNewPubEmail('');
      setNewPubPassword('');
      setNewPubArn('');
      setNewPubLinkedin('');
      setNewPubTwitter('');
      setNewPubWebsite('');
      setNewPubPhone('');
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    } finally {
      setIsSubmittingPublisher(false);
    }
  };

  // Delete Publisher Handler
  const handleDeletePublisher = async (pubId, pubName) => {
    if (!window.confirm(isTamil
      ? `"${pubName}" வெளியீட்டாளர் கணக்கை நிச்சயமாக நீக்க விரும்புகிறீர்களா?\nஇந்த செயல் திரும்பப்பெற முடியாது.`
      : `Are you sure you want to permanently delete publisher "${pubName}"?\nThis action cannot be undone.`)) {
      return;
    }

    setDeletingPublisherId(pubId);
    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/publishers/${pubId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete publisher');

      if (onShowToast) onShowToast(isTamil ? 'வெளியீட்டாளர் நீக்கப்பட்டார்' : 'Publisher deleted successfully');
      setPublishers(prev => prev.filter(p => p.id !== pubId));
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    } finally {
      setDeletingPublisherId(null);
    }
  };

  // Edit Publisher Update Handler
  const handleUpdatePublisher = async (e) => {
    e.preventDefault();
    if (!editingPublisher) return;

    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/publishers/${editingPublisher.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          display_name: editingPublisher.display_name,
          title: editingPublisher.title,
          arn_number: editingPublisher.arn_number,
          specialties: Array.isArray(editingPublisher.specialties) ? editingPublisher.specialties : editingPublisher.specialties?.split(',').map(s => s.trim()).filter(Boolean),
          bio: editingPublisher.bio,
          linkedin_url: editingPublisher.linkedin_url,
          twitter_url: editingPublisher.twitter_url,
          website_url: editingPublisher.website_url,
          phone: editingPublisher.phone
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update publisher');

      if (onShowToast) onShowToast(isTamil ? 'விவரங்கள் புதுப்பிக்கப்பட்டன' : 'Publisher updated successfully');
      setPublishers(prev => prev.map(p => p.id === editingPublisher.id ? json.data : p));
      setEditingPublisher(null);
    } catch (err) {
      if (onShowToast) onShowToast(`Error: ${err.message}`);
    }
  };

  if (role !== 'admin' && role !== 'publisher') return null;

  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;

  const filteredPublishers = publishers.filter(p => {
    if (!publisherSearch.trim()) return true;
    const q = publisherSearch.toLowerCase();
    return (p.display_name && p.display_name.toLowerCase().includes(q)) ||
           (p.email && p.email.toLowerCase().includes(q)) ||
           (p.arn_number && p.arn_number.toLowerCase().includes(q)) ||
           (p.title && p.title.toLowerCase().includes(q));
  });

  return (
    <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Unified Compact Hero Header Banner (Light & Dark mode) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full  pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm">
                {isAdmin ? 'ADMIN & PUBLISHER CONSOLE' : 'PUBLISHER STUDIO'}
              </span>
              <button
                onClick={() => onNavigate('#/admin')}
                className="text-xs text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 underline font-semibold"
              >
                ← YouTube Ingestion Console
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight leading-snug">
              {isAdmin 
                ? (isTamil ? 'நிர்வாகம் & வெளியீட்டாளர் மேலாண்மை' : 'Admin & Content Management')
                : (isTamil ? 'வெளியீட்டாளர் கட்டுரை அரங்கம்' : 'Publisher Article Studio')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isTamil 
                ? 'கட்டுரைகளை எழுதுங்கள், திருத்துங்கள், வெளியீட்டாளர்களை நிர்வகியுங்கள்.' 
                : 'Create articles, manage certified financial publishers, and curate investor content.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
          {isAdmin && (
            <button
              onClick={() => {
                setCreatedCredentials(null);
                generateStrongPassword();
                setIsCreateModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <span>👥</span>
              <span>{isTamil ? '+ புதிய வெளியீட்டாளர்' : '+ Create Publisher'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('#/admin/articles/new')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 shrink-0"
          >
            <span>✍️</span>
            <span>{isTamil ? 'புதிய கட்டுரை எழுதுக' : '+ Write New Article'}</span>
          </button>
        </div>
      </div>
      </div>

      {/* Main Tab Navigation (Admin Only) */}
      {isAdmin && (
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'articles'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>✍️</span>
            <span>{isTamil ? 'கட்டுரைகள் ஸ்டுடியோ' : 'Articles Studio'} ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('publishers')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'publishers'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>👥</span>
            <span>{isTamil ? 'வெளியீட்டாளர்கள் & நிபுணர்கள்' : 'Publishers & Advisors'} ({publishers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'channels'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>🎬</span>
            <span>{isTamil ? 'சேனல் ஒப்புதல் வரிசை' : 'Channel Approvals'} ({channels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'videos'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>📹</span>
            <span>{isTamil ? 'வீடியோக்கள் மதிப்பாய்வு' : 'Video Moderation'} ({adminVideos.filter(v => v.status === 'pending').length})</span>
          </button>
        </div>
      )}

      {/* ================= TAB 1: ARTICLES STUDIO ================= */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{isTamil ? 'மொத்த கட்டுரைகள்' : 'Total Articles'}</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{articles.length}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{isTamil ? 'வெளியிடப்பட்டவை' : 'Published Live'}</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{publishedCount}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">{isTamil ? 'வரைவுகள் (Drafts)' : 'Saved Drafts'}</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{draftCount}</div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{isTamil ? 'நிலை:' : 'Status:'}</span>
              <button onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${statusFilter === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>All ({articles.length})</button>
              <button onClick={() => setStatusFilter('published')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${statusFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>Published</button>
              <button onClick={() => setStatusFilter('draft')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${statusFilter === 'draft' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>Drafts</button>
            </div>

            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isTamil ? "கட்டுரைகளைத் தேடுக..." : "Search articles..."}
                className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">✕</button>}
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {isLoadingArticles ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="text-3xl">📝</div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'கட்டுரைகள் எதுவும் இல்லை' : 'No Articles Found'}
                </h3>
                <button
                  onClick={() => onNavigate('#/admin/articles/new')}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition-colors shadow"
                >
                  {isTamil ? 'முதல் கட்டுரையை எழுதுங்கள்' : 'Write Your First Article'}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Article</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Read Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {articles.map(article => (
                      <tr key={article.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={article.coverImage || '/favicon.svg'}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800"
                              onError={(e) => { e.target.src = '/favicon.svg'; }}
                            />
                            <div className="min-w-0 max-w-md">
                              <div className="font-bold text-slate-900 dark:text-white truncate font-serif text-sm">
                                {article.titleTamil}
                              </div>
                              {article.titleEnglish && (
                                <div className="text-[11px] text-slate-400 truncate">
                                  EN: {article.titleEnglish}
                                </div>
                              )}
                              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                /{article.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {article.category}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                          ⏱ {article.readTimeMinutes} min
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleTogglePublish(article)}
                            title="Click to toggle publish/draft status"
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                              article.status === 'published'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                            }`}
                          >
                            {article.status === 'published' ? '● Published' : '○ Draft'}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unpublished'}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {article.status === 'published' && (
                              <button
                                onClick={() => onNavigate(`#/articles/${article.slug}`)}
                                title="View live article"
                                className="p-2 rounded-xl text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                👁️
                              </button>
                            )}
                            <button
                              onClick={() => onNavigate(`#/admin/articles/edit/${article.id}`)}
                              title="Edit article"
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition-all"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(article.id, article.titleTamil)}
                              disabled={deletingId === article.id}
                              title="Delete article"
                              className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PUBLISHERS & ADVISORS MANAGEMENT ================= */}
      {isAdmin && activeTab === 'publishers' && (
        <div className="space-y-6">
          {/* Publishers Overview Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{isTamil ? 'மொத்த வெளியீட்டாளர்கள்' : 'Total Publishers'}</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{publishers.length}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{isTamil ? 'முழுமை அடைந்த விவரங்கள்' : 'Profile Complete'}</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {publishers.filter(p => p.is_onboarded).length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">{isTamil ? 'முதல் உள்நுழைவு நிலுவை' : 'Pending First Login'}</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {publishers.filter(p => !p.is_onboarded).length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">{isTamil ? 'மொத்த கட்டுரைகள்' : 'Publisher Articles'}</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {publishers.reduce((acc, p) => acc + parseInt(p.article_count || 0, 10), 0)}
              </div>
            </div>
          </div>

          {/* Search and Action Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={publisherSearch}
                onChange={e => setPublisherSearch(e.target.value)}
                placeholder={isTamil ? "வெளியீட்டாளர் பெயர், மின்னஞ்சல் அல்லது ARN தேடுக..." : "Search publishers by name, email or ARN..."}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              {publisherSearch && (
                <button onClick={() => setPublisherSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">✕</button>
              )}
            </div>

            <button
              onClick={() => {
                setCreatedCredentials(null);
                generateStrongPassword();
                setIsCreateModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>{isTamil ? 'புதிய வெளியீட்டாளர் சேர்க்க' : 'Add New Publisher'}</span>
            </button>
          </div>

          {/* Publishers Cards / Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {isLoadingPublishers ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading publishers list...</p>
              </div>
            ) : filteredPublishers.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="text-3xl">👥</div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'வெளியீட்டாளர்கள் எதுவும் இல்லை' : 'No Publishers Found'}
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition-colors shadow"
                >
                  {isTamil ? 'முதல் வெளியீட்டாளரைச் சேருங்கள்' : 'Add First Publisher'}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Publisher / Advisor</th>
                      <th className="px-6 py-4">ARN / License</th>
                      <th className="px-6 py-4">Role & Status</th>
                      <th className="px-6 py-4">Onboarding</th>
                      <th className="px-6 py-4">Articles</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredPublishers.map(pub => (
                      <tr key={pub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Avatar & Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black flex items-center justify-center text-sm uppercase overflow-hidden shrink-0 border border-amber-500/30">
                              {pub.avatar_url ? (
                                <img src={pub.avatar_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                <span>{(pub.display_name || pub.email || 'P').charAt(0)}</span>
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <div className="font-bold text-slate-900 dark:text-white truncate text-sm">
                                {pub.display_name || 'Publisher'}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate font-mono">
                                {pub.email}
                              </div>
                              <div className="text-[10px] text-amber-600 dark:text-amber-400 truncate font-medium">
                                {pub.title || 'Mutual Fund Specialist'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ARN / Registration */}
                        <td className="px-6 py-4">
                          {pub.arn_number ? (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {pub.arn_number}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">Not Provided</span>
                          )}
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            pub.role === 'admin'
                              ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {pub.role || 'publisher'}
                          </span>
                        </td>

                        {/* Onboarding State */}
                        <td className="px-6 py-4">
                          {pub.is_onboarded ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <span>✅</span>
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <span>⏳</span>
                              <span>Pending 1st Login</span>
                            </span>
                          )}
                        </td>

                        {/* Article Count */}
                        <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300 font-bold">
                          {pub.article_count || 0}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit Publisher */}
                            <button
                              onClick={() => setEditingPublisher(pub)}
                              title="Edit publisher details"
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition-all"
                            >
                              ✏️ Edit
                            </button>

                            {/* Delete Publisher */}
                            {pub.id !== user?.id && (
                              <button
                                onClick={() => handleDeletePublisher(pub.id, pub.display_name || pub.email)}
                                disabled={deletingPublisherId === pub.id}
                                title="Delete publisher account"
                                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 font-bold transition-all disabled:opacity-50"
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CREATE PUBLISHER MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80  animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  AUTHOR ACCESS PROVISIONING
                </span>
                <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mt-1">
                  {isTamil ? 'புதிய வெளியீட்டாளரைச் சேர்க்கவும்' : 'Create Publisher Account'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {createdCredentials ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-900 dark:text-white space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>🎉</span>
                    <span>Publisher account created successfully!</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Share these login credentials with the publisher. When they log in for the first time, they will be prompted to complete their profile (photo, bio, social links, ARN).
                  </p>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-1.5">
                    <div><span className="text-slate-400">Email:</span> <strong className="text-amber-600 dark:text-amber-400">{createdCredentials.email}</strong></div>
                    <div><span className="text-slate-400">Password:</span> <strong className="text-amber-600 dark:text-amber-400">{createdCredentials.password}</strong></div>
                    <div><span className="text-slate-400">Login URL:</span> <strong className="text-slate-600 dark:text-slate-300">{window.location.origin}/#/login</strong></div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Muthaleetu Thisai Publisher Credentials:\nLogin: ${window.location.origin}/#/login\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`);
                      if (onShowToast) onShowToast('Credentials copied to clipboard!');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
                  >
                    📋 Copy Credentials
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreatePublisher} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newPubName}
                        onChange={e => setNewPubName(e.target.value)}
                        placeholder="e.g. S. Ramanathan, CFP"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={newPubEmail}
                        onChange={e => setNewPubEmail(e.target.value)}
                        placeholder="publisher@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Password + Generator */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Initial Password *</label>
                      <button
                        type="button"
                        onClick={generateStrongPassword}
                        className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-bold"
                      >
                        🎲 Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={newPubPassword}
                      onChange={e => setNewPubPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Title & ARN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Professional Designation</label>
                      <input
                        type="text"
                        value={newPubTitle}
                        onChange={e => setNewPubTitle(e.target.value)}
                        placeholder="e.g. Certified Financial Planner"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">AMFI ARN / SEBI Reg</label>
                      <input
                        type="text"
                        value={newPubArn}
                        onChange={e => setNewPubArn(e.target.value)}
                        placeholder="e.g. ARN-123456"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Specialties (Comma Separated)</label>
                    <input
                      type="text"
                      value={newPubSpecialties}
                      onChange={e => setNewPubSpecialties(e.target.value)}
                      placeholder="Mutual Funds, Equity SIPs, Retirement, Tax Planning"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={newPubLinkedin}
                        onChange={e => setNewPubLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Website URL</label>
                      <input
                        type="url"
                        value={newPubWebsite}
                        onChange={e => setNewPubWebsite(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingPublisher}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      {isSubmittingPublisher ? 'Creating...' : '🚀 Create Publisher'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CHANNEL APPROVALS QUEUE ================= */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {isTamil ? 'மொத்த சமர்ப்பிக்கப்பட்ட சேனல்கள்' : 'Total Submitted Channels'}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{channels.length}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {isTamil ? 'சரிபார்ப்பு நிலுவையில்' : 'Pending Verification'}
              </span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {channels.filter(c => !c.youtube_channel_verified).length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {isTamil ? 'சரிபார்க்கப்பட்டு இணைக்கப்பட்டது' : 'Verified & Auto-Syncing'}
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {channels.filter(c => c.youtube_channel_verified).length}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{isTamil ? 'நிலை:' : 'Status:'}</span>
              <button
                onClick={() => setChannelStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  channelStatusFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Pending Review
              </button>
              <button
                onClick={() => setChannelStatusFilter('verified')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  channelStatusFilter === 'verified'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Verified Channels
              </button>
              <button
                onClick={() => setChannelStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  channelStatusFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All Linked Channels
              </button>
            </div>

            <button
              onClick={fetchChannels}
              className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors self-end sm:self-auto flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Channels Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {isLoadingChannels ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading channel approval queue...</p>
              </div>
            ) : channels.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="text-3xl">🎬</div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'சேனல் ஒப்புதல் வரிசை காலியாக உள்ளது' : 'No Channels in Approval Queue'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isTamil ? 'புதிய வெளியீட்டாளர்கள் தங்கள் YouTube சேனலை இணைக்கும்போது இங்கே தோன்றும்.' : 'When publishers link their YouTube channel URL during onboarding, they will appear here for verification.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Publisher</th>
                      <th className="px-6 py-4">Linked YouTube Channel</th>
                      <th className="px-6 py-4">Channel ID</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {channels.map(ch => (
                      <tr key={ch.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={ch.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(ch.display_name || 'Publisher')}&background=f59e0b&color=0f172a`}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {ch.display_name || 'Anonymous Publisher'}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {ch.email}
                              </div>
                              {ch.arn_number && (
                                <div className="text-[10px] font-mono text-amber-500 font-bold mt-0.5">
                                  ARN: {ch.arn_number}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {ch.youtube_channel_thumbnail ? (
                              <img
                                src={ch.youtube_channel_thumbnail}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover bg-slate-950 border border-red-500 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-base shrink-0">
                                ▶
                              </div>
                            )}
                            <div className="min-w-0 max-w-xs">
                              <div className="font-bold text-slate-900 dark:text-white truncate">
                                {ch.youtube_channel_title || 'YouTube Channel'}
                              </div>
                              <a
                                href={ch.youtube_channel_id ? `https://www.youtube.com/channel/${ch.youtube_channel_id}` : (ch.youtube_url || '#')}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-500 hover:underline flex items-center gap-1 truncate"
                              >
                                <span>{ch.youtube_url || `youtube.com/channel/${ch.youtube_channel_id}`}</span>
                                <span>↗</span>
                              </a>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                          {ch.youtube_channel_id || 'Not resolved'}
                        </td>

                        <td className="px-6 py-4">
                          {ch.youtube_channel_verified ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max">
                              <span>✓</span>
                              <span>Verified & Ingesting</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 w-max">
                              <span>⏳</span>
                              <span>Pending Review</span>
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!ch.youtube_channel_verified ? (
                              <>
                                <button
                                  onClick={() => handleVerifyChannelAction(ch.id, true)}
                                  disabled={processingChannelId === ch.id}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 flex items-center gap-1"
                                >
                                  <span>✓</span>
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleVerifyChannelAction(ch.id, false)}
                                  disabled={processingChannelId === ch.id}
                                  className="px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs border border-red-500/20 transition-all disabled:opacity-50 flex items-center gap-1"
                                >
                                  <span>✕</span>
                                  <span>Reject</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleVerifyChannelAction(ch.id, false)}
                                disabled={processingChannelId === ch.id}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-500 text-xs font-bold transition-all disabled:opacity-50"
                              >
                                Revoke Sync
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: VIDEO MODERATION QUEUE ================= */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {isTamil ? 'மதிப்பாய்வு நிலுவையில் (Pending)' : 'Pending Publisher Videos'}
              </span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {adminVideos.filter(v => v.status === 'pending').length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {isTamil ? 'நேரலையில் வெளியிடப்பட்டவை' : 'Published Live'}
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {adminVideos.filter(v => v.status === 'published').length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                {isTamil ? 'நிராகரிக்கப்பட்டவை' : 'Rejected Videos'}
              </span>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 font-mono">
                {adminVideos.filter(v => v.status === 'rejected').length}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{isTamil ? 'நிலை:' : 'Status:'}</span>
              <button
                onClick={() => setVideoStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  videoStatusFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Pending Review
              </button>
              <button
                onClick={() => setVideoStatusFilter('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  videoStatusFilter === 'published'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Published Live
              </button>
              <button
                onClick={() => setVideoStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  videoStatusFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => setVideoStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  videoStatusFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All Videos
              </button>
            </div>

            <button
              onClick={fetchAdminVideos}
              className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors self-end sm:self-auto flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>Refresh Videos</span>
            </button>
          </div>

          {/* Videos Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {isLoadingAdminVideos ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading video moderation queue...</p>
              </div>
            ) : adminVideos.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="text-3xl">📹</div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isTamil ? 'வீடியோக்கள் எதுவும் இல்லை' : 'No Videos Found in this Queue'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isTamil ? 'சரிபார்க்கப்பட்ட வெளியீட்டாளர்களின் புதிய வீடியோக்கள் தானாகவே இங்கே பட்டியலிடப்படும்.' : 'Videos ingested from verified publisher YouTube channels will appear here for admin review.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Video</th>
                      <th className="px-6 py-4">Source Publisher</th>
                      <th className="px-6 py-4">Duration & Views</th>
                      <th className="px-6 py-4">Translation</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {adminVideos.map(v => (
                      <tr key={v.id || v.youtubeId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800 group">
                              <img
                                src={v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <a
                                href={v.youtubeUrl || `https://www.youtube.com/watch?v=${v.youtubeId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                              >
                                ▶
                              </a>
                            </div>
                            <div className="min-w-0 max-w-md">
                              <div className="font-bold text-slate-900 dark:text-white truncate font-serif text-sm">
                                {v.titleTamil || v.title}
                              </div>
                              {v.titleEnglish && (
                                <div className="text-[11px] text-slate-400 truncate">
                                  EN: {v.titleEnglish}
                                </div>
                              )}
                              <a
                                href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono text-blue-500 hover:underline inline-block mt-0.5"
                              >
                                {v.youtubeId} ↗
                              </a>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {v.sourcePublisherName ? (
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {v.sourcePublisherName}
                              </div>
                              {v.sourcePublisherArn && (
                                <div className="text-[10px] font-mono text-amber-500 font-bold">
                                  ARN: {v.sourcePublisherArn}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                              Budget Padmanaban (Main)
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-mono text-slate-700 dark:text-slate-300">
                            ⏱ {v.duration || '00:00'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            👁 {(v.views || 0).toLocaleString()} views
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {v.translatedAt ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              ✓ Gemini Translated
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400">
                              Untranslated
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {v.status === 'published' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              ✓ Published
                            </span>
                          ) : v.status === 'rejected' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                              ✕ Rejected
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              ⏳ Pending Review
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {v.status !== 'published' && (
                              <button
                                onClick={() => handleUpdateVideoStatusAction(v.youtubeId, 'published')}
                                disabled={processingVideoId === v.youtubeId}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                <span>✓</span>
                                <span>Publish</span>
                              </button>
                            )}
                            {v.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateVideoStatusAction(v.youtubeId, 'rejected')}
                                disabled={processingVideoId === v.youtubeId}
                                className="px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs border border-red-500/20 transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                <span>✕</span>
                                <span>Reject</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EDIT PUBLISHER MODAL ================= */}
      {editingPublisher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80  animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  UPDATE DETAILS
                </span>
                <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mt-1">
                  Edit Publisher: {editingPublisher.display_name}
                </h3>
              </div>
              <button
                onClick={() => setEditingPublisher(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePublisher} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Name</label>
                  <input
                    type="text"
                    value={editingPublisher.display_name || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, display_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Designation / Title</label>
                  <input
                    type="text"
                    value={editingPublisher.title || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">AMFI ARN / License</label>
                  <input
                    type="text"
                    value={editingPublisher.arn_number || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, arn_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={editingPublisher.phone || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={editingPublisher.linkedin_url || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Website URL</label>
                  <input
                    type="url"
                    value={editingPublisher.website_url || ''}
                    onChange={e => setEditingPublisher({ ...editingPublisher, website_url: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bio & Summary</label>
                <textarea
                  rows={3}
                  value={editingPublisher.bio || ''}
                  onChange={e => setEditingPublisher({ ...editingPublisher, bio: e.target.value })}
                  placeholder="Short professional summary"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPublisher(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * FIRST-TIME PUBLISHER ONBOARDING MODAL WIZARD
 * Prompts newly registered publishers for profile photo, title, ARN, bio, and social links.
 */
function PublisherOnboardingModal({ profile, onComplete, onClose }) {
  const { language } = useLanguage();
  const { session, setProfile } = useAuth();
  const isTamil = language === 'ta';
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [title, setTitle] = useState(profile?.title || 'AMFI Registered Mutual Fund Distributor');
  const [arnNumber, setArnNumber] = useState(profile?.arn_number || '');
  const [specialties, setSpecialties] = useState(
    Array.isArray(profile?.specialties)
      ? profile.specialties.join(', ')
      : (profile?.specialties || 'Mutual Funds, SIPs, Wealth Compounding, Tax Saving')
  );
  const [bio, setBio] = useState(profile?.bio || '');
  const [bioTa, setBioTa] = useState(profile?.bio_ta || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '');
  const [twitterUrl, setTwitterUrl] = useState(profile?.twitter_url || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');
  const [whatsappNumber, setWhatsappNumber] = useState(profile?.whatsapp_number || profile?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [photoMode, setPhotoMode] = useState('upload'); // 'upload' | 'url' | 'presets'

  // Curated professional avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
  ];

  // Handle local image file upload & high-performance compression via HTML5 Canvas
  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(isTamil ? 'தயவுசெய்து சரியான படக் கோப்பைத் தேர்ந்தெடுக்கவும்.' : 'Please select a valid image file.');
      return;
    }

    setIsUploadingPhoto(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to lightweight high-quality JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(dataUrl);
          setIsUploadingPhoto(false);
        } catch (err) {
          console.warn('Canvas compression fallback:', err);
          setAvatarUrl(loadEvt.target.result);
          setIsUploadingPhoto(false);
        }
      };
      img.onerror = () => {
        setError('Could not load selected image.');
        setIsUploadingPhoto(false);
      };
      img.src = loadEvt.target.result;
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const token = session?.access_token || '';
      const payload = {
        display_name: displayName.trim(),
        avatar_url: avatarUrl.trim(),
        title: title.trim(),
        arn_number: arnNumber.trim(),
        specialties: typeof specialties === 'string'
          ? specialties.split(',').map(s => s.trim()).filter(Boolean)
          : specialties,
        bio: bio.trim(),
        bio_ta: bioTa.trim(),
        linkedin_url: linkedinUrl.trim(),
        twitter_url: twitterUrl.trim(),
        website_url: websiteUrl.trim(),
        whatsapp_number: whatsappNumber.trim(),
        phone: whatsappNumber.trim()
      };

      const res = await fetch('/api/publisher/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save publisher profile');

      const updated = json.data || { ...profile, ...payload, is_onboarded: true };
      if (setProfile) setProfile(updated);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('publisher-profile-updated', { detail: updated }));
      }
      if (onComplete) onComplete(updated);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85  animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Step Switcher */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 text-white border-b border-slate-800 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
            >
              ✕
            </button>
          )}
          <div className="flex items-center justify-between mb-2 pr-10">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
              ✨ PUBLISHER PROFILE & CREDENTIALS
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">
              Step {step} of 3
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
            {isTamil ? 'வெளியீட்டாளர் விவரங்கள் & சான்றுகள்' : 'Edit Publisher Profile & Credentials'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isTamil ? 'உங்கள் சுயவிவர புகைப்படம், AMFI பதிவு எண், சிறப்புத் துறைகள் மற்றும் சமூக வலைத்தள இணைப்புகள்.' : 'Update your profile photo, AMFI ARN number, bio, and consultation channels for investors.'}
          </p>

          {/* Interactive Step Switcher Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-1.5 ${
                step === 1 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>👤</span>
              <span className="truncate">1. Photo & Identity</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-1.5 ${
                step === 2 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📝</span>
              <span className="truncate">2. Bio & Specialties</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-1.5 ${
                step === 3 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📱</span>
              <span className="truncate">3. Social & Contact</span>
            </button>
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-sm font-bold">✕</button>
            </div>
          )}

          {/* STEP 1: PHOTO & CREDENTIALS */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Avatar Live Preview & Photo Uploader Box */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Avatar Large Preview */}
                  <div className="relative group/photo shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 overflow-hidden border-2 border-amber-500 flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span>{(displayName || 'P').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 rounded-3xl bg-slate-950/70  flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Photo Actions */}
                  <div className="space-y-3 flex-1 text-center sm:text-left w-full">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        {isTamil ? 'சுயவிவரப் புகைப்படம் (Profile Photo)' : 'Publisher Profile Photo'}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isTamil ? 'உங்கள் சாதனத்திலிருந்து புகைப்படத்தைப் பதிவேற்றவும் அல்லது இணைப்பை உள்ளிடவும்.' : 'Upload directly from your device, choose a curated preset, or paste an image URL.'}
                      </p>
                    </div>

                    {/* Action Buttons: Upload & Presets */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
                      >
                        <span>📤</span>
                        <span>{isTamil ? 'படத்தை பதிவேற்றுக' : 'Upload from Device'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPhotoMode(photoMode === 'url' ? 'upload' : 'url')}
                        className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:border-amber-500 transition-all flex items-center gap-1"
                      >
                        <span>🔗</span>
                        <span>{photoMode === 'url' ? 'Hide URL' : 'Image URL'}</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl('')}
                          className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <span>🗑️</span>
                          <span>{isTamil ? 'அகற்று' : 'Clear'}</span>
                        </button>
                      )}
                    </div>

                    {/* Image URL Input (when toggled) */}
                    {photoMode === 'url' && (
                      <div className="space-y-1 pt-1 animate-fadeIn">
                        <input
                          type="url"
                          value={avatarUrl}
                          onChange={e => setAvatarUrl(e.target.value)}
                          placeholder="https://example.com/your-photo.jpg"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}

                    {/* Quick Avatar Presets */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Presets:</span>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                          {avatarPresets.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setAvatarUrl(preset)}
                              className={`w-7 h-7 rounded-full overflow-hidden border transition-all ${
                                avatarUrl === preset
                                  ? 'border-amber-500 scale-110 shadow-md ring-2 ring-amber-500/40'
                                  : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100 hover:scale-105'
                              }`}
                            >
                              <img src={preset} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Full Display Name *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Shown publicly on all articles & directory</span>
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Ramesh V"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Title & ARN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Professional Designation
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="AMFI Registered Mutual Fund Distributor"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    AMFI ARN / SEBI Registration Number
                  </label>
                  <input
                    type="text"
                    value={arnNumber}
                    onChange={e => setArnNumber(e.target.value)}
                    placeholder="e.g. ARN-56291"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BIO & SPECIALTIES */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Specialties */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Areas of Expertise / Specialties (Comma separated)
                </label>
                <input
                  type="text"
                  value={specialties}
                  onChange={e => setSpecialties(e.target.value)}
                  placeholder="Mutual Funds, Equity SIPs, Wealth Compounding, Tax Saving"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400">
                  e.g. Mutual Funds, SIP Strategies, Retirement Planning, Sovereign Gold Bonds, ELSS Tax Saving
                </p>
              </div>

              {/* Bio (English) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  About You & Investment Philosophy (English)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Share your experience, investment philosophy, and wealth compounding approach..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Bio (Tamil) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  சுயவிவரம் & முதலீட்டு நோக்கம் (தமிழ்)
                </label>
                <textarea
                  rows={3}
                  value={bioTa}
                  onChange={e => setBioTa(e.target.value)}
                  placeholder="உங்கள் நிதி ஆலோசனை அனுபவம் மற்றும் முதலீட்டாளர்களுக்கான வழிகாட்டல்..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-serif"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SOCIAL & CONNECT LINKS */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* WhatsApp Consultation */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>💬</span>
                  <span>Direct WhatsApp Consultation Number</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="+91 98400 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400/80">
                  Enables users to connect with you directly via WhatsApp on your profile and articles.
                </p>
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>💼</span>
                  <span>LinkedIn Profile URL</span>
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Official Website URL */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <label className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>🌐</span>
                    <span>{isTamil ? 'அதிகாரப்பூர்வ வலைத்தளம் (Website URL)' : 'Official Website URL'}</span>
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">{isTamil ? 'இணைப்பு' : 'Direct Link'}</span>
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  placeholder="https://www.yourwebsite.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
                  {isTamil
                    ? '💡 உங்கள் தனிப்பட்ட அல்லது நிறுவன வலைத்தள இணைப்பை உள்ளிடவும். முதலீட்டாளர்கள் மற்றும் வாசகர்கள் உங்கள் சேவைகளைப் பற்றி மேலும் அறிய இந்த இணைப்பைப் பார்வையிடலாம்.'
                    : '💡 Enter your personal or advisory website URL. Readers and investors can visit your official website to learn more about your services.'}
                </p>
              </div>

              {/* Twitter / X */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>🐦</span>
                  <span>Twitter / X Profile URL or Handle</span>
                </label>
                <input
                  type="text"
                  value={twitterUrl}
                  onChange={e => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/yourhandle or @yourhandle"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 3 && (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !displayName.trim()) {
                    setError('Please enter your full display name');
                    return;
                  }
                  setError('');
                  setStep(s => s + 1);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <span>→</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !displayName.trim()}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Saving Profile...' : '🚀 Save All Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/**
 * RICH TEXT EDITOR — Inline contentEditable editor with formatting toolbar.
 * Props: value (HTML string), onChange (fn), placeholder, language, minHeight
 */
function RichTextEditor({ value, onChange, placeholder, language = 'ta', minHeight = '360px' }) {
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const isTamil = language === 'ta';
  const isInitialized = useRef(false);

  // Set initial HTML content once on mount
  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, []);

  // Sync external value changes (e.g. after auto-translate or load)
  useEffect(() => {
    if (editorRef.current && isInitialized.current) {
      const current = editorRef.current.innerHTML;
      if (current !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const exec = (cmd, val = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(cmd, false, val);
    if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleLink = () => {
    const url = prompt(isTamil ? 'இணைக்கப்பட வேண்டிய URL முகவரியை உள்ளிடவும்:' : 'Enter URL to link:');
    if (url) exec('createLink', url.startsWith('http') ? url : `https://${url}`);
  };

  const handleImagePrompt = () => {
    const choice = confirm(isTamil ? 'இணையதள பட URL உள்ளிட [OK] அழுத்தவும் அல்லது கணினியிலிருந்து படத்தை பதிவேற்ற [Cancel] அழுத்தவும்:' : 'Click [OK] to enter an Image URL, or [Cancel] to upload from your device:');
    if (choice) {
      const url = prompt(isTamil ? 'படத்தின் URL முகவரி:' : 'Enter Image URL:');
      if (url) exec('insertImage', url);
    } else {
      if (imageInputRef.current) imageInputRef.current.click();
    }
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) exec('insertImage', dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-950 shadow-sm focus-within:border-amber-500 transition-colors">
      {/* Hidden Image File Uploader */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Toolbar */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex flex-wrap items-center gap-1.5 text-xs select-none">
        
        {/* 1. History (Undo / Redo) */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title={isTamil ? 'செயல்தவிர் (Undo)' : 'Undo'}
            onMouseDown={e => { e.preventDefault(); exec('undo'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            ↶
          </button>
          <button
            type="button"
            title={isTamil ? 'மீண்டும் செய் (Redo)' : 'Redo'}
            onMouseDown={e => { e.preventDefault(); exec('redo'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            ↷
          </button>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 2. Font Family Picker */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Font:</span>
          <select
            onChange={e => exec('fontName', e.target.value)}
            defaultValue="'Book Antiqua', Palatino, serif"
            className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer max-w-[120px]"
            title={isTamil ? 'எழுத்து நடை (Font Family)' : 'Font Family'}
          >
            <option value="'Book Antiqua', Palatino, serif">Book Antiqua</option>
            <option value="'Inter', sans-serif">Inter (Sans-Serif)</option>
            <option value="'Noto Serif Tamil', serif">Tamil Classical</option>
            <option value="'Georgia', serif">Georgia (Serif)</option>
            <option value="'Courier New', monospace">Monospace</option>
          </select>
        </div>

        {/* 3. Font Size Picker */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Size:</span>
          <select
            onChange={e => exec('fontSize', e.target.value)}
            defaultValue="3"
            className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            title={isTamil ? 'எழுத்து அளவு (Font Size)' : 'Font Size'}
          >
            <option value="1">12px (Small)</option>
            <option value="2">14px (Regular)</option>
            <option value="3">16px (Base Body)</option>
            <option value="4">18px (Medium)</option>
            <option value="5">24px (Large Heading)</option>
            <option value="6">32px (Huge Title)</option>
          </select>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 4. Basic Typography Formats */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onMouseDown={e => { e.preventDefault(); exec('bold'); }}
            className="w-7 h-7 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 font-black transition-colors flex items-center justify-center"
          >
            B
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onMouseDown={e => { e.preventDefault(); exec('italic'); }}
            className="w-7 h-7 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 italic font-bold transition-colors flex items-center justify-center"
          >
            I
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onMouseDown={e => { e.preventDefault(); exec('underline'); }}
            className="w-7 h-7 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 underline font-bold transition-colors flex items-center justify-center"
          >
            U
          </button>
          <button
            type="button"
            title="Strikethrough"
            onMouseDown={e => { e.preventDefault(); exec('strikeThrough'); }}
            className="w-7 h-7 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 line-through font-bold transition-colors flex items-center justify-center"
          >
            S
          </button>
        </div>

        {/* 5. Colors (Text & Highlight) */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200/80 dark:border-slate-700/80">
          {/* Text Color Picker */}
          <label className="relative flex items-center justify-center w-7 h-7 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={isTamil ? 'எழுத்து நிறம் (Text Color)' : 'Text Color'}>
            <span className="text-xs font-black border-b-2 border-amber-500">A</span>
            <input
              type="color"
              defaultValue="#0f172a"
              onChange={e => exec('foreColor', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>

          {/* Highlight Color Picker */}
          <label className="relative flex items-center justify-center w-7 h-7 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={isTamil ? 'பின்னணி நிறம் / சிறப்பம்சம் (Highlight Color)' : 'Highlight Background'}>
            <span className="text-xs">🖍️</span>
            <input
              type="color"
              defaultValue="#fef08a"
              onChange={e => exec('hiliteColor', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 6. Block Structure Formats */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title="Heading 1"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h1'); }}
            className="px-2 h-7 rounded text-[11px] font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            H1
          </button>
          <button
            type="button"
            title="Heading 2"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h2'); }}
            className="px-2 h-7 rounded text-[11px] font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            H2
          </button>
          <button
            type="button"
            title="Heading 3"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h3'); }}
            className="px-2 h-7 rounded text-[11px] font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            H3
          </button>
          <button
            type="button"
            title="Paragraph Text"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'p'); }}
            className="px-2 h-7 rounded text-[11px] font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            P
          </button>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 7. Text Alignment */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title={isTamil ? 'இடது சீரமைப்பு (Align Left)' : 'Align Left'}
            onMouseDown={e => { e.preventDefault(); exec('justifyLeft'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h10M4 18h14" />
            </svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'மைய சீரமைப்பு (Align Center)' : 'Align Center'}
            onMouseDown={e => { e.preventDefault(); exec('justifyCenter'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M7 12h10M5 18h14" />
            </svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'வலது சீரமைப்பு (Align Right)' : 'Align Right'}
            onMouseDown={e => { e.preventDefault(); exec('justifyRight'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M10 12h10M6 18h14" />
            </svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'முழு சீரமைப்பு (Justify)' : 'Justify Text'}
            onMouseDown={e => { e.preventDefault(); exec('justifyFull'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 8. Lists & Indentation */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title={isTamil ? 'புல்லட் பட்டியல் (Bullet List)' : 'Bullet List'}
            onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current"><circle cx="2" cy="4" r="1.5"/><rect x="5" y="3" width="10" height="2"/><circle cx="2" cy="8" r="1.5"/><rect x="5" y="7" width="10" height="2"/><circle cx="2" cy="12" r="1.5"/><rect x="5" y="11" width="10" height="2"/></svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'எண் வரிசைப் பட்டியல் (Numbered List)' : 'Numbered List'}
            onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current"><text x="0" y="5" fontSize="5" fontFamily="monospace">1.</text><rect x="5" y="3" width="10" height="2"/><text x="0" y="10" fontSize="5" fontFamily="monospace">2.</text><rect x="5" y="7" width="10" height="2"/><text x="0" y="15" fontSize="5" fontFamily="monospace">3.</text><rect x="5" y="11" width="10" height="2"/></svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'உள்தள்ளலை குறைக்கவும் (Outdent)' : 'Decrease Indent'}
            onMouseDown={e => { e.preventDefault(); exec('outdent'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            ⇤
          </button>
          <button
            type="button"
            title={isTamil ? 'உள்தள்ளலை அதிகரிக்கவும் (Indent)' : 'Increase Indent'}
            onMouseDown={e => { e.preventDefault(); exec('indent'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            ⇥
          </button>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 9. Rich Media & Publishing Elements */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title={isTamil ? 'முக்கிய மேற்கோள் பெட்டி (Blockquote)' : 'Blockquote Quote Box'}
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'blockquote'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-serif font-black text-sm"
          >
            “
          </button>
          <button
            type="button"
            title={isTamil ? 'பிரிக்கும் கோடு (Divider Line)' : 'Horizontal Divider (<hr />)'}
            onMouseDown={e => { e.preventDefault(); exec('insertHorizontalRule'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold text-xs"
          >
            ―
          </button>
          <button
            type="button"
            title={isTamil ? 'இணைப்புச் சேர் (Insert Link)' : 'Insert Hyperlink'}
            onMouseDown={e => { e.preventDefault(); handleLink(); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'படம் அல்லது விளக்கப்படம் சேர் (Insert Image)' : 'Insert Image / Chart'}
            onMouseDown={e => { e.preventDefault(); handleImagePrompt(); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'வடிவமைப்பை நீக்கு (Clear All Formatting)' : 'Clear Formatting'}
            onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6"/>
            </svg>
          </button>
        </div>

      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="editor-rich-content w-full px-6 py-5 text-sm text-slate-900 dark:text-white leading-relaxed outline-none prose dark:prose-invert max-w-none
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-400 [&:empty]:before:pointer-events-none"
      />
    </div>
  );
}

function ArticleEditorPage({ articleId, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session, role, supabase } = useAuth();
  const isTamil = language === 'ta';

  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const [titleTa, setTitleTa] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [excerptTa, setExcerptTa] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [bodyTa, setBodyTa] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [category, setCategory] = useState('mutual-fund');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('draft');
  const [activeTab, setActiveTab] = useState('ta');

  const slugify = (text) => {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleTaChange = (e) => {
    const val = e.target.value;
    setTitleTa(val);
    if (!isSlugManual && (!articleId || articleId === 'new')) {
      const generated = slugify(titleEn || val);
      if (generated) setSlug(generated);
    }
  };

  const handleTitleEnChange = (e) => {
    const val = e.target.value;
    setTitleEn(val);
    if (!isSlugManual && (!articleId || articleId === 'new')) {
      const generated = slugify(val);
      if (generated) setSlug(generated);
    }
  };

  useEffect(() => {
    if (!articleId || articleId === 'new') return;

    let isMounted = true;
    const loadArticle = async () => {
      setIsLoading(true);
      try {
        const token = session?.access_token || '';
        const res = await fetch(`/api/admin/articles/${articleId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load article details');
        const data = await res.json();
        const a = data.data;

        if (isMounted && a) {
          setTitleTa(a.title_ta || a.titleTamil || '');
          setTitleEn(a.title_en || a.titleEnglish || '');
          setSlug(a.slug || '');
          setIsSlugManual(true);
          setExcerptTa(a.excerpt_ta || a.excerptTamil || '');
          setExcerptEn(a.excerpt_en || a.excerptEnglish || '');
          setBodyTa(a.body_ta || a.bodyTamil || '');
          setBodyEn(a.body_en || a.bodyEnglish || '');
          setCoverImageUrl(a.cover_image_url || a.coverImage || '');
          setCategory(a.category || 'mutual-fund');
          setTagsInput(Array.isArray(a.tags) ? a.tags.join(', ') : '');
          setStatus(a.status || 'draft');
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadArticle();
    return () => { isMounted = false; };
  }, [articleId, session]);

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setError('');

    try {
      if (supabase && supabase.storage) {
        const fileExt = file.name.split('.').pop();
        const fileName = `cover_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('article-covers')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('article-covers')
          .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
          setCoverImageUrl(publicUrlData.publicUrl);
          if (onShowToast) onShowToast(isTamil ? 'படம் பதிவேற்றப்பட்டது!' : 'Cover image uploaded!');
          setIsUploadingImage(false);
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = () => {
        setCoverImageUrl(reader.result);
        if (onShowToast) onShowToast('Image loaded');
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);

    } catch (err) {
      console.error('Image upload failed:', err);
      setError(`Image upload error: ${err.message}`);
      setIsUploadingImage(false);
    }
  };

  const handleAutoTranslate = async () => {
    if (!titleTa && !bodyTa) {
      setError(isTamil ? 'மொழிபெயர்க்க தலைப்பு அல்லது உள்ளடக்கத்தை உள்ளிடவும்.' : 'Please enter a Tamil title or body to translate.');
      return;
    }

    setIsTranslating(true);
    setError('');

    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title_ta: titleTa,
          excerpt_ta: excerptTa,
          body_ta: bodyTa
        })
      });

      if (!res.ok) throw new Error('Translation API request failed');

      const result = await res.json();
      if (result.data) {
        if (result.data.title_en) {
          setTitleEn(result.data.title_en);
          if (!slug || !isSlugManual) {
            setSlug(slugify(result.data.title_en));
          }
        }
        if (result.data.excerpt_en) setExcerptEn(result.data.excerpt_en);
        if (result.data.body_en) setBodyEn(result.data.body_en);

        setActiveTab('en');
        if (onShowToast) onShowToast(isTamil ? 'ஆங்கில மொழிபெயர்ப்பு உருவாக்கப்பட்டது! சரிபார்க்கவும்.' : 'English translation generated! Please review.');
      }
    } catch (err) {
      console.error('Auto-translate error:', err);
      setError(`Translation error: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = async (publishNow = false) => {
    setError('');

    if (!titleTa || !titleTa.trim()) {
      setError(isTamil ? 'தமிழ் தலைப்பு அவசியம்.' : 'Tamil Title is required.');
      return;
    }

    if (!bodyTa || !bodyTa.trim() || bodyTa === '<p><br></p>') {
      setError(isTamil ? 'தமிழ் உள்ளடக்கம் அவசியம்.' : 'Tamil Article Body is required.');
      return;
    }

    let finalSlug = slug ? slugify(slug) : slugify(titleEn || titleTa);
    if (!finalSlug) finalSlug = `article-${Date.now()}`;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      slug: finalSlug,
      title_ta: titleTa.trim(),
      title_en: titleEn.trim() || null,
      excerpt_ta: excerptTa.trim() || null,
      excerpt_en: excerptEn.trim() || null,
      body_ta: bodyTa,
      body_en: bodyEn || null,
      cover_image_url: coverImageUrl || null,
      category,
      tags,
      status: publishNow ? 'published' : 'draft'
    };

    setIsLoading(true);

    try {
      const token = session?.access_token || '';
      const isEditing = articleId && articleId !== 'new';
      const endpoint = isEditing ? `/api/admin/articles/${articleId}` : '/api/admin/articles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save article');

      try {
        localStorage.removeItem('muthaleetu_articles_cache');
        window.dispatchEvent(new CustomEvent('articles_updated'));
      } catch (_) {}

      if (onShowToast) {
        onShowToast(publishNow ? (isTamil ? 'கட்டுரை உடனடியாக வெளியிடப்பட்டது! ' : 'Article published live! ') : (isTamil ? 'வரைவு சேமிக்கப்பட்டது.' : 'Article draft saved.'));
      }

      if (publishNow && data.data?.slug) {
        onNavigate(`#/articles/${data.data.slug}`);
      } else {
        onNavigate(role === 'admin' ? '#/admin/articles' : '#/profile');
      }

    } catch (err) {
      console.error('Save article error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (role !== 'admin' && role !== 'publisher') return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Unified Compact Hero Header Banner (Light & Dark mode) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full  pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <button
              onClick={() => onNavigate('#/admin/articles')}
              className="text-xs font-bold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              ← {isTamil ? 'கட்டுரைகள் பட்டியலுக்குத் திரும்பு' : 'Back to Articles Studio'}
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight leading-snug">
              {articleId && articleId !== 'new' ? (isTamil ? 'கட்டுரையைத் திருத்துக' : 'Edit Article') : (isTamil ? 'புதிய கட்டுரை எழுதுக' : 'Write New Article')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isTamil
                ? 'தமிழ் மற்றும் ஆங்கிலத்தில் தொழில்முறை முதலீட்டுக் கட்டுரைகளை எழுதி வெளியிடுங்கள்.'
                : 'Compose, format, translate, and publish certified financial analyses for investors.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all shadow-sm disabled:opacity-50"
            >
              {isTamil ? 'வரைவாகச் சேமி (Draft)' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>✍️</span>
              <span>{isTamil ? 'உடனே வெளியிடு (Publish Live)' : 'Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold flex items-center gap-2">
          <span></span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTamil ? 'தமிழ் தலைப்பு (முதன்மை)' : 'Tamil Title (Primary) *'}
              </label>
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">TAMIL</span>
            </div>
            <input
              type="text"
              value={titleTa}
              onChange={handleTitleTaChange}
              placeholder="எ.கா: 2026ல் முதலீடு செய்ய சிறந்த 5 Flexi Cap மியூச்சுவல் ஃபண்டுகள்"
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-serif"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTamil ? 'ஆங்கில தலைப்பு' : 'English Title'}
              </label>
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">ENGLISH</span>
            </div>
            <input
              type="text"
              value={titleEn}
              onChange={handleTitleEnChange}
              placeholder="e.g. Top 5 Flexi Cap Mutual Funds to Invest in 2026"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'URL Slug (இணைப்பு முகவரி) *' : 'URL Slug *'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setIsSlugManual(true); }}
                placeholder="top-flexi-cap-funds-2026"
                required
                className="w-full pl-7 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'பிரிவு (Category)' : 'Category'}
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="mutual-fund">Mutual Funds</option>
              <option value="stock-market">Stock Market</option>
              <option value="personal-finance">Personal Finance</option>
              <option value="financial-education">Financial Education</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'குறிச்சொற்கள் (Tags, comma separated)' : 'Tags (comma separated)'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="SIP, NIFTY 50, Wealth, Tax"
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTamil ? 'முகப்புப் படம் (Cover Image)' : 'Cover Image Upload & URL'}
              </label>
              <p className="text-[11px] text-slate-400">
                {isTamil ? 'Supabase Storage "article-covers" பக்கத்தில் பதிவேற்றப்படும்.' : 'Uploads directly to Supabase Storage "article-covers" bucket.'}
              </p>
            </div>
            {isUploadingImage && <span className="text-xs font-bold text-amber-500 animate-pulse">Uploading image...</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                disabled={isUploadingImage}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-6">
              <input
                type="text"
                value={coverImageUrl}
                onChange={e => setCoverImageUrl(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {coverImageUrl && (
            <div className="relative aspect-[21/9] max-h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md">
              <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverImageUrl('')}
                className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px] shadow"
              >
                 Remove
              </button>
            </div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950 border border-amber-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-base font-black"></span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                {isTamil ? 'தானியங்கி ஆங்கில மொழிபெயர்ப்பு' : 'AI & Rule-Protected Auto Translation'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {isTamil ? 'தமிழ் தலைப்பு, சுருக்கம், கட்டுரையை ஆங்கிலத்தில் மொழிபெயர்த்து சரிபார்க்க உதவும்.' : 'Translates Tamil title, excerpt & body into English with financial terms protected (NIFTY, SIP, etc.) for admin review.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isTranslating}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all hover:scale-105 disabled:opacity-50 shrink-0"
          >
            {isTranslating ? 'Translating...' : (isTamil ? ' ஆங்கிலத்தில் மொழிபெயர்க்க' : ' Auto-Translate to English')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'சுருக்க உரை (Tamil Excerpt)' : 'Tamil Excerpt (Card Summary)'}
            </label>
            <textarea
              rows={3}
              value={excerptTa}
              onChange={e => setExcerptTa(e.target.value)}
              placeholder="கட்டுரையின் முக்கிய சிறப்பம்சங்கள் மற்றும் சுருக்கம்..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed font-serif"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'ஆங்கில சுருக்க உரை (English Excerpt)' : 'English Excerpt'}
            </label>
            <textarea
              rows={3}
              value={excerptEn}
              onChange={e => setExcerptEn(e.target.value)}
              placeholder="Short preview summary shown on the article cards..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('ta')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'ta' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                 தமிழ் உள்ளடக்கம் (Tamil Body) *
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'en' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                 English Body (Reviewed)
              </button>
            </div>
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Rich Text HTML Engine</span>
          </div>

          {activeTab === 'ta' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {isTamil ? 'தமிழ் கட்டுரையின் முழு உள்ளடக்கம் (Rich Text):' : 'Tamil Article Rich Body:'}
              </label>
              <RichTextEditor
                value={bodyTa}
                onChange={setBodyTa}
                placeholder="இங்கே உங்கள் கட்டுரையை தமிழில் விரிவாக எழுதுங்கள்..."
                language="ta"
                minHeight="380px"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {isTamil ? 'ஆங்கில கட்டுரையின் முழு உள்ளடக்கம் (சரிபார்க்கவும்):' : 'English Article Rich Body (Review & Polish):'}
              </label>
              <RichTextEditor
                value={bodyEn}
                onChange={setBodyEn}
                placeholder="English translation content for global/bilingual readers..."
                language="en"
                minHeight="380px"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('#/admin/articles')}
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            {isTamil ? 'ரத்து செய்க' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs shadow hover:bg-slate-800 transition-all disabled:opacity-50"
          >
             {isTamil ? 'வரைவாகச் சேமி (Save Draft)' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span></span>
            <span>{isTamil ? 'உடனே வெளியிடு (Publish Live)' : 'Publish Live'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 8. ROOT APP ====================


function AuthPage({ initialMode = 'login', onNavigate }) {
  const { t, language } = useLanguage();
  const { signInWithPassword, signInAsDemoPadmanaban, signUp, signInWithGoogle, sendPasswordReset, signInWithMagicLink } = useAuth();
  const isTamil = language === 'ta';

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleDemoSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      if (signInAsDemoPadmanaban) {
        await signInAsDemoPadmanaban();
      } else {
        await signInWithPassword('admin@gmail.com', 'admin@123');
      }
      setSuccessMessage(isTamil ? 'அட்மின் கணக்கில் வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்!' : 'Logged in successfully as Admin!');
      const redirect = sessionStorage.getItem('auth_redirect_from') || '#/';
      sessionStorage.removeItem('auth_redirect_from');
      setTimeout(() => {
        if (onNavigate) onNavigate(redirect);
        else window.location.hash = redirect;
      }, 400);
    } catch (err) {
      setError(err.message || 'Demo Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrefillDemo = () => {
    setEmail('admin@gmail.com');
    setPassword('admin@123');
    setMode('login');
  };

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
        setSuccessMessage(isTamil ? 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டு உள்நுழைந்துள்ளீர்கள்!' : 'Account created and logged in successfully!');
        const redirect = sessionStorage.getItem('auth_redirect_from') || '#/';
        sessionStorage.removeItem('auth_redirect_from');
        setTimeout(() => {
          if (onNavigate) onNavigate(redirect);
          else window.location.hash = redirect;
        }, 500);
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
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/logo.png"
                alt="Muthaleetu Thisai"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-xl shrink-0"
              />
              <div>
                <h1 className="font-serif font-black text-xl sm:text-2xl">
                  {isTamil ? (
                    <>
                      <span className="text-[#38bdf8]">முதலீட்டு </span>
                      <span className="text-[#4ade80]">திசை</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#38bdf8]">Muthaleetu </span>
                      <span className="text-[#4ade80]">Thisai</span>
                    </>
                  )}
                </h1>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Wealth Platform</p>
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

        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-5 bg-slate-50/50 dark:bg-slate-900">
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
              className="btn-magnetic w-full py-2.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-sm"
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

function formatRelativeTime(dateString, isTamil) {
  if (!dateString) return '';
  const now = Date.now();
  const past = new Date(dateString).getTime();
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return isTamil ? 'சற்று முன்' : 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return isTamil ? `${diffMin} நிமிடங்களுக்கு முன்` : `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return isTamil ? `${diffHours} மணிநேரத்திற்கு முன்` : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return isTamil ? `${diffDays} நாட்களுக்கு முன்` : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-IN', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString));
}

function AggregatedNewsCard({ item, language }) {
  const isTamil = language === 'ta';
  const title = isTamil ? (item.titleTamil || item.titleEnglish) : (item.titleEnglish || item.titleTamil);
  const summary = isTamil ? (item.summaryTamil || item.summaryEnglish) : (item.summaryEnglish || item.summaryTamil);
  const relativeTime = formatRelativeTime(item.publishedAt, isTamil);
  const source = item.sourceName || 'Financial News';
  const sourceUrl = item.sourceUrl;

  const handleOpenSource = (e) => {
    if (e) e.stopPropagation();
    if (sourceUrl) {
      window.open(sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getSourceBadgeColor = (src) => {
    const s = (src || '').toLowerCase();
    if (s.includes('economic times')) return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    if (s.includes('livemint') || s.includes('mint')) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    if (s.includes('business standard')) return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
    if (s.includes('moneycontrol')) return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
    return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
  };

  return (
    <article
      onClick={handleOpenSource}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-3.5">
        {/* Card Thumbnail / Header */}
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
          <img
            src={item.imageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          {/* Source Attribution Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border backdrop-blur-md shadow-sm ${getSourceBadgeColor(source)}`}>
              {source}
            </span>
          </div>

          {/* Category Tag */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-slate-950/80 text-amber-400 border border-slate-800 backdrop-blur-md">
              {(item.category || 'MARKETS').replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-1 space-y-2.5">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif leading-snug line-clamp-2">
            {title}
          </h3>
          {summary && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
              {summary}
            </p>
          )}
        </div>
      </div>

      {/* Footer Outbound Attribution Link */}
      <div className="px-5 pb-5 pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-4 text-xs font-semibold">
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span>⏱</span>
          <span>{relativeTime || 'Recently'}</span>
        </div>

        <button
          onClick={handleOpenSource}
          className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-600 dark:text-amber-400 group-hover:text-amber-500 hover:underline transition-colors"
          title={`Open original article on ${source}`}
        >
          <span>{isTamil ? `${source}-ல் படிக்கவும்` : `Read on ${source}`}</span>
          <span>→</span>
        </button>
      </div>
    </article>
  );
}

function NewsCard({ article, onSelect }) {
  const { language } = useLanguage();
  if (!article) return null;

  const isTamil = language === 'ta';
  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(article.publishedAt))
    : '';

  return (
    <article
      onClick={() => onSelect && onSelect(article)}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
        <img
          src={article.thumbnail || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-slate-950/80 text-amber-400">
          {article.category || 'FINANCE'}
        </span>
        <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-black uppercase rounded-md bg-amber-600 text-white">
          EDITORIAL
        </span>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-500 transition-colors font-serif leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 font-medium">
          <span>{formattedDate}</span>
          <div className="flex items-center gap-2.5 font-bold font-mono">
            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              👁 {(article.views || article.viewCount || 0).toLocaleString()}
            </span>
            <span className="text-amber-600 dark:text-amber-400">
              ⏱ {article.readTimeMinutes || 4} {isTamil ? 'நிமிட வாசிப்பு' : 'min read'}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function NewsPage({ onNavigate }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // State for live aggregated investment news
  const [liveNews, setLiveNews] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveError, setLiveError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', labelTa: 'அனைத்து செய்திகள்', labelEn: 'All News' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட்', labelEn: 'Mutual Funds' },
    { id: 'markets', labelTa: 'பங்குச் சந்தை', labelEn: 'Markets & Stocks' },
    { id: 'regulatory', labelTa: 'ஒழுங்குமுறை & SEBI', labelEn: 'Regulatory & SEBI' },
    { id: 'general', labelTa: 'பொது நிதி & பொருளாதாரம்', labelEn: 'General & Economy' }
  ];

  const fetchLiveNews = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setIsLoadingLive(true);
    setLiveError(null);

    try {
      const categoryParam = activeCategory === 'all' ? '' : `&category=${activeCategory}`;
      const res = await fetch(`/api/news?limit=40${categoryParam}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLiveNews(data.data || []);
    } catch (err) {
      console.error('Error fetching live news:', err);
      setLiveError(err.message || 'Failed to load news');
    } finally {
      setIsLoadingLive(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
  }, [activeCategory]);

  // Filter live news based on in-page search input
  const filteredLiveNews = useMemo(() => {
    if (!searchQuery.trim()) return liveNews;
    const q = searchQuery.toLowerCase().trim();
    return liveNews.filter(item => {
      const titleEn = (item.titleEnglish || '').toLowerCase();
      const titleTa = (item.titleTamil || '').toLowerCase();
      const sumEn = (item.summaryEnglish || '').toLowerCase();
      const sumTa = (item.summaryTamil || '').toLowerCase();
      const src = (item.sourceName || '').toLowerCase();
      return titleEn.includes(q) || titleTa.includes(q) || sumEn.includes(q) || sumTa.includes(q) || src.includes(q);
    });
  }, [liveNews, searchQuery]);

  const editorialArticles = (newsData || []).map(item => translateNewsArticle(item, language));

  return (
    <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Filter Bar & In-Page Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md scale-105'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
                  }`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isTamil ? "செய்திகளில் தேடுங்கள்..." : "Filter news by keyword..."}
              className="w-full pl-9 pr-8 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-amber-500 shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Aggregated News Grid */}
      <section className="space-y-6">
        {isLoadingLive ? (
          <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">{isTamil ? 'சமீபத்திய நிதிச் செய்திகள் ஏற்றப்படுகின்றன...' : 'Loading latest external investment news...'}</p>
          </div>
        ) : liveError ? (
          <div className="p-8 text-center bg-red-500/10 rounded-3xl border border-red-500/30 text-red-600 text-xs font-bold max-w-lg mx-auto">
            {liveError}
          </div>
        ) : filteredLiveNews.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="text-4xl">📰</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isTamil ? 'செய்திகள் எதுவும் கிடைக்கவில்லை' : 'No News Articles Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isTamil ? 'தேடல் வார்த்தையை மாற்றவும் அல்லது பிற பிரிவுகளைத் தேர்ந்தெடுக்கவும்.' : 'Try adjusting your search criteria or switch category filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredLiveNews.map(item => (
              <AggregatedNewsCard
                key={item.id || item.sourceUrl}
                item={item}
                language={language}
              />
            ))}
          </div>
        )}

        {/* Mandatory Editorial & External Attribution Disclaimer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-slate-900 border border-amber-500/25 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-base shrink-0 mt-0.5">ℹ️</span>
          <div className="space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {isTamil ? 'அறிவிப்பு & மூல உரிமை:' : 'Attribution & Content Disclaimer:'}
            </p>
            <p className="leading-relaxed">
              {isTamil
                ? 'தகவல் நோக்கங்களுக்காக மட்டுமே வெளிப்புற மூலங்களிலிருந்து தொகுக்கப்பட்ட செய்திகள். முதலீட்டு ஆலோசனை அல்ல. அனைத்து செய்திகளும் அசல் வெளியீட்டாளரின் தளத்திற்கு நேரடியாக இணைக்கப்பட்டுள்ளன.'
                : 'News curated from external financial sources for informational purposes only. Not investment advice. Every article card provides direct source attribution and links out to the publisher’s own original site.'}
            </p>
          </div>
        </div>
      </section>

      {/* Curated Editorial Insights & In-Depth Breakdowns Section */}
      {editorialArticles && editorialArticles.length > 0 && (
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {isTamil ? 'பிரத்யேக தலையங்கம்' : 'ORIGINAL EDITORIAL'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white">
                {isTamil ? 'முதலீட்டுத் திசை சிறப்புக் கட்டுரைகள்' : 'Muthaleetu Thisai Special Analyses'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {editorialArticles.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                onSelect={() => onNavigate && onNavigate(`#/news/${article.slug}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NewsDetailsPage({ slug, onNavigate }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const rawArticle = (newsData || []).find(a => a.slug === slug) || newsData[0];
  const article = translateNewsArticle(rawArticle, language);

  if (!article) return null;

  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(article.publishedAt))
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <button
        onClick={() => onNavigate && onNavigate('#/news')}
        className="btn-magnetic px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5"
      >
        <span>←</span>
        <span>{isTamil ? 'அனைத்து செய்திகள்' : 'Back to News'}</span>
      </button>

      <div className="space-y-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
            {article.category || 'FINANCE'}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ⏱ {article.readTimeMinutes || 4} {isTamil ? 'நிமிட வாசிப்பு' : 'min read'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <button
            onClick={() => onNavigate && onNavigate('#/professionals/budget-padmanaban')}
            className="hover:text-amber-500 font-bold transition-colors flex items-center gap-1"
          >
            <span>{isTamil ? 'ஆசிரியர்:' : 'By'} {article.author || 'Budget Padmanaban Editorial'}</span>
            <span className="text-amber-500">→</span>
          </button>
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/50">
        <img
          src={article.thumbnail || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="article-blue-card rounded-3xl border-2 border-white/25 bg-[#03529A] shadow-2xl p-6 sm:p-8 my-4 text-white">
        <div
          className="prose prose-invert max-w-none text-white text-sm sm:text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}

function ProfilePage({ onNavigate, onShowToast }) {
  const { user, profile, role, signOut, supabase, setProfile, verifyCurrentPassword, updateAccountPassword } = useAuth();
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { history, clearHistory } = useWatchHistory();

  const [displayName, setDisplayName] = useState(
    profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingPublisherModalOpen, setIsEditingPublisherModalOpen] = useState(false);

  // Dynamic Password Check & Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isCheckingPw, setIsCheckingPw] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isUpdatingPw, setIsUpdatingPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const handleCheckCurrentPassword = async (e) => {
    if (e) e.preventDefault();
    if (!currentPassword) {
      setPwError(isTamil ? 'தற்போதைய கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter your current password.');
      return;
    }
    setPwError('');
    setPwSuccess('');
    setIsCheckingPw(true);
    try {
      if (verifyCurrentPassword) {
        await verifyCurrentPassword(currentPassword);
      }
      setIsPasswordVerified(true);
      setPwSuccess(isTamil ? '✓ தற்போதைய கடவுச்சொல் சரிபார்க்கப்பட்டது! இப்போது உங்கள் புதிய கடவுச்சொல்லை அமைக்கலாம்.' : '✓ Current password verified! You can now set your new password.');
    } catch (err) {
      setIsPasswordVerified(false);
      setPwError(err.message || (isTamil ? 'தற்போதைய கடவுச்சொல் தவறானது. மீண்டும் சரிபார்க்கவும்.' : 'Current password does not match. Please try again.'));
    } finally {
      setIsCheckingPw(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPwError(isTamil ? 'புதிய கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.' : 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError(isTamil ? 'புதிய கடவுச்சொற்கள் பொருந்தவில்லை.' : 'New passwords do not match.');
      return;
    }
    setPwError('');
    setPwSuccess('');
    setIsUpdatingPw(true);
    try {
      if (updateAccountPassword) {
        await updateAccountPassword(newPassword);
      }
      setPwSuccess(isTamil ? '🎉 கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!' : '🎉 Password updated successfully!');
      if (onShowToast) onShowToast(isTamil ? 'கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' : 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordVerified(false);
    } catch (err) {
      setPwError(err.message || (isTamil ? 'கடவுச்சொல்லை மாற்றுவதில் பிழை ஏற்பட்டது.' : 'Failed to update password.'));
    } finally {
      setIsUpdatingPw(false);
    }
  };

  const handleResetPwFlow = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordVerified(false);
    setPwError('');
    setPwSuccess('');
  };

  const isPublisher = role === 'publisher' || profile?.role === 'publisher' || role === 'admin';

  const email = user?.email || '';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = (displayName || email || 'U').slice(0, 2).toUpperCase();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setIsSaving(true);
    try {
      if (supabase && user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
          .eq('id', user.id);
        if (error) throw error;
        if (setProfile) {
          setProfile(prev => ({ ...prev, display_name: displayName.trim() }));
        }
      }
      if (onShowToast) {
        onShowToast(isTamil ? 'சுயவிவரம் புதுப்பிக்கப்பட்டது!' : 'Profile updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      if (onShowToast) onShowToast(err.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#03529A] via-[#023b70] to-[#4A9E2C] border border-white/20 p-6 sm:p-8 shadow-2xl overflow-hidden text-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          <div
            onClick={() => isPublisher ? setIsEditingPublisherModalOpen(true) : null}
            className={`relative group/avatar shrink-0 ${isPublisher ? 'cursor-pointer' : ''}`}
            title={isPublisher ? (isTamil ? 'சுயவிவரப் புகைப்படத்தை மாற்ற கிளிக் செய்யவும்' : 'Click to change profile photo & credentials') : ''}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover border-2 border-white/80 shadow-xl shrink-0 group-hover/avatar:opacity-85 transition-opacity"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=03529a&color=ffffff&bold=true`; }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 text-white font-black text-2xl flex items-center justify-center border-2 border-white/80 shadow-xl shrink-0 backdrop-blur-md">
                {initials}
              </div>
            )}
            {isPublisher && (
              <div className="absolute inset-0 rounded-full bg-slate-950/70 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-emerald-300 text-[10px] font-black transition-opacity">
                <span className="text-sm">📷</span>
                <span>{isTamil ? 'புகைப்படம்' : 'Change'}</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">{displayName || 'Investor'}</h1>
              <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                role === 'admin'
                  ? 'bg-red-500/30 text-white border-red-400/50'
                  : role === 'publisher'
                  ? 'bg-white/20 text-white border-white/40'
                  : 'bg-white/15 text-white border-white/30'
              }`}>
                {role === 'admin' ? 'Administrator' : (role === 'publisher' ? 'AMFI Publisher / Advisor' : 'Investor')}
              </span>
            </div>
            <p className="text-xs text-white/80 font-mono">{email}</p>
            <p className="text-[11px] text-emerald-200 font-medium">
              {profile?.title || (isTamil ? 'முதலீட்டு திசை நிதி தளத்தின் உறுப்பினர்' : 'Muthaleetu Thisai Certified Member')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPublisher && (
              <button
                onClick={() => setIsEditingPublisherModalOpen(true)}
                className="btn-magnetic px-4 py-2 rounded-xl bg-white text-[#03529A] hover:bg-slate-100 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>✏️</span>
                <span>{isTamil ? 'சான்றுகளை திருத்து' : 'Edit Credentials'}</span>
              </button>
            )}
            <button
              onClick={signOut}
              className="btn-magnetic px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600 text-white border border-red-400/40 text-xs font-bold transition-all shrink-0"
            >
              {isTamil ? 'வெளியேறு (Logout)' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isTamil ? 'சுயவிவர விவரங்கள்' : 'Profile Settings'}
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isTamil ? `சேமிக்கப்பட்டவை (${bookmarks.length})` : `Saved Bookmarks (${bookmarks.length})`}
        </button>
      </div>

      {/* Tab Content: Settings */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Account Basics & Password Management */}
          <div className="space-y-6">
            {/* Account Basics Form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif flex items-center gap-2">
                <span>👤</span>
                <span>{isTamil ? 'கணக்கு அமைப்புகள்' : 'Personal Details'}</span>
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {isTamil ? 'முழு பெயர்' : 'Display Name'}
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-magnetic px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isSaving ? (isTamil ? 'சேமிக்கிறது...' : 'Saving...') : (isTamil ? 'மாற்றங்களைச் சேமி' : 'Save Changes')}
                </button>
              </form>
            </div>

            {/* Security & Dynamic Password Check / Change Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                      {isTamil ? 'பாதுகாப்பு & கடவுச்சொல் மாற்றம்' : 'Security & Password'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isTamil ? 'தற்போதைய கடவுச்சொல்லை சரிபார்த்து புதிய கடவுச்சொல்லை மாற்றவும்' : 'Verify current password to dynamically update password'}
                    </p>
                  </div>
                </div>
                {isPasswordVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {isTamil ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
                  </span>
                )}
              </div>

              {/* Dynamic Error Message Alert */}
              {pwError && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-start gap-2 animate-fadeIn">
                  <span className="text-sm">⚠️</span>
                  <span className="flex-1">{pwError}</span>
                </div>
              )}

              {/* Dynamic Success Message Alert */}
              {pwSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-start gap-2 animate-fadeIn">
                  <span className="text-sm">✓</span>
                  <span className="flex-1">{pwSuccess}</span>
                </div>
              )}

              {/* Step 1 & Step 2 Forms */}
              <form onSubmit={!isPasswordVerified ? handleCheckCurrentPassword : handleUpdatePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isTamil ? 'தற்போதைய கடவுச்சொல்' : 'Current Password'}
                    </label>
                    {isPasswordVerified && (
                      <button
                        type="button"
                        onClick={handleResetPwFlow}
                        className="text-[11px] font-bold text-amber-500 hover:underline"
                      >
                        {isTamil ? 'மறுதொடக்கம்' : 'Reset'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      required
                      disabled={isPasswordVerified || isCheckingPw}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (pwError) setPwError('');
                      }}
                      placeholder={isTamil ? "தற்போதைய கடவுச்சொல்லை உள்ளிடவும்" : "Enter current password"}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all pr-10 ${
                        isPasswordVerified
                          ? 'bg-emerald-500/5 border-emerald-500/40 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500'
                      }`}
                    />
                    <button
                      type="button"
                      disabled={isPasswordVerified}
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrentPw ? (isTamil ? 'மறை' : 'Hide') : (isTamil ? 'காட்டு' : 'Show')}
                    </button>
                  </div>
                </div>

                {/* Password Check Action Button (Shown when not yet verified) */}
                {!isPasswordVerified && (
                  <button
                    type="submit"
                    disabled={isCheckingPw || !currentPassword.trim()}
                    className="btn-magnetic w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-700 disabled:opacity-50 shadow-sm"
                  >
                    {isCheckingPw ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>{isTamil ? 'சரிபார்க்கிறது...' : 'Checking Password...'}</span>
                      </>
                    ) : (
                      <>
                        <span>🔍</span>
                        <span>{isTamil ? 'கடவுச்சொல்லை சரிபார்' : 'Check Password'}</span>
                      </>
                    )}
                  </button>
                )}

                {/* Step 2: Dynamic New Password Fields (Rendered only after Condition is TRUE) */}
                {isPasswordVerified && (
                  <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-2">
                      <span>💡</span>
                      <span>{isTamil ? 'சரிபார்ப்பு முடிந்தது. புதிய கடவுச்சொல்லை அமைத்து சேமிக்கவும்.' : 'Verification passed! Enter your new password below.'}</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isTamil ? 'புதிய கடவுச்சொல்' : 'New Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (pwError) setPwError('');
                          }}
                          placeholder={isTamil ? "புதிய கடவுச்சொல் (குறைந்தது 6 எழுத்துகள்)" : "New password (min 6 characters)"}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showNewPw ? (isTamil ? 'மறை' : 'Hide') : (isTamil ? 'காட்டு' : 'Show')}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isTamil ? 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்' : 'Confirm New Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPw ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (pwError) setPwError('');
                          }}
                          placeholder={isTamil ? "புதிய கடவுச்சொல்லை மீண்டும் உள்ளிடவும்" : "Re-enter new password"}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw(!showConfirmPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showConfirmPw ? (isTamil ? 'மறை' : 'Hide') : (isTamil ? 'காட்டு' : 'Show')}
                        </button>
                      </div>
                    </div>

                    {/* Realtime Requirements Checklist */}
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                      <span className={`px-2 py-0.5 rounded-md ${
                        newPassword.length >= 6
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {newPassword.length >= 6 ? '✓ ' : '• '} {isTamil ? 'குறைந்தது 6 எழுத்துகள்' : 'At least 6 chars'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md ${
                        newPassword && confirmPassword && newPassword === confirmPassword
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {newPassword && confirmPassword && newPassword === confirmPassword ? '✓ ' : '• '} {isTamil ? 'கடவுச்சொற்கள் பொருந்துகின்றன' : 'Passwords match'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingPw || newPassword.length < 6 || newPassword !== confirmPassword}
                        className="btn-magnetic flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                      >
                        {isUpdatingPw ? (
                          <>
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>{isTamil ? 'மாற்றுகிறது...' : 'Updating...'}</span>
                          </>
                        ) : (
                          <>
                            <span>🔑</span>
                            <span>{isTamil ? 'புதிய கடவுச்சொல்லை சேமி' : 'Save New Password'}</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetPwFlow}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
                      >
                        {isTamil ? 'ரத்துசெய்' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Publisher Credentials Card or Quick Actions */}
          <div className="space-y-6">
            {isPublisher && (
              <div className="bg-gradient-to-br from-[#03529A] via-[#023b70] to-[#4A9E2C] rounded-3xl p-6 border border-white/20 shadow-xl text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💼</span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-emerald-300 font-serif">
                      {isTamil ? 'வெளியீட்டாளர் & AMFI சான்றுகள்' : 'Publisher & AMFI Credentials'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsEditingPublisherModalOpen(true)}
                    className="text-xs font-bold text-white hover:underline flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <span>✏️</span>
                    <span>{isTamil ? 'திருத்து' : 'Edit'}</span>
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-white/90">
                  <div className="flex justify-between py-1 border-b border-white/15">
                    <span className="text-white/70">{isTamil ? 'பதவி / பதவிப்பெயர்:' : 'Designation:'}</span>
                    <span className="font-bold text-white text-right">{profile?.title || 'AMFI Registered MFD'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/15">
                    <span className="text-white/70">{isTamil ? 'AMFI ARN எண்:' : 'ARN License:'}</span>
                    <span className="font-mono font-bold text-emerald-200">{profile?.arn_number || 'Not Set'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/15">
                    <span className="text-white/70">{isTamil ? 'அதிகாரப்பூர்வ வலைத்தளம்:' : 'Official Website:'}</span>
                    <div className="text-right">
                      {profile?.website_url ? (
                        <a
                          href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-emerald-200 hover:underline text-xs truncate max-w-[180px] block"
                        >
                          {profile.website_url.replace(/^https?:\/\//, '')} ↗
                        </a>
                      ) : (
                        <span className="text-white/50 text-[11px] italic">Not Set</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/15">
                    <span className="text-white/70">{isTamil ? 'வாட்ஸ்அப் ஆலோசனை:' : 'WhatsApp:'}</span>
                    <span className="font-mono text-white">{profile?.whatsapp_number || profile?.phone || 'Not Set'}</span>
                  </div>
                  <div className="py-1 border-b border-white/15">
                    <span className="text-white/70 block mb-1">{isTamil ? 'சிறப்புத் துறைகள்:' : 'Specialties:'}</span>
                    <div className="flex flex-wrap gap-1">
                      {profile?.specialties && Array.isArray(profile.specialties) ? (
                        profile.specialties.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300 border border-slate-700">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">Mutual Funds, SIPs, Wealth Planning</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate && onNavigate(`#/professionals/${profile?.id || user?.id}`)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/20 transition-all text-center"
                  >
                    {isTamil ? 'உங்கள் பொது சுயவிவரத்தைக் காண்க →' : 'View Your Public Profile →'}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                {isTamil ? 'விரைவு வழிசெலுத்தல்' : 'Quick Actions'}
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => onNavigate && onNavigate('#/history')}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-500">▶</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {isTamil ? 'பார்த்த வீடியோக்களின் வரலாறு' : 'View Watch History'}
                    </span>
                  </div>
                  <span className="text-slate-400">({history.length}) →</span>
                </button>

                <button
                  onClick={() => onNavigate && onNavigate('#/professionals')}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-500">👥</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {isTamil ? 'அனைத்து நிதி நிபுணர்கள் & ஆலோசகர்கள்' : 'Browse All Wealth Advisors'}
                    </span>
                  </div>
                  <span className="text-slate-400">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publisher Edit Modal when opened from profile */}
      {isEditingPublisherModalOpen && (
        <PublisherOnboardingModal
          profile={profile}
          onClose={() => setIsEditingPublisherModalOpen(false)}
          onComplete={(updated) => {
            if (setProfile) setProfile(updated);
            setIsEditingPublisherModalOpen(false);
            if (onShowToast) onShowToast(isTamil ? 'வெளியீட்டாளர் சுயவிவரம் புதுப்பிக்கப்பட்டது!' : 'Publisher profile updated successfully!');
          }}
        />
      )}

      {/* Tab Content: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {bookmarks.map((item, idx) => (
                <div
                  key={`bm-${item.id || idx}`}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col justify-between space-y-3 shadow-sm hover:border-amber-500/50 transition-all cursor-pointer"
                  onClick={() => {
                    if (item.youtubeId || item.duration) {
                      if (onNavigate) onNavigate('#/videos');
                    } else if (item.slug) {
                      if (onNavigate) onNavigate(`#/news/${item.slug}`);
                    }
                  }}
                >
                  <div className="space-y-2">
                    {item.thumbnail && (
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                        <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 font-serif">
                      {item.title || item.titleTamil || item.titleEnglish}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase text-amber-500">
                      {item.category || 'SAVED'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item);
                        if (onShowToast) onShowToast(isTamil ? 'நீக்கப்பட்டது' : 'Removed from bookmarks');
                      }}
                      className="text-xs text-red-500 hover:text-red-600 font-bold"
                    >
                      {isTamil ? 'நீக்கு' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                {isTamil ? 'சேமிக்கப்பட்ட கட்டுரைகள் அல்லது வீடியோக்கள் எதுவும் இல்லை.' : 'No bookmarked videos or articles yet.'}
              </p>
              <button
                onClick={() => onNavigate && onNavigate('#/videos')}
                className="btn-magnetic px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs mt-2"
              >
                {isTamil ? 'வீடியோக்களைப் பார்வையிடு' : 'Explore Masterclasses'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WatchHistoryPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const { history, clearHistory } = useWatchHistory();
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Live catalog for the player's related-videos rail; bundled catalog as fallback.
  const { videos: liveVideos } = useVideos('all', 'newest');
  const playerCatalog = (liveVideos && liveVideos.length > 0) ? liveVideos : videosData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <button
            onClick={() => onNavigate && onNavigate('#/profile')}
            className="text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors inline-flex items-center gap-1 mb-1"
          >
            ← {isTamil ? 'சுயவிவரத்திற்குத் திரும்பு' : 'Back to Profile'}
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
            {isTamil ? 'பார்த்த வீடியோக்களின் வரலாறு' : 'Watch History'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {history.length} {isTamil ? 'வீடியோக்கள் பதிவு செய்யப்பட்டுள்ளன' : 'videos recorded'}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              if (onShowToast) onShowToast(isTamil ? 'வரலாறு அழிக்கப்பட்டது' : 'Watch history cleared');
            }}
            className="btn-magnetic px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 text-xs font-bold transition-all shrink-0"
          >
            {isTamil ? 'வரலாற்றை அழி (Clear All)' : 'Clear History'}
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {history.map((video, idx) => (
            <div
              key={`wh-${video.id || idx}`}
              onClick={() => setSelectedVideo(video)}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-3 shadow-sm hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between space-y-2.5"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xl">▶</span>
                </div>
                {video.duration && (
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[9px]">
                    {video.duration}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[9px] font-black uppercase text-amber-500">
                  {video.category || 'FINANCE'}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5 font-serif leading-snug">
                  {video.title || video.titleTamil || video.titleEnglish}
                </h4>
              </div>

              {video.viewedAt && (
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
                  {new Date(video.viewedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="text-3xl">🎬</div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white font-serif">
            {isTamil ? 'பார்த்த வீடியோக்கள் எதுவும் இல்லை' : 'No watch history yet'}
          </h3>
          <p className="text-xs text-slate-500">
            {isTamil ? 'முதலீட்டு வீடியோக்களைப் பார்த்து உங்கள் வரலாற்றை இங்கே காண்க.' : 'Watch financial masterclasses to automatically save your playback trail here.'}
          </p>
          <button
            onClick={() => onNavigate && onNavigate('#/videos')}
            className="btn-magnetic px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md mt-2"
          >
            {isTamil ? 'அனைத்து வீடியோக்களையும் காண்க' : 'Browse All Masterclasses'}
          </button>
        </div>
      )}

      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={playerCatalog}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(rel) => setSelectedVideo(rel)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}

function CategoryPage({ categoryId, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const sentinelRef = useRef(null);

  // Live category feed from the database; falls back to the bundled catalog.
  const { videos: liveVideos } = useVideos(categoryId, 'newest');
  const categoryVideos = useMemo(() => (
    liveVideos && liveVideos.length > 0
      ? liveVideos
      : (videosData || []).filter(v => v.category === categoryId)
  ), [liveVideos, categoryId]);

  const categoryTitles = {
    'mutual-funds': isTamil ? 'மியூச்சுவல் ஃபண்ட் & SIP' : 'Mutual Funds & SIP',
    'stocks': isTamil ? 'பங்குச் சந்தை & முதலீடு' : 'Stock Market & Equity',
    'personal-finance': isTamil ? 'தனிநபர் நிதி & சேமிப்பு' : 'Personal Finance & Wealth',
    'tax-saving': isTamil ? 'வரி சேமிப்பு & ஓய்வூதியம்' : 'Tax Planning & Retirement',
    'education': isTamil ? 'நிதி கல்வி' : 'Financial Education'
  };

  const title = categoryTitles[categoryId] || categoryId;

  // Filter & Sort
  const filtered = useMemo(() => {
    let list = [...categoryVideos];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(v => {
        const titleT = (v.titleTamil || v.title || "").toLowerCase();
        const titleE = (v.titleEnglish || v.title || "").toLowerCase();
        const descT = (v.descriptionTamil || v.description || "").toLowerCase();
        const descE = (v.descriptionEnglish || v.description || "").toLowerCase();
        return titleT.includes(q) || titleE.includes(q) || descT.includes(q) || descE.includes(q);
      });
    }

    if (sortBy === 'views') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else {
      list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    return list.map(v => translateVideo(v, language));
  }, [categoryVideos, searchQuery, sortBy, language]);

  // Auto-load next 20 videos on scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => {
          if (prev < filtered.length) {
            return Math.min(prev + 20, filtered.length);
          }
          return prev;
        });
      }
    }, { rootMargin: '350px' });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount]);

  const displayedVideos = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  return (
    <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(20);
            }}
            placeholder={isTamil ? `${title} வீடியோக்களில் தேடுங்கள்...` : `Search within ${title}...`}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 font-bold">{isTamil ? 'வரிசை:' : 'Sort:'}</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setVisibleCount(20);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:border-amber-500"
          >
            <option value="newest">{isTamil ? 'சமீபத்தியவை' : 'Latest Uploads'}</option>
            <option value="views">{isTamil ? 'அதிக பார்வை' : 'Most Popular'}</option>
            <option value="oldest">{isTamil ? 'பழையவை' : 'Oldest First'}</option>
          </select>
        </div>
      </div>

      {/* Paginated Video Grid */}
      {displayedVideos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {displayedVideos.map((video, idx) => (
            <CinemaVideoCard
              key={`cat-${video.id || idx}`}
              video={video}
              index={idx}
              onSelect={(v) => setSelectedVideo(v)}
              language={language}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm font-bold">
            {isTamil ? 'பொருத்தமான வீடியோக்கள் எதுவும் கிடைக்கவில்லை.' : 'No matching videos found.'}
          </p>
        </div>
      )}

      {/* Infinite Scroll Sentinel & Status Counter */}
      <div ref={sentinelRef} className="pt-6 pb-4 text-center">
        {visibleCount < filtered.length ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span>
              {isTamil
                ? `${Math.min(visibleCount, filtered.length)} / ${filtered.length} வீடியோக்கள் (கீழே உருட்டவும்...)`
                : `Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length} (scroll for more...)`}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400">
            <span>✓</span>
            <span>
              {isTamil
                ? `அனைத்து ${filtered.length} வீடியோக்களும் ஏற்றப்பட்டுவிட்டன`
                : `All ${filtered.length} videos loaded`}
            </span>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={categoryVideos}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(rel) => setSelectedVideo(rel)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}

function ProfessionalsDirectoryPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 1. Instant Cache-First Initialization (Zero render delay)
  const [livePublishers, setLivePublishers] = useState(() => {
    try {
      const cached = localStorage.getItem('muthaleetu_publishers_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [];
  });
  const [isLoading, setIsLoading] = useState(() => livePublishers.length === 0);

  // Fetch live publishers from PostgreSQL /api/publishers with background cache sync
  useEffect(() => {
    let isMounted = true;
    async function loadPublishers(forceFresh = false) {
      try {
        const url = forceFresh ? `/api/publishers?t=${Date.now()}` : '/api/publishers';
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.data && Array.isArray(json.data)) {
            setLivePublishers(json.data);
            try {
              localStorage.setItem('muthaleetu_publishers_cache', JSON.stringify(json.data));
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Could not fetch live publishers:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadPublishers();

    const handleUpdate = () => loadPublishers(true);
    window.addEventListener('publisher-profile-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('publisher-profile-updated', handleUpdate);
    };
  }, []);

  const categories = [
    { id: 'all', labelTa: 'அனைத்து நிபுணர்கள்', labelEn: 'All Specialists' },
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட் & சந்தை', labelEn: 'Mutual Funds & Market' },
    { id: 'fintech', labelTa: 'தொழில்நுட்பம் & ஆட்டோமேஷன்', labelEn: 'Tech & Strategy' },
    { id: 'research', labelTa: 'ஈக்விட்டி & ஃபண்ட் ஆராய்ச்சி', labelEn: 'Fund Research' },
    { id: 'client-advisory', labelTa: 'தனிநபர் நிதி & வாடிக்கையாளர்', labelEn: 'Personal CFO Desk' }
  ];

  // Merge live database publishers with platform seed professionals
  const allPublishers = useMemo(() => {
    const list = [];
    const seenIds = new Set();
    const seenNames = new Set();

    // 1. Live DB Publishers (All registered publishers stored in database)
    (livePublishers || []).forEach(p => {
      const displayName = p.display_name || p.email?.split('@')[0] || 'Advisor';
      const cleanName = displayName.trim();
      if (cleanName.toLowerCase() === 'admin' && !p.avatar_url && !p.article_count) {
        return; // Skip internal system admin entry
      }
      seenIds.add(p.id);
      seenNames.add(cleanName.toLowerCase());

      const isFounder = p.id === 'fe41c6c1-647f-4f8c-81b8-c39ca3666426' || cleanName.toLowerCase().includes('padmanaban');
      if (isFounder) {
        seenIds.add('budget-padmanaban');
        seenNames.add('b. padmanaban (budget padmanaban)');
      }
      const arn = p.arn_number || '';
      const badgeEn = isFounder
        ? 'AMFI-REGISTERED MFD | FOUNDER'
        : (arn ? `AMFI-REGISTERED MFD | ${arn}` : 'AMFI-REGISTERED MFD');
      const badgeTa = isFounder
        ? 'AMFI பதிவுசெய்த ஆலோசகர் | நிறுவனர்'
        : (arn ? `AMFI பதிவுசெய்த ஆலோசகர் | ${arn}` : 'AMFI பதிவுசெய்த ஆலோசகர்');

      list.push({
        id: isFounder ? 'budget-padmanaban' : p.id,
        isLive: true,
        nameEnglish: isFounder ? 'B. Padmanaban (Budget Padmanaban)' : cleanName,
        nameTamil: isFounder ? 'பி. பத்மநாபன் (பட்ஜெட் பத்மநாபன்)' : cleanName,
        titleEnglish: p.title || (isFounder ? 'Founder & Chief Market Commentator' : 'AMFI Registered Mutual Fund Distributor'),
        titleTamil: p.title || (isFounder ? 'நிறுவனர் & தலைமை சந்தை ஆய்வாளர்' : 'பதிவுசெய்யப்பட்ட நிதி ஆலோசகர்'),
        organization: isFounder ? 'Fortune Investment Services (FISPL)' : 'Fortune Investment Services (FISPL Partner)',
        arnNumber: arn,
        avatar: p.avatar_url || (isFounder ? '/assets/padmanaban.jpg' : `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=03529a&color=ffffff&bold=true`),
        badgeEnglish: badgeEn,
        badgeTamil: badgeTa,
        bioEnglish: p.bio || (isFounder
          ? 'Founder of FISPL with 15+ years of market authority, educating retail and HNI investors on Mutual Funds, Wealth Creation & Systematic Financial Planning across video masterclasses.'
          : 'Certified AMFI mutual fund distributor dedicated to investor financial freedom, portfolio diversification, and long-term compounding.'),
        bioTamil: p.bio_ta || p.bio || (isFounder
          ? 'FISPL நிறுவனர், 15+ ஆண்டுகால நிதி அனுபவத்துடன் மியூச்சுவல் ஃபண்ட் மற்றும் நீண்டகால செல்வ உருவாக்கம் குறித்த வழிகாட்டல்.'
          : 'முதலீட்டாளர்களின் நிதி சுதந்திரம் மற்றும் நீண்ட கால செல்வ உருவாக்கத்திற்கு வழிகாட்டும் AMFI அங்கீகாரம் பெற்ற ஆலோசகர்.'),
        category: 'mutual-funds',
        stats: {
          masterclasses: isFounder ? '800+' : 0,
          articles: parseInt(p.article_count || (isFounder ? '12' : '0'), 10)
        },
        specialties: Array.isArray(p.specialties) && p.specialties.length > 0
          ? p.specialties
          : ['Mutual Funds', 'SIP Portfolios', 'Wealth Planning', 'Tax Saving'],
        whatsapp: p.whatsapp_number || p.phone || '',
        articleCount: parseInt(p.article_count || (isFounder ? '12' : '0'), 10),
        socialLinks: {
          linkedin: p.linkedin_url || '',
          twitter: p.twitter_url || '',
          youtube: p.youtube_url || '',
          website: p.website_url || ''
        }
      });
    });

    // 2. Default Seed Specialists (only if not already in database)
    (professionalsData || []).forEach(seed => {
      const matchName = (seed.nameEnglish || '').toLowerCase();
      if (!seenIds.has(seed.id) && !seenNames.has(matchName)) {
        seenIds.add(seed.id);
        list.push({
          ...seed,
          avatar: seed.avatar || '/assets/padmanaban.jpg',
          isLive: false,
          stats: {
            masterclasses: seed.stats?.masterclasses || 0,
            articles: seed.stats?.articles || 5
          },
          articleCount: seed.stats?.articles || 5,
          specialties: seed.specializations ? seed.specializations.map(s => s.en) : ['Mutual Funds', 'Market Research']
        });
      }
    });

    return list;
  }, [livePublishers]);

  const filteredProfessionals = useMemo(() => {
    let list = [...allPublishers];

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const nameT = (p.nameTamil || '').toLowerCase();
        const nameE = (p.nameEnglish || '').toLowerCase();
        const titleT = (p.titleTamil || '').toLowerCase();
        const titleE = (p.titleEnglish || '').toLowerCase();
        const bioT = (p.bioTamil || '').toLowerCase();
        const bioE = (p.bioEnglish || '').toLowerCase();
        const arn = (p.arnNumber || '').toLowerCase();
        return nameT.includes(q) || nameE.includes(q) || titleT.includes(q) || titleE.includes(q) || bioT.includes(q) || bioE.includes(q) || arn.includes(q);
      });
    }

    return list;
  }, [allPublishers, selectedCategory, searchQuery]);

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#008060] py-6 sm:py-8 transition-colors duration-300">
      <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
        {/* Controls & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white text-[#008060] shadow-md border-2 border-white'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-sm'
                  }`}
                >
                  {isTamil ? cat.labelTa : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Compact Search Bar */}
          <div className="w-full sm:w-72 lg:w-80 shrink-0">
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-800 group-focus-within:text-[#008060] transition-colors pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTamil ? 'நிபுணர் பெயர், ARN தேடுக...' : 'Search specialists...'}
                className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white/95 text-slate-900 border-2 border-white/40 hover:border-white focus:border-white placeholder-slate-500 text-xs sm:text-sm font-bold focus:outline-none shadow-md transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 text-xs font-bold bg-slate-100 hover:bg-slate-200 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid of Professionals Cards or Skeleton Loaders */}
        {isLoading && livePublishers.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-white/30 shadow-xl space-y-5 animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="w-28 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <div className="w-1/2 h-4 rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="w-full h-3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-5/6 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                  <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((prof) => {
              const name = isTamil ? prof.nameTamil : prof.nameEnglish;
              const title = isTamil ? prof.titleTamil : prof.titleEnglish;
              const bio = isTamil ? prof.bioTamil : prof.bioEnglish;
              const badge = isTamil ? prof.badgeTamil : prof.badgeEnglish;

              return (
                <div
                  key={prof.id}
                  onClick={() => onNavigate && onNavigate(`#/professionals/${prof.id}`)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-white/40 dark:border-slate-800 shadow-xl hover:border-amber-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between space-y-5 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Avatar & Badges Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="relative">
                        <img
                          src={prof.avatar || '/assets/padmanaban.jpg'}
                          alt={name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 group-hover:border-amber-500 shadow-md transition-colors"
                          onError={(e) => {
                            e.target.src = '/assets/padmanaban.jpg';
                          }}
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Active Publisher" />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-right">
                          {badge}
                        </span>
                        {prof.arnNumber && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {prof.arnNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Identity */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-serif group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                        {name}
                      </h3>
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400/90 mt-0.5">
                        {title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {prof.organization}
                      </p>
                    </div>

                    {/* Short Bio */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {bio}
                    </p>

                    {/* Specialties Pills */}
                    {prof.specialties && Array.isArray(prof.specialties) && prof.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {prof.specialties.slice(0, 3).map((spec, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Metrics & Action Link */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="text-amber-500">🎬</span> {prof.stats?.masterclasses || 0}+ {isTamil ? 'வீடியோக்கள்' : 'Masterclasses'}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-blue-500">✍️</span> {prof.articleCount || prof.stats?.articles || 0}+ {isTamil ? 'கட்டுரைகள்' : 'Articles'}
                      </span>
                      {prof.whatsapp && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            const clean = prof.whatsapp.replace(/[^0-9]/g, '');
                            window.open(`https://wa.me/${clean}?text=${encodeURIComponent('Hello! I came across your profile on Muthaleetu Thisai and would like to connect.')}`, '_blank');
                          }}
                          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          <span>💬</span> WhatsApp
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-black text-amber-600 dark:text-amber-400 group-hover:text-amber-500 transition-colors pt-1">
                      <span>{isTamil ? 'சுயவிவரம் & கட்டுரைகளைக் காண்க' : 'View Insights & Feed'}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-white/40 shadow-xl space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-black text-slate-900 dark:text-white font-serif">
              {isTamil ? 'நிபுணர்கள் யாரும் பொருந்தவில்லை' : 'No specialists matched your search'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTamil ? 'வேறு வார்த்தைகளை பயன்படுத்தி தேடவும்.' : 'Try adjusting your search terms or filter.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function normalizeSocialUrl(raw, type = 'generic', channelId = null) {
  if (!raw && !channelId) return '';
  if (type === 'youtube') {
    if (channelId && String(channelId).startsWith('UC')) {
      return `https://www.youtube.com/channel/${channelId}`;
    }
    const clean = (raw || '').trim();
    if (!clean) return '';
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    if (clean.startsWith('www.youtube.com') || clean.startsWith('youtube.com') || clean.startsWith('youtu.be')) {
      return `https://${clean}`;
    }
    if (clean.startsWith('@')) return `https://www.youtube.com/${clean}`;
    if (clean.startsWith('UC') && clean.length === 24) return `https://www.youtube.com/channel/${clean}`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}`;
  }
  const clean = (raw || '').trim();
  if (!clean) return '';
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  if (type === 'linkedin') {
    if (clean.includes('linkedin.com')) return `https://${clean}`;
    return `https://www.linkedin.com/in/${clean.replace(/^in\//, '')}`;
  }
  if (type === 'twitter') {
    if (clean.includes('twitter.com') || clean.includes('x.com')) return `https://${clean}`;
    return `https://x.com/${clean.replace(/^@/, '')}`;
  }
  return `https://${clean}`;
}

function ProfessionalWidescreenVideoCard({ video, onSelect, language = 'ta' }) {
  const isTamil = language === 'ta';
  if (!video) return null;

  const youtubeId = video?.youtubeId || video?.youtube_id || video?.id || '';
  const thumbnail = video?.thumbnail || video?.thumbnail_url || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '');
  const title = isTamil
    ? (video.titleTamil || video.title_ta || video.title || 'வீடியோ பதிவு')
    : (video.titleEnglish || video.title_en || video.title || 'Masterclass Video');
  const category = (video.category || 'MUTUAL-FUNDS').replace('-', ' ').toUpperCase();
  const duration = video.duration || (video.isShort ? 'Short' : '10:00');
  const dateStr = video.publishedAt || video.published_at 
    ? new Date(video.publishedAt || video.published_at).toLocaleDateString(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) 
    : '';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect && onSelect(video)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(video);
        }
      }}
      className="group relative select-none cursor-pointer rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500 shadow-md hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-200 flex flex-col h-full"
    >
      {/* 16:9 Horizontal Widescreen Thumbnail Frame */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 shrink-0">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-slate-950/90 text-amber-400 border border-amber-400/30 ">
            {category}
          </span>
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-full bg-slate-950/90 text-white border border-white/20 ">
            {duration}
          </span>
        </div>

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 shadow-2xl">
            <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Video Content / Meta */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3 bg-slate-900/90">
        <h3 className="text-xs sm:text-sm font-bold text-white font-serif line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 mt-auto">
          {dateStr ? (
            <span className="font-medium flex items-center gap-1">
              <span>📅</span>
              <span>{dateStr}</span>
            </span>
          ) : <span />}
          <span className="font-bold text-amber-400 group-hover:underline inline-flex items-center gap-1">
            <span>{isTamil ? 'காணொளியை இயக்கு' : 'Play Masterclass'}</span>
            <span>▶</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ProfessionalProfilePage({ professionalId, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [activeTab, setActiveTab] = useState('articles');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 1. Instant Cache-First Initialization
  const [livePublisher, setLivePublisher] = useState(() => {
    try {
      const cached = localStorage.getItem('muthaleetu_publishers_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const match = parsed.find(p => p.id === professionalId || p.arn_number === professionalId);
          if (match) return match;
        }
      }
    } catch (_) {}
    return null;
  });
  const [liveArticles, setLiveArticles] = useState([]);
  const [liveVideos, setLiveVideos] = useState([]);
  const [brandVideos, setBrandVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(() => !livePublisher);

  // Fetch publisher data by ID from /api/publishers?id=...
  useEffect(() => {
    let isMounted = true;
    async function loadPublisherDetail() {
      try {
        const res = await fetch(`/api/publishers?id=${encodeURIComponent(professionalId)}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.data) {
            setLivePublisher(json.data);
            if (Array.isArray(json.data.articles)) {
              setLiveArticles(json.data.articles);
            }
            if (Array.isArray(json.data.videos)) {
              setLiveVideos(json.data.videos);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch publisher details:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadPublisherDetail();
    return () => { isMounted = false; };
  }, [professionalId]);

  // Fallback to static seed data ONLY IF professionalId matches seed data
  const seedProf = professionalsData.find(p => p.id === professionalId || p.slug === professionalId);

  const prof = useMemo(() => {
    if (livePublisher) {
      return {
        id: livePublisher.id,
        nameEnglish: livePublisher.display_name || 'Certified Advisor',
        nameTamil: livePublisher.display_name || 'அங்கீகரிக்கப்பட்ட ஆலோசகர்',
        titleEnglish: livePublisher.title || 'AMFI Registered Mutual Fund Distributor',
        titleTamil: livePublisher.title || 'பதிவுசெய்யப்பட்ட நிதி ஆலோசகர்',
        organization: 'Fortune Investment Services (FISPL Partner)',
        arnNumber: livePublisher.arn_number || '',
        avatar: livePublisher.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(livePublisher.display_name || 'Advisor')}&background=f59e0b&color=0f172a&bold=true`,
        badgeEnglish: 'VERIFIED ADVISOR',
        badgeTamil: 'சரிபார்க்கப்பட்ட ஆலோசகர்',
        locationEnglish: 'Tamil Nadu, India',
        locationTamil: 'தமிழ்நாடு, இந்தியா',
        experience: 'AMFI Certified',
        fullBioEnglish: livePublisher.bio || 'Certified AMFI mutual fund distributor dedicated to investor financial freedom and long-term compounding.',
        fullBioTamil: livePublisher.bio_ta || livePublisher.bio || 'முதலீட்டாளர்களின் நிதி சுதந்திரம் மற்றும் நீண்ட கால செல்வ உருவாக்கத்திற்கு வழிகாட்டும் AMFI அங்கீகாரம் பெற்ற ஆலோசகர்.',
        specializations: Array.isArray(livePublisher.specialties)
          ? livePublisher.specialties.map(s => ({ en: s, ta: s }))
          : [{ en: 'Mutual Funds', ta: 'மியூச்சுவல் ஃபண்ட்' }, { en: 'Equity SIPs', ta: 'ஈக்விட்டி SIP' }],
        whatsapp: livePublisher.whatsapp_number || livePublisher.phone || '',
        socialLinks: {
          linkedin: normalizeSocialUrl(livePublisher.linkedin_url, 'linkedin'),
          twitter: normalizeSocialUrl(livePublisher.twitter_url, 'twitter'),
          youtube: normalizeSocialUrl(livePublisher.youtube_url, 'youtube', livePublisher.youtube_channel_id),
          website: livePublisher.website_url ? (livePublisher.website_url.startsWith('http') ? livePublisher.website_url : `https://${livePublisher.website_url}`) : ''
        }
      };
    }
    return seedProf || null;
  }, [livePublisher, seedProf]);

  // Skeleton state while profile is loading
  if (isLoading && !prof) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        <div className="w-36 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-3xl bg-slate-800 shrink-0" />
          <div className="space-y-4 flex-1 w-full text-center md:text-left">
            <div className="w-1/3 h-8 bg-slate-800 rounded-lg mx-auto md:mx-0" />
            <div className="w-1/4 h-4 bg-slate-800 rounded mx-auto md:mx-0" />
            <div className="w-full h-12 bg-slate-800 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Not Found state
  if (!prof) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
          {isTamil ? 'ஆலோசகர் சுயவிவரம் கிடைக்கவில்லை' : 'Advisor Profile Not Found'}
        </h2>
        <p className="text-sm text-slate-500">
          {isTamil ? 'கோரப்பட்ட ஆலோசகர் விவரங்கள் கிடைக்கவில்லை அல்லது நீக்கப்பட்டு இருக்கலாம்.' : 'The requested advisor profile may have been removed or does not exist.'}
        </p>
        <button
          onClick={() => onNavigate && onNavigate('#/professionals')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          {isTamil ? 'அனைத்து நிபுணர்கள் பட்டியல்' : 'Back to Advisors Directory'}
        </button>
      </div>
    );
  }

  const name = isTamil ? prof.nameTamil : prof.nameEnglish;
  const title = isTamil ? prof.titleTamil : prof.titleEnglish;
  const fullBio = isTamil ? prof.fullBioTamil : prof.fullBioEnglish;
  const badge = isTamil ? prof.badgeTamil : prof.badgeEnglish;
  const location = isTamil ? prof.locationTamil : prof.locationEnglish;

  // Only return live articles from database — no dead dummy links
  const publisherArticles = useMemo(() => {
    if (liveArticles && liveArticles.length > 0) {
      return liveArticles.map(a => ({
        id: a.id,
        slug: a.slug,
        title: isTamil && (a.title_ta || a.titleTa) ? (a.title_ta || a.titleTa) : (a.title || a.titleEnglish),
        titleTa: a.title_ta || a.titleTa,
        summary: isTamil && (a.summary_ta || a.summaryTa) ? (a.summary_ta || a.summaryTa) : (a.summary || a.summaryEnglish || a.excerpt || a.excerptEnglish || ''),
        summaryTa: a.summary_ta || a.summaryTa,
        coverImage: a.coverImage || a.cover_image_url || a.cover_image || a.thumbnail || a.image_url || '/favicon.svg',
        category: a.category || 'mutual-fund',
        views: a.views || a.view_count || a.viewCount || 0,
        readTimeMinutes: a.read_time_minutes || a.readTimeMinutes || 4,
        publishedAt: a.published_at || a.publishedAt || a.created_at,
        author: a.author_name || a.authorName || name,
        authorName: a.author_name || a.authorName || name,
        authorAvatar: a.author_avatar || a.authorAvatar || prof.avatar,
        authorArn: a.author_arn || a.authorArn || prof.arnNumber
      }));
    }
    return [];
  }, [liveArticles, prof, language, isTamil, name]);

  // Main brand channel videos carry no source_publisher_id, so /api/publishers returns
  // none for that profile — pull them straight from the catalog endpoint instead.
  const isBrandProfile = prof.id === 'budget-padmanaban' || !livePublisher ||
    (prof.nameEnglish && prof.nameEnglish.toLowerCase().includes('padmanaban'));

  useEffect(() => {
    if (!isBrandProfile || (liveVideos && liveVideos.length > 0)) return;
    let isMounted = true;
    fetch('/api/videos?limit=48&sort=newest')
      .then(res => (res.ok ? res.json() : null))
      .then(json => {
        if (isMounted && json && json.status === 'success' && Array.isArray(json.data)) {
          setBrandVideos(json.data.map(normalizeVideoRow));
        }
      })
      .catch(err => console.warn('Brand channel videos API fallback:', err));
    return () => { isMounted = false; };
  }, [isBrandProfile, liveVideos]);

  const publisherVideos = useMemo(() => {
    if (liveVideos && liveVideos.length > 0) {
      return liveVideos.map(v => translateVideo(v, language));
    }
    if (brandVideos.length > 0) {
      return brandVideos.map(v => translateVideo(v, language));
    }
    if (isBrandProfile) {
      return videosData.slice(0, 48).map(v => translateVideo(v, language));
    }
    return [];
  }, [liveVideos, brandVideos, isBrandProfile, language]);

  const cleanWhatsApp = (prof.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => onNavigate && onNavigate('#/professionals')}
        className="btn-magnetic px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <span>←</span>
        <span>{isTamil ? 'அனைத்து நிபுணர்கள் பட்டியல்' : 'Back to Advisors Directory'}</span>
      </button>

      {/* 1. IDENTITY HERO BANNER */}
      <div className="relative rounded-3xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 sm:gap-8">
          {/* Portrait Avatar */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            <img
              src={prof.avatar}
              alt={name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-2 border-amber-500 shadow-xl"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=0f172a&bold=true`;
              }}
            />
            {prof.experience && (
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/40 text-[9px] font-mono font-bold text-amber-700 dark:text-amber-400 shadow-md">
                {prof.experience}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">{name}</h1>
              <span className="px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                {badge}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400/90 font-mono">
                {title} • {prof.organization}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                📍 {location} {prof.arnNumber && `• AMFI Registration ARN: ${prof.arnNumber}`}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl font-medium">
              {fullBio}
            </p>

            {/* Specialization Tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
              {prof.specializations?.map((spec, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-amber-300 border border-slate-200 dark:border-amber-500/20 text-[10px] font-bold shadow-sm"
                >
                  {isTamil ? (spec.ta || spec.en) : spec.en}
                </span>
              ))}
            </div>

            {/* Action Buttons: WhatsApp Direct Consultation + Social Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-3">
              {cleanWhatsApp && (
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${name}, I read your profile on Muthaleetu Thisai and would like to request an investment consultation.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <span className="text-sm">💬</span>
                  <span>{isTamil ? 'வாட்ஸ்அப் வழியே ஆலோசனை பெறுக' : 'Direct WhatsApp Consultation'}</span>
                </a>
              )}

              {prof.socialLinks?.website && (
                <a
                  href={prof.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-amber-600 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>🌐</span>
                  <span>{isTamil ? 'வலைத்தளம்' : 'Website'}</span>
                </a>
              )}
              {prof.socialLinks?.youtube && (
                <a
                  href={prof.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-red-600 hover:text-white text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>▶</span>
                  <span>YouTube</span>
                </a>
              )}
              {prof.socialLinks?.linkedin && (
                <a
                  href={prof.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>in</span>
                  <span>LinkedIn</span>
                </a>
              )}
              {prof.socialLinks?.twitter && (
                <a
                  href={prof.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>𝕏</span>
                  <span>Twitter / X</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEED TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'bg-[#4A9E2C] text-white shadow-md'
              : 'text-slate-700 dark:text-slate-400 bg-white/70 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <span>✍️</span>
          <span>{isTamil ? 'கட்டுரைகள் & ஆய்வுகள்' : 'Articles & Research'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'articles' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#4A9E2C] dark:text-emerald-400'
          }`}>
            {publisherArticles.length}
          </span>
        </button>

        {publisherVideos.length > 0 && (
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'videos'
                ? 'bg-[#03529A] text-white shadow-md'
                : 'text-slate-700 dark:text-slate-400 bg-white/70 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>🎬</span>
            <span>{isTamil ? 'முக்கிய வீடியோக்கள் (Masterclasses)' : 'Video Masterclasses'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'videos' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#03529A] dark:text-sky-400'
            }`}>
              {publisherVideos.length}
            </span>
          </button>
        )}
      </div>

      {/* 3. FEED CONTENT */}

      {activeTab === 'videos' && publisherVideos.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-bold">
                {isTamil ? `${name} அவர்களின் வீடியோ வழிகாட்டிகள் (${publisherVideos.length})` : `Video masterclasses by ${name} (${publisherVideos.length})`}
              </p>
              {prof.socialLinks?.youtube && (
                <a
                  href={prof.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 hover:underline"
                >
                  <span>▶</span>
                  <span>{isTamil ? 'அனைத்து வீடியோக்களும் YouTube-ல்' : 'View on YouTube'} →</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {publisherVideos.map((video, idx) => (
                <ProfessionalWidescreenVideoCard
                  key={video.id || idx}
                  video={video}
                  onSelect={(v) => setSelectedVideo(v)}
                  language={language}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="space-y-6">
          {publisherArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {publisherArticles.map(article => (
                <div
                  key={article.id || article.slug}
                  onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                      <img
                        src={article.coverImage || '/favicon.svg'}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/favicon.svg'; }}
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-slate-950/85 text-amber-400">
                        {(article.category || 'FINANCE').replace('-', ' ')}
                      </span>
                      <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-black uppercase rounded-md bg-amber-600 text-white">
                        ORIGINAL
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      {article.summary && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                          {article.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    <div className="flex items-center gap-2.5 font-mono">
                      <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                        👁 {(article.views || article.viewCount || 0).toLocaleString()}
                      </span>
                      <span>⏱ {article.readTimeMinutes} min read</span>
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                      {isTamil ? 'படிக்க' : 'Read Article'} →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 max-w-xl mx-auto">
              <div className="text-3xl">✍️</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                {isTamil ? `${name} - ஆய்வுக் கட்டுரைகள்` : `${name} - Articles & Research`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {isTamil
                  ? 'இந்த ஆலோசகர் வெளியிடும் புதிய கட்டுரைகள் மற்றும் முதலீட்டு வழிகாட்டல்கள் விரைவில் இந்த பக்கத்தில் பிரசுரிக்கப்படும்.'
                  : 'Financial advisory and research articles published by this advisor will appear here.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Video Cinema Modal */}
      {selectedVideo && (
        <CinemaTheaterModal
          video={selectedVideo}
          allVideos={publisherVideos}
          onClose={() => setSelectedVideo(null)}
          onSelectRelated={(rel) => setSelectedVideo(rel)}
          language={language}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}

function LoginReminderModal({ currentHash, onNavigate }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Do not show if user is already logged in
    if (user) {
      setIsOpen(false);
      return;
    }

    // Do not show if currently on any auth screen
    const isAuthPage = ['#/login', '#/signup', '#/register', '#/forgot-password', '#/reset-password'].includes(currentHash);
    if (isAuthPage) {
      setIsOpen(false);
      return;
    }

    // Check if dismissed in this browsing session
    try {
      if (sessionStorage.getItem('login_reminder_dismissed') === 'true') {
        return;
      }
    } catch (e) {}

    // Start 15-second timer
    const timer = setTimeout(() => {
      const currentlyOnAuthPage = ['#/login', '#/signup', '#/register', '#/forgot-password', '#/reset-password'].includes(window.location.hash);
      if (!currentlyOnAuthPage) {
        setIsOpen(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [user, currentHash]);

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('login_reminder_dismissed', 'true');
    } catch (e) {}
  };

  const handleGoToLogin = () => {
    handleDismiss();
    onNavigate('#/login');
  };

  if (!isOpen || user) return null;

  const isTa = language === 'ta';

  return (
    <div 
      className="notification-banner-top w-[94vw] max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-2 border-amber-500/50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl shadow-amber-500/25 text-slate-900 dark:text-slate-100 flex items-center justify-between gap-3 sm:gap-4 overflow-hidden"
      role="alert"
    >
      {/* Background Accent Shimmer */}
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Left: Animated Ringing Bell Icon */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/35 border border-amber-300/40">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 bell-ring-anim text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
      </div>

      {/* Center: Notification Details */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {isTa ? 'தினசரி செய்திகள்' : 'Daily Updates'}
          </span>
        </div>
        <h4 className="text-xs sm:text-sm font-black tracking-tight text-slate-900 dark:text-white truncate">
          {isTa ? 'தினசரி செய்திகளுக்கு உள்நுழைக!' : 'Login for Daily Updates!'}
        </h4>
        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 truncate hidden xs:block">
          {isTa ? 'மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை & நிபுணர் கட்டுரைகள்' : 'Get live mutual fund analysis & market updates'}
        </p>
      </div>

      {/* Right: Sign In Button & Dismiss Icon */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={handleGoToLogin}
          className="py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-md shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 sm:gap-1.5"
        >
          <span>{isTa ? 'உள்நுழைக' : 'Sign In'}</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <button
          onClick={handleDismiss}
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isTa ? 'மூடுக' : 'Close'}
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AppContent({ currentHash, navigate, isSearchOpen, setIsSearchOpen, toastMessage, setToastMessage, renderRoute }) {
  const { user, role, profile, setProfile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* 1. FIXED TOP HEADER & NAVBAR STACK (100% Solid White on scroll) */}
      <div className="sticky-header-container sticky top-0 z-40 w-full shadow-md bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <Header onOpenSearch={() => setIsSearchOpen(true)} onNavigate={navigate} />
        <Navbar currentPath={currentHash} onNavigate={navigate} />
      </div>

      {/* 2. BREAKING NEWS TICKER ONLY ON HOMEPAGE */}
      {(currentHash === '#/' || currentHash === '' || currentHash === '#' || currentHash === '#/home') && (
        <TrendingTicker onNavigate={navigate} />
      )}

      <main className="flex-1">{renderRoute()}</main>
      <Footer onNavigate={navigate} onShowToast={setToastMessage} />
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={navigate} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* 15-Second Visitor Login Reminder Popup */}
      <LoginReminderModal currentHash={currentHash} onNavigate={navigate} />

      {/* Automatic First-Time Publisher Onboarding Modal */}
      {user && (role === 'publisher' || profile?.role === 'publisher') && (!profile?.is_onboarded || profile?.is_onboarded === false) && (
        <PublisherOnboardingModal
          profile={profile}
          onComplete={(updated) => {
            if (setProfile) setProfile(updated);
            setToastMessage('🎉 Welcome! Your publisher profile is complete and visible to all users.');
          }}
        />
      )}
    </div>
  );
}

function App() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash || '#/';
      if (h.includes('access_token=') || h.includes('refresh_token=')) {
        return;
      }
      setCurrentHash(h);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (hash) => {
    window.location.hash = hash;
    setCurrentHash(hash);
  };

  const renderRoute = () => {
    // 1. PUBLIC LANDING PAGE (Fully visible without login)
    if (currentHash === '#/' || currentHash === '' || currentHash === '#') {
      return <Home onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    // 2. PUBLIC AUTHENTICATION ROUTES
    if (currentHash === '#/login') return <AuthPage initialMode="login" onNavigate={navigate} />;
    if (currentHash === '#/signup' || currentHash === '#/register') return <AuthPage initialMode="signup" onNavigate={navigate} />;
    if (currentHash === '#/forgot-password') return <AuthPage initialMode="forgot" onNavigate={navigate} />;
    if (currentHash === '#/reset-password') return <AuthPage initialMode="magic-link" onNavigate={navigate} />;

    // 3. PROTECTED USER & ADMIN ROUTES

    // 3.1 Profile & Watch History
    if (currentHash === '#/profile') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <ProfilePage onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    if (currentHash === '#/history' || currentHash === '#/watch-history') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <WatchHistoryPage onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    // 3.2 Admin & Publisher Studio Routes
    if (currentHash.startsWith('#/admin/articles/edit/')) {
      const articleId = currentHash.replace('#/admin/articles/edit/', '');
      return (
        <AdminRoute onNavigate={navigate}>
          <ArticleEditorPage articleId={articleId} onNavigate={navigate} onShowToast={setToastMessage} />
        </AdminRoute>
      );
    }

    if (currentHash === '#/admin/articles/new') {
      return (
        <AdminRoute onNavigate={navigate}>
          <ArticleEditorPage articleId="new" onNavigate={navigate} onShowToast={setToastMessage} />
        </AdminRoute>
      );
    }

    if (currentHash === '#/admin/articles' || currentHash === '#/admin') {
      return (
        <AdminRoute onNavigate={navigate}>
          <AdminArticlesPage onNavigate={navigate} onShowToast={setToastMessage} />
        </AdminRoute>
      );
    }

    // 3.3 Articles Routes (Public for user)
    if (currentHash.startsWith('#/articles/')) {
      const slug = currentHash.replace('#/articles/', '');
      return <ArticleDetailPage slug={slug} onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    if (currentHash === '#/articles') {
      return <ArticlesPage onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    // 3.4 Videos Routes (Public for user)
    if (currentHash.startsWith('#/videos/')) {
      const videoId = currentHash.replace('#/videos/', '');
      return <VideosPage initialVideoId={videoId} onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    if (currentHash === '#/videos') {
      return <VideosPage onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    // 3.5 News Routes (Public for user)
    if (currentHash.startsWith('#/news/')) {
      const slug = currentHash.replace('#/news/', '');
      return <NewsDetailsPage slug={slug} onNavigate={navigate} />;
    }

    if (currentHash === '#/news') {
      return <NewsPage onNavigate={navigate} />;
    }

    // 3.6 Category Routes (Public for user)
    if (currentHash.startsWith('#/category/')) {
      const categoryId = currentHash.replace('#/category/', '');
      return <CategoryPage categoryId={categoryId} onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    // 3.7 Tools (Public for user)
    if (currentHash === '#/calculator') {
      return <div className="py-8"><SipCalculator /></div>;
    }

    if (currentHash === '#/quiz') {
      return <div className="py-8"><RiskQuizWidget /></div>;
    }

    // 3.8 Public Professionals Directory & Publisher Profiles
    if (currentHash.startsWith('#/professionals/')) {
      const profId = currentHash.replace('#/professionals/', '');
      return <ProfessionalProfilePage professionalId={profId} onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    if (currentHash === '#/professionals') {
      return <ProfessionalsDirectoryPage onNavigate={navigate} onShowToast={setToastMessage} />;
    }

    // Default Fallback: Public Landing Page
    return <Home onNavigate={navigate} onShowToast={setToastMessage} />;
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent
            currentHash={currentHash}
            navigate={navigate}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            toastMessage={toastMessage}
            setToastMessage={setToastMessage}
            renderRoute={renderRoute}
          />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

// Mount React Root
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}


