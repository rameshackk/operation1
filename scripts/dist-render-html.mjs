var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// js/data/translations.js
var translations, videosData, newsData, marketSnapshotData;
var init_translations = __esm({
  "js/data/translations.js"() {
    translations = {
      ta: {
        siteName: "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BA4\u0BBF\u0B9A\u0BC8",
        welcome: "\u0BB5\u0BB0\u0BB5\u0BC7\u0BB1\u0BCD\u0B95\u0BBF\u0BB1\u0BCB\u0BAE\u0BCD",
        tagline: "\u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD & \u0BAA\u0B99\u0BCD\u0B95\u0BC1\u0B9A\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD",
        budgetPadmanaban: "\u0BAA\u0B9F\u0BCD\u0B9C\u0BC6\u0B9F\u0BCD \u0BAA\u0BA4\u0BCD\u0BAE\u0BA8\u0BBE\u0BAA\u0BA9\u0BCD \u0B83\u0BAA\u0BC8\u0BA9\u0BBE\u0BA9\u0BCD\u0BB7\u0BBF\u0BAF\u0BB2\u0BCD",
        nav: {
          home: "\u0BAE\u0BC1\u0B95\u0BAA\u0BCD\u0BAA\u0BC1",
          articles: "\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BCD \u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BB0\u0BC8\u0B95\u0BB3\u0BCD",
          videos: "\u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
          news: "\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD",
          professionals: "\u0BA8\u0BBF\u0BAA\u0BC1\u0BA3\u0BB0\u0BCD\u0B95\u0BB3\u0BCD",
          mutualFunds: "\u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD",
          stocks: "\u0BAA\u0B99\u0BCD\u0B95\u0BC1\u0B9A\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8",
          personalFinance: "\u0BA4\u0BA9\u0BBF\u0BA8\u0BAA\u0BB0\u0BCD \u0BA8\u0BBF\u0BA4\u0BBF",
          education: "\u0BA8\u0BBF\u0BA4\u0BBF \u0B85\u0BB1\u0BBF\u0BB5\u0BC1",
          calculator: "SIP \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BBF\u0B9F\u0BC1\u0BB5\u0BBE\u0BA9\u0BCD",
          quiz: "\u0BB5\u0BBF\u0BA9\u0BBE\u0B9F\u0BBF \u0BB5\u0BBF\u0BA9\u0BBE"
        },
        tickerLabel: "\u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD",
        marketTitle: "\u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0BA8\u0BBF\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD",
        heroBadge: "\u0B9A\u0BBF\u0BB1\u0BAA\u0BCD\u0BAA\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF",
        featuredNews: "\u0B9A\u0BBF\u0BB1\u0BAA\u0BCD\u0BAA\u0BC1\u0B9A\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD",
        trendingArticlesTitle: "\u0B9F\u0BBF\u0BB0\u0BC6\u0BA3\u0BCD\u0B9F\u0BBF\u0B99\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD",
        latestVideos: "\u0B9A\u0BAE\u0BC0\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
        mutualFundNewsTitle: "\u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD",
        stockMarketNewsTitle: "\u0BAA\u0B99\u0BCD\u0B95\u0BC1\u0B9A\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD",
        personalFinanceNewsTitle: "SIP & \u0BA4\u0BA9\u0BBF\u0BA8\u0BAA\u0BB0\u0BCD \u0BA8\u0BBF\u0BA4\u0BBF \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD",
        mutualFundVideos: "\u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
        stockMarketVideos: "\u0BAA\u0B99\u0BCD\u0B95\u0BC1\u0B9A\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
        sipVideos: "SIP & \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
        financialCalculators: "\u0BA8\u0BBF\u0BA4\u0BBF \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BB0\u0BC1\u0BB5\u0BBF\u0B95\u0BB3\u0BCD",
        financialCalculatorsDesc: "SIP, \u0B92\u0BB0\u0BC7 \u0BAE\u0BC1\u0BB1\u0BC8 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1, \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BB5\u0BB0\u0BC1\u0BB5\u0BBE\u0BAF\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B95\u0BC2\u0B9F\u0BCD\u0B9F\u0BC1 \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF \u0B86\u0B95\u0BBF\u0BAF\u0BB5\u0BB1\u0BCD\u0BB1\u0BC8\u0B95\u0BCD \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BBF\u0B9F \u0B89\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BA4\u0BBF\u0B9A\u0BCD \u0B9A\u0BBE\u0BA4\u0BA9\u0B99\u0BCD\u0B95\u0BB3\u0BCD.",
        sipCalculator: "SIP Calculator",
        lumpsumCalculator: "Lump Sum Calculator",
        returnsCalculator: "Returns Calculator",
        compoundCalculator: "Compound Interest Calculator",
        searchPlaceholder: "\u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD, \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BC8\u0BA4\u0BCD \u0BA4\u0BC7\u0B9F\u0BC1\u0B95... (Ctrl + K)",
        searchTitle: "\u0BA4\u0BC7\u0B9F\u0BB2\u0BCD",
        recentSearches: "\u0B9A\u0BAE\u0BC0\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF \u0BA4\u0BC7\u0B9F\u0BB2\u0BCD\u0B95\u0BB3\u0BCD",
        trendingSearches: "\u0BAA\u0BBF\u0BB0\u0BAA\u0BB2\u0BAE\u0BBE\u0BA9 \u0BA4\u0BB2\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
        noResults: "\u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0BC1\u0B95\u0BB3\u0BCD \u0B8E\u0BA4\u0BC1\u0BB5\u0BC1\u0BAE\u0BCD \u0B95\u0BBF\u0B9F\u0BC8\u0B95\u0BCD\u0B95\u0BB5\u0BBF\u0BB2\u0BCD\u0BB2\u0BC8",
        filterAll: "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1\u0BAE\u0BCD",
        views: "\u0BAA\u0BBE\u0BB0\u0BCD\u0BB5\u0BC8\u0B95\u0BB3\u0BCD",
        publishedAt: "\u0BB5\u0BC6\u0BB3\u0BBF\u0BAF\u0BBF\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BA8\u0BBE\u0BB3\u0BCD",
        duration: "\u0B95\u0BBE\u0BB2 \u0B85\u0BB3\u0BB5\u0BC1",
        watchNow: "\u0B87\u0BAA\u0BCD\u0BAA\u0BCB\u0BA4\u0BC1 \u0BAA\u0BBE\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
        readArticle: "\u0BAE\u0BC7\u0BB2\u0BC1\u0BAE\u0BCD \u0BAA\u0B9F\u0BBF\u0B95\u0BCD\u0B95",
        continueWatching: "\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC1 \u0BAA\u0BBE\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
        recommendedForYou: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0BA9 \u0BAA\u0BB0\u0BBF\u0BA8\u0BCD\u0BA4\u0BC1\u0BB0\u0BC8\u0B95\u0BB3\u0BCD",
        newBadge: "\u0BAA\u0BC1\u0BA4\u0BBF\u0BAF\u0BA4\u0BC1",
        sipCalculatorTitle: "SIP \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0B95\u0BB0\u0BC1\u0BB5\u0BBF",
        sipCalculatorDesc: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BBE\u0BA4 \u0BB5\u0BB0\u0BB5\u0BC1 \u0BB5\u0BB4\u0BBF \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 \u0BAE\u0BC2\u0BB2\u0BAE\u0BCD 1 \u0B95\u0BCB\u0B9F\u0BBF \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B87\u0BB2\u0B95\u0BCD\u0B95\u0BC1 \u0BA4\u0BCA\u0B95\u0BC8\u0BAF\u0BC8 \u0B85\u0B9F\u0BC8\u0BAF \u0B95\u0BC2\u0B9F\u0BCD\u0B9F\u0BC1 \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF\u0BAF\u0BBF\u0BA9\u0BCD \u0BB5\u0BB2\u0BBF\u0BAE\u0BC8\u0BAF\u0BC8\u0B95\u0BCD \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BBF\u0B9F\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD.",
        monthlyInvestment: "\u0BAE\u0BBE\u0BA4\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 SIP \u0BA4\u0BCA\u0B95\u0BC8 (\u20B9)",
        expectedReturnRate: "\u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B86\u0BA3\u0BCD\u0B9F\u0BC1 \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF \u0BB5\u0BBF\u0B95\u0BBF\u0BA4\u0BAE\u0BCD (%)",
        timePeriod: "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BBE\u0BB2\u0BAE\u0BCD (\u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD)",
        totalInvested: "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1",
        estimatedReturns: "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF \u0BB2\u0BBE\u0BAA\u0BAE\u0BCD",
        totalWealthValue: "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0B9A\u0BC6\u0BB2\u0BCD\u0BB5\u0BAE\u0BCD \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1",
        newsLetterTitle: "\u0BA4\u0BBF\u0BA9\u0B9A\u0BB0\u0BBF \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BC8 \u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BBF\u0BB2\u0BCD \u0BAA\u0BC6\u0BB1\u0BC1\u0B95",
        newsLetterDesc: "\u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0B89\u0BB2\u0B95\u0BA4\u0BCD\u0BA4\u0BBF\u0BA9\u0BCD \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BA8\u0BBF\u0B95\u0BB4\u0BCD\u0BB5\u0BC1\u0B95\u0BB3\u0BC8 \u0B89\u0B9F\u0BA9\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0B9F\u0BA9\u0BCD \u0BAA\u0BC6\u0BB1 \u0BAA\u0BA4\u0BBF\u0BB5\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD.",
        subscribe: "\u0B9A\u0BAA\u0BCD\u0BB8\u0BCD\u0B95\u0BBF\u0BB0\u0BC8\u0BAA\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0B95",
        subscribedToast: "\u0BA8\u0BA9\u0BCD\u0BB1\u0BBF! \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD \u0BB5\u0BC6\u0BB1\u0BCD\u0BB1\u0BBF\u0B95\u0BB0\u0BAE\u0BBE\u0B95 \u0BAA\u0BA4\u0BBF\u0BB5\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1.",
        copiedToast: "\u0BB2\u0BBF\u0B99\u0BCD\u0B95\u0BCD \u0BA8\u0B95\u0BB2\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1!",
        share: "\u0BAA\u0B95\u0BBF\u0BB0\u0BCD\u0B95",
        tableOfContents: "\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0B9F\u0B95\u0BCD\u0B95\u0BAE\u0BCD",
        readTime: "\u0BB5\u0BBE\u0B9A\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
        minRead: "\u0BA8\u0BBF\u0BAE\u0BBF\u0B9F\u0BAE\u0BCD \u0BB5\u0BBE\u0B9A\u0BBF\u0B95\u0BCD\u0B95",
        relatedVideos: "\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BAA\u0BC1\u0B9F\u0BC8\u0BAF \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
        relatedNews: "\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BAA\u0BC1\u0B9F\u0BC8\u0BAF \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD",
        footerDisclaimerTitle: "\u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0B8E\u0B9A\u0BCD\u0B9A\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BC8",
        footerDisclaimerText: "\u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1\u0B95\u0BB3\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0B85\u0BAA\u0BBE\u0BAF\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B89\u0B9F\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BB5\u0BC8. \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BB5\u0BA4\u0BB1\u0BCD\u0B95\u0BC1 \u0BAE\u0BC1\u0BA9\u0BCD \u0BA4\u0BBF\u0B9F\u0BCD\u0B9F \u0B86\u0BB5\u0BA3\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B95\u0BB5\u0BA9\u0BAE\u0BBE\u0B95\u0BAA\u0BCD \u0BAA\u0B9F\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD. \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BA4\u0BBF\u0B9A\u0BC8 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0B9F\u0BCD\u0B9C\u0BC6\u0B9F\u0BCD \u0BAA\u0BA4\u0BCD\u0BAE\u0BA8\u0BBE\u0BAA\u0BA9\u0BCD \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BA4\u0B95\u0BB5\u0BB2\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BB2\u0BCD\u0BB5\u0BBF \u0BA8\u0BCB\u0B95\u0BCD\u0B95\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0B95 \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7.",
        copyright: "\xA9 2026 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BA4\u0BBF\u0B9A\u0BC8 \u0BAE\u0BC0\u0B9F\u0BBF\u0BAF\u0BBE. \u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0B89\u0BB0\u0BBF\u0BAE\u0BC8\u0B95\u0BB3\u0BC1\u0BAE\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BB5\u0BC8."
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
        mutualFundNewsTitle: "Mutual Funds \u2014 News",
        stockMarketNewsTitle: "Stock Market \u2014 News",
        personalFinanceNewsTitle: "SIP & Personal Finance \u2014 News",
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
        sipCalculatorDesc: "Calculate the power of compounding to build \u20B91 Crore or reach your financial goals through disciplined monthly SIPs.",
        monthlyInvestment: "Monthly SIP Amount (\u20B9)",
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
        copyright: "\xA9 2026 Muthaleetu Thisai Media. All rights reserved."
      }
    };
    videosData = [
      {
        "id": "vid-bp-001",
        "youtubeId": "axV28NUz0VQ",
        "youtubeUrl": "https://www.youtube.com/shorts/axV28NUz0VQ",
        "isShort": true,
        "channelHandle": "@budgetpadmanaban_",
        "channelUrl": "https://www.youtube.com/@budgetpadmanaban_",
        "channelName": "Budget Padmanaban",
        "titleTamil": "School Fees \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BB2\u0BAF\u0BBE? | Budget Padmanaban",
        "titleEnglish": "School Fees \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BB2\u0BAF\u0BBE? | Budget Padmanaban",
        "title": "School Fees \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BB2\u0BAF\u0BBE? | Budget Padmanaban",
        "descriptionTamil": "School Fees \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BB2\u0BAF\u0BBE? | Budget Padmanaban",
        "descriptionEnglish": "School Fees \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BB2\u0BAF\u0BBE? | Budget Padmanaban",
        "description": "School Fees \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BB2\u0BAF\u0BBE? | Budget Padmanaban"
      }
    ];
    newsData = [
      {
        id: "news-001",
        slug: "sebi-new-mutual-fund-rules-2026",
        titleTamil: "SEBI \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD \u0BB5\u0BBF\u0BA4\u0BBF\u0B95\u0BB3\u0BC8 \u0B85\u0BB1\u0BBF\u0BB5\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1: \u0B9A\u0BBF\u0BB1\u0BC1 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BBE\u0BB3\u0BB0\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BAA\u0BC6\u0BB0\u0BC1\u0BAE\u0BCD \u0BA8\u0BA9\u0BCD\u0BAE\u0BC8!",
        titleEnglish: "SEBI Announces New Mutual Fund Regulations: Major Advantage for Small Retail Investors!",
        summaryTamil: "\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF \u0BAA\u0B99\u0BCD\u0B95\u0BC1 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0BB0\u0BBF\u0BB5\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BA9\u0BC8 \u0BB5\u0BBE\u0BB0\u0BBF\u0BAF\u0BAE\u0BCD (SEBI) \u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD \u0B95\u0B9F\u0BCD\u0B9F\u0BA3 \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC8 \u0BAE\u0BC7\u0BB2\u0BC1\u0BAE\u0BCD \u0BB5\u0BC6\u0BB3\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BC8\u0BAF\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0BB5\u0BB4\u0BBF\u0B95\u0BBE\u0B9F\u0BCD\u0B9F\u0BC1\u0BA4\u0BB2\u0BCD\u0B95\u0BB3\u0BC8 \u0BB5\u0BC6\u0BB3\u0BBF\u0BAF\u0BBF\u0B9F\u0BCD\u0B9F\u0BC1\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1.",
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
        titleTamil: "\u0B86\u0BB0\u0BCD\u0BAA\u0BBF\u0B90 \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF \u0BB5\u0BBF\u0B95\u0BBF\u0BA4 \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0BC1: \u0BB5\u0B99\u0BCD\u0B95\u0BBF \u0B9F\u0BC6\u0BAA\u0BBE\u0B9A\u0BBF\u0B9F\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB9\u0BCB\u0BAE\u0BCD \u0BB2\u0BCB\u0BA9\u0BCD \u0B87\u0B8E\u0BAE\u0BCD\u0B90 \u0B8E\u0BA9\u0BCD\u0BA9\u0BB5\u0BBE\u0B95\u0BC1\u0BAE\u0BCD?",
        titleEnglish: "RBI Monetary Policy Stance: Impact on Fixed Deposits and Home Loan EMIs",
        summaryTamil: "\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF \u0BB0\u0BBF\u0B9A\u0BB0\u0BCD\u0BB5\u0BCD \u0BB5\u0B99\u0BCD\u0B95\u0BBF\u0BAF\u0BBF\u0BA9\u0BCD \u0BA8\u0BBE\u0BA3\u0BAF\u0B95\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0B95\u0BC8\u0B95\u0BCD \u0B95\u0BC2\u0B9F\u0BCD\u0B9F\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BB0\u0BC6\u0BAA\u0BCD\u0BAA\u0BCB \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF \u0BB5\u0BBF\u0B95\u0BBF\u0BA4\u0BAE\u0BCD \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BAE\u0BBF\u0BA9\u0BCD\u0BB1\u0BBF 6.50% \u0B86\u0B95 \u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1 \u0B8E\u0BA9 \u0B86\u0BB3\u0BC1\u0BA8\u0BB0\u0BCD \u0B85\u0BB1\u0BBF\u0BB5\u0BBF\u0BA4\u0BCD\u0BA4\u0BBE\u0BB0\u0BCD.",
        summaryEnglish: "Reserve Bank of India (RBI) Governor maintains the Repo Rate unchanged at 6.50% in the latest Monetary Policy Committee (MPC) meeting.",
        contentTamil: `
      <h2>\u0BB0\u0BBF\u0B9A\u0BB0\u0BCD\u0BB5\u0BCD \u0BB5\u0B99\u0BCD\u0B95\u0BBF \u0B85\u0BB1\u0BBF\u0BB5\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF\u0BA9\u0BCD \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B85\u0BAE\u0BCD\u0B9A\u0B99\u0BCD\u0B95\u0BB3\u0BCD</h2>
      <p>\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF \u0BB0\u0BBF\u0B9A\u0BB0\u0BCD\u0BB5\u0BCD \u0BB5\u0B99\u0BCD\u0B95\u0BBF (RBI) \u0BA8\u0BBE\u0B9F\u0BCD\u0B9F\u0BBF\u0BA9\u0BCD \u0BAA\u0BA3\u0BB5\u0BC0\u0B95\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BC8\u0B95\u0BCD \u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD \u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BBE\u0BA4\u0BBE\u0BB0 \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAF\u0BC8 \u0B8A\u0B95\u0BCD\u0B95\u0BC1\u0BB5\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD \u0BA4\u0BA9\u0BA4\u0BC1 \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF \u0BB5\u0BBF\u0B95\u0BBF\u0BA4 \u0B95\u0BCA\u0BB3\u0BCD\u0B95\u0BC8\u0BAF\u0BC8 \u0BB5\u0BC6\u0BB3\u0BBF\u0BAF\u0BBF\u0B9F\u0BCD\u0B9F\u0BC1\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1.</p>
    `,
        contentEnglish: `
      <h2>Key Highlights of the RBI Announcement</h2>
      <p>The Reserve Bank of India (RBI) kept interest rates steady to balance inflation management with sustainable domestic growth.</p>
    `,
        category: "personal-finance",
        publishedAt: "2025-01-04T08:00:00.000Z",
        readTimeMinutes: 5,
        author: "\u0BAA\u0B9F\u0BCD\u0B9C\u0BC6\u0B9F\u0BCD \u0BAA\u0BA4\u0BCD\u0BAE\u0BA8\u0BBE\u0BAA\u0BA9\u0BCD",
        thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=70&fm=webp",
        isFeatured: true,
        isTrending: true,
        rank: "02"
      },
      {
        id: "news-003",
        slug: "sip-investment-common-mistakes-to-avoid",
        titleTamil: "SIP \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BBF\u0BB2\u0BCD \u0B87\u0BA8\u0BCD\u0BA4 \u0BA4\u0BB5\u0BB1\u0BC1\u0B95\u0BB3\u0BC8 \u0B92\u0BB0\u0BC1\u0BAA\u0BCB\u0BA4\u0BC1\u0BAE\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BBE\u0BA4\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD: 1 \u0B95\u0BCB\u0B9F\u0BBF \u0B87\u0BB2\u0B95\u0BCD\u0B95\u0BC8 \u0B85\u0B9F\u0BC8\u0BB5\u0BA4\u0BC1 \u0B8E\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF?",
        titleEnglish: "Common SIP Investment Errors to Avoid: How to Successfully Reach Your \u20B91 Crore Milestone",
        summaryTamil: "\u0BAE\u0BC1\u0BB1\u0BC8\u0BAF\u0BBE\u0BA9 SIP \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC8 \u0BAA\u0BBE\u0BA4\u0BBF\u0BAF\u0BBF\u0BB2\u0BCD \u0BA8\u0BBF\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0BB5\u0BA4\u0BC1 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0B9A\u0BB0\u0BBF\u0BB5\u0BBF\u0BA9\u0BCD \u0BAA\u0BCB\u0BA4\u0BC1 \u0BAA\u0BAF\u0BA8\u0BCD\u0BA4\u0BC1 \u0BB5\u0BBF \u0BB5\u0BBF\u0BB1\u0BCD\u0BAA\u0BA4\u0BC1 \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B9A\u0BC6\u0BB2\u0BCD\u0BB5 \u0B89\u0BB0\u0BC1\u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BC8\u0BAA\u0BCD \u0BAA\u0BBE\u0BA4\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD.",
        summaryEnglish: "Stopping SIP investments during market corrections and failing to step up annually are major roadblocks to long-term compounding.",
        contentTamil: `
      <h2>SIP \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BBE\u0BB3\u0BB0\u0BCD\u0B95\u0BB3\u0BCD \u0BA4\u0BB5\u0BBF\u0BB0\u0BCD\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BBF\u0BAF 5 \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BA4\u0BB5\u0BB1\u0BC1\u0B95\u0BB3\u0BCD</h2>
      <p>\u0BA8\u0BC0\u0BA3\u0BCD\u0B9F \u0B95\u0BBE\u0BB2 \u0BA8\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BB2\u0BCD \u0B95\u0BC2\u0B9F\u0BCD\u0B9F\u0BC1 \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF\u0BAF\u0BBF\u0BA9\u0BCD \u0BAA\u0BAF\u0BA9\u0BC8\u0BAA\u0BCD \u0BAA\u0BC6\u0BB1 \u0B92\u0BB4\u0BC1\u0B95\u0BCD\u0B95\u0BAE\u0BBE\u0BA9 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 \u0BAE\u0BBF\u0B95 \u0B85\u0BB5\u0B9A\u0BBF\u0BAF\u0BAE\u0BBE\u0BA9\u0BA4\u0BC1.</p>
    `,
        contentEnglish: `
      <h2>5 Mistakes SIP Investors Must Avoid</h2>
      <p>Disciplined long-term investing is essential to unlock the power of compounding in equity mutual funds.</p>
    `,
        category: "investment",
        publishedAt: "2025-01-03T08:00:00.000Z",
        readTimeMinutes: 6,
        author: "\u0BAA\u0B9F\u0BCD\u0B9C\u0BC6\u0B9F\u0BCD \u0BAA\u0BA4\u0BCD\u0BAE\u0BA8\u0BBE\u0BAA\u0BA9\u0BCD",
        thumbnail: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=400&q=70&fm=webp",
        isFeatured: true,
        isTrending: true,
        rank: "03"
      },
      {
        id: "news-004",
        slug: "gold-price-rally-analysis-2026",
        titleTamil: "\u0BA4\u0B99\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BBF\u0BA9\u0BCD \u0BB5\u0BBF\u0BB2\u0BC8 \u0B8F\u0BA9\u0BCD \u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC1 \u0B89\u0BAF\u0BB0\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1? \u0B9A\u0BB0\u0BCD\u0BB5\u0BA4\u0BC7\u0B9A \u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BBE\u0BA4\u0BBE\u0BB0 \u0B95\u0BBE\u0BB0\u0BA3\u0BBF\u0B95\u0BB3\u0BCD \u0B85\u0BB2\u0B9A\u0BB2\u0BCD",
        titleEnglish: "Why Gold Prices Continue to Surge: Analysis of Global Economic Factors",
        summaryTamil: "\u0BAE\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF \u0BB5\u0B99\u0BCD\u0B95\u0BBF\u0B95\u0BB3\u0BBF\u0BA9\u0BCD \u0B85\u0BA4\u0BBF\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BBE\u0BA9 \u0BA4\u0B99\u0BCD\u0B95\u0BAE\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0BAE\u0BC1\u0BA4\u0BB2\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B89\u0BB2\u0B95\u0BB3\u0BBE\u0BB5\u0BBF\u0BAF \u0BAA\u0BA3\u0BB5\u0BC0\u0B95\u0BCD\u0B95 \u0BAA\u0BAF\u0BAE\u0BCD \u0B95\u0BBE\u0BB0\u0BA3\u0BAE\u0BBE\u0B95 \u0BA4\u0B99\u0BCD\u0B95\u0BAE\u0BCD \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0B9A\u0BBE\u0BA4\u0BA9\u0BC8\u0B95\u0BB3\u0BC8 \u0B85\u0B9F\u0BC8\u0BA8\u0BCD\u0BA4\u0BC1\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1.",
        summaryEnglish: "Increased central bank gold reserves and global macroeconomic hedge demand drive precious metal prices to historic highs.",
        contentTamil: `
      <h2>\u0BA4\u0B99\u0BCD\u0B95 \u0BB5\u0BBF\u0BB2\u0BC8 \u0B89\u0BAF\u0BB0\u0BCD\u0BB5\u0BBF\u0BA9\u0BCD \u0BAA\u0BBF\u0BA9\u0BCD\u0BA9\u0BA3\u0BBF \u0BB5\u0BBF\u0BB5\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BCD</h2>
      <p>\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BBE\u0BB3\u0BB0\u0BCD\u0B95\u0BB3\u0BCD \u0BA4\u0B99\u0BCD\u0B95\u0BB3\u0BBF\u0BA9\u0BCD \u0BAA\u0BCB\u0BB0\u0BCD\u0B9F\u0BCD\u0B83\u0BAA\u0BCB\u0BB2\u0BBF\u0BAF\u0BCB\u0BB5\u0BBF\u0BB2\u0BCD 10% \u0BB5\u0BB0\u0BC8 \u0BA4\u0B99\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BB5\u0BA4\u0BA9\u0BCD \u0BAE\u0BC2\u0BB2\u0BAE\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBE\u0BA9 \u0BB0\u0BBF\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD\u0BA9\u0BCD\u0B95\u0BB3\u0BC8 \u0BAA\u0BC6\u0BB1\u0BB2\u0BBE\u0BAE\u0BCD.</p>
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
        titleTamil: "\u0B87\u0BA9\u0BCD\u0BB1\u0BC8\u0BAF \u0BAA\u0B99\u0BCD\u0B95\u0BC1\u0B9A\u0BCD\u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0BA8\u0BBF\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD: NIFTY 50 \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0BB5\u0BB0\u0BB2\u0BBE\u0BB1\u0BCD\u0BB1\u0BC1 \u0B89\u0B9A\u0BCD\u0B9A\u0BA4\u0BCD\u0BA4\u0BC8 \u0BA4\u0BCA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1!",
        titleEnglish: "Stock Market Today: NIFTY 50 Touches Fresh All-Time High Driven by Banking Sector",
        summaryTamil: "\u0BB5\u0BC6\u0BB3\u0BBF\u0BA8\u0BBE\u0B9F\u0BCD\u0B9F\u0BC1 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BBE\u0BB3\u0BB0\u0BCD\u0B95\u0BB3\u0BBF\u0BA9\u0BCD (FII) \u0BA4\u0BCA\u0B9F\u0BB0\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0B99\u0BCD\u0B95\u0BBF\u0BAA\u0BCD \u0BAA\u0B99\u0BCD\u0B95\u0BC1\u0B95\u0BB3\u0BCD \u0B8E\u0BB4\u0BC1\u0B9A\u0BCD\u0B9A\u0BBF \u0B95\u0BBE\u0BB0\u0BA3\u0BAE\u0BBE\u0B95 \u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF \u0BAA\u0B99\u0BCD\u0B95\u0BC1\u0B9A\u0BCD\u0B9A\u0BA8\u0BCD\u0BA4\u0BC8\u0B95\u0BB3\u0BCD \u0B8F\u0BB1\u0BCD\u0BB1\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0B9F\u0BC8\u0BA8\u0BCD\u0BA4\u0BA9.",
        summaryEnglish: "Strong foreign institutional inflows and stellar quarterly earnings in heavyweights lift benchmark indices to all-time highs.",
        contentTamil: `
      <h2>\u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0B8F\u0BB1\u0BCD\u0BB1\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BC1 \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B95\u0BBE\u0BB0\u0BA3\u0B99\u0BCD\u0B95\u0BB3\u0BCD</h2>
      <p>\u0B90\u0B9F\u0BBF \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0BC7\u0B99\u0BCD\u0B95\u0BBF\u0B99\u0BCD \u0BAA\u0B99\u0BCD\u0B95\u0BC1\u0B95\u0BB3\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8\u0BAF\u0BC8 \u0BAE\u0BC1\u0BA9\u0BCD\u0BA9\u0BC6\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B9A\u0BCD \u0B9A\u0BC6\u0BA9\u0BCD\u0BB1\u0BA9.</p>
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
    marketSnapshotData = [
      { symbol: "NIFTY 50", value: "24,850.40", change: "+142.30", percent: "+0.58%", isUp: true },
      { symbol: "SENSEX", value: "81,420.10", change: "+418.50", percent: "+0.52%", isUp: true },
      { symbol: "BANK NIFTY", value: "52,110.30", change: "-64.20", percent: "-0.12%", isUp: false },
      { symbol: "GOLD 24K", value: "\u20B974,250", change: "+260", percent: "+0.35%", isUp: true },
      { symbol: "SILVER (1kg)", value: "\u20B987,100", change: "+690", percent: "+0.80%", isUp: true },
      { symbol: "NIFTY MIDCAP", value: "58,940.80", change: "+310.15", percent: "+0.53%", isUp: true }
    ];
  }
});

// js/context/LanguageContext.jsx
import React2, { createContext as createContext2, useContext as useContext2, useState as useState2, useEffect as useEffect2 } from "react";
function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState2(() => localStorage.getItem("dhanavriksha_language") || "ta");
  const [isTranslating, setIsTranslating] = useState2(false);
  const setLanguage = (newLang) => {
    if (newLang === language) return;
    setIsTranslating(true);
    setLanguageState(newLang);
    localStorage.setItem("dhanavriksha_language", newLang);
    setTimeout(() => setIsTranslating(false), 200);
  };
  useEffect2(() => {
    document.documentElement.setAttribute("lang", language);
  }, [language]);
  const t = (path) => {
    const keys = path.split(".");
    let result = translations[language];
    for (const key of keys) {
      if (result && result[key] !== void 0) result = result[key];
      else {
        let fallback = translations["ta"];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== void 0) fallback = fallback[fk];
        }
        return typeof fallback === "string" ? fallback : path;
      }
    }
    return result;
  };
  return /* @__PURE__ */ React2.createElement(LanguageContext.Provider, { value: { language, setLanguage, t, isTranslating } }, children);
}
var LanguageContext, useLanguage;
var init_LanguageContext = __esm({
  "js/context/LanguageContext.jsx"() {
    init_translations();
    LanguageContext = createContext2();
    useLanguage = () => useContext2(LanguageContext);
  }
});

