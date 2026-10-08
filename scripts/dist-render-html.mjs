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
  default: () => SipCalculator_default
});
import React18, { useState as useState14, useMemo as useMemo5 } from "react";
function SipCalculator() {
  const { t, language } = useLanguage();
  const [calcMode, setCalcMode] = useState14("sip");
  const [inputAmount, setInputAmount] = useState14("150");
  const [lastValidAmount, setLastValidAmount] = useState14(150);
  const [timeframe, setTimeframe] = useState14("1Y");
  const [analysisTab, setAnalysisTab] = useState14("pie");
  const [selectedFundName, setSelectedFundName] = useState14("SBI Arbitrage Opportunities Fund");
  const isTamil = language === "ta";
  const RETURN_RATES = {
    sip: {
      "1Y": { years: 1, fund: 6.65, bench: 6.62, addBench: 4.28 },
      "3Y": { years: 3, fund: 7.85, bench: 7.3, addBench: 5.95 },
      "5Y": { years: 5, fund: 7.42, bench: 6.98, addBench: 5.82 },
      "SI": { years: 18.5, fund: 7.42, bench: 6.98, addBench: 5.82 }
    },
    lumpsum: {
      "1Y": { years: 1, fund: 6.64, bench: 7.02, addBench: 4.3 },
      "3Y": { years: 3, fund: 7.53, bench: 7.44, addBench: 6.27 },
      "5Y": { years: 5, fund: 6.78, bench: 6.54, addBench: 5.67 },
      "SI": { years: 18.5, fund: 6.54, bench: 5.83, addBench: 5.8 }
    }
  };
  const currentRates = RETURN_RATES[calcMode][timeframe];
  const years = currentRates.years;
  const parsedNum = Number(inputAmount);
  const isInvalid = inputAmount === "" || isNaN(parsedNum) || parsedNum < 150 || parsedNum > 1e6;
  const activeAmount = isInvalid ? lastValidAmount : parsedNum;
  const handleAmountChange = (valStr) => {
    setInputAmount(valStr);
    const num = Number(valStr);
    if (!isNaN(num) && num >= 150 && num <= 1e6) {
      setLastValidAmount(num);
    }
  };
  const calculateMaturity = (rate, amt) => {
    const r = rate / 100;
    if (calcMode === "sip") {
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
  const totalInvested = calcMode === "sip" ? Math.round(activeAmount * years * 12) : activeAmount;
  const estimatedGain = Math.max(0, fundAmount - totalInvested);
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };
  const formatLakhs = (val) => {
    if (val >= 1e5) {
      return "\u20B9 " + (val / 1e5).toFixed(0) + " Lakh" + (val >= 2e5 ? "s" : "");
    }
    return "\u20B9 " + val.toLocaleString("en-IN");
  };
  const presetAmounts = [150, 500, 1e3, 5e3, 1e4, 25e3, 5e4, 1e5];
  const investedPct = fundAmount > 0 ? Math.min(100, Math.max(1, Math.round(totalInvested / fundAmount * 100))) : 100;
  const gainPct = Math.max(0, 100 - investedPct);
  const multiplier = totalInvested > 0 ? (fundAmount / totalInvested).toFixed(2) : "1.00";
  const yearlySchedule = useMemo5(() => {
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
      if (calcMode === "sip") {
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
  return /* @__PURE__ */ React18.createElement("section", { id: "calculator", className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0" }, /* @__PURE__ */ React18.createElement("div", { className: "bg-gradient-to-br from-[#0F172A] via-[#111C35] to-[#1E293B] rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl p-4 sm:p-6 lg:p-7 text-white transition-all" }, /* @__PURE__ */ React18.createElement("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800/90" }, /* @__PURE__ */ React18.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React18.createElement("div", { className: "w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shrink-0" }, /* @__PURE__ */ React18.createElement("svg", { className: "w-4 h-4 text-emerald-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ React18.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }))), /* @__PURE__ */ React18.createElement("div", null, /* @__PURE__ */ React18.createElement("h2", { className: "text-base sm:text-lg lg:text-xl font-extrabold text-white tracking-tight font-sans" }, isTamil ? "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BA3\u0BBF\u0BAA\u0BCD\u0BAA\u0BBE\u0BA9\u0BCD & \u0BAA\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BBE\u0BAF\u0BCD\u0BB5\u0BC1" : "Calculators & In-Depth Analysis"), /* @__PURE__ */ React18.createElement("p", { className: "text-xs sm:text-xs text-slate-300 font-medium font-sans" }, isTamil ? "\u0BAE\u0BBE\u0BA4\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 SIP / \u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BA4\u0BBF\u0B9F\u0BCD\u0B9F\u0BAE\u0BBF\u0B9F\u0BB2\u0BCD & \u0BB5\u0BBF\u0BB0\u0BBF\u0BB5\u0BBE\u0BA9 \u0BA8\u0BBF\u0BA4\u0BBF \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF \u0B85\u0BB1\u0BBF\u0B95\u0BCD\u0B95\u0BC8" : "Interactive SIP & Lumpsum wealth planner with visual asset chart & statement report"))), /* @__PURE__ */ React18.createElement("div", { className: "inline-flex p-1 bg-slate-900/90 rounded-full border border-slate-700/80 gap-1.5 shrink-0" }, /* @__PURE__ */ React18.createElement(
    "button",
    {
      type: "button",
      onClick: () => setCalcMode("sip"),
      className: "px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer " + (calcMode === "sip" ? "bg-[#16A34A] text-white shadow-md shadow-green-600/30" : "text-slate-300 hover:text-white")
    },
    "SIP"
  ), /* @__PURE__ */ React18.createElement(
    "button",
    {
      type: "button",
      onClick: () => setCalcMode("lumpsum"),
      className: "px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer " + (calcMode === "lumpsum" ? "bg-[#16A34A] text-white shadow-md shadow-green-600/30" : "text-slate-300 hover:text-white")
    },
    "Lumpsum"
  ))), /* @__PURE__ */ React18.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch" }, /* @__PURE__ */ React18.createElement("div", { className: "lg:col-span-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-4" }, /* @__PURE__ */ React18.createElement("div", null, /* @__PURE__ */ React18.createElement("div", { className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4" }, /* @__PURE__ */ React18.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React18.createElement("svg", { className: "w-4 h-4 text-emerald-600 dark:text-emerald-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ React18.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" })), /* @__PURE__ */ React18.createElement("h3", { className: "text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans" }, isTamil ? "1. \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BC1" : "1. Calculation Part")), /* @__PURE__ */ React18.createElement("span", { className: "text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[#16A34A] dark:text-[#4ade80] font-sans" }, calcMode === "sip" ? "Monthly SIP" : "One-Time Lumpsum")), /* @__PURE__ */ React18.createElement("div", { className: "flex items-center justify-between gap-3 mb-2" }, /* @__PURE__ */ React18.createElement("label", { className: "text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 font-sans" }, calcMode === "sip" ? isTamil ? "\u0BAE\u0BBE\u0BA4\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1" : "Monthly Investment" : isTamil ? "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BA4\u0BCA\u0B95\u0BC8" : "Investment Amount"), /* @__PURE__ */ React18.createElement("div", { className: `flex items-center bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-1 transition-all ${isInvalid ? "border-red-500 ring-1 ring-red-500" : "border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#16A34A]"}` }, /* @__PURE__ */ React18.createElement("span", { className: "text-slate-500 font-bold text-sm mr-1" }, "\u20B9"), /* @__PURE__ */ React18.createElement(
    "input",
    {
      type: "number",
      min: "150",
      max: "1000000",
      step: "50",
      value: inputAmount,
      "aria-label": "Monthly Investment Amount in Rupees",
      onChange: (e) => handleAmountChange(e.target.value),
      className: "w-20 sm:w-24 bg-transparent text-right font-black text-slate-900 dark:text-white text-sm sm:text-base outline-none font-num"
    }
  ))), isInvalid && /* @__PURE__ */ React18.createElement("p", { className: "text-xs text-red-500 font-medium mb-2 animate-fadeIn flex items-center gap-1.5" }, /* @__PURE__ */ React18.createElement("svg", { className: "w-3.5 h-3.5 text-red-500 shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ React18.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })), /* @__PURE__ */ React18.createElement("span", null, isTamil ? "\u0BA4\u0BCA\u0B95\u0BC8 \u20B9150 \u0BAE\u0BC1\u0BA4\u0BB2\u0BCD \u20B910,00,000 \u0BB5\u0BB0\u0BC8 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD (\u0B95\u0B9F\u0BC8\u0B9A\u0BBF \u0B9A\u0BB0\u0BBF\u0BAF\u0BBE\u0BA9 \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0B95\u0BBE\u0B9F\u0BCD\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1)." : "Amount must be between \u20B9150 and \u20B910,00,000 (showing last valid calculation).")), /* @__PURE__ */ React18.createElement("div", { className: "mb-3" }, /* @__PURE__ */ React18.createElement(
    "input",
    {
      type: "range",
      min: "150",
      max: "1000000",
      step: "50",
      value: activeAmount,
      "aria-label": "Monthly Investment Amount Slider",
      onChange: (e) => handleAmountChange(e.target.value),
      className: "w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#15803d]"
    }
  ), /* @__PURE__ */ React18.createElement("div", { className: "flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400 mt-1 font-num" }, /* @__PURE__ */ React18.createElement("span", null, "\u20B9 150"), /* @__PURE__ */ React18.createElement("span", null, "\u20B9 10 Lakhs"))), /* @__PURE__ */ React18.createElement("div", { className: "flex flex-wrap gap-1.5 mb-4" }, presetAmounts.map((pVal) => /* @__PURE__ */ React18.createElement(
    "button",
    {
      key: pVal,
      type: "button",
      onClick: () => handleAmountChange(String(pVal)),
      className: "px-2.5 py-1 rounded-lg text-xs font-bold font-num transition-all cursor-pointer " + (activeAmount === pVal ? "bg-[#0F172A] dark:bg-white text-white dark:text-slate-900 shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700")
    },
    formatLakhs(pVal)
  ))), /* @__PURE__ */ React18.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React18.createElement("label", { className: "text-xs font-extrabold uppercase text-slate-600 dark:text-slate-400 tracking-wider block mb-1.5 font-sans" }, isTamil ? "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BBE\u0BB2\u0BAE\u0BCD (Time Horizon)" : "Time Horizon (Years)"), /* @__PURE__ */ React18.createElement("div", { className: "flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-1 overflow-x-auto" }, [
    { id: "1Y", label: "1 Year" },
    { id: "3Y", label: "3 Years" },
    { id: "5Y", label: "5 Years" },
    { id: "SI", label: "Since Inception" }
  ].map((tItem) => /* @__PURE__ */ React18.createElement(
    "button",
    {
      key: tItem.id,
      type: "button",
      onClick: () => setTimeframe(tItem.id),
      className: "flex-1 py-1 px-2 rounded-lg text-xs font-bold font-sans whitespace-nowrap transition-all duration-200 text-center cursor-pointer " + (timeframe === tItem.id ? "bg-[#16A34A] text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")
    },
    tItem.label
  )))), /* @__PURE__ */ React18.createElement("div", { className: "bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 divide-y divide-slate-200/60 dark:divide-slate-700/60" }, /* @__PURE__ */ React18.createElement("div", { className: "pb-2 flex justify-between items-center" }, /* @__PURE__ */ React18.createElement("div", { className: "font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 font-sans truncate pr-2" }, /* @__PURE__ */ React18.createElement("span", { className: "w-2 h-2 rounded-full bg-[#16A34A] inline-block shrink-0" }), /* @__PURE__ */ React18.createElement("span", { className: "truncate" }, isTamil ? `${selectedFundName} (SBI \u0B86\u0BB0\u0BCD\u0BAA\u0BBF\u0B9F\u0BCD\u0BB0\u0BC7\u0B9C\u0BCD)` : selectedFundName)), /* @__PURE__ */ React18.createElement("div", { className: "text-right shrink-0" }, /* @__PURE__ */ React18.createElement("span", { className: "text-sm sm:text-base font-black text-slate-900 dark:text-white font-num" }, formatCurrency(fundAmount)), /* @__PURE__ */ React18.createElement("span", { className: "ml-1.5 text-xs font-bold text-[#16A34A] dark:text-[#4ade80] font-num" }, "+", currentRates.fund, "%"))), /* @__PURE__ */ React18.createElement("div", { className: "py-2 flex justify-between items-center" }, /* @__PURE__ */ React18.createElement("span", { className: "text-xs font-semibold text-slate-600 dark:text-slate-300 font-sans" }, "Nifty 50 Arbitrage Index"), /* @__PURE__ */ React18.createElement("div", { className: "text-right" }, /* @__PURE__ */ React18.createElement("span", { className: "text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-num" }, formatCurrency(benchAmount)), /* @__PURE__ */ React18.createElement("span", { className: "ml-1.5 text-xs font-bold text-slate-500 font-num" }, "+", currentRates.bench, "%"))), /* @__PURE__ */ React18.createElement("div", { className: "pt-2 flex justify-between items-center" }, /* @__PURE__ */ React18.createElement("span", { className: "text-xs font-semibold text-slate-600 dark:text-slate-300 font-sans" }, "CRISIL 1 Year T-Bill Index"), /* @__PURE__ */ React18.createElement("div", { className: "text-right" }, /* @__PURE__ */ React18.createElement("span", { className: "text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-num" }, formatCurrency(addBenchAmount)), /* @__PURE__ */ React18.createElement("span", { className: "ml-1.5 text-xs font-bold text-slate-500 font-num" }, "+", currentRates.addBench, "%"))))), /* @__PURE__ */ React18.createElement("div", { className: "bg-slate-100 dark:bg-slate-800 rounded-xl p-3 flex justify-between items-center text-xs font-sans" }, /* @__PURE__ */ React18.createElement("div", null, /* @__PURE__ */ React18.createElement("span", { className: "text-slate-500 dark:text-slate-400 block text-xs font-medium" }, isTamil ? "\u0BAE\u0BCA\u0BA4\u0BCD\u0BA4 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1" : "Total Capital Outlay"), /* @__PURE__ */ React18.createElement("span", { className: "font-black text-slate-900 dark:text-white font-num text-sm" }, formatCurrency(totalInvested))), /* @__PURE__ */ React18.createElement("div", { className: "text-right" }, /* @__PURE__ */ React18.createElement("span", { className: "text-slate-500 dark:text-slate-400 block text-xs font-medium" }, isTamil ? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BB2\u0BBE\u0BAA\u0BAE\u0BCD" : "Estimated Growth"), /* @__PURE__ */ React18.createElement("span", { className: "font-black text-[#16A34A] dark:text-[#4ade80] font-num text-sm" }, "+", formatCurrency(estimatedGain))))), /* @__PURE__ */ React18.createElement("div", { className: "lg:col-span-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-4" }, /* @__PURE__ */ React18.createElement("div", null, /* @__PURE__ */ React18.createElement("div", { className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3" }, /* @__PURE__ */ React18.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React18.createElement("svg", { className: "w-4 h-4 text-emerald-600 dark:text-emerald-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ React18.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" })), /* @__PURE__ */ React18.createElement("h3", { className: "text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans" }, isTamil ? "2. \u0B9A\u0BBE\u0BB0\u0BCD\u0B9F\u0BCD & \u0BA8\u0BBF\u0BA4\u0BBF \u0B85\u0BB1\u0BBF\u0B95\u0BCD\u0B95\u0BC8" : "2. Chart & Statement Part")), /* @__PURE__ */ React18.createElement("div", { className: "flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700" }, /* @__PURE__ */ React18.createElement(
    "button",
    {
      type: "button",
      onClick: () => setAnalysisTab("pie"),
      className: "px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer " + (analysisTab === "pie" ? "bg-white dark:bg-slate-900 text-[#16A34A] dark:text-[#4ade80] shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")
    },
    isTamil ? "\u0BAA\u0BC8-\u0B9A\u0BBE\u0BB0\u0BCD\u0B9F\u0BCD" : "Pie Chart"
  ), /* @__PURE__ */ React18.createElement(
    "button",
    {
      type: "button",
      onClick: () => setAnalysisTab("statement"),
      className: "px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer " + (analysisTab === "statement" ? "bg-white dark:bg-slate-900 text-[#16A34A] dark:text-[#4ade80] shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")
    },
    isTamil ? "\u0B85\u0BB1\u0BBF\u0B95\u0BCD\u0B95\u0BC8" : "Statement"
  ))), analysisTab === "pie" ? /* @__PURE__ */ React18.createElement("div", { className: "space-y-3 animate-fadeIn" }, /* @__PURE__ */ React18.createElement("div", { className: "flex flex-col sm:flex-row items-center justify-around gap-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80" }, /* @__PURE__ */ React18.createElement("div", { className: "relative w-32 h-32 flex items-center justify-center shrink-0" }, /* @__PURE__ */ React18.createElement("svg", { className: "w-full h-full transform -rotate-90", viewBox: "0 0 36 36" }, /* @__PURE__ */ React18.createElement(
    "path",
    {
      className: "text-slate-200 dark:text-slate-700",
      strokeWidth: "3.8",
      stroke: "currentColor",
      fill: "none",
      d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    }
  ), /* @__PURE__ */ React18.createElement(
    "path",
    {
      className: "text-[#0F172A] dark:text-slate-400 transition-all duration-700",
      strokeDasharray: investedPct + ", 100",
      strokeWidth: "3.8",
      stroke: "currentColor",
      fill: "none",
      d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    }
  ), /* @__PURE__ */ React18.createElement(
    "path",
    {
      className: "text-[#16A34A] dark:text-[#4ade80] transition-all duration-700",
      strokeDasharray: gainPct + ", 100",
      strokeDashoffset: "-" + investedPct,
      strokeWidth: "3.8",
      stroke: "currentColor",
      fill: "none",
      d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    }
  )), /* @__PURE__ */ React18.createElement("div", { className: "absolute flex flex-col items-center justify-center text-center p-1" }, /* @__PURE__ */ React18.createElement("span", { className: "text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-tight" }, isTamil ? "\u0BAE\u0BC1\u0BA4\u0BBF\u0BB0\u0BCD\u0BB5\u0BC1" : "Corpus"), /* @__PURE__ */ React18.createElement("span", { className: "text-xs sm:text-sm font-black text-slate-900 dark:text-white font-num leading-tight" }, formatCurrency(fundAmount)), /* @__PURE__ */ React18.createElement("span", { className: "text-xs font-bold text-[#16A34A] dark:text-[#4ade80] bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-full mt-0.5 font-num" }, multiplier, "x"))), /* @__PURE__ */ React18.createElement("div", { className: "space-y-1.5 text-xs font-bold font-sans" }, /* @__PURE__ */ React18.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React18.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-[#0F172A] dark:bg-slate-400" }), /* @__PURE__ */ React18.createElement("span", { className: "text-slate-700 dark:text-slate-300" }, isTamil ? "\u0B85\u0B9A\u0BB2\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1" : "Invested", ": ", investedPct, "%")), /* @__PURE__ */ React18.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React18.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-[#16A34A]" }), /* @__PURE__ */ React18.createElement("span", { className: "text-[#16A34A] dark:text-[#4ade80]" }, isTamil ? "\u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF \u0BB2\u0BBE\u0BAA\u0BAE\u0BCD" : "Gains", ": ", gainPct, "%")))), /* @__PURE__ */ React18.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React18.createElement("div", { className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex justify-between items-center text-xs" }, /* @__PURE__ */ React18.createElement("div", null, /* @__PURE__ */ React18.createElement("span", { className: "text-xs font-extrabold uppercase text-slate-600 dark:text-slate-400 tracking-wide block font-sans" }, isTamil ? "1. \u0B85\u0B9A\u0BB2\u0BCD \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BA4\u0BCA\u0B95\u0BC8" : "1. Principal Capital"), /* @__PURE__ */ React18.createElement("span", { className: "text-xs text-slate-500 font-medium" }, calcMode === "sip" ? `${years * 12} ${isTamil ? "\u0BA4\u0BB5\u0BA3\u0BC8\u0B95\u0BB3\u0BCD" : "installments"}` : isTamil ? "\u0B92\u0BB0\u0BC7 \u0BAE\u0BC1\u0BB1\u0BC8 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BC1" : "Lumpsum")), /* @__PURE__ */ React18.createElement("div", { className: "text-right" }, /* @__PURE__ */ React18.createElement("span", { className: "text-sm font-bold text-slate-900 dark:text-white font-num" }, formatCurrency(totalInvested)), /* @__PURE__ */ React18.createElement("span", { className: "block text-xs text-slate-600 dark:text-slate-400 font-num" }, "(", investedPct, "%)"))), /* @__PURE__ */ React18.createElement("div", { className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex justify-between items-center text-xs" }, /* @__PURE__ */ React18.createElement("div", null, /* @__PURE__ */ React18.createElement("span", { className: "text-xs font-extrabold uppercase text-slate-600 dark:text-slate-400 tracking-wide block font-sans" }, isTamil ? "2. \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF \u0BB2\u0BBE\u0BAA\u0BAE\u0BCD" : "2. Compound Growth"), /* @__PURE__ */ React18.createElement("span", { className: "text-xs text-slate-500 font-medium" }, "@", currentRates.fund, "% CAGR")), /* @__PURE__ */ React18.createElement("div", { className: "text-right" }, /* @__PURE__ */ React18.createElement("span", { className: "text-sm font-bold text-[#16A34A] dark:text-[#4ade80] font-num" }, "+", formatCurrency(estimatedGain)), /* @__PURE__ */ React18.createElement("span", { className: "block text-xs text-[#16A34A] dark:text-[#4ade80] font-num" }, "(", gainPct, "%)"))), /* @__PURE__ */ React18.createElement("div", { className: "p-2.5 rounded-xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white border border-slate-800 flex justify-between items-center shadow-md" }, /* @__PURE__ */ React18.createElement("div", null, /* @__PURE__ */ React18.createElement("span", { className: "text-xs font-extrabold uppercase text-emerald-400 tracking-wide block font-sans" }, isTamil ? "3. \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAE\u0BC1\u0BA4\u0BBF\u0BB0\u0BCD\u0BB5\u0BC1 \u0BA8\u0BBF\u0BA4\u0BBF" : "3. Projected Total Corpus"), /* @__PURE__ */ React18.createElement("span", { className: "text-xs text-slate-300 font-medium" }, timeframe, " ", isTamil ? "\u0B95\u0BBE\u0BB2 \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0BBF\u0BB2\u0BCD" : "horizon value")), /* @__PURE__ */ React18.createElement("div", { className: "text-right" }, /* @__PURE__ */ React18.createElement("span", { className: "text-sm sm:text-base font-extrabold text-white font-num" }, formatCurrency(fundAmount)), /* @__PURE__ */ React18.createElement("span", { className: "block text-xs font-bold text-emerald-300 font-num" }, "+", (estimatedGain / (totalInvested || 1) * 100).toFixed(1), "% ", isTamil ? "\u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF" : "net return"))))) : (
    /* VIEW 2: COMPACT YEARLY FINANCIAL STATEMENT TABLE */
    /* @__PURE__ */ React18.createElement("div", { className: "overflow-x-auto max-h-[260px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner animate-fadeIn" }, /* @__PURE__ */ React18.createElement("table", { className: "w-full text-left text-xs" }, /* @__PURE__ */ React18.createElement("thead", { className: "sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-700 font-sans" }, /* @__PURE__ */ React18.createElement("tr", null, /* @__PURE__ */ React18.createElement("th", { className: "p-2" }, isTamil ? "\u0B86\u0BA3\u0BCD\u0B9F\u0BC1" : "Period"), /* @__PURE__ */ React18.createElement("th", { className: "p-2" }, isTamil ? "\u0B85\u0B9A\u0BB2\u0BCD" : "Capital"), /* @__PURE__ */ React18.createElement("th", { className: "p-2" }, isTamil ? "\u0BB2\u0BBE\u0BAA\u0BAE\u0BCD" : "Growth"), /* @__PURE__ */ React18.createElement("th", { className: "p-2 truncate" }, selectedFundName), /* @__PURE__ */ React18.createElement("th", { className: "p-2" }, isTamil ? "\u0BAE\u0B9F\u0B99\u0BCD\u0B95\u0BC1" : "Multiple"))), /* @__PURE__ */ React18.createElement("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 font-num" }, yearlySchedule.map((d) => /* @__PURE__ */ React18.createElement("tr", { key: d.year, className: "hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors" }, /* @__PURE__ */ React18.createElement("td", { className: "p-2 font-bold text-slate-900 dark:text-white font-sans" }, "Y", d.year), /* @__PURE__ */ React18.createElement("td", { className: "p-2 text-slate-600 dark:text-slate-400" }, formatCurrency(d.invested)), /* @__PURE__ */ React18.createElement("td", { className: "p-2 text-[#16A34A] dark:text-[#4ade80] font-semibold" }, "+", formatCurrency(d.gain)), /* @__PURE__ */ React18.createElement("td", { className: "p-2 font-bold text-slate-900 dark:text-white" }, formatCurrency(d.fundValue)), /* @__PURE__ */ React18.createElement("td", { className: "p-2" }, /* @__PURE__ */ React18.createElement("span", { className: "px-1.5 py-0.2 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400" }, d.multiplier, "x")))))))
  )), /* @__PURE__ */ React18.createElement("p", { className: "text-xs text-slate-600 dark:text-slate-400 font-sans leading-tight pt-1" }, "**Past performance may or may not be sustained in future. For performance in SEBI format refer scheme returns.")))));
}
var SipCalculator_default;
var init_SipCalculator = __esm({
  "js/pages/SipCalculator.jsx"() {
    init_LanguageContext();
    SipCalculator_default = SipCalculator;
  }
});

