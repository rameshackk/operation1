import fs from 'fs';
import path from 'path';

const bundlePath = path.join(process.cwd(), 'js', 'bundle.js');
const rawCode = fs.readFileSync(bundlePath, 'utf8');
const lines = rawCode.split('\n');

const dirs = [
  'js/data',
  'js/services',
  'js/context',
  'js/components/common',
  'js/components/home',
  'js/pages'
];
dirs.forEach(d => {
  const p = path.join(process.cwd(), d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

function getLines(start, end) {
  return lines.slice(start - 1, end).join('\n');
}

// 1. Data Layer: translations, mock data, helper constants
const translationsContent = `// Core constants and translations
${getLines(3, 6)}
${getLines(15, 419)}

export {
  OFFICIAL_CHANNEL_URL,
  OFFICIAL_CHANNEL_HANDLE,
  OFFICIAL_CHANNEL_NAME,
  translations,
  CHANNEL_URL,
  CHANNEL_HANDLE,
  CHANNEL_NAME,
  CHANNEL_ID,
  videosData,
  newsData,
  professionalsData,
  marketSnapshotData
};
`;
fs.writeFileSync('js/data/translations.js', translationsContent, 'utf8');

// 2. Services Layer: API & helper functions
const servicesContent = `import { videosData, newsData, professionalsData } from '../data/translations.js';

${getLines(421, 827)}

export {
  translateVideo,
  translateNewsArticle,
  normalizeVideoRow,
  getTrendingPreviewVideos,
  getLatestVideos,
  getVideoById,
  getRelatedVideos,
  searchAllContent,
  searchVideos
};
`;
fs.writeFileSync('js/services/api.js', servicesContent, 'utf8');

// 3. LanguageContext.jsx
const languageContextContent = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations.js';

${getLines(830, 871)}

export { LanguageContext, LanguageProvider, useLanguage };
`;
fs.writeFileSync('js/context/LanguageContext.jsx', languageContextContent, 'utf8');

// 4. ThemeContext.jsx
const themeContextContent = `import React, { createContext, useContext, useState, useEffect } from 'react';

${getLines(872, 894)}

export { ThemeContext, ThemeProvider, useTheme };
`;
fs.writeFileSync('js/context/ThemeContext.jsx', themeContextContent, 'utf8');

// 5. AuthContext.jsx with lazy Supabase
const authContextContent = `import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_SUPABASE_URL = "https://etanokdvfyvkidpeovdi.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YW5va2R2Znl2a2lkcGVvdmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODUxNzUsImV4cCI6MjEwMjI2MTE3NX0.SLzp5gIZyZdB7nmDrfjvghFbAwKwAIWuf4Ys_HC4AaE";

let supabasePromise = null;
export async function getSupabaseClient() {
  if (window.supabaseClient) return window.supabaseClient;
  if (!supabasePromise) {
    supabasePromise = (async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const url = window.SUPABASE_URL || localStorage.getItem("SUPABASE_URL") || DEFAULT_SUPABASE_URL;
        const key = window.SUPABASE_ANON_KEY || localStorage.getItem("SUPABASE_ANON_KEY") || DEFAULT_SUPABASE_ANON_KEY;
        window.supabaseClient = createClient(url, key);
        return window.supabaseClient;
      } catch (err) {
        console.warn('Lazy Supabase init note:', err.message);
        return null;
      }
    })();
  }
  return supabasePromise;
}

${getLines(914, 1419)}

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
`;
fs.writeFileSync('js/context/AuthContext.jsx', authContextContent, 'utf8');

// 6. Common components
// ProfileMenu
const profileMenuContent = `import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

${getLines(1420, 1593)}

export default ProfileMenu;
export { ProfileMenu };
`;
fs.writeFileSync('js/components/common/ProfileMenu.jsx', profileMenuContent, 'utf8');

// ProtectedRoute
const protectedRouteContent = `import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

${getLines(1594, 1623)}

export default ProtectedRoute;
export { ProtectedRoute };
`;
fs.writeFileSync('js/components/common/ProtectedRoute.jsx', protectedRouteContent, 'utf8');

// AdminRoute
const adminRouteContent = `import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

${getLines(1624, 1695)}

export default AdminRoute;
export { AdminRoute };
`;
fs.writeFileSync('js/components/common/AdminRoute.jsx', adminRouteContent, 'utf8');

// LanguageSwitcher
const languageSwitcherContent = `import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

${getLines(1696, 1722)}

export default LanguageSwitcher;
export { LanguageSwitcher };
`;
fs.writeFileSync('js/components/common/LanguageSwitcher.jsx', languageSwitcherContent, 'utf8');

// ThemeToggle
const themeToggleContent = `import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';

${getLines(1723, 1739)}

export default ThemeToggle;
export { ThemeToggle };
`;
fs.writeFileSync('js/components/common/ThemeToggle.jsx', themeToggleContent, 'utf8');

// Header
const headerContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { ProfileMenu } from './ProfileMenu.jsx';

${getLines(1740, 1859)}

export default Header;
export { Header };
`;
fs.writeFileSync('js/components/common/Header.jsx', headerContent, 'utf8');

// Navbar
const navbarContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

${getLines(1860, 2056)}

export default Navbar;
export { Navbar };
`;
fs.writeFileSync('js/components/common/Navbar.jsx', navbarContent, 'utf8');

// TrendingTicker
const trendingTickerContent = `import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { newsData, marketSnapshotData } from '../../data/translations.js';

${getLines(2057, 2145)}

export default TrendingTicker;
export { TrendingTicker };
`;
fs.writeFileSync('js/components/home/TrendingTicker.jsx', trendingTickerContent, 'utf8');

// VideoCard
const videoCardContent = `import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

${getLines(2495, 2579)}

export default VideoCard;
export { VideoCard };
`;
fs.writeFileSync('js/components/common/VideoCard.jsx', videoCardContent, 'utf8');

// SkeletonCard
const skeletonCardContent = `import React from 'react';

${getLines(2580, 2700)}

export default SkeletonCard;
export { SkeletonCard };
`;
fs.writeFileSync('js/components/common/SkeletonCard.jsx', skeletonCardContent, 'utf8');

// HeroSection
const heroSectionContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

${getLines(2701, 2912)}

export default HeroSection;
export { HeroSection };
`;
fs.writeFileSync('js/components/home/HeroSection.jsx', heroSectionContent, 'utf8');

// TrendingArticlesSection
const trendingArticlesSectionContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

${getLines(2913, 3015)}

export default TrendingArticlesSection;
export { TrendingArticlesSection };
`;
fs.writeFileSync('js/components/home/TrendingArticlesSection.jsx', trendingArticlesSectionContent, 'utf8');

// SignInCtaBanner
const signInCtaBannerContent = `import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

${getLines(3629, 3706)}

export default SignInCtaBanner;
export { SignInCtaBanner };
`;
fs.writeFileSync('js/components/common/SignInCtaBanner.jsx', signInCtaBannerContent, 'utf8');

// Toast
const toastContent = `import React, { useEffect } from 'react';

${getLines(3707, 3725)}

export default Toast;
export { Toast };
`;
fs.writeFileSync('js/components/common/Toast.jsx', toastContent, 'utf8');

// Footer
const footerContent = `import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { OFFICIAL_CHANNEL_URL, OFFICIAL_CHANNEL_HANDLE } from '../../data/translations.js';

${getLines(3726, 3832)}

export default Footer;
export { Footer };
`;
fs.writeFileSync('js/components/common/Footer.jsx', footerContent, 'utf8');

// CinemaVideoCard
const cinemaVideoCardContent = `import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

${getLines(3833, 3920)}

export default CinemaVideoCard;
export { CinemaVideoCard };
`;
fs.writeFileSync('js/components/home/CinemaVideoCard.jsx', cinemaVideoCardContent, 'utf8');

// CinemaSpotlightHero
const cinemaSpotlightHeroContent = `import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

${getLines(3921, 4022)}

export default CinemaSpotlightHero;
export { CinemaSpotlightHero };
`;
fs.writeFileSync('js/components/home/CinemaSpotlightHero.jsx', cinemaSpotlightHeroContent, 'utf8');

// CinemaVideoRail
const cinemaVideoRailContent = `import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import CinemaVideoCard from './CinemaVideoCard.jsx';

${getLines(4023, 4107)}

export default CinemaVideoRail;
export { CinemaVideoRail };
`;
fs.writeFileSync('js/components/home/CinemaVideoRail.jsx', cinemaVideoRailContent, 'utf8');

// CinemaTheaterModal
const cinemaTheaterModalContent = `import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getVideoById, getRelatedVideos } from '../services/api.js';

