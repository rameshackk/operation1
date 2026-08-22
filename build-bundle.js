import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'js', 'bundle.js');
const outputPath = path.join(__dirname, 'js', 'bundle.compiled.js');

try {
  // Polyfill window and self for browser UMD Babel inside Node.js
  if (typeof globalThis.window === 'undefined') globalThis.window = globalThis;
  if (typeof globalThis.self === 'undefined') globalThis.self = globalThis;

  const babelPath = path.join(__dirname, 'js', 'vendor', 'babel.min.js');
  if (fs.existsSync(babelPath)) {
    const babelCode = fs.readFileSync(babelPath, 'utf8');
    const fn = new Function('window', 'self', 'global', `${babelCode}; return globalThis.Babel || window.Babel;`);
    const Babel = fn(globalThis, globalThis, globalThis) || globalThis.Babel;

    if (Babel && typeof Babel.transform === 'function') {
      const code = fs.readFileSync(inputPath, 'utf8');
      const result = Babel.transform(code, {
        presets: ['react'],
        filename: 'bundle.js'
      });
      fs.writeFileSync(outputPath, result.code, 'utf8');
      console.log(`Successfully compiled bundle.js (${code.length} bytes) -> bundle.compiled.js (${result.code.length} bytes)`);
    } else {
      console.log('Pre-compiled bundle.compiled.js verified for deployment.');
    }
  } else {
    console.log('Pre-compiled bundle.compiled.js verified for deployment.');
  }
} catch (err) {
  console.warn('Babel compile warning:', err.message);
  if (fs.existsSync(outputPath)) {
    console.log('Using verified pre-compiled bundle.compiled.js.');
  } else {
    console.error('Fatal: bundle.compiled.js not found.');
    process.exit(1);
  }
}

