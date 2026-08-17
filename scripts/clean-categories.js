import fs from 'fs';
import path from 'path';

// Clean navbar in bundle.js and Navbar.js
function cleanNavbar(content) {
  return content
    .replace(
      `  const baseNavItems = [
    { id: 'home', hash: '#/', label: t('nav.home') },
    { id: 'articles', hash: '#/articles', label: t('nav.articles') },
    { id: 'videos', hash: '#/videos', label: t('nav.videos') },
    { id: 'news', hash: '#/news', label: t('nav.news') },
    { id: 'mutual-funds', hash: '#/category/mutual-funds', label: t('nav.mutualFunds') },
    { id: 'personal-finance', hash: '#/category/personal-finance', label: t('nav.personalFinance') },
    { id: 'calculator', hash: '#/calculator', label: t('nav.calculator') },
    { id: 'quiz', hash: '#/quiz', label: t('nav.quiz') || 'Quiz' }
  ];`,
      `  const baseNavItems = [
    { id: 'home', hash: '#/', label: t('nav.home') },
    { id: 'articles', hash: '#/articles', label: t('nav.articles') },
    { id: 'videos', hash: '#/videos', label: t('nav.videos') },
    { id: 'news', hash: '#/news', label: t('nav.news') },
    { id: 'mutual-funds', hash: '#/category/mutual-funds', label: t('nav.mutualFunds') },
    { id: 'calculator', hash: '#/calculator', label: t('nav.calculator') },
    { id: 'quiz', hash: '#/quiz', label: t('nav.quiz') || 'Quiz' }
  ];`
    )
    .replace(
      `    {
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
      label: \`🚪 \${language === 'ta' ? 'வெளியேறு' : 'Sign Out'}\`
    }`,
      ``
    );
}

function removeAllEmojisAndHumanize(content) {
  let res = content;

  // Specific replacements for categories
  const explicitCategoryFixes = [
    ["labelTa: '💰 மியூச்சுவல் ஃபண்ட் & SIP', labelEn: '💰 Mutual Funds & SIP'", "labelTa: 'மியூச்சுவல் ஃபண்ட் & SIP', labelEn: 'Mutual Funds & SIP'"],
    ["labelTa: '📈 பங்குச் சந்தை (Stocks)', labelEn: '📈 Stock Market'", "labelTa: 'பங்குச் சந்தை', labelEn: 'Stock Market'"],
    ["labelTa: '🚀 IPO அலசல்', labelEn: '🚀 IPO Analysis'", "labelTa: 'IPO அலசல்', labelEn: 'IPO Analysis'"],
    ["labelTa: '🪙 தங்கம் & SGB', labelEn: '🪙 Gold & SGB Bonds'", "labelTa: 'தங்கம் & SGB பத்திரங்கள்', labelEn: 'Gold & SGB Bonds'"],
    ["labelTa: '📑 வரி சேமிப்பு (Tax)', labelEn: '📑 Tax Planning'", "labelTa: 'வரி சேமிப்பு திட்டமிடல்', labelEn: 'Tax Planning'"],
    ["labelTa: '🏖️ ஓய்வூதியம் (NPS / EPF)', labelEn: '🏖️ Retirement & NPS'", "labelTa: 'ஓய்வூதியம் (NPS & EPF)', labelEn: 'Retirement & NPS'"],
    ["labelTa: '💡 தனிநபர் நிதி & சேமிப்பு', labelEn: '💡 Personal Finance'", "labelTa: 'தனிநபர் நிதி & சேமிப்பு', labelEn: 'Personal Finance'"],
    ["labelTa: '⚡ Shorts (60s)', labelEn: '⚡ Shorts'", "labelTa: 'குறுகிய வீடியோக்கள்', labelEn: 'Shorts'"],
    ["labelTa: '🔥 ட்ரெண்டிங்', labelEn: '🔥 Trending'", "labelTa: 'முக்கிய பதிவுகள்', labelEn: 'Trending'"],
    ["labelTa: '💰 மியூச்சுவல் ஃபண்ட்', labelEn: '💰 Mutual Funds'", "labelTa: 'மியூச்சுவல் ஃபண்ட்', labelEn: 'Mutual Funds'"],
    ["labelTa: '📈 பங்குச் சந்தை', labelEn: '📈 Stock Market'", "labelTa: 'பங்குச் சந்தை', labelEn: 'Stock Market'"],
    ["labelTa: '💡 தனிநபர் நிதி & SIP', labelEn: '💡 Personal Finance'", "labelTa: 'தனிநபர் நிதி & SIP', labelEn: 'Personal Finance'"],
    ["labelTa: '🎓 நிதி அறிவு & வழிகாட்டி', labelEn: '🎓 Financial Education'", "labelTa: 'நிதி அறிவு & வழிகாட்டி', labelEn: 'Financial Education'"],

    // General button & label cleanups
    ['💰 Mutual Funds', 'Mutual Funds'],
    ['📈 Stock Market', 'Stock Market'],
    ['💡 Personal Finance', 'Personal Finance'],
    ['🎓 Financial Education', 'Financial Education'],
    ['🚀 IPO Analysis', 'IPO Analysis'],
    ['🪙 Gold & SGB Bonds', 'Gold & SGB Bonds'],
    ['📑 Tax Planning', 'Tax Planning'],
    ['🏖️ Retirement & NPS', 'Retirement & NPS'],
    ['🏖 Retirement & NPS', 'Retirement & NPS'],
    ['⚡ Shorts', 'Shorts'],
    ['🔥 Trending', 'Trending'],
    ['💰 மியூச்சுவல் ஃபண்ட்', 'மியூச்சுவல் ஃபண்ட்'],
    ['📈 பங்குச் சந்தை', 'பங்குச் சந்தை'],
    ['💡 தனிநபர் நிதி', 'தனிநபர் நிதி'],
    ['🎓 நிதி அறிவு', 'நிதி அறிவு'],
    ['🚀 IPO', 'IPO'],
    ['🪙 தங்கம்', 'தங்கம்'],
    ['📑 வரி சேமிப்பு', 'வரி சேமிப்பு'],
    ['🏖️ ஓய்வூதியம்', 'ஓய்வூதியம்'],
    ['🏖 ஓய்வூதியம்', 'ஓய்வூதியம்'],
    ['⚡ Shorts', 'Shorts'],
    ['🔥 ட்ரெண்டிங்', 'ட்ரெண்டிங்'],
    ['👤 Profile', 'Profile'],
    ['👤 சுயவிவரம்', 'சுயவிவரம்'],
    ['✍️ Article Studio', 'Article Studio'],
    ['✍ Article Studio', 'Article Studio'],
    ['✍️ கட்டுரைகள் ஸ்டுடியோ', 'கட்டுரைகள் ஸ்டுடியோ'],
    ['🔑 Sign In', 'Sign In'],
    ['🔑 உள்நுழைக', 'உள்நுழைக'],
    ['🚪 Logout', 'Logout'],
    ['🚪 Sign Out', 'Sign Out'],
    ['🚪 வெளியேறு', 'வெளியேறு'],
    ['👋 {t(\'welcome\')}', '{t(\'welcome\')}'],
    ['👋 Welcome', 'Welcome'],
    ['👋 வணக்கம்', 'வணக்கம்']
  ];

  for (const [target, replacement] of explicitCategoryFixes) {
    res = res.split(target).join(replacement);
  }

  // Regex to remove all emojis in unicode code point ranges
  const unicodeEmojiRegex = /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{FE0F}]/gu;
  res = res.replace(unicodeEmojiRegex, '');

  return res;
}

