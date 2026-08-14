import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useLanguage } from '../../context/LanguageContext.js';

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder = '••••••••',
  required = true,
  error,
  describedBy
}) {
  const { language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const isTamil = language === 'ta';

  const toggleAriaLabel = showPassword
    ? (isTamil ? 'கடவுச்சொல்லை மறைக்க' : 'Hide password')
    : (isTamil ? 'கடவுச்சொல்லைக் காட்ட' : 'Show password');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`w-full h-11 px-4 pr-11 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all ${
            error ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-300 dark:border-slate-700'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={toggleAriaLabel}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold p-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      {error && (
        <p id={describedBy} className="text-[11px] font-bold text-red-500 dark:text-red-400 animate-fadeIn" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