// scripts/render-html.js
import React20 from "react";
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
import React19, { Suspense, lazy } from "react";

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
    isLive
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
      const dateA = new Date(a.publishedAt || a.published_at || a.created_at || 0).getTime();
      const dateB = new Date(b.publishedAt || b.published_at || b.created_at || 0).getTime();
      return dateB - dateA;
    });
    return merged.slice(0, 6);
  }, [liveArticles, language]);
  return /* @__PURE__ */ React12.createElement("div", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0" }, /* @__PURE__ */ React12.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800" }, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-2 min-w-0 truncate" }, /* @__PURE__ */ React12.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-[#4A9E2C] shrink-0 shadow-xs" }), /* @__PURE__ */ React12.createElement("h2", { className: "text-base sm:text-lg md:text-xl font-black font-sans truncate drop-shadow-xs" }, isTamil ? /* @__PURE__ */ React12.createElement(React12.Fragment, null, /* @__PURE__ */ React12.createElement("span", { className: "text-slate-950 dark:text-white" }, "\u0B9F\u0BBF\u0BB0\u0BC6\u0BA3\u0BCD\u0B9F\u0BBF\u0B99\u0BCD "), /* @__PURE__ */ React12.createElement("span", { className: "text-[#4A9E2C]" }, "\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0B95\u0BB3\u0BCD & \u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BB0\u0BC8\u0B95\u0BB3\u0BCD")) : /* @__PURE__ */ React12.createElement(React12.Fragment, null, /* @__PURE__ */ React12.createElement("span", { className: "text-slate-950 dark:text-white" }, "TRENDING "), /* @__PURE__ */ React12.createElement("span", { className: "text-[#4A9E2C]" }, "ARTICLES")))), /* @__PURE__ */ React12.createElement("span", { className: "text-xs sm:text-xs font-bold text-[#4A9E2C] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full font-num shrink-0 shadow-xs" }, "Top 6 Trending")), /* @__PURE__ */ React12.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5" }, allArticles.map((article, idx) => {
    const rankStr = `0${idx + 1}`;
    return /* @__PURE__ */ React12.createElement(
      "div",
      {
        key: article.id || `trend-${idx}`,
        role: "button",
        tabIndex: 0,
        onClick: () => onNavigate && onNavigate(`#/articles/${article.slug}`),
        className: "group flex items-start gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#ded7c8] dark:border-slate-800 hover:border-[#23645C]/60 shadow-sm hover:shadow-lg transition-all cursor-pointer select-none min-h-[56px] active:scale-[0.99]"
      },
      /* @__PURE__ */ React12.createElement("span", { className: "text-2xl sm:text-[36px] font-extrabold text-[#23645C] dark:text-[#60a5fa] font-num shrink-0 leading-none pt-0.5 select-none" }, rankStr),
      /* @__PURE__ */ React12.createElement("div", { className: "flex-1 min-w-0 flex flex-col justify-between h-full" }, /* @__PURE__ */ React12.createElement("div", null, /* @__PURE__ */ React12.createElement("div", { className: "flex items-center gap-2 mb-1.5" }, /* @__PURE__ */ React12.createElement("span", { className: "text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#23645C] dark:text-[#60a5fa] font-sans" }, article.category.replace("-", " ")), /* @__PURE__ */ React12.createElement("span", { className: "text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-num" }, "\u2022 ", new Date(article.publishedAt).toLocaleDateString(isTamil ? "ta-IN" : "en-IN", { month: "short", day: "numeric" }))), /* @__PURE__ */ React12.createElement("h3", { className: "text-sm sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#23645C] dark:group-hover:text-[#60a5fa] transition-colors leading-snug font-sans" }, article.title)), /* @__PURE__ */ React12.createElement("div", { className: "mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400" }, /* @__PURE__ */ React12.createElement("span", { className: "truncate max-w-[150px] font-medium text-slate-700 dark:text-slate-300" }, article.authorName || "Budget Padmanaban"), /* @__PURE__ */ React12.createElement("span", { className: "text-[#23645C] dark:text-[#60a5fa] font-bold group-hover:translate-x-1 transition-transform text-sm" }, "\u2192")))
    );
  }))));
}
var TrendingArticlesSection_default = TrendingArticlesSection;

