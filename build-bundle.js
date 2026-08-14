import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'js', 'bundle.js');
const outputPath = path.join(__dirname, 'js', 'bundle.compiled.js');

const code = fs.readFileSync(inputPath, 'utf8');

import './js/vendor/babel.min.js';

try {
  const Babel = globalThis.Babel;
  if (!Babel) {
    throw new Error('Babel global is undefined');
  }

  const result = Babel.transform(code, {
    presets: ['react'],
    filename: 'bundle.js'
  });

  fs.writeFileSync(outputPath, result.code, 'utf8');
  console.log(`Successfully compiled bundle.js (${code.length} bytes) -> bundle.compiled.js (${result.code.length} bytes)`);
} catch (err) {
  console.error('Babel compilation failed:', err);
  process.exit(1);
}
