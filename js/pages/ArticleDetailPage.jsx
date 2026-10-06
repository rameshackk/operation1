import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth, useBookmarks } from '../context/AuthContext.jsx';
import ArticleCommentsSection from './ArticleCommentsSection.jsx';

function ArticleDetailPage({ slug, onNavigate, onShowToast }) {
  const { language } = useLanguage();
  const { session } = useAuth();
  const { bookmarks, toggleBookmark, isSaved } = useBookmarks();
  const isTamil = language === 'ta';

  const [article, setArticle] = useState(null);
  const [categoryArticles, setCategoryArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Audio Player State (Google Cloud WaveNet + Web Speech fallback)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef(null);

  // Floating toolbar interactive states
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const toolbarRef = useRef(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showTocModal, setShowTocModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Close toolbar on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setIsToolbarExpanded(false);
      }
    };
    if (isToolbarExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isToolbarExpanded]);

  // Scroll listener for sticky bar, progress, and scroll-to-top
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / totalHeight) * 100));
        setScrollProgress(progress);
      }
      setShowStickyBar(scrollTop > 260);
      setShowScrollTop(scrollTop > 380);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Fetch current article data
  useEffect(() => {
    let isMounted = true;
    const fetchArticle = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = session?.access_token || '';
        const res = await fetch(`/api/articles/${encodeURIComponent(slug)}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          throw new Error(res.status === 404 ? (isTamil ? 'கட்டுரை கிடைக்கவில்லை' : 'Article not found') : 'Failed to load article');
        }

        const data = await res.json();
        if (isMounted) {
          setArticle(data.data);
          // Also fetch sibling articles in the same category for prev/next and sidebar
          if (data.data?.category) {
            fetch(`/api/articles?category=${encodeURIComponent(data.data.category)}&limit=15`)
              .then(r => r.ok ? r.json() : null)
              .then(catJson => {
                if (isMounted && catJson?.data) {
                  setCategoryArticles(catJson.data);
                }
              })
              .catch(() => { });
          }
        }
      } catch (err) {
        console.error('Error loading article:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchArticle();
    return () => { isMounted = false; };
  }, [slug, session, isTamil]);

  // Track & Increment Live View Count
  useEffect(() => {
    if (!slug) return;
    const sessionKey = `muthaleetu_art_view_${slug}`;
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      fetch(`/api/articles/${encodeURIComponent(slug)}/view`, { method: 'POST' })
        .then(r => r.json())
        .then(json => {
          if (json && typeof json.views === 'number') {
            setArticle(prev => prev ? { ...prev, views: json.views, viewCount: json.views } : prev);
          }
        })
        .catch(() => { });
    }
  }, [slug]);

  // Sibling articles for Previous / Next in the same category
  const { prevArticle, nextArticle } = useMemo(() => {
    if (!article || categoryArticles.length === 0) return { prevArticle: null, nextArticle: null };
    const idx = categoryArticles.findIndex(a => a.slug === article.slug || a.id === article.id);
    if (idx === -1) {
      return {
        prevArticle: categoryArticles[0] && categoryArticles[0].slug !== article.slug ? categoryArticles[0] : null,
        nextArticle: categoryArticles[1] && categoryArticles[1].slug !== article.slug ? categoryArticles[1] : null
      };
    }
    return {
      prevArticle: idx > 0 ? categoryArticles[idx - 1] : null,
      nextArticle: idx < categoryArticles.length - 1 ? categoryArticles[idx + 1] : null
    };
  }, [article, categoryArticles]);

  // Extract H2 headings for Table of Contents
  const tableOfContents = useMemo(() => {
    if (!article) return [];
    const bodyText = isTamil ? (article.bodyTamil || article.bodyEnglish || '') : (article.bodyEnglish || article.bodyTamil || '');
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    const items = [];
    let match;
    let index = 0;
    while ((match = h2Regex.exec(bodyText)) !== null) {
      const cleanTitle = match[1].replace(/<[^>]+>/g, '').trim();
      if (cleanTitle) {
        items.push({ id: `section-h2-${index}`, title: cleanTitle });
        index++;
      }
    }
    return items;
  }, [article, isTamil]);

  const [audioVoiceLang, setAudioVoiceLang] = useState(() => isTamil ? 'ta' : 'en');

  // Keep audioVoiceLang in sync when user toggles site language
  useEffect(() => {
    setAudioVoiceLang(isTamil ? 'ta' : 'en');
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isTamil, language]);

  // Pre-warm and register voices for Tamil (ta-IN) and Indian English (en-IN)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.getVoices();
        const onVoicesChanged = () => {
          try { window.speechSynthesis.getVoices(); } catch { }
        };
        window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
        return () => {
          window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        };
      } catch { }
    }
  }, []);

  // Helper to find optimal native voice for the selected language
  const getVoiceForLanguage = (isTa) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length === 0) return null;

    if (isTa) {
      // Prioritize explicit Tamil voices (ta-IN, Google தமிழ், Microsoft Valluvar/Pallavi/Latha, Apple Tamil)
      const exactTa = voices.find(v => v.lang && (v.lang.toLowerCase() === 'ta-in' || v.lang.toLowerCase() === 'ta_in'));
      if (exactTa) return exactTa;

      const anyTa = voices.find(v => {
        const l = (v.lang || '').toLowerCase();
        const n = (v.name || '').toLowerCase();
        return l.startsWith('ta') || n.includes('tamil') || n.includes('தமிழ்') || n.includes('valluvar') || n.includes('pallavi') || n.includes('latha');
      });
      if (anyTa) return anyTa;
    } else {
      // English: Indian English en-IN or standard English
      const enIn = voices.find(v => v.lang && (v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase() === 'en_in' || (v.name || '').toLowerCase().includes('india')));
      if (enIn) return enIn;

      const anyEn = voices.find(v => (v.lang || '').toLowerCase().startsWith('en'));
      if (anyEn) return anyEn;
    }
    return null;
  };

  const formatAudioTime = (sec) => {
    if (!sec || isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Client-side Web Speech Synthesis (Seamless zero-cost fallback)
  const playSpeechSynthesis = (targetLang) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onShowToast) onShowToast(targetLang === 'ta' ? 'உங்கள் உலாவியில் ஆடியோ வசதி இல்லை.' : 'Text-to-speech is not supported in your browser.');
      setIsPlaying(false);
      setIsSpeaking(false);
      return;
    }

    const isTargetTamil = targetLang === 'ta';
    window.speechSynthesis.cancel();

    const titleToRead = isTargetTamil
      ? (article.titleTamil || article.title_ta || article.title || '')
      : (article.titleEnglish || article.title_en || article.title || '');

    const excerptToRead = isTargetTamil
      ? (article.excerptTamil || article.excerpt_ta || article.summary || article.excerpt || '')
      : (article.excerptEnglish || article.excerpt_en || article.summary || article.excerpt || '');

    const rawBody = isTargetTamil
      ? (article.bodyTamil || article.body_ta || article.body || '')
      : (article.bodyEnglish || article.body_en || article.body || '');

    const cleanBody = rawBody
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '$1. ')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '$1. ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')

      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();

    const fullText = `${titleToRead}. ${excerptToRead ? excerptToRead + '.' : ''} ${cleanBody}`.trim();

    if (!fullText) {
      if (onShowToast) onShowToast(isTargetTamil ? 'வாசிக்க தமிழ் உரை எதுவும் இல்லை.' : 'No text content available to read.');
      setIsPlaying(false);
      setIsSpeaking(false);
      return;
    }

    const sentences = fullText.match(/[^.!?\n]+[.!?\n]+/g) || [fullText];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + ' ' + sentence).length > 200) {
        if (currentChunk.trim()) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += ' ' + sentence;
      }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());

    // Estimate total reading duration for timeline scrubber (~130 wpm for Tamil, 160 wpm for English)
    const wordCount = fullText.split(/\s+/).length;
    const estimatedSecs = Math.max(15, Math.ceil((wordCount / (isTargetTamil ? 130 : 160)) * 60));
    setAudioDuration(estimatedSecs);
    setAudioCurrentTime(0);

    const matchedVoice = getVoiceForLanguage(isTargetTamil);
    let chunkIndex = 0;

    const speakNextChunk = () => {
      if (chunkIndex >= chunks.length) {
        setIsPlaying(false);
        setIsSpeaking(false);
        setAudioCurrentTime(estimatedSecs);
        return;
      }

      const chunkText = chunks[chunkIndex];
      chunkIndex++;

      setAudioCurrentTime(Math.min(estimatedSecs, Math.ceil((chunkIndex / chunks.length) * estimatedSecs)));

      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = isTargetTamil ? 'ta-IN' : 'en-IN';
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.rate = (isTargetTamil ? 0.88 : 0.95) * playbackSpeed;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        speakNextChunk();
      };
      utterance.onerror = (e) => {
        console.warn('TTS playback error:', e);
        setIsPlaying(false);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsPlaying(true);
    setIsSpeaking(true);
    speakNextChunk();

    if (onShowToast) {
      onShowToast(isTargetTamil ? '🔊 WaveNet தமிழில் கட்டுரை வாசிக்கப்படுகிறது...' : '🔊 Reading article aloud in English...');
    }
  };

  // Main Audio Listener Trigger: Handles Cloud MP3 and SpeechSynthesis seamlessly
  const handleToggleListen = (forcedLang) => {
    const targetLang = forcedLang || audioVoiceLang;
    const isTargetTamil = targetLang === 'ta';
    setAudioVoiceLang(targetLang);
    setShowAudioPlayer(true);

    const activeAudioUrl = (isTargetTamil
      ? (article?.audioUrlTa || article?.audio_url_ta)
      : (article?.audioUrlEn || article?.audio_url_en)) || `/api/articles?action=tts&slug=${encodeURIComponent(article?.slug || slug || '')}&lang=${targetLang}`;

    if (audioRef.current) {
      if (isPlaying && (audioVoiceLang === targetLang || !forcedLang)) {
        audioRef.current.pause();
        if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsSpeaking(false);
        if (onShowToast) onShowToast(isTargetTamil ? 'ஆடியோ இடைநிறுத்தப்பட்டது.' : 'Audio paused.');
        return;
      }

      if (audioRef.current.src !== activeAudioUrl) {
        audioRef.current.src = activeAudioUrl;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.load();
      }

      setIsAudioLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsSpeaking(true);
          setIsAudioLoading(false);
          if (onShowToast) onShowToast(isTargetTamil ? '🔊 தமிழ் ஆடியோ இயங்குகிறது...' : '🔊 Streaming English audio...');
        })
        .catch((err) => {
          console.warn('Audio tag play failed, trying fallback stream/TTS:', err);
          setIsAudioLoading(false);
          if (!activeAudioUrl.includes('action=tts')) {
            audioRef.current.src = `/api/articles?action=tts&slug=${encodeURIComponent(article?.slug || slug || '')}&lang=${targetLang}`;
            audioRef.current.playbackRate = playbackSpeed;
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true);
                setIsSpeaking(true);
              })
              .catch(() => {
                playSpeechSynthesis(targetLang);
              });
          } else {
            playSpeechSynthesis(targetLang);
          }
        });
    } else {
      playSpeechSynthesis(targetLang);
    }
  };

  const handleSeek = (newTime) => {
    const time = parseFloat(newTime);
    setAudioCurrentTime(time);
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime = time;
    }
  };

  const handleSkip = (deltaSeconds) => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      const nextTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + deltaSeconds));
      audioRef.current.currentTime = nextTime;
      setAudioCurrentTime(nextTime);
    } else {
      const nextTime = Math.max(0, Math.min(audioDuration || 60, audioCurrentTime + deltaSeconds));
      setAudioCurrentTime(nextTime);
    }
  };

  const handleChangeSpeed = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    if (onShowToast) onShowToast(isTamil ? `வேகம்: ${newSpeed}x` : `Playback speed: ${newSpeed}x`);
  };

  const handleClosePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsSpeaking(false);
    setShowAudioPlayer(false);
  };

  // Share handler
  const handleShare = async (platform = 'copy') => {
    const titleText = article ? (isTamil ? article.titleTamil : article.titleEnglish) : 'Muthaleetu Thisai';
    const url = window.location.href;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${titleText} - ${url}`)}`, '_blank');
      return;
    }
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(titleText)}&url=${encodeURIComponent(url)}`, '_blank');
      return;
    }

    if (navigator.share && platform === 'native') {
      try {
        await navigator.share({ title: titleText, text: titleText, url });
        return;
      } catch { }
    }

    try {
      await navigator.clipboard.writeText(url);
      if (onShowToast) onShowToast(isTamil ? 'லிங்க் நகலெடுக்கப்பட்டது!' : 'Article link copied to clipboard!');
    } catch {
      if (onShowToast) onShowToast(isTamil ? 'பகிர்வு தயார்!' : 'Share link ready!');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 text-center space-y-4 bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-brandBlue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
          {isTamil ? 'கட்டுரை ஏற்றப்படுகிறது...' : 'Loading article...'}
        </p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
        <div className="text-4xl">📄</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {error || (isTamil ? 'கட்டுரை கிடைக்கவில்லை' : 'Article Not Found')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTamil ? 'இந்தக் கட்டுரை நீக்கப்பட்டிருக்கலாம் அல்லது வெளியிடப்படாமல் இருக்கலாம்.' : 'The article may have been removed or is currently unpublished.'}
        </p>
        <button
          type="button"
          onClick={() => onNavigate('#/articles')}
          className="px-6 py-2.5 rounded-full bg-brandBlue-600 hover:bg-brandBlue-700 text-white font-extrabold text-xs shadow-lg transition-all"
        >
          ← {isTamil ? 'கட்டுரைகள் பக்கத்திற்குத் திரும்பு' : 'Back to Articles'}
        </button>
      </div>
    );
  }

  const title = isTamil ? article.titleTamil : (article.titleEnglish || article.titleTamil);
  const excerpt = isTamil ? article.excerptTamil : (article.excerptEnglish || article.excerptTamil);
  const body = isTamil ? article.bodyTamil : (article.bodyEnglish || article.bodyTamil);
  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(article.publishedAt))
    : 'Aug 2026';
  const authorName = article.authorName || article.author_name || 'Budget Padmanaban';
  const authorArn = article.authorArn || article.author_arn || (authorName.toLowerCase().includes('padmanaban') ? 'ARN-112345' : '');
  const authorTitle = article.authorTitle || 'AMFI Registered Mutual Fund Distributor • Wealth Specialist';
  const authorWhatsapp = article.authorWhatsapp || article.authorPhone || '919840000000';
  const categoryLabel = (article.category || 'FINANCE').replace('-', ' ').toUpperCase();
  const isSavedArticle = isSaved(article.id);

  // Other articles in category for carousel & sidebar (excluding current article)
  const relatedCategoryArticles = categoryArticles.filter(a => a.slug !== article.slug);

  return (
    <div 
      className={`min-h-screen pb-20 animate-fadeIn relative transition-colors duration-300 ${isReadingMode ? 'bg-[#fbfbf9] dark:bg-[#0a0f18]' : ''}`}
      style={!isReadingMode ? {
        backgroundColor: '#23645C'
      } : undefined}
    >

      {/* ================= 1. STICKY "NOW READING" BAR ================= */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-slate-950/95 text-white backdrop-blur-md border-b border-slate-800/80 shadow-md transition-all duration-300 ${showStickyBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        <div className="w-full max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Now Reading Label + Article Title */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#4A9E2C] text-white shrink-0">
              {isTamil ? 'இப்போது வாசிப்பது' : 'Now Reading'}
            </span>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-100 truncate font-serif" title={title}>
              {title}
            </h4>
          </div>

          {/* Right: Actions & Prev/Next Category Nav */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Share Button */}
            <button
              type="button"
              onClick={() => handleShare('native')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isTamil ? 'பகிர்' : 'Share'}
              aria-label="Share article"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            {/* Prev Article in Category */}
            <button
              type="button"
              disabled={!prevArticle}
              onClick={() => prevArticle && onNavigate(`#/articles/${prevArticle.slug}`)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-all flex items-center gap-1"
              title={prevArticle ? (isTamil ? prevArticle.titleTamil : prevArticle.titleEnglish) : ''}
            >
              <span>←</span>
              <span className="hidden md:inline">{isTamil ? 'முந்தையது' : 'Prev'}</span>
            </button>

            {/* Next Article in Category */}
            <button
              type="button"
              disabled={!nextArticle}
              onClick={() => nextArticle && onNavigate(`#/articles/${nextArticle.slug}`)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-all flex items-center gap-1"
              title={nextArticle ? (isTamil ? nextArticle.titleTamil : nextArticle.titleEnglish) : ''}
            >
              <span className="hidden md:inline">{isTamil ? 'அடுத்தது' : 'Next'}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar at very bottom edge of sticky bar */}
        <div className="w-full h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-brandBlue-500 via-brandGreen-500 to-amber-500 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* ================= 2. FLOATING LEFT TOOLBAR (Expandable Speed Dial) ================= */}
      <div 
        ref={toolbarRef}
        className="hidden lg:flex flex-col items-center fixed left-4 2xl:left-8 top-1/3 z-30 select-none"
      >
        {/* Expanded Tool Actions Panel */}
        <div
          className={`flex flex-col gap-2 p-2 mb-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-2xl transition-all duration-300 origin-bottom ${
            isToolbarExpanded
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
          }`}
          style={{ maxHeight: isToolbarExpanded ? '500px' : '0px', overflow: 'hidden' }}
        >
          {/* Info Icon */}
          <button
            type="button"
            onClick={() => setShowInfoModal(prev => !prev)}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brandBlue-600 transition-all flex items-center justify-center group relative"
            title={isTamil ? 'கட்டுரை தகவல்' : 'Article Information'}
            aria-label="Info"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="absolute left-full ml-2.5 px-2 py-1 text-[11px] font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-lg transition-opacity duration-150 z-50">
              {isTamil ? 'கட்டுரை தகவல்' : 'Article Info'}
            </span>
          </button>

          {/* Reading Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsReadingMode(prev => !prev);
              if (onShowToast) onShowToast(!isReadingMode ? (isTamil ? 'வாசிப்பு முறை இயக்கப்பட்டது' : 'Reading Mode Enabled') : (isTamil ? 'இயல்பு முறை' : 'Standard View'));
            }}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center group relative ${isReadingMode
                ? 'bg-[#4A9E2C] text-white shadow-md'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brandBlue-600'
              }`}
            title={isTamil ? 'வாசிப்பு முறை (Focus Mode)' : 'Toggle Reading Focus Mode'}
            aria-label="Reading Mode"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="absolute left-full ml-2.5 px-2 py-1 text-[11px] font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-lg transition-opacity duration-150 z-50">
              {isReadingMode ? (isTamil ? 'இயல்பு பார்வை' : 'Exit Focus') : (isTamil ? 'வாசிப்பு முறை' : 'Focus Mode')}
            </span>
          </button>

          {/* Copy Link Icon */}
          <button
            type="button"
            onClick={() => handleShare('copy')}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brandBlue-600 transition-all flex items-center justify-center group relative"
            title={isTamil ? 'இணைப்பை நகலெடு' : 'Copy Article Link'}
            aria-label="Copy Link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="absolute left-full ml-2.5 px-2 py-1 text-[11px] font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-lg transition-opacity duration-150 z-50">
              {isTamil ? 'இணைப்பு பிரதி' : 'Copy Link'}
            </span>
          </button>

          {/* Listen (TTS) Icon */}
          <button
            type="button"
            onClick={() => handleToggleListen()}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center group relative ${(isPlaying || isSpeaking)
                ? 'bg-amber-500 text-slate-950 animate-pulse shadow-md font-bold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500'
              }`}
            title={(isPlaying || isSpeaking) ? (isTamil ? 'ஆடியோவை நிறுத்து' : 'Stop Audio Read-Aloud') : (isTamil ? 'கட்டுரையைக் கேள் (Audio Listen)' : 'Listen to Article (Audio)')}
            aria-label="Listen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span className="absolute left-full ml-2.5 px-2 py-1 text-[11px] font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-lg transition-opacity duration-150 z-50">
              {isPlaying || isSpeaking ? (isTamil ? 'நிறுத்து' : 'Stop Audio') : (isTamil ? 'ஆடியோ கேட்பது' : 'Listen')}
            </span>
          </button>

          {/* Table of Contents Icon */}
          {tableOfContents.length > 0 && (
            <button
              type="button"
              onClick={() => setShowTocModal(prev => !prev)}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brandBlue-600 transition-all flex items-center justify-center group relative"
              title={isTamil ? 'பொருளடக்கம்' : 'Table of Contents'}
              aria-label="TOC"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span className="absolute left-full ml-2.5 px-2 py-1 text-[11px] font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-lg transition-opacity duration-150 z-50">
                {isTamil ? 'பொருளடக்கம்' : 'Contents'}
              </span>
            </button>
          )}

          {/* Bookmark Icon */}
          <button
            type="button"
            onClick={() => {
              toggleBookmark(article);
              if (onShowToast) onShowToast(!isSavedArticle ? (isTamil ? 'புக்மார்க்குகளில் சேமிக்கப்பட்டது!' : 'Saved to Bookmarks!') : (isTamil ? 'நீக்கப்பட்டது' : 'Removed from Bookmarks'));
            }}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center group relative ${isSavedArticle
                ? 'bg-amber-500/20 text-amber-800 border border-amber-500/30'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500'
              }`}
            title={isTamil ? 'புக்மார்க்' : 'Bookmark'}
            aria-label="Bookmark"
          >
            <svg className="w-4 h-4" fill={isSavedArticle ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="absolute left-full ml-2.5 px-2 py-1 text-[11px] font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-lg transition-opacity duration-150 z-50">
              {isSavedArticle ? (isTamil ? 'சேமிக்கப்பட்டது' : 'Bookmarked') : (isTamil ? 'சேமி' : 'Bookmark')}
            </span>
          </button>

          {/* Share Icon */}
          <button
            type="button"
            onClick={() => handleShare('native')}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brandBlue-600 transition-all flex items-center justify-center group relative"
            title={isTamil ? 'பகிர்' : 'Share'}
            aria-label="Share"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="absolute left-full ml-2.5 px-2 py-1 text-[11px] font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-lg transition-opacity duration-150 z-50">
              {isTamil ? 'பகிர்' : 'Share'}
            </span>
          </button>
        </div>

        {/* Master Expand / Collapse Toggle Button */}
        <button
          type="button"
          onClick={() => setIsToolbarExpanded(prev => !prev)}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg border transition-all duration-300 group relative ${
            isToolbarExpanded
              ? 'bg-brandBlue-600 text-white border-brandBlue-500 shadow-brandBlue-500/25 rotate-90'
              : 'bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-brandBlue-500 hover:text-brandBlue-600 hover:scale-105 shadow-md'
          }`}
          title={isToolbarExpanded ? (isTamil ? 'மூடு' : 'Close Menu') : (isTamil ? 'செயல் விருப்பங்கள்' : 'Quick Actions')}
          aria-label={isToolbarExpanded ? 'Collapse Actions' : 'Expand Actions'}
        >
          {isToolbarExpanded ? (
            <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          )}

          {!isToolbarExpanded && (
            <span className="absolute left-full ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900/95 dark:bg-slate-800/95 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-xl transition-all duration-200 z-50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brandBlue-400 animate-pulse"></span>
              {isTamil ? 'செயல்கள்' : 'Tools'}
            </span>
          )}
        </button>
      </div>

      {/* Info Popover Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowInfoModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-sm w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isTamil ? 'கட்டுரை விவரங்கள்' : 'Article Metadata'}
              </h3>
              <button onClick={() => setShowInfoModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <div className="text-xs space-y-2.5 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between"><span>{isTamil ? 'வெளியிடப்பட்டது:' : 'Published:'}</span> <strong className="text-slate-900 dark:text-white">{formattedDate}</strong></div>
              <div className="flex justify-between"><span>{isTamil ? 'வாசிக்கும் நேரம்:' : 'Read Time:'}</span> <strong className="text-slate-900 dark:text-white">{article.readTimeMinutes || 4} {isTamil ? 'நிமிடம்' : 'mins'}</strong></div>
              <div className="flex justify-between"><span>{isTamil ? 'பிரிவு:' : 'Category:'}</span> <strong className="text-brandBlue-600">{categoryLabel}</strong></div>
              <div className="flex justify-between"><span>{isTamil ? 'பார்வைகள்:' : 'Views:'}</span> <strong className="text-slate-900 dark:text-white">{(article.views || article.viewCount || 0).toLocaleString()}</strong></div>
              <div className="flex justify-between"><span>{isTamil ? 'மொழிகள்:' : 'Language Availability:'}</span> <strong className="text-slate-900 dark:text-white">தமிழ் / English</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents Popover Modal */}
      {showTocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowTocModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isTamil ? 'பொருளடக்கம் (Table of Contents)' : 'Table of Contents'}
              </h3>
              <button onClick={() => setShowTocModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <ul className="space-y-2 text-xs max-h-72 overflow-y-auto no-scrollbar">
              {tableOfContents.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      setShowTocModal(false);
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="text-left w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:text-brandBlue-600 transition-colors"
                  >
                    {idx + 1}. {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* AI Summary Explainer Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAiModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>✨</span>
                <span>{isTamil ? 'AI சுருக்கம் எப்படி செயல்படுகிறது?' : 'How AI Quick Summary Works'}</span>
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isTamil
                ? 'முதலீட்டு திசை இயங்குதளம் ஜெமினி AI மாடலின் உதவியுடன் சிக்கலான ஒழுங்குமுறை விதிமுறைகள் மற்றும் மியூச்சுவல் ஃபண்ட் பகுப்பாய்வுகளை 3-5 வாக்கியங்களில் எளிய தமிழ் மற்றும் ஆங்கிலத்தில் தொகுத்து வழங்குகிறது.'
                : 'Muthaleetu Thisai leverages Gemini AI to extract key investment insights, regulatory updates, and actionable takeaways into plain-language bulleted summaries.'}
            </p>
            <div className="pt-2">
              <button onClick={() => setShowAiModal(false)} className="w-full py-2 rounded-xl bg-[#4A9E2C] text-white font-bold text-xs">
                {isTamil ? 'புரிந்தது' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN ARTICLE WRAPPER ================= */}
      <div className="w-full max-w-[96vw] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">

        {/* Breadcrumb & Navigation Top */}
        <div className="flex items-center justify-between gap-4 py-2 mb-4 text-xs font-bold text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => onNavigate('#/articles')}
            className="inline-flex items-center gap-1.5 hover:text-brandBlue-600 dark:hover:text-brandBlue-400 transition-colors"
          >
            <span>←</span>
            <span>{isTamil ? 'அனைத்து கட்டுரைகள்' : 'All Articles'}</span>
          </button>
          <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider bg-[#4A9E2C]/10 text-[#4A9E2C] dark:text-brandBlue-300 border border-[#4A9E2C]/30">
            {categoryLabel}
          </span>
        </div>

        {/* Article Headline with Generous Multi-line Breathing Room */}
        <h1 className="article-headline text-2xl sm:text-3xl lg:text-4xl 2xl:text-[40px] font-black text-slate-900 dark:text-white font-serif leading-[1.5] sm:leading-[1.46] lg:leading-[1.42] mb-6 tracking-normal">
          {title}
        </h1>

        {/* Hero Section: Wider Cover Image on Left (66-70%) + Compact AI Summary on Right (30-34%) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-stretch mb-6">
          {/* Wider Hero Image */}
          {article.coverImage && (
            <div className="md:col-span-7 lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] md:aspect-auto rounded-3xl overflow-hidden shadow-lg bg-slate-950 border border-slate-200/80 dark:border-slate-800 min-h-[260px] md:min-h-[340px] max-h-[480px]">
              <img
                src={article.coverImage}
                srcSet={article.coverImage.includes('images.unsplash.com') ? `${article.coverImage.split('?')[0]}?w=360&q=75&auto=format&fit=crop 360w, ${article.coverImage.split('?')[0]}?w=640&q=75&auto=format&fit=crop 640w, ${article.coverImage.split('?')[0]}?w=960&q=75&auto=format&fit=crop 960w, ${article.coverImage.split('?')[0]}?w=1200&q=75&auto=format&fit=crop 1200w` : undefined}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 800px"
                alt={title}
                fetchpriority="high"
                decoding="async"
                width="800"
                height="480"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* ================= 3. QUICK SUMMARY BOX (Compact Width, Adaptive Typography) ================= */}
          <div className={`${article.coverImage ? 'md:col-span-5 lg:col-span-4' : 'w-full'} p-5 sm:p-5 lg:p-6 rounded-3xl bg-brandBlue-500/[0.06] dark:bg-brandBlue-500/[0.12] border border-brandBlue-500/25 shadow-sm flex flex-col justify-between space-y-3`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-brandBlue-700 dark:text-brandBlue-300 font-black text-xs uppercase tracking-wider">
                  <span className="text-base">✨</span>
                  <span>{isTamil ? 'விரைவு சுருக்கம்' : 'Quick Summary'}</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-brandBlue-500/15 text-brandBlue-700 dark:text-brandBlue-300">
                  AI
                </span>
              </div>
              <p className="text-[13px] sm:text-[13.5px] lg:text-[14px] text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {excerpt || (isTamil
                  ? 'மியூச்சுவல் ஃபண்ட் முதலீடுகள், ஒழுங்குமுறை விதிகள் மற்றும் நீண்ட கால சொத்து உருவாக்கத்திற்கான முக்கிய குறிப்புகள் மற்றும் வழிமுறைகளின் சுருக்கம்.'
                  : 'Key insights and executive summary covering systematic investment planning, regulatory compliance, and risk-adjusted wealth compounding principles.')}
              </p>
            </div>
            <div className="pt-2.5 border-t border-brandBlue-500/15 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                {/* Play in Tamil Voice */}
                <button
                  type="button"
                  onClick={() => handleToggleListen('ta')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${(isPlaying || isSpeaking) && audioVoiceLang === 'ta'
                      ? 'bg-amber-500 text-slate-950 animate-pulse shadow font-black ring-2 ring-amber-400'
                      : 'bg-brandBlue-600/10 hover:bg-brandBlue-600/20 text-brandBlue-700 dark:text-brandBlue-300 border border-[#4A9E2C]/30'
                    }`}
                  title="தமிழில் ஆடியோவாக கேள் (Tamil Audio)"
                >
                  <span>{(isPlaying || isSpeaking) && audioVoiceLang === 'ta' ? '⏹' : '🔊'}</span>
                  <span>{(isPlaying || isSpeaking) && audioVoiceLang === 'ta' ? 'நிறுத்து' : 'தமிழில் கேள்'}</span>
                </button>

                {/* Play in English Voice */}
                <button
                  type="button"
                  onClick={() => handleToggleListen('en')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${(isPlaying || isSpeaking) && audioVoiceLang === 'en'
                      ? 'bg-amber-500 text-slate-950 animate-pulse shadow font-black ring-2 ring-amber-400'
                      : 'bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                    }`}
                  title="Listen in English Audio"
                >
                  <span>{(isPlaying || isSpeaking) && audioVoiceLang === 'en' ? '⏹' : '🔊'}</span>
                  <span>{(isPlaying || isSpeaking) && audioVoiceLang === 'en' ? 'Stop' : 'English'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="text-xs font-bold text-[#4A9E2C] dark:text-[#4ade80] hover:underline inline-flex items-center gap-1"
              >
                <span>{isTamil ? 'விவரம் →' : 'Learn more →'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 4. PUBLISHER / AUTHOR CREDENTIAL CARD ================= */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-amber-500/[0.06] dark:bg-amber-500/[0.10] border border-amber-500/25 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            {/* Publisher Photo */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 p-0.5 shadow shrink-0 overflow-hidden">
              {article.authorAvatar ? (
                <img src={article.authorAvatar} alt={authorName} className="w-full h-full rounded-2xl object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center font-black text-lg text-amber-400">
                  {authorName.charAt(0)}
                </div>
              )}
            </div>

            {/* Author Credentials & Badges */}
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {authorName}
                </h3>
                <span className="text-blue-500 font-bold" title="Verified Publisher">✓</span>
                {authorArn && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                    <span>🛡️</span>
                    <span>{authorArn}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {authorTitle}
              </p>
              {article.authorSpecialties && Array.isArray(article.authorSpecialties) && article.authorSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.authorSpecialties.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate(`#/professionals/${article.authorId || 'budget-padmanaban'}`)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-800 transition-all text-center"
            >
              {isTamil ? 'சுயவிவரம்' : 'View Profile'} →
            </button>
          </div>
        </div>

        {/* 2-Column Grid on Desktop: Main Body (Left/Center) + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ================= 5. ARTICLE BODY ================= */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6">

            {/* Main Text Content */}
            <div className={`p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all ${isReadingMode ? 'text-lg sm:text-xl leading-loose font-serif' : 'text-base sm:text-[17px] leading-relaxed'}`}>
              <div
                className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 font-normal"
                dangerouslySetInnerHTML={{ __html: body }}
              />

              {/* ================= 6. MID-ARTICLE CTA CALLOUT ================= */}
              <div className="my-8 p-6 sm:p-7 rounded-2xl bg-emerald-500/[0.08] dark:bg-emerald-500/[0.14] border border-emerald-500/30 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
                  <span className="text-base">💬</span>
                  <span>{isTamil ? 'நிபுணர் ஆலோசனை (Direct Consultation)' : 'Direct Advisor Consultation'}</span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-serif">
                  {isTamil
                    ? `இது குறித்து கேள்விகள் உள்ளதா? ${authorName} அவர்களிடம் நேரடியாக WhatsApp-ல் ஆலோசிக்கலாம்.`
                    : `Have questions about this investment strategy? Talk to ${authorName} directly on WhatsApp.`}
                </h4>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${authorWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${authorName}, I read your article "${title}" on Muthaleetu Thisai and would like an investment consultation.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all"
                  >
                    <span>WhatsApp-ல் ஆலோசிக்க →</span>
                  </a>
                </div>
              </div>

              {/* ================= 10. SEBI/AMFI DISCLAIMER & FOOTNOTES ================= */}
              <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <strong className="text-slate-700 dark:text-slate-300 font-bold block">
                    ⚠️ {isTamil ? 'முதலீட்டு அபாய எச்சரிக்கை (SEBI/AMFI Compliance Note)' : 'Regulatory & Risk Disclaimer (SEBI/AMFI Compliance)'}
                  </strong>
                  <p className="text-xs leading-relaxed">
                    {isTamil
                      ? 'மியூச்சுவல் ஃபண்ட் முதலீடுகள் சந்தை அபாயங்களுக்கு உட்பட்டவை. முதலீடு செய்வதற்கு முன் திட்ட ஆவணங்களை கவனமாகப் படிக்கவும். முதலீட்டு திசை மற்றும் பட்ஜெட் பத்மநாபன் வழங்கும் தகவல்கள் கல்வி நோக்கங்களுக்காக மட்டுமே. முந்தைய செயல்பாடுகள் எதிர்கால வருவாய்க்கு உத்தரவாதமாகாது.'
                      : 'Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns. Information provided by Muthaleetu Thisai is solely for educational and research purposes.'}
                  </p>
                </div>

                {/* References Footnote Citations */}
                <div id="references" className="space-y-1.5">
                  <h5 className="font-extrabold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
                    {isTamil ? 'சான்றுகள் & தரவு மூலங்கள் (References)' : 'References & Data Sources'}
                  </h5>
                  <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <li>[1] Association of Mutual Funds in India (AMFI) Industry Statistics & Monthly Portfolio Factsheets.</li>
                    <li>[2] Securities and Exchange Board of India (SEBI) Master Circular on Mutual Funds Governance (2026).</li>
                    <li>[3] Reserve Bank of India (RBI) Monetary Policy & Macroeconomic Assessment Reports.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <ArticleCommentsSection slug={slug} article={article} isTamil={isTamil} onShowToast={onShowToast} />
          </div>

          {/* ================= 7. RIGHT SIDEBAR ("More from Category") ================= */}
          <aside className="lg:col-span-4 xl:col-span-4 space-y-6 sticky top-24">
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {isTamil ? `கூடுதல் கட்டுரைகள் (${categoryLabel})` : `More from ${categoryLabel}`}
                </h3>
              </div>

              {relatedCategoryArticles.length === 0 ? (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                  {isTamil ? 'இப்பிரிவில் வேறு கட்டுரைகள் இல்லை.' : 'No other articles in this category.'}
                </p>
              ) : (
                <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-slate-800/80">
                  {relatedCategoryArticles.slice(0, 5).map((relArt) => {
                    const relTitle = isTamil ? relArt.titleTamil : (relArt.titleEnglish || relArt.titleTamil);
                    const relDate = relArt.publishedAt
                      ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(relArt.publishedAt))
                      : 'Aug 2026';
                    return (
                      <div
                        key={relArt.id}
                        onClick={() => onNavigate(`#/articles/${relArt.slug}`)}
                        className="pt-3.5 first:pt-0 group cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                          <span className="text-[#4A9E2C] dark:text-[#4ade80]">{relArt.category || 'FINANCE'}</span>
                          <span>·</span>
                          <span className="font-mono">{relDate}</span>
                        </div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-brandBlue-600 dark:group-hover:text-brandBlue-400 transition-colors line-clamp-2 font-serif">
                          {relTitle}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('#/articles')}
                  className="w-full py-2 text-center text-xs font-black text-[#4A9E2C] dark:text-[#4ade80] hover:underline"
                >
                  {isTamil ? 'அனைத்து கட்டுரைகளையும் காண்க →' : 'See more articles →'}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ================= 8. END-OF-ARTICLE "MOST READ" CAROUSEL ================= */}
        {relatedCategoryArticles.length > 0 && (
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {categoryLabel}
                </span>
                <h3 className="text-base sm:text-lg font-black font-serif">
                  {isTamil ? 'அதிகம் வாசிக்கப்பட்ட கட்டுரைகள்' : `Most Read in ${categoryLabel}`}
                </h3>
              </div>

              {/* Carousel Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={carouselIndex === 0}
                  onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold transition-all"
                  aria-label="Previous carousel"
                >
                  ←
                </button>
                <button
                  type="button"
                  disabled={carouselIndex >= Math.max(0, relatedCategoryArticles.length - 3)}
                  onClick={() => setCarouselIndex(prev => Math.min(Math.max(0, relatedCategoryArticles.length - 3), prev + 1))}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold transition-all"
                  aria-label="Next carousel"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedCategoryArticles.slice(carouselIndex, carouselIndex + 3).map((item) => {
                const cTitle = isTamil ? item.titleTamil : (item.titleEnglish || item.titleTamil);
                const cDate = item.publishedAt
                  ? new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(item.publishedAt))
                  : 'Aug 2026';
                return (
                  <div
                    key={item.id}
                    onClick={() => onNavigate(`#/articles/${item.slug}`)}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 cursor-pointer group transition-all space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase font-mono">
                        <span className="text-amber-400">{item.category || 'FINANCE'}</span>
                        <span>{cDate}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2 font-serif">
                        {cTitle}
                      </h4>
                    </div>
                    <div className="text-xs font-bold text-brandBlue-400 group-hover:underline pt-1">
                      {isTamil ? 'வாசிக்க →' : 'Read Now →'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= 9. FLOATING LIVE AUDIO PLAYER CONTROLLER & STICKY BOTTOM BAR ================= */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) setAudioCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setAudioDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setIsSpeaking(false);
          setAudioCurrentTime(0);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {showAudioPlayer && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 text-white backdrop-blur-xl border-t border-amber-500/40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] px-4 py-3 sm:py-3.5 transition-all animate-fadeIn">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">

            {/* Left: Voice Status & Language Switcher */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  {isPlaying ? (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-3 bg-amber-400 rounded animate-pulse" />
                      <span className="w-1 h-4 bg-amber-300 rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-2 bg-amber-400 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                    </span>
                  ) : (
                    <span>🔊</span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <span>Google WaveNet AI</span>
                    <span className="text-xs px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">Female</span>
                  </div>
                  <div className="text-xs font-bold text-slate-200 truncate max-w-[180px] sm:max-w-[240px]">
                    {audioVoiceLang === 'ta' ? 'தமிழ் ஆடியோ' : 'English Audio'}
                  </div>
                </div>
              </div>

              {/* Language Switch Pills */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-full border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleToggleListen('ta')}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black transition-all ${audioVoiceLang === 'ta'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-white'
                    }`}
                >
                  தமிழ்
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleListen('en')}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black transition-all ${audioVoiceLang === 'en'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-white'
                    }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Center: Controls & Scrubber Timeline */}
            <div className="flex-1 w-full max-w-xl flex flex-col gap-1">
              <div className="flex items-center justify-center gap-3">
                {/* Skip Back 10s */}
                <button
                  type="button"
                  onClick={() => handleSkip(-10)}
                  className="text-slate-600 dark:text-slate-400 hover:text-white text-xs font-bold p-1 rounded hover:bg-slate-800 transition-colors"
                  title={isTamil ? '10 வினாடி பின்செல்க' : 'Replay 10 seconds'}
                >
                  ↺ 10s
                </button>

                {/* Play / Pause / Loading Button */}
                <button
                  type="button"
                  onClick={() => handleToggleListen()}
                  disabled={isAudioLoading}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  title={isPlaying ? (isTamil ? 'இடைநிறுத்து' : 'Pause') : (isTamil ? 'இயக்கு' : 'Play')}
                >
                  {isAudioLoading ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Skip Forward 10s */}
                <button
                  type="button"
                  onClick={() => handleSkip(10)}
                  className="text-slate-600 dark:text-slate-400 hover:text-white text-xs font-bold p-1 rounded hover:bg-slate-800 transition-colors"
                  title={isTamil ? '10 வினாடி முன்செல்க' : 'Forward 10 seconds'}
                >
                  10s ↻
                </button>
              </div>

              {/* Scrubber Bar */}
              <div className="flex items-center gap-2.5 text-xs font-mono text-slate-600 dark:text-slate-400">
                <span>{formatAudioTime(audioCurrentTime)}</span>
                <div className="flex-1 relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={audioDuration || 100}
                    step="0.5"
                    value={audioCurrentTime}
                    onChange={(e) => handleSeek(e.target.value)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:h-2 transition-all"
                  />
                </div>
                <span>{formatAudioTime(audioDuration)}</span>
              </div>
            </div>

            {/* Right: Playback Speed & Close */}
            <div className="flex items-center gap-2">
              {/* Speed Selector */}
              <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs font-bold">
                {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => handleChangeSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded transition-all ${playbackSpeed === spd
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-white'
                      }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClosePlayer}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-white text-xs transition-colors"
                title={isTamil ? 'மூடு' : 'Close Player'}
              >
                ✕
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= 10. MOBILE FLOATING ACTION TOOLBAR ================= */}
      <div className="lg:hidden mobile-reading-toolbar flex items-center justify-around gap-1 z-40">
        <button
          type="button"
          onClick={() => handleToggleListen(audioVoiceLang || 'ta')}
          className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 transition-all ${(isPlaying || isSpeaking)
              ? 'bg-amber-500 text-slate-950 animate-pulse shadow-md font-bold'
              : 'bg-[#4A9E2C] text-white shadow-sm'
            }`}
          title="Audio Listen"
        >
          <span>{(isPlaying || isSpeaking) ? '⏹' : '🔊'}</span>
          <span>{(isPlaying || isSpeaking) ? (isTamil ? 'நிறுத்து' : 'Stop') : (isTamil ? 'கேள்' : 'Listen')}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            toggleBookmark(article);
            if (onShowToast) onShowToast(!isSavedArticle ? (isTamil ? 'சேமிக்கப்பட்டது!' : 'Saved!') : (isTamil ? 'நீக்கப்பட்டது' : 'Removed'));
          }}
          className={`p-2 rounded-xl text-xs font-bold transition-all ${isSavedArticle
              ? 'bg-amber-500/20 text-amber-800 border border-amber-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          title="Bookmark"
          aria-label="Bookmark"
        >
          <span>{isSavedArticle ? '★' : '☆'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleShare('native')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          title="Share"
          aria-label="Share"
        >
          <span>↗</span>
        </button>

        {tableOfContents.length > 0 && (
          <button
            type="button"
            onClick={() => setShowTocModal(prev => !prev)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
            title="TOC"
            aria-label="Table of Contents"
          >
            <span>📑</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setIsReadingMode(prev => !prev);
            if (onShowToast) onShowToast(!isReadingMode ? (isTamil ? 'வாசிப்பு முறை' : 'Focus View') : (isTamil ? 'இயல்பு பார்வை' : 'Standard View'));
          }}
          className={`p-2 rounded-xl text-xs font-bold transition-all ${isReadingMode
              ? 'bg-[#4A9E2C] text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          title="Focus Mode"
          aria-label="Focus Mode"
        >
          <span>👁️</span>
        </button>

        <button
          type="button"
          onClick={scrollToTop}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          title="Top"
          aria-label="Top"
        >
          <span>↑</span>
        </button>
      </div>

      {/* ================= 11. DESKTOP FLOATING SCROLL-TO-TOP BUTTON ================= */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="hidden lg:flex fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full bg-brandBlue-600 hover:bg-brandBlue-700 text-white shadow-xl shadow-brandBlue-600/30 items-center justify-center font-black text-sm transition-all hover:scale-110 animate-bounce"
          title={isTamil ? 'மேலே செல்க' : 'Scroll to top'}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}


export default ArticleDetailPage;
export { ArticleDetailPage };