// js/components/home/HomeCinemaShowcase.jsx
init_LanguageContext();
import React17, { useState as useState13, useEffect as useEffect9, useMemo as useMemo4 } from "react";

// js/components/home/CinemaSpotlightHero.jsx
init_LanguageContext();
import React13, { useState as useState10 } from "react";

// js/components/home/CinemaVideoRail.jsx
init_LanguageContext();
import React15, { useRef as useRef2 } from "react";

// js/components/home/CinemaVideoCard.jsx
init_LanguageContext();
import React14 from "react";
function CinemaVideoCard({
  video,
  index = 0,
  onSelect,
  language = "ta",
  onShowToast
}) {
  const isTamil = language === "ta";
  if (!video) return null;
  const youtubeId = video?.youtubeId || video?.id || "";
  const thumbnail = video?.thumbnail || (youtubeId ? `https://i.ytimg.com/vi_webp/${youtubeId}/mqdefault.webp` : "");
  const title = isTamil ? video.titleTamil || video.title || "\u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB \u0BAA\u0BA4\u0BBF\u0BB5\u0BC1" : video.titleEnglish || video.title || "Featured Video";
  const category = (video.category || "FINANCE").replace("-", " ").toUpperCase();
  const duration = video.duration || (video.isShort ? "0:59" : "12:00");
  return /* @__PURE__ */ React14.createElement(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: () => onSelect && onSelect(video),
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect && onSelect(video);
        }
      },
      className: "group relative select-none cursor-pointer rounded-2xl overflow-hidden\n        w-full aspect-[9/13]\n        bg-slate-900 border border-slate-800/80 hover:border-[#2563EB]/60\n        shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)]\n        transition-all duration-300 shrink-0"
    },
    /* @__PURE__ */ React14.createElement("div", { className: "absolute inset-0 w-full h-full overflow-hidden bg-slate-950" }, thumbnail && /* @__PURE__ */ React14.createElement(
      "img",
      {
        src: thumbnail,
        srcSet: youtubeId ? `https://i.ytimg.com/vi_webp/${youtubeId}/mqdefault.webp 320w, https://i.ytimg.com/vi_webp/${youtubeId}/hqdefault.webp 480w, https://i.ytimg.com/vi_webp/${youtubeId}/sddefault.webp 640w` : void 0,
        sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px",
        alt: title,
        loading: "lazy",
        decoding: "async",
        width: "320",
        height: "180",
        className: "w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      }
    ), /* @__PURE__ */ React14.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" })),
    /* @__PURE__ */ React14.createElement("div", { className: "absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none" }, /* @__PURE__ */ React14.createElement("span", { className: "px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-white/10 font-sans" }, category), /* @__PURE__ */ React14.createElement("span", { className: "px-2 py-1 text-xs font-num font-bold rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10" }, duration)),
    /* @__PURE__ */ React14.createElement("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none z-20" }, /* @__PURE__ */ React14.createElement("div", { className: "w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-[#2563EB] group-hover:border-[#2563EB] group-hover:scale-110 transition-all duration-300 shadow-xl" }, /* @__PURE__ */ React14.createElement("svg", { className: "w-5 h-5 fill-current ml-0.5", viewBox: "0 0 24 24" }, /* @__PURE__ */ React14.createElement("polygon", { points: "5 3 19 12 5 21 5 3" })))),
    /* @__PURE__ */ React14.createElement("div", { className: "absolute bottom-0 inset-x-0 p-4 pt-10 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 flex flex-col justify-end gap-2" }, /* @__PURE__ */ React14.createElement("h3", { className: "text-xs sm:text-sm font-bold text-white font-sans line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors" }, title), /* @__PURE__ */ React14.createElement("div", { className: "flex items-center justify-between pt-1 opacity-80 group-hover:opacity-100" }, /* @__PURE__ */ React14.createElement("span", { className: "text-xs text-slate-600 dark:text-slate-400 font-medium truncate max-w-[120px]" }, video.channelName || "Budget Padmanaban"), /* @__PURE__ */ React14.createElement("span", { className: "text-xs font-bold text-[#60a5fa] group-hover:underline shrink-0 flex items-center gap-1 font-sans" }, /* @__PURE__ */ React14.createElement("span", null, isTamil ? "\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95" : "Watch"), /* @__PURE__ */ React14.createElement("span", null, "\u2192"))))
  );
}
var CinemaVideoCard_default = CinemaVideoCard;

