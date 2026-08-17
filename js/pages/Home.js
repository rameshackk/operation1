import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../context/LanguageContext.js';
import { HeroSection } from '../components/HeroSection.js';
import { VideoFanWall } from '../components/VideoFanWall.js';
import { SipCalculator } from '../components/SipCalculator.js';
import { TrendingArticlesSection } from '../components/TrendingArticlesSection.js';
import { SignInCtaBanner } from '../components/SignInCtaBanner.js';
import { newsData } from '../data/news.js';
import { videosData } from '../data/videos.js';
import { translateNewsArticle } from '../services/translationService.js';

export function Home({ onNavigate }) {
  const { t, language } = useLanguage();
  const translatedNews = newsData.map(item => translateNewsArticle(item, language));

  return (
    <div className="space-y-10 pb-16 animate-fadeIn">
      {/* 1. HERO SECTION: NEWS TICKER & LATEST ARTICLES */}
      <HeroSection news={translatedNews} onNavigate={onNavigate} />

      {/* 2. LIVING FAN WALL: CONTINUOUS ANIMATED VIDEO SHOWCASE */}
      <VideoFanWall
        videos={videosData}
        language={language}
        onNavigate={onNavigate}
        titleTamil="பிரத்யேக வீடியோ அலசல்"
        titleEnglish="Living Video Showcase"
        subtitleTamil="பட்ஜெட் பத்மநாபனின் பிரத்யேக நேரலை வீடியோ கேலரி மற்றும் ஆய்வுகள்"
        subtitleEnglish="Continuous interactive video gallery featuring original insights and financial masterclasses"
      />

      {/* 3. TRENDING ARTICLES SECTION */}
      <TrendingArticlesSection onNavigate={onNavigate} />

      {/* 4. SIP & WEALTH COMPOUNDING CALCULATOR */}
      <SipCalculator />

      {/* 5. COMMUNITY SIGN IN CTA */}
      <SignInCtaBanner onNavigate={onNavigate} />
    </div>
  );
}
