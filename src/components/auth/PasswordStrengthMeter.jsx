import React from 'react';
import { useLanguage } from '../../js/context/LanguageContext.js';

export function PasswordStrengthMeter({ password = '' }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let label = isTamil ? 'பலவீனமானது' : 'Weak';
  let colorClass = 'bg-red-500';
  let widthClass = 'w-1/4';

  if (score === 2) {
    label = isTamil ? 'மிதமான பலம்' : 'Fair';
    colorClass = 'bg-amber-500';
    widthClass = 'w-2/4';
  } else if (score === 3) {
    label = isTamil ? 'நல்ல பலம்' : 'Good';
    colorClass = 'bg-yellow-500';
    widthClass = 'w-3/4';
  } else if (score >= 4) {
    label = isTamil ? 'மிகவும் பலமானது' : 'Strong';
    colorClass = 'bg-emerald-500';
    widthClass = 'w-full';
  }

  return (
    <div className="space-y-1.5 pt-1" aria-live="polite">
      <div className="flex justify-between items-center text-[11px] font-bold">
        <span className="text-slate-500 dark:text-slate-400">
          {isTamil ? 'கடவுச்சொல் பலம்' : 'Password Strength'}
        </span>
        <span className={`${score >= 3 ? 'text-emerald-500' : score === 2 ? 'text-amber-500' : 'text-red-500'}`}>
          {label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} ${widthClass} transition-all duration-300 rounded-full`} />
      </div>
    </div>
  );
}
