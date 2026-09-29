import fs from 'fs';
import path from 'path';

const bundlePath = path.join(process.cwd(), 'js', 'bundle.js');
const lines = fs.readFileSync(bundlePath, 'utf8').split('\n');

const componentNames = [
  'LanguageProvider',
  'ThemeProvider',
  'AuthProvider',
  'ProfileMenu',
  'ProtectedRoute',
  'AdminRoute',
  'LanguageSwitcher',
  'ThemeToggle',
  'Header',
  'Navbar',
  'TrendingTicker',
  'CommandPalette',
  'VideoCard',
  'SkeletonCard',
  'HeroSection',
  'TrendingArticlesSection',
  'SipCalculator',
  'RiskQuizWidget',
  'SignInCtaBanner',
  'Toast',
  'Footer',
  'CinemaVideoCard',
  'CinemaSpotlightHero',
  'CinemaVideoRail',
  'CinemaTheaterModal',
  'HomeCinemaShowcase',
  'Home',
  'VideosPage',
  'ArticlesPage',
  'ArticleDetailPage',
  'ArticleCommentsSection',
  'AdminArticlesPage',
  'PublisherOnboardingModal',
  'RichTextEditor',
  'ArticleEditorPage',
  'AuthPage',
  'AggregatedNewsCard',
  'NewsCard',
  'NewsPage',
  'NewsDetailsPage',
  'ProfilePage',
  'WatchHistoryPage',
  'CategoryPage',
  'ProfessionalsDirectoryPage',
  'ProfessionalWidescreenVideoCard',
  'ProfessionalProfilePage',
  'LoginReminderModal',
  'AppContent',
  'App'
];

const found = [];
lines.forEach((line, idx) => {
  for (const name of componentNames) {
    if (line.startsWith(`function ${name}(`) || line.startsWith(`const ${name} =`)) {
      found.push({ name, startLine: idx + 1 });
    }
  }
});

// Sort by start line
found.sort((a, b) => a.startLine - b.startLine);

for (let i = 0; i < found.length; i++) {
  const current = found[i];
  const next = found[i + 1];
  current.endLine = next ? next.startLine - 1 : lines.length;
}

console.log(JSON.stringify(found, null, 2));