// js/pages/SipCalculator.jsx
var SipCalculator_exports = {};
__export(SipCalculator_exports, {
  SipCalculator: () => SipCalculator,
  default: () => SipCalculator
});
import React16, { useState as useState11, useEffect as useEffect9, useMemo as useMemo3 } from "react";
function formatINR(val, isLakhCr = false) {
  if (val === null || val === void 0 || isNaN(val)) return "\u20B90";
  const num = Math.round(val);
  if (isLakhCr) {
    if (Math.abs(num) >= 1e7) {
      return `\u20B9${(num / 1e7).toFixed(2)} Cr`;
    }
    if (Math.abs(num) >= 1e5) {
      return `\u20B9${(num / 1e5).toFixed(2)} L`;
    }
  }
  return "\u20B9" + num.toLocaleString("en-IN");
}
function parseCleanNumber(valStr, fallback = 0) {
  if (typeof valStr === "number") return isNaN(valStr) ? fallback : valStr;
  const clean = String(valStr).replace(/[^0-9.]/g, "");
  const num = parseFloat(clean);
  return isNaN(num) ? fallback : num;
}
function SipCalculator({ initialTab, isEmbedded = false }) {
  const { language } = useLanguage();
  const isTa = language === "ta";
  const [activeTab, setActiveTab] = useState11(() => {
    if (initialTab) return initialTab;
    try {
      const saved = localStorage.getItem("muthaleetu_calc_tab");
      if (saved && ["quick", "stepup", "quiz"].includes(saved)) {
        return saved;
      }
    } catch (e) {
    }
    return "quick";
  });
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    try {
      localStorage.setItem("muthaleetu_calc_tab", tabKey);
    } catch (e) {
    }
  };
  useEffect9(() => {
    if (initialTab && ["quick", "stepup", "quiz"].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  return /* @__PURE__ */ React16.createElement("section", { className: "calc-light w-full py-6 sm:py-10" }, /* @__PURE__ */ React16.createElement("div", { className: "w-full max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8" }, !isEmbedded && /* @__PURE__ */ React16.createElement("div", { className: "space-y-4 pb-2 border-b border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4" }, /* @__PURE__ */ React16.createElement("div", null, /* @__PURE__ */ React16.createElement("h1", { className: "text-2xl sm:text-[28px] font-bold text-[#17142E] tracking-tight" }, isTa ? "\u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BB0\u0BC1\u0BB5\u0BBF\u0B95\u0BB3\u0BCD" : "Calculators"), /* @__PURE__ */ React16.createElement("p", { className: "mt-1 text-xs sm:text-sm text-[#5B5875]" }, isTa ? "SIP \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0BA9 \u0B89\u0B9F\u0BA9\u0B9F\u0BBF \u0B95\u0BA3\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD. \u0BAA\u0BBF\u0BB0\u0BC0\u0BAE\u0BBF\u0BAF\u0BAE\u0BCD \u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0BA9\u0BB0\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 30+ \u0B95\u0BC2\u0B9F\u0BC1\u0BA4\u0BB2\u0BCD \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BB0\u0BC1\u0BB5\u0BBF\u0B95\u0BB3\u0BCD \u0B95\u0BBF\u0B9F\u0BC8\u0B95\u0BCD\u0B95\u0BBF\u0BA9\u0BCD\u0BB1\u0BA9." : "Quick estimates for SIPs and lumpsums. Members get 30+ more calculators in Premium Access.")), /* @__PURE__ */ React16.createElement("div", { className: "shrink-0" }, /* @__PURE__ */ React16.createElement(
    "a",
    {
      href: "#premium",
      className: "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E6E3F0] text-xs font-bold text-[#17142E] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all shadow-xs"
    },
    /* @__PURE__ */ React16.createElement("span", null, isTa ? "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 30+ \u0B95\u0BB0\u0BC1\u0BB5\u0BBF\u0B95\u0BB3\u0BCD" : "All 30+ calculators"),
    /* @__PURE__ */ React16.createElement("span", { className: "bg-[#F5B700] text-[#3B2A00] font-extrabold text-[10px] px-1.5 py-0.5 rounded-[6px] tracking-wide" }, "PRO")
  ))), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-6 overflow-x-auto no-scrollbar pt-2" }, /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => handleTabChange("quick"),
      className: `pb-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${activeTab === "quick" ? "text-[#17142E] border-[#4F46E5]" : "text-[#5B5875] border-transparent hover:text-[#17142E]"}`
    },
    isTa ? "\u0BB5\u0BBF\u0BB0\u0BC8\u0BB5\u0BC1 \u0B95\u0BBE\u0BB2\u0BCD\u0B95\u0BC1\u0BB2\u0BC7\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD" : "Quick Calculator"
  ), /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => handleTabChange("stepup"),
      className: `pb-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${activeTab === "stepup" ? "text-[#17142E] border-[#4F46E5]" : "text-[#5B5875] border-transparent hover:text-[#17142E]"}`
    },
    isTa ? "SIP \u0BB8\u0BCD\u0B9F\u0BC6\u0BAA\u0BCD-\u0B85\u0BAA\u0BCD \u0B95\u0BBE\u0BB2\u0BCD\u0B95\u0BC1\u0BB2\u0BC7\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD" : "SIP Step-up Calculator"
  ), /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => handleTabChange("quiz"),
      className: `pb-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${activeTab === "quiz" ? "text-[#17142E] border-[#4F46E5]" : "text-[#5B5875] border-transparent hover:text-[#17142E]"}`
    },
    isTa ? "\u0BB0\u0BBF\u0BB8\u0BCD\u0B95\u0BCD \u0B9A\u0BC1\u0BAF\u0BB5\u0BBF\u0BB5\u0BB0 \u0BB5\u0BBF\u0BA9\u0BBE\u0B9F\u0BBF\u0BB5\u0BBF\u0BA9\u0BBE" : "Risk Profile Quiz"
  ))), activeTab === "quick" && /* @__PURE__ */ React16.createElement(QuickCalculatorTab, { isTa, isEmbedded }), activeTab === "stepup" && /* @__PURE__ */ React16.createElement(StepUpCalculatorTab, { isTa }), activeTab === "quiz" && /* @__PURE__ */ React16.createElement(RiskProfileQuizTab, { isTa })));
}
function QuickCalculatorTab({ isTa, isEmbedded }) {
  const [mode, setMode] = useState11("sip");
  const [freq, setFreq] = useState11("monthly");
  const [amount, setAmount] = useState11(1e4);
  const [lumpsumAmount, setLumpsumAmount] = useState11(1e5);
  const [annualRate, setAnnualRate] = useState11(12);
  const [years, setYears] = useState11(10);
  const [months, setMonths] = useState11(0);
  const [isStepUp, setIsStepUp] = useState11(false);
  const [stepUpBy, setStepUpBy] = useState11("percent");
  const [stepUpFreq, setStepUpFreq] = useState11("yearly");
  const [stepUpPercent, setStepUpPercent] = useState11(10);
  const [stepUpAmount, setStepUpAmount] = useState11(1e3);
  const [subTab, setSubTab] = useState11("summary");
  const handleReset = () => {
    setMode("sip");
    setFreq("monthly");
    setAmount(1e4);
    setLumpsumAmount(1e5);
    setAnnualRate(12);
    setYears(10);
    setMonths(0);
    setIsStepUp(false);
    setStepUpBy("percent");
    setStepUpFreq("yearly");
    setStepUpPercent(10);
    setStepUpAmount(1e3);
    setSubTab("summary");
  };
  const periodsPerYear = useMemo3(() => {
    switch (freq) {
      case "daily":
        return 365;
      case "weekly":
        return 52;
      case "quarterly":
        return 4;
      case "half_yearly":
        return 2;
      case "yearly":
        return 1;
      case "monthly":
      default:
        return 12;
    }
  }, [freq]);
  const frequencyLabel = useMemo3(() => {
    if (mode === "lumpsum") return isTa ? "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0BA4\u0BCD \u0BA4\u0BCA\u0B95\u0BC8 (\u20B9)" : "Lumpsum amount (\u20B9)";
    switch (freq) {
      case "daily":
        return isTa ? "\u0BA4\u0BBF\u0BA9\u0B9A\u0BB0\u0BBF \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 (\u20B9)" : "Daily investment (\u20B9)";
      case "weekly":
        return isTa ? "\u0BB5\u0BBE\u0BB0\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 (\u20B9)" : "Weekly investment (\u20B9)";
      case "quarterly":
        return isTa ? "\u0B95\u0BBE\u0BB2\u0BBE\u0BA3\u0BCD\u0B9F\u0BC1 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 (\u20B9)" : "Quarterly investment (\u20B9)";
      case "half_yearly":
        return isTa ? "\u0B85\u0BB0\u0BC8\u0BAF\u0BBE\u0BA3\u0BCD\u0B9F\u0BC1 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 (\u20B9)" : "Half yearly investment (\u20B9)";
      case "yearly":
        return isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 (\u20B9)" : "Yearly investment (\u20B9)";
      case "monthly":
      default:
        return isTa ? "\u0BAE\u0BBE\u0BA4\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 (\u20B9)" : "Monthly investment (\u20B9)";
    }
  }, [freq, mode, isTa]);
  const calcResult = useMemo3(() => {
    const totalYears = years + months / 12;
    if (totalYears <= 0 || annualRate <= 0) {
      return { totalInvested: 0, estReturns: 0, totalValue: 0, donutReturnsPercent: 0, yearlyBreakdown: [] };
    }
    if (mode === "lumpsum") {
      const L = lumpsumAmount;
      const FV = L * Math.pow(1 + annualRate / 100, totalYears);
      const totalInvested2 = L;
      const totalValue = Math.round(FV);
      const estReturns2 = Math.max(0, totalValue - totalInvested2);
      const donutReturnsPercent2 = totalValue > 0 ? Math.round(estReturns2 / totalValue * 100) : 0;
      const yearlyBreakdown2 = [];
      const wholeYears2 = Math.ceil(totalYears);
      for (let y = 1; y <= wholeYears2; y++) {
        const curY = Math.min(y, totalYears);
        const curFV = Math.round(L * Math.pow(1 + annualRate / 100, curY));
        const prevFV = y === 1 ? L : Math.round(L * Math.pow(1 + annualRate / 100, y - 1));
        const returnThisYear = Math.max(0, curFV - prevFV);
        yearlyBreakdown2.push({
          year: y,
          periodicAmount: 0,
          investedThisYear: y === 1 ? L : 0,
          returnEarned: returnThisYear,
          cumulativeInvested: L,
          balanceEnd: curFV
        });
      }
      return { totalInvested: totalInvested2, estReturns: estReturns2, totalValue, donutReturnsPercent: donutReturnsPercent2, yearlyBreakdown: yearlyBreakdown2 };
    }
    const n = periodsPerYear;
    const r = Math.pow(1 + annualRate / 100, 1 / n) - 1;
    const totalPeriods = Math.round(n * totalYears);
    if (!isStepUp) {
      const P = amount;
      const FV = r > 0 ? P * ((Math.pow(1 + r, totalPeriods) - 1) / r) * (1 + r) : P * totalPeriods;
      const totalInvested2 = Math.round(P * totalPeriods);
      const totalValue = Math.round(FV);
      const estReturns2 = Math.max(0, totalValue - totalInvested2);
      const donutReturnsPercent2 = totalValue > 0 ? Math.round(estReturns2 / totalValue * 100) : 0;
      const yearlyBreakdown2 = [];
      const wholeYears2 = Math.ceil(totalYears);
      let cumInvested = 0;
      for (let y = 1; y <= wholeYears2; y++) {
        const periodsInYear = y === wholeYears2 && totalPeriods % n !== 0 ? totalPeriods % n : n;
        const investedThisYear = P * periodsInYear;
        cumInvested += investedThisYear;
        const curPeriods = Math.min(y * n, totalPeriods);
        const curFV = Math.round(r > 0 ? P * ((Math.pow(1 + r, curPeriods) - 1) / r) * (1 + r) : P * curPeriods);
        const prevPeriods = (y - 1) * n;
        const prevFV = prevPeriods > 0 ? Math.round(r > 0 ? P * ((Math.pow(1 + r, prevPeriods) - 1) / r) * (1 + r) : P * prevPeriods) : 0;
        const returnEarned = Math.max(0, curFV - (prevFV + investedThisYear));
        yearlyBreakdown2.push({
          year: y,
          periodicAmount: P,
          investedThisYear,
          returnEarned,
          cumulativeInvested: cumInvested,
          balanceEnd: curFV
        });
      }
      return { totalInvested: totalInvested2, estReturns: estReturns2, totalValue, donutReturnsPercent: donutReturnsPercent2, yearlyBreakdown: yearlyBreakdown2 };
    }
    const periodsPerStep = stepUpFreq === "half_yearly" ? Math.max(1, Math.floor(n / 2)) : n;
    let totalInvested = 0;
    let totalFV = 0;
    const yearlyBreakdown = [];
    const wholeYears = Math.ceil(totalYears);
    const paymentSchedule = [];
    for (let t = 0; t < totalPeriods; t++) {
      const stepCount = Math.floor(t / periodsPerStep);
      let P_t = amount;
      if (stepUpBy === "percent") {
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
      let curFV = 0;
      for (let i = 0; i < endIdx; i++) {
        curFV += paymentSchedule[i] * Math.pow(1 + r, endIdx - i);
      }
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
    const donutReturnsPercent = roundedTotal > 0 ? Math.round(estReturns / roundedTotal * 100) : 0;
    return { totalInvested: roundedInvested, estReturns, totalValue: roundedTotal, donutReturnsPercent, yearlyBreakdown };
  }, [mode, freq, amount, lumpsumAmount, annualRate, years, months, isStepUp, stepUpBy, stepUpFreq, stepUpPercent, stepUpAmount, periodsPerYear]);
  const totalMonths = years * 12 + months;
  const handleSliderMonthsChange = (val) => {
    const total = Math.max(1, Math.min(480, Number(val)));
    setYears(Math.floor(total / 12));
    setMonths(total % 12);
  };
  return /* @__PURE__ */ React16.createElement("div", { className: "calc-card p-5 sm:p-7 space-y-6" }, /* @__PURE__ */ React16.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement("div", null, /* @__PURE__ */ React16.createElement("h2", { className: "text-lg font-bold text-[#17142E]" }, isTa ? "\u0BB5\u0BBF\u0BB0\u0BC8\u0BB5\u0BC1 \u0B95\u0BBE\u0BB2\u0BCD\u0B95\u0BC1\u0BB2\u0BC7\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD" : "Quick Calculator"), /* @__PURE__ */ React16.createElement("p", { className: "text-xs text-[#5B5875] mt-0.5" }, isTa ? "\u0B9A\u0BBE\u0BA4\u0BBE\u0BB0\u0BA3 \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0BB8\u0BCD\u0B9F\u0BC6\u0BAA\u0BCD-\u0B85\u0BAA\u0BCD SIP, \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0B92\u0BB0\u0BC1 \u0BAE\u0BC1\u0BB1\u0BC8 \u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BBF\u0BB1\u0BCD\u0B95\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB0\u0BC8\u0BB5\u0BC1 \u0B95\u0BA3\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1." : "A quick estimate for a flat or step-up SIP, or a one-time lumpsum.")), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center p-1 bg-[#F3F1FA] rounded-full self-start sm:self-auto border border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => setMode("sip"),
      className: `px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${mode === "sip" ? "bg-[#4F46E5] text-white shadow-xs" : "text-[#5B5875] hover:bg-[#E9E6F5]"}`
    },
    "SIP"
  ), /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => setMode("lumpsum"),
      className: `px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${mode === "lumpsum" ? "bg-[#4F46E5] text-white shadow-xs" : "text-[#5B5875] hover:bg-[#E9E6F5]"}`
    },
    isTa ? "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 (Lumpsum)" : "Lumpsum"
  ))), /* @__PURE__ */ React16.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" }, /* @__PURE__ */ React16.createElement("div", { className: "lg:col-span-5 space-y-5" }, mode === "sip" && /* @__PURE__ */ React16.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React16.createElement("label", { className: "text-[13px] font-semibold text-[#5B5875]" }, isTa ? "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0B87\u0B9F\u0BC8\u0BB5\u0BC6\u0BB3\u0BBF" : "Investment frequency"), /* @__PURE__ */ React16.createElement("div", { className: "flex flex-wrap gap-1.5 p-1 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0]" }, [
    { id: "daily", en: "Daily", ta: "\u0BA4\u0BBF\u0BA9\u0B9A\u0BB0\u0BBF" },
    { id: "weekly", en: "Weekly", ta: "\u0BB5\u0BBE\u0BB0\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0" },
    { id: "monthly", en: "Monthly", ta: "\u0BAE\u0BBE\u0BA4\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0" },
    { id: "quarterly", en: "Quarterly", ta: "\u0B95\u0BBE\u0BB2\u0BBE\u0BA3\u0BCD\u0B9F\u0BC1" },
    { id: "half_yearly", en: "Half Yearly", ta: "\u0B85\u0BB0\u0BC8\u0BAF\u0BBE\u0BA3\u0BCD\u0B9F\u0BC1" },
    { id: "yearly", en: "Yearly", ta: "\u0BB5\u0BB0\u0BC1\u0B9F\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0" }
  ].map((item) => /* @__PURE__ */ React16.createElement(
    "button",
    {
      key: item.id,
      type: "button",
      onClick: () => setFreq(item.id),
      className: `px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${freq === item.id ? "bg-[#4F46E5] text-white shadow-xs" : "text-[#5B5875] hover:bg-[#E9E6F5]"}`
    },
    isTa ? item.ta : item.en
  )))), /* @__PURE__ */ React16.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React16.createElement("label", { className: "text-[13px] font-semibold text-[#5B5875]" }, frequencyLabel), /* @__PURE__ */ React16.createElement("div", { className: "relative" }, /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "text",
      value: mode === "sip" ? amount.toLocaleString("en-IN") : lumpsumAmount.toLocaleString("en-IN"),
      onChange: (e) => {
        const clean = parseCleanNumber(e.target.value, 0);
        if (mode === "sip") {
          setAmount(clean);
        } else {
          setLumpsumAmount(clean);
        }
      },
      className: "calc-input w-36 px-3 text-sm"
    }
  ), /* @__PURE__ */ React16.createElement("span", { className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8BA6]" }, "\u20B9"))), mode === "sip" ? /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "500",
      max: "2500000",
      step: "500",
      value: amount,
      onChange: (e) => setAmount(Number(e.target.value)),
      className: "calc-range"
    }
  ) : /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "10000",
      max: "100000000",
      step: "10000",
      value: lumpsumAmount,
      onChange: (e) => setLumpsumAmount(Number(e.target.value)),
      className: "calc-range"
    }
  ), /* @__PURE__ */ React16.createElement("div", { className: "flex justify-between text-[11px] text-[#8E8BA6] font-medium" }, /* @__PURE__ */ React16.createElement("span", null, mode === "sip" ? "\u20B9500" : "\u20B910,000"), /* @__PURE__ */ React16.createElement("span", null, mode === "sip" ? "\u20B925 L" : "\u20B910 Cr"))), /* @__PURE__ */ React16.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React16.createElement("label", { className: "text-[13px] font-semibold text-[#5B5875]" }, isTa ? "\u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0B86\u0BA3\u0BCD\u0B9F\u0BC1 \u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9\u0BAE\u0BCD (%)" : "Expected return rate p.a. (%)"), /* @__PURE__ */ React16.createElement("div", { className: "relative" }, /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "number",
      step: "0.5",
      min: "1",
      max: "30",
      value: annualRate,
      onChange: (e) => setAnnualRate(Number(e.target.value) || 1),
      className: "calc-input w-24 pr-7 px-3 text-sm"
    }
  ), /* @__PURE__ */ React16.createElement("span", { className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8BA6]" }, "%"))), /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "1",
      max: "30",
      step: "0.5",
      value: annualRate,
      onChange: (e) => setAnnualRate(Number(e.target.value)),
      className: "calc-range"
    }
  ), /* @__PURE__ */ React16.createElement("div", { className: "flex justify-between text-[11px] text-[#8E8BA6] font-medium" }, /* @__PURE__ */ React16.createElement("span", null, "1%"), /* @__PURE__ */ React16.createElement("span", null, "30%"))), /* @__PURE__ */ React16.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React16.createElement("label", { className: "text-[13px] font-semibold text-[#5B5875]" }, isTa ? "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BBE\u0BB2\u0BAE\u0BCD" : "Time period"), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React16.createElement("div", { className: "relative" }, /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "number",
      min: "0",
      max: "40",
      value: years,
      onChange: (e) => setYears(Math.max(0, Math.min(40, Number(e.target.value) || 0))),
      className: "calc-input w-20 pr-7 px-2 text-sm"
    }
  ), /* @__PURE__ */ React16.createElement("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8BA6]" }, isTa ? "\u0B86" : "yrs")), /* @__PURE__ */ React16.createElement("div", { className: "relative" }, /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "number",
      min: "0",
      max: "11",
      value: months,
      onChange: (e) => setMonths(Math.max(0, Math.min(11, Number(e.target.value) || 0))),
      className: "calc-input w-18 pr-7 px-2 text-sm"
    }
  ), /* @__PURE__ */ React16.createElement("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8BA6]" }, isTa ? "\u0BAE\u0BBE" : "mo")))), /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "1",
      max: "480",
      step: "1",
      value: totalMonths,
      onChange: (e) => handleSliderMonthsChange(e.target.value),
      className: "calc-range"
    }
  ), /* @__PURE__ */ React16.createElement("div", { className: "flex justify-between text-[11px] text-[#8E8BA6] font-medium" }, /* @__PURE__ */ React16.createElement("span", null, "1 ", isTa ? "\u0BAE\u0BBE\u0BA4\u0BAE\u0BCD" : "mo"), /* @__PURE__ */ React16.createElement("span", null, "40 ", isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD" : "yrs", " (480 ", isTa ? "\u0BAE\u0BBE\u0BA4\u0B99\u0BCD\u0B95\u0BB3\u0BCD" : "mo", ")"))), mode === "sip" && /* @__PURE__ */ React16.createElement("div", { className: "p-4 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-3" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React16.createElement("span", { className: "text-xs font-bold text-[#17142E]" }, isTa ? "SIP \u0BA4\u0BCA\u0B95\u0BC8\u0BAF\u0BC8 \u0BAA\u0B9F\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BBE\u0B95 \u0B85\u0BA4\u0BBF\u0B95\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BBE (Step-up)?" : "Step-up the SIP?"), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center p-0.5 bg-white rounded-full border border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => setIsStepUp(false),
      className: `px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${!isStepUp ? "bg-[#4F46E5] text-white shadow-xs" : "text-[#5B5875] hover:bg-[#F3F1FA]"}`
    },
    isTa ? "\u0B87\u0BB2\u0BCD\u0BB2\u0BC8" : "No"
  ), /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => setIsStepUp(true),
      className: `px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${isStepUp ? "bg-[#4F46E5] text-white shadow-xs" : "text-[#5B5875] hover:bg-[#F3F1FA]"}`
    },
    isTa ? "\u0B86\u0BAE\u0BCD" : "Yes"
  ))), isStepUp && /* @__PURE__ */ React16.createElement("div", { className: "space-y-3 pt-2 border-t border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between gap-2" }, /* @__PURE__ */ React16.createElement("span", { className: "text-[11px] font-semibold text-[#5B5875]" }, isTa ? "\u0B85\u0BA4\u0BBF\u0B95\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAE\u0BC1\u0BB1\u0BC8:" : "Step-up by:"), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => setStepUpBy("percent"),
      className: `px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${stepUpBy === "percent" ? "bg-[#4F46E5] text-white" : "bg-white text-[#5B5875] border border-[#E6E3F0]"}`
    },
    isTa ? "\u0B9A\u0BA4\u0BB5\u0BC0\u0BA4\u0BAE\u0BCD (%)" : "Percentage"
  ), /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => setStepUpBy("amount"),
      className: `px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${stepUpBy === "amount" ? "bg-[#4F46E5] text-white" : "bg-white text-[#5B5875] border border-[#E6E3F0]"}`
    },
    isTa ? "\u0BA4\u0BCA\u0B95\u0BC8 (\u20B9)" : "Amount (\u20B9)"
  ))), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between gap-2" }, /* @__PURE__ */ React16.createElement("span", { className: "text-[11px] font-semibold text-[#5B5875]" }, isTa ? "\u0B85\u0BA4\u0BBF\u0B95\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B95\u0BBE\u0BB2\u0BAE\u0BCD:" : "Step-up every:"), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => setStepUpFreq("yearly"),
      className: `px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${stepUpFreq === "yearly" ? "bg-[#4F46E5] text-white" : "bg-white text-[#5B5875] border border-[#E6E3F0]"}`
    },
    isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0BA4\u0BCB\u0BB1\u0BC1\u0BAE\u0BCD" : "Yearly"
  ), /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => setStepUpFreq("half_yearly"),
      className: `px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${stepUpFreq === "half_yearly" ? "bg-[#4F46E5] text-white" : "bg-white text-[#5B5875] border border-[#E6E3F0]"}`
    },
    isTa ? "\u0B85\u0BB0\u0BC8\u0BAF\u0BBE\u0BA3\u0BCD\u0B9F\u0BC1" : "Half yearly"
  ))), /* @__PURE__ */ React16.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between text-xs font-semibold text-[#5B5875]" }, /* @__PURE__ */ React16.createElement("span", null, isTa ? "\u0B85\u0BA4\u0BBF\u0B95\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B85\u0BB3\u0BB5\u0BC1:" : "Yearly increase:"), /* @__PURE__ */ React16.createElement("span", { className: "font-bold text-[#17142E]" }, stepUpBy === "percent" ? `${stepUpPercent}%` : formatINR(stepUpAmount))), stepUpBy === "percent" ? /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "1",
      max: "30",
      step: "1",
      value: stepUpPercent,
      onChange: (e) => setStepUpPercent(Number(e.target.value)),
      className: "calc-range"
    }
  ) : /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "500",
      max: "50000",
      step: "500",
      value: stepUpAmount,
      onChange: (e) => setStepUpAmount(Number(e.target.value)),
      className: "calc-range"
    }
  )))), /* @__PURE__ */ React16.createElement("div", { className: "pt-2" }, /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: handleReset,
      className: "px-4 py-2 rounded-xl bg-white border border-[#E6E3F0] text-xs font-bold text-[#5B5875] hover:text-[#17142E] hover:border-[#4F46E5] transition-all cursor-pointer shadow-2xs"
    },
    isTa ? "\u0BAE\u0BC0\u0B9F\u0BCD\u0B9F\u0BAE\u0BC8\u0B95\u0BCD\u0B95 (Clear)" : "Clear / Reset"
  ))), /* @__PURE__ */ React16.createElement("div", { className: "lg:col-span-7 space-y-6" }, /* @__PURE__ */ React16.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, /* @__PURE__ */ React16.createElement("div", { className: "p-4 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1" }, /* @__PURE__ */ React16.createElement("span", { className: "text-xs font-semibold text-[#5B5875] uppercase tracking-wider block" }, isTa ? "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4 \u0BA4\u0BCA\u0B95\u0BC8" : "Invested amount"), /* @__PURE__ */ React16.createElement("span", { className: "text-xl sm:text-2xl font-extrabold text-[#17142E] tabular-nums block" }, formatINR(calcResult.totalInvested))), /* @__PURE__ */ React16.createElement("div", { className: "p-4 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1" }, /* @__PURE__ */ React16.createElement("span", { className: "text-xs font-semibold text-[#5B5875] uppercase tracking-wider block" }, isTa ? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9\u0BAE\u0BCD" : "Est. returns"), /* @__PURE__ */ React16.createElement("span", { className: "text-xl sm:text-2xl font-extrabold text-[#0F9D58] tabular-nums block" }, formatINR(calcResult.estReturns))), /* @__PURE__ */ React16.createElement("div", { className: "p-4 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1" }, /* @__PURE__ */ React16.createElement("span", { className: "text-xs font-semibold text-[#5B5875] uppercase tracking-wider block" }, isTa ? "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1" : "Total value"), /* @__PURE__ */ React16.createElement("span", { className: "text-xl sm:text-2xl font-extrabold text-[#4F46E5] tabular-nums block" }, formatINR(calcResult.totalValue)))), /* @__PURE__ */ React16.createElement("div", { className: "p-4 sm:p-5 bg-white rounded-xl border border-[#E6E3F0] flex flex-col sm:flex-row items-center justify-around gap-6 shadow-xs" }, /* @__PURE__ */ React16.createElement("div", { className: "relative w-36 h-36 shrink-0 flex items-center justify-center" }, /* @__PURE__ */ React16.createElement("svg", { className: "w-full h-full -rotate-90", viewBox: "0 0 36 36" }, /* @__PURE__ */ React16.createElement(
    "circle",
    {
      cx: "18",
      cy: "18",
      r: "14",
      fill: "none",
      stroke: "#C7C4F5",
      strokeWidth: "4.5"
    }
  ), /* @__PURE__ */ React16.createElement(
    "circle",
    {
      cx: "18",
      cy: "18",
      r: "14",
      fill: "none",
      stroke: "#4F46E5",
      strokeWidth: "4.5",
      strokeDasharray: `${Math.min(100, Math.max(0, calcResult.donutReturnsPercent * 0.88))} 100`,
      strokeLinecap: "round",
      className: "transition-all duration-500"
    }
  )), /* @__PURE__ */ React16.createElement("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-center select-none" }, /* @__PURE__ */ React16.createElement("span", { className: "text-[11px] font-semibold text-[#5B5875]" }, isTa ? "\u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9\u0BAE\u0BCD" : "Returns"), /* @__PURE__ */ React16.createElement("span", { className: "text-lg font-black text-[#17142E] tabular-nums" }, calcResult.donutReturnsPercent, "%"))), /* @__PURE__ */ React16.createElement("div", { className: "space-y-3 w-full sm:w-auto" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React16.createElement("span", { className: "w-3.5 h-3.5 rounded bg-[#C7C4F5] shrink-0" }), /* @__PURE__ */ React16.createElement("div", { className: "text-xs" }, /* @__PURE__ */ React16.createElement("span", { className: "font-semibold text-[#5B5875]" }, isTa ? "\u0B85\u0B9A\u0BB2\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1:" : "Invested:"), " ", /* @__PURE__ */ React16.createElement("span", { className: "font-bold text-[#17142E]" }, formatINR(calcResult.totalInvested)))), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React16.createElement("span", { className: "w-3.5 h-3.5 rounded bg-[#4F46E5] shrink-0" }), /* @__PURE__ */ React16.createElement("div", { className: "text-xs" }, /* @__PURE__ */ React16.createElement("span", { className: "font-semibold text-[#5B5875]" }, isTa ? "\u0B88\u0B9F\u0BCD\u0B9F\u0BBF\u0BAF \u0BB2\u0BBE\u0BAA\u0BAE\u0BCD:" : "Returns:"), " ", /* @__PURE__ */ React16.createElement("span", { className: "font-bold text-[#0F9D58]" }, formatINR(calcResult.estReturns)))))), /* @__PURE__ */ React16.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-4 border-b border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => setSubTab("summary"),
      className: `pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${subTab === "summary" ? "text-[#17142E] border-[#4F46E5]" : "text-[#5B5875] border-transparent hover:text-[#17142E]"}`
    },
    isTa ? "\u0B9A\u0BC1\u0BB0\u0BC1\u0B95\u0BCD\u0B95\u0BAE\u0BCD (Summary Chart)" : "Summary"
  ), /* @__PURE__ */ React16.createElement(
    "button",
    {
      type: "button",
      onClick: () => setSubTab("breakdown"),
      className: `pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${subTab === "breakdown" ? "text-[#17142E] border-[#4F46E5]" : "text-[#5B5875] border-transparent hover:text-[#17142E]"}`
    },
    isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1 \u0BB5\u0BBE\u0BB0\u0BBF\u0BAF\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB5\u0BB0\u0BAE\u0BCD" : "Return breakdown, year on year"
  )), subTab === "summary" && /* @__PURE__ */ React16.createElement(
    QuickStackedAreaChart,
    {
      data: calcResult.yearlyBreakdown,
      isTa
    }
  ), subTab === "breakdown" && /* @__PURE__ */ React16.createElement("div", { className: "overflow-x-auto rounded-xl border border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement("table", { className: "w-full text-left text-xs" }, /* @__PURE__ */ React16.createElement("thead", { className: "bg-[#F3F1FA] text-[11px] uppercase font-bold text-[#5B5875] border-b border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement("tr", null, /* @__PURE__ */ React16.createElement("th", { className: "px-3 py-2.5 whitespace-nowrap" }, isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1" : "YEAR"), /* @__PURE__ */ React16.createElement("th", { className: "px-3 py-2.5 whitespace-nowrap text-right" }, mode === "lumpsum" ? isTa ? "\u0BB5\u0B95\u0BC8" : "TYPE" : isTa ? "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0BA4\u0BCD \u0BA4\u0BCA\u0B95\u0BC8" : "PERIODIC AMOUNT"), /* @__PURE__ */ React16.createElement("th", { className: "px-3 py-2.5 whitespace-nowrap text-right" }, isTa ? "\u0B87\u0BA8\u0BCD\u0BA4 \u0B86\u0BA3\u0BCD\u0B9F\u0BC1 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1" : "INVESTED THIS YEAR"), /* @__PURE__ */ React16.createElement("th", { className: "px-3 py-2.5 whitespace-nowrap text-right" }, isTa ? "\u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9\u0BAE\u0BCD" : "RETURN EARNED"), /* @__PURE__ */ React16.createElement("th", { className: "px-3 py-2.5 whitespace-nowrap text-right" }, isTa ? "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1" : "CUMULATIVE INVESTED"), /* @__PURE__ */ React16.createElement("th", { className: "px-3 py-2.5 whitespace-nowrap text-right" }, isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1 \u0B87\u0BB1\u0BC1\u0BA4\u0BBF \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1" : "BALANCE AT YEAR END"))), /* @__PURE__ */ React16.createElement("tbody", { className: "divide-y divide-[#E6E3F0]" }, calcResult.yearlyBreakdown.map((row, idx) => /* @__PURE__ */ React16.createElement("tr", { key: row.year, className: idx % 2 === 1 ? "bg-[#FBFAFE]" : "bg-white" }, /* @__PURE__ */ React16.createElement("td", { className: "px-3 py-2.5 font-bold text-[#17142E] whitespace-nowrap" }, isTa ? `${row.year}-\u0BAE\u0BCD \u0B86\u0BA3\u0BCD\u0B9F\u0BC1` : `Year ${row.year}`), /* @__PURE__ */ React16.createElement("td", { className: "px-3 py-2.5 text-right font-medium text-[#5B5875] whitespace-nowrap" }, mode === "lumpsum" ? isTa ? "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1" : "Lumpsum" : formatINR(row.periodicAmount)), /* @__PURE__ */ React16.createElement("td", { className: "px-3 py-2.5 text-right font-medium text-[#17142E] whitespace-nowrap" }, formatINR(row.investedThisYear)), /* @__PURE__ */ React16.createElement("td", { className: "px-3 py-2.5 text-right font-bold text-[#0F9D58] whitespace-nowrap" }, "+", formatINR(row.returnEarned)), /* @__PURE__ */ React16.createElement("td", { className: "px-3 py-2.5 text-right font-medium text-[#5B5875] whitespace-nowrap" }, formatINR(row.cumulativeInvested)), /* @__PURE__ */ React16.createElement("td", { className: "px-3 py-2.5 text-right font-bold text-[#4F46E5] whitespace-nowrap" }, formatINR(row.balanceEnd)))))))), /* @__PURE__ */ React16.createElement("p", { className: "text-[12px] text-[#8E8BA6] leading-relaxed pt-2" }, isTa ? "\u0BB5\u0BBF\u0BB3\u0B95\u0BCD\u0B95\u0B95\u0BCD \u0B95\u0BBE\u0B9F\u0BCD\u0B9A\u0BBF \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7. \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BC1 \u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BBE\u0BA9 \u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9 \u0BB5\u0BBF\u0B95\u0BBF\u0BA4\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BC1\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1. \u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1\u0B95\u0BB3\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0B85\u0BAA\u0BBE\u0BAF\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B89\u0B9F\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BB5\u0BC8, \u0BA4\u0BBF\u0B9F\u0BCD\u0B9F\u0BAE\u0BCD \u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BAA\u0BBE\u0BA9 \u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0B86\u0BB5\u0BA3\u0B99\u0BCD\u0B95\u0BB3\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0B95\u0BB5\u0BA9\u0BAE\u0BBE\u0B95\u0BAA\u0BCD \u0BAA\u0B9F\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD." : "Illustration only, at an assumed constant rate of return. Mutual fund investments are subject to market risks, read all scheme related documents carefully."))));
}
function QuickStackedAreaChart({ data, isTa }) {
  if (!data || data.length === 0) {
    return /* @__PURE__ */ React16.createElement("div", { className: "h-56 bg-white rounded-xl border border-[#E6E3F0] flex items-center justify-center text-xs text-[#8E8BA6]" }, isTa ? "\u0BB5\u0BBF\u0BB5\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BC8" : "No chart data");
  }
  const [hoverIndex, setHoverIndex] = useState11(null);
  const maxVal = Math.max(...data.map((d) => d.balanceEnd), 1e3);
  const width = 600;
  const height = 220;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const points = data.map((d, i) => {
    const x = padLeft + i / Math.max(1, data.length - 1) * plotW;
    const yTotal = padTop + plotH - d.balanceEnd / maxVal * plotH;
    const yInvested = padTop + plotH - d.cumulativeInvested / maxVal * plotH;
    return { x, yTotal, yInvested, ...d };
  });
  const totalAreaPath = `
    M ${points[0].x} ${padTop + plotH}
    ${points.map((p) => `L ${p.x} ${p.yTotal}`).join(" ")}
    L ${points[points.length - 1].x} ${padTop + plotH}
    Z
  `;
  const investedAreaPath = `
    M ${points[0].x} ${padTop + plotH}
    ${points.map((p) => `L ${p.x} ${p.yInvested}`).join(" ")}
    L ${points[points.length - 1].x} ${padTop + plotH}
    Z
  `;
  const hoveredItem = hoverIndex !== null ? points[hoverIndex] : null;
  return /* @__PURE__ */ React16.createElement("div", { className: "relative bg-white rounded-xl border border-[#E6E3F0] p-3 sm:p-4 shadow-xs" }, /* @__PURE__ */ React16.createElement(
    "svg",
    {
      className: "w-full h-auto overflow-visible select-none",
      viewBox: `0 0 ${width} ${height}`,
      onMouseLeave: () => setHoverIndex(null)
    },
    [0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
      const y = padTop + plotH - frac * plotH;
      const val = maxVal * frac;
      return /* @__PURE__ */ React16.createElement("g", { key: idx }, /* @__PURE__ */ React16.createElement(
        "line",
        {
          x1: padLeft,
          y1: y,
          x2: width - padRight,
          y2: y,
          stroke: "#EEEDF4",
          strokeWidth: "1"
        }
      ), /* @__PURE__ */ React16.createElement(
        "text",
        {
          x: padLeft - 6,
          y: y + 3,
          textAnchor: "end",
          className: "text-[9px] fill-[#8E8BA6] font-medium"
        },
        formatINR(val, true)
      ));
    }),
    /* @__PURE__ */ React16.createElement("path", { d: totalAreaPath, fill: "#4F46E5", fillOpacity: "0.85" }),
    /* @__PURE__ */ React16.createElement("path", { d: investedAreaPath, fill: "#C7C4F5", fillOpacity: "0.9" }),
    /* @__PURE__ */ React16.createElement(
      "polyline",
      {
        fill: "none",
        stroke: "#4F46E5",
        strokeWidth: "2",
        points: points.map((p) => `${p.x},${p.yTotal}`).join(" ")
      }
    ),
    /* @__PURE__ */ React16.createElement(
      "polyline",
      {
        fill: "none",
        stroke: "#7A74D4",
        strokeWidth: "1.5",
        strokeDasharray: "3 3",
        points: points.map((p) => `${p.x},${p.yInvested}`).join(" ")
      }
    ),
    points.map((p, idx) => {
      const isEvenYear = p.year % 2 === 0 || p.year === 1 || p.year === data.length;
      if (!isEvenYear && data.length > 8) return null;
      return /* @__PURE__ */ React16.createElement(
        "text",
        {
          key: p.year,
          x: p.x,
          y: height - 8,
          textAnchor: "middle",
          className: "text-[10px] fill-[#8E8BA6] font-bold"
        },
        "Y",
        p.year
      );
    }),
    points.map((p, idx) => /* @__PURE__ */ React16.createElement(
      "rect",
      {
        key: `hit-${idx}`,
        x: p.x - plotW / data.length / 2,
        y: padTop,
        width: plotW / data.length,
        height: plotH,
        fill: "transparent",
        className: "cursor-pointer",
        onMouseEnter: () => setHoverIndex(idx),
        onTouchStart: () => setHoverIndex(idx)
      }
    )),
    hoveredItem && /* @__PURE__ */ React16.createElement("g", null, /* @__PURE__ */ React16.createElement(
      "line",
      {
        x1: hoveredItem.x,
        y1: padTop,
        x2: hoveredItem.x,
        y2: padTop + plotH,
        stroke: "#17142E",
        strokeWidth: "1",
        strokeDasharray: "2 2"
      }
    ), /* @__PURE__ */ React16.createElement("circle", { cx: hoveredItem.x, cy: hoveredItem.yTotal, r: "4", fill: "#4F46E5", stroke: "#FFFFFF", strokeWidth: "2" }), /* @__PURE__ */ React16.createElement("circle", { cx: hoveredItem.x, cy: hoveredItem.yInvested, r: "4", fill: "#C7C4F5", stroke: "#FFFFFF", strokeWidth: "2" }))
  ), hoveredItem && /* @__PURE__ */ React16.createElement(
    "div",
    {
      className: "absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-[#E6E3F0] px-3.5 py-2 rounded-xl shadow-md text-xs pointer-events-none z-10 flex items-center gap-4"
    },
    /* @__PURE__ */ React16.createElement("span", { className: "font-bold text-[#17142E]" }, isTa ? `${hoveredItem.year}-\u0BAE\u0BCD \u0B86\u0BA3\u0BCD\u0B9F\u0BC1` : `Year ${hoveredItem.year}`),
    /* @__PURE__ */ React16.createElement("div", null, /* @__PURE__ */ React16.createElement("span", { className: "text-[#5B5875] text-[11px] block" }, isTa ? "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1" : "Invested", ":"), /* @__PURE__ */ React16.createElement("span", { className: "font-bold text-[#17142E]" }, formatINR(hoveredItem.cumulativeInvested))),
    /* @__PURE__ */ React16.createElement("div", null, /* @__PURE__ */ React16.createElement("span", { className: "text-[#5B5875] text-[11px] block" }, isTa ? "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1" : "Total", ":"), /* @__PURE__ */ React16.createElement("span", { className: "font-extrabold text-[#4F46E5]" }, formatINR(hoveredItem.balanceEnd)))
  ));
}
function StepUpCalculatorTab({ isTa }) {
  const [monthlySip, setMonthlySip] = useState11(1e4);
  const [stepUpPercent, setStepUpPercent] = useState11(10);
  const [assumedReturn, setAssumedReturn] = useState11(12);
  const [periodYears, setPeriodYears] = useState11(15);
  const [lumpsum, setLumpsum] = useState11(0);
  const outcome = useMemo3(() => {
    const N = periodYears * 12;
    const r = assumedReturn / 100 / 12;
    let totalInvested = 0;
    let totalFV = 0;
    const yearlyData = [];
    const monthlySchedule = [];
    for (let t = 0; t < N; t++) {
      const yearIdx = Math.floor(t / 12);
      const P_t = monthlySip * Math.pow(1 + stepUpPercent / 100, yearIdx);
      totalInvested += P_t;
      totalFV += P_t * Math.pow(1 + r, N - t);
      monthlySchedule.push(P_t);
    }
    if (lumpsum > 0) {
      totalInvested += lumpsum;
      totalFV += lumpsum * Math.pow(1 + assumedReturn / 100, periodYears);
    }
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
  return /* @__PURE__ */ React16.createElement("div", { className: "calc-card p-5 sm:p-7 space-y-7" }, /* @__PURE__ */ React16.createElement("div", { className: "pb-4 border-b border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement("h2", { className: "text-lg font-bold text-[#17142E]" }, isTa ? "SIP \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9\u0B95\u0BCD \u0B95\u0BBE\u0BB2\u0BCD\u0B95\u0BC1\u0BB2\u0BC7\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD" : "SIP Investment Return Calculator"), /* @__PURE__ */ React16.createElement("p", { className: "text-xs text-[#5B5875] mt-0.5" }, isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1 \u0BB8\u0BCD\u0B9F\u0BC6\u0BAA\u0BCD-\u0B85\u0BAA\u0BCD \u0B89\u0B9F\u0BA9\u0BCD \u0BAE\u0BBE\u0BA4\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 SIP \u0B8E\u0BB5\u0BCD\u0BB5\u0BBE\u0BB1\u0BC1 \u0BB5\u0BB3\u0BB0\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1 \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC8\u0B95\u0BCD \u0B95\u0BBE\u0BA3 \u0BB8\u0BCD\u0BB2\u0BC8\u0B9F\u0BB0\u0BCD\u0B95\u0BB3\u0BC8 \u0BA8\u0B95\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD. \u0BAA\u0BC1\u0BB3\u0BCD\u0BB3\u0BBF\u0BB5\u0BBF\u0BB5\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B85\u0BA9\u0BC1\u0BAE\u0BBE\u0BA9\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BB5\u0BBF\u0B95\u0BBF\u0BA4\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BB5\u0BBF\u0BB3\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BAE\u0BBE\u0B95\u0BC1\u0BAE\u0BCD." : "Move the sliders to see how a monthly SIP with an annual step-up can grow. Figures are illustrative at an assumed rate.")), /* @__PURE__ */ React16.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" }, /* @__PURE__ */ React16.createElement("div", { className: "lg:col-span-6 space-y-5" }, /* @__PURE__ */ React16.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between text-xs font-semibold text-[#5B5875]" }, /* @__PURE__ */ React16.createElement("span", null, isTa ? "\u0BAE\u0BBE\u0BA4\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 SIP" : "Monthly SIP"), /* @__PURE__ */ React16.createElement("span", { className: "text-sm font-extrabold text-[#17142E]" }, formatINR(monthlySip))), /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "500",
      max: "200000",
      step: "500",
      value: monthlySip,
      onChange: (e) => setMonthlySip(Number(e.target.value)),
      className: "calc-range"
    }
  ), /* @__PURE__ */ React16.createElement("div", { className: "flex justify-between text-[11px] text-[#8E8BA6]" }, /* @__PURE__ */ React16.createElement("span", null, "\u20B9500"), /* @__PURE__ */ React16.createElement("span", null, "\u20B92,00,000"))), /* @__PURE__ */ React16.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between text-xs font-semibold text-[#5B5875]" }, /* @__PURE__ */ React16.createElement("span", null, isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1 \u0BB8\u0BCD\u0B9F\u0BC6\u0BAA\u0BCD-\u0B85\u0BAA\u0BCD (%)" : "Annual step-up"), /* @__PURE__ */ React16.createElement("span", { className: "text-sm font-extrabold text-[#17142E]" }, stepUpPercent, "%")), /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "0",
      max: "25",
      step: "1",
      value: stepUpPercent,
      onChange: (e) => setStepUpPercent(Number(e.target.value)),
      className: "calc-range"
    }
  ), /* @__PURE__ */ React16.createElement("div", { className: "flex justify-between text-[11px] text-[#8E8BA6]" }, /* @__PURE__ */ React16.createElement("span", null, "0%"), /* @__PURE__ */ React16.createElement("span", null, "25%"))), /* @__PURE__ */ React16.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between text-xs font-semibold text-[#5B5875]" }, /* @__PURE__ */ React16.createElement("span", null, isTa ? "\u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0B86\u0BA3\u0BCD\u0B9F\u0BC1 \u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9\u0BAE\u0BCD (%)" : "Assumed return p.a."), /* @__PURE__ */ React16.createElement("span", { className: "text-sm font-extrabold text-[#17142E]" }, assumedReturn, "%")), /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "4",
      max: "18",
      step: "0.5",
      value: assumedReturn,
      onChange: (e) => setAssumedReturn(Number(e.target.value)),
      className: "calc-range"
    }
  ), /* @__PURE__ */ React16.createElement("div", { className: "flex justify-between text-[11px] text-[#8E8BA6]" }, /* @__PURE__ */ React16.createElement("span", null, "4%"), /* @__PURE__ */ React16.createElement("span", null, "18%"))), /* @__PURE__ */ React16.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between text-xs font-semibold text-[#5B5875]" }, /* @__PURE__ */ React16.createElement("span", null, isTa ? "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BBE\u0BB2\u0BAE\u0BCD" : "Investment period"), /* @__PURE__ */ React16.createElement("span", { className: "text-sm font-extrabold text-[#17142E]" }, periodYears, " ", isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD" : "yrs")), /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "1",
      max: "40",
      step: "1",
      value: periodYears,
      onChange: (e) => setPeriodYears(Number(e.target.value)),
      className: "calc-range"
    }
  ), /* @__PURE__ */ React16.createElement("div", { className: "flex justify-between text-[11px] text-[#8E8BA6]" }, /* @__PURE__ */ React16.createElement("span", null, "1 ", isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1" : "yr"), /* @__PURE__ */ React16.createElement("span", null, "40 ", isTa ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD" : "yrs"))), /* @__PURE__ */ React16.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between text-xs font-semibold text-[#5B5875]" }, /* @__PURE__ */ React16.createElement("span", null, isTa ? "\u0B92\u0BB0\u0BC1 \u0BAE\u0BC1\u0BB1\u0BC8 \u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 (\u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BBE\u0BA9\u0BA4\u0BC1)" : "One-time lumpsum"), /* @__PURE__ */ React16.createElement("span", { className: "text-sm font-extrabold text-[#17142E]" }, formatINR(lumpsum))), /* @__PURE__ */ React16.createElement(
    "input",
    {
      type: "range",
      min: "0",
      max: "5000000",
      step: "10000",
      value: lumpsum,
      onChange: (e) => setLumpsum(Number(e.target.value)),
      className: "calc-range"
    }
  ), /* @__PURE__ */ React16.createElement("div", { className: "flex justify-between text-[11px] text-[#8E8BA6]" }, /* @__PURE__ */ React16.createElement("span", null, "\u20B90"), /* @__PURE__ */ React16.createElement("span", null, "\u20B950,00,000")))), /* @__PURE__ */ React16.createElement("div", { className: "lg:col-span-6 space-y-6" }, /* @__PURE__ */ React16.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React16.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-[#5B5875] block" }, isTa ? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0BC1" : "Projected outcome"), /* @__PURE__ */ React16.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, /* @__PURE__ */ React16.createElement("div", { className: "p-3.5 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1" }, /* @__PURE__ */ React16.createElement("span", { className: "text-[11px] font-semibold text-[#5B5875] block" }, isTa ? "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1" : "Total invested"), /* @__PURE__ */ React16.createElement("span", { className: "text-lg sm:text-xl font-extrabold text-[#17142E] tabular-nums block" }, formatINR(outcome.totalInvested, true))), /* @__PURE__ */ React16.createElement("div", { className: "p-3.5 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1" }, /* @__PURE__ */ React16.createElement("span", { className: "text-[11px] font-semibold text-[#5B5875] block" }, isTa ? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BB2\u0BBE\u0BAA\u0BAE\u0BCD" : "Estimated gains"), /* @__PURE__ */ React16.createElement("span", { className: "text-lg sm:text-xl font-extrabold text-[#0F9D58] tabular-nums block" }, formatINR(outcome.estimatedGains, true))), /* @__PURE__ */ React16.createElement("div", { className: "p-3.5 bg-[#F3F1FA] rounded-xl border border-[#E6E3F0] space-y-1" }, /* @__PURE__ */ React16.createElement("span", { className: "text-[11px] font-semibold text-[#5B5875] block" }, isTa ? "\u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1" : "Projected value"), /* @__PURE__ */ React16.createElement("span", { className: "text-lg sm:text-xl font-extrabold text-[#4F46E5] tabular-nums block" }, formatINR(outcome.projectedValue, true))))), /* @__PURE__ */ React16.createElement(StepUpLineChart, { data: outcome.yearlyData, isTa }), /* @__PURE__ */ React16.createElement("p", { className: "text-[12px] text-[#8E8BA6] leading-relaxed" }, isTa ? "\u0BB5\u0BBF\u0BB3\u0B95\u0BCD\u0B95\u0B95\u0BCD \u0B95\u0BBE\u0B9F\u0BCD\u0B9A\u0BBF \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7. \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BC1 \u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BBE\u0BA9 \u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9 \u0BB5\u0BBF\u0B95\u0BBF\u0BA4\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BC1\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1. \u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD \u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9\u0BAE\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0B9A\u0BBE\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BA4\u0BC1 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0BA4\u0BCB\u0BB1\u0BC1\u0BAE\u0BCD \u0BAE\u0BBE\u0BB1\u0BC1\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD." : "Illustration only, at an assumed constant return. Mutual fund returns are market-linked and will vary year to year."))));
}
function StepUpLineChart({ data, isTa }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map((d) => d.projectedValue), 1e3);
  const width = 500;
  const height = 200;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const points = data.map((d, i) => {
    const x = padLeft + i / Math.max(1, data.length - 1) * plotW;
    const yVal = padTop + plotH - d.projectedValue / maxVal * plotH;
    const yInv = padTop + plotH - d.invested / maxVal * plotH;
    return { x, yVal, yInv, ...d };
  });
  return /* @__PURE__ */ React16.createElement("div", { className: "bg-white rounded-xl border border-[#E6E3F0] p-3 sm:p-4 shadow-xs" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between pb-2 text-[11px]" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React16.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-[#4F46E5]" }), /* @__PURE__ */ React16.createElement("span", { className: "font-bold text-[#17142E]" }, isTa ? "\u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1" : "Projected value")), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React16.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-[#C7C4F5]" }), /* @__PURE__ */ React16.createElement("span", { className: "font-medium text-[#5B5875]" }, isTa ? "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4 \u0BA4\u0BCA\u0B95\u0BC8" : "Amount invested")))), /* @__PURE__ */ React16.createElement("svg", { className: "w-full h-auto overflow-visible select-none", viewBox: `0 0 ${width} ${height}` }, [0, 0.33, 0.66, 1].map((frac, idx) => {
    const y = padTop + plotH - frac * plotH;
    return /* @__PURE__ */ React16.createElement("g", { key: idx }, /* @__PURE__ */ React16.createElement("line", { x1: padLeft, y1: y, x2: width - padRight, y2: y, stroke: "#EEEDF4", strokeWidth: "1" }), /* @__PURE__ */ React16.createElement("text", { x: padLeft - 6, y: y + 3, textAnchor: "end", className: "text-[9px] fill-[#8E8BA6]" }, formatINR(maxVal * frac, true)));
  }), /* @__PURE__ */ React16.createElement(
    "polyline",
    {
      fill: "none",
      stroke: "#4F46E5",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      points: points.map((p) => `${p.x},${p.yVal}`).join(" ")
    }
  ), /* @__PURE__ */ React16.createElement(
    "polyline",
    {
      fill: "none",
      stroke: "#C7C4F5",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeDasharray: "4 3",
      points: points.map((p) => `${p.x},${p.yInv}`).join(" ")
    }
  ), points.map((p, idx) => {
    const show = p.year === 1 || p.year % 2 === 0 || p.year === data.length;
    if (!show && data.length > 8) return null;
    return /* @__PURE__ */ React16.createElement(
      "text",
      {
        key: p.year,
        x: p.x,
        y: height - 8,
        textAnchor: "middle",
        className: "text-[9px] fill-[#8E8BA6] font-bold"
      },
      "Y",
      p.year
    );
  })));
}
function RiskProfileQuizTab({ isTa }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState11(0);
  const [answers, setAnswers] = useState11([]);
  const [isCompleted, setIsCompleted] = useState11(false);
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
  const totalScore = answers.reduce((acc, s) => acc + (s || 0), 0);
  const profile = useMemo3(() => {
    if (totalScore <= 9) {
      return {
        key: "conservative",
        nameEn: "Conservative",
        nameTa: "\u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBE\u0BA9\u0BA4\u0BC1 (Conservative)",
        descEn: "Your priority is capital preservation with minimal fluctuations. A debt-heavy portfolio protects your capital.",
        descTa: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BC1\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8 \u0BA8\u0BCB\u0B95\u0BCD\u0B95\u0BAE\u0BCD \u0B95\u0BC1\u0BB1\u0BC8\u0BA8\u0BCD\u0BA4\u0BAA\u0B9F\u0BCD\u0B9A \u0B8F\u0BB1\u0BCD\u0BB1 \u0B87\u0BB1\u0B95\u0BCD\u0B95\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B9F\u0BA9\u0BCD \u0BAE\u0BC2\u0BB2\u0BA4\u0BA9\u0BA4\u0BCD\u0BA4\u0BC8\u0BAA\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BA4\u0BBE\u0B95\u0BC1\u0BAE\u0BCD. \u0B95\u0B9F\u0BA9\u0BCD \u0B9A\u0BBE\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4 \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BC2\u0BB2\u0BA4\u0BA9\u0BA4\u0BCD\u0BA4\u0BC8\u0BAA\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0B95\u0BCD\u0B95\u0BBF\u0BA9\u0BCD\u0BB1\u0BA9.",
        allocations: [
          { labelEn: "Debt / Short Duration", labelTa: "\u0B95\u0B9F\u0BA9\u0BCD / \u0B95\u0BC1\u0BB1\u0BC1\u0B95\u0BBF\u0BAF \u0B95\u0BBE\u0BB2 \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD", percent: 45, color: "#3B82F6" },
          { labelEn: "Hybrid / Balanced Advantage", labelTa: "\u0BB9\u0BC8\u0BAA\u0BBF\u0BB0\u0BBF\u0B9F\u0BCD / \u0BAA\u0BC7\u0BB2\u0BA9\u0BCD\u0BB8\u0BCD\u0B9F\u0BC1 \u0B85\u0B9F\u0BCD\u0BB5\u0BBE\u0BA9\u0BCD\u0B9F\u0BC7\u0B9C\u0BCD", percent: 25, color: "#10B981" },
          { labelEn: "Large Cap / Index", labelTa: "\u0BB2\u0BBE\u0BB0\u0BCD\u0B9C\u0BCD \u0B95\u0BC7\u0BAA\u0BCD / \u0B87\u0BA9\u0BCD\u0B9F\u0BC6\u0B95\u0BCD\u0BB8\u0BCD", percent: 15, color: "#4F46E5" },
          { labelEn: "Gold", labelTa: "\u0BA4\u0B99\u0BCD\u0B95\u0BAE\u0BCD (Gold)", percent: 15, color: "#F5B700" }
        ]
      };
    }
    if (totalScore <= 14) {
      return {
        key: "balanced",
        nameEn: "Balanced",
        nameTa: "\u0B9A\u0BAE\u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BBE\u0BA9\u0BA4\u0BC1 (Balanced)",
        descEn: "You can sit through normal market swings for steady growth. A blend of large cap, flexi cap and hybrid funds suits you.",
        descTa: "\u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BBE\u0BA9 \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0B95\u0BCD\u0B95\u0BBE\u0B95 \u0B9A\u0BBE\u0BA4\u0BBE\u0BB0\u0BA3 \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B9A\u0BAE\u0BBE\u0BB3\u0BBF\u0B95\u0BCD\u0B95 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BCD. \u0BB2\u0BBE\u0BB0\u0BCD\u0B9C\u0BCD \u0B95\u0BC7\u0BAA\u0BCD, \u0B83\u0BAA\u0BBF\u0BB3\u0BC6\u0B95\u0BCD\u0B9A\u0BBF \u0B95\u0BC7\u0BAA\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB9\u0BC8\u0BAA\u0BBF\u0BB0\u0BBF\u0B9F\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BBF\u0BA9\u0BCD \u0B95\u0BB2\u0BB5\u0BC8 \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B8F\u0BB1\u0BCD\u0BB1\u0BA4\u0BC1.",
        allocations: [
          { labelEn: "Large Cap / Index", labelTa: "\u0BB2\u0BBE\u0BB0\u0BCD\u0B9C\u0BCD \u0B95\u0BC7\u0BAA\u0BCD / \u0B87\u0BA9\u0BCD\u0B9F\u0BC6\u0B95\u0BCD\u0BB8\u0BCD", percent: 30, color: "#4F46E5" },
          { labelEn: "Flexi Cap", labelTa: "\u0B83\u0BAA\u0BBF\u0BB3\u0BC6\u0B95\u0BCD\u0B9A\u0BBF \u0B95\u0BC7\u0BAA\u0BCD (Flexi Cap)", percent: 30, color: "#06B6D4" },
          { labelEn: "Hybrid / Balanced Advantage", labelTa: "\u0BB9\u0BC8\u0BAA\u0BBF\u0BB0\u0BBF\u0B9F\u0BCD / \u0BAA\u0BC7\u0BB2\u0BA9\u0BCD\u0BB8\u0BCD\u0B9F\u0BC1 \u0B85\u0B9F\u0BCD\u0BB5\u0BBE\u0BA9\u0BCD\u0B9F\u0BC7\u0B9C\u0BCD", percent: 20, color: "#10B981" },
          { labelEn: "Debt / Short Duration", labelTa: "\u0B95\u0B9F\u0BA9\u0BCD / \u0B95\u0BC1\u0BB1\u0BC1\u0B95\u0BBF\u0BAF \u0B95\u0BBE\u0BB2\u0BAE\u0BCD", percent: 10, color: "#3B82F6" },
          { labelEn: "Gold", labelTa: "\u0BA4\u0B99\u0BCD\u0B95\u0BAE\u0BCD (Gold)", percent: 10, color: "#F5B700" }
        ]
      };
    }
    return {
      key: "aggressive",
      nameEn: "Aggressive",
      nameTa: "\u0BA4\u0BC0\u0BB5\u0BBF\u0BB0 \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF (Aggressive)",
      descEn: "You aim for maximum wealth creation and can handle high volatility for superior long-term returns.",
      descTa: "\u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B85\u0BA4\u0BBF\u0B95\u0BAA\u0B9F\u0BCD\u0B9A \u0B9A\u0BC6\u0BB2\u0BCD\u0BB5 \u0B89\u0BB0\u0BC1\u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BC8 \u0BA8\u0BCB\u0B95\u0BCD\u0B95\u0BAE\u0BBE\u0B95\u0B95\u0BCD \u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BC1\u0BB3\u0BCD\u0BB3\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA8\u0BC0\u0BA3\u0BCD\u0B9F \u0B95\u0BBE\u0BB2 \u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BBE\u0B95 \u0B8F\u0BB1\u0BCD\u0BB1 \u0B87\u0BB1\u0B95\u0BCD\u0B95\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B95\u0BC8\u0BAF\u0BBE\u0BB3 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BCD.",
      allocations: [
        { labelEn: "Flexi Cap", labelTa: "\u0B83\u0BAA\u0BBF\u0BB3\u0BC6\u0B95\u0BCD\u0B9A\u0BBF \u0B95\u0BC7\u0BAA\u0BCD (Flexi Cap)", percent: 30, color: "#06B6D4" },
        { labelEn: "Mid / Small Cap", labelTa: "\u0BAE\u0BBF\u0B9F\u0BCD & \u0BB8\u0BCD\u0BAE\u0BBE\u0BB2\u0BCD \u0B95\u0BC7\u0BAA\u0BCD (Mid/Small Cap)", percent: 30, color: "#8B5CF6" },
        { labelEn: "Large Cap / Index", labelTa: "\u0BB2\u0BBE\u0BB0\u0BCD\u0B9C\u0BCD \u0B95\u0BC7\u0BAA\u0BCD / \u0B87\u0BA9\u0BCD\u0B9F\u0BC6\u0B95\u0BCD\u0BB8\u0BCD", percent: 25, color: "#4F46E5" },
        { labelEn: "Hybrid", labelTa: "\u0BB9\u0BC8\u0BAA\u0BBF\u0BB0\u0BBF\u0B9F\u0BCD", percent: 5, color: "#10B981" },
        { labelEn: "Gold", labelTa: "\u0BA4\u0B99\u0BCD\u0B95\u0BAE\u0BCD (Gold)", percent: 10, color: "#F5B700" }
      ]
    };
  }, [totalScore]);
  const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];
  return /* @__PURE__ */ React16.createElement("div", { className: "calc-card p-5 sm:p-8 max-w-2xl mx-auto space-y-6" }, !isCompleted ? (
    /* QUIZ IN PROGRESS */
    /* @__PURE__ */ React16.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React16.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between text-xs font-bold text-[#5B5875] uppercase tracking-wider" }, /* @__PURE__ */ React16.createElement("span", null, isTa ? "\u0BB0\u0BBF\u0BB8\u0BCD\u0B95\u0BCD \u0B9A\u0BC1\u0BAF\u0BB5\u0BBF\u0BB5\u0BB0 \u0BB5\u0BBF\u0BA9\u0BBE\u0B9F\u0BBF\u0BB5\u0BBF\u0BA9\u0BBE" : "RISK PROFILE QUIZ"), /* @__PURE__ */ React16.createElement("span", null, isTa ? `\u0B95\u0BC7\u0BB3\u0BCD\u0BB5\u0BBF ${currentQuestionIdx + 1} / 6` : `Question ${currentQuestionIdx + 1} of 6`)), /* @__PURE__ */ React16.createElement("div", { className: "w-full h-2 rounded-full bg-[#F3F1FA] overflow-hidden border border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement(
      "div",
      {
        className: "h-full bg-[#4F46E5] transition-all duration-300",
        style: { width: `${(currentQuestionIdx + 1) / 6 * 100}%` }
      }
    ))), /* @__PURE__ */ React16.createElement("div", { className: "py-2" }, /* @__PURE__ */ React16.createElement("h3", { className: "text-base sm:text-lg font-bold text-[#17142E] leading-relaxed" }, isTa ? currentQ.qTa : currentQ.qEn)), /* @__PURE__ */ React16.createElement("div", { className: "space-y-3" }, currentQ.options.map((opt, idx) => {
      const isSelected = answers[currentQuestionIdx] === opt.score;
      return /* @__PURE__ */ React16.createElement(
        "button",
        {
          key: idx,
          type: "button",
          onClick: () => handleSelectOption(opt.score),
          className: `w-full p-4 rounded-[14px] text-left text-xs sm:text-sm font-semibold transition-all border cursor-pointer flex items-center justify-between ${isSelected ? "bg-[#EEF0FF] border-[#4F46E5] text-[#17142E] shadow-xs" : "bg-white border-[#E6E3F0] text-[#17142E] hover:border-[#4F46E5] hover:bg-[#F8F7FC]"}`
        },
        /* @__PURE__ */ React16.createElement("span", null, isTa ? opt.textTa : opt.textEn),
        /* @__PURE__ */ React16.createElement(
          "span",
          {
            className: `w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ml-3 ${isSelected ? "border-[#4F46E5] bg-[#4F46E5] text-white" : "border-[#E6E3F0] text-transparent"}`
          },
          "\u2713"
        )
      );
    })), currentQuestionIdx > 0 && /* @__PURE__ */ React16.createElement("div", { className: "pt-2" }, /* @__PURE__ */ React16.createElement(
      "button",
      {
        type: "button",
        onClick: handleBack,
        className: "inline-flex items-center gap-1.5 text-xs font-bold text-[#5B5875] hover:text-[#17142E] transition-colors cursor-pointer"
      },
      /* @__PURE__ */ React16.createElement("span", null, "\u2190 ", isTa ? "\u0BAE\u0BC1\u0BA8\u0BCD\u0BA4\u0BC8\u0BAF \u0B95\u0BC7\u0BB3\u0BCD\u0BB5\u0BBF" : "Back")
    )))
  ) : (
    /* QUIZ RESULTS CARD */
    /* @__PURE__ */ React16.createElement("div", { className: "space-y-6 animate-fadeIn" }, /* @__PURE__ */ React16.createElement("div", { className: "text-center space-y-2 pb-4 border-b border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-[#4F46E5]" }, isTa ? "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BB0\u0BBF\u0BB8\u0BCD\u0B95\u0BCD \u0B9A\u0BC1\u0BAF\u0BB5\u0BBF\u0BB5\u0BB0\u0BAE\u0BCD" : "YOUR RISK PROFILE"), /* @__PURE__ */ React16.createElement("h3", { className: "text-2xl sm:text-3xl font-black text-[#17142E]" }, isTa ? profile.nameTa : profile.nameEn), /* @__PURE__ */ React16.createElement("p", { className: "text-xs sm:text-sm text-[#5B5875] max-w-lg mx-auto leading-relaxed pt-1" }, isTa ? profile.descTa : profile.descEn)), /* @__PURE__ */ React16.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React16.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-[#5B5875] block" }, isTa ? "\u0BAA\u0BB0\u0BBF\u0BA8\u0BCD\u0BA4\u0BC1\u0BB0\u0BC8\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BB2\u0BB5\u0BC8 (Asset Allocation)" : "Recommended Asset Allocation"), /* @__PURE__ */ React16.createElement("div", { className: "space-y-2.5" }, profile.allocations.map((item, idx) => /* @__PURE__ */ React16.createElement("div", { key: idx, className: "space-y-1" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between text-xs font-semibold text-[#17142E]" }, /* @__PURE__ */ React16.createElement("span", null, isTa ? item.labelTa : item.labelEn), /* @__PURE__ */ React16.createElement("span", { className: "font-bold" }, item.percent, "%")), /* @__PURE__ */ React16.createElement("div", { className: "w-full h-2.5 rounded-full bg-[#F3F1FA] overflow-hidden border border-[#E6E3F0]" }, /* @__PURE__ */ React16.createElement(
      "div",
      {
        className: "h-full rounded-full transition-all duration-500",
        style: { width: `${item.percent}%`, backgroundColor: item.color }
      }
    )))))), /* @__PURE__ */ React16.createElement("div", { className: "pt-2 flex flex-col sm:flex-row items-center gap-3" }, /* @__PURE__ */ React16.createElement(
      "button",
      {
        type: "button",
        onClick: handleRetake,
        className: "w-full sm:w-auto px-5 py-2.5 rounded-[10px] bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#4338CA] transition-colors shadow-xs cursor-pointer"
      },
      isTa ? "\u0BAE\u0BC0\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD \u0BB5\u0BBF\u0BA9\u0BBE\u0B9F\u0BBF\u0BB5\u0BBF\u0BA9\u0BBE \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF" : "Retake quiz"
    ), /* @__PURE__ */ React16.createElement(
      "a",
      {
        href: "#/articles",
        className: "w-full sm:w-auto px-5 py-2.5 rounded-[10px] bg-white border border-[#E6E3F0] text-xs font-bold text-[#17142E] hover:border-[#4F46E5] transition-colors text-center cursor-pointer"
      },
      isTa ? "\u0BAA\u0BCA\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BAE\u0BBE\u0BA9 \u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BB0\u0BC8\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0B9F\u0BBF\u0B95\u0BCD\u0B95" : "Read relevant guides"
    )), /* @__PURE__ */ React16.createElement("p", { className: "text-[12px] text-[#8E8BA6] leading-relaxed pt-2 border-t border-[#E6E3F0]" }, isTa ? "\u0B87\u0BA8\u0BCD\u0BA4 \u0BB5\u0BBF\u0BA9\u0BBE\u0B9F\u0BBF\u0BB5\u0BBF\u0BA9\u0BBE \u0B95\u0BB2\u0BCD\u0BB5\u0BBF \u0BA8\u0BCB\u0B95\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BBE\u0BA9 \u0B92\u0BB0\u0BC1 \u0B8E\u0BB3\u0BBF\u0BAF \u0B9A\u0BC1\u0BAF \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC0\u0B9F\u0BC1 \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7. \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BB5\u0BA4\u0BB1\u0BCD\u0B95\u0BC1 \u0BAE\u0BC1\u0BA9\u0BCD \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BB5\u0BBF\u0BA8\u0BBF\u0BAF\u0BCB\u0B95\u0BB8\u0BCD\u0BA4\u0BB0\u0BC1\u0B9F\u0BA9\u0BCD \u0BAE\u0BC1\u0BB4\u0BC1\u0BAE\u0BC8\u0BAF\u0BBE\u0BA9 \u0B9A\u0BC1\u0BAF\u0BB5\u0BBF\u0BB5\u0BB0\u0BA4\u0BCD\u0BA4\u0BC8 \u0BAA\u0BC2\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BBF \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD." : "This quiz is a simple self-assessment for education. A full risk profile is completed with your distributor before investing."))
  ));
}
var QUIZ_QUESTIONS;
var init_SipCalculator = __esm({
  "js/pages/SipCalculator.jsx"() {
    init_LanguageContext();
    QUIZ_QUESTIONS = [
      {
        id: 1,
        qEn: "What is your age?",
        qTa: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BB5\u0BAF\u0BA4\u0BC1 \u0B8E\u0BA9\u0BCD\u0BA9?",
        options: [
          { textEn: "Above 45", textTa: "45 \u0BB5\u0BAF\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BAE\u0BC7\u0BB2\u0BCD", score: 1 },
          { textEn: "30 to 45", textTa: "30 \u0BAE\u0BC1\u0BA4\u0BB2\u0BCD 45", score: 2 },
          { textEn: "Under 30", textTa: "30 \u0BB5\u0BAF\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B95\u0BC0\u0BB4\u0BCD", score: 3 }
        ]
      },
      {
        id: 2,
        qEn: "When will you need most of this money?",
        qTa: "\u0B87\u0BA8\u0BCD\u0BA4 \u0BAA\u0BA3\u0BAE\u0BCD \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B8E\u0BAA\u0BCD\u0BAA\u0BCB\u0BA4\u0BC1 \u0B85\u0BA4\u0BBF\u0B95\u0BAE\u0BCD \u0BA4\u0BC7\u0BB5\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD?",
        options: [
          { textEn: "Within 3 years", textTa: "3 \u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BB3\u0BCD", score: 1 },
          { textEn: "3 to 7 years", textTa: "3 \u0BAE\u0BC1\u0BA4\u0BB2\u0BCD 7 \u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD", score: 2 },
          { textEn: "After 7 years", textTa: "7 \u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BAA\u0BCD \u0BAA\u0BBF\u0BB1\u0B95\u0BC1", score: 3 }
        ]
      },
      {
        id: 3,
        qEn: "If your portfolio fell 20% in a month, you would:",
        qTa: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 \u0B92\u0BB0\u0BC1 \u0BAE\u0BBE\u0BA4\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD 20% \u0B95\u0BC1\u0BB1\u0BC8\u0BA8\u0BCD\u0BA4\u0BBE\u0BB2\u0BCD \u0B8E\u0BA9\u0BCD\u0BA9 \u0B9A\u0BC6\u0BAF\u0BCD\u0BB5\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD?",
        options: [
          { textEn: "Sell to stop further loss", textTa: "\u0BAE\u0BC7\u0BB2\u0BC1\u0BAE\u0BCD \u0B87\u0BB4\u0BAA\u0BCD\u0BAA\u0BC8\u0BA4\u0BCD \u0BA4\u0BB5\u0BBF\u0BB0\u0BCD\u0B95\u0BCD\u0B95 \u0BB5\u0BBF\u0BB1\u0BCD\u0BB1\u0BC1\u0BB5\u0BBF\u0B9F\u0BC1\u0BB5\u0BC7\u0BA9\u0BCD", score: 1 },
          { textEn: "Hold and wait", textTa: "\u0BAA\u0BCA\u0BB1\u0BC1\u0BAE\u0BC8\u0BAF\u0BBE\u0B95 \u0B95\u0BBE\u0BA4\u0BCD\u0BA4\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BC7\u0BA9\u0BCD", score: 2 },
          { textEn: "Invest more at lower prices", textTa: "\u0B95\u0BC1\u0BB1\u0BC8\u0BA8\u0BCD\u0BA4 \u0BB5\u0BBF\u0BB2\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD \u0BAE\u0BC7\u0BB2\u0BC1\u0BAE\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BB5\u0BC7\u0BA9\u0BCD", score: 3 }
        ]
      },
      {
        id: 4,
        qEn: "Your main aim for this money is:",
        qTa: "\u0B87\u0BA8\u0BCD\u0BA4 \u0BAA\u0BA3\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BBE\u0BA9 \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BA8\u0BCB\u0B95\u0BCD\u0B95\u0BAE\u0BCD \u0B8E\u0BA9\u0BCD\u0BA9?",
        options: [
          { textEn: "Protect what I have", textTa: "\u0B87\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BA4\u0BC8 \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BA4\u0BC1", score: 1 },
          { textEn: "Steady growth", textTa: "\u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BBE\u0BA9 \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF", score: 2 },
          { textEn: "Maximum long-term growth", textTa: "\u0B85\u0BA4\u0BBF\u0B95\u0BAA\u0B9F\u0BCD\u0B9A \u0BA8\u0BC0\u0BA3\u0BCD\u0B9F\u0B95\u0BBE\u0BB2 \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF", score: 3 }
        ]
      },
      {
        id: 5,
        qEn: "Your investing experience:",
        qTa: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0B85\u0BA9\u0BC1\u0BAA\u0BB5\u0BAE\u0BCD:",
        options: [
          { textEn: "New to mutual funds", textTa: "\u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB1\u0BCD\u0B95\u0BC1 \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF\u0BB5\u0BB0\u0BCD", score: 1 },
          { textEn: "A few years of SIPs", textTa: "\u0B9A\u0BBF\u0BB2 \u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD SIP \u0B85\u0BA9\u0BC1\u0BAA\u0BB5\u0BAE\u0BCD", score: 2 },
          { textEn: "Experienced across equity and debt", textTa: "\u0BAA\u0B99\u0BCD\u0B95\u0BC1 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B95\u0B9F\u0BA9\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8\u0B95\u0BB3\u0BBF\u0BB2\u0BCD \u0B85\u0BA9\u0BC1\u0BAA\u0BB5\u0BAE\u0BCD", score: 3 }
        ]
      },
      {
        id: 6,
        qEn: "Do you have an emergency fund of 6 months' expenses?",
        qTa: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BBF\u0B9F\u0BAE\u0BCD 6 \u0BAE\u0BBE\u0BA4 \u0B9A\u0BC6\u0BB2\u0BB5\u0BC1\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0BA9 \u0B85\u0BB5\u0B9A\u0BB0\u0B95\u0BBE\u0BB2 \u0BA8\u0BBF\u0BA4\u0BBF \u0B89\u0BB3\u0BCD\u0BB3\u0BA4\u0BBE?",
        options: [
          { textEn: "Not yet", textTa: "\u0B87\u0BA9\u0BCD\u0BA9\u0BC1\u0BAE\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BC8", score: 1 },
          { textEn: "Partly", textTa: "\u0BAA\u0B95\u0BC1\u0BA4\u0BBF\u0BAF\u0BB3\u0BB5\u0BC1 \u0B89\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1", score: 2 },
          { textEn: "Yes, fully", textTa: "\u0B86\u0BAE\u0BCD, \u0BAE\u0BC1\u0BB4\u0BC1\u0BAE\u0BC8\u0BAF\u0BBE\u0B95 \u0B89\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1", score: 3 }
        ]
      }
    ];
  }
});

