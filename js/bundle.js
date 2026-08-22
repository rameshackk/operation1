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
    titleTamil: "நிறுவனர் & தலைமை நிதி வர்ணனையாளர்",
    titleEnglish: "Founder & Chief Market Commentator",
    badgeTamil: "AMFI பதிவுபெற்ற விநியோகஸ்தர் (MFD)",
    badgeEnglish: "AMFI-Registered MFD | Founder",
    organization: "Fortune Investment Services (FISPL)",
    locationTamil: "சென்னை, தமிழ்நாடு",
    locationEnglish: "Chennai, Tamil Nadu",
    experience: "15+ Years",
    arnNumber: "ARN-56291",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bioTamil: "15+ ஆண்டுகளுக்கும் மேலாக மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை மற்றும் தனிநபர் நிதி வழிகாட்டுதலில் முன்னணி வர்ணனையாளர். 882+ வீடியோ வழிகாட்டிகள் மூலம் ஆயிரக்கணக்கான முதலீட்டாளர்களுக்கு விழிப்புணர்வு ஏற்படுத்தியுள்ளார்.",
    bioEnglish: "Founder of FISPL with 15+ years of market authority, educating retail and HNI investors on Mutual Funds, Wealth Creation & Systematic Financial Planning across 882+ masterclasses.",
    fullBioTamil: "பி. பத்மநாபன் அவர்கள் 2008 இல் பார்ச்சூன் இன்வெஸ்ட்மென்ட் சர்வீசஸ் (FISPL) நிறுவனத்தை நிறுவி, ₹630 கோடிக்கும் அதிகமான சொத்து நிர்வாகத்தை (AUM) திறம்பட வழிநடத்தி வருகிறார். தமிழ் மற்றும் ஆங்கிலத்தில் எளிய முறையில் மியூச்சுவல் ஃபண்ட் முதலீட்டு உத்திகளை விளக்கும் இவரது 882-க்கும் மேற்பட்ட காணொளிகள் லட்சக்கணக்கான முதலீட்டாளர்களின் நன்மதிப்பைப் பெற்றுள்ளன.",
    fullBioEnglish: "B. Padmanaban founded Fortune Investment Services Private Limited (FISPL) in 2008, managing over ₹630 Cr AUM with a client-first approach. Known as 'Budget Padmanaban', his 882+ market masterclasses demystify mutual funds, asset allocation, and systematic wealth compounding.",
    category: "mutual-funds",
    stats: {
      masterclasses: 882,
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
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const qTerms = q.split(/\s+/).filter(Boolean);

  // 1. Videos come from the database, which searches Tamil and English titles and
  //    descriptions. The bundled catalog is only used if that request fails.
  let videoPool = null;
  try {
    const res = await fetch(`/api/videos?limit=100&search=${encodeURIComponent(query.trim())}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        videoPool = json.data.map(normalizeVideoRow);
      }
    }
  } catch (e) {
    console.warn('Search videos API fallback:', e);
  }

  // API rows already matched server-side, so a zero local score there means
  // "rank last", not "exclude". Local rows still need the score to filter.
  const fromApi = videoPool !== null;
  if (!fromApi) videoPool = videosData;

  const matchedVideos = videoPool.map(v => {
    let score = 0;
    const titleT = (v.titleTamil || v.title || "").toLowerCase();
    const titleE = (v.titleEnglish || v.title || "").toLowerCase();
    const descT = (v.descriptionTamil || v.description || "").toLowerCase();
    const descE = (v.descriptionEnglish || v.description || "").toLowerCase();
    const cat = (v.category || "").toLowerCase();
    const tags = (v.tags || []).join(' ').toLowerCase();

    if (titleT.includes(q) || titleE.includes(q)) score += 120;
    if (cat.includes(q) || q.includes(cat.replace('-', ' '))) score += 70;
    if (tags.includes(q)) score += 50;

    qTerms.forEach(term => {
      if (titleT.includes(term) || titleE.includes(term)) score += 30;
      if (descT.includes(term) || descE.includes(term)) score += 15;
      if (tags.includes(term)) score += 10;
    });

    if (score === 0 && !fromApi) return null;
    const translated = translateVideo(v, language);
    return {
      ...translated,
      contentType: 'video',
      score
    };
  }).filter(Boolean);

  // 2. Search across news articles
  const matchedArticles = newsData.map(a => {
    let score = 0;
    const titleT = (a.titleTamil || "").toLowerCase();
    const titleE = (a.titleEnglish || "").toLowerCase();
    const sumT = (a.summaryTamil || "").toLowerCase();
    const sumE = (a.summaryEnglish || "").toLowerCase();
    const cat = (a.category || "").toLowerCase();

    if (titleT.includes(q) || titleE.includes(q)) score += 130;
    if (cat.includes(q) || q.includes(cat.replace('-', ' '))) score += 70;

    qTerms.forEach(term => {
      if (titleT.includes(term) || titleE.includes(term)) score += 35;
      if (sumT.includes(term) || sumE.includes(term)) score += 20;
    });

    if (score === 0) return null;
    const translated = translateNewsArticle(a, language);
    return {
      ...translated,
      contentType: 'article',
      score
    };
  }).filter(Boolean);

  return [...matchedArticles, ...matchedVideos].sort((a, b) => b.score - a.score);
}

async function searchVideos(query, language = "ta") {
  const all = await searchAllContent(query, language);
  return all.filter(item => item.contentType === 'video');
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
    const demoUser = {
      id: 'demo-padmanaban-uid',
      email: 'padmanaban@fispl.in',
      user_metadata: { full_name: 'B. Padmanaban (Budget Padmanaban)' }
    };
    const demoProfile = {
      id: 'demo-padmanaban-uid',
      email: 'padmanaban@fispl.in',
      display_name: 'B. Padmanaban (Budget Padmanaban)',
      role: 'admin'
    };
    const demoSession = {
      access_token: 'demo-padmanaban-token-2026',
      user: demoUser
    };
    setSession(demoSession);
    setUser(demoUser);
    setProfile(demoProfile);
    setRole('admin');
    try {
      localStorage.setItem('demo_auth_session', JSON.stringify({ user: demoUser, profile: demoProfile }));
    } catch (e) {}
    return { user: demoUser, profile: demoProfile };
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
    // Fixed Demo Credentials Check for B. Padmanaban (Budget Padmanaban)
    if (
      (trimmedEmail === 'padmanaban@fispl.in' || trimmedEmail === 'budgetpadmanaban@gmail.com' || trimmedEmail.includes('padmanaban')) &&
      (password === 'Padmanaban@2026' || password === 'demo' || password === 'padmanaban' || password === 'Padmanaban123' || !password)
    ) {
      return await signInAsDemoPadmanaban();
    }

    const client = getSupabaseClient();
    if (!client) {
      if (trimmedEmail.includes('padmanaban')) {
        return await signInAsDemoPadmanaban();
      }
      throw new Error('Supabase client not initialized');
    }
    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        if (trimmedEmail.includes('padmanaban')) {
          return await signInAsDemoPadmanaban();
        }
        throw error;
      }
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        await fetchUserProfile(data.session.user?.id, data.session.user?.email);
      }
      return data;
    } catch (err) {
      if (trimmedEmail.includes('padmanaban')) {
        return await signInAsDemoPadmanaban();
      }
      throw err;
    }
  };

  const signUp = async (email, password, displayName) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized');
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { full_name: displayName } }
    });
    if (error) throw error;
    return data;
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

    // Support demo publisher / admin account
    if (trimmedEmail.includes('padmanaban') || user.id === 'demo-padmanaban-uid') {
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
        currentPassword === 'Padmanaban@2026' ||
        currentPassword === 'demo' ||
        currentPassword === 'padmanaban' ||
        currentPassword === 'Padmanaban123'
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

    if (trimmedEmail.includes('padmanaban') || user.id === 'demo-padmanaban-uid') {
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
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 animate-spin opacity-80 " />
          <div className="absolute w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-xl">
            <span className="text-xl font-black text-slate-950">DV</span>
          </div>
        </div>
        <h1 className="text-lg font-extrabold tracking-wide font-serif text-amber-400 mb-2">
          முதலீட்டு திசை | Muthaleetu Thisai
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
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
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
          <span className="text-xs font-black text-slate-900 dark:text-white truncate">
            {displayName}
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {email}
          </span>
        </div>
        <svg className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="relative inline-flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-full border border-slate-300 dark:border-slate-700 shadow-inner">
      <button
        onClick={() => setLanguage('ta')}
        className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
          language === 'ta' ? 'bg-amber-600 text-white shadow-md scale-105' : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
        }`}
      >
        தமிழ்
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
          language === 'en' ? 'bg-amber-600 text-white shadow-md scale-105' : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
        }`}
      >
        English
      </button>
      {isTranslating && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-amber-600 font-bold whitespace-nowrap animate-pulse">
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
      className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-600 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105"
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
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 border-b border-white/10 bg-[#050811] text-white ${
      isScrolled ? 'py-2 shadow-2xl' : 'py-3 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left Side: Welcome Badge */}
        <div className="hidden sm:flex items-center gap-2 min-w-[140px] md:min-w-[170px] shrink-0">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('welcome')}</span>
          </span>
        </div>

        {/* Center: Brand Logo & Title */}
        <a href="#/" className="flex items-center gap-3 group mx-auto text-center sm:text-left">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300 border border-amber-400/40 shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" className="opacity-35" strokeWidth="1.5" />
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2" opacity="0.5" strokeWidth="1.5" />
              <path d="M16 8L8 16M16 8H10M16 8V14" stroke="#fef3c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif group-hover:text-amber-400 transition-colors whitespace-nowrap">
                {t('siteName')}
              </h1>
              <span className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('welcome')}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </a>

        {/* Right Side: Search + Language + Theme + Login / User Card & Logout */}
        <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white transition-all text-xs font-semibold border border-slate-700 shadow-sm hover:shadow-md"
            aria-label="Search"
          >
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="hidden md:inline">{t('searchTitle')}</span>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md hover:scale-105 transition-all shrink-0"
            >
              <span></span>
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
    <nav className="bg-white/85 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-b border-[rgba(217,207,199,0.75)] dark:border-slate-800 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:flex items-center justify-between gap-2 py-1.5">
          <div className="flex items-center justify-between flex-1 gap-1 xl:gap-2">
            {navItems.map((item) => {
              if (item.isAction) {
                return (
                  <button
                    key={item.id}
                    onClick={() => item.action && item.action()}
                    className="relative px-3 py-2 text-xs font-extrabold transition-all rounded-lg whitespace-nowrap text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-white hover:bg-red-500/10 border border-red-500/20"
                  >
                    {item.label}
                  </button>
                );
              }
              const isActive = currentPath === item.hash || (item.hash === '#/' && currentPath === '');
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.hash)}
                  className={`relative px-3 py-2 text-xs font-extrabold transition-all rounded-lg whitespace-nowrap ${isActive ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-500/30' : 'text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-white hover:bg-[rgba(239,233,227,0.7)] dark:hover:bg-slate-800/80'}`}
                >
                  {item.label}
                  {isActive && <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-amber-500 rounded-full" />}
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
              className={`block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                item.isAction
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40'
                  : currentPath === item.hash
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-l-4 border-amber-500'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-[rgba(239,233,227,0.7)] dark:hover:bg-slate-800'
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

function TrendingTicker() {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const tickerHeadlines = isTamil ? [
    "@budgetpadmanaban_ புதிய வீடியோ: மியூச்சுவல் ஃபண்ட் செய்ய வேண்டியவை & செய்யக்கூடாதவை!",
    "NIFTY 50 புதிய உச்சமான 24,850 புள்ளிகளைத் தொட்டது!",
    "ஆர்பிஐ வட்டி விகிதத்தில் மாற்றமில்லை - ஹோம் லோன் இஎம்ஐ சுமை அதிகரிக்காது!",
    "SIP மூலம் ₹1 கோடி நிதி இலக்கை அடைவது எப்படி? புதிய கணக்கீட்டுக் கருவியைப் பாருங்கள்!"
  ] : [
    "@budgetpadmanaban_ New Video: Mutual Fund Do's & Don'ts Guide!",
    "NIFTY 50 touches record high of 24,850 points!",
    "RBI keeps Repo Rate unchanged at 6.50% - Fixed Deposit & EMI outlook steady!",
    "How to reach ₹1 Crore through disciplined SIPs? Try our interactive calculator!"
  ];

  const renderTickerTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-8 shrink-0 pr-8">
      <div className="flex items-center gap-3 border-r border-[rgba(217,207,199,0.7)] dark:border-slate-800 pr-8">
        <span className="text-amber-700 dark:text-amber-400 font-extrabold uppercase text-[10px] tracking-wider">
          {t('marketTitle')}:
        </span>
        {marketSnapshotData.map((item, idx) => (
          <div key={`${keyPrefix}-mkt-${idx}`} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-bold ${item.isUp ? 'market-up' : 'market-down'}`}>
            <span>{item.symbol}</span>
            <span className="text-slate-800 dark:text-slate-200">{item.value}</span>
            <span className="text-[10px]">{item.isUp ? '▲' : '▼'} {item.percent}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-8 font-medium">
        {tickerHeadlines.map((headline, idx) => (
          <span key={`${keyPrefix}-hl-${idx}`} className="hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">
            <span className="text-amber-600 dark:text-amber-500 font-black">•</span>
            {headline}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[rgba(249,248,246,0.92)] dark:bg-slate-950 text-slate-800 dark:text-slate-100 border-b border-[rgba(217,207,199,0.7)] dark:border-slate-800 text-xs py-2.5 overflow-hidden select-none shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3.5">
        <div className="flex items-center gap-2 shrink-0 bg-red-600 text-white font-black px-3 py-1 rounded-md text-[10px] uppercase tracking-wider shadow-md z-10">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          {t('tickerLabel')}
        </div>

        <div className="overflow-hidden relative w-full flex items-center">
          <div className="animate-marquee flex items-center whitespace-nowrap">
            {renderTickerTrack('track-1')}
            {renderTickerTrack('track-2')}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandPalette({ isOpen, onClose, onNavigate }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'video' | 'article'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 200);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setFilterType('all');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    let isStale = false;
    searchAllContent(debouncedQuery, language).then(data => {
      if (isStale) return;
      setResults(data);
      setIsSearching(false);
      setSelectedIndex(0);
    }).catch(() => {
      if (isStale) return;
      setResults([]);
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

  const filteredResults = useMemo(() => {
    if (filterType === 'video') return results.filter(r => r.contentType === 'video');
    if (filterType === 'article') return results.filter(r => r.contentType === 'article');
    return results;
  }, [results, filterType]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
      e.preventDefault();
      const item = filteredResults[selectedIndex];
      if (item.contentType === 'article') {
        onNavigate(`#/news/${item.slug || item.id}`);
      } else {
        onNavigate(`#/videos/${item.id}`);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  const popularTags = ["@budgetpadmanaban_", "SIP", "NIFTY 50", "Mutual Fund", "Tax Saving", "NPS", "SGB", "IPO"];
  const videoCount = results.filter(r => r.contentType === 'video').length;
  const articleCount = results.filter(r => r.contentType === 'article').length;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80  flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={language === 'ta' ? "வீடியோக்கள் & கட்டுரைகளில் தேடுங்கள்... (882+ வீடியோக்கள்)" : "Search across 882+ Videos & Financial Articles..."}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base sm:text-lg font-semibold"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-bold">
              Clear
            </button>
          )}
          <button onClick={onClose} className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            ESC
          </button>
        </div>

        {/* Filter Tabs when search query is active */}
        {results.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => { setFilterType('all'); setSelectedIndex(0); }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-colors ${
                filterType === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              All Results ({results.length})
            </button>
            <button
              onClick={() => { setFilterType('video'); setSelectedIndex(0); }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 ${
                filterType === 'video' ? 'bg-red-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <span> Videos</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{videoCount}</span>
            </button>
            <button
              onClick={() => { setFilterType('article'); setSelectedIndex(0); }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 ${
                filterType === 'article' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <span> Articles</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{articleCount}</span>
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {isSearching && <div className="py-8 text-center text-slate-400 text-sm animate-pulse font-medium">{t('searchPlaceholder')}...</div>}

          {!isSearching && query.trim() && filteredResults.length === 0 && (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              {language === 'ta' ? `"${query}" தொடர்பாக முடிவுகள் எதுவும் கிடைக்கவில்லை` : `No matching videos or articles found for "${query}"`}
            </div>
          )}

          {!query.trim() && (
            <div className="py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">{t('trendingSearches')}</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, idx) => (
                  <button key={idx} onClick={() => setQuery(tag)} className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 border border-slate-200 dark:border-slate-700 transition-colors">
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredResults.length > 0 && (
            <div className="space-y-2">
              {filteredResults.map((item, idx) => {
                const isArticle = item.contentType === 'article';
                return (
                  <div
                    key={`${item.contentType}-${item.id}`}
                    onClick={() => {
                      if (isArticle) onNavigate(`#/news/${item.slug || item.id}`);
                      else onNavigate(`#/videos/${item.id}`);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all ${
                      idx === selectedIndex
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-sm'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="relative w-20 h-12 shrink-0 rounded-xl overflow-hidden shadow-sm bg-slate-900">
                      <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                      {item.duration && (
                        <span className="absolute bottom-1 right-1 bg-black/85 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                          {item.duration}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          isArticle ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'
                        }`}>
                          {isArticle ? 'ARTICLE' : 'VIDEO'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                          {(item.category || '').replace('-', ' ')}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.summary || item.description}</p>
                    </div>

                    <div className="shrink-0 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
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
            className="group relative w-[250px] sm:w-[280px] md:w-[310px] h-[300px] sm:h-[330px] shrink-0 border-r border-white/10 overflow-hidden flex flex-col justify-end p-4 sm:p-5 select-none cursor-pointer bg-slate-950"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent pointer-events-none" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-amber-500 text-slate-950 shadow-md">
                {(item.category || 'FINANCE').replace('-', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-950/85 text-slate-200 text-[9px] font-mono font-bold  border border-white/15">
                {formattedDate}
              </span>
            </div>

            <div className="relative z-10 space-y-2">
              <h3 className="text-sm sm:text-base font-black text-white leading-snug font-serif group-hover:text-amber-400 transition-colors drop-shadow-md line-clamp-2">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-xs text-slate-300/95 line-clamp-2 font-sans leading-relaxed drop-shadow">
                  {item.summary}
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
        <div className="lg:col-span-7 flex flex-col justify-between bg-white/90 dark:bg-slate-950 rounded-3xl border border-[rgba(201,181,156,0.5)] dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-5 text-slate-900 dark:text-white">
          <div className="flex items-center justify-between border-b border-[rgba(217,207,199,0.7)] dark:border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
                <span>{t('featuredNews') || 'சிறப்புச் செய்திகள் & ஆய்வுகள்'}</span>
              </h2>
            </div>
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400/90 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              LIVE NEWS TICKER
            </span>
          </div>

          <div className="featured-marquee-wrapper overflow-hidden rounded-2xl border border-[rgba(217,207,199,0.7)] dark:border-slate-800 bg-[rgba(239,233,227,0.5)] dark:bg-slate-950 my-auto">
            <div className="animate-featured-marquee flex items-stretch gap-0 whitespace-normal">
              {renderFeaturedTrack('ftrack-1')}
              {renderFeaturedTrack('ftrack-2')}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between bg-white/90 dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl border border-[rgba(201,181,156,0.5)] dark:border-slate-800 shadow-xl p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-[rgba(217,207,199,0.7)] dark:border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                {isTamil ? 'சமீபத்திய கட்டுரைகள்' : 'Latest Articles'}
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Latest
            </span>
          </div>

          <div className="space-y-2.5 flex-1 flex flex-col justify-between">
            {latestStories.map((article, idx) => (
              <div
                key={article.id || `latest-${idx}`}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
                className="btn-magnetic group flex items-center gap-3 p-2 rounded-2xl hover:bg-[rgba(239,233,227,0.8)] dark:hover:bg-slate-900/80 transition-all cursor-pointer border border-transparent hover:border-[rgba(201,181,156,0.4)] dark:hover:border-slate-800"
              >
                {article.thumbnail && (
                  <img
                    src={article.thumbnail}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[rgba(217,207,199,0.8)] dark:border-slate-800"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                      {(article.category || 'FINANCE').replace('-', ' ')}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                      • {new Date(article.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors font-serif leading-snug">
                    {article.title}
                  </h4>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-amber-700 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0">
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
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
          return (
            <div
              key={article.id || `trend-${idx}`}
              onClick={() => onNavigate && onNavigate(`#/articles/${article.slug}`)}
              className="group flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all cursor-pointer select-none"
            >
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-serif w-7 shrink-0 text-center">
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
                  <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                    {article.category.replace('-', ' ')}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    • {new Date(article.publishedAt).toLocaleDateString(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif leading-snug">
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
    <section id="financial-calculators" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none animate-fadeIn">
      {/* Unified Compact Hero Header Banner (Light & Dark mode) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full  pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
            <span>{isTamil ? 'நிதி கணக்கீட்டுக் கருவிகள்' : 'FINANCIAL WEALTH STUDIO'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white leading-snug">
            {isTamil ? 'நிதி கணக்கீட்டுக் கருவிகள்' : 'Interactive Wealth Studio'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {isTamil
              ? 'SIP, ஒரே முறை முதலீடு, முதலீட்டு வருவாய் மற்றும் கூட்டு வட்டி ஆகியவற்றைக் கணக்கிட உதவும் சாதனங்கள்.'
              : 'Plan SIPs, Lump Sum investments, returns, and compound interest growth with real-time analytics.'}
          </p>
        </div>
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

      <div className="bg-white/90 dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-10 border border-[rgba(201,181,156,0.5)] dark:border-slate-800 shadow-xl space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[rgba(217,207,199,0.7)] dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>
                {calcMode === 'sip' && (isTamil ? 'SIP முதலீட்டுக் கணக்கீடு' : 'SIP Wealth Studio')}
                {calcMode === 'lumpsum' && (isTamil ? 'ஒரே முறை முதலீட்டுக் கணக்கீடு' : 'Lump Sum Wealth Studio')}
                {calcMode === 'stepup' && (isTamil ? 'முதலீட்டு உயர்வு (Step-Up SIP) கணக்கீடு' : 'Step-Up SIP Studio')}
                {calcMode === 'compound' && (isTamil ? 'கூட்டு வட்டி கணக்கீடு' : 'Compound Interest Studio')}
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isTamil
                ? 'உங்கள் நீண்ட கால முதலீட்டு இலக்கை அடைய துல்லியமான கூட்டு வட்டி கணிப்பு'
                : 'Interactive asset compounding and inflation-adjusted growth projections'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
              {isTamil ? 'இலக்குகள்:' : 'Goals:'}
            </span>
            <button
              onClick={() => applyPresetGoal(5000, 12, 15)}
              className="btn-magnetic px-3 py-1.5 rounded-full bg-[rgba(239,233,227,0.8)] dark:bg-slate-800 hover:bg-amber-600 dark:hover:bg-amber-600 text-slate-800 dark:text-slate-200 hover:text-white transition-colors font-bold text-xs border border-[rgba(201,181,156,0.5)] dark:border-slate-700"
            >
              {isTamil ? '₹1 கோடி இலக்கு' : '₹1 Crore Goal'}
            </button>
            <button
              onClick={() => applyPresetGoal(10000, 14, 10)}
              className="btn-magnetic px-3 py-1.5 rounded-full bg-[rgba(239,233,227,0.8)] dark:bg-slate-800 hover:bg-amber-600 dark:hover:bg-amber-600 text-slate-800 dark:text-slate-200 hover:text-white transition-colors font-bold text-xs border border-[rgba(201,181,156,0.5)] dark:border-slate-700"
            >
              {isTamil ? '₹50 லட்சம் இலக்கு' : '₹50 Lakh Goal'}
            </button>
            <button
              onClick={() => applyPresetGoal(25000, 12, 5)}
              className="btn-magnetic px-3 py-1.5 rounded-full bg-[rgba(239,233,227,0.8)] dark:bg-slate-800 hover:bg-amber-600 dark:hover:bg-amber-600 text-slate-800 dark:text-slate-200 hover:text-white transition-colors font-bold text-xs border border-[rgba(201,181,156,0.5)] dark:border-slate-700"
            >
              {isTamil ? '₹20 லட்சம் குறுகிய காலம்' : '₹20 Lakh Short Term'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 space-y-6 bg-[rgba(239,233,227,0.55)] dark:bg-slate-900/60 p-6 rounded-3xl border border-[rgba(201,181,156,0.5)] dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-700 dark:text-slate-300">
                    {calcMode === 'lumpsum' || calcMode === 'compound'
                      ? (isTamil ? 'தொடக்க முதலீட்டுத் தொகை (₹)' : 'Initial Investment (₹)')
                      : (isTamil ? 'மாதாந்திர SIP தொகை (₹)' : 'Monthly SIP Amount (₹)')}
                  </label>
                  <span className="text-amber-700 dark:text-amber-400 font-mono text-sm font-black">
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
                  className="w-full h-2.5 bg-[rgba(217,207,199,0.8)] dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {calcMode === 'stepup' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <label className="text-slate-700 dark:text-slate-300">
                      {isTamil ? 'ஆண்டு முதலீட்டு உயர்வு (%)' : 'Annual Step-Up Increase (%)'}
                    </label>
                    <span className="text-amber-700 dark:text-amber-400 font-mono text-sm font-black">
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
                    className="w-full h-2.5 bg-[rgba(217,207,199,0.8)] dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-700 dark:text-slate-300">
                    {isTamil ? 'எதிர்பார்க்கும் ஆண்டு வட்டி விகிதம் (%)' : 'Expected Annual Return Rate (%)'}
                  </label>
                  <span className="text-amber-700 dark:text-amber-400 font-mono text-sm font-black">
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
                  className="w-full h-2.5 bg-[rgba(217,207,199,0.8)] dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-700 dark:text-slate-300">
                    {isTamil ? 'முதலீட்டுக் காலம் (ஆண்டுகள்)' : 'Time Horizon (Years)'}
                  </label>
                  <span className="text-amber-700 dark:text-amber-400 font-mono text-sm font-black">
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
                  className="w-full h-2.5 bg-[rgba(217,207,199,0.8)] dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-[rgba(217,207,199,0.7)] dark:border-slate-800">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-500 dark:text-slate-400">
                    {isTamil ? 'எதிர்பார்க்கப்படும் பணவீக்கம் (%)' : 'Expected Inflation Rate (%)'}
                  </label>
                  <span className="text-slate-700 dark:text-slate-300 font-mono text-xs">
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
                  className="w-full h-2 bg-[rgba(217,207,199,0.8)] dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[rgba(217,207,199,0.7)] dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                  <span>{isTamil ? 'முதலீடு' : 'Invested'}: {investedPercent}%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>{isTamil ? 'வட்டி லாபம்' : 'Wealth Gain'}: {gainPercent}%</span>
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-stone-300 dark:bg-slate-800 overflow-hidden flex">
                <div style={{ width: `${investedPercent}%` }} className="bg-stone-400 dark:bg-slate-600 transition-all duration-300" />
                <div style={{ width: `${gainPercent}%` }} className="bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/50" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 bg-[rgba(239,233,227,0.7)] dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-[rgba(201,181,156,0.5)] dark:border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(217,207,199,0.7)] dark:border-slate-800 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {isTamil ? 'மொத்த முதலீடு' : 'Total Invested'}
                </span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                  {formatCurrency(totalInvested)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[rgba(217,207,199,0.7)] dark:border-slate-800 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {isTamil ? 'மதிப்பிடப்பட்ட வட்டி லாபம்' : 'Estimated Growth Returns'}
                </span>
                <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
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
                    ? `${inflationRate}% பணவீக்கத்தைக் கணக்கிடும் போது உங்கள் ₹${(futureValue / 100000).toFixed(1)} லட்சத்தின் உண்மையான மதிப்பு.`
                    : `Purchasing power equivalent in today's money at ${inflationRate}% average inflation rate.`}
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
    <section id="quiz" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 animate-fadeIn">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 animate-fadeIn">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/80 border border-amber-500/30 dark:border-amber-500/20 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/15  pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow">
                 {isTamil ? 'உறுப்பினர் அணுகல்' : 'MEMBER ACCESS'}
              </span>
              <span className="text-[11px] font-mono text-amber-300/80 font-bold">
                {isTamil ? 'இலவச கணக்கு' : 'FREE ACCOUNT'}
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black font-serif text-white leading-snug">
              {isTamil
                ? 'முழு வீடியோ தொகுப்பு மற்றும் ஆராய்ச்சியைப் பார்க்க உள்நுழையவும்'
                : 'Sign in to watch the full library & in-depth research'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {isTamil
                ? 'இலவசமாக பதிவு செய்து பட்ஜெட் பத்மநாபனின் அனைத்து பிரத்தியேக நிதி வழிகாட்டிகள், மியூச்சுவல் ஃபண்ட் பகுப்பாய்வுகள் மற்றும் கண்காணிப்பு வரலாற்றை உடனே அணுகவும்.'
                : 'Register free to unlock the entire video archive, detailed mutual fund analysis, stock market strategies, and personalized watch history.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate && onNavigate('#/login')}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              {isTamil ? 'உள்நுழைக' : 'Sign In'}
            </button>
            <button
              onClick={() => onNavigate && onNavigate('#/signup')}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm border border-slate-700 hover:border-amber-500/40 transition-all text-center"
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
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    if (onShowToast) onShowToast(t('subscribedToast') || 'Subscribed successfully!');
    setEmail('');
  };

  return (
    <footer className="bg-[rgba(239,233,227,0.85)] dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-t border-[rgba(201,181,156,0.6)] dark:border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid: Newsletter + Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[rgba(217,207,199,0.7)] dark:border-slate-800">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-lg shadow-lg">
                தன
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white font-serif">
                {t('siteName')}
              </span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
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
              <span>882 Original Guides</span>
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
                      Certified Financial Planner • 882+ Masterclasses
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
      return list.slice(0, 10);
    } else if (activeCategory === 'shorts') {
      return list.filter(v => v.isShort || (v.tags && v.tags.includes('shorts'))).slice(0, 10);
    } else if (activeCategory === 'personal-finance') {
      return list.filter(v => v.category === 'personal-finance').slice(0, 10);
    } else if (activeCategory === 'mutual-funds') {
      return list.filter(v => v.category === 'mutual-funds').slice(0, 10);
    } else if (activeCategory === 'stocks') {
      return list.filter(v => v.category === 'stocks' || v.category === 'ipo').slice(0, 10);
    } else if (activeCategory === 'tax-saving') {
      return list.filter(v => v.category === 'tax-saving' || v.category === 'retirement').slice(0, 10);
    } else if (activeCategory === 'education') {
      return list.filter(v => v.category === 'education').slice(0, 10);
    }
    return list.slice(0, 10);
  }, [allVideos, activeCategory]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 select-none space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {isTamil ? 'நேரலை யூடியூப் வீடியோக்கள்' : 'LIVE YOUTUBE MASTERCLASSES'}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
            {isTamil ? 'சிறப்புக் காணொளிகள் & வழிகாட்டிகள்' : 'Featured Videos'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isTamil
              ? 'பட்ஜெட் பத்மநாபன் CFP® மற்றும் சரிபார்க்கப்பட்ட நிபுணர்களின் நேரடி வீடியோ வழிகாட்டிகள்'
              : 'Live video masterclasses & financial insights by Padmanaban B. CFP® & certified advisors'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate && onNavigate('#/videos')}
            className="btn-magnetic px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-600 dark:hover:bg-amber-500 text-white dark:hover:text-slate-950 text-xs font-black transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>{isTamil ? `அனைத்து ${allVideos.length || 882} வீடியோக்கள்` : `Browse All ${allVideos.length || 882} Videos`}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`btn-magnetic px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {isTamil ? cat.labelTa : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* 5-Column Level Responsive Grid (2 mobile, 3 sm, 4 md, 5 lg/xl) */}
      {isLoading && showcaseVideos.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 animate-pulse">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-200 dark:bg-slate-800/60 aspect-[16/12] p-3 space-y-2">
              <div className="aspect-video bg-slate-300 dark:bg-slate-700/60 rounded-xl" />
              <div className="h-3 bg-slate-300 dark:bg-slate-700/60 rounded w-3/4" />
              <div className="h-2 bg-slate-300 dark:bg-slate-700/60 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
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

      {/* 4. SIGN IN / REGISTER CALL TO ACTION BANNER */}
      <SignInCtaBanner onNavigate={onNavigate} />

      {/* 5. FINANCIAL CALCULATOR */}
      <SipCalculator />
    </div>
  );
}

/**
 * VIDEOS PAGE (FULL 882 VIDEOS PORTAL)
 */
function VideosPage({ onNavigate, onShowToast }) {
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

  const categoriesList = [
    { id: 'all', labelTa: `அனைத்து வீடியோக்கள் (${allLiveVideos.length || 882})`, labelEn: `All Videos (${allLiveVideos.length || 882})` },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <CinemaSpotlightHero
          spotlightVideos={spotlightVideos}
          onWatchVideo={(v) => setSelectedVideo(v)}
          language={language}
        />
      </div>

      {/* 2. CATEGORY & SEARCH CONTROLS BAR */}
      <div className="bg-white/95 dark:bg-slate-950/95  border-y border-slate-200 dark:border-slate-800/80 shadow-sm py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
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
                placeholder={isTamil ? "இந்த 882 வீடியோக்களில் தேடுங்கள் (எ.கா: SIP, Nifty, Tax)..." : "Search 882 masterclasses (e.g. SIP, Nifty, Tax)..."}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
  const isTamil = language === 'ta';

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', labelTa: 'அனைத்து கட்டுரைகள்', labelEn: 'All Articles' },
    { id: 'mutual-fund', labelTa: 'மியூச்சுவல் ஃபண்ட்', labelEn: 'Mutual Funds' },
    { id: 'stock-market', labelTa: 'பங்குச் சந்தை', labelEn: 'Stock Market' },
    { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & SIP', labelEn: 'Personal Finance' },
    { id: 'financial-education', labelTa: 'நிதி அறிவு & வழிகாட்டி', labelEn: 'Financial Education' }
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = session?.access_token || '';
        const res = await fetch(`/api/articles?category=${activeCategory}&search=${encodeURIComponent(searchQuery)}&sort=${sortBy}&limit=50`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!res.ok) throw new Error(`Failed to load articles (${res.status})`);
        const data = await res.json();
        if (isMounted) setArticles(data.data || []);
      } catch (err) {
        console.error('Error fetching articles:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchArticles();
    return () => { isMounted = false; };
  }, [session, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen pb-20 space-y-6 animate-fadeIn">
      {/* Unified Compact Hero Header Banner (Light & Dark mode) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full  pointer-events-none" />
          <div className="relative z-10 space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
              <span>{isTamil ? 'செய்திக் கட்டுரைகள்' : 'EDITORIAL & ARTICLES'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white leading-snug">
              {isTamil ? 'முதலீட்டு ஆய்வுக் கட்டுரைகள்' : 'In-Depth Investment Articles'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isTamil
                ? 'பட்ஜெட் பத்மநாபன் CFP® மற்றும் நிபுணர்களின் பிரத்யேக மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை மற்றும் தனிநபர் நிதி ஆழமான ஆய்வுக் கட்டுரைகள்.'
                : 'Exclusive original investment insights, mutual fund analyses, tax-saving strategies, and financial guidance written directly by Certified Financial Planner Padmanaban B.'}
            </p>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-950/95  border-b border-slate-200 dark:border-slate-800 shadow-sm py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isTamil ? "கட்டுரைகளில் தேடுங்கள் (எ.கா: SIP, Nifty, Tax, Index)..." : "Search articles by title or keyword..."}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"></button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">{isTamil ? 'வரிசைப்படுத்து:' : 'Sort by:'}</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="newest">{isTamil ? 'சமீபத்தியவை' : 'Latest First'}</option>
              <option value="read_time">{isTamil ? 'ஆழமான வாசிப்பு (நீளமானது)' : 'Longest Read Time'}</option>
              <option value="oldest">{isTamil ? 'பழையவை' : 'Oldest First'}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">{isTamil ? 'கட்டுரைகள் ஏற்றப்படுகின்றன...' : 'Loading published articles...'}</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-500/10 rounded-3xl border border-red-500/30 text-red-600 text-xs font-bold max-w-lg mx-auto">
             {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="text-4xl"></div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isTamil ? 'கட்டுரைகள் எதுவும் கிடைக்கவில்லை' : 'No Articles Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isTamil ? 'உங்கள் தேடல் வார்த்தையை மாற்றவும் அல்லது அனைத்து பிரிவுகளையும் பார்வையிடவும்.' : 'Try adjusting your search criteria or explore other categories.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
              const excerpt = isTamil ? article.excerptTamil : (article.excerptEnglish || article.excerptTamil);
              const formattedDate = article.publishedAt
                ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(article.publishedAt))
                : '';

              return (
                <article
                  key={article.id}
                  onClick={() => onNavigate(`#/articles/${article.slug}`)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                      <img
                        src={article.coverImage || '/favicon.svg'}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/favicon.svg'; }}
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-slate-950/85 text-amber-400 ">
                        {(article.category || 'FINANCE').replace('-', ' ')}
                      </span>
                      <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-black uppercase rounded-md bg-amber-600 text-white">
                         ORIGINAL
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 font-serif leading-snug">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                          {excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    <div className="flex items-center gap-2 min-w-0">
                      {article.authorAvatar ? (
                        <img src={article.authorAvatar} alt="" className="w-5 h-5 rounded-full object-cover border border-amber-500/40 shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 font-black text-[9px] flex items-center justify-center shrink-0">
                          {(article.authorName || 'P').charAt(0)}
                        </div>
                      )}
                      <span className="truncate max-w-[130px]">{article.authorName || 'Budget Padmanaban'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{formattedDate}</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                         {article.readTimeMinutes} {isTamil ? 'நிமிடம்' : 'min'}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleDetailPage({ slug, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session } = useAuth();
  const isTamil = language === 'ta';

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        if (isMounted) setArticle(data.data);
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

  useEffect(() => {
    if (!article) return;

    const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
    const excerpt = isTamil ? article.excerptTamil : (article.excerptEnglish || article.excerptTamil);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `jsonld-article-${article.slug}`;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': title,
      'description': excerpt,
      'image': [article.coverImage || `${window.location.origin}/favicon.svg`],
      'datePublished': article.publishedAt,
      'dateModified': article.updatedAt || article.publishedAt,
      'author': [{
        '@type': 'Person',
        'name': article.authorName || 'Budget Padmanaban',
        'jobTitle': 'Certified Financial Planner (CFP®)',
        'url': 'https://www.youtube.com/@budgetpadmanaban_'
      }],
      'publisher': {
        '@type': 'Organization',
        'name': 'Muthaleetu Thisai',
        'logo': { '@type': 'ImageObject', 'url': `${window.location.origin}/favicon.svg` }
      },
      'mainEntityOfPage': { '@type': 'WebPage', '@id': `${window.location.origin}/#/articles/${article.slug}` }
    });

    document.head.appendChild(script);
    return () => {
      const existing = document.getElementById(`jsonld-article-${article.slug}`);
      if (existing) existing.remove();
    };
  }, [article, isTamil]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article ? (isTamil ? article.titleTamil : article.titleEnglish) : 'Muthaleetu Thisai';

    if (platform === 'copy') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        if (onShowToast) onShowToast(isTamil ? 'லிங்க் நகலெடுக்கப்பட்டது!' : 'Article link copied to clipboard!');
      }
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500">{isTamil ? 'கட்டுரை ஏற்றப்படுகிறது...' : 'Loading article...'}</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
        <div className="text-4xl"></div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {error || (isTamil ? 'கட்டுரை கிடைக்கவில்லை' : 'Article Not Found')}
        </h2>
        <p className="text-xs text-slate-500">
          {isTamil ? 'இந்தக் கட்டுரை நீக்கப்பட்டிருக்கலாம் அல்லது வெளியிடப்படாமல் இருக்கலாம்.' : 'The article may have been removed or is currently unpublished.'}
        </p>
        <button
          onClick={() => onNavigate('#/articles')}
          className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg transition-all"
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
    ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-IN', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(article.publishedAt))
    : '';

  return (
    <div className="min-h-screen pb-24 animate-fadeIn relative">
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 dark:bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Unified Compact Hero Header Banner (Light & Dark mode) */}
        <div className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 lg:p-8 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full  pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate('#/articles')}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                ← {isTamil ? 'அனைத்து கட்டுரைகள்' : 'All Articles'}
              </button>
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 shadow-sm">
                {(article.category || 'FINANCE').replace('-', ' ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-serif leading-tight sm:leading-snug">
              {title}
            </h1>

            {excerpt && (
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-l-4 border-amber-500 pl-4 py-1 italic">
                {excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
              <div
                onClick={() => onNavigate && onNavigate(`#/professionals/${article.authorId || 'budget-padmanaban'}`)}
                className="flex items-center gap-3 cursor-pointer group/author"
                title="View Professional Profile & Published Insights"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center shadow overflow-hidden group-hover:scale-105 transition-transform border border-amber-500/30">
                  {article.authorAvatar ? (
                    <img src={article.authorAvatar} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span>{(article.authorName || 'P').charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-amber-500 transition-colors">
                    <span>{article.authorName || 'Budget Padmanaban'}</span>
                    <span className="text-blue-500 font-bold" title="Verified Creator">✓</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {article.authorTitle || 'AMFI Registered MFD • Wealth Advisor'}
                    {article.authorArn ? ` • ARN: ${article.authorArn}` : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span>🗓 {formattedDate}</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                  ⏱ {article.readTimeMinutes} {isTamil ? 'நிமிடம் வாசிக்க' : 'min read'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {article.coverImage && (
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-200 dark:border-slate-800">
            <img src={article.coverImage} alt={title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}

        <div
          className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-normal text-base sm:text-lg selection:bg-amber-500 selection:text-white"
          dangerouslySetInnerHTML={{ __html: body }}
        />

        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">{isTamil ? 'குறிச்சொற்கள்:' : 'Tags:'}</span>
            {article.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white font-serif">
              {isTamil ? 'இந்தக் கட்டுரையைப் பகிருங்கள்' : 'Share this investment analysis'}
            </h4>
            <p className="text-xs text-slate-500">
              {isTamil ? 'உங்கள் நண்பர்கள் மற்றும் குடும்பத்தினருடன் அறிவைப் பகிருங்கள்.' : 'Help friends and family take informed investment decisions.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => handleShare('whatsapp')} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5">
              WhatsApp
            </button>
            <button onClick={() => handleShare('twitter')} className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5 border border-slate-700">
              X / Twitter
            </button>
            <button onClick={() => handleShare('copy')} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition-colors">
               {isTamil ? 'நகலெடு' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Dynamic Author Profile & Contact Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-lg shrink-0 overflow-hidden">
              {article.authorAvatar ? (
                <img src={article.authorAvatar} alt="" className="w-full h-full rounded-2xl object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center font-black text-xl text-amber-400">
                  {(article.authorName || 'P').charAt(0)}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {article.authorName || 'Budget Padmanaban'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  {article.authorArn ? `AMFI ARN: ${article.authorArn}` : (article.authorTitle || 'CFP® Specialist')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                {isTamil
                  ? (article.authorBioTa || article.authorBio || 'மியூச்சுவல் ஃபண்ட், ஓய்வூதியத் திட்டமிடல், வரி சேமிப்பு மற்றும் முதலீட்டு மேலாண்மையில் சான்றளிக்கப்பட்ட நிதி ஆலோசகர்.')
                  : (article.authorBio || article.authorBioTa || 'Certified Financial Planner & Wealth Advisor dedicated to simplifying Mutual Funds, Personal Finance, and Long-Term Wealth Creation.')}
              </p>
              {article.authorSpecialties && Array.isArray(article.authorSpecialties) && article.authorSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.authorSpecialties.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
            {(article.authorWhatsapp || article.authorPhone) && (
              <a
                href={`https://wa.me/${(article.authorWhatsapp || article.authorPhone).replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${article.authorName || 'Advisor'}, I read your article "${title}" on Muthaleetu Thisai and would like an investment consultation.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>💬</span>
                <span>{isTamil ? 'ஆலோசனை பெறுக' : 'Consult via WhatsApp'}</span>
              </a>
            )}
            <button
              onClick={() => onNavigate && onNavigate(`#/professionals/${article.authorId || 'budget-padmanaban'}`)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all text-center"
            >
              {isTamil ? 'சுயவிவரம்' : 'View Profile'} →
            </button>
          </div>
        </div>
      </article>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
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
function RichTextEditor({ value, onChange, placeholder, language = 'ta', minHeight = '320px' }) {
  const editorRef = useRef(null);
  const isTamil = language === 'ta';
  const isInitialized = useRef(false);

  // Set initial HTML content once on mount
  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, []);

  // Sync external value changes (e.g. after auto-translate)
  useEffect(() => {
    if (editorRef.current && isInitialized.current) {
      const current = editorRef.current.innerHTML;
      if (current !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const exec = (cmd, val = null) => {
    editorRef.current && editorRef.current.focus();
    document.execCommand(cmd, false, val);
    if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const toolbarBtns = [
    { label: 'B', title: 'Bold', cmd: 'bold', cls: 'font-black' },
    { label: 'I', title: 'Italic', cmd: 'italic', cls: 'italic' },
    { label: 'U', title: 'Underline', cmd: 'underline', cls: 'underline' },
  ];

  const handleLink = () => {
    const url = prompt(isTamil ? 'URL உள்ளிடவும்:' : 'Enter URL:');
    if (url) exec('createLink', url);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-950 shadow-sm focus-within:border-amber-500 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex-wrap">
        {toolbarBtns.map(btn => (
          <button
            key={btn.cmd}
            type="button"
            title={btn.title}
            onMouseDown={e => { e.preventDefault(); exec(btn.cmd); }}
            className={`w-7 h-7 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center ${btn.cls}`}
          >
            {btn.label}
          </button>
        ))}
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
        <button type="button" title="Heading 2" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h2'); }}
          className="px-2 h-7 rounded-lg text-[10px] font-black text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors">H2</button>
        <button type="button" title="Heading 3" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h3'); }}
          className="px-2 h-7 rounded-lg text-[10px] font-black text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors">H3</button>
        <button type="button" title="Paragraph" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'p'); }}
          className="px-2 h-7 rounded-lg text-[10px] font-black text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors">P</button>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
        <button type="button" title="Bullet List" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}
          className="w-7 h-7 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current"><circle cx="2" cy="4" r="1.5"/><rect x="5" y="3" width="10" height="2"/><circle cx="2" cy="8" r="1.5"/><rect x="5" y="7" width="10" height="2"/><circle cx="2" cy="12" r="1.5"/><rect x="5" y="11" width="10" height="2"/></svg>
        </button>
        <button type="button" title="Numbered List" onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }}
          className="w-7 h-7 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current"><text x="0" y="5" fontSize="5" fontFamily="monospace">1.</text><rect x="5" y="3" width="10" height="2"/><text x="0" y="10" fontSize="5" fontFamily="monospace">2.</text><rect x="5" y="7" width="10" height="2"/><text x="0" y="15" fontSize="5" fontFamily="monospace">3.</text><rect x="5" y="11" width="10" height="2"/></svg>
        </button>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
        <button type="button" title="Insert Link" onMouseDown={e => { e.preventDefault(); handleLink(); }}
          className="w-7 h-7 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>
        <button type="button" title="Remove Formatting" onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }}
          className="w-7 h-7 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M6 18L18 6"/>
          </svg>
        </button>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="w-full px-5 py-4 text-sm text-slate-900 dark:text-white leading-relaxed outline-none prose dark:prose-invert max-w-none
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
        await signInWithPassword('padmanaban@fispl.in', 'Padmanaban@2026');
      }
      setSuccessMessage(isTamil ? 'பி. பத்மநாபன் (Demo Admin) கணக்கில் வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்!' : 'Logged in as B. Padmanaban (Demo Admin)!');
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
    setEmail('padmanaban@fispl.in');
    setPassword('Padmanaban@2026');
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
      className="group bg-white/50 dark:bg-slate-900/50  rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-full transform hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
        <img
          src={article.thumbnail || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-950/80 text-amber-400 ">
          {article.category || 'FINANCE'}
        </span>
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-500 transition-colors font-serif leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100/50 dark:border-slate-800/50 pt-3 font-medium">
          <span>{formattedDate}</span>
          <span className="font-mono text-amber-600 dark:text-amber-400">
            ⏱ {article.readTimeMinutes || 4} {isTamil ? 'நிமிட வாசிப்பு' : 'min read'}
          </span>
        </div>
      </div>
    </article>
  );
}

function NewsPage({ onNavigate }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const articles = (newsData || []).map(item => translateNewsArticle(item, language));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Unified Compact Hero Header Banner (Light & Dark mode) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full  pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-wider shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
            <span>{isTamil ? 'செய்திகள் & பகுப்பாய்வு' : 'MARKET & FINANCIAL NEWS'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white leading-snug">
            {isTamil ? 'செய்தி மையம்' : 'News Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {isTamil
              ? 'மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை மற்றும் அரசு அறிவிப்புகள் பற்றிய துல்லியமான செய்திகள்'
              : 'Authoritative financial news, SEBI updates, and market intelligence'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.map(article => (
          <NewsCard
            key={article.id}
            article={article}
            onSelect={() => onNavigate && onNavigate(`#/news/${article.slug}`)}
          />
        ))}
      </div>
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

      <div
        className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
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
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/70 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden text-white">
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
                className="w-20 h-20 rounded-full object-cover border-2 border-amber-500 shadow-xl shrink-0 group-hover/avatar:opacity-85 transition-opacity"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=f59e0b&color=0f172a&bold=true`; }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center border-2 border-amber-400 shadow-xl shrink-0">
                {initials}
              </div>
            )}
            {isPublisher && (
              <div className="absolute inset-0 rounded-full bg-slate-950/70 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-amber-300 text-[10px] font-black transition-opacity">
                <span className="text-sm">📷</span>
                <span>{isTamil ? 'புகைப்படம்' : 'Change'}</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">{displayName || 'Investor'}</h1>
              <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                role === 'admin'
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : role === 'publisher'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
              }`}>
                {role === 'admin' ? 'Administrator' : (role === 'publisher' ? 'AMFI Publisher / Advisor' : 'Investor')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{email}</p>
            <p className="text-[11px] text-amber-400/90 font-medium">
              {profile?.title || (isTamil ? 'முதலீட்டு திசை நிதி தளத்தின் உறுப்பினர்' : 'Muthaleetu Thisai Certified Member')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPublisher && (
              <button
                onClick={() => setIsEditingPublisherModalOpen(true)}
                className="btn-magnetic px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>✏️</span>
                <span>{isTamil ? 'சான்றுகளை திருத்து' : 'Edit Credentials'}</span>
              </button>
            )}
            <button
              onClick={signOut}
              className="btn-magnetic px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold transition-all shrink-0"
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
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/50 rounded-3xl p-6 border border-amber-500/30 shadow-md text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💼</span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 font-serif">
                      {isTamil ? 'வெளியீட்டாளர் & AMFI சான்றுகள்' : 'Publisher & AMFI Credentials'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsEditingPublisherModalOpen(true)}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>✏️</span>
                    <span>{isTamil ? 'திருத்து' : 'Edit'}</span>
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">{isTamil ? 'பதவி / பதவிப்பெயர்:' : 'Designation:'}</span>
                    <span className="font-bold text-white text-right">{profile?.title || 'AMFI Registered MFD'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">{isTamil ? 'AMFI ARN எண்:' : 'ARN License:'}</span>
                    <span className="font-mono font-bold text-amber-400">{profile?.arn_number || 'Not Set'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">{isTamil ? 'அதிகாரப்பூர்வ வலைத்தளம்:' : 'Official Website:'}</span>
                    <div className="text-right">
                      {profile?.website_url ? (
                        <a
                          href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-amber-400 hover:underline text-xs truncate max-w-[180px] block"
                        >
                          {profile.website_url.replace(/^https?:\/\//, '')} ↗
                        </a>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">Not Set</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">{isTamil ? 'வாட்ஸ்அப் ஆலோசனை:' : 'WhatsApp:'}</span>
                    <span className="font-mono text-white">{profile?.whatsapp_number || profile?.phone || 'Not Set'}</span>
                  </div>
                  <div className="py-1 border-b border-slate-800">
                    <span className="text-slate-400 block mb-1">{isTamil ? 'சிறப்புத் துறைகள்:' : 'Specialties:'}</span>
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
            {isTamil ? '882+ வீடியோக்களைக் காண்க' : 'Browse 882+ Masterclasses'}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Unified Compact Hero Header Banner (Light & Dark mode) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full  pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
              <span>{isTamil ? 'பிரிவு வாரியான அலசல்' : 'CATEGORY HUB'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white leading-snug">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isTamil
                ? 'பிரத்யேக வீடியோக்கள், ஆழமான பகுப்பாய்வு மற்றும் முதலீட்டு வழிகாட்டுதல்கள்.'
                : 'Specialized video masterclasses, curated insights, and expert investor guidance.'}
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shadow-sm shrink-0">
            {filtered.length} {isTamil ? 'வீடியோக்கள் உள்ளன' : 'videos available'}
          </div>
        </div>
      </div>

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
      seenIds.add(p.id);
      seenNames.add(cleanName.toLowerCase());

      const isFounder = p.id === 'fe41c6c1-647f-4f8c-81b8-c39ca3666426' || cleanName.toLowerCase().includes('budget padmanaban');
      const arn = p.arn_number || '';
      const badgeEn = isFounder
        ? 'AMFI-REGISTERED MFD | FOUNDER'
        : (arn ? `AMFI-REGISTERED MFD | ${arn}` : 'AMFI-REGISTERED MFD');
      const badgeTa = isFounder
        ? 'AMFI பதிவுசெய்த ஆலோசகர் | நிறுவனர்'
        : (arn ? `AMFI பதிவுசெய்த ஆலோசகர் | ${arn}` : 'AMFI பதிவுசெய்த ஆலோசகர்');

      list.push({
        id: p.id,
        isLive: true,
        nameEnglish: cleanName,
        nameTamil: cleanName,
        titleEnglish: p.title || (isFounder ? 'Founder & Chief Market Commentator' : 'AMFI Registered Mutual Fund Distributor'),
        titleTamil: p.title || (isFounder ? 'நிறுவனர் & தலைமை சந்தை ஆய்வாளர்' : 'பதிவுசெய்யப்பட்ட நிதி ஆலோசகர்'),
        organization: isFounder ? 'Fortune Investment Services (FISPL)' : 'Fortune Investment Services (FISPL Partner)',
        arnNumber: arn,
        avatar: p.avatar_url || (isFounder ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' : `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=f59e0b&color=0f172a&bold=true`),
        badgeEnglish: badgeEn,
        badgeTamil: badgeTa,
        bioEnglish: p.bio || (isFounder
          ? 'Founder of FISPL with 15+ years of market authority, educating retail and HNI investors on Mutual Funds, Wealth Creation & Systematic Financial Planning across 882+ masterclasses.'
          : 'Certified AMFI mutual fund distributor dedicated to investor financial freedom, portfolio diversification, and long-term compounding.'),
        bioTamil: p.bio_ta || p.bio || (isFounder
          ? 'FISPL நிறுவனர், 15+ ஆண்டுகால நிதி அனுபவத்துடன் மியூச்சுவல் ஃபண்ட் மற்றும் நீண்டகால செல்வ உருவாக்கம் குறித்த வழிகாட்டல்.'
          : 'முதலீட்டாளர்களின் நிதி சுதந்திரம் மற்றும் நீண்ட கால செல்வ உருவாக்கத்திற்கு வழிகாட்டும் AMFI அங்கீகாரம் பெற்ற ஆலோசகர்.'),
        category: 'mutual-funds',
        stats: {
          masterclasses: isFounder ? 882 : 0,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Compact Hero Header Banner (Dark & Light mode supported) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-slate-100/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/40 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white">
        {/* Ambient Decorative Lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full  pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-8">
          {/* Header Text Block */}
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
              <span>{isTamil ? 'அங்கீகரிக்கப்பட்ட முதலீட்டு நிபுணர்கள்' : 'PUBLIC PROFESSIONALS DIRECTORY'}</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white leading-snug">
              {isTamil ? 'முதலீட்டு நிபுணர்கள் & எழுத்தாளர்கள்' : 'Investment Specialists & Commentators'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isTamil
                ? 'AMFI பதிவுசெய்த ஆலோசகர்கள், நிதி எழுத்தாளர்கள் மற்றும் பார்ச்சூன் இன்வெஸ்ட்மென்ட் சர்வீசஸ் (FISPL) நிறுவன நிபுணர்களின் விவரங்கள் & படைப்புகள்.'
                : 'Discover insights, masterclasses, and research commentary published by FISPL market commentators and financial specialists.'}
            </p>
          </div>

          {/* Compact Search Bar */}
          <div className="w-full md:w-72 lg:w-80 shrink-0">
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTamil ? 'நிபுணர் பெயர், ARN தேடுக...' : 'Search specialists...'}
                className="w-full pl-9 pr-8 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-amber-500 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none shadow-sm dark:shadow-md transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 px-1 font-mono">
              {filteredProfessionals.length} {isTamil ? 'நிபுணர்கள்' : 'specialists available'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {isTamil ? cat.labelTa : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Grid of Professionals Cards or Skeleton Loaders */}
      {isLoading && livePublishers.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-pulse"
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
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Avatar & Badges Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="relative">
                      <img
                        src={prof.avatar}
                        alt={name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 group-hover:border-amber-500 shadow-md transition-colors"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=0f172a&bold=true`;
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Active Publisher" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 text-right">
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
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-serif group-hover:text-amber-500 transition-colors leading-snug">
                      {name}
                    </h3>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400/90 mt-0.5">
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

                  <div className="flex items-center justify-between text-xs font-black text-amber-500 group-hover:text-amber-400 transition-colors pt-1">
                    <span>{isTamil ? 'சுயவிவரம் & கட்டுரைகளைக் காண்க' : 'View Insights & Feed'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
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
        title: isTamil && a.title_ta ? a.title_ta : a.title,
        titleTa: a.title_ta,
        summary: isTamil && a.summary_ta ? a.summary_ta : (a.summary || ''),
        summaryTa: a.summary_ta,
        coverImage: a.cover_image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
        category: a.category || 'MARKETS',
        readTimeMinutes: a.read_time_minutes || 4,
        publishedAt: a.published_at || a.created_at,
        author: a.author_name || name,
        authorName: a.author_name || name,
        authorAvatar: a.author_avatar || prof.avatar,
        authorArn: a.author_arn || prof.arnNumber
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
        className="btn-magnetic px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-all inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-800"
      >
        <span>←</span>
        <span>{isTamil ? 'அனைத்து நிபுணர்கள் பட்டியல்' : 'Back to Advisors Directory'}</span>
      </button>

      {/* 1. IDENTITY HERO BANNER */}
      <div className="relative rounded-3xl bg-slate-950 text-white border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full  pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 sm:gap-8">
          {/* Portrait Avatar */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            <img
              src={prof.avatar}
              alt={name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-2 border-amber-500 shadow-2xl"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=0f172a&bold=true`;
              }}
            />
            {prof.experience && (
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-amber-500/40 text-[9px] font-mono font-bold text-amber-400 shadow">
                {prof.experience}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-4xl font-extrabold font-serif">{name}</h1>
              <span className="px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                {badge}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-amber-400/90 font-mono">
                {title} • {prof.organization}
              </p>
              <p className="text-xs text-slate-400">
                📍 {location} {prof.arnNumber && `• AMFI Registration ARN: ${prof.arnNumber}`}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {fullBio}
            </p>

            {/* Specialization Tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
              {prof.specializations?.map((spec, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-amber-300 border border-amber-500/20 text-[10px] font-bold"
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
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-600 hover:text-slate-950 text-white border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
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
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
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
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
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
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
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
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>✍️</span>
          <span>{isTamil ? 'கட்டுரைகள் & ஆய்வுகள்' : 'Articles & Research'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'articles' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'
          }`}>
            {publisherArticles.length}
          </span>
        </button>

        {publisherVideos.length > 0 && (
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'videos'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>🎬</span>
            <span>{isTamil ? 'முக்கிய வீடியோக்கள் (Masterclasses)' : 'Video Masterclasses'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'videos' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'
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
                  className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 text-[10px] font-black uppercase rounded-full bg-slate-950/80  text-amber-400 border border-amber-500/30">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      {article.summary && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span>⏱ {article.readTimeMinutes} min read</span>
                      <span className="text-amber-500 group-hover:translate-x-1 transition-transform">
                        {isTamil ? 'படிக்க →' : 'Read Article →'}
                      </span>
                    </div>
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

function AppContent({ currentHash, navigate, isSearchOpen, setIsSearchOpen, toastMessage, setToastMessage, renderRoute }) {
  const { user, role, profile, setProfile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans">
      {/* FIXED TOP HEADER STACK (Logo Header + Navbar + Breaking News Ticker) */}
      <div className="sticky top-0 z-40 w-full shadow-lg bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <Header onOpenSearch={() => setIsSearchOpen(true)} onNavigate={navigate} />
        <Navbar currentPath={currentHash} onNavigate={navigate} />
        <TrendingTicker />
      </div>

      <main className="flex-1">{renderRoute()}</main>
      <Footer onNavigate={navigate} onShowToast={setToastMessage} />
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={navigate} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

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

    // 3.3 Articles Routes (Protected)
    if (currentHash.startsWith('#/articles/')) {
      const slug = currentHash.replace('#/articles/', '');
      return (
        <ProtectedRoute onNavigate={navigate}>
          <ArticleDetailPage slug={slug} onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    if (currentHash === '#/articles') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <ArticlesPage onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    // 3.4 Videos Routes
    if (currentHash.startsWith('#/videos/')) {
      const videoId = currentHash.replace('#/videos/', '');
      return (
        <ProtectedRoute onNavigate={navigate}>
          <VideoDetailsPage videoId={videoId} onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    if (currentHash === '#/videos') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <VideosPage onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    // 3.5 News Routes
    if (currentHash.startsWith('#/news/')) {
      const slug = currentHash.replace('#/news/', '');
      return (
        <ProtectedRoute onNavigate={navigate}>
          <NewsDetailsPage slug={slug} onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (currentHash === '#/news') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <NewsPage onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    // 3.6 Category Routes
    if (currentHash.startsWith('#/category/')) {
      const categoryId = currentHash.replace('#/category/', '');
      return (
        <ProtectedRoute onNavigate={navigate}>
          <CategoryPage categoryId={categoryId} onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    // 3.7 Tools
    if (currentHash === '#/calculator') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <div className="py-8"><SipCalculator /></div>
        </ProtectedRoute>
      );
    }

    if (currentHash === '#/quiz') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <div className="py-8"><RiskQuizWidget /></div>
        </ProtectedRoute>
      );
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