// js/pages/CinemaTheaterModal.jsx
import React16, { useState as useState11, useEffect as useEffect7, useMemo as useMemo3 } from "react";
import { createPortal } from "react-dom";

// js/services/api.js
init_translations();
function translateVideo(video, language = "ta") {
  if (!video) return null;
  const isTamil = language === "ta";
  const title = isTamil ? video.titleTamil || video.title : video.titleEnglish || video.title || video.titleTamil;
  const description = isTamil ? video.descriptionTamil || video.description : video.descriptionEnglish || video.description || video.descriptionTamil;
  return {
    ...video,
    title: title || "Budget Padmanaban Video",
    description: description || "Financial Insights by Budget Padmanaban",
    duration: video.duration || (video.isShort ? "Short" : "10:00"),
    views: video.views || 18500,
    activeLang: language
  };
}
function normalizeVideoRow(v) {
  const youtubeId = v.youtubeId || v.youtube_id || v.id;
  return {
    ...v,
    youtubeId,
    titleTamil: v.title_ta || v.titleTamil || v.title,
    titleEnglish: v.title_en || v.titleEnglish || v.title,
    descriptionTamil: v.description_ta || v.descriptionTamil || v.description,
    descriptionEnglish: v.description_en || v.descriptionEnglish || v.description,
    thumbnail: v.thumbnail_url || v.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : ""),
    views: v.view_count || v.views || 0,
    publishedAt: v.published_at || v.publishedAt,
    tags: v.tags || []
  };
}