const targetFiles = [
  'js/bundle.js',
  'js/components/Header.js',
  'js/components/Navbar.js',
  'js/components/HeroSection.js',
  'js/components/TrendingArticlesSection.js',
  'js/components/SignInCtaBanner.js',
  'js/components/SipCalculator.js',
  'js/components/Toast.js',
  'js/components/auth/PasswordInput.js',
  'js/pages/Articles.js',
  'js/pages/ArticleDetail.js',
  'js/pages/Videos.js',
  'js/pages/News.js',
  'js/pages/Category.js',
  'js/pages/Home.js',
  'src/components/RichTextEditor.jsx',
  'src/components/auth/MagicLinkForm.jsx',
  'src/components/auth/SignupPage.jsx',
  'src/components/auth/SignupForm.jsx',
  'src/components/auth/ProtectedRoute.jsx',
  'src/components/auth/PasswordInput.jsx',
  'src/components/auth/LoginPage.jsx',
  'src/components/auth/LoginForm.jsx',
  'src/components/auth/ForgotPasswordForm.jsx',
  'src/pages/Articles.jsx',
  'src/pages/ArticleDetail.jsx',
  'src/pages/admin/AdminArticles.jsx',
  'src/pages/admin/ArticleEditor.jsx',
  'src/pages/admin/AdminVideoTable.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'index.html'
];

for (const rel of targetFiles) {
  const full = path.resolve(rel);
  if (!fs.existsSync(full)) continue;
  let text = fs.readFileSync(full, 'utf8');
  if (rel.includes('bundle.js') || rel.includes('Navbar.js')) {
    text = cleanNavbar(text);
  }
  text = removeAllEmojisAndHumanize(text);
  fs.writeFileSync(full, text, 'utf8');
  console.log('Processed:', rel);
}
