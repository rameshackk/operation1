import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem("muthaleetu_theme") || "light");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setThemeState(nextTheme);
    localStorage.setItem("muthaleetu_theme", nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);

export { ThemeContext, ThemeProvider, useTheme };