// js/pages/CinemaTheaterModal.jsx
init_translations();
function extractYoutubeId(val) {
  if (!val || typeof val !== "string") return "";
  const trimmed = val.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : trimmed.length === 11 ? trimmed : "";
}
function CinemaTheaterModal({
  video,
  allVideos = [],
  onClose,
  onSelectRelated,
  language = "ta",
  onShowToast
}) {
  const { session } = useAuth();
  const isTamil = language === "ta";
  const [copied, setCopied] = useState11(false);
  const [activeTab, setActiveTab] = useState11("overview");
  const [sidebarFilter, setSidebarFilter] = useState11("all");
  const [sidebarSearch, setSidebarSearch] = useState11("");
  useEffect7(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);
  if (!video) return null;
  const youtubeId = extractYoutubeId(video.youtubeId || video.youtube_id || video.id || video.youtubeUrl || video.youtube_url) || "GizYMQfl9CY";
  const embedUrl = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1` : "";
  const youtubeWatchUrl = video.youtubeUrl || video.youtube_url || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : "");
  const title = isTamil ? video.titleTamil || video.title : video.titleEnglish || video.title;
  const description = isTamil ? video.descriptionTamil || video.description : video.descriptionEnglish || video.description;
  const rawVideos = allVideos && allVideos.length > 0 ? allVideos : typeof videosData !== "undefined" ? videosData : [];
  const filteredPlaylist = useMemo3(() => {
    let list = rawVideos.filter((v) => v.id !== video.id);
    if (sidebarFilter === "category" && video.category) {
      list = list.filter((v) => v.category === video.category);
    } else if (sidebarFilter === "shorts") {
      list = list.filter((v) => v.isShort || v.tags && v.tags.includes("shorts"));
    }
    if (sidebarSearch.trim()) {
      const q = sidebarSearch.toLowerCase();
      list = list.filter(
        (v) => v.titleTamil && v.titleTamil.toLowerCase().includes(q) || v.titleEnglish && v.titleEnglish.toLowerCase().includes(q) || v.title && v.title.toLowerCase().includes(q) || v.category && v.category.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 25).map((v) => typeof translateVideo === "function" ? translateVideo(v, language) : v);
  }, [rawVideos, video.id, video.category, sidebarFilter, sidebarSearch, language]);
  const handleShare = async () => {
    const shareUrl = youtubeWatchUrl || window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        if (onShowToast) onShowToast(isTamil ? "\u0B87\u0BA3\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1 \u0BA8\u0B95\u0BB2\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1!" : "Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2e3);
      }
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };
  const modalNode = /* @__PURE__ */ React16.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      className: "fixed inset-0 z-[999999] w-screen h-screen bg-[#070b14] flex flex-col overflow-hidden text-white animate-fadeIn",
      style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh", zIndex: 999999 }
    },
    /* @__PURE__ */ React16.createElement("div", { className: "h-12 sm:h-14 bg-[#090e1a] border-b border-slate-800/90 flex items-center justify-between px-3 sm:px-6 shrink-0 z-20 shadow-md" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-2 sm:gap-3 min-w-0" }, /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: onClose,
        className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-all text-xs font-black border border-slate-700 shrink-0"
      },
      /* @__PURE__ */ React16.createElement("span", null, "\u2190"),
      /* @__PURE__ */ React16.createElement("span", { className: "hidden sm:inline" }, isTamil ? "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD" : "Back to Videos")
    ), /* @__PURE__ */ React16.createElement("div", { className: "h-4 w-[1px] bg-slate-800 hidden sm:block" }), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-2 truncate min-w-0" }, /* @__PURE__ */ React16.createElement("span", { className: "px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider shrink-0" }, (video.category || "FINANCE").replace("-", " ")), /* @__PURE__ */ React16.createElement("span", { className: "text-xs text-slate-300 font-bold truncate hidden md:inline" }, title))), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-1.5 sm:gap-2 shrink-0" }, /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: handleShare,
        className: "px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
      },
      copied ? /* @__PURE__ */ React16.createElement(React16.Fragment, null, /* @__PURE__ */ React16.createElement("svg", { className: "w-3.5 h-3.5 text-emerald-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ React16.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M5 13l4 4L19 7" })), /* @__PURE__ */ React16.createElement("span", null, isTamil ? "\u0BA8\u0B95\u0BB2\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1" : "Copied")) : /* @__PURE__ */ React16.createElement("span", null, isTamil ? "\u0BAA\u0B95\u0BBF\u0BB0\u0BCD" : "Share")
    ), /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: onClose,
        "aria-label": "Exit Fullscreen",
        className: "w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold border border-slate-700"
      },
      /* @__PURE__ */ React16.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ React16.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
    ))),
    /* @__PURE__ */ React16.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80" }, /* @__PURE__ */ React16.createElement("main", { className: "lg:col-span-8 xl:col-span-9 flex flex-col min-h-0 bg-[#040711] overflow-y-auto" }, /* @__PURE__ */ React16.createElement("div", { className: "w-full bg-black flex items-center justify-center p-0 sm:p-2 lg:p-4 shrink-0 shadow-2xl" }, /* @__PURE__ */ React16.createElement("div", { className: "w-full max-w-5xl aspect-video max-h-[55vh] sm:max-h-[62vh] rounded-none sm:rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-900" }, embedUrl ? /* @__PURE__ */ React16.createElement(
      "iframe",
      {
        src: embedUrl,
        title,
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        allowFullScreen: true,
        className: "w-full h-full border-0"
      }
    ) : /* @__PURE__ */ React16.createElement("div", { className: "w-full h-full flex items-center justify-center text-slate-600 dark:text-slate-400" }, /* @__PURE__ */ React16.createElement("span", null, "Video player unavailable")))), /* @__PURE__ */ React16.createElement("div", { className: "p-5 sm:p-8 space-y-6 max-w-5xl" }, /* @__PURE__ */ React16.createElement("div", { className: "space-y-3 border-b border-slate-800/80 pb-5" }, /* @__PURE__ */ React16.createElement("h1", { className: "text-xl sm:text-2xl lg:text-3xl font-black font-serif text-white leading-snug tracking-tight" }, title), /* @__PURE__ */ React16.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4 pt-1" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React16.createElement("div", { className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md" }, "BP"), /* @__PURE__ */ React16.createElement("div", null, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React16.createElement("span", { className: "text-sm font-bold text-white" }, video.channelName || "Budget Padmanaban"), /* @__PURE__ */ React16.createElement("span", { className: "text-emerald-400 text-xs font-bold", title: "CFP Certified" }, "CFP\xAE")), /* @__PURE__ */ React16.createElement("p", { className: "text-xs text-slate-600 dark:text-slate-400 font-medium" }, "Certified Financial Planner \u2022 Video Masterclasses"))), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-3 text-xs font-mono text-slate-300 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800" }, /* @__PURE__ */ React16.createElement("span", { className: "text-amber-400 font-bold" }, video.views ? `${video.views.toLocaleString()} views` : "Masterclass"), /* @__PURE__ */ React16.createElement("span", null, "\u2022"), /* @__PURE__ */ React16.createElement("span", null, video.duration || "12:00"), video.publishedAt && /* @__PURE__ */ React16.createElement(React16.Fragment, null, /* @__PURE__ */ React16.createElement("span", null, "\u2022"), /* @__PURE__ */ React16.createElement("span", { className: "text-slate-600 dark:text-slate-400" }, new Date(video.publishedAt).toLocaleDateString()))))), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-2 border-b border-slate-800 pb-2" }, /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: () => setActiveTab("overview"),
        className: `px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === "overview" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" : "bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800"}`
      },
      isTamil ? "\u0BB5\u0BBF\u0BB3\u0B95\u0BCD\u0B95\u0BAE\u0BCD & \u0BB5\u0BBF\u0BB5\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BCD" : "Overview & Details"
    ), /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: () => setActiveTab("takeaways"),
        className: `px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === "takeaways" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" : "bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800"}`
      },
      isTamil ? "\u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B86\u0BB2\u0BCB\u0B9A\u0BA9\u0BC8\u0B95\u0BB3\u0BCD" : "Key Takeaways"
    ), /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: () => setActiveTab("tools"),
        className: `px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === "tools" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" : "bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800"}`
      },
      isTamil ? "SIP \u0B95\u0BBE\u0BB2\u0BCD\u0B95\u0BC1\u0BB2\u0BC7\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD" : "SIP Calculator"
    )), activeTab === "overview" && /* @__PURE__ */ React16.createElement("div", { className: "p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line space-y-4" }, /* @__PURE__ */ React16.createElement("p", null, description || (isTamil ? "\u0B87\u0BA8\u0BCD\u0BA4 \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0BB5\u0BBF\u0BB1\u0BCD\u0B95\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB3\u0B95\u0BCD\u0B95\u0BAE\u0BCD \u0BB5\u0BBF\u0BB0\u0BC8\u0BB5\u0BBF\u0BB2\u0BCD \u0BAA\u0BC1\u0BA4\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD." : "No detailed description available.")), /* @__PURE__ */ React16.createElement("div", { className: "pt-4 border-t border-slate-800/80 flex flex-wrap gap-2" }, /* @__PURE__ */ React16.createElement("span", { className: "px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-amber-400 border border-slate-800" }, "#", (video.category || "finance").toUpperCase()), /* @__PURE__ */ React16.createElement("span", { className: "px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-800" }, "#BudgetPadmanaban"), /* @__PURE__ */ React16.createElement("span", { className: "px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-800" }, "#MutualFunds"), /* @__PURE__ */ React16.createElement("span", { className: "px-3 py-1 rounded-lg bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-800" }, "#SIPCompounding"))), activeTab === "takeaways" && /* @__PURE__ */ React16.createElement("div", { className: "p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5" }, /* @__PURE__ */ React16.createElement("h3", { className: "text-sm font-bold text-amber-400" }, isTamil ? "\u0BAA\u0B9F\u0BCD\u0B9C\u0BC6\u0B9F\u0BCD \u0BAA\u0BA4\u0BCD\u0BAE\u0BA8\u0BBE\u0BAA\u0BA9\u0BCD CFP\xAE \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B86\u0BB2\u0BCB\u0B9A\u0BA9\u0BC8\u0B95\u0BB3\u0BCD:" : "Core Principles & Financial Takeaways:"), /* @__PURE__ */ React16.createElement("ul", { className: "space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium" }, /* @__PURE__ */ React16.createElement("li", { className: "flex items-start gap-2.5" }, /* @__PURE__ */ React16.createElement("span", { className: "text-amber-400 font-bold mt-0.5" }, "\u2022"), /* @__PURE__ */ React16.createElement("span", null, isTamil ? "\u0BA8\u0BC0\u0BA3\u0BCD\u0B9F \u0B95\u0BBE\u0BB2 \u0B95\u0BC2\u0B9F\u0BCD\u0B9F\u0BC1 \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF (Compounding) \u0BAA\u0BAF\u0BA9\u0BC8 \u0BAE\u0BC1\u0BB4\u0BC1\u0BAE\u0BC8\u0BAF\u0BBE\u0B95\u0BAA\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0B92\u0BB4\u0BC1\u0B99\u0BCD\u0B95\u0BBE\u0BA9 SIP \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC8 \u0BA4\u0BCA\u0B9F\u0BB0\u0BB5\u0BC1\u0BAE\u0BCD." : "Maintain disciplined SIP investments to harness long-term compounding benefits.")), /* @__PURE__ */ React16.createElement("li", { className: "flex items-start gap-2.5" }, /* @__PURE__ */ React16.createElement("span", { className: "text-amber-400 font-bold mt-0.5" }, "\u2022"), /* @__PURE__ */ React16.createElement("span", null, isTamil ? "\u0B9A\u0BA8\u0BCD\u0BA4\u0BC8\u0BAF\u0BBF\u0BA9\u0BCD \u0B95\u0BC1\u0BB1\u0BC1\u0B95\u0BBF\u0BAF \u0B95\u0BBE\u0BB2 \u0B8F\u0BB1\u0BCD\u0BB1 \u0B87\u0BB1\u0B95\u0BCD\u0B95\u0B99\u0BCD\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BBE\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0B85\u0BB5\u0B9A\u0BB0\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BC1 \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC8 \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BCD\u0BAA\u0BAA\u0BCD \u0BAA\u0BC6\u0BB1\u0BBE\u0BA4\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD." : "Avoid emotional exits during market corrections; stay focused on your financial goals.")), /* @__PURE__ */ React16.createElement("li", { className: "flex items-start gap-2.5" }, /* @__PURE__ */ React16.createElement("span", { className: "text-amber-400 font-bold mt-0.5" }, "\u2022"), /* @__PURE__ */ React16.createElement("span", null, isTamil ? "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BC1\u0B9F\u0BC1\u0BAE\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BA9\u0BCD \u0BAE\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0BB5 \u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BC0\u0B9F\u0BC1 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B85\u0BB5\u0B9A\u0BB0 \u0B95\u0BBE\u0BB2 \u0BA8\u0BBF\u0BA4\u0BBF\u0BAF\u0BC8 \u0B8E\u0BAA\u0BCD\u0BAA\u0BCB\u0BA4\u0BC1\u0BAE\u0BCD \u0B89\u0BB1\u0BC1\u0BA4\u0BBF \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD." : "Ensure adequate health insurance and 6-month emergency reserve before investing.")))), activeTab === "tools" && /* @__PURE__ */ React16.createElement("div", { className: "p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/30 space-y-3 flex flex-col sm:flex-row items-center justify-between gap-4" }, /* @__PURE__ */ React16.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ React16.createElement("h3", { className: "text-sm font-bold text-white" }, isTamil ? "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD SIP \u0B87\u0BB2\u0B95\u0BCD\u0B95\u0BC8 \u0B89\u0B9F\u0BA9\u0B9F\u0BBF\u0BAF\u0BBE\u0B95\u0B95\u0BCD \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BBF\u0B9F\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD" : "Calculate Your SIP Wealth Growth"), /* @__PURE__ */ React16.createElement("p", { className: "text-xs text-slate-600 dark:text-slate-400" }, isTamil ? "\u20B95,000 \u0BAE\u0BBE\u0BA4 SIP \u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BBF\u0BA9\u0BCD 10-15 \u0BB5\u0BB0\u0BC1\u0B9F \u0B95\u0BC2\u0B9F\u0BCD\u0B9F\u0BC1 \u0BB5\u0B9F\u0BCD\u0B9F\u0BBF \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC8 \u0B85\u0BB1\u0BBF\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD." : "Simulate your future portfolio returns with our interactive compounding tool.")), /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: () => {
          onClose && onClose();
          window.location.hash = "#/calculator";
        },
        className: "px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 whitespace-nowrap transition-transform hover:scale-105 shrink-0"
      },
      isTamil ? "\u0B95\u0BBE\u0BB2\u0BCD\u0B95\u0BC1\u0BB2\u0BC7\u0B9F\u0BCD\u0B9F\u0BB0\u0BC8\u0BA4\u0BCD \u0BA4\u0BBF\u0BB1\u0B95\u0BCD\u0B95 \u2192" : "Launch SIP Calculator \u2192"
    )))), /* @__PURE__ */ React16.createElement("aside", { className: "lg:col-span-4 xl:col-span-3 flex flex-col min-h-0 bg-[#090e1a] overflow-hidden" }, /* @__PURE__ */ React16.createElement("div", { className: "p-3.5 border-b border-slate-800 bg-[#070b14] space-y-2.5 shrink-0" }, /* @__PURE__ */ React16.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React16.createElement("h2", { className: "text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2" }, /* @__PURE__ */ React16.createElement("span", { className: "w-2 h-2 rounded-full bg-amber-500 animate-pulse" }), /* @__PURE__ */ React16.createElement("span", null, isTamil ? "\u0B85\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD" : "Up Next & Playlist")), /* @__PURE__ */ React16.createElement("span", { className: "text-xs font-mono font-bold text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700" }, filteredPlaylist.length, " ", isTamil ? "\u0BAA\u0BA4\u0BBF\u0BB5\u0BC1\u0B95\u0BB3\u0BCD" : "items")), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-1.5 overflow-x-auto no-scrollbar" }, /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: () => setSidebarFilter("all"),
        className: `px-2.5 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${sidebarFilter === "all" ? "bg-amber-500 text-slate-950 shadow" : "bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800"}`
      },
      isTamil ? "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1\u0BAE\u0BCD" : "All"
    ), /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: () => setSidebarFilter("category"),
        className: `px-2.5 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${sidebarFilter === "category" ? "bg-amber-500 text-slate-950 shadow" : "bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800"}`
      },
      isTamil ? "\u0B87\u0BA4\u0BC7 \u0BAA\u0BBF\u0BB0\u0BBF\u0BB5\u0BC1" : "Same Category"
    ), /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: () => setSidebarFilter("shorts"),
        className: `px-2.5 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${sidebarFilter === "shorts" ? "bg-amber-500 text-slate-950 shadow" : "bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-800"}`
      },
      "Shorts"
    )), /* @__PURE__ */ React16.createElement("div", { className: "relative" }, /* @__PURE__ */ React16.createElement("svg", { className: "w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ React16.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" })), /* @__PURE__ */ React16.createElement(
      "input",
      {
        type: "text",
        value: sidebarSearch,
        onChange: (e) => setSidebarSearch(e.target.value),
        placeholder: isTamil ? "\u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BC8\u0BA4\u0BCD \u0BA4\u0BC7\u0B9F\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD..." : "Filter playlist...",
        className: "w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
      }
    ), sidebarSearch && /* @__PURE__ */ React16.createElement(
      "button",
      {
        onClick: () => setSidebarSearch(""),
        className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
      },
      /* @__PURE__ */ React16.createElement("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /* @__PURE__ */ React16.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
    ))), /* @__PURE__ */ React16.createElement("div", { className: "p-3 space-y-2 overflow-y-auto flex-1 divide-y divide-slate-800/40" }, filteredPlaylist.length === 0 ? /* @__PURE__ */ React16.createElement("div", { className: "py-12 text-center text-slate-500 text-xs" }, isTamil ? "\u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD \u0B8E\u0BA4\u0BC1\u0BB5\u0BC1\u0BAE\u0BCD \u0B95\u0BBF\u0B9F\u0BC8\u0B95\u0BCD\u0B95\u0BB5\u0BBF\u0BB2\u0BCD\u0BB2\u0BC8" : "No matching videos found") : filteredPlaylist.map((rel) => {
      const relTitle = isTamil ? rel.titleTamil || rel.title : rel.titleEnglish || rel.title;
      return /* @__PURE__ */ React16.createElement(
        "div",
        {
          key: `theater-related-${rel.id}`,
          role: "button",
          tabIndex: 0,
          onClick: () => onSelectRelated && onSelectRelated(rel),
          className: "group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/90 border border-transparent hover:border-amber-500/40 transition-all cursor-pointer pt-3 first:pt-1"
        },
        /* @__PURE__ */ React16.createElement("div", { className: "relative w-28 sm:w-32 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-950 shadow" }, /* @__PURE__ */ React16.createElement(
          "img",
          {
            src: rel.thumbnail || `https://img.youtube.com/vi/${rel.youtubeId}/hqdefault.jpg`,
            alt: relTitle,
            className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          }
        ), /* @__PURE__ */ React16.createElement("span", { className: "absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-xs font-mono font-bold text-slate-200" }, rel.duration || "12:00")),
        /* @__PURE__ */ React16.createElement("div", { className: "flex-1 min-w-0 space-y-1" }, /* @__PURE__ */ React16.createElement("h3", { className: "text-xs font-bold text-slate-200 group-hover:text-amber-400 line-clamp-2 leading-tight transition-colors" }, relTitle), /* @__PURE__ */ React16.createElement("div", { className: "flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400" }, /* @__PURE__ */ React16.createElement("span", { className: "text-amber-500 font-semibold uppercase text-xs" }, (rel.category || "FINANCE").replace("-", " "))))
      );
    }))))
  );
  return typeof document !== "undefined" ? createPortal(modalNode, document.body) : modalNode;
}
var CinemaTheaterModal_default = CinemaTheaterModal;