// scripts/render-html.js
import React18 from "react";
import { renderToString } from "react-dom/server";

// js/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
var ThemeContext = createContext();
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
  return /* @__PURE__ */ React.createElement(ThemeContext.Provider, { value: { theme, toggleTheme } }, children);
}
var useTheme = () => useContext(ThemeContext);

// scripts/render-html.js
init_LanguageContext();

// js/context/AuthContext.jsx
import React3, { createContext as createContext3, useContext as useContext3, useState as useState3, useEffect as useEffect3 } from "react";
var AuthContext = createContext3();
var DEFAULT_SUPABASE_URL = "https://etanokdvfyvkidpeovdi.supabase.co";
var DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YW5va2R2Znl2a2lkcGVvdmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODUxNzUsImV4cCI6MjEwMjI2MTE3NX0.SLzp5gIZyZdB7nmDrfjvghFbAwKwAIWuf4Ys_HC4AaE";
var supabasePromise = null;
async function getSupabaseClient() {
  if (window.supabaseClient) return window.supabaseClient;
  if (!supabasePromise) {
    supabasePromise = (async () => {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const url = window.SUPABASE_URL || localStorage.getItem("SUPABASE_URL") || DEFAULT_SUPABASE_URL;
        const key = window.SUPABASE_ANON_KEY || localStorage.getItem("SUPABASE_ANON_KEY") || DEFAULT_SUPABASE_ANON_KEY;
        window.supabaseClient = createClient(url, key);
        return window.supabaseClient;
      } catch (err) {
        console.warn("Lazy Supabase init note:", err.message);
        return null;
      }
    })();
  }
  return supabasePromise;
}
function AuthProvider({ children }) {
  const [session, setSession] = useState3(null);
  const [user, setUser] = useState3(null);
  const [profile, setProfile] = useState3(null);
  const [role, setRole] = useState3("user");
  const [isAuthLoading, setIsAuthLoading] = useState3(true);
  const fetchUserProfile = async (userId, userEmail, userMeta = {}) => {
    const client = typeof window !== "undefined" ? window.supabaseClient : null;
    if (!userId && !userEmail) return null;
    try {
      const res = await fetch("/api/auth?action=sync_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email: userEmail,
          displayName: userMeta?.full_name || userMeta?.name || (userEmail ? userEmail.split("@")[0] : "User"),
          avatarUrl: userMeta?.avatar_url || userMeta?.picture || ""
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.profile) {
          setProfile(json.profile);
          const computedRole = json.profile.role || userMeta?.role || (userEmail === "admin@gmail.com" || userEmail && (userEmail.includes("admin") || userEmail.includes("padmanaban")) ? "admin" : "user");
          setRole(computedRole);
          return json.profile;
        }
      }
    } catch (apiErr) {
      console.warn("Backend profile sync note:", apiErr.message);
    }
    if (client && userId) {
      try {
        const { data } = await client.from("profiles").select("*").eq("id", userId).maybeSingle();
        if (data) {
          setProfile(data);
          setRole(data.role || "user");
          return data;
        }
      } catch (err) {
        console.warn("Direct client profile fetch error:", err.message);
      }
    }
    const isSpecialAdmin = userEmail === "admin@gmail.com" || userEmail && (userEmail.includes("admin") || userEmail.includes("padmanaban"));
    const finalRole = isSpecialAdmin ? "admin" : userMeta?.role || "user";
    const fallback = {
      id: userId || "user-id",
      email: userEmail || "",
      display_name: userMeta?.full_name || (userEmail ? userEmail.split("@")[0] : "User"),
      avatar_url: userMeta?.avatar_url || userMeta?.picture || "",
      role: finalRole
    };
    setProfile(fallback);
    setRole(finalRole);
    return fallback;
  };
  useEffect3(() => {
    let isMounted = true;
    const hasOAuthCode = typeof window !== "undefined" && window.location.search && window.location.search.includes("code=");
    let hasStoredSession = false;
    try {
      if (typeof localStorage !== "undefined") {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i) || "";
          if (k.startsWith("sb-") && k.endsWith("-auth-token")) {
            hasStoredSession = true;
            break;
          }
        }
        if (localStorage.getItem("demo_auth_session")) {
          hasStoredSession = true;
        }
      }
    } catch (e) {
    }
    const initAuth = async () => {
      const client = await getSupabaseClient();
      if (!client) {
        if (isMounted) setIsAuthLoading(false);
        return;
      }
      const applyDemoFallback = () => {
        try {
          const savedDemo = localStorage.getItem("demo_auth_session");
          if (savedDemo) {
            const parsed = JSON.parse(savedDemo);
            if (parsed && parsed.user) {
              setSession({ access_token: "demo-padmanaban-token-2026", user: parsed.user });
              setUser(parsed.user);
              setProfile(parsed.profile);
              setRole(parsed.profile?.role || "admin");
              return true;
            }
          }
        } catch (e) {
        }
        setSession(null);
        setUser(null);
        setProfile(null);
        setRole("user");
        return false;
      };
      try {
        if (typeof window !== "undefined" && window.location.search) {
          const searchParams = new URLSearchParams(window.location.search);
          const code = searchParams.get("code");
          if (code) {
            try {
              const { data: codeData } = await client.auth.exchangeCodeForSession(code);
              if (codeData?.session && isMounted) {
                setSession(codeData.session);
                setUser(codeData.session.user);
                await fetchUserProfile(codeData.session.user?.id, codeData.session.user?.email, codeData.session.user?.user_metadata);
              }
              window.history.replaceState(null, "", window.location.pathname + window.location.hash);
            } catch (codeErr) {
              console.warn("OAuth code exchange note:", codeErr);
            }
          }
        }
        const sessionPromise = client.auth.getSession().catch((err) => ({ data: { session: null }, error: err }));
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: { session: null }, timedOut: true }), 3500));
        const res = await Promise.race([sessionPromise, timeoutPromise]);
        const initialSession = res?.data?.session;
        if (isMounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchUserProfile(initialSession.user?.id, initialSession.user?.email, initialSession.user?.user_metadata);
          } else {
            applyDemoFallback();
          }
        }
      } catch (err) {
        if (isMounted) {
          applyDemoFallback();
        }
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }
      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, currentSession) => {
        if (!isMounted) return;
        console.log(`[Supabase Auth Event]: ${event}`);
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id, currentSession.user.email, currentSession.user.user_metadata);
          }
          if (typeof window !== "undefined") {
            const rawHash = window.location.hash || "";
            const hasTokensInHash = rawHash.includes("access_token=") || rawHash.includes("refresh_token=");
            const isOnAuthScreen = rawHash === "#/login" || rawHash === "#/signup" || rawHash === "#/register";
            if (event === "SIGNED_IN" && (hasTokensInHash || isOnAuthScreen || window.location.search.includes("code="))) {
              if (window.location.search.includes("code=")) {
                try {
                  window.history.replaceState(null, "", window.location.pathname);
                } catch (e) {
                }
              }
              const savedTarget = sessionStorage.getItem("auth_redirect_from") || "#/";
              sessionStorage.removeItem("auth_redirect_from");
              const finalTarget = savedTarget === "#/login" || savedTarget === "#/signup" || savedTarget === "#/register" ? "#/" : savedTarget;
              window.location.hash = finalTarget;
            }
          }
        } else if (event === "SIGNED_OUT") {
          try {
            localStorage.removeItem("demo_auth_session");
          } catch (e) {
          }
          setSession(null);
          setUser(null);
          setProfile(null);
          setRole("user");
        }
      });
    };
    if (hasOAuthCode || hasStoredSession) {
      initAuth();
    } else {
      setIsAuthLoading(false);
      if (typeof window !== "undefined") {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(() => {
            if (isMounted) initAuth();
          }, { timeout: 4e3 });
        } else {
          setTimeout(() => {
            if (isMounted) initAuth();
          }, 3e3);
        }
      }
    }
    return () => {
      isMounted = false;
    };
  }, []);
  const signInAsDemoPadmanaban = async () => {
    const adminUser = {
      id: "admin-main-uid",
      email: "admin@gmail.com",
      user_metadata: { full_name: "Admin" }
    };
    const adminProfile = {
      id: "admin-main-uid",
      email: "admin@gmail.com",
      display_name: "Admin",
      role: "admin"
    };
    const adminSession = {
      access_token: "admin-access-token-2026",
      user: adminUser
    };
    setSession(adminSession);
    setUser(adminUser);
    setProfile(adminProfile);
    setRole("admin");
    try {
      localStorage.setItem("demo_auth_session", JSON.stringify({ user: adminUser, profile: adminProfile }));
    } catch (e) {
    }
    return { user: adminUser, profile: adminProfile };
  };
  const handleSignOut = async () => {
    try {
      localStorage.removeItem("demo_auth_session");
    } catch (e) {
    }
    const client = await getSupabaseClient();
    try {
      if (client?.auth) {
        await client.auth.signOut();
      }
    } catch (err) {
      console.warn("Network error during Supabase signOut call, forcing local state reset:", err);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole("user");
      try {
        sessionStorage.removeItem("dhanavriksha_current_tab_progress");
      } catch (e) {
      }
      window.location.hash = "#/login";
    }
  };
  const signInWithPassword = async (email, password) => {
    const trimmedEmail = (email || "").trim().toLowerCase();
    const client = await getSupabaseClient();
    if (!client || !client.auth) {
      throw new Error("Supabase client not initialized");
    }
    const { data, error } = await client.auth.signInWithPassword({ email: trimmedEmail, password });
    if (error) {
      throw error;
    }
    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      await fetchUserProfile(data.session.user?.id, data.session.user?.email, data.session.user?.user_metadata);
    }
    return data;
  };
  const signUp = async (email, password, displayName) => {
    try {
      const res = await fetch("/api/auth?action=signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to create account");
      }
      const signInRes = await signInWithPassword(email, password);
      return signInRes;
    } catch (apiErr) {
      if (apiErr.message && (apiErr.message.toLowerCase().includes("already") || apiErr.message.includes("Password"))) {
        throw apiErr;
      }
      const client = await getSupabaseClient();
      if (!client || !client.auth) throw apiErr;
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { full_name: displayName } }
      });
      if (error) throw error;
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        await fetchUserProfile(data.session.user?.id, data.session.user?.email, data.session.user?.user_metadata);
      }
      return data;
    }
  };
  const sendPasswordReset = async (email) => {
    const client = await getSupabaseClient();
    if (!client || !client.auth) throw new Error("Supabase client not initialized");
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/reset-password`
    });
    if (error) throw error;
    return data;
  };
  const signInWithGoogle = async () => {
    const client = await getSupabaseClient();
    if (!client || !client.auth) throw new Error("Supabase authentication client could not be initialized");
    try {
      const current = window.location.hash || "#/";
      if (current !== "#/login" && current !== "#/signup" && current !== "#/register") {
        sessionStorage.setItem("auth_redirect_from", current);
      } else if (!sessionStorage.getItem("auth_redirect_from")) {
        sessionStorage.setItem("auth_redirect_from", "#/");
      }
    } catch (e) {
    }
    const redirectUrl = window.location.origin + window.location.pathname;
    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) {
      if (error.message && error.message.toLowerCase().includes("provider")) {
        throw new Error("Google Sign-In is not enabled in your Supabase Dashboard. Go to Supabase Dashboard -> Authentication -> Providers -> Google to enable it.");
      }
      throw error;
    }
    return data;
  };
  const signInWithMagicLink = async (email) => {
    const client = await getSupabaseClient();
    if (!client || !client.auth) throw new Error("Supabase client not initialized");
    const { data, error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) throw error;
    return data;
  };
  const verifyCurrentPassword = async (currentPassword) => {
    if (!user || !user.email) throw new Error("No user logged in");
    const trimmedEmail = (user.email || "").trim().toLowerCase();
    if (trimmedEmail === "admin@gmail.com" || trimmedEmail.includes("admin") || trimmedEmail.includes("padmanaban") || user.id === "admin-main-uid" || user.id === "demo-padmanaban-uid") {
      try {
        const savedDemo = localStorage.getItem("demo_auth_session");
        if (savedDemo) {
          const parsed = JSON.parse(savedDemo);
          if (parsed.demoPassword && parsed.demoPassword === currentPassword) {
            return true;
          }
        }
      } catch (e) {
      }
      if (currentPassword === "admin@123" || currentPassword === "admin" || currentPassword === "Padmanaban@2026" || currentPassword === "demo" || currentPassword === "padmanaban") {
        return true;
      }
      throw new Error("Incorrect current password. Please try again.");
    }
    const client = await getSupabaseClient();
    if (!client || !client.auth) throw new Error("Supabase authentication client not initialized");
    const { data, error } = await client.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });
    if (error) {
      throw new Error("Current password is incorrect. Please check and try again.");
    }
    return true;
  };
  const updateAccountPassword = async (newPassword) => {
    if (!user) throw new Error("No user logged in");
    const trimmedEmail = (user.email || "").trim().toLowerCase();
    if (trimmedEmail === "admin@gmail.com" || trimmedEmail.includes("admin") || trimmedEmail.includes("padmanaban") || user.id === "admin-main-uid" || user.id === "demo-padmanaban-uid") {
      try {
        const savedDemo = localStorage.getItem("demo_auth_session") || "{}";
        const parsed = JSON.parse(savedDemo);
        parsed.demoPassword = newPassword;
        localStorage.setItem("demo_auth_session", JSON.stringify(parsed));
      } catch (e) {
      }
      return { success: true };
    }
    const client = await getSupabaseClient();
    if (!client || !client.auth) throw new Error("Supabase authentication client not initialized");
    const { data, error } = await client.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  };
  return /* @__PURE__ */ React3.createElement(
    AuthContext.Provider,
    {
      value: {
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
        updateAccountPassword,
        supabase: typeof window !== "undefined" ? window.supabaseClient : null
      }
    },
    children
  );
}
var useAuth = () => useContext3(AuthContext);

// js/components/common/Header.jsx
init_LanguageContext();
import React7, { useState as useState5, useEffect as useEffect5 } from "react";

// js/components/common/LanguageSwitcher.jsx
init_LanguageContext();
import React4 from "react";
function LanguageSwitcher() {
  const { language, setLanguage, isTranslating } = useLanguage();
  return /* @__PURE__ */ React4.createElement("div", { className: "relative inline-flex items-center bg-white/80 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner" }, /* @__PURE__ */ React4.createElement(
    "button",
    {
      onClick: () => setLanguage("ta"),
      className: `px-3.5 py-1 text-xs font-black rounded-full transition-all duration-300 ${language === "ta" ? "bg-[#4A9E2C] text-white shadow-md scale-105" : "text-slate-700 dark:text-slate-300 hover:text-[#4A9E2C]"}`
    },
    "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD"
  ), /* @__PURE__ */ React4.createElement(
    "button",
    {
      onClick: () => setLanguage("en"),
      className: `px-3.5 py-1 text-xs font-black rounded-full transition-all duration-300 ${language === "en" ? "bg-[#4A9E2C] text-white shadow-md scale-105" : "text-slate-700 dark:text-slate-300 hover:text-[#4A9E2C]"}`
    },
    "English"
  ), isTranslating && /* @__PURE__ */ React4.createElement("span", { className: "absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-[#4A9E2C] font-black whitespace-nowrap animate-pulse" }, "Translating..."));
}

// js/components/common/ThemeToggle.jsx
import React5 from "react";
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return /* @__PURE__ */ React5.createElement(
    "button",
    {
      onClick: toggleTheme,
      className: "p-2.5 rounded-full bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105",
      title: "Toggle Light / Dark Theme"
    },
    theme === "dark" ? /* @__PURE__ */ React5.createElement("svg", { className: "w-4 h-4 text-amber-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React5.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" })) : /* @__PURE__ */ React5.createElement("svg", { className: "w-4 h-4 text-slate-700", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React5.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" }))
  );
}

// js/components/common/ProfileMenu.jsx
import React6, { useState as useState4, useRef, useEffect as useEffect4 } from "react";
init_LanguageContext();
function ProfileMenu({ onNavigate }) {
  const { user, profile, role, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState4(false);
  const [isLoggingOut, setIsLoggingOut] = useState4(false);
  const menuRef = useRef(null);
  if (!user) return null;
  const displayName = profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const email = user.email || "";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();
  useEffect4(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect4(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const handleLogoutClick = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      if (onNavigate) onNavigate("#/login");
      else if (typeof window !== "undefined") window.location.hash = "#/login";
    } catch (e) {
      console.error("Error signing out:", e);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };
  const handleItemClick = (route) => {
    setIsOpen(false);
    if (onNavigate) onNavigate(route);
  };
  return /* @__PURE__ */ React6.createElement("div", { className: "relative inline-block text-left z-50 shrink-0", ref: menuRef }, /* @__PURE__ */ React6.createElement(
    "button",
    {
      type: "button",
      onClick: () => setIsOpen((prev) => !prev),
      "aria-expanded": isOpen,
      "aria-label": "User Profile Menu",
      className: "flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 shrink-0 cursor-pointer"
    },
    avatarUrl ? /* @__PURE__ */ React6.createElement(
      "img",
      {
        src: avatarUrl,
        alt: displayName,
        className: "w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-amber-500/40 shadow-sm shrink-0"
      }
    ) : /* @__PURE__ */ React6.createElement("div", { className: "w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-black text-xs flex items-center justify-center border border-amber-400/40 shadow-sm shrink-0" }, initials),
    /* @__PURE__ */ React6.createElement("div", { className: "hidden sm:flex flex-col text-left leading-tight min-w-0" }, /* @__PURE__ */ React6.createElement("span", { className: "text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap" }, displayName), /* @__PURE__ */ React6.createElement("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[140px] md:max-w-[170px]" }, email || (role === "admin" ? "Admin" : role === "publisher" ? "Publisher" : "Member"))),
    /* @__PURE__ */ React6.createElement("svg", { className: `w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React6.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M19 9l-7 7-7-7" }))
  ), isOpen && /* @__PURE__ */ React6.createElement("div", { className: "absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-[100] overflow-hidden" }, /* @__PURE__ */ React6.createElement("div", { className: "p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50" }, /* @__PURE__ */ React6.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React6.createElement("p", { className: "text-xs font-black text-slate-900 dark:text-white truncate max-w-[140px]" }, displayName), /* @__PURE__ */ React6.createElement("span", { className: `text-xs font-black uppercase px-2 py-0.5 rounded-full ${role === "admin" ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-800 border border-amber-500/20"}` }, role)), /* @__PURE__ */ React6.createElement("p", { className: "text-xs font-medium text-slate-500 dark:text-slate-400 truncate" }, email)), /* @__PURE__ */ React6.createElement("div", { className: "py-2 space-y-0.5 px-2" }, /* @__PURE__ */ React6.createElement(
    "button",
    {
      onClick: () => handleItemClick("#/profile"),
      className: "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    },
    /* @__PURE__ */ React6.createElement("svg", { className: "w-4 h-4 text-amber-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React6.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" })),
    /* @__PURE__ */ React6.createElement("span", null, t("myProfile") || "\u0B8E\u0BA9\u0BA4\u0BC1 \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC1 (Profile)")
  ), /* @__PURE__ */ React6.createElement(
    "button",
    {
      onClick: () => handleItemClick("#/history"),
      className: "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    },
    /* @__PURE__ */ React6.createElement("svg", { className: "w-4 h-4 text-amber-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React6.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" })),
    /* @__PURE__ */ React6.createElement("span", null, t("watchHistory") || "\u0BAA\u0BBE\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4 \u0BB5\u0BB0\u0BB2\u0BBE\u0BB1\u0BC1\u0B95\u0BB3\u0BCD (History)")
  ), role === "admin" && /* @__PURE__ */ React6.createElement(
    "button",
    {
      onClick: () => handleItemClick("#/admin"),
      className: "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
    },
    /* @__PURE__ */ React6.createElement("svg", { className: "w-4 h-4 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React6.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" })),
    /* @__PURE__ */ React6.createElement("span", null, t("adminConsole") || "\u0BA8\u0BBF\u0BB0\u0BCD\u0BB5\u0BBE\u0B95\u0B95\u0BCD \u0B95\u0BC1\u0BB4\u0BC1 (Admin Console)")
  ), /* @__PURE__ */ React6.createElement(
    "button",
    {
      onClick: toggleTheme,
      className: "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    },
    /* @__PURE__ */ React6.createElement("div", { className: "flex items-center gap-2.5" }, theme === "dark" ? /* @__PURE__ */ React6.createElement("svg", { className: "w-4 h-4 text-yellow-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React6.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" })) : /* @__PURE__ */ React6.createElement("svg", { className: "w-4 h-4 text-slate-700", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React6.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" })), /* @__PURE__ */ React6.createElement("span", null, theme === "dark" ? "Light Mode" : "Dark Mode"))
  )), /* @__PURE__ */ React6.createElement("div", { className: "p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50" }, /* @__PURE__ */ React6.createElement(
    "button",
    {
      onClick: handleLogoutClick,
      disabled: isLoggingOut,
      className: "w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 rounded-xl bg-red-500/10 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all disabled:opacity-50"
    },
    isLoggingOut ? /* @__PURE__ */ React6.createElement(React6.Fragment, null, /* @__PURE__ */ React6.createElement("svg", { className: "w-3.5 h-3.5 animate-spin", fill: "none", viewBox: "0 0 24 24" }, /* @__PURE__ */ React6.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), /* @__PURE__ */ React6.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })), /* @__PURE__ */ React6.createElement("span", null, t("loggingOut") || "\u0BB5\u0BC6\u0BB3\u0BBF\u0BAF\u0BC7\u0BB1\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1...")) : /* @__PURE__ */ React6.createElement(React6.Fragment, null, /* @__PURE__ */ React6.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React6.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" })), /* @__PURE__ */ React6.createElement("span", null, t("logout") || "\u0BB5\u0BC6\u0BB3\u0BBF\u0BAF\u0BC7\u0BB1\u0BC1 (Log Out)"))
  ))));
}