${getLines(4108, 4525)}

export default CinemaTheaterModal;
export { CinemaTheaterModal };
`;
fs.writeFileSync('js/pages/CinemaTheaterModal.jsx', cinemaTheaterModalContent, 'utf8');

// HomeCinemaShowcase
const homeCinemaShowcaseContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import CinemaSpotlightHero from './CinemaSpotlightHero.jsx';
import CinemaVideoRail from './CinemaVideoRail.jsx';
import { getTrendingPreviewVideos } from '../../services/api.js';

${getLines(4526, 4642)}

export default HomeCinemaShowcase;
export { HomeCinemaShowcase };
`;
fs.writeFileSync('js/components/home/HomeCinemaShowcase.jsx', homeCinemaShowcaseContent, 'utf8');

// Home
const homeContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import HeroSection from './HeroSection.jsx';
import TrendingArticlesSection from './TrendingArticlesSection.jsx';
import HomeCinemaShowcase from './HomeCinemaShowcase.jsx';

${getLines(4643, 4669)}

export default Home;
export { Home };
`;
fs.writeFileSync('js/components/home/Home.jsx', homeContent, 'utf8');

// Code-split Pages:
// VideosPage
const videosPageContent = `import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import CinemaSpotlightHero from '../components/home/CinemaSpotlightHero.jsx';
import CinemaVideoRail from '../components/home/CinemaVideoRail.jsx';
import CinemaVideoCard from '../components/home/CinemaVideoCard.jsx';
import CinemaTheaterModal from './CinemaTheaterModal.jsx';
import SkeletonCard from '../components/common/SkeletonCard.jsx';
import { getLatestVideos } from '../services/api.js';

