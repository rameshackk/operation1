import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
import path from 'path';

async function buildCss() {
  const css = fs.readFileSync('css/input.css', 'utf8');
  const result = await postcss([
    tailwindcss({ config: './tailwind.config.js' }),
    autoprefixer()
  ]).process(css, { from: 'css/input.css', to: 'css/app.min.css' });

  fs.writeFileSync('css/app.min.css', result.css, 'utf8');
  console.log('CSS compiled successfully! Size:', result.css.length, 'bytes');
}

buildCss().catch(console.error);