// js/components/common/Header.jsx
function Header({ onOpenSearch, onNavigate }) {
  const { t, language } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState5(false);
  const [isLoggingOut, setIsLoggingOut] = useState5(false);
  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  useEffect5(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      if (onNavigate) onNavigate("#/login");
      else if (typeof window !== "undefined") window.location.hash = "#/login";
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };
  return /* @__PURE__ */ React7.createElement("header", { className: `relative z-40 w-full max-w-full overflow-visible transition-all duration-200 border-b border-[#D5EBD9] dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pt-[env(safe-area-inset-top,0px)] ${isScrolled ? "py-1.5 shadow-sm" : "py-2 sm:py-2.5 shadow-sm"}` }, /* @__PURE__ */ React7.createElement("div", { className: "hidden md:flex w-full max-w-[98vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 items-center justify-between gap-4" }, /* @__PURE__ */ React7.createElement("div", { className: "flex items-center gap-3 justify-start shrink-0" }, /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: onOpenSearch,
      className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 cursor-pointer min-h-[44px]",
      "aria-label": "Search",
      title: "Search (Ctrl + K)"
    },
    /* @__PURE__ */ React7.createElement("svg", { className: "w-3.5 h-3.5 text-[#2563EB] dark:text-[#38bdf8]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React7.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" })),
    /* @__PURE__ */ React7.createElement("span", { className: "font-bold" }, t("searchTitle")),
    /* @__PURE__ */ React7.createElement("span", { className: "text-xs px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-num font-bold" }, "Ctrl+K")
  ), /* @__PURE__ */ React7.createElement("div", { className: "shrink-0" }, /* @__PURE__ */ React7.createElement(LanguageSwitcher, null))), /* @__PURE__ */ React7.createElement("div", { className: "flex items-center justify-center shrink-0 px-2" }, /* @__PURE__ */ React7.createElement("a", { href: "#/", className: "flex items-center gap-2.5 sm:gap-3 group shrink-0" }, /* @__PURE__ */ React7.createElement("picture", { className: "shrink-0" }, /* @__PURE__ */ React7.createElement("source", { srcSet: "/assets/logo-96.webp 2x, /assets/logo-48.webp 1x", type: "image/webp" }), /* @__PURE__ */ React7.createElement(
    "img",
    {
      src: "/assets/logo-48.webp",
      alt: "Muthaleetu Thisai",
      width: "48",
      height: "48",
      className: `${isScrolled ? "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" : "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12"} object-contain drop-shadow-md group-hover:scale-105 transition-all duration-300 shrink-0`
    }
  )), /* @__PURE__ */ React7.createElement("div", { className: "text-left shrink-0" }, /* @__PURE__ */ React7.createElement("div", { className: "flex items-center gap-1 sm:gap-1.5 whitespace-nowrap" }, /* @__PURE__ */ React7.createElement("h1", { className: `${isScrolled ? "text-sm sm:text-base md:text-lg" : "text-base sm:text-lg md:text-[1.35rem]"} font-extrabold tracking-tight whitespace-nowrap leading-none font-sans transition-all duration-300` }, language === "ta" ? /* @__PURE__ */ React7.createElement(React7.Fragment, null, /* @__PURE__ */ React7.createElement("span", { className: "text-[#03529A] dark:text-[#38bdf8]" }, "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 "), /* @__PURE__ */ React7.createElement("span", { className: "text-[#4A9E2C] dark:text-[#4ade80]" }, "\u0BA4\u0BBF\u0B9A\u0BC8")) : /* @__PURE__ */ React7.createElement(React7.Fragment, null, /* @__PURE__ */ React7.createElement("span", { className: "text-[#03529A] dark:text-[#38bdf8]" }, "Muthaleetu "), /* @__PURE__ */ React7.createElement("span", { className: "text-[#4A9E2C] dark:text-[#4ade80]" }, "Thisai")))), /* @__PURE__ */ React7.createElement("p", { className: "text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium pt-0.5 whitespace-nowrap leading-none" }, t("tagline"))))), /* @__PURE__ */ React7.createElement("div", { className: "flex items-center justify-end gap-2.5 shrink-0" }, /* @__PURE__ */ React7.createElement(ThemeToggle, null), user ? /* @__PURE__ */ React7.createElement("div", { className: "flex items-center gap-2 shrink-0" }, /* @__PURE__ */ React7.createElement(ProfileMenu, { onNavigate: onNavigate || ((route) => {
    if (typeof window !== "undefined") window.location.hash = route;
  }) }), /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: handleLogout,
      disabled: isLoggingOut,
      className: "hidden xl:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all shrink-0 disabled:opacity-50 border border-red-500/30 cursor-pointer min-h-[44px]",
      title: language === "ta" ? "\u0BB5\u0BC6\u0BB3\u0BBF\u0BAF\u0BC7\u0BB1\u0BC1" : "Logout"
    },
    isLoggingOut ? /* @__PURE__ */ React7.createElement("svg", { className: "w-3.5 h-3.5 animate-spin", fill: "none", viewBox: "0 0 24 24" }, /* @__PURE__ */ React7.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), /* @__PURE__ */ React7.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })) : null,
    /* @__PURE__ */ React7.createElement("span", null, language === "ta" ? "\u0BB5\u0BC6\u0BB3\u0BBF\u0BAF\u0BC7\u0BB1\u0BC1" : "Logout")
  )) : /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: () => {
        if (onNavigate) onNavigate("#/login");
        else if (typeof window !== "undefined") window.location.hash = "#/login";
      },
      className: "inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs shadow-blue-600/20 transition-all shrink-0 active:scale-95 cursor-pointer min-h-[44px]"
    },
    /* @__PURE__ */ React7.createElement("span", null, language === "ta" ? "\u0B89\u0BB3\u0BCD\u0BA8\u0BC1\u0BB4\u0BC8\u0B95" : "Sign In")
  ))), /* @__PURE__ */ React7.createElement("div", { className: "flex md:hidden w-full items-center justify-between px-3 min-h-[48px] gap-2" }, /* @__PURE__ */ React7.createElement("a", { href: "#/", className: "flex items-center gap-2 min-w-0 shrink truncate group py-1" }, /* @__PURE__ */ React7.createElement("picture", { className: "shrink-0" }, /* @__PURE__ */ React7.createElement("source", { srcSet: "/assets/logo-96.webp 2x, /assets/logo-48.webp 1x", type: "image/webp" }), /* @__PURE__ */ React7.createElement(
    "img",
    {
      src: "/assets/logo-48.webp",
      alt: "Muthaleetu Thisai",
      width: "36",
      height: "36",
      className: "w-9 h-9 object-contain drop-shadow-sm shrink-0"
    }
  )), /* @__PURE__ */ React7.createElement("div", { className: "min-w-0 truncate" }, /* @__PURE__ */ React7.createElement("h1", { className: "text-sm font-extrabold tracking-tight whitespace-nowrap leading-none font-sans" }, language === "ta" ? /* @__PURE__ */ React7.createElement(React7.Fragment, null, /* @__PURE__ */ React7.createElement("span", { className: "text-[#03529A] dark:text-[#38bdf8]" }, "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 "), /* @__PURE__ */ React7.createElement("span", { className: "text-[#4A9E2C] dark:text-[#4ade80]" }, "\u0BA4\u0BBF\u0B9A\u0BC8")) : /* @__PURE__ */ React7.createElement(React7.Fragment, null, /* @__PURE__ */ React7.createElement("span", { className: "text-[#03529A] dark:text-[#38bdf8]" }, "Muthaleetu "), /* @__PURE__ */ React7.createElement("span", { className: "text-[#4A9E2C] dark:text-[#4ade80]" }, "Thisai"))))), /* @__PURE__ */ React7.createElement("div", { className: "flex items-center gap-2 shrink-0" }, /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: onOpenSearch,
      className: "w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all",
      "aria-label": "Search",
      title: "Search"
    },
    /* @__PURE__ */ React7.createElement("svg", { className: "w-5 h-5 text-[#2563EB] dark:text-[#38bdf8]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React7.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }))
  ), user ? /* @__PURE__ */ React7.createElement(ProfileMenu, { onNavigate: onNavigate || ((route) => {
    if (typeof window !== "undefined") window.location.hash = route;
  }) }) : /* @__PURE__ */ React7.createElement(
    "button",
    {
      onClick: () => {
        if (onNavigate) onNavigate("#/login");
        else if (typeof window !== "undefined") window.location.hash = "#/login";
      },
      className: "h-11 min-h-[44px] px-3.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 flex items-center justify-center active:scale-95"
    },
    /* @__PURE__ */ React7.createElement("span", null, language === "ta" ? "\u0B89\u0BB3\u0BCD\u0BA8\u0BC1\u0BB4\u0BC8\u0B95" : "Sign In")
  ))));
}
var Header_default = Header;

