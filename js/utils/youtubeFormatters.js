/**
 * Format numbers compactly: 1200 -> "1.2K", 16400 -> "16K", 1100000 -> "1.1M"
 */
export function formatCompactViews(count, isTamil = false) {
  const num = typeof count === 'number' ? count : parseInt(count || '0', 10);
  if (isNaN(num) || num <= 0) return isTamil ? '0 பார்வைகள்' : '0 views';

  let formatted = '';
  if (num >= 1_000_000) {
    formatted = (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1_000) {
    formatted = (num / 1_000).toFixed(num >= 10_000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  } else {
    formatted = num.toString();
  }

  return isTamil ? `${formatted} பார்வைகள்` : `${formatted} views`;
}

/**
 * Relative time formatter supporting English and Tamil
 */
export function formatRelativeTime(dateStr, isTamil = false) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffHours < 1) {
    return isTamil ? 'சற்று முன்' : 'Just now';
  }
  if (diffHours < 24) {
    return isTamil ? `${diffHours} மணி நேரம் முன்` : `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return isTamil ? `${diffDays} நாட்கள் முன்` : `${diffDays}d ago`;
  }
  if (diffWeeks < 4) {
    return isTamil ? `${diffWeeks} வாரங்கள் முன்` : `${diffWeeks}w ago`;
  }
  if (diffMonths < 12) {
    return isTamil ? `${diffMonths} மாதம் முன்` : `${diffMonths} mo ago`;
  }
  return isTamil ? `${diffYears} ஆண்டுகள் முன்` : `${diffYears} yr ago`;
}

/**
 * Format duration seconds to "m:ss" or "h:mm:ss"
 */
export function formatVideoDuration(seconds) {
  const total = typeof seconds === 'number' ? seconds : parseInt(seconds || '0', 10);
  if (isNaN(total) || total <= 0) return '0:00';
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const secStr = secs < 10 ? `0${secs}` : `${secs}`;

  if (hrs > 0) {
    const minStr = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hrs}:${minStr}:${secStr}`;
  }
  return `${mins}:${secStr}`;
}
