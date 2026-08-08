import React, { createContext, useContext, useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { translations } from '../data/translations.js';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("dhanavriksha_language") || "ta";
  });

  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = (newLang) => {
    if (newLang === language) return;
    setIsTranslating(true);
    setLanguageState(newLang);
    localStorage.setItem("dhanavriksha_language", newLang);

    setTimeout(() => {
      setIsTranslating(false);
    }, 200);
  };

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // Fallback to Tamil if key missing
        let fallback = translations['ta'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) fallback = fallback[fk];
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
