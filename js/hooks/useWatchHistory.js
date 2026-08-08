import { useState, useEffect } from 'https://esm.sh/react@18.2.0';

const HISTORY_KEY = "dhanavriksha_watch_history";

export function useWatchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const addToHistory = (video) => {
    if (!video || !video.id) return;
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== video.id);
      const updated = [{ ...video, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return { history, addToHistory, clearHistory };
}