// js/services/videos.js
init_translations();
import { useState as useState12, useEffect as useEffect8 } from "react";
var memoryCache = /* @__PURE__ */ new Map();
var inflightPromises = /* @__PURE__ */ new Map();
function getCachedVideos(key, language) {
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`mt_vids_swr_${key}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const list = parsed.map((v) => translateVideo(normalizeVideoRow(v), language));
          memoryCache.set(key, list);
          return list;
        }
      }
    } catch (e) {
    }
  }
  return null;
}
function setCachedVideos(key, list) {
  memoryCache.set(key, list);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`mt_vids_swr_${key}`, JSON.stringify(list.slice(0, 100)));
    } catch (e) {
    }
  }
}
async function fetchVideos(category = "all", sort = "newest", limit = 48, language = "ta") {
  const cacheKey = `${category}-${sort}-${limit}-${language}`;
  if (inflightPromises.has(cacheKey)) {
    return inflightPromises.get(cacheKey);
  }
  const promise = (async () => {
    try {
      if (category === "all" && sort === "newest" && typeof window !== "undefined" && window.__HOME__) {
        try {
          const homeResult = await window.__HOME__;
          const homeVids = homeResult?.data?.videos || homeResult?.videos;
          if (Array.isArray(homeVids) && homeVids.length > 0) {
            const list2 = homeVids.slice(0, limit).map((v) => translateVideo(normalizeVideoRow(v), language));
            setCachedVideos(cacheKey, list2);
            return list2;
          }
        } catch (_) {
        }
      }
      const url = `/api/videos?fields=list&limit=${limit}&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          const list2 = json.data.map((v) => translateVideo(normalizeVideoRow(v), language));
          setCachedVideos(cacheKey, list2);
          return list2;
        }
      }
    } catch (e) {
      console.warn("[Videos SWR] Silent fetch fallback:", e.message);
    } finally {
      inflightPromises.delete(cacheKey);
    }
    const cached = getCachedVideos(cacheKey, language);
    if (cached && cached.length > 0) return cached;
    let list = [...videosData];
    if (category && category !== "all") {
      list = list.filter((v) => v.category === category);
    }
    const result = list.slice(0, limit).map((v) => translateVideo(v, language));
    setCachedVideos(cacheKey, result);
    return result;
  })();
  inflightPromises.set(cacheKey, promise);
  return promise;
}
function useVideos(category = "all", sort = "newest", limit = 48, language = "ta") {
  const cacheKey = `${category}-${sort}-${limit}-${language}`;
  const [videos, setVideos] = useState12(() => {
    const cached = getCachedVideos(cacheKey, language);
    if (cached && cached.length > 0) {
      return cached;
    }
    if (typeof window !== "undefined" && window.__INITIAL_DATA__?.videos && category === "all") {
      const initial = window.__INITIAL_DATA__.videos.map((v) => translateVideo(normalizeVideoRow(v), language));
      if (initial.length > 0) return initial;
    }
    let list = [...videosData];
    if (category && category !== "all") {
      list = list.filter((v) => v.category === category);
    }
    return list.slice(0, limit).map((v) => translateVideo(v, language));
  });
  const [isLoading, setIsLoading] = useState12(false);
  useEffect8(() => {
    let isMounted = true;
    const revalidate = async () => {
      const data = await fetchVideos(category, sort, limit, language);
      if (isMounted && data && data.length > 0) {
        setVideos(data);
        setIsLoading(false);
      }
    };
    revalidate();
    return () => {
      isMounted = false;
    };
  }, [category, sort, limit, language]);
  return { videos, isLoading, total: videos.length };
}