${getLines(4670, 5038)}

export default VideosPage;
export { VideosPage };
`;
fs.writeFileSync('js/pages/VideosPage.jsx', videosPageContent, 'utf8');

// ArticlesPage
const articlesPageContent = `import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import SkeletonCard from '../components/common/SkeletonCard.jsx';

${getLines(5039, 6112)}

export default ArticlesPage;
export { ArticlesPage };
`;
fs.writeFileSync('js/pages/ArticlesPage.jsx', articlesPageContent, 'utf8');

// ArticleCommentsSection
const articleCommentsSectionContent = `import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

${getLines(7472, 7930)}

export default ArticleCommentsSection;
export { ArticleCommentsSection };
`;
fs.writeFileSync('js/pages/ArticleCommentsSection.jsx', articleCommentsSectionContent, 'utf8');

// ArticleDetailPage
const articleDetailPageContent = `import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ArticleCommentsSection from './ArticleCommentsSection.jsx';

${getLines(6113, 7471)}

export default ArticleDetailPage;
export { ArticleDetailPage };
`;
fs.writeFileSync('js/pages/ArticleDetailPage.jsx', articleDetailPageContent, 'utf8');

// AdminArticlesPage
const adminArticlesPageContent = `import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

${getLines(7931, 9582)}

export default AdminArticlesPage;
export { AdminArticlesPage };
`;
fs.writeFileSync('js/pages/AdminArticlesPage.jsx', adminArticlesPageContent, 'utf8');

// PublisherOnboardingModal
const publisherOnboardingModalContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

${getLines(9583, 10141)}

export default PublisherOnboardingModal;
export { PublisherOnboardingModal };
`;
fs.writeFileSync('js/pages/PublisherOnboardingModal.jsx', publisherOnboardingModalContent, 'utf8');

// RichTextEditor
const richTextEditorContent = `import React, { useState, useEffect, useRef } from 'react';

${getLines(10142, 10532)}

export default RichTextEditor;
export { RichTextEditor };
`;
fs.writeFileSync('js/pages/RichTextEditor.jsx', richTextEditorContent, 'utf8');

// ArticleEditorPage
const articleEditorPageContent = `import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import RichTextEditor from './RichTextEditor.jsx';

${getLines(10533, 11134)}

export default ArticleEditorPage;
export { ArticleEditorPage };
`;
fs.writeFileSync('js/pages/ArticleEditorPage.jsx', articleEditorPageContent, 'utf8');

// AuthPage
const authPageContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth, getSupabaseClient } from '../context/AuthContext.jsx';

${getLines(11135, 11509)}

export default AuthPage;
export { AuthPage };
`;
fs.writeFileSync('js/pages/AuthPage.jsx', authPageContent, 'utf8');

// AggregatedNewsCard
const aggregatedNewsCardContent = `import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

