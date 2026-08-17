import fs from 'fs';
import path from 'path';

const filesToScan = [
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
  'src/pages/Articles.jsx',
  'src/pages/ArticleDetail.jsx',
  'src/pages/admin/AdminArticles.jsx',
  'src/pages/admin/ArticleEditor.jsx',
  'src/components/RichTextEditor.jsx',
  'index.html'
];

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/gu;

for (const relPath of filesToScan) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  const matches = content.match(emojiRegex);
  if (matches && matches.length > 0) {
    console.log(`${relPath}: found ${matches.length} emoji characters ->`, [...new Set(matches)].join(' '));
  }
}