// js/components/home/HomeCinemaShowcase.jsx
function HomeCinemaShowcase({ onNavigate, onShowToast, language = "ta" }) {
  const isTamil = language === "ta";
  const [activeCategory, setActiveCategory] = useState13("featured");
  const [selectedVideo, setSelectedVideo] = useState13(null);
  const { videos: allVideos = [], isLoading } = useVideos("all", "newest");
  const categories = [
    { id: "featured", labelTa: "\u0B9A\u0BAE\u0BC0\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF & \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD", labelEn: "Latest & Featured" },
    { id: "personal-finance", labelTa: "\u0BA4\u0BA9\u0BBF\u0BA8\u0BAA\u0BB0\u0BCD \u0BA8\u0BBF\u0BA4\u0BBF & \u0B9A\u0BC7\u0BAE\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1", labelEn: "Personal Finance" },
    { id: "mutual-funds", labelTa: "\u0BAE\u0BBF\u0BAF\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0B83\u0BAA\u0BA3\u0BCD\u0B9F\u0BCD & SIP", labelEn: "Mutual Funds & SIP" },
    { id: "stocks", labelTa: "\u0BAA\u0B99\u0BCD\u0B95\u0BC1\u0B9A\u0BCD \u0B9A\u0BA8\u0BCD\u0BA4\u0BC8 & IPO", labelEn: "Stocks & Markets" },
    { id: "tax-saving", labelTa: "\u0BB5\u0BB0\u0BBF \u0B9A\u0BC7\u0BAE\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 & \u0B93\u0BAF\u0BCD\u0BB5\u0BC2\u0BA4\u0BBF\u0BAF\u0BAE\u0BCD", labelEn: "Tax & Retirement" },
    { id: "education", labelTa: "\u0BAE\u0BC1\u0BA4\u0BB2\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BB2\u0BCD\u0BB5\u0BBF", labelEn: "Financial Education" },
    { id: "shorts", labelTa: "\u0B95\u0BC1\u0BB1\u0BC1\u0B95\u0BBF\u0BAF \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD (Shorts)", labelEn: "Quick Takes (Shorts)" }
  ];
  const showcaseVideos = useMemo4(() => {
    let list = [...allVideos];
    if (activeCategory === "featured") {
      return list.slice(0, 12);
    } else if (activeCategory === "shorts") {
      return list.filter((v) => v.isShort || v.tags && v.tags.includes("shorts")).slice(0, 12);
    } else if (activeCategory === "personal-finance") {
      return list.filter((v) => v.category === "personal-finance").slice(0, 12);
    } else if (activeCategory === "mutual-funds") {
      return list.filter((v) => v.category === "mutual-funds").slice(0, 12);
    } else if (activeCategory === "stocks") {
      return list.filter((v) => v.category === "stocks" || v.category === "ipo").slice(0, 12);
    } else if (activeCategory === "tax-saving") {
      return list.filter((v) => v.category === "tax-saving" || v.category === "retirement").slice(0, 12);
    } else if (activeCategory === "education") {
      return list.filter((v) => v.category === "education").slice(0, 12);
    }
    return list.slice(0, 12);
  }, [allVideos, activeCategory]);
  return /* @__PURE__ */ React17.createElement("div", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 select-none min-w-0" }, /* @__PURE__ */ React17.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React17.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800" }, /* @__PURE__ */ React17.createElement("div", { className: "flex items-center gap-2 overflow-x-auto no-scrollbar py-1 touch-pan-x" }, categories.map((cat) => {
    const isActive = activeCategory === cat.id;
    return /* @__PURE__ */ React17.createElement(
      "button",
      {
        key: cat.id,
        onClick: () => setActiveCategory(cat.id),
        className: `px-4 sm:px-5 py-2.5 min-h-[44px] rounded-full text-xs sm:text-[12.5px] whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 shadow-sm ${isActive ? "bg-emerald-700 text-white font-black ring-2 ring-emerald-500 shadow-md shadow-emerald-700/20" : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:bg-white hover:text-slate-950 font-bold border border-slate-200/80 dark:border-slate-800"}`
      },
      isTamil ? cat.labelTa : cat.labelEn
    );
  })), /* @__PURE__ */ React17.createElement(
    "button",
    {
      onClick: () => {
        if (onNavigate) onNavigate("#/videos");
        else if (typeof window !== "undefined") window.location.hash = "#/videos";
      },
      className: "inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-extrabold text-emerald-700 dark:text-amber-400 hover:text-emerald-900 dark:hover:text-amber-300 transition-colors shrink-0 self-end sm:self-center min-h-[44px] py-1"
    },
    /* @__PURE__ */ React17.createElement("span", null, isTamil ? "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BC0\u0B9F\u0BBF\u0BAF\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD (800+)" : "View All Videos (800+)"),
    /* @__PURE__ */ React17.createElement("span", { className: "font-bold" }, "\u2192")
  )), /* @__PURE__ */ React17.createElement("div", { className: "hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6" }, isLoading && showcaseVideos.length === 0 ? Array.from({ length: 5 }).map((_, idx) => /* @__PURE__ */ React17.createElement("div", { key: idx, className: "rounded-2xl bg-slate-200 dark:bg-slate-800/60 aspect-[9/13] p-4 space-y-3 animate-pulse" }, /* @__PURE__ */ React17.createElement("div", { className: "aspect-video bg-slate-300 dark:bg-slate-700/60 rounded-xl" }), /* @__PURE__ */ React17.createElement("div", { className: "h-4 bg-slate-300 dark:bg-slate-700/60 rounded w-3/4" }), /* @__PURE__ */ React17.createElement("div", { className: "h-3 bg-slate-300 dark:bg-slate-700/60 rounded w-1/2" }))) : showcaseVideos.slice(0, 5).map((video, idx) => /* @__PURE__ */ React17.createElement(
    CinemaVideoCard_default,
    {
      key: `home-cinema-desk-${video.id || idx}`,
      video,
      index: idx,
      onSelect: (v) => setSelectedVideo(v),
      language,
      onShowToast
    }
  ))), /* @__PURE__ */ React17.createElement("div", { className: "md:hidden flex overflow-x-auto snap-x snap-mandatory gap-3.5 py-1.5 no-scrollbar touch-pan-x -mx-1 px-1" }, isLoading && showcaseVideos.length === 0 ? Array.from({ length: 4 }).map((_, idx) => /* @__PURE__ */ React17.createElement("div", { key: idx, className: "w-[72vw] max-w-[280px] shrink-0 snap-center rounded-2xl bg-slate-200 dark:bg-slate-800/60 aspect-[9/13] p-4 space-y-3 animate-pulse" }, /* @__PURE__ */ React17.createElement("div", { className: "aspect-video bg-slate-300 dark:bg-slate-700/60 rounded-xl" }), /* @__PURE__ */ React17.createElement("div", { className: "h-4 bg-slate-300 dark:bg-slate-700/60 rounded w-3/4" }))) : showcaseVideos.slice(0, 8).map((video, idx) => /* @__PURE__ */ React17.createElement("div", { key: `home-cinema-mob-${video.id || idx}`, className: "w-[72vw] max-w-[280px] shrink-0 snap-center" }, /* @__PURE__ */ React17.createElement(
    CinemaVideoCard_default,
    {
      video,
      index: idx,
      onSelect: (v) => setSelectedVideo(v),
      language,
      onShowToast
    }
  ))))), selectedVideo && /* @__PURE__ */ React17.createElement(
    CinemaTheaterModal_default,
    {
      video: selectedVideo,
      allVideos,
      onClose: () => setSelectedVideo(null),
      onSelectRelated: (rel) => setSelectedVideo(rel),
      language,
      onShowToast
    }
  ));
}
var HomeCinemaShowcase_default = HomeCinemaShowcase;