${getLines(11510, 11598)}

export default AggregatedNewsCard;
export { AggregatedNewsCard };
`;
fs.writeFileSync('js/pages/AggregatedNewsCard.jsx', aggregatedNewsCardContent, 'utf8');

// NewsCard
const newsCardContent = `import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

${getLines(11599, 11657)}

export default NewsCard;
export { NewsCard };
`;
fs.writeFileSync('js/pages/NewsCard.jsx', newsCardContent, 'utf8');

// NewsPage
const newsPageContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import NewsCard from './NewsCard.jsx';
import AggregatedNewsCard from './AggregatedNewsCard.jsx';

${getLines(11658, 11840)}

export default NewsPage;
export { NewsPage };
`;
fs.writeFileSync('js/pages/NewsPage.jsx', newsPageContent, 'utf8');

// NewsDetailsPage
const newsDetailsPageContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

${getLines(11841, 11910)}

export default NewsDetailsPage;
export { NewsDetailsPage };
`;
fs.writeFileSync('js/pages/NewsDetailsPage.jsx', newsDetailsPageContent, 'utf8');

// ProfilePage
const profilePageContent = `import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

${getLines(11911, 12576)}

export default ProfilePage;
export { ProfilePage };
`;
fs.writeFileSync('js/pages/ProfilePage.jsx', profilePageContent, 'utf8');

// WatchHistoryPage
const watchHistoryPageContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

${getLines(12577, 12686)}

export default WatchHistoryPage;
export { WatchHistoryPage };
`;
fs.writeFileSync('js/pages/WatchHistoryPage.jsx', watchHistoryPageContent, 'utf8');

// CategoryPage
const categoryPageContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import SkeletonCard from '../components/common/SkeletonCard.jsx';

${getLines(12687, 12867)}

export default CategoryPage;
export { CategoryPage };
`;
fs.writeFileSync('js/pages/CategoryPage.jsx', categoryPageContent, 'utf8');

// ProfessionalsDirectoryPage
const professionalsDirectoryPageContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { professionalsData } from '../data/translations.js';

${getLines(12868, 13272)}

export default ProfessionalsDirectoryPage;
export { ProfessionalsDirectoryPage };
`;
fs.writeFileSync('js/pages/ProfessionalsDirectoryPage.jsx', professionalsDirectoryPageContent, 'utf8');

// ProfessionalWidescreenVideoCard
const professionalWidescreenVideoCardContent = `import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

${getLines(13273, 13356)}

export default ProfessionalWidescreenVideoCard;
export { ProfessionalWidescreenVideoCard };
`;
fs.writeFileSync('js/pages/ProfessionalWidescreenVideoCard.jsx', professionalWidescreenVideoCardContent, 'utf8');

// ProfessionalProfilePage
const professionalProfilePageContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { professionalsData } from '../data/translations.js';
import ProfessionalWidescreenVideoCard from './ProfessionalWidescreenVideoCard.jsx';

${getLines(13357, 13832)}

export default ProfessionalProfilePage;
export { ProfessionalProfilePage };
`;
fs.writeFileSync('js/pages/ProfessionalProfilePage.jsx', professionalProfilePageContent, 'utf8');

// LoginReminderModal
const loginReminderModalContent = `import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

${getLines(13833, 14005)}

export default LoginReminderModal;
export { LoginReminderModal };
`;
fs.writeFileSync('js/pages/LoginReminderModal.jsx', loginReminderModalContent, 'utf8');

// SipCalculator
const sipCalculatorContent = `import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

${getLines(3016, 3534)}

export default SipCalculator;
export { SipCalculator };
`;
fs.writeFileSync('js/pages/SipCalculator.jsx', sipCalculatorContent, 'utf8');

// RiskQuizWidget
const riskQuizWidgetContent = `import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

${getLines(3535, 3628)}

export default RiskQuizWidget;
export { RiskQuizWidget };
`;
fs.writeFileSync('js/pages/RiskQuizWidget.jsx', riskQuizWidgetContent, 'utf8');

// CommandPalette
const commandPaletteContent = `import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { searchAllContent } from '../services/api.js';

${getLines(2146, 2494)}

export default CommandPalette;
export { CommandPalette };
`;
fs.writeFileSync('js/pages/CommandPalette.jsx', commandPaletteContent, 'utf8');

console.log('All modular files written successfully.');
