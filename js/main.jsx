import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Early default theme initialization to guarantee Light Mode as default
try {
  if (!localStorage.getItem('muthaleetu_theme_v1_light_default')) {
    localStorage.setItem('muthaleetu_theme', 'light');
    localStorage.setItem('muthaleetu_theme_v1_light_default', 'true');
  }
  const t = localStorage.getItem('muthaleetu_theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {}

let initialData = null;
try {
  const dataEl = document.getElementById('__DATA__');
  if (dataEl && dataEl.textContent) {
    initialData = JSON.parse(dataEl.textContent);
  }
} catch (e) {}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App initialData={initialData} />);
}
