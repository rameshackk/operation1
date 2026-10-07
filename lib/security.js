/**
 * Production Security Utilities for Muthaleetu Thisai
 * Handles rate limiting, input validation, HTML sanitization, and URL security.
 */

// ============================================================
// 1. IN-MEMORY SLIDING WINDOW RATE LIMITER (Serverless Compatible)
// ============================================================
const rateLimitMap = new Map();
const CLEANUP_INTERVAL_MS = 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitMap.entries()) {
    if (record.resetAt <= now) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Checks if a request exceeds rate limits.
 * @param {string} identifier - Client IP or user ID
 * @param {string} action - API endpoint or action tag (e.g. 'comments', 'auth', 'general')
 * @param {number} maxRequests - Max allowed requests within window (default 60)
 * @param {number} windowMs - Time window in milliseconds (default 60000ms = 1 min)
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function checkRateLimit(identifier, action = 'general', maxRequests = 60, windowMs = 60000) {
  cleanupExpiredEntries();

  const key = `${action}:${identifier || 'unknown'}`;
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || record.resetAt <= now) {
    const newRecord = { count: 1, resetAt: now + windowMs };
    rateLimitMap.set(key, newRecord);
    return { allowed: true, remaining: maxRequests - 1, resetAt: newRecord.resetAt };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

/**
 * Helper to extract client IP address from serverless request headers.
 */
export function getClientIp(req) {
  if (!req || !req.headers) return '127.0.0.1';
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

// ============================================================
// 2. INPUT VALIDATION & SANITIZATION
// ============================================================

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAFE_CATEGORY_SET = new Set([
  'all',
  'mutual-fund',
  'mutual-funds',
  'stock-market',
  'markets',
  'personal-finance',
  'financial-education',
  'regulatory',
  'general'
]);

export function isValidUuid(str) {
  return typeof str === 'string' && UUID_REGEX.test(str.trim());
}

export function isValidSlug(str) {
  return typeof str === 'string' && str.length <= 255 && SLUG_REGEX.test(str.trim());
}

export function isValidEmail(str) {
  return typeof str === 'string' && str.length <= 255 && EMAIL_REGEX.test(str.trim());
}

export function sanitizeSlug(str) {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 200);
}

export function sanitizeText(str, maxLength = 2000) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export function isValidCategory(cat) {
  if (!cat) return false;
  return SAFE_CATEGORY_SET.has(cat.toLowerCase().trim());
}

export function parseSafePagination(query, defaultLimit = 20, maxLimit = 100) {
  const page = Math.max(1, parseInt(query?.page, 10) || 1);
  const requestedLimit = parseInt(query?.limit, 10) || defaultLimit;
  const limit = Math.min(maxLimit, Math.max(1, requestedLimit));
  return { page, limit, offset: (page - 1) * limit };
}

// ============================================================
// 3. SAFE URL & PROTOCOL VALIDATION
// ============================================================

export function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim();
  if (!clean) return false;

  const lower = clean.toLowerCase();

  // Allow standard image data URLs safely (png, jpeg, jpg, webp, gif, svg)
  if (/^data:image\/(?:png|jpe?g|webp|gif|svg\+xml);(?:base64,[A-Za-z0-9+/=]+|utf-8,.*)$/i.test(clean)) {
    return true;
  }

  // Block dangerous schemes like javascript:, data:, vbscript:
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.includes('<script') ||
    lower.includes('%3cscript')
  ) {
    return false;
  }

  // Allow relative URLs starting with / (e.g. /assets/cover.jpg)
  if (clean.startsWith('/') && !clean.startsWith('//')) {
    return true;
  }

  // Allow only http: and https: protocols
  try {
    const parsed = new URL(clean);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function sanitizeSafeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();
  return isSafeUrl(clean) ? clean : '';
}

// ============================================================
// 4. ROBUST HTML SANITIZER (Prevents XSS in Rich Text Articles & Comments)
// ============================================================

/**
 * Server-side HTML sanitizer for rich text article content.
 * Strips script tags, iframes, inline event handlers, and dangerous javascript:/data: links,
 * while safely preserving valid embedded images and media.
 */
export function sanitizeHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  let html = rawHtml;

  // 1. Remove script, iframe, object, embed, form tags and their contents
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  html = html.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  html = html.replace(/<embed\b[^>]*>/gi, '');
  html = html.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');

  // 2. Remove all inline event handlers (onload, onerror, onclick, onmouseover, etc.)
  html = html.replace(/\s+on[a-z0-9]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Remove dangerous protocols from href and src attributes while preserving safe data:image/ URLs and http/https/relative URLs
  html = html.replace(/\s+(href|src)\s*=\s*(['"])(.*?)\2/gi, (match, attr, quote, val) => {
    const cleanVal = (val || '').trim();
    const lowerVal = cleanVal.toLowerCase();
    
    // For src attributes: safely allow base64 image data URLs (e.g. data:image/png;base64,... or data:image/jpeg;base64,...)
    if (attr.toLowerCase() === 'src' && lowerVal.startsWith('data:image/')) {
      if (/^data:image\/(?:png|jpe?g|webp|gif|svg\+xml);(?:base64,[A-Za-z0-9+/=]+|utf-8,.*)$/i.test(cleanVal)) {
        return ` ${attr}="${cleanVal}"`;
      }
    }

    // Block dangerous schemes
    if (
      lowerVal.startsWith('javascript:') ||
      lowerVal.startsWith('vbscript:') ||
      lowerVal.startsWith('data:') ||
      lowerVal.includes('<script') ||
      lowerVal.includes('%3cscript')
    ) {
      return ` ${attr}="#"`;
    }

    return ` ${attr}="${cleanVal}"`;
  });

  // 4. Ensure target="_blank" links include rel="noopener noreferrer"
  html = html.replace(/<a\s+([^>]*target=['"]_blank['"][^>]*)>/gi, (match) => {
    if (!match.includes('rel=')) {
      return match.replace('<a ', '<a rel="noopener noreferrer" ');
    }
    return match;
  });

  return html;
}

/**
 * HTML entity encoder for untrusted plain-text user inputs (comments, usernames).
 */
export function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// 5. SECURITY LOGGING & MONITORING
// ============================================================

/**
 * Safely logs security events server-side without leaking sensitive tokens or passwords.
 */
export function logSecurityEvent(type, metadata = {}) {
  const sanitizedMeta = { ...metadata };
  const sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'key', 'accessToken', 'refreshToken'];

  for (const key of Object.keys(sanitizedMeta)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
      sanitizedMeta[key] = '[REDACTED]';
    }
  }

  console.warn(`[SECURITY EVENT][${type}]`, JSON.stringify({
    timestamp: new Date().toISOString(),
    type,
    ...sanitizedMeta
  }));
}
