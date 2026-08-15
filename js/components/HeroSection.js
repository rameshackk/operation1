export function HeroSection({ news = newsData, onNavigate }) {
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
    <div key={keyPrefix} className="flex items-stretch gap-0 shrink-0">
      {featuredStories.map((item, idx) => {
        const headline = getHeadline(item);
        const summary = getSummary(item);
        const formattedDate = new Intl.DateTimeFormat(
          language === 'ta' ? 'ta-IN' : 'en-IN',
          { month: 'short', day: 'numeric' }
        ).format(new Date(item.publishedAt || Date.now()));

        return (
          <article
            key={`${keyPrefix}-${item.id}-${idx}`}
            onClick={() => onNavigate && onNavigate(`#/news/${item.slug}`)}
            className="group relative w-[220px] sm:w-[250px] md:w-[270px] shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer overflow-hidden flex flex-col justify-between select-none"
          >
            {/* Image / Thumbnail Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
              <img
                src={item.thumbnail}
                alt={headline}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Category Badge */}
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded bg-amber-500 text-slate-950 shadow-sm">
                {(item.category || 'FINANCE').replace('-', ' ')}
              </span>

              {/* Date Badge */}
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/85 text-slate-200 text-[9px] font-mono font-bold backdrop-blur-sm border border-white/10">
                {formattedDate}
              </span>
            </div>

            {/* Content / Text Description */}
            <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 font-serif group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                  {headline}
                </h3>
                {summary && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-sans leading-relaxed">
                    {summary}
                  </p>
                )}
              </div>

              {/* Footer CTA Line */}
              <div className="flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-400 font-bold border-t border-slate-100 dark:border-slate-800/80 pt-2">
                <span>{t('readArticle') || 'Read'}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN (7 COLS): SEAMLESS FEATURED NEWS TICKER */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
                <span>{t('featuredNews') || 'சிறப்புச் செய்திகள்'}</span>
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">
              ⚡ LIVE NEWS TICKER
            </span>
          </div>

          {/* Seamless Auto-Scrolling News Ticker (Zero Gaps between cards) */}
          <div className="featured-marquee-wrapper overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 my-auto">
            <div className="animate-featured-marquee flex items-stretch gap-0 whitespace-normal">
              {renderFeaturedTrack('ftrack-1')}
              {renderFeaturedTrack('ftrack-2')}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 COLS): LATEST ARTICLES SECTION */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                {isTamil ? 'சமீபத்திய கட்டுரைகள்' : 'Latest Articles'}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              🔥 Latest
            </span>
          </div>

          {/* Articles List */}
          <div className="space-y-2.5 flex-1 flex flex-col justify-between">
            {latestStories.map((article, idx) => {
              const title = getHeadline(article);
              return (
                <div
                  key={article.id || idx}
                  onClick={() => onNavigate && onNavigate(`#/news/${article.slug}`)}
                  className="group flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50"
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
