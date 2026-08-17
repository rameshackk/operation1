import fs from 'fs';
import path from 'path';

function findAndCleanAllButtons(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Specific button emoji/symbol cleanups
  const buttonReplacements = [
    ['✍️ Article Studio', 'Article Studio'],
    ['✍ Article Studio', 'Article Studio'],
    ['✍️ ', ''],
    ['✍ ', ''],
    ['🚀 Publish Live', 'Publish Live'],
    ['🚀 உடனே வெளியிடு', 'உடனே வெளியிடு'],
    ['🚀 ', ''],
    ['💾 Save Draft', 'Save Draft'],
    ['💾 வரைவாகச் சேமி', 'வரைவாகச் சேமி'],
    ['💾 ', ''],
    ['🗑️ Delete Article', 'Delete Article'],
    ['🗑 Delete Article', 'Delete Article'],
    ['🗑️ Delete', 'Delete'],
    ['🗑 Delete', 'Delete'],
    ['🗑️ கட்டுரையை நீக்கு', 'கட்டுரையை நீக்கு'],
    ['🗑 கட்டுரையை நீக்கு', 'கட்டுரையை நீக்கு'],
    ['🗑️', 'Delete'],
    ['🗑', 'Delete'],
    ['✏️ Edit', 'Edit'],
    ['✏ Edit', 'Edit'],
    ['✏️', 'Edit'],
    ['✏', 'Edit'],
    ['👁️ View', 'View'],
    ['👁 View', 'View'],
    ['👁️', 'View'],
    ['👁', 'View'],
    ['🔄 Translate to English', 'Translate to English'],
    ['🔄 Auto-Translate to English', 'Translate to English'],
    ['🔄 ஆங்கிலத்தில் மொழிபெயர்க்க', 'ஆங்கிலத்தில் மொழிபெயர்க்க'],
    ['🔄 ', ''],
    ['🔑 Sign In', 'Sign In'],
    ['🔑 உள்நுழைக', 'உள்நுழைக'],
    ['🔑 ', ''],
    ['🚪 Logout', 'Logout'],
    ['🚪 Sign Out', 'Sign Out'],
    ['🚪 வெளியேறு', 'வெளியேறு'],
    ['🚪 ', ''],
    ['👤 Profile', 'Profile'],
    ['👤 சுயவிவரம்', 'சுயவிவரம்'],
    ['👤 ', ''],
    ['🔍 Search', 'Search'],
    ['🔍 ', ''],
    ['⚡ ', ''],
    ['🔥 ', ''],
    ['✨ ', ''],
    ['🎉 ', ''],
    ['💡 ', ''],
    ['💰 ', ''],
    ['📈 ', ''],
    ['📊 ', ''],
    ['🎯 ', ''],
    ['🔗 ', ''],
    ['🖼️ ', ''],
    ['🖼 ', ''],
    ['🧹 ', ''],
    ['🔔 ', '']
  ];

  for (const [target, repl] of buttonReplacements) {
    content = content.split(target).join(repl);
  }

  // Regex to remove any remaining unicode emojis anywhere inside the file
  const unicodeEmojiRegex = /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{FE0F}]/gu;
  content = content.replace(unicodeEmojiRegex, '');

  fs.writeFileSync(filePath, content, 'utf8');
}

const files = [
  'js/bundle.js',
  'js/components/Header.js',
  'js/components/Navbar.js',
  'js/components/HeroSection.js',
  'js/components/TrendingArticlesSection.js',
  'js/components/SignInCtaBanner.js',
  'js/components/SipCalculator.js',
  'js/components/Toast.js',
  'js/pages/Articles.js',
  'js/pages/ArticleDetail.js',
  'src/components/RichTextEditor.jsx',
  'src/pages/Articles.jsx',
  'src/pages/ArticleDetail.jsx',
  'src/pages/admin/AdminArticles.jsx',
  'src/pages/admin/ArticleEditor.jsx',
  'src/pages/admin/AdminVideoTable.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'src/components/auth/LoginPage.jsx',
  'src/components/auth/LoginForm.jsx',
  'src/components/auth/SignupPage.jsx',
  'src/components/auth/SignupForm.jsx',
  'src/components/auth/MagicLinkForm.jsx',
  'src/components/auth/ForgotPasswordForm.jsx',
  'src/components/auth/PasswordInput.jsx',
  'src/components/auth/ProtectedRoute.jsx',
  'index.html'
];

for (const f of files) {
  findAndCleanAllButtons(path.resolve(f));
}
console.log('Cleaned all buttons across files.');