// js/components/common/Navbar.jsx
init_LanguageContext();
import React8, { useState as useState6 } from "react";
function Navbar({ currentPath, onNavigate }) {
  const { t, language } = useLanguage();
  const { user, role, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState6(false);
  const cleanCurrent = (currentPath || "/").toLowerCase().replace(/\/+$/, "") || "/";
  const baseNavItems = [
    { id: "home", path: "/", hash: "/", label: t("nav.home") },
    { id: "articles", path: "/articles", hash: "/articles", label: t("nav.articles") },
    { id: "videos", path: "/videos", hash: "/videos", label: t("nav.videos") },
    { id: "news", path: "/news", hash: "/news", label: t("nav.news") },
    { id: "professionals", path: "/professionals", hash: "/professionals", label: t("nav.professionals") || (language === "ta" ? "\u0BA8\u0BBF\u0BAA\u0BC1\u0BA3\u0BB0\u0BCD\u0B95\u0BB3\u0BCD" : "Professionals") },
    { id: "calculator", path: "/calculator", hash: "/calculator", label: t("nav.calculator") },
    { id: "quiz", path: "/quiz", hash: "/quiz", label: t("nav.quiz") || "Quiz" }
  ];
  const authNavItems = user ? [
    { id: "profile", path: "/profile", hash: "/profile", label: language === "ta" ? "\u0B9A\u0BC1\u0BAF\u0BB5\u0BBF\u0BB5\u0BB0\u0BAE\u0BCD" : "Profile" },
    ...role === "admin" || role === "publisher" ? [
      { id: "admin-articles", path: "/admin/articles", hash: "/admin/articles", label: language === "ta" ? "\u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BB0\u0BC8\u0B95\u0BB3\u0BCD \u0BB8\u0BCD\u0B9F\u0BC1\u0B9F\u0BBF\u0BAF\u0BCB" : "Article Studio" }
    ] : []
  ] : [
    { id: "login", path: "/login", hash: "/login", label: language === "ta" ? "\u0B89\u0BB3\u0BCD\u0BA8\u0BC1\u0BB4\u0BC8\u0B95" : "Sign In" }
  ];
  const navItems = [...baseNavItems, ...authNavItems];
  const activeItem = navItems.find((i) => {
    const ci = (i.path || i.hash || "/").replace(/^#/, "").toLowerCase().replace(/\/+$/, "") || "/";
    return cleanCurrent === ci || ci === "/" && (cleanCurrent === "" || cleanCurrent === "/home");
  });
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, /* @__PURE__ */ React8.createElement("nav", { className: "bg-[#F4F9F4] dark:bg-slate-950 text-slate-800 dark:text-slate-100 border-b border-[#D5EBD9] dark:border-slate-800 shadow-sm relative z-20" }, /* @__PURE__ */ React8.createElement("div", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10" }, /* @__PURE__ */ React8.createElement("div", { className: "hidden md:flex items-center justify-between gap-2 py-2" }, /* @__PURE__ */ React8.createElement("div", { className: "flex items-center justify-between flex-1 gap-1.5 xl:gap-2" }, navItems.map((item) => {
    if (item.isAction) {
      return /* @__PURE__ */ React8.createElement(
        "button",
        {
          key: item.id,
          onClick: () => item.action && item.action(),
          className: "relative px-4 py-2 text-[13.5px] xl:text-[14px] font-bold transition-all rounded-[10px] whitespace-nowrap text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-500/20 cursor-pointer"
        },
        item.label
      );
    }
    const cleanItem = (item.path || item.hash || "/").replace(/^#/, "").toLowerCase().replace(/\/+$/, "") || "/";
    const isActive = cleanCurrent === cleanItem || cleanItem === "/" && (cleanCurrent === "" || cleanCurrent === "/home");
    const activeClass = "bg-[#2563EB] text-white font-extrabold shadow-md shadow-blue-600/30 ring-2 ring-blue-500/20";
    const inactiveClass = "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-900 font-semibold";
    return /* @__PURE__ */ React8.createElement(
      "a",
      {
        key: item.id,
        href: item.path || item.hash || "/",
        onClick: (e) => {
          e.preventDefault();
          onNavigate(item.path || item.hash);
        },
        className: `relative px-3.5 py-2 text-[13px] xl:text-[14px] transition-all rounded-[10px] whitespace-nowrap inline-flex items-center justify-center cursor-pointer ${isActive ? activeClass : inactiveClass}`
      },
      item.label
    );
  }))), /* @__PURE__ */ React8.createElement("div", { className: "md:hidden flex items-center justify-between h-11 sm:h-12 min-w-0" }, /* @__PURE__ */ React8.createElement("div", { className: "flex items-center gap-2 min-w-0 truncate" }, /* @__PURE__ */ React8.createElement("span", { className: "w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" }), /* @__PURE__ */ React8.createElement("span", { className: "text-xs font-black text-[#2563EB] dark:text-[#60a5fa] uppercase tracking-wider truncate" }, activeItem?.label || t("nav.home"))), /* @__PURE__ */ React8.createElement("div", { className: "flex items-center gap-2 shrink-0" }, /* @__PURE__ */ React8.createElement(
    "button",
    {
      onClick: () => setMobileOpen(true),
      "aria-label": "Open Navigation Menu",
      className: "px-3.5 py-2 min-h-[44px] rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-black shadow-sm active:scale-95 cursor-pointer"
    },
    /* @__PURE__ */ React8.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React8.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M4 6h16M4 12h16M4 18h16" })),
    /* @__PURE__ */ React8.createElement("span", null, language === "ta" ? "\u0BAA\u0B9F\u0BCD\u0B9F\u0BBF" : "Menu")
  )))), mobileOpen && /* @__PURE__ */ React8.createElement("div", { className: "md:hidden fixed inset-0 z-[99999] flex", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React8.createElement(
    "div",
    {
      className: "fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity",
      onClick: () => setMobileOpen(false)
    }
  ), /* @__PURE__ */ React8.createElement("div", { className: "relative ml-auto w-[88vw] max-w-sm h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideRight" }, /* @__PURE__ */ React8.createElement("div", { className: "p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between pt-[max(1rem,env(safe-area-inset-top,1rem))]" }, /* @__PURE__ */ React8.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React8.createElement("img", { src: "/assets/logo.png", alt: "", className: "w-8 h-8 object-contain" }), /* @__PURE__ */ React8.createElement("span", { className: "font-black text-sm font-serif" }, /* @__PURE__ */ React8.createElement("span", { className: "text-[#03529A] dark:text-[#38bdf8]" }, "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 "), /* @__PURE__ */ React8.createElement("span", { className: "text-[#4A9E2C] dark:text-[#4ade80]" }, "\u0BA4\u0BBF\u0B9A\u0BC8"))), /* @__PURE__ */ React8.createElement(
    "button",
    {
      onClick: () => setMobileOpen(false),
      className: "w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center justify-center font-bold text-base border border-slate-200 dark:border-slate-800 active:scale-95 cursor-pointer",
      "aria-label": "Close menu"
    },
    /* @__PURE__ */ React8.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React8.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }))
  )), /* @__PURE__ */ React8.createElement("div", { className: "p-4 space-y-2 flex-1 overflow-y-auto" }, navItems.map((item) => {
    const cleanItem = (item.path || item.hash || "/").replace(/^#/, "").toLowerCase().replace(/\/+$/, "") || "/";
    const isActive = cleanCurrent === cleanItem || cleanItem === "/" && (cleanCurrent === "" || cleanCurrent === "/home");
    if (item.isAction) {
      return /* @__PURE__ */ React8.createElement(
        "button",
        {
          key: item.id,
          onClick: () => {
            if (item.action) item.action();
            setMobileOpen(false);
          },
          className: "w-full text-left px-4 py-3.5 min-h-[48px] rounded-2xl text-sm font-black transition-all flex items-center justify-between text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
        },
        /* @__PURE__ */ React8.createElement("span", { className: "flex items-center gap-3" }, /* @__PURE__ */ React8.createElement("span", { className: "w-2 h-2 rounded-full bg-red-500" }), /* @__PURE__ */ React8.createElement("span", { className: "text-[14px]" }, item.label))
      );
    }
    return /* @__PURE__ */ React8.createElement(
      "a",
      {
        key: item.id,
        href: item.path || item.hash || "/",
        onClick: (e) => {
          e.preventDefault();
          onNavigate(item.path || item.hash);
          setMobileOpen(false);
        },
        className: `w-full text-left px-4 py-3.5 min-h-[48px] rounded-2xl text-sm font-black transition-all flex items-center justify-between cursor-pointer ${isActive ? "bg-[#2563EB] text-white shadow-md border border-blue-500" : "text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-900 border border-transparent"}`
      },
      /* @__PURE__ */ React8.createElement("span", { className: "flex items-center gap-3" }, /* @__PURE__ */ React8.createElement("span", { className: `w-2 h-2 rounded-full ${isActive ? "bg-white" : "bg-slate-400 dark:bg-slate-600"}` }), /* @__PURE__ */ React8.createElement("span", { className: "text-[14px]" }, item.label)),
      isActive && /* @__PURE__ */ React8.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-white animate-pulse" })
    );
  })), /* @__PURE__ */ React8.createElement("div", { className: "p-4 border-t border-slate-200 dark:border-slate-800 space-y-3.5 bg-slate-50 dark:bg-slate-900/60 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]" }, /* @__PURE__ */ React8.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React8.createElement("span", { className: "text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" }, language === "ta" ? "\u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD" : "Settings"), /* @__PURE__ */ React8.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React8.createElement(LanguageSwitcher, null), /* @__PURE__ */ React8.createElement(ThemeToggle, null))), user ? /* @__PURE__ */ React8.createElement(
    "button",
    {
      onClick: () => {
        signOut && signOut();
        setMobileOpen(false);
      },
      className: "w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-extrabold hover:bg-red-100 transition-colors active:scale-95 cursor-pointer"
    },
    language === "ta" ? "\u0BB5\u0BC6\u0BB3\u0BBF\u0BAF\u0BC7\u0BB1\u0BC1\u0B95" : "Sign Out"
  ) : /* @__PURE__ */ React8.createElement(
    "a",
    {
      href: "/login",
      onClick: (e) => {
        e.preventDefault();
        onNavigate("/login");
        setMobileOpen(false);
      },
      className: "w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#2563EB] text-white text-xs font-extrabold hover:bg-blue-700 transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
    },
    /* @__PURE__ */ React8.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React8.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" })),
    /* @__PURE__ */ React8.createElement("span", null, language === "ta" ? "\u0B89\u0BB3\u0BCD\u0BA8\u0BC1\u0BB4\u0BC8\u0B95" : "Sign In")
  ))))), /* @__PURE__ */ React8.createElement("div", { className: "md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-[#D5EBD9] dark:border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] select-none max-w-full overflow-hidden" }, /* @__PURE__ */ React8.createElement("div", { className: "grid grid-cols-5 w-full max-w-full px-1 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))]" }, /* @__PURE__ */ React8.createElement(
    "a",
    {
      href: "/",
      onClick: (e) => {
        e.preventDefault();
        onNavigate("/");
      },
      className: `flex flex-col items-center justify-center min-w-0 py-1 min-h-[44px] rounded-lg transition-all active:scale-95 cursor-pointer ${cleanCurrent === "/" || cleanCurrent === "" || cleanCurrent === "/home" ? "text-[#2563EB] dark:text-[#60a5fa] font-black" : "text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white"}`,
      "aria-label": "Home"
    },
    /* @__PURE__ */ React8.createElement("svg", { className: "w-5 h-5 mb-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React8.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" })),
    /* @__PURE__ */ React8.createElement("span", { className: "text-[11px] leading-none tracking-tight truncate max-w-full px-0.5" }, language === "ta" ? "\u0BAE\u0BC1\u0B95\u0BAA\u0BCD\u0BAA\u0BC1" : "Home")
  ), /* @__PURE__ */ React8.createElement(
    "a",
    {
      href: "/articles",
      onClick: (e) => {
        e.preventDefault();
        onNavigate("/articles");
      },
      className: `flex flex-col items-center justify-center min-w-0 py-1 min-h-[44px] rounded-lg transition-all active:scale-95 cursor-pointer ${cleanCurrent === "/articles" || cleanCurrent.startsWith("/articles/") ? "text-[#2563EB] dark:text-[#60a5fa] font-black" : "text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white"}`,
      "aria-label": "Articles"
    },
    /* @__PURE__ */ React8.createElement("svg", { className: "w-5 h-5 mb-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React8.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" })),
    /* @__PURE__ */ React8.createElement("span", { className: "text-[11px] leading-none tracking-tight truncate max-w-full px-0.5" }, language === "ta" ? "\u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BB0\u0BC8" : "Articles")
  ), /* @__PURE__ */ React8.createElement(
    "a",
    {
      href: "/videos",
      onClick: (e) => {
        e.preventDefault();
        onNavigate("/videos");
      },
      className: `flex flex-col items-center justify-center min-w-0 py-1 min-h-[44px] rounded-lg transition-all active:scale-95 cursor-pointer ${cleanCurrent === "/videos" || cleanCurrent.startsWith("/videos/") ? "text-[#2563EB] dark:text-[#60a5fa] font-black" : "text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white"}`,
      "aria-label": "Videos"
    },
    /* @__PURE__ */ React8.createElement("svg", { className: "w-5 h-5 mb-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React8.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" }), /* @__PURE__ */ React8.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
    /* @__PURE__ */ React8.createElement("span", { className: "text-[11px] leading-none tracking-tight truncate max-w-full px-0.5" }, language === "ta" ? "\u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB" : "Videos")
  ), /* @__PURE__ */ React8.createElement(
    "a",
    {
      href: "/calculator",
      onClick: (e) => {
        e.preventDefault();
        onNavigate("/calculator");
      },
      className: `flex flex-col items-center justify-center min-w-0 py-1 min-h-[44px] rounded-lg transition-all active:scale-95 cursor-pointer ${cleanCurrent === "/calculator" ? "text-[#2563EB] dark:text-[#60a5fa] font-black" : "text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white"}`,
      "aria-label": "SIP Calculator"
    },
    /* @__PURE__ */ React8.createElement("svg", { className: "w-5 h-5 mb-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React8.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" })),
    /* @__PURE__ */ React8.createElement("span", { className: "text-[11px] leading-none tracking-tight truncate max-w-full px-0.5" }, language === "ta" ? "SIP \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BC1" : "Calculator")
  ), /* @__PURE__ */ React8.createElement(
    "button",
    {
      onClick: () => setMobileOpen(true),
      className: `flex flex-col items-center justify-center min-w-0 py-1 min-h-[44px] rounded-lg transition-all active:scale-95 cursor-pointer ${mobileOpen ? "text-[#2563EB] dark:text-[#60a5fa] font-black" : "text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white"}`,
      "aria-label": "Open full menu"
    },
    /* @__PURE__ */ React8.createElement("svg", { className: "w-5 h-5 mb-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React8.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M4 6h16M4 12h16M4 18h16" })),
    /* @__PURE__ */ React8.createElement("span", { className: "text-[11px] leading-none tracking-tight truncate max-w-full px-0.5" }, language === "ta" ? "\u0BAA\u0B9F\u0BCD\u0B9F\u0BBF" : "Menu")
  ))));
}
var Navbar_default = Navbar;

