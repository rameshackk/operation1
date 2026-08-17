import fs from 'fs';
import path from 'path';

// 1. Clean Navbar in js/bundle.js and js/components/Navbar.js
function cleanNavbarCode(content) {
  // Replace baseNavItems and authNavItems in bundle.js
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
  ];

  const authNavItems = user ? [
    { id: 'profile', hash: '#/profile', label: \`👤 \${language === 'ta' ? 'சுயவிவரம்' : 'Profile'}\` },
    ...(role === 'admin' ? [
      { id: 'admin-articles', hash: '#/admin/articles', label: \`✍️ \${language === 'ta' ? 'கட்டுரைகள் ஸ்டுடியோ' : 'Article Studio'}\` }
    ] : []),
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
      label: \`🚪 \${language === 'ta' ? 'வெளியேறு' : 'Sign Out'}\`
    }
  ] : [
    { id: 'login', hash: '#/login', label: \`🔑 \${language === 'ta' ? 'உள்நுழைக' : 'Sign In'}\` }
  ];`,
      `  const baseNavItems = [
    { id: 'home', hash: '#/', label: t('nav.home') },
    { id: 'articles', hash: '#/articles', label: t('nav.articles') },
    { id: 'videos', hash: '#/videos', label: t('nav.videos') },
    { id: 'news', hash: '#/news', label: t('nav.news') },
    { id: 'mutual-funds', hash: '#/category/mutual-funds', label: t('nav.mutualFunds') },
    { id: 'calculator', hash: '#/calculator', label: t('nav.calculator') },
    { id: 'quiz', hash: '#/quiz', label: t('nav.quiz') || 'Quiz' }
  ];

  const authNavItems = user ? [
    { id: 'profile', hash: '#/profile', label: \`\${language === 'ta' ? 'சுயவிவரம்' : 'Profile'}\` },
    ...(role === 'admin' ? [
      { id: 'admin-articles', hash: '#/admin/articles', label: \`\${language === 'ta' ? 'கட்டுரைகள் ஸ்டுடியோ' : 'Article Studio'}\` }
    ] : [])
  ] : [
    { id: 'login', hash: '#/login', label: \`\${language === 'ta' ? 'உள்நுழைக' : 'Sign In'}\` }
  ];`
    );
}

// 2. Comprehensive Emoji & Button Cleanup
function stripEmojisFromText(content) {
  let res = content;

  // Replace known button / badge text with clean text
  const cleanPairs = [
    ['✍️ Article Studio', 'Article Studio'],
    ['✍️ கட்டுரைகள் ஸ்டுடியோ', 'கட்டுரைகள் ஸ்டுடியோ'],
    ['✍️ New Article', 'New Article'],
    ['✍️ புதிய கட்டுரை', 'புதிய கட்டுரை'],
    ['🚀 Publish Live', 'Publish Live'],
    ['🚀 உடனே வெளியிடு (Publish Live)', 'உடனே வெளியிடு'],
    ['🚀 உடனே வெளியிடு', 'உடனே வெளியிடு'],
    ['💾 Save Draft', 'Save Draft'],
    ['💾 வரைவாகச் சேமி (Save Draft)', 'வரைவாகச் சேமி'],
    ['💾 வரைவாகச் சேமி', 'வரைவாகச் சேமி'],
    ['🗑️ Delete Article', 'Delete Article'],
    ['🗑️ கட்டுரையை நீக்கு (Delete Article)', 'கட்டுரையை நீக்கு'],
    ['🗑️ கட்டுரையை நீக்கு', 'கட்டுரையை நீக்கு'],
    ['🗑️ Delete', 'Delete'],
    ['🗑 Delete', 'Delete'],
    ['✏️ Edit', 'Edit'],
    ['✏ Edit', 'Edit'],
    ['👁️ View', 'View'],
    ['👁 View', 'View'],
    ['🔄 Auto-Translate to English', 'Translate to English'],
    ['🔄 Translate to English', 'Translate to English'],
    ['🔄 ஆங்கிலத்தில் மொழிபெயர்க்க', 'ஆங்கிலத்தில் மொழிபெயர்க்க'],
    ['⚡ AI & Rule-Protected Auto Translation', 'Bilingual Translation Assistant'],
    ['⚡ தானியங்கி ஆங்கில மொழிபெயர்ப்பு', 'இருமொழி மொழிபெயர்ப்பு உதவி'],
    ['👋 {t(\'welcome\')}', '{t(\'welcome\')}'],
    ['👋 Welcome', 'Welcome'],
    ['🚪 Logout', 'Logout'],
    ['🚪 Sign Out', 'Sign Out'],
    ['🔑 Sign In', 'Sign In'],
    ['👤 Profile', 'Profile'],
    ['💰 Mutual Funds', 'Mutual Funds'],
    ['💰 மியூச்சுவல் ஃபண்ட்', 'மியூச்சுவல் ஃபண்ட்'],
    ['📈 Stock Market', 'Stock Market'],
    ['📈 பங்குச் சந்தை', 'பங்குச் சந்தை'],
    ['💡 Personal Finance', 'Personal Finance'],
    ['💡 தனிநபர் நிதி & SIP', 'தனிநபர் நிதி & SIP'],
    ['🎓 Financial Education', 'Financial Education'],
    ['🎓 நிதி அறிவு & வழிகாட்டி', 'நிதி அறிவு & வழிகாட்டி'],
    ['⏱ ~', '~'],
    ['⏱ ', ''],
    ['📅 ', ''],
    ['🔗 ', ''],
    ['🖼️ ', ''],
    ['🖼 ', ''],
    ['🧹 ', ''],
    ['🔒 ', ''],
    ['🎉', ''],
    ['✨', ''],
    ['🔥', ''],
    ['⚡', '']
  ];

  for (const [target, replacement] of cleanPairs) {
    res = res.split(target).join(replacement);
  }

  // Regex to strip any leftover emojis in unicode ranges
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2300}-\u{23FF}\u{2B50}\u{FE0F}]/gu;
  res = res.replace(emojiRegex, '');

  return res;
}

const allFiles = [
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

for (const rel of allFiles) {
  const full = path.resolve(rel);
  if (!fs.existsSync(full)) continue;
  let code = fs.readFileSync(full, 'utf8');
  if (rel.includes('bundle.js') || rel.includes('Navbar.js')) {
    code = cleanNavbarCode(code);
  }
  code = stripEmojisFromText(code);
  fs.writeFileSync(full, code, 'utf8');
  console.log(`Cleaned: ${rel}`);
}
