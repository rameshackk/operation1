import fs from 'fs';
import path from 'path';

const bundlePath = path.join(process.cwd(), 'js', 'bundle.js');
const rawCode = fs.readFileSync(bundlePath, 'utf8');

// Ensure directories exist
const dirs = [
  'js/data',
  'js/services',
  'js/context',
  'js/components/common',
  'js/components/home',
  'js/pages'
];
dirs.forEach(d => {
  const p = path.join(process.cwd(), d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

console.log('Directories initialized.');
