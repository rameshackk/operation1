/* Muthaleetu Thisai - Advanced Investment Growth & SIP Calculator Engine */
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
    siteName: "முதலீட்டு திசை",
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

async function getTrendingPreviewVideos(language = "ta") {
  try {
    const res = await fetch('/api/videos/trending-preview?limit=8');
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(v => translateVideo({
          ...v,
          titleTamil: v.title_ta || v.titleTamil || v.title,
          titleEnglish: v.title_en || v.titleEnglish || v.title,
          publishedAt: v.published_at || v.publishedAt
        }, language));
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

    const url = `/api/videos?limit=100&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`;
    const res = await fetch(url, { headers });
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(v => translateVideo({
          ...v,
          titleTamil: v.title_ta || v.titleTamil || v.title,
          titleEnglish: v.title_en || v.titleEnglish || v.title,
          descriptionTamil: v.description_ta || v.descriptionTamil || v.description,
          descriptionEnglish: v.description_en || v.descriptionEnglish || v.description,
          publishedAt: v.published_at || v.publishedAt
        }, language));
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

  // 1. Try local memory / static list
  let video = videosData.find(v => v.id === id || v.youtubeId === id || v.youtube_id === id);
  if (video) {
    const ytId = (video.youtubeId && video.youtubeId.length === 11) ? video.youtubeId : (video.id && video.id.length === 11 ? video.id : 'GizYMQfl9CY');
    return translateVideo({ ...video, youtubeId: ytId }, language);
  }

  // 2. Try fetching from backend API
  try {
    const res = await fetch(`/api/videos/${encodeURIComponent(id)}`);
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
            setSession(null);
            setUser(null);
            setProfile(null);
            setRole('user');
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

  const handleSignOut = async () => {
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
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      await fetchUserProfile(data.session.user?.id, data.session.user?.email);
    }
    return data;
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

  if (isAuthLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white p-6 select-none">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 animate-spin opacity-80 blur-sm" />
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
        role,
        isAuthLoading,
        signInWithPassword,
        signUp,
        signOut: handleSignOut,
        sendPasswordReset,
        signInWithGoogle,
        signInWithMagicLink
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

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
    <div className="relative inline-block text-left" ref={menuRef}>
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
        <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-fadeIn">
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
  if (role !== 'admin') {
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
function useTrendingPreview() {
  const { language } = useLanguage();
  const [previewVideos, setPreviewVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getTrendingPreviewVideos(language).then(data => {
      if (isMounted) {
        setPreviewVideos(data);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [language]);

  return { previewVideos, isLoading };
}

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

function useWatchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('dhanavriksha_watch_history');
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  });

  const addToHistory = (video) => {
    if (!video || !video.id) return;
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== video.id);
      const updated = [{ ...video, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 10);
      localStorage.setItem('dhanavriksha_watch_history', JSON.stringify(updated));
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
    <header className={`sticky top-0 z-40 transition-all duration-300 border-b border-slate-200 dark:border-slate-800 backdrop-blur-glass ${
      isScrolled ? 'py-2.5 shadow-lg bg-white/90 dark:bg-slate-950/90' : 'py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left Side: Welcome Badge */}
        <div className="hidden sm:flex items-center gap-2 min-w-[140px] md:min-w-[170px] shrink-0">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>👋 {t('welcome')}</span>
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

        {/* Right Side: Search + Language + Theme + Login / User Card & Logout */}
        <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
            aria-label="Search"
          >
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
                  <span>🚪</span>
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
              <span>🔑</span>
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
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseNavItems = [
    { id: 'home', hash: '#/', label: t('nav.home') },
    { id: 'videos', hash: '#/videos', label: t('nav.videos') },
    { id: 'news', hash: '#/news', label: t('nav.news') },
    { id: 'mutual-funds', hash: '#/category/mutual-funds', label: t('nav.mutualFunds') },
    { id: 'stocks', hash: '#/category/stocks', label: t('nav.stocks') },
    { id: 'personal-finance', hash: '#/category/personal-finance', label: t('nav.personalFinance') },
    { id: 'calculator', hash: '#/calculator', label: t('nav.calculator') },
    { id: 'quiz', hash: '#/quiz', label: t('nav.quiz') || 'Quiz' }
  ];

  const authNavItems = user ? [
    { id: 'profile', hash: '#/profile', label: `👤 ${language === 'ta' ? 'சுயவிவரம்' : 'Profile'}` },
    {
      id: 'logout',
      isAction: true,
      action: async () => {
        try {
          await signOut();
          onNavigate('#/login');
        } catch (e) {
          console.error(e);
        }
      },
      label: `🚪 ${language === 'ta' ? 'வெளியேறு' : 'Sign Out'}`
    }
  ] : [
    { id: 'login', hash: '#/login', label: `🔑 ${language === 'ta' ? 'உள்நுழைக' : 'Sign In'}` }
  ];

  const navItems = [...baseNavItems, ...authNavItems];

  return (
    <nav className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-xl relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:flex items-center justify-between gap-2 py-1.5">
          <div className="flex items-center justify-between flex-1 gap-1 xl:gap-2">
            {navItems.map((item) => {
              if (item.isAction) {
                return (
                  <button
                    key={item.id}
                    onClick={() => item.action && item.action()}
                    className="relative px-3 py-2 text-xs font-extrabold transition-all rounded-lg whitespace-nowrap text-red-400 hover:text-white hover:bg-red-900/40 border border-red-500/20"
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
                  className={`relative px-3 py-2 text-xs font-extrabold transition-all rounded-lg whitespace-nowrap ${isActive ? 'bg-amber-500/15 text-amber-400 shadow-sm border border-amber-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}
                >
                  {item.label}
                  {isActive && <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-amber-500 rounded-full" />}
                </button>
              );
            })}
          </div>
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
                  ? 'text-red-400 hover:bg-red-950/40'
                  : currentPath === item.hash
                    ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500'
                    : 'text-slate-300 hover:bg-slate-800'
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
      <div className="flex items-center gap-3 border-r border-slate-800 pr-8">
        <span className="text-amber-400 font-extrabold uppercase text-[10px] tracking-wider">
          {t('marketTitle')}:
        </span>
        {marketSnapshotData.map((item, idx) => (
          <div key={`${keyPrefix}-mkt-${idx}`} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-bold ${item.isUp ? 'market-up' : 'market-down'}`}>
            <span>{item.symbol}</span>
            <span className="text-slate-200">{item.value}</span>
            <span className="text-[10px]">{item.isUp ? '▲' : '▼'} {item.percent}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-8 font-medium">
        {tickerHeadlines.map((headline, idx) => (
          <span key={`${keyPrefix}-hl-${idx}`} className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-2 text-slate-300 whitespace-nowrap">
            <span className="text-amber-500 font-black">•</span>
            {headline}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-950 text-slate-100 border-b border-slate-800 text-xs py-2.5 overflow-hidden select-none shadow-sm">
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

function HeroSection({ news = newsData, onNavigate }) {
  const { t, language } = useLanguage();

  const featuredStories = news && news.length > 0 ? news : newsData;
  const trendingStories = newsData.slice(0, 5);

  const getHeadline = (item) => {
    return language === 'ta' ? item.titleTamil : (item.titleEnglish || item.titleTamil);
  };

  const renderFeaturedTrack = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-stretch gap-0 shrink-0 h-full">
      {featuredStories.map((item, idx) => (
        <div
          key={`${keyPrefix}-${item.id}-${idx}`}
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
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <h2 className="text-xs font-black tracking-widest uppercase text-amber-600 dark:text-amber-400 font-serif">
            {t('featuredNews') || 'சிறப்புச் செய்திகள்'}
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
            <span>{t('tickerLabel') || 'முக்கிய செய்திகள்'}</span>
          </div>

          <div className="h-full overflow-hidden flex items-stretch">
            <div className="animate-featured-marquee flex items-stretch whitespace-nowrap h-full">
              {renderFeaturedTrack('ftrack-1')}
              {renderFeaturedTrack('ftrack-2')}
            </div>
          </div>
        </div>

        {/* RIGHT: TRENDING ARTICLES */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                {t('trendingArticlesTitle') || 'டிரெண்டிங் செய்திகள்'}
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
                        • {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
  const [isTouchPaused, setIsTouchPaused] = React.useState(false);
  const touchTimeoutRef = React.useRef(null);

  // Compile prioritized list of trending articles and videos
  const trendingNews = (typeof newsData !== 'undefined' ? newsData : [])
    .filter(n => n.isTrending !== false)
    .slice(0, 4)
    .map(n => ({
      id: n.id,
      slug: n.slug,
      type: 'article',
      titleTamil: n.titleTamil,
      titleEnglish: n.titleEnglish,
      title: n.titleTamil || n.titleEnglish,
      summaryTamil: n.summaryTamil,
      summaryEnglish: n.summaryEnglish,
      thumbnail: n.thumbnail,
      category: n.category || 'mutual-funds',
      publishedAt: n.publishedAt,
      readTimeMinutes: n.readTimeMinutes || 4,
      rank: n.rank
    }));

  const trendingVids = (typeof videosData !== 'undefined' ? videosData : [])
    .filter(v => v.trending !== false)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4)
    .map(v => ({
      id: v.id,
      type: 'video',
      titleTamil: v.titleTamil,
      titleEnglish: v.titleEnglish,
      title: v.titleTamil || v.titleEnglish || v.title,
      summaryTamil: v.descriptionTamil,
      summaryEnglish: v.descriptionEnglish,
      thumbnail: v.thumbnail,
      category: v.category || 'personal-finance',
      publishedAt: v.publishedAt,
      duration: v.duration || '10:00',
      views: v.views || 25000,
      rank: null
    }));

  // Interleave articles and videos for a rich, dynamic showcase
  const combinedTrending = [];
  const maxLen = Math.max(trendingNews.length, trendingVids.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < trendingNews.length) combinedTrending.push(trendingNews[i]);
    if (i < trendingVids.length) combinedTrending.push(trendingVids[i]);
  }

  const trendingItems = combinedTrending.length > 0 ? combinedTrending : trendingNews;

  // Infinite sequence: render the list twice in sequence for a seamless 0% to -50% CSS loop
  const sequence = [...trendingItems, ...trendingItems];

  const getHeadline = (item) => {
    return language === 'ta' ? (item.titleTamil || item.title) : (item.titleEnglish || item.title || item.titleTamil);
  };

  const getSummary = (item) => {
    return language === 'ta' ? (item.summaryTamil || item.summary) : (item.summaryEnglish || item.summary || item.summaryTamil);
  };

  const handleCardClick = (item) => {
    if (!onNavigate) return;
    if (item.type === 'video') {
      onNavigate(`#/videos/${item.id}`);
    } else {
      onNavigate(`#/news/${item.slug}`);
    }
  };

  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(item);
    }
  };

  const handleTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    setIsTouchPaused(true);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsTouchPaused(false);
    }, 1800);
  };

  return (
    <section
      className="py-6 space-y-4 select-none overflow-hidden"
      aria-label={t('trendingArticlesTitle') || 'Trending Articles & Videos'}
    >
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-serif tracking-tight flex items-center gap-2">
                <span>{t('trendingArticlesTitle') || 'டிரெண்டிங் செய்திகள் & வழிகாட்டிகள்'}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
              ⚡ LIVE DRIFT • HOVER TO PAUSE
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              🔥 Trending
            </span>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Drifting Carousel Track */}
      <div className={`trending-carousel-wrapper ${isTouchPaused ? 'trending-carousel-paused' : ''}`}>
        <div
          className="animate-trending-carousel py-3 px-4 flex items-stretch gap-5 sm:gap-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {sequence.map((item, idx) => {
            const isVideo = item.type === 'video';
            const headline = getHeadline(item);
            const summary = getSummary(item);
            const rankStr = item.rank || `0${(idx % trendingItems.length) + 1}`;

            const formattedDate = new Intl.DateTimeFormat(
              language === 'ta' ? 'ta-IN' : 'en-IN',
              { month: 'short', day: 'numeric' }
            ).format(new Date(item.publishedAt || Date.now()));

            return (
              <article
                key={`${item.id}-copy-${idx}`}
                tabIndex={0}
                role="link"
                aria-label={`${item.type === 'video' ? 'Video' : 'Article'}: ${headline}`}
                onClick={() => handleCardClick(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                className="trending-carousel-card group relative w-[280px] sm:w-[330px] md:w-[360px] lg:w-[380px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              >
                {/* Card Thumbnail Container (16:9 Aspect Ratio) */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.thumbnail}
                    alt={headline}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top-Left Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-lg bg-slate-950/85 text-amber-400 backdrop-blur-md border border-white/10 shadow-sm">
                    {(item.category || 'FINANCE').replace('-', ' ')}
                  </span>

                  {/* Top-Right Rank or Type Indicator */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-amber-500 text-slate-950 shadow-md">
                    {isVideo ? '▶ VIDEO' : `🔥 #${rankStr}`}
                  </span>

                  {/* Video Play Overlay */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-amber-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-500 transition-all">
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Bottom Duration or Read Time Pill */}
                  <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-slate-950/85 text-slate-200 text-[10px] font-mono font-bold backdrop-blur-sm border border-white/10">
                    {isVideo ? item.duration : `⏱ ${item.readTimeMinutes} ${t('minRead') || 'min'}`}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white line-clamp-2 font-serif group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                      {headline}
                    </h3>
                    {summary && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-sans leading-relaxed">
                        {summary}
                      </p>
                    )}
                  </div>

                  {/* Footer Meta Row */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-3 font-medium">
                    <span className="flex items-center gap-1 font-mono">
                      <span>📅</span>
                      <span>{formattedDate}</span>
                    </span>

                    <span className="font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>{isVideo ? (new Intl.NumberFormat(language === 'ta' ? 'ta-IN' : 'en-IN').format(item.views) + ' ' + (t('views') || 'views')) : (t('readArticle') || 'Read')}</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
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
      titleTamil: 'SIP கணக்கிடுவான்',
      titleEnglish: 'SIP Calculator',
      subtitleTamil: 'மாதாந்திர முறையான முதலீடு',
      subtitleEnglish: 'Monthly Systematic Investment',
      icon: '📊',
      badge: isTamil ? 'பிரபலம்' : 'POPULAR'
    },
    {
      id: 'lumpsum',
      titleTamil: 'ஒரே முறை முதலீடு',
      titleEnglish: 'Lump Sum Calculator',
      subtitleTamil: 'ஒரே முறை முதலீட்டு வளர்ச்சி',
      subtitleEnglish: 'One-Time Investment Growth',
      icon: '💰',
      badge: isTamil ? 'எளிது' : 'SIMPLE'
    },
    {
      id: 'stepup',
      titleTamil: 'முதலீட்டு வருவாய் உயர்வு',
      titleEnglish: 'Returns Calculator',
      subtitleTamil: 'ஆண்டு முதலீட்டு உயர்வு (+10%)',
      subtitleEnglish: 'Step-Up Annual Incremental Growth',
      icon: '🚀',
      badge: isTamil ? 'அதிவேக வளர்ச்சி' : 'HIGH GROWTH'
    },
    {
      id: 'compound',
      titleTamil: 'கூட்டு வட்டி கணக்கீடு',
      titleEnglish: 'Compound Interest',
      subtitleTamil: 'கூட்டு வட்டியின் அபார வளர்ச்சி',
      subtitleEnglish: 'Power of Compounding Growth',
      icon: '⚡',
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
              <span className="text-amber-400">⚡</span>
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
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow">
                🔒 {isTamil ? 'உறுப்பினர் அணுகல்' : 'MEMBER ACCESS'}
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

// ==================== 6. PAGES ====================
function Home({ onNavigate, onShowToast }) {
  const { t, language } = useLanguage();
  const { previewVideos, isLoading } = useTrendingPreview();

  const translatedNews = newsData.map(item => translateNewsArticle(item, language));

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. FEATURED NEWS SLIDER (LEFT) + TRENDING ARTICLES (RIGHT) */}
      <HeroSection news={translatedNews} onNavigate={onNavigate} />

      {/* 2. CONTINUOUS BREAKING NEWS TICKER */}
      <BreakingNewsTicker onNavigate={onNavigate} />

      {/* 3. CONTINUOUS AUTO-SCROLLING TRENDING SHOWCASE CAROUSEL */}
      <TrendingArticlesSection onNavigate={onNavigate} />

      {/* 4. PUBLIC PREVIEW GRID OF TRENDING VIDEOS (6-8 Items) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-serif">
              {t('latestVideos') || 'சமீபத்திய வீடியோக்கள்'}
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            PREVIEW SHOWCASE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {previewVideos.slice(0, 8).map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={() => onNavigate && onNavigate(`#/videos/${video.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 5. SIGN IN / REGISTER CALL TO ACTION BANNER */}
      <SignInCtaBanner onNavigate={onNavigate} />

      {/* 6. FINANCIAL CALCULATOR */}
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
          Official Channel: {OFFICIAL_CHANNEL_HANDLE} ↗
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
  const actualYtId = (video.youtubeId && video.youtubeId.length === 11 && !video.youtubeId.includes('-')) 
    ? video.youtubeId 
    : ((video.id && video.id.length === 11 && !video.id.includes('-')) ? video.id : 'GizYMQfl9CY');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div ref={playerRef} className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-200 dark:border-slate-800">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${actualYtId}?autoplay=1&rel=0`}
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
                  {OFFICIAL_CHANNEL_HANDLE} ↗
                </a>
              </div>
              <button onClick={handleShare} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-200">{t('share')}</button>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">{video.title}</h1>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-b border-slate-100 dark:border-slate-800 py-3.5 font-bold">
              <span>{(video.views || 18500).toLocaleString()} {t('views')}</span>
              <span>•</span>
              <span>{t('publishedAt')}: {formattedDate}</span>
              <span>•</span>
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
          Official Channel: {OFFICIAL_CHANNEL_HANDLE} ↗
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

// ==================== AUTH UI PAGE ====================
function AuthPage({ initialMode = 'login', onNavigate }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const { signInWithPassword, signInWithGoogle, signInWithMagicLink, signUp, sendPasswordReset } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getPostLoginTarget = () => {
    try {
      const saved = sessionStorage.getItem('auth_redirect_from');
      if (saved && saved !== '#/login' && saved !== '#/signup' && saved !== '#/register' && saved !== '#/forgot-password' && saved !== '#/reset-password') {
        sessionStorage.removeItem('auth_redirect_from');
        return saved;
      }
    } catch (e) {}
    return '#/';
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithPassword(email, password);
      onNavigate(getPostLoginTarget());
    } catch (err) {
      setError(err.message || (isTamil ? 'உள்நுழைவு தோல்வியடைந்தது.' : 'Login failed. Check credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError(isTamil ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError(isTamil ? 'விதிமுறைகளை ஏற்க வேண்டும்' : 'You must agree to the Terms & Privacy Policy');
      return;
    }
    setIsLoading(true);
    try {
      await signUp(email, password, displayName);
      setSuccess(isTamil ? 'சரிபார்ப்பு மின்னஞ்சல் அனுப்பப்பட்டது!' : 'Check your email to verify your account');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onNavigate(getPostLoginTarget());
    } catch (err) {
      setError(err.message || 'Google Auth failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithMagicLink(email);
      setSuccess(isTamil ? 'மேஜிக் லிங்க் அனுப்பப்பட்டது' : 'Magic sign-in link sent to your email');
    } catch (err) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      setSuccess(isTamil ? 'மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டது' : 'Password reset link sent to your email');
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Branded Panel */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-8 text-white flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg">தன</div>
              <h1 className="text-xl font-black font-serif text-white">Muthaleetu Thisai</h1>
            </div>
            <h3 className="text-2xl font-black font-serif text-amber-400 pt-4 leading-snug">
              {isTamil ? 'முதலீடுகள் & மியூச்சுவல் ஃபண்ட் வழிகாட்டி' : 'Master Mutual Funds & Wealth Creation'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isTamil ? 'பட்ஜெட் பத்மநாபன் CFP வழங்கும் நம்பகமான நிதி தகவல்கள்.' : 'Certified financial insights by Certified Financial Planner Padmanaban B.'}
            </p>
          </div>
          <div className="text-xs font-bold text-slate-400">@budgetpadmanaban_ Official</div>
        </div>

        {/* Right Form Card Panel */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white dark:bg-slate-900">
          <div className="space-y-1 mb-5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
              {mode === 'signup' ? (isTamil ? 'கணக்கை உருவாக்குங்கள்' : 'Create an Account') :
               mode === 'forgot' ? (isTamil ? 'கடவுச்சொல்லை மீட்டெடுக்க' : 'Reset Password') :
               mode === 'magic-link' ? (isTamil ? 'மேஜிக் உள்நுழைவு' : 'Passwordless Magic Link') :
               (isTamil ? 'மீண்டும் வருக!' : 'Welcome back')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isTamil ? 'உங்கள் நிதி கணக்கில் உள்நுழையவும்' : 'Access your personalized investment dashboard.'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold mb-4">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold mb-4">
              ✓ {success}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isTamil ? 'கூகிள் மூலம் தொடரவும்' : 'Continue with Google'}</span>
              </button>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{isTamil ? 'மின்னஞ்சல்' : 'Email'}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{isTamil ? 'கடவுச்சொல்' : 'Password'}</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white" />
              </div>
              <div className="flex justify-between text-xs font-bold">
                <button type="button" onClick={() => setMode('forgot')} className="text-amber-600 hover:underline">{isTamil ? 'கடவுச்சொல்லை மறந்ததா?' : 'Forgot password?'}</button>
                <button type="button" onClick={() => setMode('magic-link')} className="text-slate-500 hover:underline">{isTamil ? 'மேஜிக் லிங்க்' : 'Email magic link'}</button>
              </div>
              <button type="submit" disabled={isLoading} className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg">{isLoading ? 'Signing in...' : (isTamil ? 'உள்நுழைக' : 'Sign In')}</button>
              <div className="text-center pt-2 text-xs font-bold">
                {isTamil ? 'கணக்கு இல்லையா?' : "Don't have an account?"} <button type="button" onClick={() => setMode('signup')} className="text-amber-600 hover:underline">{isTamil ? 'பதிவு செய்க' : 'Sign up'}</button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>{isTamil ? 'கூகிள் மூலம் பதிவு செய்க' : 'Sign up with Google'}</span>
              </button>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{isTamil ? 'முழு பெயர்' : 'Full Name'}</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} required className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{isTamil ? 'மின்னஞ்சல்' : 'Email'}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{isTamil ? 'கடவுச்சொல்' : 'Password'}</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{isTamil ? 'கடவுச்சொல்லை உறுதிப்படுத்து' : 'Confirm Password'}</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white" />
              </div>
              <div className="flex items-center gap-2 pt-1 text-xs font-bold">
                <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} required className="w-4 h-4 accent-amber-600" />
                <span>{isTamil ? 'விதிமுறைகளை ஏற்கிறேன்' : 'I agree to Terms & Privacy Policy'}</span>
              </div>
              <button type="submit" disabled={isLoading} className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg">{isLoading ? 'Creating...' : (isTamil ? 'கணக்கு உருவாக்கு' : 'Create Account')}</button>
              <div className="text-center pt-2 text-xs font-bold">
                {isTamil ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'} <button type="button" onClick={() => setMode('login')} className="text-amber-600 hover:underline">{isTamil ? 'உள்நுழைக' : 'Sign in'}</button>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{isTamil ? 'மின்னஞ்சல்' : 'Email'}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full h-12 rounded-2xl bg-amber-600 text-white font-extrabold text-xs">{isLoading ? 'Sending...' : (isTamil ? 'மீட்டமைப்பு இணைப்பு அனுப்புக' : 'Send Reset Link')}</button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs font-bold text-slate-500 hover:underline">← {isTamil ? 'திரும்பு' : 'Back to login'}</button>
            </form>
          )}

          {mode === 'magic-link' && (
            <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{isTamil ? 'மின்னஞ்சல்' : 'Email'}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full h-12 rounded-2xl bg-amber-600 text-white font-extrabold text-xs">{isLoading ? 'Sending...' : (isTamil ? 'மேஜிக் லிங்க் அனுப்புக 🪄' : 'Send Magic Link 🪄')}</button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs font-bold text-slate-500 hover:underline">← {isTamil ? 'திரும்பு' : 'Back to login'}</button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

// ==================== USER PROFILE & ADMIN PAGES ====================
function ProfilePage({ onNavigate, onShowToast }) {
  const { user, profile, role, signOut } = useAuth();
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  if (!user) return null;

  const displayName = profile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const email = user.email || '';
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-24 h-24 rounded-full object-cover border-4 border-amber-500 shadow-xl" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-black text-3xl flex items-center justify-center border-4 border-amber-400 shadow-xl">
              {initials}
            </div>
          )}

          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">{displayName}</h1>
              <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                role === 'admin' ? 'bg-red-500/10 text-red-600 border border-red-500/30' : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
              }`}>
                {role}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{email}</p>
            <p className="text-[11px] text-slate-400 font-mono">User ID: {user.id || 'N/A'}</p>
          </div>

          <button
            onClick={() => { signOut(); if (onShowToast) onShowToast(isTamil ? 'வெளியேறப்பட்டது' : 'Signed out successfully'); }}
            className="px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-600 text-red-600 hover:text-white dark:hover:text-white font-extrabold text-xs transition-all border border-red-500/20 shadow-sm"
          >
            {isTamil ? 'வெளியேறு (Log Out)' : 'Log Out'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-2">
          <div className="text-amber-500 text-2xl font-black">📺</div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{isTamil ? 'பார்த்த வரலாறுகள்' : 'Watch History'}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{isTamil ? 'சமீபத்திய வீடியோக்கள்' : 'Track videos you recently watched'}</p>
          <button onClick={() => onNavigate('#/history')} className="text-xs font-extrabold text-amber-600 hover:underline pt-2 inline-block">
            {isTamil ? 'வரலாறு பார்க்க →' : 'View History →'}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-2">
          <div className="text-amber-500 text-2xl font-black">🛡️</div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{isTamil ? 'பாதுகாப்பு & கணக்கு' : 'Security & Account'}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{isTamil ? 'கடவுச்சொல் &Supabase Auth' : 'Protected via Supabase Auth'}</p>
          <button onClick={() => onNavigate('#/forgot-password')} className="text-xs font-extrabold text-amber-600 hover:underline pt-2 inline-block">
            {isTamil ? 'கடவுச்சொல் மாற்று →' : 'Change Password →'}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-2">
          <div className="text-amber-500 text-2xl font-black">🌐</div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{isTamil ? 'விருப்பங்கள்' : 'Device Preferences'}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{isTamil ? 'தமிழ் / English & தீம்' : 'Bilingual Language & Theme'}</p>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-2 inline-block">✓ Active</span>
        </div>
      </div>
    </div>
  );
}

function WatchHistoryPage({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const { history } = useWatchHistory();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif">
            {isTamil ? 'பார்த்த வரலாறுகள்' : 'Watch History'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {isTamil ? 'நீங்கள் சமீபத்தில் பார்த்த வீடியோக்கள்' : 'Your recently viewed financial & investment videos'}
          </p>
        </div>
      </div>

      {history && history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {history.map(video => (
            <VideoCard key={video.id} video={video} onSelect={(v) => onNavigate(`#/videos/${v.id}`)} onShowToast={onShowToast} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="text-4xl">🎬</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isTamil ? 'வரலாறுகள் ஏதும் இல்லை' : 'No Watch History Yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isTamil ? 'வீடியோக்களைப் பார்த்து கற்றுக் கொள்ளத் தொடங்குங்கள்' : 'Start watching videos to track your investment learning progress.'}
          </p>
          <button onClick={() => onNavigate('#/videos')} className="px-6 py-3 rounded-full bg-amber-600 text-white font-extrabold text-xs shadow-lg hover:bg-amber-500 transition-all">
            {isTamil ? 'வீடியோக்களைக் காண்க' : 'Browse Videos'}
          </button>
        </div>
      )}
    </div>
  );
}

function AdminConsolePage({ onNavigate, onShowToast }) {
  const { user, role } = useAuth();
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  if (role !== 'admin') return null;

  const triggerFullSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Initiating full YouTube channel ingestion...');
    try {
      const res = await fetch('/api/cron/fetch-videos?fullSync=true', {
        headers: { 'Authorization': 'Bearer super_secret_cron_bearer_token_123' }
      });
      const data = await res.json();
      setSyncStatus(`Sync result: Ingested ${data.ingested || 0} videos. ${data.message || ''}`);
      if (onShowToast) onShowToast(isTamil ? 'சேனல் புதுப்பிக்கப்பட்டது!' : 'Channel ingestion complete!');
    } catch (err) {
      setSyncStatus(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            ADMIN CONSOLE
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif mt-2">
            {isTamil ? 'நிர்வாகக் குழு (Admin Console)' : 'System & Content Administration'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">YouTube Channel</div>
          <div className="text-xl font-black text-slate-900 dark:text-white">@budgetpadmanaban_</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">✓ Ingestion Engine Active</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Database Region</div>
          <div className="text-xl font-black text-slate-900 dark:text-white">Supabase AP-South-1</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">✓ Connection Pooler (6543)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Vercel Serverless</div>
          <div className="text-xl font-black text-slate-900 dark:text-white">operation1-rho</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">✓ Production Live</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white font-serif">
          {isTamil ? 'சேனல் வீடியோக்களைப் பெறுக' : 'Channel Content Ingestion Control'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Trigger full sync to fetch all historical video uploads from YouTube Data API v3, auto-translate titles & descriptions, and persist to Supabase PostgreSQL.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            onClick={triggerFullSync}
            disabled={isSyncing}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          >
            {isSyncing ? 'Syncing Channel Videos...' : '🔄 Run Full YouTube Sync'}
          </button>
        </div>

        {syncStatus && (
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800">
            {syncStatus}
          </div>
        )}
      </div>
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
    // Un-gated public auth pages
    if (currentHash === '#/login') return <AuthPage initialMode="login" onNavigate={navigate} />;
    if (currentHash === '#/signup') return <AuthPage initialMode="signup" onNavigate={navigate} />;
    if (currentHash === '#/forgot-password') return <AuthPage initialMode="forgot" onNavigate={navigate} />;
    if (currentHash === '#/reset-password') return <AuthPage initialMode="magic-link" onNavigate={navigate} />;

    // Protected user & admin pages
    if (currentHash === '#/profile') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <ProfilePage onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    if (currentHash === '#/history') {
      return (
        <ProtectedRoute onNavigate={navigate}>
          <WatchHistoryPage onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

    if (currentHash === '#/admin') {
      return (
        <AdminRoute>
          <AdminConsolePage onNavigate={navigate} onShowToast={setToastMessage} />
        </AdminRoute>
      );
    }

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

    if (currentHash.startsWith('#/category/')) {
      const categoryId = currentHash.replace('#/category/', '');
      return (
        <ProtectedRoute onNavigate={navigate}>
          <CategoryPage categoryId={categoryId} onNavigate={navigate} onShowToast={setToastMessage} />
        </ProtectedRoute>
      );
    }

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

    // Default Home route (protected)
    return (
      <ProtectedRoute onNavigate={navigate}>
        <Home onNavigate={navigate} onShowToast={setToastMessage} />
      </ProtectedRoute>
    );
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
            <Header onOpenSearch={() => setIsSearchOpen(true)} onNavigate={navigate} />
            <Navbar currentPath={currentHash} onNavigate={navigate} />
            <TrendingTicker />
            <main className="flex-1">{renderRoute()}</main>
            <Footer onNavigate={navigate} onShowToast={setToastMessage} />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={navigate} />
            <Toast message={toastMessage} onClose={() => setToastMessage('')} />
          </div>
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
