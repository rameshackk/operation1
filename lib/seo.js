/**
 * SEO, Meta Tags, Open Graph and Schema.org JSON-LD Generation Engine
 * Supports bilingual Tamil and English SEO optimizations.
 */

export const BASE_URL = 'https://muthaleetuthisai-rho.vercel.app';
export const SITE_NAME_TA = 'முதலீட்டு திசை';
export const SITE_NAME_EN = 'Muthaleetu Thisai';
export const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/logo.png`;
export const OFFICIAL_YOUTUBE_CHANNEL = 'https://www.youtube.com/@budgetpadmanaban_';

/**
 * Generates an SEO-friendly URL slug from text.
 */
export function slugify(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

/**
 * Converts seconds into ISO 8601 duration format (e.g., 720s -> PT12M0S).
 */
export function formatIsoDuration(durationSeconds = 0) {
  const totalSec = Math.max(0, parseInt(durationSeconds, 10) || 0);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  let result = 'PT';
  if (hours > 0) result += `${hours}H`;
  if (minutes > 0 || hours > 0) result += `${minutes}M`;
  result += `${seconds}S`;
  return result;
}

/**
 * Generates Schema.org Organization and WebSite schemas for the homepage.
 */
export function generateOrganizationSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Muthaleetu Thisai - Budget Padmanaban',
      alternateName: 'முதலீட்டு திசை',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/logo.png`,
        width: 512,
        height: 512
      },
      sameAs: [
        OFFICIAL_YOUTUBE_CHANNEL,
        'https://x.com/budgetpadmanaban',
        'https://www.linkedin.com/in/budgetpadmanaban'
      ],
      description: 'Tamil & English Mutual Fund, Stock Market, Personal Finance & Investment Guidance Platform.'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'Muthaleetu Thisai',
      url: BASE_URL,
      inLanguage: ['ta', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/videos?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  ];
}

/**
 * Generates Schema.org VideoObject schema for individual video pages.
 */
export function generateVideoSchema(video, canonicalUrl) {
  if (!video) return null;

  const title = video.titleTamil || video.title || video.titleEnglish || 'Muthaleetu Thisai Video';
  const description = video.descriptionTamil || video.description || video.descriptionEnglish || title;
  const thumbnail = video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  const uploadDate = video.publishedAt || new Date().toISOString();
  const duration = formatIsoDuration(video.durationSeconds || 720);
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description: description.slice(0, 300),
    thumbnailUrl: [thumbnail],
    uploadDate: uploadDate,
    duration: duration,
    embedUrl: embedUrl,
    contentUrl: canonicalUrl || `${BASE_URL}/videos/${video.slug || video.youtubeId}`,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: video.views || 100
    },
    author: {
      '@type': 'Person',
      name: video.channelName || 'Budget Padmanaban',
      url: video.channelUrl || OFFICIAL_YOUTUBE_CHANNEL
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muthaleetu Thisai',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/logo.png`
      }
    }
  };
}

/**
 * Generates Schema.org NewsArticle schema for individual article pages.
 */
export function generateArticleSchema(article, canonicalUrl) {
  if (!article) return null;

  const title = article.titleTamil || article.title_ta || article.titleEnglish || article.title_en || 'Article';
  const excerpt = article.excerptTamil || article.excerpt_ta || article.excerptEnglish || article.excerpt_en || title;
  const image = article.coverImageUrl || article.cover_image_url || DEFAULT_OG_IMAGE;
  const publishedAt = article.publishedAt || article.published_at || article.createdAt || article.created_at || new Date().toISOString();
  const updatedAt = article.updatedAt || article.updated_at || publishedAt;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl || `${BASE_URL}/articles/${article.slug}`
    },
    headline: title,
    description: excerpt.slice(0, 300),
    image: [image],
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      '@type': 'Person',
      name: article.authorName || 'Budget Padmanaban',
      url: `${BASE_URL}/professionals/budget-padmanaban`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muthaleetu Thisai',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/logo.png`
      }
    },
    inLanguage: article.title_ta ? 'ta' : 'en'
  };
}

/**
 * Generates Schema.org BreadcrumbList for categories and detail pages.
 */
export function generateBreadcrumbSchema(items = []) {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };
}

/**
 * Generates Schema.org Person & ProfilePage schema for financial advisor/publisher pages.
 */
export function generateProfileSchema(publisher, canonicalUrl) {
  if (!publisher) return null;

  const name = publisher.displayName || publisher.display_name || 'Financial Specialist';
  const bio = publisher.bio || publisher.bio_ta || 'AMFI Registered Mutual Fund Distributor & Advisor';
  const avatar = publisher.avatarUrl || publisher.avatar_url || DEFAULT_OG_IMAGE;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: name,
      description: bio.slice(0, 300),
      image: avatar,
      jobTitle: publisher.title || 'Mutual Fund Specialist',
      url: canonicalUrl || `${BASE_URL}/professionals/${publisher.id}`,
      sameAs: [
        publisher.linkedinUrl || publisher.linkedin_url,
        publisher.twitterUrl || publisher.twitter_url,
        publisher.youtubeUrl || publisher.youtube_url,
        publisher.websiteUrl || publisher.website_url
      ].filter(Boolean)
    }
  };
}
