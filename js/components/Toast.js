import React, { useEffect } from 'https://esm.sh/react@18.2.0';

export function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-amber-500/40 flex items-center gap-2 animate-bounce">
      <span className="text-amber-400">✓</span>
      <span>{message}</span>
    </div>
  );
}