// js/components/common/Footer.jsx
init_LanguageContext();
import React9, { useState as useState7 } from "react";
function Footer({ onNavigate, onShowToast }) {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState7("");
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    if (onShowToast) onShowToast(t("subscribedToast") || "Subscribed successfully!");
    setEmail("");
  };
  return /* @__PURE__ */ React9.createElement("footer", { className: "bg-[#EFE9E3] dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-t border-[#C9B59C] dark:border-slate-800 pt-10 pb-8" }, /* @__PURE__ */ React9.createElement("div", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-10" }, /* @__PURE__ */ React9.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#D9CFC7] dark:border-slate-800" }, /* @__PURE__ */ React9.createElement("div", { className: "lg:col-span-6 space-y-4" }, /* @__PURE__ */ React9.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React9.createElement("picture", { className: "shrink-0" }, /* @__PURE__ */ React9.createElement("source", { srcSet: "/assets/logo-96.webp 2x, /assets/logo-48.webp 1x", type: "image/webp" }), /* @__PURE__ */ React9.createElement(
    "img",
    {
      src: "/assets/logo-48.webp",
      alt: "Muthaleetu Thisai",
      width: "48",
      height: "48",
      loading: "lazy",
      decoding: "async",
      className: "w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-md shrink-0"
    }
  )), /* @__PURE__ */ React9.createElement("span", { className: "text-2xl sm:text-3xl font-black font-serif" }, language === "ta" ? /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement("span", { className: "text-[#03529A] dark:text-[#38bdf8]" }, "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 "), /* @__PURE__ */ React9.createElement("span", { className: "text-[#2e7d32] dark:text-[#4ade80]" }, "\u0BA4\u0BBF\u0B9A\u0BC8")) : /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement("span", { className: "text-[#03529A] dark:text-[#38bdf8]" }, "Muthaleetu "), /* @__PURE__ */ React9.createElement("span", { className: "text-[#2e7d32] dark:text-[#4ade80]" }, "Thisai")))), /* @__PURE__ */ React9.createElement("p", { className: "text-sm md:text-xs text-slate-700 dark:text-slate-300 max-w-md leading-relaxed" }, t("newsLetterDesc")), /* @__PURE__ */ React9.createElement("form", { onSubmit: handleSubscribe, className: "flex flex-col sm:flex-row gap-2 max-w-md" }, /* @__PURE__ */ React9.createElement(
    "input",
    {
      type: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      placeholder: "your.email@example.com",
      required: true,
      className: "flex-1 bg-white dark:bg-slate-900 border border-[#C9B59C] dark:border-slate-800 rounded-xl px-4 py-2.5 text-base md:text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 min-h-[44px]"
    }
  ), /* @__PURE__ */ React9.createElement(
    "button",
    {
      type: "submit",
      className: "w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors shadow-md shrink-0 min-h-[44px] flex items-center justify-center active:scale-95 cursor-pointer"
    },
    t("subscribe")
  ))), /* @__PURE__ */ React9.createElement("div", { className: "lg:col-span-3 space-y-3" }, /* @__PURE__ */ React9.createElement("h4", { className: "text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-400" }, t("nav.mutualFunds"), " & ", t("nav.stocks")), /* @__PURE__ */ React9.createElement("ul", { className: "space-y-1 md:space-y-2 text-sm md:text-xs font-semibold text-slate-700 dark:text-slate-300" }, /* @__PURE__ */ React9.createElement("li", null, /* @__PURE__ */ React9.createElement(
    "a",
    {
      href: "/category/mutual-funds",
      onClick: (e) => {
        e.preventDefault();
        onNavigate && onNavigate("#/category/mutual-funds");
      },
      className: "py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
    },
    t("nav.mutualFunds")
  )), /* @__PURE__ */ React9.createElement("li", null, /* @__PURE__ */ React9.createElement(
    "a",
    {
      href: "/category/stocks",
      onClick: (e) => {
        e.preventDefault();
        onNavigate && onNavigate("#/category/stocks");
      },
      className: "py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
    },
    t("nav.stocks")
  )), /* @__PURE__ */ React9.createElement("li", null, /* @__PURE__ */ React9.createElement(
    "a",
    {
      href: "/category/personal-finance",
      onClick: (e) => {
        e.preventDefault();
        onNavigate && onNavigate("#/category/personal-finance");
      },
      className: "py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
    },
    t("nav.personalFinance")
  )), /* @__PURE__ */ React9.createElement("li", null, /* @__PURE__ */ React9.createElement(
    "a",
    {
      href: "/category/education",
      onClick: (e) => {
        e.preventDefault();
        onNavigate && onNavigate("#/category/education");
      },
      className: "py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
    },
    t("nav.education")
  )))), /* @__PURE__ */ React9.createElement("div", { className: "lg:col-span-3 space-y-3" }, /* @__PURE__ */ React9.createElement("h4", { className: "text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-400" }, language === "ta" ? "\u0BA8\u0BBF\u0BA4\u0BBF \u0B95\u0BB0\u0BC1\u0BB5\u0BBF\u0B95\u0BB3\u0BCD" : "Financial Utilities"), /* @__PURE__ */ React9.createElement("ul", { className: "space-y-1 md:space-y-2 text-sm md:text-xs font-semibold text-slate-700 dark:text-slate-300" }, /* @__PURE__ */ React9.createElement("li", null, /* @__PURE__ */ React9.createElement(
    "a",
    {
      href: "/calculator",
      onClick: (e) => {
        e.preventDefault();
        onNavigate && onNavigate("#/calculator");
      },
      className: "py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
    },
    t("sipCalculatorTitle")
  )), /* @__PURE__ */ React9.createElement("li", null, /* @__PURE__ */ React9.createElement(
    "a",
    {
      href: "/videos",
      onClick: (e) => {
        e.preventDefault();
        onNavigate && onNavigate("#/videos");
      },
      className: "py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
    },
    language === "ta" ? "\u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB \u0BA4\u0BCA\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1" : "YouTube Video Feed"
  )), /* @__PURE__ */ React9.createElement("li", null, /* @__PURE__ */ React9.createElement(
    "a",
    {
      href: "/news",
      onClick: (e) => {
        e.preventDefault();
        onNavigate && onNavigate("#/news");
      },
      className: "py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
    },
    language === "ta" ? "\u0BA8\u0BBF\u0BA4\u0BBF\u0B9A\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD" : "Financial News Hub"
  )), /* @__PURE__ */ React9.createElement("li", null, /* @__PURE__ */ React9.createElement(
    "a",
    {
      href: "/professionals",
      onClick: (e) => {
        e.preventDefault();
        onNavigate && onNavigate("#/professionals");
      },
      className: "py-1.5 md:py-0 min-h-[40px] md:min-h-0 flex items-center hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
    },
    language === "ta" ? "AMFI \u0BAA\u0BA4\u0BBF\u0BB5\u0BC1\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4 \u0BB5\u0BBF\u0BA8\u0BBF\u0BAF\u0BCB\u0B95\u0BB8\u0BCD\u0BA4\u0BB0\u0BCD\u0B95\u0BB3\u0BCD" : "AMFI Registered MFDs"
  ))))), /* @__PURE__ */ React9.createElement("div", { className: "space-y-2 text-xs md:text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-5xl" }, /* @__PURE__ */ React9.createElement("h5", { className: "font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs" }, t("footerDisclaimerTitle")), /* @__PURE__ */ React9.createElement("p", { className: "text-xs md:text-xs leading-relaxed" }, t("footerDisclaimerText"))), /* @__PURE__ */ React9.createElement("div", { className: "pt-4 text-center text-xs md:text-xs text-slate-700 dark:text-slate-300 font-semibold" }, t("copyright"))));
}
var Footer_default = Footer;

// js/components/home/TrendingTicker.jsx
init_LanguageContext();
init_translations();
import React10, { useState as useState8 } from "react";
function TrendingTicker({ onNavigate }) {
  const { t, language } = useLanguage();
  const isTamil = language === "ta";
  const [isDismissed, setIsDismissed] = useState8(false);
  const tickerHeadlines = isTamil ? [
    { text: "@budgetpadmanaban_ \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB: \u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BBF\u0BAF\u0BB5\u0BC8 & \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0B95\u0BCD\u0B95\u0BC2\u0B9F\u0BBE\u0BA4\u0BB5\u0BC8!", link: "#/videos" },
    { text: "NIFTY 50 \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0B89\u0B9A\u0BCD\u0B9A\u0BAE\u0BBE\u0BA9 24,850 \u0BAA\u0BC1\u0BB3\u0BCD\u0BB3\u0BBF\u0B95\u0BB3\u0BC8\u0BA4\u0BCD \u0BA4\u0BCA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1! \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 \u0B8F\u0BB1\u0BCD\u0BB1\u0BAE\u0BCD \u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1!", link: "#/news" },
    { text: "\u0B86\u0BB0\u0BCD\u0BAA\u0BBF\u0B90 \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF \u0BB5\u0BBF\u0B95\u0BBF\u0BA4\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BAE\u0BBF\u0BB2\u0BCD\u0BB2\u0BC8 - \u0BB9\u0BCB\u0BAE\u0BCD \u0BB2\u0BCB\u0BA9\u0BCD \u0B87\u0B8E\u0BAE\u0BCD\u0B90 \u0B9A\u0BC1\u0BAE\u0BC8 \u0B85\u0BA4\u0BBF\u0B95\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BBE\u0BA4\u0BC1!", link: "#/news" },
    { text: "SIP \u0BAE\u0BC2\u0BB2\u0BAE\u0BCD \u20B91 \u0B95\u0BCB\u0B9F\u0BBF \u0BA8\u0BBF\u0BA4\u0BBF \u0B87\u0BB2\u0B95\u0BCD\u0B95\u0BC8 \u0B85\u0B9F\u0BC8\u0BB5\u0BA4\u0BC1 \u0B8E\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF? \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BB0\u0BC1\u0BB5\u0BBF\u0BAF\u0BC8\u0BAA\u0BCD \u0BAA\u0BBE\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD!", link: "#/calculator" },
    { text: "\u0B9A\u0BC6\u0BAA\u0BBF \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD \u0BB5\u0BBF\u0BA4\u0BBF\u0BAE\u0BC1\u0BB1\u0BC8\u0B95\u0BB3\u0BCD 2026: \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BBE\u0BB3\u0BB0\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BB5\u0BA9\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BC1!", link: "#/articles" }
  ] : [
    { text: "@budgetpadmanaban_ New Video: Mutual Fund Do's & Don'ts Guide released!", link: "#/videos" },
    { text: "NIFTY 50 touches record all-time high of 24,850 points! Bull rally expands!", link: "#/news" },
    { text: "RBI keeps Repo Rate unchanged at 6.50% - Fixed Deposit & EMI outlook steady!", link: "#/news" },
    { text: "How to reach \u20B91 Crore through disciplined SIPs? Try our interactive calculator!", link: "#/calculator" },
    { text: "SEBI Enforces Enhanced Transparency Regulations 2026 for Retail Mutual Funds!", link: "#/articles" }
  ];
  const handleHeadlineClick = (link) => {
    if (onNavigate) {
      onNavigate(link);
    } else if (typeof window !== "undefined") {
      window.location.hash = link;
    }
  };
  const renderHeadlinesTrack = (keyPrefix) => /* @__PURE__ */ React10.createElement("div", { key: keyPrefix, className: "flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8" }, tickerHeadlines.map((item, idx) => /* @__PURE__ */ React10.createElement(
    "span",
    {
      key: `${keyPrefix}-hl-${idx}`,
      onClick: () => handleHeadlineClick(item.link),
      className: "group/hl text-[#FBBF24] hover:text-white cursor-pointer transition-all duration-150 flex items-center gap-2 font-bold text-xs sm:text-[13px] tracking-tight whitespace-nowrap select-none",
      title: "Click to view details"
    },
    /* @__PURE__ */ React10.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" }),
    /* @__PURE__ */ React10.createElement("span", { className: "group-hover/hl:underline underline-offset-2 decoration-amber-400 decoration-2 font-bold text-[#FBBF24]" }, item.text)
  )));
  const renderMarketTrack = (keyPrefix) => /* @__PURE__ */ React10.createElement("div", { key: keyPrefix, className: "flex items-center gap-5 shrink-0 pr-5 font-num text-xs sm:text-xs font-bold text-white leading-none" }, marketSnapshotData.map((item, idx) => /* @__PURE__ */ React10.createElement("div", { key: `${keyPrefix}-mkt-${idx}`, className: "inline-flex items-center gap-1.5 whitespace-nowrap" }, /* @__PURE__ */ React10.createElement("span", { className: "text-slate-600 dark:text-slate-400 font-semibold" }, item.symbol, ":"), /* @__PURE__ */ React10.createElement("span", { className: "text-white font-bold" }, item.value), /* @__PURE__ */ React10.createElement("span", { className: item.isUp ? "text-[#16A34A] font-bold" : "text-[#DC2626] font-bold" }, item.isUp ? "\u25B2" : "\u25BC", " ", item.percent), /* @__PURE__ */ React10.createElement("span", { className: "text-slate-600 ml-1" }, "\u2022"))));
  return /* @__PURE__ */ React10.createElement(React10.Fragment, null, /* @__PURE__ */ React10.createElement("div", { className: "hidden md:block w-full max-w-full overflow-hidden min-w-0 bg-[#0F172A] text-white border-y border-slate-800 shadow-sm relative z-30 select-none" }, /* @__PURE__ */ React10.createElement("div", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3 flex items-center justify-between min-w-0" }, /* @__PURE__ */ React10.createElement("div", { className: "flex items-center shrink-0 pr-3 sm:pr-4" }, /* @__PURE__ */ React10.createElement("div", { className: "bg-[#DC2626] text-white font-extrabold text-xs sm:text-xs tracking-wider px-2.5 sm:px-3.5 py-1 rounded-md uppercase flex items-center justify-center gap-1.5 font-sans shadow-sm shrink-0" }, /* @__PURE__ */ React10.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-white animate-ping" }), /* @__PURE__ */ React10.createElement("span", null, isTamil ? "\u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD" : "BREAKING NEWS"))), /* @__PURE__ */ React10.createElement("div", { className: "flex-1 min-w-0 max-w-full overflow-hidden flex items-center pl-2" }, /* @__PURE__ */ React10.createElement("div", { className: "overflow-hidden relative w-full min-w-0 max-w-full flex items-center" }, /* @__PURE__ */ React10.createElement("div", { className: "animate-marquee flex items-center whitespace-nowrap" }, renderHeadlinesTrack("navy-hl-1"), renderMarketTrack("navy-mkt-1"), renderHeadlinesTrack("navy-hl-2"), renderMarketTrack("navy-mkt-2")))))), !isDismissed && /* @__PURE__ */ React10.createElement("div", { className: "md:hidden w-full bg-[#0F172A] text-white border-y border-slate-800 py-1.5 px-2 relative z-30 select-none flex items-center gap-2" }, /* @__PURE__ */ React10.createElement("div", { className: "bg-[#DC2626] text-white font-extrabold text-[11px] px-2 py-0.5 rounded uppercase flex items-center gap-1 shrink-0" }, /* @__PURE__ */ React10.createElement("span", { className: "w-1 h-1 rounded-full bg-white animate-ping" }), /* @__PURE__ */ React10.createElement("span", null, isTamil ? "\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD" : "LIVE")), /* @__PURE__ */ React10.createElement("div", { className: "flex-1 min-w-0 overflow-x-auto flex items-center gap-4 no-scrollbar snap-x snap-mandatory py-0.5 touch-pan-x" }, tickerHeadlines.map((item, idx) => /* @__PURE__ */ React10.createElement(
    "div",
    {
      key: `mob-hl-${idx}`,
      onClick: () => handleHeadlineClick(item.link),
      className: "snap-start shrink-0 flex items-center gap-1.5 text-xs text-[#FBBF24] font-bold active:opacity-75 cursor-pointer max-w-[280px] truncate"
    },
    /* @__PURE__ */ React10.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" }),
    /* @__PURE__ */ React10.createElement("span", { className: "truncate" }, item.text)
  )), marketSnapshotData.map((mkt, idx) => /* @__PURE__ */ React10.createElement(
    "div",
    {
      key: `mob-mkt-${idx}`,
      className: "snap-start shrink-0 flex items-center gap-1 text-[11px] font-num font-bold text-white whitespace-nowrap"
    },
    /* @__PURE__ */ React10.createElement("span", { className: "text-slate-400" }, mkt.symbol, ":"),
    /* @__PURE__ */ React10.createElement("span", null, mkt.value),
    /* @__PURE__ */ React10.createElement("span", { className: mkt.isUp ? "text-[#16A34A]" : "text-[#DC2626]" }, mkt.isUp ? "\u25B2" : "\u25BC", " ", mkt.percent)
  ))), /* @__PURE__ */ React10.createElement(
    "button",
    {
      onClick: () => setIsDismissed(true),
      className: "w-11 h-11 min-w-[44px] min-h-[44px] text-slate-400 hover:text-white flex items-center justify-center rounded-lg text-sm shrink-0 active:scale-95 transition-colors",
      "aria-label": "Dismiss breaking news ticker",
      title: "Dismiss"
    },
    /* @__PURE__ */ React10.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React10.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }))
  )));
}
var TrendingTicker_default = TrendingTicker;