// js/components/home/Home.jsx
var SipCalculator2 = lazy(() => Promise.resolve().then(() => (init_SipCalculator(), SipCalculator_exports)));
function LazyMount({ children, fallback }) {
  const [isVisible, setIsVisible] = React19.useState(false);
  const ref = React19.useRef(null);
  React19.useEffect(() => {
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
  return /* @__PURE__ */ React19.createElement("div", { ref }, isVisible ? children : fallback || null);
}
function Home({ onNavigate, onShowToast }) {
  const { language } = useLanguage();
  return /* @__PURE__ */ React19.createElement("div", { className: "w-full animate-fadeIn flex flex-col" }, /* @__PURE__ */ React19.createElement("section", { className: "w-full bg-[#FFFFFF] dark:bg-slate-900/60 py-8 sm:py-12 border-b border-slate-100 dark:border-slate-800" }, /* @__PURE__ */ React19.createElement(HeroSection_default, { onNavigate })), /* @__PURE__ */ React19.createElement("section", { className: "w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 sm:py-14 border-b border-slate-200/80 dark:border-slate-800" }, /* @__PURE__ */ React19.createElement(
    HomeCinemaShowcase_default,
    {
      onNavigate,
      onShowToast,
      language
    }
  )), /* @__PURE__ */ React19.createElement("section", { className: "w-full bg-[#FFFFFF] dark:bg-slate-900/60 py-10 sm:py-14 border-b border-slate-100 dark:border-slate-800" }, /* @__PURE__ */ React19.createElement(TrendingArticlesSection_default, { onNavigate })), /* @__PURE__ */ React19.createElement("section", { className: "w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 sm:py-14 pb-16 sm:pb-20" }, /* @__PURE__ */ React19.createElement(LazyMount, { fallback: /* @__PURE__ */ React19.createElement("div", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 py-8 text-center text-sm font-medium text-emerald-200 min-h-[120px]" }, "\u0BA8\u0BBF\u0BA4\u0BBF \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BB0\u0BC1\u0BB5\u0BBF \u0B8F\u0BB1\u0BCD\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1...") }, /* @__PURE__ */ React19.createElement(Suspense, { fallback: /* @__PURE__ */ React19.createElement("div", { className: "w-full max-w-[96vw] 2xl:max-w-[1800px] mx-auto px-4 py-8 text-center text-sm font-medium text-emerald-200 min-h-[120px]" }, "\u0BA8\u0BBF\u0BA4\u0BBF \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BCD \u0B95\u0BB0\u0BC1\u0BB5\u0BBF \u0B8F\u0BB1\u0BCD\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1...") }, /* @__PURE__ */ React19.createElement(SipCalculator2, null)))));
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
    /* @__PURE__ */ React20.createElement(ThemeProvider, null, /* @__PURE__ */ React20.createElement(LanguageProvider, null, /* @__PURE__ */ React20.createElement(AuthProvider, null, /* @__PURE__ */ React20.createElement("div", { className: "min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans" }, /* @__PURE__ */ React20.createElement("div", { className: "sticky-header-container sticky top-0 z-40 w-full shadow-md bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800" }, /* @__PURE__ */ React20.createElement(Header_default, { onOpenSearch: () => {
    }, onNavigate: () => {
    } }), /* @__PURE__ */ React20.createElement(Navbar_default, { currentPath: "/", onNavigate: () => {
    } })), /* @__PURE__ */ React20.createElement(TrendingTicker_default, { onNavigate: () => {
    } }), /* @__PURE__ */ React20.createElement("main", { className: "flex-1" }, /* @__PURE__ */ React20.createElement(Home_default, { onNavigate: () => {
    }, onShowToast: () => {
    } })), /* @__PURE__ */ React20.createElement(Footer_default, { onNavigate: () => {
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
