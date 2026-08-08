/* Dhanavriksha Wealth - Advanced Investment Growth & SIP Calculator Engine */
const { useState, useEffect, createContext, useContext, useRef } = React;

const OFFICIAL_CHANNEL_URL = "https://www.youtube.com/@budgetpadmanaban_";
const OFFICIAL_CHANNEL_HANDLE = "@budgetpadmanaban_";
const OFFICIAL_CHANNEL_NAME = "Budget Padmanaban";

// Reset theme to light by default
if (!localStorage.getItem("dhanavriksha_theme_initialized")) {
  localStorage.setItem("dhanavriksha_theme", "light");
  localStorage.setItem("dhanavriksha_theme_initialized", "true");
}

// ==================== 1. DATA LAYER ====================
const translations = {
  ta: {
    siteName: "முதலீடு திசை",
    welcome: "வரவேற்கிறோம்",
    tagline: "மியூச்சுவல் ஃபண்ட் & பங்குச் சந்தை செய்திகள்",
    budgetPadmanaban: "பட்ஜெட் பத்மநாபன் ஃபைனான்ஷியல்",
    nav: {
      home: "முகப்பு",
      videos: "வீடியோக்கள்",
      news: "செய்திகள்",
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
    monthlyInvestment: "மாதாந்திர SIP தொாகை (₹)",
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
    footerDisclaimerText: "மியூச்சுவல் ஃபண்ட் முதலீடுகள் சந்தை அபாயங்களுக்கு உட்பட்டவை. முதலீடு செய்வதற்கு முன் திட்ட ஆவணங்களை கவனமாகப் படிக்கவும். தனவிருக்ஷா மற்றும் பட்ஜெட் பத்மநாபன் வழங்கும் தகவல்கள் கல்வி நோக்கங்களுக்காக மட்டுமே.",
    copyright: "© 2026 தனவிருக்ஷா வெல்த் மீடியா. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
  },
  en: {
    siteName: "Mudhaleedu Thesai",
    welcome: "Welcome",
    tagline: "Mutual Fund & Market News",
    budgetPadmanaban: "Budget Padmanaban Financial",
    nav: {
      home: "Home",
      videos: "Videos",
      news: "News",
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
    footerDisclaimerText: "Mutual Fund investments are subject to market risks, read all scheme-related documents carefully before investing. Information provided by Dhanavriksha and Budget Padmanaban is for educational purposes only.",
    copyright: "© 2026 Mudhaleedu Thesai Media. All rights reserved."
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
    id: "vid-bp-001",
    youtubeId: "1RUJcEWuMDY",
    youtubeUrl: "https://www.youtube.com/watch?v=1RUJcEWuMDY",
    isShort: false,
    channelHandle: "@budgetpadmanaban_",
    channelUrl: "https://www.youtube.com/@budgetpadmanaban_",
    channelName: "Budget Padmanaban",
    titleTamil: "நான் Follow பண்ற Financial Habit! | பட்ஜெட் பத்மநாபன் CFP",
    titleEnglish: "The Financial Habit I Follow! | Budget Padmanaban CFP",
    title: "நான் Follow பண்ற Financial Habit! Budget Padmanaban, Certified Financial Planner",
    descriptionTamil: "பட்ஜெட் பத்மநாபன் தான் பின்பற்றும் சிறந்த நிதிப் பழக்கம் மற்றும் சேமிப்பு ரகசியங்களைப் பகிர்ந்து கொள்கிறார்.",
    descriptionEnglish: "Padmanaban shares a personal financial habit he follows and recommends to others for long-term wealth creation.",
    description: "Padmanaban shares a personal financial habit he follows and recommends to others.",
    category: "personal-finance",
    publishedAt: "2024-08-05T00:00:00.000Z",
    duration: "08:45",
    views: 24500,
    thumbnail: "https://img.youtube.com/vi/1RUJcEWuMDY/hqdefault.jpg",
    tags: ["@budgetpadmanaban_", "budgetpadmanaban", "sip", "sipinvestment"],
    trending: true
  },
  {
    id: "vid-bp-002",
    youtubeId: "tbeKWtuqsIo",
    youtubeUrl: "https://www.youtube.com/watch?v=tbeKWtuqsIo",
    isShort: false,
    channelHandle: "@budgetpadmanaban_",
    channelUrl: "https://www.youtube.com/@budgetpadmanaban_",
    channelName: "Budget Padmanaban",
    titleTamil: "Mutual Fund-ல செய்ய வேண்டிய & செய்யக்கூடாத விஷயங்கள்!",
    titleEnglish: "Mutual Fund Do's & Don'ts! | Budget Padmanaban x Keshav",
    title: "Mutual Fund-ல செய்ய வேண்டிய & செய்யக்கூடாத விஷயங்கள்! | Budget Padmanaban x Keshav",
    descriptionTamil: "மியூச்சுவல் ஃபண்டில் முதலீடு செய்யும் போது செய்ய வேண்டியவை மற்றும் தவிர்க்க வேண்டிய தவறுகள் பற்றிய விரிவான விவாதம்.",
    descriptionEnglish: "A detailed discussion covering critical do's and don'ts when investing in mutual funds for long term compounding.",
    description: "A collaboration with Keshav covering do's and don'ts when investing in mutual funds, referencing a 10-year outlook.",
    category: "mutual-funds",
    publishedAt: "2025-03-05T00:00:00.000Z",
    duration: "14:20",
    views: 38200,
    thumbnail: "https://img.youtube.com/vi/tbeKWtuqsIo/hqdefault.jpg",
    tags: ["@budgetpadmanaban_", "budgetpadmanaban", "sip", "smallcap"],
    trending: true
  },
  {
    id: "vid-bp-003",
    youtubeId: "1EDLZlvMAZs",
    youtubeUrl: "https://www.youtube.com/watch?v=1EDLZlvMAZs",
    isShort: false,
    channelHandle: "@budgetpadmanaban_",
    channelUrl: "https://www.youtube.com/@budgetpadmanaban_",
    channelName: "Budget Padmanaban",
    titleTamil: "Budget is nothing but a forced Discipline | பட்ஜெட் பத்மநாபன்",
    titleEnglish: "Budgeting is Forced Discipline | Budget Padmanaban",
    title: "Budget is nothing but a forced Discipline | Budget Padmanaban",
    descriptionTamil: "பட்ஜெட் என்பது கட்டுப்பாடல்ல, அது உங்கள் பணத்தைக் கட்டுப்படுத்தும் ஒரு ஒழுக்கம் என்பதை விளக்கும் பதிவு.",
    descriptionEnglish: "Padmanaban frames budgeting as a form of enforced financial discipline rather than restriction.",
    description: "Padmanaban frames budgeting as a form of enforced financial discipline rather than restriction.",
    category: "personal-finance",
    publishedAt: "2024-09-27T00:00:00.000Z",
    duration: "11:15",
    views: 19400,
    thumbnail: "https://img.youtube.com/vi/1EDLZlvMAZs/hqdefault.jpg",
    tags: ["@budgetpadmanaban_", "budgetpadmanaban", "investment", "budgetplan"],
    trending: false
  },
  {
    id: "vid-bp-004",
    youtubeId: "qQSFlhPZx4s",
    youtubeUrl: "https://www.youtube.com/watch?v=qQSFlhPZx4s",
    isShort: false,
    channelHandle: "@budgetpadmanaban_",
    channelUrl: "https://www.youtube.com/@budgetpadmanaban_",
    channelName: "Budget Padmanaban",
    titleTamil: "Pledging of Mutual Fund Units | மியூச்சுவல் ஃபண்ட் அடமானம்",
    titleEnglish: "Pledging of Mutual Fund Units | Budget Padmanaban",
    title: "Pledging of Mutual Fund Units | Budget Padmanaban",
    descriptionTamil: "மியூச்சுவல் ஃபண்ட் யூனிட்களை அடமானம் வைத்து கடன் பெறுவது எப்படி? அதன் நன்மைகள் மற்றும் ரிஸ்க்.",
    descriptionEnglish: "Covers pledging mutual fund units, using them as collateral for loans without redeeming.",
    description: "Covers pledging mutual fund units, likely in the context of using them as loan collateral.",
    category: "mutual-funds",
    publishedAt: "2024-09-06T00:00:00.000Z",
    duration: "10:30",
    views: 15800,
    thumbnail: "https://img.youtube.com/vi/qQSFlhPZx4s/hqdefault.jpg",
    tags: ["@budgetpadmanaban_", "budgetpadmanaban", "investment", "money"],
    trending: false
  },
  {
    id: "vid-bp-005",
    youtubeId: "Nx9T5eCUBJU",
    youtubeUrl: "https://www.youtube.com/shorts/Nx9T5eCUBJU",
    isShort: true,
    channelHandle: "@budgetpadmanaban_",
    channelUrl: "https://www.youtube.com/@budgetpadmanaban_",
    channelName: "Budget Padmanaban",
    titleTamil: "புதிய முதலீட்டாளர்களுக்கு முதலீடு தொடங்க மியூச்சுவல் ஃபண்ட் தான் சிறந்தது!",
    titleEnglish: "Mutual Funds are the Best Starting Point | Budget Padmanaban",
    title: "Starting will be always Mutual Fund | Budget Padmanaban",
    descriptionTamil: "பங்குச்சந்தைக்கு வரும் புதிய முதலீட்டாளர்கள் ஏன் மியூச்சுவல் ஃபண்ட் மூலம் தொடங்க வேண்டும்?",
    descriptionEnglish: "A short explaining why mutual funds are the safest starting point for beginners.",
    description: "A short on why mutual funds are a common starting point for new investors.",
    category: "mutual-funds",
    publishedAt: "2024-08-25T00:00:00.000Z",
    duration: "01:00",
    views: 42100,
    thumbnail: "https://img.youtube.com/vi/Nx9T5eCUBJU/hqdefault.jpg",
    tags: ["@budgetpadmanaban_", "budgetpadmanaban", "investment", "mutualfunds"],
    trending: true
  },
  {
    id: "vid-bp-006",
    youtubeId: "_PErKVVMtBg",
    youtubeUrl: "https://www.youtube.com/shorts/_PErKVVMtBg",
    isShort: true,
    channelHandle: "@budgetpadmanaban_",
    channelUrl: "https://www.youtube.com/@budgetpadmanaban_",
    channelName: "Budget Padmanaban",
    titleTamil: "Mutual Fund-ல எது Best? Regular Plan vs Direct Plan",
    titleEnglish: "Regular Plan vs Direct Plan | Budget Padmanaban",
    title: "Mutual Fund-ல எது Best? Regular Plan vs Direct Plan | Budget Padmanaban",
    descriptionTamil: "ரெகுலர் பிளான் மற்றும் டைரக்ட் பிளான் ஒப்பீடு - உங்கள் லாபத்தில் எவ்வளவு வித்தியாசம் வரும்?",
    descriptionEnglish: "A short comparing regular and direct mutual fund plans and expense ratio impacts.",
    description: "A short comparing regular and direct mutual fund plans.",
    category: "mutual-funds",
    publishedAt: "2024-08-28T00:00:00.000Z",
    duration: "01:00",
    views: 31500,
    thumbnail: "https://img.youtube.com/vi/_PErKVVMtBg/hqdefault.jpg",
    tags: ["@budgetpadmanaban_", "budgetpadmanaban", "investment", "money", "mutualfunds"],
    trending: false
  },
  {
    id: "vid-bp-007",
    youtubeId: "iFFLA8_14ao",
    youtubeUrl: "https://www.youtube.com/shorts/iFFLA8_14ao",
    isShort: true,
    channelHandle: "@budgetpadmanaban_",
    channelUrl: "https://www.youtube.com/@budgetpadmanaban_",
    channelName: "Budget Padmanaban",
    titleTamil: "Mutual Fund-லயும் ஏற்ற இறக்கம் உண்டு | பட்ஜெட் பத்மநாபன்",
    titleEnglish: "Mutual Funds Also Have Volatility | Budget Padmanaban",
    title: "Mutual Fund-லயும் ஏற்ற இறக்கம் உண்டு | Budget Padmanaban",
    descriptionTamil: "மியூச்சுவல் ஃபண்டுகளும் சந்தை ஏற்ற இறக்கத்திற்கு உட்பட்டவை என்பதை நினைவில் கொள்ளவும்.",
    descriptionEnglish: "A short reminder that mutual funds also experience market ups and downs.",
    description: "A short reminder that mutual funds also go through ups and downs, not just steady growth.",
    category: "mutual-funds",
    publishedAt: "2024-11-02T00:00:00.000Z",
    duration: "01:00",
    views: 28900,
    thumbnail: "https://img.youtube.com/vi/iFFLA8_14ao/hqdefault.jpg",
    tags: ["@budgetpadmanaban_", "budgetpadmanaban", "motivation", "savings", "mutualfunds"],
    trending: false
  },
  {
    id: "vid-bp-008",
    youtubeId: "R4xpW2nLj8s",
    youtubeUrl: "https://www.youtube.com/shorts/R4xpW2nLj8s",
    isShort: true,
    channelHandle: "@budgetpadmanaban_",
    channelUrl: "https://www.youtube.com/@budgetpadmanaban_",
    channelName: "Budget Padmanaban",
    titleTamil: "நான் ஏன் இந்த துறையை தேர்ந்தெடுத்தேன்? | பட்ஜெட் பத்மநாபன்",
    titleEnglish: "Why I Chose Financial Advisory? | Budget Padmanaban",
    title: "Why I am choosing this Field? | Budget Padmanaban",
    descriptionTamil: "பட்ஜெட் பத்மநாபன் தனது நிதி ஆலோசகர் பயணத்தைப் பற்றிப் பேசுகிறார்.",
    descriptionEnglish: "Padmanaban talks about why he chose a career in financial planning.",
    description: "Padmanaban talks about why he chose a career in financial planning.",
    category: "personal-finance",
    publishedAt: "2024-10-17T00:00:00.000Z",
    duration: "01:00",
    views: 35100,
    thumbnail: "https://img.youtube.com/vi/R4xpW2nLj8s/hqdefault.jpg",
    tags: ["@budgetpadmanaban_", "budgetpadmanaban", "middlebudget", "investment", "money", "sharemarket"],
    trending: true
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
    author: "Dhanavriksha Research Desk",
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

async function getLatestVideos(language = "ta", category = "all") {
  await new Promise(resolve => setTimeout(resolve, 50));
  let list = [...videosData];
  if (category && category !== "all") {
    list = list.filter(v => v.category === category);
  }
  return list.map(v => translateVideo(v, language));
}

async function getVideoById(id, language = "ta") {
  await new Promise(resolve => setTimeout(resolve, 30));
  const video = videosData.find(v => v.id === id || v.youtubeId === id);
  return video ? translateVideo(video, language) : null;
}

async function getRelatedVideos(currentId, language = "ta") {
  await new Promise(resolve => setTimeout(resolve, 30));
  const filtered = videosData.filter(v => v.id !== currentId && v.youtubeId !== currentId);
  return filtered.slice(0, 4).map(v => translateVideo(v, language));
}

async function searchVideos(query, language = "ta") {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const matches = videosData.filter(v => {
    const titleT = (v.titleTamil || v.title || "").toLowerCase();
    const titleE = (v.titleEnglish || v.title || "").toLowerCase();
    const descT = (v.descriptionTamil || v.description || "").toLowerCase();
    const descE = (v.descriptionEnglish || v.description || "").toLowerCase();
    return (
      titleT.includes(q) ||
      titleE.includes(q) ||
      descT.includes(q) ||
      descE.includes(q) ||
      (v.tags && v.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  });
  return matches.map(v => translateVideo(v, language));
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
  const [theme, setThemeState] = useState(() => localStorage.getItem("dhanavriksha_theme") || "light");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setThemeState(nextTheme);
    localStorage.setItem("dhanavriksha_theme", nextTheme);
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

// ==================== 4. HOOKS ====================
function useVideos(category = "all") {
  const { language } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getLatestVideos(language, category).then(data => {
      if (isMounted) {
        setVideos(data);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [language, category]);

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

function useWatchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem("dhanavriksha_watch_history");
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  });

  const addToHistory = (video) => {
    if (!video || !video.id) return;
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== video.id);
      const updated = [{ ...video, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 10);
      localStorage.setItem("dhanavriksha_watch_history", JSON.stringify(updated));
      return updated;
    });
  };

  return { history, addToHistory };
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

function Header({ onOpenSearch }) {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 border-b border-slate-200 dark:border-slate-800 backdrop-blur-glass ${isScrolled ? 'py-2.5 shadow-lg bg-white/90 dark:bg-slate-950/90' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left Side: Welcome Badge */}
        <div className="hidden sm:flex items-center gap-2 min-w-[140px] md:min-w-[180px] shrink-0">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>👋 {t('welcome')}</span>
          </span>
        </div>

        {/* Center: Brand Logo & Title (Mudhalidu Thesai / முதல�€�Ÿு தி�š�ˆ) */}
        <a href="#/" className="flex items-center gap-3 group mx-auto text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300 border border-amber-400/40 shrink-0">
            <svg className="w-6 h-6 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" className="opacity-35" strokeWidth="1.5" />
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2" opacity="0.5" strokeWidth="1.5" />
              <path d="M16 8L8 16M16 8H10M16 8V14" stroke="#fef3c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-serif group-hover:text-amber-600 transition-colors whitespace-nowrap">
                {t('siteName')}
              </h1>
              <span className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('welcome')}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </a>

        {/* Right Side: Search + Language + Theme */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 min-w-[140px] md:min-w-[180px] shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="hidden md:inline">{t('searchTitle')}</span>
            <kbd className="hidden md:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md border border-slate-300 dark:border-slate-600">
              âŒ˜K
            </kbd>
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Navbar({ currentPath, onNavigate }) {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', hash: '#/', label: t('nav.home') },
    { id: 'videos', hash: '#/videos', label: t('nav.videos') },
    { id: 'news', hash: '#/news', label: t('nav.news') },
    { id: 'mutual-funds', hash: '#/category/mutual-funds', label: t('nav.mutualFunds') },
    { id: 'stocks', hash: '#/category/stocks', label: t('nav.stocks') },
    { id: 'personal-finance', hash: '#/category/personal-finance', label: t('nav.personalFinance') },
    { id: 'calculator', hash: '#/calculator', label: t('nav.calculator') },
    { id: 'quiz', hash: '#/quiz', label: t('nav.quiz') }
  ];

  return (
    <nav className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-xl relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:flex items-center justify-between gap-2 py-1.5">
          <div className="flex items-center justify-between flex-1 gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.hash || (item.hash === '#/' && currentPath === '');
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.hash)}
                  className={`relative px-3 py-2 text-xs font-extrabold transition-all rounded-lg whitespace-nowrap ${isActive ? 'bg-amber-500/15 text-amber-400 shadow-sm border border-amber-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}

                >
                  {item.label}
                  {isActive && <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-amber-500 rounded-full" />}
                </button>
              );
            })}
          </div>

          <a
            href={OFFICIAL_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-black text-white bg-red-600 hover:bg-red-700 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg shadow-md shadow-red-600/30 transition-all hover:scale-105 shrink-0 ml-3 border border-red-500/30"
          >
            <span className="text-amber-300">▶</span>
            <span>Official YouTube</span>
          </a>
        </div>

        <div className="lg:hidden flex items-center justify-between h-12">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {navItems.find(i => i.hash === currentPath)?.label || t('nav.home')}
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-3 pb-5 space-y-1.5 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.hash); setMobileOpen(false); }}
              className={`block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                currentPath === item.hash ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <a
            href={OFFICIAL_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-extrabold text-white bg-red-600 mt-3"
          >
            ðŸ”´ Visit {OFFICIAL_CHANNEL_HANDLE}
          </a>
        </div>
      )}
    </nav>
  );
}

function TrendingTicker() {
  const { t, language } = useLanguage();

  const tickerHeadlines = language === 'ta' ? [
    "@budgetpadmanaban_ புதிய வ�€�Ÿிய�‹: மிய�‚�š்�šுவல் �ƒபண்�Ÿ் �š�†ய்ய வ�‡ண்�Ÿியவ�ˆ & �š�†ய்ய�•்�•�‚�Ÿாதவ�ˆ!",
    "NIFTY 50 புதிய �‰�š்�šமான 24,850 புள்ளி�•ள�ˆத் த�Š�Ÿ்�Ÿது!",
    "�†ர்பிஐ வ�Ÿ்�Ÿி வி�•ிதத்தில் மாற்றமில்ல�ˆ - ஹ�‹ம் ல�‹ன் �‡�Žம்ஐ �šும�ˆ �…தி�•ரி�•்�•ாது!",
    "SIP ம�‚லம் â‚¹1 �•�‹�Ÿி நிதி �‡ல�•்�•�ˆ �…�Ÿ�ˆவது �Žப்ப�Ÿி? புதிய �•ண�•்�•�€�Ÿ்�Ÿு �•ருவிய�ˆப் பாரு�™்�•ள்!"
  ] : [
    "@budgetpadmanaban_ New Video: Mutual Fund Do's & Don'ts Guide!",
    "NIFTY 50 touches record high of 24,850 points!",
    "RBI keeps Repo Rate unchanged at 6.50% - Fixed Deposit & EMI outlook steady!",
    "How to reach â‚¹1 Crore through disciplined SIPs? Try our interactive calculator!"
  ];

  return (
    <div className="bg-slate-950 text-slate-100 border-b border-slate-800 text-xs py-2.5 overflow-hidden select-none shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3.5">
        <div className="flex items-center gap-2 shrink-0 bg-red-600 text-white font-black px-3 py-1 rounded-md text-[10px] uppercase tracking-wider shadow-md">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          {t('tickerLabel')}
        </div>

        <div className="overflow-hidden relative w-full flex items-center">
          <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
            <div className="flex items-center gap-3 border-r border-slate-800 pr-8">
              <span className="text-amber-400 font-extrabold uppercase text-[10px] tracking-wider">
                {t('marketTitle')}:
              </span>
              {marketSnapshotData.map((item, idx) => (
                <div key={idx} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-bold ${item.isUp ? 'market-up' : 'market-down'}`}>
                  <span>{item.symbol}</span>
                  <span className="text-slate-200">{item.value}</span>
                  <span className="text-[10px]">{item.isUp ? 'â–²' : 'â–¼'} {item.percent}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-8 font-medium">
              {tickerHeadlines.map((headline, idx) => (
                <span key={idx} className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-2 text-slate-300">
                  <span className="text-amber-500 font-black">â€¢</span>
                  {headline}
                </span>
              ))}
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
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 250);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchVideos(debouncedQuery, language).then(data => {
      setResults(data);
      setIsSearching(false);
      setSelectedIndex(0);
    });
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

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      onNavigate(`#/videos/${results[selectedIndex].id}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  const popularTags = ["@budgetpadmanaban_", "SIP", "NIFTY 50", "Mutual Fund", "Large Cap", "Tax Saving"];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
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

        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {isSearching && <div className="py-8 text-center text-slate-400 text-sm animate-pulse font-medium">{t('searchPlaceholder')}...</div>}

          {!isSearching && query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">{t('noResults')} "{query}"</div>
          )}

          {!query.trim() && (
            <div>
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

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => { onNavigate(`#/videos/${item.id}`); onClose(); }}
                  className={`p-3 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all ${
                    idx === selectedIndex ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <img src={item.thumbnail} alt="" className="w-16 h-10 object-cover rounded-xl shrink-0 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.description}</p>
                  </div>
                  <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400">{item.category}</span>
                </div>
              ))}
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

        <span className="absolute bottom-3 right-3 px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-md bg-slate-950/85 text-white backdrop-blur-md border border-white/10">{video.duration || (video.isShort ? 'Short' : '10:00')}</span>

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleBookmark}
            className="p-1.5 rounded-md bg-slate-950/70 text-white hover:bg-amber-600 transition-colors backdrop-blur-md"
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
            {OFFICIAL_CHANNEL_HANDLE} â†—
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

function HeroSection({ news = newsData, onNavigate }) {
  const { t, language } = useLanguage();

  const featuredStories = news && news.length > 0 ? news : newsData;
  const trendingStories = newsData.slice(0, 5);

  // Duplicate for seamless loop
  const marqueeItems = [...featuredStories, ...featuredStories];

  const getHeadline = (item) => {
    return language === 'ta' ? item.titleTamil : (item.titleEnglish || item.titleTamil);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <h2 className="text-xs font-black tracking-widest uppercase text-amber-600 dark:text-amber-400 font-serif">
            {t('featuredNews') || '�šிறப்பு�š் �š�†ய்தி�•ள்'}
          </h2>
        </div>
        <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-2 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>LIVE FINANCIAL COVERAGE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT: CONTINUOUS MARQUEE FEATURED NEWS */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-slate-950 lg:h-[260px] border border-slate-200 dark:border-slate-800 shadow-xl select-none group/marquee">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-red-600 text-white font-black px-3 py-1.5 rounded-xl text-[10px] tracking-wider uppercase shadow-lg">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{t('tickerLabel') || 'மு�•்�•ிய �š�†ய்தி�•ள்'}</span>
          </div>

          <div className="h-full overflow-hidden flex items-stretch">
            <div className="animate-featured-marquee group-hover/marquee:paused flex items-stretch gap-0 h-full">
              {marqueeItems.map((item, idx) => (
                <div
                  key={`feat-${item.id}-${idx}`}
                  onClick={() => onNavigate && onNavigate(`#/news/${item.slug}`)}
                  className="group relative flex-shrink-0 w-[240px] sm:w-[280px] h-full cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.thumbnail}
                    alt={getHeadline(item)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5 z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-amber-500 text-slate-950 shadow">
                        {(item.category || 'finance').replace('-', ' ')}
                      </span>
                      <span className="text-[9px] font-mono text-slate-300 bg-slate-900/70 px-2 py-0.5 rounded-full">
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white font-serif leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors drop-shadow-md">
                      {getHeadline(item)}
                    </h3>
                    {item.titleEnglish && language === 'ta' && (
                      <p className="text-[11px] text-amber-300/80 font-medium line-clamp-1">{item.titleEnglish}</p>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 w-px h-full bg-slate-800/60" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: TRENDING ARTICLES */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                {t('trendingArticlesTitle') || '�Ÿிர�†ண்�Ÿி�™் �š�†ய்தி�•ள்'}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              🔥 Trending
            </span>
          </div>
          <div className="space-y-3 flex-1 flex flex-col justify-around">
            {trendingStories.slice(0, 2).map((article, idx) => {
              const rankStr = article.rank || `0${idx + 1}`;
              const title = getHeadline(article);
              return (
                <div
                  key={article.id}
                  onClick={() => onNavigate && onNavigate(`#/news/${article.slug}`)}
                  className="group flex items-start gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50"
                >
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-serif w-7 shrink-0 text-center leading-none mt-1">
                    {rankStr}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                        {article.category.replace('-', ' ')}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        â€¢ {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif leading-snug">
                      {title}
                    </h4>
                  </div>
                  {article.thumbnail && (
                    <img
                      src={article.thumbnail}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrendingArticlesSection({ onNavigate }) {
  const { t, language } = useLanguage();
  const trendingArticles = newsData.slice(0, 2);

  const getSummary = (item) => {
    return language === 'ta' ? item.summaryTamil : (item.summaryEnglish || item.summaryTamil);
  };

  const getHeadline = (item) => {
    return language === 'ta' ? item.titleTamil : (item.titleEnglish || item.titleTamil);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-serif">
            {t('trendingArticlesTitle')}
          </h2>
        </div>
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
          🔥 Trending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {trendingArticles.map((article, idx) => {
          const rankStr = (idx + 1).toString().padStart(2, '0');
          const title = getHeadline(article);
          const summary = getSummary(article);
          return (
            <article
              key={article.id}
              onClick={() => onNavigate && onNavigate(`#/news/${article.slug}`)}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-amber-400/50 dark:hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row h-auto sm:h-44"
            >
              {/* Compact Thumbnail (Left on sm+, top on mobile) */}
              <div className="relative w-full sm:w-5/12 h-36 sm:h-full overflow-hidden bg-slate-950 shrink-0">
                <img
                  src={article.thumbnail}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-slate-950/40" />
                <span className="absolute top-2.5 left-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-amber-500 text-slate-950 font-black text-xs font-serif shadow-md">
                  {rankStr}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-slate-950/80 text-amber-400 backdrop-blur-sm border border-amber-500/20">
                  {(article.category || 'finance').replace('-', ' ')}
                </span>
              </div>

              {/* Content (Right on sm+) */}
              <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 min-w-0">
                <div className="space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif leading-snug">
                    {title}
                  </h3>
                  {summary && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                      {summary}
                    </p>
                  )}
                </div>

                <div className="pt-2.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 font-mono">
                    <span>📅</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    <span>{t('readArticle')}</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
function TrustStatsBar() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <div className="space-y-0.5">
          <span className="text-lg font-black text-amber-600 font-mono">100%</span>
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Verified Advice</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-lg font-black text-emerald-600 font-mono">CFP</span>
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Certified Planner</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-lg font-black text-amber-600 font-mono">தமிழ் & EN</span>
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Bilingual Platform</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-lg font-black text-red-600 font-mono">@budgetpadmanaban_</span>
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Official Channel</p>
        </div>
      </div>
    </div>
  );
}

function VideoGrid({ videos = [], isLoading = false, onSelectVideo, activeCategory = 'all', onCategoryChange, onShowToast }) {
  const { t } = useLanguage();
  const [displayCount, setDisplayCount] = useState(4);

  const categories = [
    { id: 'all', label: t('filterAll') },
    { id: 'mutual-funds', label: t('nav.mutualFunds') },
    { id: 'stocks', label: t('nav.stocks') },
    { id: 'personal-finance', label: t('nav.personalFinance') }
  ];

  const visibleVideos = videos.slice(0, displayCount);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
            {t('latestVideos') || '�šம�€பத்திய வ�€�Ÿிய�‹�•்�•ள்'}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onCategoryChange(cat.id); setDisplayCount(4); }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                activeCategory === cat.id ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleVideos.map((video) => (
            <VideoCard key={video.id} video={video} onSelect={onSelectVideo} onShowToast={onShowToast} />
          ))}
        </div>
      )}

      {displayCount < videos.length && !isLoading && (
        <div className="text-center pt-4">
          <button
            onClick={() => setDisplayCount(prev => prev + 5)}
            className="px-5 py-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white transition-colors"
          >
            Load More Videos
          </button>
        </div>
      )}
    </section>
  );
}

function MiniPlayer({ video, isVisible, onClose, onExpand }) {
  if (!video || !isVisible) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl animate-fadeIn">
      <div className="relative aspect-video bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&mute=1`}
          title={video.title}
          className="w-full h-full pointer-events-none"
          allow="autoplay"
        />
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button onClick={onExpand} className="p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-amber-600 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-red-600 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <div className="p-3.5 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400">{OFFICIAL_CHANNEL_HANDLE} Mini Player</span>
          <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{video.title}</h5>
        </div>
        <button onClick={onExpand} className="px-3 py-1.5 text-[11px] font-black rounded-lg bg-amber-600 text-white hover:bg-amber-700">Expand</button>
      </div>
    </div>
  );
}

function VideoSection({ title, subtitle, videos = [], onSelectVideo, categoryBadge }) {
  const { t } = useLanguage();
  if (!videos || videos.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {categoryBadge && (
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {categoryBadge}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {videos.slice(0, 5).map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onSelect={onSelectVideo}
          />
        ))}
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

  const calculatorCards = [
    {
      id: 'sip',
      titleTamil: 'SIP Calculator',
      titleEnglish: 'SIP Calculator',
      subtitleTamil: 'மாதாந்திர SIP �•ண�•்�•�€�Ÿு',
      subtitleEnglish: 'Monthly Systematic Investment',
      icon: 'ðŸ“Š',
      badge: 'POPULAR'
    },
    {
      id: 'lumpsum',
      titleTamil: 'Lump Sum Calculator',
      titleEnglish: 'Lump Sum Calculator',
      subtitleTamil: '�’ர�‡ முற�ˆ முதல�€�Ÿு',
      subtitleEnglish: 'One-Time Investment Growth',
      icon: 'ðŸ’°',
      badge: 'SIMPLE'
    },
    {
      id: 'stepup',
      titleTamil: 'Investment Returns Calculator',
      titleEnglish: 'Returns Calculator',
      subtitleTamil: '�†ண்�Ÿு �‰யர்வு +10% முதல�€�Ÿு',
      subtitleEnglish: 'Step-Up Annual Incremental Growth',
      icon: 'ðŸš€',
      badge: 'HIGH GROWTH'
    },
    {
      id: 'compound',
      titleTamil: 'Compound Interest Calculator',
      titleEnglish: 'Compound Interest',
      subtitleTamil: '�•�‚�Ÿ்�Ÿு வ�Ÿ்�Ÿி வளர்�š்�šி',
      subtitleEnglish: 'Power of Compounding Growth',
      icon: 'âš¡',
      badge: 'WEALTH'
    }
  ];

  return (
    <section id="financial-calculators" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          FINANCIAL TOOLS
        </span>
        <h2 className="text-2xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white">
          {t('financialCalculators') || (isTamil ? "நிதி �•ண�•்�•�€�Ÿ்�Ÿு�•் �•ருவி�•ள்" : "Financial Calculators")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {t('financialCalculatorsDesc') || (isTamil 
            ? "SIP, �’ர�‡ முற�ˆ முதல�€�Ÿு, முதல�€�Ÿ்�Ÿு வருவாய் மற்றும் �•�‚�Ÿ்�Ÿு வ�Ÿ்�Ÿி �†�•ியவற்ற�ˆ�•் �•ண�•்�•ி�Ÿ �‰தவும் நிதி�š் �šாதன�™்�•ள்." 
            : "Plan your long-term wealth creation with accurate returns, step-ups, and inflation adjustments.")}
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
                <span>â†’</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black font-serif text-white flex items-center gap-2">
              <span>âš¡</span>
              <span>
                {calcMode === 'sip' && (isTamil ? "SIP முதல�€�Ÿ்�Ÿு �•ண�•்�•ி�Ÿுவான்" : "SIP Returns Calculator")}
                {calcMode === 'lumpsum' && (isTamil ? "�’ர�‡ முற�ˆ (Lump Sum) முதல�€�Ÿ்�Ÿு �•ண�•்�•ி�Ÿுவான்" : "Lump Sum Returns Calculator")}
                {calcMode === 'stepup' && (isTamil ? "முதல�€�Ÿ்�Ÿு �‰யர்வு (Step-Up SIP) �•ண�•்�•ி�Ÿுவான்" : "Step-Up SIP Calculator")}
                {calcMode === 'compound' && (isTamil ? "�•�‚�Ÿ்�Ÿு வ�Ÿ்�Ÿி (Compound Interest) �•ண�•்�•ி�Ÿுவான்" : "Compound Interest Calculator")}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isTamil ? "�‰�™்�•ளின் ந�€ண்�Ÿ �•ால முதல�€�Ÿ்�Ÿு �‡ல�•்�•�ˆ �…�Ÿ�ˆய துல்லியமான �•ணிப்பு" : "Interactive asset compounding and inflation-adjusted growth projections"}
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

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Quick Goals:</span>
          <button onClick={() => applyPresetGoal(5000, 12, 15)} className="px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold">â‚¹1 Crore Goal (â‚¹5k/mo)</button>
          <button onClick={() => applyPresetGoal(10000, 14, 10)} className="px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold">â‚¹50 Lakh Goal (â‚¹10k/mo)</button>
          <button onClick={() => applyPresetGoal(25000, 12, 5)} className="px-3 py-1 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white transition-colors font-bold">â‚¹20 Lakh Short Term</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 bg-slate-800/40 p-6 rounded-3xl border border-slate-800">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-300">
                  {calcMode === 'lumpsum' || calcMode === 'compound' ? (isTamil ? 'முதல�€�Ÿ்�Ÿுத் த�Š�•�ˆ (â‚¹)' : 'Initial Investment (â‚¹)') : t('monthlyInvestment')}
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
    <section id="quiz" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">INTERACTIVE QUIZ</span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif">Find Your Mutual Fund Match</h3>
        </div>

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

function NewsCard({ article, onSelect }) {
  const { t } = useLanguage();
  if (!article) return null;

  const formattedDate = new Intl.DateTimeFormat(
    article.activeLang === 'ta' ? 'ta-IN' : 'en-IN',
    { month: 'short', day: 'numeric', year: 'numeric' }
  ).format(new Date(article.publishedAt));

  return (
    <article
      onClick={() => onSelect(article)}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm card-hover-glow cursor-pointer flex flex-col justify-between h-full"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
        <img src={article.thumbnail} alt={article.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-slate-950/85 text-amber-400 backdrop-blur-md">{article.category}</span>
        <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-black uppercase rounded-md bg-red-600 text-white">{OFFICIAL_CHANNEL_HANDLE}</span>
      </div>

      <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 transition-colors font-serif leading-snug">{article.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">{article.summary}</p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 font-semibold">
          <span>{formattedDate}</span>
          <span className="font-mono text-amber-700 dark:text-amber-400">⏱ {article.readTimeMinutes} {t('minRead')}</span>
        </div>
      </div>
    </article>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-amber-500/40 flex items-center gap-2.5 animate-fadeIn">
      <span className="text-amber-400 text-base">âœ“</span>
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
    onShowToast(t('subscribedToast'));
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg">தன</div>
              <span className="text-2xl font-black text-white font-serif">{t('siteName')}</span>
              <a href={OFFICIAL_CHANNEL_URL} target="_blank" rel="noreferrer" className="text-xs font-bold text-red-500 hover:underline">
                {OFFICIAL_CHANNEL_HANDLE} â†—
              </a>
            </div>
            <p className="text-xs text-slate-400 max-w-md font-medium">{t('newsLetterDesc')}</p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com" required className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500" />
              <button type="submit" className="px-5 py-2.5 rounded-2xl bg-amber-600 text-white font-black text-xs hover:bg-amber-500 transition-colors shadow-md">{t('subscribe')}</button>
            </form>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">{t('nav.mutualFunds')} & {t('nav.stocks')}</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><button onClick={() => onNavigate('#/category/mutual-funds')} className="hover:text-white">{t('nav.mutualFunds')}</button></li>
              <li><button onClick={() => onNavigate('#/category/stocks')} className="hover:text-white">{t('nav.stocks')}</button></li>
              <li><button onClick={() => onNavigate('#/category/personal-finance')} className="hover:text-white">{t('nav.personalFinance')}</button></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Official Channel</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><a href={OFFICIAL_CHANNEL_URL} target="_blank" rel="noreferrer" className="hover:text-red-400">ðŸ”´ YouTube: {OFFICIAL_CHANNEL_HANDLE}</a></li>
              <li><button onClick={() => onNavigate('#/calculator')} className="hover:text-white">{t('sipCalculatorTitle')}</button></li>
              <li><button onClick={() => onNavigate('#/quiz')} className="hover:text-white">Mutual Fund Quiz</button></li>
              <li><button onClick={() => onNavigate('#/videos')} className="hover:text-white">Video Catalog</button></li>
            </ul>
          </div>
        </div>

        <div className="space-y-2 text-[11px] text-slate-500 leading-relaxed">
          <h5 className="font-black text-slate-400 uppercase text-[10px] tracking-wider">{t('footerDisclaimerTitle')}</h5>
          <p>{t('footerDisclaimerText')}</p>
        </div>

        <div className="pt-4 text-center text-xs text-slate-500 font-bold">{t('copyright')}</div>
      </div>
    </footer>
  );
}

// ==================== 6. PAGES ====================
function Home({ onNavigate, onShowToast }) {
  const { t, language } = useLanguage();
  const { videos, isLoading } = useVideos('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const translatedNews = newsData.map(item => translateNewsArticle(item, language));

  const mutualFundNews = translatedNews.filter(n => n.category === 'mutual-funds');
  const stockNews = translatedNews.filter(n => n.category === 'stocks');
  const personalFinanceNews = translatedNews.filter(n => n.category === 'personal-finance' || n.category === 'investment');

  const mutualFundVideos = videos.filter(v => v.category === 'mutual-funds');
  const stockVideos = videos.filter(v => v.category === 'stocks');
  const sipVideos = videos.filter(v => v.category === 'personal-finance' || v.category === 'education');

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. FEATURED NEWS SLIDER (LEFT) + TRENDING ARTICLES (RIGHT) */}
      <HeroSection news={translatedNews} onNavigate={onNavigate} />

      {/* 2. LATEST VIDEOS */}
      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)}
        onShowToast={onShowToast}
      />

      {/* 3. TRENDING ARTICLES */}
      <TrendingArticlesSection onNavigate={onNavigate} />

      {/* 4. MUTUAL FUND NEWS */}
      {mutualFundNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
                {t('nav.mutualFunds')} â€” {t('nav.news')}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              MUTUAL FUNDS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mutualFundNews.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                onSelect={() => onNavigate(`#/news/${article.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. STOCK MARKET NEWS */}
      {stockNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
                {t('nav.stocks')} â€” {t('nav.news')}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              STOCKS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stockNews.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                onSelect={() => onNavigate(`#/news/${article.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. SIP / INVESTMENT NEWS */}
      {personalFinanceNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
                SIP & {t('nav.personalFinance')} â€” {t('nav.news')}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              INVESTMENTS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalFinanceNews.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                onSelect={() => onNavigate(`#/news/${article.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. MORE VIDEO SECTIONS */}
      <VideoSection
        title={t('mutualFundVideos') || 'மிய�‚�š்�šுவல் �ƒபண்�Ÿ் வ�€�Ÿிய�‹�•்�•ள்'}
        subtitle="Budget Padmanaban Mutual Fund Guides & Reviews"
        videos={mutualFundVideos.length > 0 ? mutualFundVideos : videos.slice(0, 5)}
        onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)}
        categoryBadge="MUTUAL FUNDS"
      />

      <VideoSection
        title={t('stockMarketVideos') || 'ப�™்�•ு�š் �šந்த�ˆ வ�€�Ÿிய�‹�•்�•ள்'}
        subtitle="Stock Market Analysis & Investment Strategies"
        videos={stockVideos.length > 0 ? stockVideos : videos.slice(1, 5)}
        onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)}
        categoryBadge="STOCKS"
      />

      <VideoSection
        title={t('sipVideos') || 'SIP & முதல�€�Ÿ்�Ÿு வ�€�Ÿிய�‹�•்�•ள்'}
        subtitle="Financial Education & Wealth Building Tips"
        videos={sipVideos.length > 0 ? sipVideos : videos.slice(2, 5)}
        onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)}
        categoryBadge="SIP & INVESTMENTS"
      />

      {/* 8. FINANCIAL CALCULATORS (BOTTOM) */}
      <SipCalculator />
    </div>
  );
}

function VideosPage({ onNavigate, onShowToast }) {
  const { t } = useLanguage();
  const [category, setCategory] = useState('all');
  const { videos, isLoading } = useVideos(category);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif">{t('nav.videos')} Feed</h1>
        <a href={OFFICIAL_CHANNEL_URL} target="_blank" rel="noreferrer" className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline mt-1 inline-block">
          Official Channel: {OFFICIAL_CHANNEL_HANDLE} â†—
        </a>
      </div>

      <VideoGrid videos={videos} isLoading={isLoading} activeCategory={category} onCategoryChange={setCategory} onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)} onShowToast={onShowToast} />
    </div>
  );
}

function VideoDetailsPage({ videoId, onNavigate, onShowToast }) {
  const { t, language } = useLanguage();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);
  const { addToHistory } = useWatchHistory();
  const playerRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    let isMounted = true;
    getVideoById(videoId, language).then(data => {
      if (isMounted) {
        setVideo(data);
        setIsLoading(false);
        if (data) addToHistory(data);
      }
    });

    getRelatedVideos(videoId, language).then(rel => {
      if (isMounted) setRelated(rel);
    });

    return () => { isMounted = false; };
  }, [videoId, language]);

  useEffect(() => {
    const handleScroll = () => {
      if (!playerRef.current) return;
      const rect = playerRef.current.getBoundingClientRect();
      setIsMiniPlayerVisible(rect.bottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast(t('copiedToast'));
    }
  };

  if (isLoading) return <div className="py-12 text-center text-slate-500 font-bold">Loading Video...</div>;
  if (!video) return <div className="py-16 text-center font-bold">Video Not Found</div>;

  const formattedDate = video.publishedAt ? new Intl.DateTimeFormat(language === 'ta' ? 'ta-IN' : 'en-IN', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(video.publishedAt)) : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div ref={playerRef} className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-200 dark:border-slate-800">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="space-y-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-black uppercase rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400">{video.category}</span>
                <a href={video.youtubeUrl || OFFICIAL_CHANNEL_URL} target="_blank" rel="noreferrer" className="text-xs font-black text-red-600 dark:text-red-500 hover:underline">
                  {OFFICIAL_CHANNEL_HANDLE} â†—
                </a>
              </div>
              <button onClick={handleShare} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-200">{t('share')}</button>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">{video.title}</h1>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-b border-slate-100 dark:border-slate-800 py-3.5 font-bold">
              <span>{(video.views || 18500).toLocaleString()} {t('views')}</span>
              <span>â€¢</span>
              <span>{t('publishedAt')}: {formattedDate}</span>
              <span>â€¢</span>
              <span className="font-mono text-amber-700 dark:text-amber-400">⏱ {video.duration || (video.isShort ? 'Short' : '10:00')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{video.description}</p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white font-serif border-b border-slate-200 dark:border-slate-800 pb-3">{t('relatedVideos')}</h3>
          <div className="space-y-4">
            {related.map(rel => (
              <VideoCard key={rel.id} video={rel} onSelect={(v) => onNavigate(`#/videos/${v.id}`)} onShowToast={onShowToast} />
            ))}
          </div>
        </div>
      </div>

      <MiniPlayer video={video} isVisible={isMiniPlayerVisible} onClose={() => setIsMiniPlayerVisible(false)} onExpand={() => { setIsMiniPlayerVisible(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
}

function NewsPage({ onNavigate }) {
  const { t, language } = useLanguage();
  const articles = newsData.map(item => translateNewsArticle(item, language));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif">{t('nav.news')} Hub</h1>
        <a href={OFFICIAL_CHANNEL_URL} target="_blank" rel="noreferrer" className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline mt-1 inline-block">
          Official Channel: {OFFICIAL_CHANNEL_HANDLE} â†—
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map(article => (
          <NewsCard key={article.id} article={article} onSelect={() => onNavigate(`#/news/${article.slug}`)} />
        ))}
      </div>
    </div>
  );
}

function NewsDetailsPage({ slug, onNavigate }) {
  const { t, language } = useLanguage();
  const rawArticle = newsData.find(a => a.slug === slug) || newsData[0];
  const article = translateNewsArticle(rawArticle, language);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="px-3 py-1 text-xs font-black uppercase rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400">{article.category}</span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif">{article.title}</h1>
      </div>
      <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
        <img src={article.thumbnail} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="prose dark:prose-invert text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: article.content }} />
      <button onClick={() => onNavigate('#/news')} className="px-6 py-3 rounded-full bg-slate-900 text-white font-black text-xs hover:bg-amber-600 transition-colors">â† Back to News</button>
    </div>
  );
}

function CategoryPage({ categoryId, onNavigate, onShowToast }) {
  const { t } = useLanguage();
  const { videos, isLoading } = useVideos(categoryId);
  return (
    <div className="py-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif">{categoryId.toUpperCase()} Feed</h1>
      </div>
      <VideoGrid videos={videos} isLoading={isLoading} activeCategory={categoryId} onCategoryChange={(cat) => onNavigate(`#/category/${cat}`)} onSelectVideo={(v) => onNavigate(`#/videos/${v.id}`)} onShowToast={onShowToast} />
    </div>
  );
}

// ==================== 7. ROOT APP ====================
function App() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
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
    if (currentHash.startsWith('#/videos/')) {
      const videoId = currentHash.replace('#/videos/', '');
      return <VideoDetailsPage videoId={videoId} onNavigate={navigate} onShowToast={setToastMessage} />;
    }
    if (currentHash === '#/videos') return <VideosPage onNavigate={navigate} onShowToast={setToastMessage} />;
    if (currentHash.startsWith('#/news/')) {
      const slug = currentHash.replace('#/news/', '');
      return <NewsDetailsPage slug={slug} onNavigate={navigate} />;
    }
    if (currentHash === '#/news') return <NewsPage onNavigate={navigate} />;
    if (currentHash.startsWith('#/category/')) {
      const categoryId = currentHash.replace('#/category/', '');
      return <CategoryPage categoryId={categoryId} onNavigate={navigate} onShowToast={setToastMessage} />;
    }
    if (currentHash === '#/calculator') return <div className="py-8"><SipCalculator /></div>;
    if (currentHash === '#/quiz') return <div className="py-8"><RiskQuizWidget /></div>;

    return <Home onNavigate={navigate} onShowToast={setToastMessage} />;
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
          <Header onOpenSearch={() => setIsSearchOpen(true)} />
          <Navbar currentPath={currentHash} onNavigate={navigate} />
          <TrendingTicker />
          <main className="flex-1">{renderRoute()}</main>
          <Footer onNavigate={navigate} onShowToast={setToastMessage} />
          <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={navigate} />
          <Toast message={toastMessage} onClose={() => setToastMessage('')} />
        </div>
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