// js/components/home/Home.jsx
init_LanguageContext();
import React17, { Suspense, lazy } from "react";

// js/components/home/HeroSection.jsx
init_LanguageContext();
init_translations();
import React11, { useMemo } from "react";

// js/services/articles.js
init_translations();
import { useState as useState9, useEffect as useEffect6 } from "react";
var liveArticlesCache = null;
var liveArticlesPromise = null;
function cleanImageUrl(url, category = "mutual-fund", fallbackUrl = null) {
  if (url && typeof url === "string" && url.trim() && url !== "/favicon.svg") {
    const trimmed = url.trim();
    if (trimmed.startsWith("data:image")) {
      return trimmed;
    }
    if (trimmed.includes("images.unsplash.com")) {
      let clean = trimmed.replace(/&w=\d+/g, "&w=600").replace(/&q=\d+/g, "&q=75");
      if (!clean.includes("fm=webp")) clean += "&fm=webp";
      return clean;
    }
    if (trimmed.includes("img.youtube.com/vi/") || trimmed.includes("i.ytimg.com/vi/")) {
      const match = trimmed.match(/\/vi\/([^/?#]+)\//);
      if (match && match[1]) {
        return `https://i.ytimg.com/vi_webp/${match[1]}/mqdefault.webp`;
      }
    }
    return trimmed;
  }
  if (fallbackUrl && typeof fallbackUrl === "string" && fallbackUrl !== "/favicon.svg") {
    return fallbackUrl;
  }
  const cat = (category || "").toLowerCase();
  if (cat.includes("mutual") || cat.includes("sip")) {
    return "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=75&fm=webp";
  } else if (cat.includes("stock") || cat.includes("market") || cat.includes("ipo")) {
    return "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=75&fm=webp";
  } else if (cat.includes("personal") || cat.includes("finance") || cat.includes("saving")) {
    return "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=75&fm=webp";
  } else if (cat.includes("tax") || cat.includes("retire")) {
    return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=75&fm=webp";
  } else {
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=75&fm=webp";
  }
}
function normalizeArticleItem(item, language = "ta") {
  if (!item) return null;
  const isTamil = language === "ta";
  const id = item.id || item.slug || Math.random().toString(36).substring(2, 9);
  const slug = item.slug || `article-${id}`;
  const titleTamil = item.titleTamil || item.title_ta || item.title || "\u0BA8\u0BBF\u0BA4\u0BBF \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD";
  const titleEnglish = item.titleEnglish || item.title_en || item.title || titleTamil;
  const title = isTamil ? titleTamil || titleEnglish : titleEnglish || titleTamil;
  const summaryTamil = item.summaryTamil || item.excerptTamil || item.excerpt_ta || item.summary || "";
  const summaryEnglish = item.summaryEnglish || item.excerptEnglish || item.excerpt_en || summaryTamil;
  const summary = isTamil ? summaryTamil || summaryEnglish : summaryEnglish || summaryTamil;
  const rawThumb = item.cover_image_url || item.coverImage || item.thumbnail_url || item.thumbnail || item.imageUrl || "";
  const category = (item.category || "mutual-fund").replace("_", "-");
  const thumbnail = cleanImageUrl(rawThumb, category);
  const publishedAt = item.publishedAt || item.published_at || item.created_at || "2025-01-01T00:00:00.000Z";
  const authorName = item.authorName || item.author_name || (item.author_profile ? item.author_profile.full_name : null) || "Budget Padmanaban CFP\xAE";
  const authorRole = item.authorRole || item.author_role || (item.author_profile ? item.author_profile.designation : null) || "Financial Advisor";
  const authorAvatar = item.authorAvatar || item.author_avatar || (item.author_profile ? item.author_profile.avatar_url : null) || null;
  const authorArn = item.authorArn || item.author_arn || (item.author_profile ? item.author_profile.arn_number : "") || "";
  const isLive = Boolean(item.created_at || item.published_at || item.body_ta || item.body);
  const views = Number(item.views_count ?? item.views ?? item.view_count ?? item.read_count ?? 0);
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
    coverImage: thumbnail,
    category,
    publishedAt,
    authorName,
    authorRole,
    authorAvatar,
    authorArn,
    isLive,
    views,
    views_count: views
  };
}
async function fetchCardArticles(limit = 24, sort = "newest", forceRefresh = false) {
  if (!forceRefresh && liveArticlesCache && liveArticlesCache.length > 0) {
    return liveArticlesCache;
  }
  if (!forceRefresh && liveArticlesPromise) {
    return liveArticlesPromise;
  }
  liveArticlesPromise = (async () => {
    try {
      if (!forceRefresh && typeof window !== "undefined" && window.__HOME__) {
        try {
          const homeResult = await window.__HOME__;
          const homeList = homeResult?.data?.articles || homeResult?.articles;
          if (Array.isArray(homeList) && homeList.length > 0) {
            homeList.sort((a, b) => {
              const tA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
              const tB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
              return tB - tA;
            });
            liveArticlesCache = homeList;
            try {
              sessionStorage.setItem("muthaleetu_articles_cache", JSON.stringify(homeList));
            } catch (_) {
            }
          }
        } catch (_) {
        }
      }
      const res = await fetch(`/api/articles?view=card&limit=${limit}&sort=${sort}`);
      if (res.ok) {
        const json = await res.json();
        const list = json.data || [];
        if (Array.isArray(list) && list.length > 0) {
          list.sort((a, b) => {
            const tA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
            const tB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
            return tB - tA;
          });
          liveArticlesCache = list;
          try {
            sessionStorage.setItem("muthaleetu_articles_cache", JSON.stringify(list));
            localStorage.setItem("muthaleetu_articles_cache", JSON.stringify(list));
          } catch (_) {
          }
          return list;
        }
      }
    } catch (err) {
      console.warn("Card articles fetch fallback:", err.message);
    } finally {
      liveArticlesPromise = null;
    }
    if (liveArticlesCache && liveArticlesCache.length > 0) {
      return liveArticlesCache;
    }
    if (typeof window !== "undefined" && window.__INITIAL_DATA__?.articles) {
      const initial = [...window.__INITIAL_DATA__.articles];
      initial.sort((a, b) => {
        const tA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
        const tB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
        return tB - tA;
      });
      return initial;
    }
    return newsData;
  })();
  return liveArticlesPromise;
}
function useLiveArticles() {
  const [liveArticles, setLiveArticles] = useState9(() => {
    if (liveArticlesCache && liveArticlesCache.length > 0) {
      return liveArticlesCache;
    }
    try {
      const cached = localStorage.getItem("muthaleetu_articles_cache") || sessionStorage.getItem("muthaleetu_articles_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.sort((a, b) => {
            const tA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
            const tB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
            return tB - tA;
          });
          return parsed;
        }
      }
    } catch (_) {
    }
    if (typeof window !== "undefined" && window.__INITIAL_DATA__?.articles) {
      return window.__INITIAL_DATA__.articles;
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState9(liveArticles.length === 0);
  useEffect6(() => {
    let isMounted = true;
    const load = async (force = false) => {
      const list = await fetchCardArticles(24, "newest", force);
      if (isMounted && Array.isArray(list) && list.length > 0) {
        setLiveArticles(list);
        setIsLoading(false);
      }
    };
    load(true);
    const handleUpdate = () => {
      liveArticlesCache = null;
      load(true);
    };
    window.addEventListener("articles_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("articles_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);
  return { liveArticles, isLoading };
}

// js/components/home/HeroSection.jsx
function HeroSection({ news, onNavigate }) {
  const { t, language } = useLanguage();
  const isTamil = language === "ta";
  const { liveArticles } = useLiveArticles();
  const combinedArticles = useMemo(() => {
    const liveList = (liveArticles || []).map((a) => normalizeArticleItem(a, language)).filter(Boolean);
    const passedList = (news || newsData || []).map((a) => normalizeArticleItem(a, language)).filter(Boolean);
    const seen = /* @__PURE__ */ new Set();
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
    merged.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
      const dateB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
      return dateB - dateA;
    });
    return merged;
  }, [liveArticles, news, language]);
  const featuredStories = combinedArticles.slice(0, 8);
  const latestStories = combinedArticles.slice(0, 4);
  const getCategoryStyle = (cat = "") => {
    const c = (cat || "").toLowerCase();
    if (c.includes("mutual") || c.includes("sip")) {
      return { bg: "bg-[#F0FDF4] dark:bg-emerald-950/50", text: "text-[#15803d] dark:text-[#4ade80]", border: "border-emerald-100 dark:border-emerald-900/40" };
    }
    if (c.includes("stock") || c.includes("market") || c.includes("ipo")) {
      return { bg: "bg-[#EFF6FF] dark:bg-blue-950/50", text: "text-[#2563EB] dark:text-[#60a5fa]", border: "border-blue-100 dark:border-blue-900/40" };
    }
    if (c.includes("personal") || c.includes("finance") || c.includes("saving")) {
      return { bg: "bg-[#FBF7EF] dark:bg-amber-950/40", text: "text-amber-800", border: "border-amber-100 dark:border-amber-900/40" };
    }
    if (c.includes("tax") || c.includes("retire")) {
      return { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-900/40" };
    }
    return { bg: "bg-[#EFF6FF] dark:bg-slate-800/60", text: "text-[#2563EB] dark:text-[#60a5fa]", border: "border-blue-100 dark:border-slate-700" };
  };
  const renderFeaturedTrack = (keyPrefix) => /* @__PURE__ */ React11.createElement("div", { key: keyPrefix, className: "flex items-stretch shrink-0 gap-4 pr-4" }, featuredStories.map((item, idx) => {
    const formattedDate = new Intl.DateTimeFormat(
      language === "ta" ? "ta-IN" : "en-IN",
      { month: "short", day: "numeric" }
    ).format(new Date(item.publishedAt || Date.now()));
    const isLcp = keyPrefix === "f-track-1" && idx === 0;
    return /* @__PURE__ */ React11.createElement(
      "article",
      {
        key: `${keyPrefix}-${item.id || idx}`,
        onClick: () => onNavigate && onNavigate(`#/articles/${item.slug}`),
        className: "group/item relative w-[260px] sm:w-[290px] md:w-[320px] h-[255px] sm:h-[275px] shrink-0 rounded-2xl overflow-hidden flex flex-col justify-end p-4 sm:p-5 select-none cursor-pointer bg-slate-950 shadow-md border border-slate-800/60 hover:border-slate-700 transition-all hover:scale-[1.02]"
      },
      /* @__PURE__ */ React11.createElement(
        "img",
        {
          src: item.thumbnail,
          srcSet: item.thumbnail?.includes("images.unsplash.com") ? `${item.thumbnail.split("?")[0]}?w=320&q=70&auto=format&fit=crop&fm=webp 320w, ${item.thumbnail.split("?")[0]}?w=480&q=70&auto=format&fit=crop&fm=webp 480w, ${item.thumbnail.split("?")[0]}?w=768&q=70&auto=format&fit=crop&fm=webp 768w` : void 0,
          sizes: "(max-width: 640px) 290px, 320px",
          alt: item.title,
          fetchpriority: isLcp ? "high" : "auto",
          loading: isLcp ? "eager" : "lazy",
          decoding: "async",
          width: "320",
          height: "275",
          className: "absolute inset-0 w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700 opacity-75"
        }
      ),
      /* @__PURE__ */ React11.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" }),
      /* @__PURE__ */ React11.createElement("div", { className: "absolute top-3 left-3 right-3 flex items-center justify-between z-10" }, /* @__PURE__ */ React11.createElement("span", { className: "px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-md bg-amber-500 text-slate-950 shadow-sm" }, (item.category || "FINANCE").replace("-", " ")), /* @__PURE__ */ React11.createElement("span", { className: "px-2 py-0.5 rounded-md bg-slate-950/85 text-slate-200 text-xs font-num font-bold border border-white/15" }, formattedDate)),
      /* @__PURE__ */ React11.createElement("div", { className: "relative z-10 space-y-1 mt-10" }, /* @__PURE__ */ React11.createElement("h3", { className: "text-sm sm:text-[15px] md:text-[16px] font-bold text-white leading-snug font-sans group-hover/item:text-amber-400 transition-colors drop-shadow line-clamp-2" }, item.title), item.summary && /* @__PURE__ */ React11.createElement("p", { className: "text-xs text-slate-300/90 line-clamp-2 font-sans leading-relaxed" }, item.summary), /* @__PURE__ */ React11.createElement("div", { className: "pt-1 flex items-center justify-between text-xs text-amber-400 font-bold" }, /* @__PURE__ */ React11.createElement("span", { className: "flex items-center gap-1 group-hover/item:translate-x-1 transition-transform" }, /* @__PURE__ */ React11.createElement("span", null, t("readArticle") || "Read Full Story"), /* @__PURE__ */ React11.createElement("span", null, "\u2192")), /* @__PURE__ */ React11.createElement("span", { className: "text-xs text-slate-600 dark:text-slate-400 font-num" }, "Tap to read")))
    );
  }));
  return /* @__PURE__ */ React11.createElement("section", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0" }, /* @__PURE__ */ React11.createElement("div", { className: "w-full" }, /* @__PURE__ */ React11.createElement("div", { className: "hidden lg:grid grid-cols-12 gap-6 lg:gap-8 items-stretch min-w-0 max-w-full" }, /* @__PURE__ */ React11.createElement("div", { className: "lg:col-span-7 xl:col-span-8 min-w-0 max-w-full flex flex-col justify-between overflow-hidden" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center gap-2.5 min-w-0 truncate" }, /* @__PURE__ */ React11.createElement("span", { className: "w-3 h-3 rounded-full bg-[#DC2626] animate-ping shrink-0" }), /* @__PURE__ */ React11.createElement("h2", { className: "text-lg sm:text-xl md:text-2xl 2xl:text-[24px] font-black tracking-wide uppercase font-sans truncate" }, isTamil ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("span", { className: "text-slate-950 dark:text-white" }, "\u0B9A\u0BBF\u0BB1\u0BAA\u0BCD\u0BAA\u0BC1\u0B9A\u0BCD "), /* @__PURE__ */ React11.createElement("span", { className: "text-[#4A9E2C]" }, "\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD")) : /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("span", { className: "text-slate-950 dark:text-white" }, "FEATURED "), /* @__PURE__ */ React11.createElement("span", { className: "text-[#4A9E2C]" }, "NEWS")))), /* @__PURE__ */ React11.createElement("span", { className: "text-xs font-bold text-[#2563EB] dark:text-[#60a5fa] bg-[#EFF6FF] dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full shrink-0 font-num" }, "LIVE TICKER SPOTLIGHT")), /* @__PURE__ */ React11.createElement("div", { className: "featured-marquee-wrapper overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-950/90 w-full min-w-0 max-w-full shadow-inner p-2.5 sm:p-3 group/marquee" }, /* @__PURE__ */ React11.createElement("div", { className: "animate-featured-marquee flex items-stretch whitespace-normal" }, renderFeaturedTrack("f-track-1"), renderFeaturedTrack("f-track-2")))), /* @__PURE__ */ React11.createElement("div", { className: "lg:col-span-5 xl:col-span-4 min-w-0 max-w-full overflow-hidden flex flex-col justify-between" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center gap-2.5 min-w-0 truncate" }, /* @__PURE__ */ React11.createElement("span", { className: "w-3 h-3 rounded-full bg-[#2563EB] shrink-0" }), /* @__PURE__ */ React11.createElement("h3", { className: "text-lg sm:text-xl md:text-2xl 2xl:text-[24px] font-black uppercase tracking-wide font-sans truncate" }, isTamil ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("span", { className: "text-slate-950 dark:text-white" }, "\u0B9A\u0BAE\u0BC0\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF "), /* @__PURE__ */ React11.createElement("span", { className: "text-[#4A9E2C]" }, "\u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BB0\u0BC8\u0B95\u0BB3\u0BCD")) : /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("span", { className: "text-slate-950 dark:text-white" }, "LATEST "), /* @__PURE__ */ React11.createElement("span", { className: "text-[#4A9E2C]" }, "ARTICLES")))), /* @__PURE__ */ React11.createElement("span", { className: "text-xs font-bold text-[#15803d] dark:text-[#4ade80] bg-[#DCFCE7] dark:bg-emerald-950/60 px-2 py-0.5 rounded-full shrink-0 font-num" }, "Latest")), /* @__PURE__ */ React11.createElement("div", { className: "space-y-2 flex-1 flex flex-col justify-between" }, latestStories.map((article, idx) => {
    const style = getCategoryStyle(article.category);
    return /* @__PURE__ */ React11.createElement(
      "div",
      {
        key: article.id || `latest-${idx}`,
        role: "button",
        tabIndex: 0,
        onClick: () => onNavigate && onNavigate(`#/articles/${article.slug}`),
        className: "group flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all cursor-pointer"
      },
      /* @__PURE__ */ React11.createElement("div", { className: "relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl shrink-0 overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs group-hover:shadow-md transition-all" }, /* @__PURE__ */ React11.createElement(
        "img",
        {
          src: article.thumbnail || article.coverImage,
          alt: article.title,
          loading: "lazy",
          decoding: "async",
          width: "56",
          height: "56",
          className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500",
          onError: (e) => {
            e.target.style.display = "none";
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = "flex";
            }
          }
        }
      ), /* @__PURE__ */ React11.createElement("div", { className: `hidden absolute inset-0 items-center justify-center ${style.bg} ${style.text}` }, /* @__PURE__ */ React11.createElement("svg", { className: "w-5 h-5 opacity-70", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React11.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" })))),
      /* @__PURE__ */ React11.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center gap-1.5 mb-0.5" }, /* @__PURE__ */ React11.createElement("span", { className: `text-xs font-extrabold uppercase tracking-wider ${style.text}` }, (article.category || "FINANCE").replace("-", " ")), /* @__PURE__ */ React11.createElement("span", { className: "text-xs text-slate-600 dark:text-slate-400 font-num font-medium" }, "\u2022 ", new Date(article.publishedAt).toLocaleDateString(isTamil ? "ta-IN" : "en-IN", { month: "short", day: "numeric" }))), /* @__PURE__ */ React11.createElement("h4", { className: "text-sm sm:text-[14px] md:text-[15px] font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-[#2563EB] dark:group-hover:text-[#60a5fa] transition-colors leading-snug" }, article.title)),
      /* @__PURE__ */ React11.createElement("span", { className: "text-slate-600 dark:text-slate-400 group-hover:text-[#2563EB] dark:group-hover:text-[#60a5fa] group-hover:translate-x-1 transition-all shrink-0 text-xs font-bold pr-1" }, "\u2192")
    );
  })))), /* @__PURE__ */ React11.createElement("div", { className: "lg:hidden space-y-6" }, /* @__PURE__ */ React11.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center gap-2 min-w-0 truncate" }, /* @__PURE__ */ React11.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-ping shrink-0" }), /* @__PURE__ */ React11.createElement("h2", { className: "text-base sm:text-lg font-black tracking-wide uppercase font-sans truncate" }, isTamil ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("span", { className: "text-slate-950 dark:text-white" }, "\u0B9A\u0BBF\u0BB1\u0BAA\u0BCD\u0BAA\u0BC1\u0B9A\u0BCD "), /* @__PURE__ */ React11.createElement("span", { className: "text-[#4A9E2C]" }, "\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD")) : /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("span", { className: "text-slate-950 dark:text-white" }, "FEATURED "), /* @__PURE__ */ React11.createElement("span", { className: "text-[#4A9E2C]" }, "NEWS")))), /* @__PURE__ */ React11.createElement("span", { className: "text-[11px] font-bold text-[#2563EB] dark:text-[#60a5fa] bg-[#EFF6FF] dark:bg-blue-950/60 px-2 py-0.5 rounded-full shrink-0" }, "Swipe \u2194")), /* @__PURE__ */ React11.createElement("div", { className: "flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-2 no-scrollbar touch-pan-x -mx-1 px-1" }, featuredStories.map((item, idx) => {
    const formattedDate = new Intl.DateTimeFormat(
      language === "ta" ? "ta-IN" : "en-IN",
      { month: "short", day: "numeric" }
    ).format(new Date(item.publishedAt || Date.now()));
    return /* @__PURE__ */ React11.createElement(
      "article",
      {
        key: `mob-feat-${item.id || idx}`,
        onClick: () => onNavigate && onNavigate(`#/articles/${item.slug}`),
        className: "group relative w-[80vw] max-w-[300px] h-[260px] shrink-0 snap-center rounded-2xl overflow-hidden flex flex-col justify-end p-4 select-none cursor-pointer bg-slate-950 shadow-md border border-slate-800/80 active:scale-[0.98] transition-all"
      },
      /* @__PURE__ */ React11.createElement(
        "img",
        {
          src: item.thumbnail,
          alt: item.title,
          loading: "lazy",
          decoding: "async",
          className: "absolute inset-0 w-full h-full object-cover opacity-75"
        }
      ),
      /* @__PURE__ */ React11.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none" }),
      /* @__PURE__ */ React11.createElement("div", { className: "absolute top-3 left-3 right-3 flex items-center justify-between z-10" }, /* @__PURE__ */ React11.createElement("span", { className: "px-2 py-0.5 text-[11px] font-black uppercase tracking-wider rounded-md bg-amber-500 text-slate-950 shadow-sm" }, (item.category || "FINANCE").replace("-", " ")), /* @__PURE__ */ React11.createElement("span", { className: "px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-200 text-[11px] font-num font-bold border border-white/20" }, formattedDate)),
      /* @__PURE__ */ React11.createElement("div", { className: "relative z-10 space-y-1.5 mt-auto" }, /* @__PURE__ */ React11.createElement("h3", { className: "text-[15px] sm:text-base font-bold text-white leading-snug font-sans group-hover:text-amber-400 line-clamp-2" }, item.title), /* @__PURE__ */ React11.createElement("div", { className: "pt-1 flex items-center justify-between text-xs text-amber-400 font-bold" }, /* @__PURE__ */ React11.createElement("span", null, t("readArticle") || "Read Story", " \u2192"), /* @__PURE__ */ React11.createElement("span", { className: "text-[11px] text-slate-400 font-num" }, "Tap to open")))
    );
  }))), /* @__PURE__ */ React11.createElement("div", { className: "space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center justify-between pb-1" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React11.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-[#2563EB] shrink-0" }), /* @__PURE__ */ React11.createElement("h3", { className: "text-base sm:text-lg font-black uppercase tracking-wide font-sans" }, isTamil ? /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("span", { className: "text-slate-950 dark:text-white" }, "\u0B9A\u0BAE\u0BC0\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF "), /* @__PURE__ */ React11.createElement("span", { className: "text-[#4A9E2C]" }, "\u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BB0\u0BC8\u0B95\u0BB3\u0BCD")) : /* @__PURE__ */ React11.createElement(React11.Fragment, null, /* @__PURE__ */ React11.createElement("span", { className: "text-slate-950 dark:text-white" }, "LATEST "), /* @__PURE__ */ React11.createElement("span", { className: "text-[#4A9E2C]" }, "ARTICLES")))), /* @__PURE__ */ React11.createElement(
    "button",
    {
      onClick: () => onNavigate && onNavigate("#/articles"),
      className: "text-xs font-bold text-[#2563EB] dark:text-[#60a5fa] hover:underline"
    },
    isTamil ? "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1\u0BAE\u0BCD" : "View all",
    " \u2192"
  )), /* @__PURE__ */ React11.createElement("div", { className: "space-y-2.5" }, latestStories.map((article, idx) => {
    const style = getCategoryStyle(article.category);
    return /* @__PURE__ */ React11.createElement(
      "div",
      {
        key: `mob-latest-${article.id || idx}`,
        role: "button",
        tabIndex: 0,
        onClick: () => onNavigate && onNavigate(`#/articles/${article.slug}`),
        className: "group flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[56px] active:scale-[0.99]"
      },
      /* @__PURE__ */ React11.createElement("div", { className: "relative w-14 h-14 rounded-xl shrink-0 overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs" }, /* @__PURE__ */ React11.createElement(
        "img",
        {
          src: article.thumbnail || article.coverImage,
          alt: article.title,
          loading: "lazy",
          decoding: "async",
          className: "w-full h-full object-cover"
        }
      )),
      /* @__PURE__ */ React11.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React11.createElement("div", { className: "flex items-center gap-1.5 mb-1" }, /* @__PURE__ */ React11.createElement("span", { className: `text-[11px] font-extrabold uppercase tracking-wider ${style.text}` }, (article.category || "FINANCE").replace("-", " ")), /* @__PURE__ */ React11.createElement("span", { className: "text-[11px] text-slate-500 dark:text-slate-400 font-num" }, "\u2022 ", new Date(article.publishedAt).toLocaleDateString(isTamil ? "ta-IN" : "en-IN", { month: "short", day: "numeric" }))), /* @__PURE__ */ React11.createElement("h4", { className: "text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug" }, article.title)),
      /* @__PURE__ */ React11.createElement("span", { className: "text-slate-400 group-hover:text-[#2563EB] shrink-0 text-sm font-bold pr-1" }, "\u2192")
    );
  }))))));
}
var HeroSection_default = HeroSection;

