import { useState, useEffect } from 'react';

export function formatRelativeTime(dateString, isTamil = false) {
  if (!dateString) return '';
  const now = Date.now();
  const past = new Date(dateString).getTime();
  if (isNaN(past)) return '';
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return isTamil ? 'சற்று முன்' : 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return isTamil ? `${diffMin} நிமிடங்களுக்கு முன்` : `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return isTamil ? `${diffHours} மணிநேரத்திற்கு முன்` : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return isTamil ? `${diffDays} நாட்களுக்கு முன்` : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return new Intl.DateTimeFormat(isTamil ? 'ta-IN' : 'en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
}

export function normalizeSocialUrl(raw, type = 'generic', channelId = null) {
  if (!raw && !channelId) return '';
  if (type === 'youtube') {
    if (channelId && String(channelId).startsWith('UC')) {
      return `https://www.youtube.com/channel/${channelId}`;
    }
    const clean = (raw || '').trim();
    if (!clean) return '';
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    if (clean.startsWith('www.youtube.com') || clean.startsWith('youtube.com') || clean.startsWith('youtu.be')) {
      return `https://${clean}`;
    }
    if (clean.startsWith('@')) return `https://www.youtube.com/${clean}`;
    if (clean.startsWith('UC') && clean.length === 24) return `https://www.youtube.com/channel/${clean}`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}`;
  }

  const clean = (raw || '').trim();
  if (!clean) return '';
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;

  if (type === 'linkedin') {
    if (clean.includes('linkedin.com')) return `https://${clean}`;
    return `https://www.linkedin.com/in/${clean.replace(/^in\//, '')}`;
  }
  if (type === 'twitter') {
    if (clean.includes('twitter.com') || clean.includes('x.com')) return `https://${clean}`;
    return `https://x.com/${clean.replace(/^@/, '')}`;
  }

  return `https://${clean}`;
}

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const SITE_URL = 'https://www.muthaleetuthisai.com';

export function updateHeadTags({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website'
} = {}) {
  if (typeof document === 'undefined') return;

  if (title) {
    document.title = title;
    setMetaTag('name', 'title', title);
    setMetaTag('property', 'og:title', ogTitle || title);
    setMetaTag('name', 'twitter:title', ogTitle || title);
  }

  if (description) {
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:description', ogDescription || description);
    setMetaTag('name', 'twitter:description', ogDescription || description);
  }

  const effectiveCanonical = canonical || (typeof window !== 'undefined' ? `${SITE_URL}${window.location.pathname}` : SITE_URL);
  setLinkTag('canonical', effectiveCanonical);
  setMetaTag('property', 'og:url', ogUrl || effectiveCanonical);
  setMetaTag('name', 'twitter:url', ogUrl || effectiveCanonical);

  if (ogImage) {
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('name', 'twitter:image', ogImage);
  }

  if (ogType) {
    setMetaTag('property', 'og:type', ogType);
  }
}

function setMetaTag(attrName, attrVal, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrVal);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setLinkTag(rel, href) {
  if (!href) return;
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

