import fs from 'fs';
import path from 'path';

function cleanEmojisAndHumanize(content) {
  let res = content;

  // Specific UI string replacements for humanized professional copy
  const replacements = [
    // Header & Welcome
    ['👋 {t(\'welcome\')}', '{t(\'welcome\')}'],
    ['👋 Welcome', 'Welcome'],
    ['👋 வணக்கம்', 'வணக்கம்'],
    ['✨ Welcome', 'Welcome'],

    // Nav & Auth
    ['👤 ${language === \'ta\' ? \'சுயவிவரம்\' : \'Profile\'}', '${language === \'ta\' ? \'சுயவிவரம்\' : \'Profile\'}'],
    ['✍️ ${language === \'ta\' ? \'கட்டுரைகள் ஸ்டுடியோ\' : \'Article Studio\'}', '${language === \'ta\' ? \'கட்டுரைகள் ஸ்டுடியோ\' : \'Article Studio\'}'],
    ['🔑 ${language === \'ta\' ? \'உள்நுழைக\' : \'Sign In\'}', '${language === \'ta\' ? \'உள்நுழைக\' : \'Sign In\'}'],
    ['🚪 ${language === \'ta\' ? \'வெளியேறு\' : \'Sign Out\'}', '${language === \'ta\' ? \'வெளியேறு\' : \'Sign Out\'}'],
    ['👤 Profile', 'Profile'],
    ['✍️ Article Studio', 'Article Studio'],
    ['🔑 Sign In', 'Sign In'],
    ['🚪 Sign Out', 'Sign Out'],
    ['🚪 Logout', 'Logout'],
    ['🚪 வெளியேறு', 'வெளியேறு'],
    ['🔑 உள்நுழைக', 'உள்நுழைக'],
    ['👤 சுயவிவரம்', 'சுயவிவரம்'],
    ['✍️ கட்டுரைகள் ஸ்டுடியோ', 'கட்டுரைகள் ஸ்டுடியோ'],

    // Categories in Articles & Nav
    ['💰 மியூச்சுவல் ஃபண்ட்', 'மியூச்சுவல் ஃபண்ட்'],
    ['💰 Mutual Funds', 'Mutual Funds'],
    ['📈 பங்குச் சந்தை', 'பங்குச் சந்தை'],
    ['📈 Stock Market', 'Stock Market'],
    ['💡 தனிநபர் நிதி & SIP', 'தனிநபர் நிதி & SIP'],
    ['💡 Personal Finance', 'Personal Finance'],
    ['🎓 நிதி அறிவு & வழிகாட்டி', 'நிதி அறிவு & வழிகாட்டி'],
    ['🎓 Financial Education', 'Financial Education'],
    ['💰 ', ''],
    ['📈 ', ''],
    ['💡 ', ''],
    ['🎓 ', ''],
    ['🔥 ', ''],
    ['⚡ ', ''],
    ['🚀 ', ''],
    ['💎 ', ''],
    ['✨ ', ''],
    ['💍 ', ''],
    ['🌟 ', ''],
    ['📚 ', ''],
    ['📊 ', ''],
    ['🎯 ', ''],
    ['💸 ', ''],
    ['💹 ', ''],

    // Editor & Studio buttons
    ['🚀 {isTamil ? \'உடனே வெளியிடு (Publish Live)\' : \'Publish Live\'}', '{isTamil ? \'உடனே வெளியிடு\' : \'Publish Live\'}'],
    ['💾 {isTamil ? \'வரைவாகச் சேமி (Draft)\' : \'Save Draft\'}', '{isTamil ? \'வரைவாகச் சேமி\' : \'Save Draft\'}'],
    ['💾 {isTamil ? \'வரைவாகச் சேமி (Save Draft)\' : \'Save Draft\'}', '{isTamil ? \'வரைவாகச் சேமி\' : \'Save Draft\'}'],
    ['🗑️ {isTamil ? \'கட்டுரையை நீக்கு\' : \'Delete Article\'}', '{isTamil ? \'கட்டுரையை நீக்கு\' : \'Delete Article\'}'],
    ['🗑️ {isTamil ? \'கட்டுரையை நீக்கு (Delete Article)\' : \'Delete Article\'}', '{isTamil ? \'கட்டுரையை நீக்கு\' : \'Delete Article\'}'],
    ['🗑️ Delete', 'Delete'],
    ['✏️ Edit', 'Edit'],
    ['👁️ View', 'View'],
    ['👁️', 'View'],
    ['🔄 ஆங்கிலத்தில் மொழிபெயர்க்க', 'ஆங்கிலத்தில் மொழிபெயர்க்க'],
    ['🔄 Auto-Translate to English', 'Translate to English'],
    ['⚡ {isTamil ? \'தானியங்கி ஆங்கில மொழிபெயர்ப்பு\' : \'AI & Rule-Protected Auto Translation\'}', '{isTamil ? \'இருமொழி மொழிபெயர்ப்பு உதவி\' : \'Bilingual Translation Assistant\'}'],
    ['🎉 🎉', ''],
    ['🎉', ''],
    ['⏱ ~', '~'],
    ['⏱ ', ''],
    ['📅 ', ''],
    ['🔗 ', ''],
    ['🖼️ ', ''],
    ['🖼 ', ''],
    ['🧹 ', ''],
    ['🔒 ', ''],
    ['📄 ', ''],
    ['📝 ', ''],
    ['⚠️ ', ''],
    ['⚠ ', ''],
    ['✓ ', ''],
    ['✕ ', ''],
    ['🔍 ', ''],
    ['📺 ', ''],
    ['🛡️ ', ''],
    ['🛡 ', ''],
    ['🌐 ', ''],
    ['🎬 ', ''],
    ['🇮🇳 ', ''],
    ['🇮🇳', ''],
    ['● Published', 'Published'],
    ['○ Draft', 'Draft'],

    // Clean any remaining standalone emojis in text
    ['⚠️', ''],
    ['⚡', ''],
    ['🔥', ''],
    ['🚀', ''],
    ['💡', ''],
    ['💰', ''],
    ['📈', ''],
    ['📊', ''],
    ['⏱', ''],
    ['📅', ''],
    ['🔗', ''],
    ['✍️', ''],
    ['✍', ''],
    ['🗑️', ''],
    ['🗑', ''],
    ['✏️', ''],
    ['✏', ''],
    ['👁️', ''],
    ['👁', ''],
    ['🔒', ''],
    ['🔑', ''],
    ['🚪', ''],
    ['👤', ''],
    ['👋', ''],
    ['✨', ''],
    ['🎉', ''],
    ['💾', ''],
    ['🔄', ''],
    ['🎓', ''],
    ['📚', ''],
    ['🎯', ''],
    ['🌟', ''],
    ['💎', ''],
    ['💍', ''],
    ['💸', ''],
    ['💹', ''],
    ['😲', ''],
    ['🤔', ''],
    ['🏖', ''],
    ['🖼', ''],
    ['🧹', ''],
    ['🎬', ''],
    ['📺', ''],
    ['🛡', ''],
    ['🌐', ''],
    ['📞', ''],
    ['📸', ''],
    ['🏠', '']
  ];

  for (const [target, replacement] of replacements) {
    res = res.split(target).join(replacement);
  }

  // Regex pass to strip any leftover emojis in unicode ranges
  const genericEmojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2300}-\u{23FF}\u{2B50}\u{FE0F}]/gu;
  res = res.replace(genericEmojiRegex, '');

  return res;
}

const targetFiles = [
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
  'js/bundle.js',
  'index.html'
];

for (const rel of targetFiles) {
  const full = path.resolve(rel);
  if (!fs.existsSync(full)) continue;
  const original = fs.readFileSync(full, 'utf8');
  const cleaned = cleanEmojisAndHumanize(original);
  fs.writeFileSync(full, cleaned, 'utf8');
  console.log(`Cleaned: ${rel}`);
}