// js/components/home/TrendingArticlesSection.jsx
init_LanguageContext();
init_translations();
import React12, { useMemo as useMemo2 } from "react";
function TrendingArticlesSection({ onNavigate }) {
  const { t, language } = useLanguage();
  const isTamil = language === "ta";
  const { liveArticles } = useLiveArticles();
  const allArticles = useMemo2(() => {
    const liveList = (liveArticles || []).map((a) => normalizeArticleItem(a, language)).filter(Boolean);
    const seedList = (newsData || []).map((a) => normalizeArticleItem(a, language)).filter(Boolean);
    const seenSlugs = /* @__PURE__ */ new Set();
    const merged = [];
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
    merged.sort((a, b) => {
      const viewsA = Number(a.views_count ?? a.views ?? 0);
      const viewsB = Number(b.views_count ?? b.views ?? 0);
      if (viewsB !== viewsA) return viewsB - viewsA;
      const dateA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
      const dateB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
      return dateB - dateA;
    });
    return merged.slice(0, 6);
  }, [liveArticles, language]);
  return /* @__PURE__ */ React12.createElement("div", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0" }, /* @__PURE__ */ React12.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800" }, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-2 min-w-0 truncate" }, /* @__PURE__ */ React12.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-[#4A9E2C] shrink-0 shadow-xs" }), /* @__PURE__ */ React12.createElement("h2", { className: "text-base sm:text-lg md:text-xl font-black font-sans truncate drop-shadow-xs" }, isTamil ? /* @__PURE__ */ React12.createElement(React12.Fragment, null, /* @__PURE__ */ React12.createElement("span", { className: "text-slate-950 dark:text-white" }, "\u0B9F\u0BBF\u0BB0\u0BC6\u0BA3\u0BCD\u0B9F\u0BBF\u0B99\u0BCD "), /* @__PURE__ */ React12.createElement("span", { className: "text-[#4A9E2C]" }, "\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD & \u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BB0\u0BC8\u0B95\u0BB3\u0BCD")) : /* @__PURE__ */ React12.createElement(React12.Fragment, null, /* @__PURE__ */ React12.createElement("span", { className: "text-slate-950 dark:text-white" }, "TRENDING "), /* @__PURE__ */ React12.createElement("span", { className: "text-[#4A9E2C]" }, "ARTICLES")))), /* @__PURE__ */ React12.createElement("span", { className: "text-xs sm:text-xs font-bold text-[#4A9E2C] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full font-num shrink-0 shadow-xs" }, "Top 6 Trending")), /* @__PURE__ */ React12.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5" }, allArticles.map((article, idx) => {
    const formattedDate = new Date(article.publishedAt).toLocaleDateString(
      isTamil ? "ta-IN" : "en-IN",
      { month: "short", day: "numeric" }
    );
    return /* @__PURE__ */ React12.createElement(
      "div",
      {
        key: article.id || `trend-${idx}`,
        role: "button",
        tabIndex: 0,
        onClick: () => onNavigate && onNavigate(`#/articles/${article.slug}`),
        className: "group flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer select-none active:scale-[0.99]"
      },
      /* @__PURE__ */ React12.createElement("div", { className: "w-20 sm:w-24 h-20 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-800" }, /* @__PURE__ */ React12.createElement(
        "img",
        {
          src: article.thumbnail || article.coverImage,
          alt: article.title,
          loading: "lazy",
          decoding: "async",
          className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        }
      )),
      /* @__PURE__ */ React12.createElement("div", { className: "flex-1 min-w-0 flex flex-col justify-between h-full py-0.5" }, /* @__PURE__ */ React12.createElement("div", null, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-2 mb-1" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-sans" }, (article.category || "FINANCE").replace("-", " ")), /* @__PURE__ */ React12.createElement("span", { className: "text-[10.5px] sm:text-[11px] text-slate-400 font-num" }, "\u2022 ", formattedDate)), /* @__PURE__ */ React12.createElement("h3", { className: "text-xs sm:text-[13.5px] font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug font-sans" }, article.title)), /* @__PURE__ */ React12.createElement("div", { className: "mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" }, /* @__PURE__ */ React12.createElement("span", { className: "truncate max-w-[140px] font-medium text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs" }, article.authorName || "Budget Padmanaban"), /* @__PURE__ */ React12.createElement("span", { className: "text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform text-xs sm:text-sm" }, "\u2192")))
    );
  }))));
}
var TrendingArticlesSection_default = TrendingArticlesSection;

// js/components/home/HomeLatestVideos.jsx
import React15, { useState as useState10, useEffect as useEffect8 } from "react";

// js/components/youtube/YouTubeVideoCard.jsx
import React13 from "react";

// js/utils/youtubeFormatters.js
function formatCompactViews(count, isTamil = false) {
  const num = typeof count === "number" ? count : parseInt(count || "0", 10);
  if (isNaN(num) || num <= 0) return isTamil ? "0 \u0BAA\u0BBE\u0BB0\u0BCD\u0BB5\u0BC8\u0B95\u0BB3\u0BCD" : "0 views";
  let formatted = "";
  if (num >= 1e6) {
    formatted = (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1e3) {
    formatted = (num / 1e3).toFixed(num >= 1e4 ? 0 : 1).replace(/\.0$/, "") + "K";
  } else {
    formatted = num.toString();
  }
  return isTamil ? `${formatted} \u0BAA\u0BBE\u0BB0\u0BCD\u0BB5\u0BC8\u0B95\u0BB3\u0BCD` : `${formatted} views`;
}
function formatRelativeTime(dateStr, isTamil = false) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.max(0, Math.floor(diffMs / 1e3));
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  if (diffHours < 1) {
    return isTamil ? "\u0B9A\u0BB1\u0BCD\u0BB1\u0BC1 \u0BAE\u0BC1\u0BA9\u0BCD" : "Just now";
  }
  if (diffHours < 24) {
    return isTamil ? `${diffHours} \u0BAE\u0BA3\u0BBF \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD \u0BAE\u0BC1\u0BA9\u0BCD` : `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return isTamil ? `${diffDays} \u0BA8\u0BBE\u0B9F\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BC1\u0BA9\u0BCD` : `${diffDays}d ago`;
  }
  if (diffWeeks < 4) {
    return isTamil ? `${diffWeeks} \u0BB5\u0BBE\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BC1\u0BA9\u0BCD` : `${diffWeeks}w ago`;
  }
  if (diffMonths < 12) {
    return isTamil ? `${diffMonths} \u0BAE\u0BBE\u0BA4\u0BAE\u0BCD \u0BAE\u0BC1\u0BA9\u0BCD` : `${diffMonths} mo ago`;
  }
  return isTamil ? `${diffYears} \u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD \u0BAE\u0BC1\u0BA9\u0BCD` : `${diffYears} yr ago`;
}
function formatVideoDuration(seconds) {
  const total = typeof seconds === "number" ? seconds : parseInt(seconds || "0", 10);
  if (isNaN(total) || total <= 0) return "0:00";
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor(total % 3600 / 60);
  const secs = total % 60;
  const secStr = secs < 10 ? `0${secs}` : `${secs}`;
  if (hrs > 0) {
    const minStr = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hrs}:${minStr}:${secStr}`;
  }
  return `${mins}:${secStr}`;
}

// js/components/youtube/YouTubeVideoCard.jsx
function YouTubeVideoCard({ video, onSelect, isTamil = false }) {
  if (!video) return null;
  const videoId = video.video_id || video.youtubeId || video.id;
  const title = video.title || video.titleTamil || video.titleEnglish || "Budget Padmanaban Video";
  const durationSeconds = video.duration_seconds || video.durationSeconds || 0;
  const durationText = video.duration || formatVideoDuration(durationSeconds);
  const views = video.view_count || video.views || 0;
  const publishedAt = video.published_at || video.publishedAt;
  const thumbnailUrl = video.thumbnail_url || video.thumbnail || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "/assets/logo.png");
  const compactViews = formatCompactViews(views, isTamil);
  const timeAgo = formatRelativeTime(publishedAt, isTamil);
  const handleClick = () => {
    if (onSelect) onSelect(video);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };
  return /* @__PURE__ */ React13.createElement(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      className: "group cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl transition-all duration-200 flex flex-col",
      "aria-label": title
    },
    /* @__PURE__ */ React13.createElement("div", { className: "relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shrink-0" }, /* @__PURE__ */ React13.createElement(
      "img",
      {
        src: thumbnailUrl,
        alt: title,
        loading: "lazy",
        decoding: "async",
        onError: (e) => {
          if (videoId && !e.target.src.includes("hqdefault.jpg")) {
            e.target.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          }
        },
        className: "w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200 ease-out"
      }
    ), /* @__PURE__ */ React13.createElement("div", { className: "absolute inset-0 bg-transparent group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center" }, /* @__PURE__ */ React13.createElement("div", { className: "w-10 h-10 rounded-full bg-white/95 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg transform group-hover:scale-100 scale-90" }, /* @__PURE__ */ React13.createElement("svg", { className: "w-4 h-4 fill-current ml-0.5", viewBox: "0 0 24 24" }, /* @__PURE__ */ React13.createElement("polygon", { points: "5 3 19 12 5 21 5 3" })))), video.is_live ? /* @__PURE__ */ React13.createElement("div", { className: "absolute top-2 left-2 px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md" }, /* @__PURE__ */ React13.createElement("span", { className: "w-2 h-2 rounded-full bg-white animate-ping" }), /* @__PURE__ */ React13.createElement("span", null, "LIVE")) : null, durationText && !video.is_live ? /* @__PURE__ */ React13.createElement("span", { className: "absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-semibold leading-none shadow-sm" }, durationText) : null),
    /* @__PURE__ */ React13.createElement(
      "h3",
      {
        className: "mt-2.5 text-[14px] font-semibold text-slate-900 dark:text-white leading-[1.35] line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
        title
      },
      title
    ),
    /* @__PURE__ */ React13.createElement("div", { className: "mt-1 text-[12px] text-slate-500 dark:text-slate-400 font-medium flex items-center flex-wrap gap-x-1.5 leading-tight" }, /* @__PURE__ */ React13.createElement("span", null, "Budget Padmanaban"), /* @__PURE__ */ React13.createElement("span", null, "\xB7"), /* @__PURE__ */ React13.createElement("span", null, compactViews), timeAgo ? /* @__PURE__ */ React13.createElement(React13.Fragment, null, /* @__PURE__ */ React13.createElement("span", null, "\xB7"), /* @__PURE__ */ React13.createElement("span", null, timeAgo)) : null)
  );
}
var YouTubeVideoCard_default = YouTubeVideoCard;

// js/components/youtube/YouTubePlayerModal.jsx
import React14, { useEffect as useEffect7 } from "react";
function YouTubePlayerModal({ video, allVideos = [], onClose, onSelectRelated, isTamil = false, onShowToast }) {
  if (!video) return null;
  const videoId = video.video_id || video.youtubeId || video.id;
  const title = video.title || video.titleTamil || video.titleEnglish || "Budget Padmanaban Video";
  const views = video.view_count || video.views || 0;
  const publishedAt = video.published_at || video.publishedAt;
  const summary = (isTamil ? video.ai_summary_ta || video.summaryTamil : video.ai_summary_en || video.summaryEnglish) || video.description || video.descriptionTamil || video.descriptionEnglish || "";
  const compactViews = formatCompactViews(views, isTamil);
  const timeAgo = formatRelativeTime(publishedAt, isTamil);
  useEffect7(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);
  const relatedVideos = (allVideos || []).filter((v) => (v.video_id || v.youtubeId || v.id) !== videoId && !v.is_short && !v.isShort).sort((a, b) => {
    const aCat = a.category === video.category ? 1 : 0;
    const bCat = b.category === video.category ? 1 : 0;
    return bCat - aCat;
  }).slice(0, 8);
  const handleShareWhatsApp = () => {
    const shareUrl = `https://www.muthaleetuthisai.com/#/videos/watch/${videoId}`;
    const text = encodeURIComponent(`Watch "${title}" on Muthaleetu Thisai: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };
  const handleCopyLink = () => {
    const shareUrl = `https://www.muthaleetuthisai.com/#/videos/watch/${videoId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      if (onShowToast) onShowToast(isTamil ? "\u0B87\u0BA3\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1 \u0BA8\u0B95\u0BB2\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1!" : "Link copied to clipboard!");
    }
  };
  return /* @__PURE__ */ React14.createElement(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn",
      onClick: onClose
    },
    /* @__PURE__ */ React14.createElement(
      "div",
      {
        className: "relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row",
        onClick: (e) => e.stopPropagation()
      },
      /* @__PURE__ */ React14.createElement(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-md",
          title: "Close (Esc)",
          "aria-label": "Close"
        },
        /* @__PURE__ */ React14.createElement("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ React14.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
      ),
      /* @__PURE__ */ React14.createElement("div", { className: "flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-4" }, /* @__PURE__ */ React14.createElement("div", { className: "relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-lg" }, /* @__PURE__ */ React14.createElement(
        "iframe",
        {
          src: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
          title,
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowFullScreen: true,
          className: "absolute inset-0 w-full h-full border-0"
        }
      )), /* @__PURE__ */ React14.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React14.createElement("div", { className: "flex items-center justify-between flex-wrap gap-2" }, /* @__PURE__ */ React14.createElement("span", { className: "px-3 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider" }, video.category || "Mutual Funds"), /* @__PURE__ */ React14.createElement("span", { className: "text-xs text-slate-400 font-medium" }, compactViews, " ", timeAgo ? `\xB7 ${timeAgo}` : "")), /* @__PURE__ */ React14.createElement("h2", { className: "text-base sm:text-xl font-bold font-serif text-white leading-snug" }, title), summary ? /* @__PURE__ */ React14.createElement("div", { className: "p-3.5 sm:p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1 text-xs sm:text-sm text-slate-200" }, /* @__PURE__ */ React14.createElement("div", { className: "text-[11px] font-bold text-blue-400 uppercase tracking-wider" }, isTamil ? "\u0B9A\u0BC1\u0BB0\u0BC1\u0B95\u0BCD\u0B95\u0BAE\u0BBE\u0BA9 \u0BAA\u0BBE\u0BB0\u0BCD\u0BB5\u0BC8 (Key Takeaway)" : "AI Key Takeaway"), /* @__PURE__ */ React14.createElement("p", { className: "leading-relaxed" }, summary)) : null, /* @__PURE__ */ React14.createElement("div", { className: "flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800" }, /* @__PURE__ */ React14.createElement(
        "a",
        {
          href: "https://www.youtube.com/@budgetpadmanaban_?sub_confirmation=1",
          target: "_blank",
          rel: "noreferrer",
          className: "px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
        },
        /* @__PURE__ */ React14.createElement("svg", { className: "w-4 h-4 fill-current", viewBox: "0 0 24 24" }, /* @__PURE__ */ React14.createElement("path", { d: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" })),
        /* @__PURE__ */ React14.createElement("span", null, isTamil ? "\u0B9A\u0BAA\u0BCD\u0BB8\u0BCD\u0B95\u0BBF\u0BB0\u0BC8\u0BAA\u0BCD" : "Subscribe")
      ), /* @__PURE__ */ React14.createElement(
        "a",
        {
          href: `https://www.youtube.com/watch?v=${videoId}`,
          target: "_blank",
          rel: "noreferrer",
          className: "px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
        },
        /* @__PURE__ */ React14.createElement("span", null, isTamil ? "YouTube-\u0BB2\u0BCD \u0BA4\u0BBF\u0BB1\u0B95\u0BCD\u0B95" : "Open on YouTube"),
        /* @__PURE__ */ React14.createElement("span", null, "\u2197")
      ), /* @__PURE__ */ React14.createElement(
        "button",
        {
          type: "button",
          onClick: handleShareWhatsApp,
          className: "px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
        },
        /* @__PURE__ */ React14.createElement("span", null, "WhatsApp")
      ), /* @__PURE__ */ React14.createElement(
        "button",
        {
          type: "button",
          onClick: handleCopyLink,
          className: "px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        },
        isTamil ? "\u0B87\u0BA3\u0BC8\u0BAA\u0BCD\u0BAA\u0BC8 \u0BA8\u0B95\u0BB2\u0BC6\u0B9F\u0BC1" : "Copy Link"
      ), /* @__PURE__ */ React14.createElement(
        "a",
        {
          href: "#/tools",
          onClick: () => onClose && onClose(),
          className: "ml-auto px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
        },
        /* @__PURE__ */ React14.createElement("span", null, isTamil ? "SIP \u0B95\u0BBE\u0BB2\u0BCD\u0B95\u0BC1\u0BB2\u0BC7\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD" : "SIP Calculator"),
        /* @__PURE__ */ React14.createElement("span", null, "\u2192")
      )))),
      relatedVideos.length > 0 ? /* @__PURE__ */ React14.createElement("div", { className: "w-full lg:w-80 lg:max-w-xs border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 overflow-y-auto no-scrollbar bg-slate-900/90 shrink-0" }, /* @__PURE__ */ React14.createElement("h3", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-3" }, isTamil ? "\u0B85\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1 \u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95 (Up Next)" : "Up Next"), /* @__PURE__ */ React14.createElement("div", { className: "space-y-3" }, relatedVideos.map((item) => {
        const relId = item.video_id || item.youtubeId || item.id;
        const relTitle = item.title || item.titleTamil || item.titleEnglish;
        const relDuration = item.duration || formatVideoDuration(item.duration_seconds || item.durationSeconds);
        const relThumb = item.thumbnail_url || item.thumbnail || (relId ? `https://i.ytimg.com/vi/${relId}/hqdefault.jpg` : "/assets/logo.png");
        return /* @__PURE__ */ React14.createElement(
          "div",
          {
            key: relId,
            role: "button",
            tabIndex: 0,
            onClick: () => onSelectRelated && onSelectRelated(item),
            onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && onSelectRelated && onSelectRelated(item),
            className: "group flex items-start gap-2.5 cursor-pointer rounded-lg p-1.5 hover:bg-slate-800 transition-colors select-none"
          },
          /* @__PURE__ */ React14.createElement("div", { className: "relative aspect-video w-24 rounded-lg overflow-hidden bg-slate-950 shrink-0" }, /* @__PURE__ */ React14.createElement(
            "img",
            {
              src: relThumb,
              alt: relTitle,
              loading: "lazy",
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform"
            }
          ), relDuration ? /* @__PURE__ */ React14.createElement("span", { className: "absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[10px] text-white font-mono" }, relDuration) : null),
          /* @__PURE__ */ React14.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React14.createElement("h4", { className: "text-xs font-semibold text-slate-200 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors" }, relTitle), /* @__PURE__ */ React14.createElement("p", { className: "text-[11px] text-slate-500 mt-1" }, formatCompactViews(item.view_count || item.views, isTamil)))
        );
      }))) : null
    )
  );
}
var YouTubePlayerModal_default = YouTubePlayerModal;

// js/components/home/HomeLatestVideos.jsx
function HomeLatestVideos({ initialVideos = [], language = "ta", onShowToast }) {
  const isTamil = language === "ta";
  const [videos, setVideos] = useState10(initialVideos);
  const [selectedVideo, setSelectedVideo] = useState10(null);
  const [isLoading, setIsLoading] = useState10(initialVideos.length === 0);
  useEffect8(() => {
    let isMounted = true;
    if (initialVideos && initialVideos.length >= 3) {
      setVideos(initialVideos.slice(0, 6));
      setIsLoading(false);
      return;
    }
    fetch("/api/youtube/videos?type=videos&limit=6").then((res) => res.ok ? res.json() : null).then((data) => {
      if (isMounted && data?.data && Array.isArray(data.data)) {
        setVideos(data.data.slice(0, 6));
        setIsLoading(false);
      }
    }).catch((err) => {
      console.warn("Home latest videos fetch warning:", err);
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [initialVideos]);
  return /* @__PURE__ */ React15.createElement("section", { className: "w-full py-10 sm:py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" }, /* @__PURE__ */ React15.createElement("div", { className: "w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-6" }, /* @__PURE__ */ React15.createElement("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-3" }, /* @__PURE__ */ React15.createElement("div", null, /* @__PURE__ */ React15.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React15.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" }), /* @__PURE__ */ React15.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400" }, isTamil ? "\u0BAF\u0BC2\u0B9F\u0BBF\u0BAF\u0BC2\u0BAA\u0BCD \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD" : "YouTube Channel")), /* @__PURE__ */ React15.createElement("h2", { className: "mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif" }, isTamil ? "\u0BAA\u0B9F\u0BCD\u0B9C\u0BC6\u0B9F\u0BCD \u0BAA\u0BA4\u0BCD\u0BAE\u0BA8\u0BBE\u0BAA\u0BA9\u0BCD \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD" : "Latest from Budget Padmanaban")), /* @__PURE__ */ React15.createElement(
    "a",
    {
      href: "#/videos",
      className: "inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors group"
    },
    /* @__PURE__ */ React15.createElement("span", null, isTamil ? "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0B95\u0BBE\u0BA3\u0BCD\u0B95" : "View all videos"),
    /* @__PURE__ */ React15.createElement("span", { className: "group-hover:translate-x-1 transition-transform" }, "\u2192")
  )), isLoading ? /* @__PURE__ */ React15.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" }, [...Array(6)].map((_, i) => /* @__PURE__ */ React15.createElement("div", { key: i, className: "animate-pulse space-y-3" }, /* @__PURE__ */ React15.createElement("div", { className: "aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl" }), /* @__PURE__ */ React15.createElement("div", { className: "h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" }), /* @__PURE__ */ React15.createElement("div", { className: "h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" })))) : videos.length > 0 ? /* @__PURE__ */ React15.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" }, videos.map((vid) => /* @__PURE__ */ React15.createElement(
    YouTubeVideoCard_default,
    {
      key: vid.video_id || vid.youtubeId || vid.id,
      video: vid,
      onSelect: (v) => setSelectedVideo(v),
      isTamil
    }
  ))) : null), selectedVideo ? /* @__PURE__ */ React15.createElement(
    YouTubePlayerModal_default,
    {
      video: selectedVideo,
      allVideos: videos,
      onClose: () => setSelectedVideo(null),
      onSelectRelated: (v) => setSelectedVideo(v),
      isTamil,
      onShowToast
    }
  ) : null);
}
var HomeLatestVideos_default = HomeLatestVideos;

// js/components/home/Home.jsx
var SipCalculator2 = lazy(() => Promise.resolve().then(() => (init_SipCalculator(), SipCalculator_exports)));
function LazyMount({ children, fallback }) {
  const [isVisible, setIsVisible] = React17.useState(false);
  const ref = React17.useRef(null);
  React17.useEffect(() => {
    if (!ref.current || isVisible) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "200px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);
  return /* @__PURE__ */ React17.createElement("div", { ref }, isVisible ? children : fallback || null);
}
function Home({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  return /* @__PURE__ */ React17.createElement("div", { className: "w-full animate-fadeIn flex flex-col" }, /* @__PURE__ */ React17.createElement("section", { className: "w-full bg-[#FFFFFF] dark:bg-slate-900/60 py-8 sm:py-12 border-b border-slate-100 dark:border-slate-800" }, /* @__PURE__ */ React17.createElement(HeroSection_default, { onNavigate })), /* @__PURE__ */ React17.createElement(
    HomeLatestVideos_default,
    {
      onShowToast,
      language
    }
  ), /* @__PURE__ */ React17.createElement("section", { className: "w-full bg-[#FFFFFF] dark:bg-slate-900/60 py-10 sm:py-14 border-b border-slate-100 dark:border-slate-800" }, /* @__PURE__ */ React17.createElement(TrendingArticlesSection_default, { onNavigate })), /* @__PURE__ */ React17.createElement("section", { className: "w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 sm:py-14 pb-16 sm:pb-20" }, /* @__PURE__ */ React17.createElement(LazyMount, { fallback: /* @__PURE__ */ React17.createElement("div", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 py-8 text-center text-sm font-medium text-emerald-200 min-h-[120px]" }, "\u0BA8\u0BBF\u0BA4\u0BBF \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BB0\u0BC1\u0BB5\u0BBF \u0B8F\u0BB1\u0BCD\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1...") }, /* @__PURE__ */ React17.createElement(Suspense, { fallback: /* @__PURE__ */ React17.createElement("div", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 py-8 text-center text-sm font-medium text-emerald-200 min-h-[120px]" }, "\u0BA8\u0BBF\u0BA4\u0BBF \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BB0\u0BC1\u0BB5\u0BBF \u0B8F\u0BB1\u0BCD\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1...") }, /* @__PURE__ */ React17.createElement(SipCalculator2, null)))));
}
var Home_default = Home;

// scripts/render-html.js
init_translations();
if (typeof globalThis.window === "undefined") {
  globalThis.window = {
    location: { hash: "", pathname: "/", search: "", href: "https://www.muthaleetuthisai.com/" },
    addEventListener: () => {
    },
    removeEventListener: () => {
    },
    matchMedia: () => ({ matches: false, addEventListener: () => {
    }, removeEventListener: () => {
    } }),
    scrollTo: () => {
    }
  };
}
if (typeof globalThis.localStorage === "undefined") {
  globalThis.localStorage = {
    getItem: (k) => k === "muthaleetu_theme" ? "light" : null,
    setItem: () => {
    },
    removeItem: () => {
    }
  };
}
if (typeof globalThis.document === "undefined") {
  globalThis.document = {
    documentElement: { setAttribute: () => {
    }, getAttribute: () => "light" },
    title: ""
  };
}
function getPrerenderedHomepage() {
  const serverData2 = {
    articles: newsData.slice(0, 12),
    videos: videosData.slice(0, 12)
  };
  const html2 = renderToString(
    /* @__PURE__ */ React18.createElement(ThemeProvider, null, /* @__PURE__ */ React18.createElement(LanguageProvider, null, /* @__PURE__ */ React18.createElement(AuthProvider, null, /* @__PURE__ */ React18.createElement("div", { className: "min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans" }, /* @__PURE__ */ React18.createElement("div", { className: "sticky-header-container sticky top-0 z-40 w-full shadow-md bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800" }, /* @__PURE__ */ React18.createElement(Header_default, { onOpenSearch: () => {
    }, onNavigate: () => {
    } }), /* @__PURE__ */ React18.createElement(Navbar_default, { currentPath: "/", onNavigate: () => {
    } })), /* @__PURE__ */ React18.createElement(TrendingTicker_default, { onNavigate: () => {
    } }), /* @__PURE__ */ React18.createElement("main", { className: "flex-1" }, /* @__PURE__ */ React18.createElement(Home_default, { onNavigate: () => {
    }, onShowToast: () => {
    } })), /* @__PURE__ */ React18.createElement(Footer_default, { onNavigate: () => {
    }, onShowToast: () => {
    } })))))
  );
  return { html: html2, serverData: serverData2 };
}
var { html, serverData } = getPrerenderedHomepage();
console.log(JSON.stringify({ html, serverData }));
export {
  getPrerenderedHomepage
};
