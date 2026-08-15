// Utility to generate comprehensive 882-video catalog for Budget Padmanaban
export function generateFull882Videos() {
  const categories = [
    { id: 'mutual-funds', labelTa: 'மியூச்சுவல் ஃபண்ட்', labelEn: 'Mutual Funds', count: 240 },
    { id: 'stocks', labelTa: 'பங்குச் சந்தை', labelEn: 'Stock Market', count: 180 },
    { id: 'personal-finance', labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance', count: 120 },
    { id: 'tax-saving', labelTa: 'வரி சேமிப்பு (Tax Saving)', labelEn: 'Tax Planning', count: 90 },
    { id: 'retirement', labelTa: 'ஓய்வூதியத் திட்டம் (NPS / EPF)', labelEn: 'Retirement & Pension', count: 80 },
    { id: 'gold-bonds', labelTa: 'தங்கம் & SGB பத்திரங்கள்', labelEn: 'Gold & SGB Bonds', count: 60 },
    { id: 'ipo', labelTa: 'புதிய பங்குகள் (IPO Analysis)', labelEn: 'IPO Review', count: 60 },
    { id: 'beginners', labelTa: 'ஆரம்பநிலை வழிகாட்டி', labelEn: 'Beginner Guide', count: 52 }
  ];

  const seedYtIds = [
    '1RUJcEWuMDY', 'tbeKWtuqsIo', '1EDLZlvMAZs', 'qQSFlhPZx4s', 'Nx9T5eCUBJU',
    '_PErKVVMtBg', 'GizYMQfl9CY', 'R4xpW2nLj8s', 'xJ9_9Gq_1t0', '3Jm1a6Zq4uI',
    '9Vv2l4B8c9E', 'kX3j2l1M8aB', '7mN8b2v4C1x', '4kL9p8Q2w3E', '5mN6v7B8c9X',
    '8jK9l0P1q2W', '2vC3x4Z5a6S', '6bN7m8K9l0P', '1qA2w3E4r5T', '9zX8c7V6b5N'
  ];

  const mutualFundTopics = [
    { ta: "1 கோடி ரூபாய் சேர்க்க சிறந்த 3 SIP திட்டங்கள்! | பட்ஜெட் பத்மநாபன் CFP", en: "Top 3 SIP Funds to Build ₹1 Crore Corpus | Budget Padmanaban" },
    { ta: "Small Cap vs Mid Cap vs Large Cap — உங்கள் வயதுக்கு எது ஏற்றது?", en: "Small Cap vs Mid Cap vs Large Cap — Best Allocation by Age" },
    { ta: "Index Funds vs Active Funds — 2026 முதலீட்டாளர்களுக்கு எது லாபகரமானது?", en: "Index Funds vs Active Funds — Which is Better in 2026?" },
    { ta: "Parag Parikh Flexi Cap Fund முழு அலசல் — முதலீடு செய்யலாமா?", en: "Parag Parikh Flexi Cap Fund Full Review & Portfolio Analysis" },
    { ta: "Quant Small Cap vs Nippon India Small Cap — நேரடி ஒப்பீடு!", en: "Quant Small Cap vs Nippon India Small Cap — Head to Head" },
    { ta: "HDFC Top 100 vs SBI Bluechip — சிறந்த Large Cap ஃபண்ட் எது?", en: "HDFC Top 100 vs SBI Bluechip — Best Large Cap Fund Comparison" },
    { ta: "SIP முதலீட்டில் Step-Up முறையைப் பயன்படுத்தி 2X வருமானம் பெறுவது எப்படி?", en: "How to Double Your Wealth with Step-Up SIP Strategy" },
    { ta: "மியூச்சுவல் ஃபண்ட் நேரடித் திட்டம் (Direct Plan) vs வழக்கமான திட்டம் (Regular Plan)", en: "Direct Plan vs Regular Plan — How Much Compounding Difference?" },
    { ta: "சந்தை சரியும்போது SIP-ஐ நிறுத்தலாமா? முதலீட்டாளர்கள் செய்யும் பெரிய தவறு!", en: "Should You Stop SIP During Market Crash? Biggest Retail Mistake" },
    { ta: "மாதம் ₹5000 SIP மூலம் ஓய்வுக் காலத்தில் ₹3 கோடி சேர்ப்பது எப்படி?", en: "How ₹5,000 Monthly SIP Can Create ₹3 Crore Retirement Wealth" }
  ];

  const stockTopics = [
    { ta: "நிஃப்டி 50 புதிய உச்சம் — இப்போது பங்குகளில் முதலீடு செய்யலாமா?", en: "NIFTY 50 at Record High — Should You Invest in Stocks Now?" },
    { ta: "பங்குச் சந்தையில் 5 முக்கிய ஃபண்டமென்டல் விதிகள்! | Budget Padmanaban", en: "5 Fundamental Rules for Stock Market Investing" },
    { ta: "அதிக டிவிடெண்ட் தரும் டாப் 5 இந்திய பங்குகள் — நீண்டகால முதலீடு", en: "Top 5 High Dividend Yield Stocks for Long Term Passive Income" },
    { ta: "பங்குச்சந்தை வீழ்ச்சியில் வாங்க வேண்டிய தரமான பங்குகள் (Quality Stocks)", en: "Quality Stocks to Accumulate During Market Dips" },
    { ta: "P/E Ratio & P/B Ratio எளிமையாகப் புரிந்துகொள்வது எப்படி?", en: "Understanding P/E Ratio & P/B Ratio Simply for Value Investing" },
    { ta: "ஸ்டாக் மார்க்கெட்டில் Stop Loss வைப்பது ஏன் கட்டாயம்?", en: "Why Stop Loss is Crucial for Trading & Risk Management" },
    { ta: "IT & Banking துறை பங்குகள் — அடுத்த 3 ஆண்டுகளுக்கான பார்வை", en: "IT & Banking Sector Outlook for the Next 3 Years" }
  ];

  const taxTopics = [
    { ta: "புதிய வரி விதிப்பு vs பழைய வரி விதிப்பு — யாருக்கு எது லாபம்?", en: "New Tax Regime vs Old Tax Regime — Complete Comparison Calculator" },
    { ta: "Section 80C இல் ₹1.5 லட்சம் வரை முழுமையாக வரி சேமிப்பது எப்படி?", en: "How to Fully Utilize Section 80C for Maximum Tax Exemption" },
    { ta: "ELSS மியூச்சுவல் ஃபண்ட் மூலம் வரி சேமிப்பு + அதிக லாபம் பெறுவது எப்படி?", en: "Tax Saving + High Compounding with ELSS Mutual Funds" },
    { ta: "பங்குச்சந்தை மற்றும் மியூச்சுவல் ஃபண்ட் மூலதன ஆதாய வரி (LTCG / STCG)", en: "Capital Gains Tax on Stocks & Mutual Funds (LTCG / STCG Explained)" }
  ];

  const retirementTopics = [
    { ta: "NPS தேசிய ஓய்வூதியத் திட்டம் முழு வழிகாட்டி — மாதம் ₹1 லட்சம் பென்ஷன்!", en: "NPS National Pension Scheme Complete Guide — ₹1 Lakh Monthly Pension" },
    { ta: "EPF vs VPF vs PPF — அரசு உத்தரவாதமுள்ள சிறந்த சேமிப்பு எது?", en: "EPF vs VPF vs PPF — Best Government Guaranteed Savings Compared" },
    { ta: "SWP (Systematic Withdrawal Plan) மூலம் மாதம் நிலையான ஓய்வூதியம் பெறுங்கள்", en: "How to Create Steady Monthly Pension with SWP Mutual Funds" },
    { ta: "ஓய்வுக் காலத்திற்கு ₹2 கோடி திரட்டுவது எப்படி? (40 வயதில் தொடங்குபவர்களுக்கு)", en: "How to Build ₹2 Crore Retirement Corpus Starting at Age 40" }
  ];

  const goldTopics = [
    { ta: "Sovereign Gold Bonds (SGB) vs Gold ETF vs தங்க நாணயம் — எது சிறந்தது?", en: "Sovereign Gold Bonds (SGB) vs Gold ETF vs Physical Gold Comparison" },
    { ta: "தங்கத்தின் விலை உயர்வு — உங்கள் முதலீட்டு போர்ட்ஃபோலியோவில் தங்கம் எவ்வளவு இருக்க வேண்டும்?", en: "Rising Gold Prices — Ideal Gold Allocation in Wealth Portfolio" },
    { ta: "டிஜிட்டல் கோல்ட் முதலீடு பாதுகாப்பானதா? முழு விளக்கம்", en: "Is Digital Gold Safe? Tax Implications and SGB Alternatives" }
  ];

  const ipoTopics = [
    { ta: "வரவிருக்கும் IPO-க்களில் விண்ணப்பிப்பது எப்படி? ஒதுக்கீடு பெரும் உத்திகள்!", en: "How to Apply for Upcoming IPOs — Secrets to Get Allotment" },
    { ta: "IPO GMP (Grey Market Premium) என்றால் என்ன? அதை நம்பி முதலீடு செய்யலாமா?", en: "What is IPO GMP (Grey Market Premium)? Risks & Listing Gains" },
    { ta: "SME IPO vs Mainboard IPO — அதிக லாபமும் அதிக அபாயமும்!", en: "SME IPO vs Mainboard IPO — High Rewards and High Volatility" }
  ];

  const personalFinanceTopics = [
    { ta: "50-30-20 நிதி விதி மூலம் பணக்காரர் ஆவது எப்படி?", en: "How the 50-30-20 Rule Helps You Save & Build Wealth" },
    { ta: "எமர்ஜென்சி ஃபண்ட் (Emergency Fund) ஏன் அவசியம்? எவ்வளவு பணம் ஒதுக்க வேண்டும்?", en: "Why Emergency Fund is Essential — How Much to Allocate?" },
    { ta: "கடன் இல்லாத வாழ்க்கை வாழ 5 எளிய வழிகள்! | பட்ஜெட் பத்மநாபன்", en: "5 Simple Ways to Become Completely Debt Free | Budget Padmanaban" },
    { ta: "CIBIL Score-ஐ 750+ ஆக உயர்த்துவது எப்படி? நடைமுறை குறிப்புகள்", en: "How to Boost Your CIBIL Score Above 750 Fast" }
  ];

  const allTopics = [
    ...mutualFundTopics,
    ...stockTopics,
    ...taxTopics,
    ...retirementTopics,
    ...goldTopics,
    ...ipoTopics,
    ...personalFinanceTopics
  ];

  const videos = [];
  let videoIndex = 1;

  // Generate all 882 catalog items
  for (let i = 0; i < 882; i++) {
    const topicSeed = allTopics[i % allTopics.length];
    const cat = categories[i % categories.length];
    const ytId = seedYtIds[i % seedYtIds.length];
    const isShort = i % 8 === 0;

    const padStr = String(videoIndex).padStart(3, '0');
    const id = `vid-bp-${padStr}`;

    const dateOffsetDays = i * 2;
    const pubDate = new Date(Date.now() - (dateOffsetDays * 24 * 3600 * 1000) - (i * 3600000));

    const durationMin = isShort ? 1 : (6 + (i % 18));
    const durationSec = isShort ? 0 : ((i * 17) % 60);
    const durationStr = isShort ? '01:00' : `${String(durationMin).padStart(2, '0')}:${String(durationSec).padStart(2, '0')}`;

    const views = Math.floor(4500 + ((882 - i) * 85) + ((i * 313) % 45000));

    const titleSuffix = i > allTopics.length ? ` #${Math.floor(i / allTopics.length) + 1}` : '';
    const titleTamil = `${topicSeed.ta}${titleSuffix}`;
    const titleEnglish = `${topicSeed.en}${titleSuffix}`;

    videos.push({
      id,
      youtubeId: ytId,
      youtubeUrl: isShort ? `https://www.youtube.com/shorts/${ytId}` : `https://www.youtube.com/watch?v=1RUJcEWuMDY`,
      isShort,
      channelHandle: "@budgetpadmanaban_",
      channelUrl: "https://www.youtube.com/@budgetpadmanaban_",
      channelName: "Budget Padmanaban",
      titleTamil,
      titleEnglish,
      title: titleTamil,
      descriptionTamil: `Budget Padmanaban (${cat.labelTa}) வழங்கும் விரிவான முதலீட்டு வழிகாட்டுதல் காணொளி.`,
      descriptionEnglish: `Financial wealth creation and investment strategy guide by Budget Padmanaban CFP (${cat.labelEn}).`,
      description: `Financial investment guide by Budget Padmanaban CFP (${cat.labelEn}).`,
      category: cat.id,
      publishedAt: pubDate.toISOString(),
      duration: durationStr,
      views,
      thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      tags: ["@budgetpadmanaban_", "budgetpadmanaban", "investment", cat.id, "sip", "tamilfinance"],
      trending: i < 15
    });

    videoIndex++;
  }

  return videos;
}
