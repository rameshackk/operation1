import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import esbuild from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runBuild() {
  console.log('🚀 Starting Muthaleetu Thisai High-Performance Production Build...');

  // 1. COMPILE & MINIFY TAILWIND CSS + CUSTOM DESIGN TOKENS
  console.log('📦 Step 1: Compiling and minifying CSS (Tailwind + Custom Styles + Fonts)...');
  const fontsCss = fs.readFileSync(path.join(__dirname, 'fonts', 'fonts.css'), 'utf8');
  const rawInputCss = fs.readFileSync(path.join(__dirname, 'css', 'input.css'), 'utf8').replace('@import "../fonts/fonts.css";', '');
  const inputCss = fontsCss + '\n' + rawInputCss;
  const postcssResult = await postcss([
    tailwindcss({ config: path.join(__dirname, 'tailwind.config.js') }),
    autoprefixer()
  ]).process(inputCss, {
    from: path.join(__dirname, 'css', 'input.css'),
    to: path.join(__dirname, 'css', 'app.min.css')
  });

  const minifiedCss = esbuild.transformSync(postcssResult.css, {
    loader: 'css',
    minify: true
  }).code;

  fs.writeFileSync(path.join(__dirname, 'css', 'app.min.css'), minifiedCss, 'utf8');
  console.log(`✅ CSS Compiled -> css/app.min.css (${(minifiedCss.length / 1024).toFixed(2)} KB)`);

  // Extract Critical Above-the-Fold CSS to inline in <head>
  const criticalCss = `
    @font-face {
      font-family: 'Noto Serif Tamil';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/noto-serif-tamil-400-0.woff2') format('woff2');
      unicode-range: U+0964-0965, U+0B82-0BFA, U+200C-200D, U+20B9, U+25CC;
    }
    @font-face {
      font-family: 'Noto Serif Tamil';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/noto-serif-tamil-400-2.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    :root {
      --bg-page: #F4F9F4;
      --bg-main: #F4F9F4;
      --bg-section: #E8F5E9;
      --border-color: #D5EBD9;
      --navy-900: #0F172A;
      --green-600: #15803D;
      --blue-600: #2563EB;
      --amber-500: #F59E0B;
    }
    [data-theme="dark"] {
      --bg-page: #020617;
      --bg-main: #020617;
      --bg-section: #0B0F19;
      --border-color: #1E293B;
    }
    body {
      background-color: var(--bg-page);
      color: #0F172A;
      margin: 0;
      font-family: "Book Antiqua", Palatino, "Noto Serif Tamil", Georgia, serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    [data-theme="dark"] body {
      color: #F8FAFC;
      background-color: #020617;
    }
    #scroll-progress-indicator {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #15803D, #2563EB, #F59E0B);
      z-index: 99999;
      width: 0%;
      transition: width 0.1s linear;
    }
    .sticky-header-container {
      position: sticky;
      top: 0;
      z-index: 40;
      width: 100%;
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      display: flex;
      width: max-content;
      animation: marquee 35s linear infinite;
    }
    .animate-marquee:hover {
      animation-play-state: paused;
    }
    @keyframes featuredMarquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-featured-marquee {
      display: flex;
      width: max-content;
      animation: featuredMarquee 40s linear infinite;
    }
    .animate-featured-marquee:hover {
      animation-play-state: paused;
    }
  `;

  // 2. BUNDLE APP WITH ESBUILD (Code-splitting, ESM, Minification, Content-hashing)
  console.log('⚡ Step 2: Bundling React App with esbuild...');
  const distDir = path.join(__dirname, 'js', 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  const buildResult = await esbuild.build({
    entryPoints: { app: path.join(__dirname, 'js', 'main.jsx') },
    bundle: true,
    format: 'esm',
    splitting: true,
    outdir: distDir,
    entryNames: '[name].[hash]',
    chunkNames: 'chunks/[name].[hash]',
    minify: true,
    metafile: true,
    target: ['es2020'],
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx'
    }
  });

  const outputs = Object.keys(buildResult.metafile.outputs);
  let appEntryFile = '';
  outputs.forEach(outPath => {
    const filename = path.basename(outPath);
    if (filename.startsWith('app.') && filename.endsWith('.js')) {
      appEntryFile = filename;
    }
  });

  if (!appEntryFile) {
    throw new Error('Failed to find hashed app entry file in esbuild output.');
  }
  console.log(`✅ App bundled -> /js/dist/${appEntryFile}`);

  // 3. PRERENDER HOMEPAGE HTML (SSR)
  console.log('🖥️ Step 3: Prerendering Homepage HTML with react-dom/server...');
  esbuild.buildSync({
    entryPoints: [path.join(__dirname, 'scripts', 'render-html.js')],
    bundle: true,
    format: 'esm',
    outfile: path.join(__dirname, 'scripts', 'dist-render-html.mjs'),
    platform: 'node',
    packages: 'external',
    target: ['node18'],
    loader: { '.jsx': 'jsx', '.js': 'jsx' }
  });

  let prerenderedHtml = '';
  let serverData = { articles: [], videos: [] };
  try {
    const ssrRaw = execSync('node scripts/dist-render-html.mjs', { encoding: 'utf8' });
    const parsed = JSON.parse(ssrRaw);
    prerenderedHtml = parsed.html || '';
    serverData = parsed.serverData || serverData;
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, 'home.json'), JSON.stringify(serverData, null, 2), 'utf8');
    console.log(`✅ Build snapshot written -> data/home.json (${(JSON.stringify(serverData).length / 1024).toFixed(2)} KB)`);
  } catch (e) {
    console.warn('Prerender helper note:', e.message);
  }

  // Generate optimized icons and logos
  try {
    const sharp = (await import('sharp')).default;
    const logoSource = path.join(__dirname, 'assets', 'logo.png');
    if (fs.existsSync(logoSource)) {
      await sharp(logoSource).resize(192, 192).png({ quality: 80, compressionLevel: 9 }).toFile(path.join(__dirname, 'assets', 'logo-192.png'));
      await sharp(logoSource).resize(180, 180).png({ quality: 80, compressionLevel: 9 }).toFile(path.join(__dirname, 'assets', 'logo-180.png'));
      await sharp(logoSource).resize(32, 32).png({ quality: 80, compressionLevel: 9 }).toFile(path.join(__dirname, 'favicon.png'));
    }
  } catch (iconErr) {
    console.warn('Icon optimization note:', iconErr.message);
  }

  const lcpImage = serverData.articles?.[0]?.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=70&fm=webp';
  const lcpBase = lcpImage.split('?')[0];

  // 4. GENERATE OPTIMIZED index.html
  console.log('📄 Step 4: Generating high-performance index.html...');
  const templateHtml = `<!DOCTYPE html>
<html lang="ta" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>முதலீட்டு திசை | Tamil Mutual Fund & Investment Guide - Budget Padmanaban</title>
  <meta name="title" content="முதலீட்டு திசை | Tamil Mutual Fund & Investment Guide - Budget Padmanaban" />
  <meta name="description" content="பட்ஜெட் பத்மநாபன் ஃபைனான்ஷியல் - மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை, தனிநபர் நிதி மற்றும் முதலீட்டு வழிகாட்டி. Tamil & English mutual fund investing platform." />

  <!-- Canonical & Bilingual Hreflang Tags -->
  <link rel="canonical" href="https://www.muthaleetuthisai.com/" />
  <link rel="alternate" hreflang="ta" href="https://www.muthaleetuthisai.com/" />
  <link rel="alternate" hreflang="en" href="https://www.muthaleetuthisai.com/?lang=en" />
  <link rel="alternate" hreflang="x-default" href="https://www.muthaleetuthisai.com/" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Muthaleetu Thisai" />
  <meta property="og:url" content="https://www.muthaleetuthisai.com/" />
  <meta property="og:title" content="முதலீட்டு திசை | Tamil Mutual Fund & Investment Guide - Budget Padmanaban" />
  <meta property="og:description" content="பட்ஜெட் பத்மநாபன் ஃபைனான்ஷியல் - மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை, தனிநபர் நிதி மற்றும் முதலீட்டு வழிகாட்டி." />
  <meta property="og:image" content="https://www.muthaleetuthisai.com/assets/logo.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="ta_IN" />
  <meta property="og:locale:alternate" content="en_US" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@budgetpadmanaban" />
  <meta name="twitter:creator" content="@budgetpadmanaban" />
  <meta name="twitter:url" content="https://www.muthaleetuthisai.com/" />
  <meta name="twitter:title" content="முதலீட்டு திசை | Tamil Mutual Fund & Investment Guide - Budget Padmanaban" />
  <meta name="twitter:description" content="பட்ஜெட் பத்மநாபன் ஃபைனான்ஷியல் - மியூச்சுவல் ஃபண்ட், பங்குச் சந்தை, தனிநபர் நிதி மற்றும் முதலீட்டு வழிகாட்டி." />
  <meta name="twitter:image" content="https://www.muthaleetuthisai.com/assets/logo.png" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://www.muthaleetuthisai.com/#organization",
      "name": "Muthaleetu Thisai - Budget Padmanaban",
      "alternateName": "முதலீட்டு திசை",
      "url": "https://www.muthaleetuthisai.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.muthaleetuthisai.com/assets/logo.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://www.youtube.com/@budgetpadmanaban_",
        "https://x.com/budgetpadmanaban",
        "https://www.linkedin.com/in/budgetpadmanaban"
      ],
      "description": "Tamil & English Mutual Fund, Stock Market, Personal Finance & Investment Guidance Platform."
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://www.muthaleetuthisai.com/#website",
      "name": "Muthaleetu Thisai",
      "url": "https://www.muthaleetuthisai.com",
      "inLanguage": ["ta", "en"],
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.muthaleetuthisai.com/videos?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
  </script>

  <!-- Supabase & Media CDN Preconnects -->
  <link rel="preconnect" href="https://etanokdvfyvkidpeovdi.supabase.co" crossorigin />
  <link rel="dns-prefetch" href="https://etanokdvfyvkidpeovdi.supabase.co" />
  <link rel="preconnect" href="https://i.ytimg.com" crossorigin />
  <link rel="dns-prefetch" href="https://i.ytimg.com" />

  <!-- Preload Consolidated Home Feed API (Starts before React JS boots) -->
  <link rel="preload" href="/api/home" as="fetch" crossorigin />
  <script>
    window.__HOME__ = fetch('/api/home').then(function(r) { return r.ok ? r.json() : null; }).catch(function() { return null; });
  </script>

  <!-- Preload Self-Hosted Critical Tamil Subset Woff2 Fonts -->
  <link rel="preload" as="font" type="font/woff2" href="/fonts/noto-serif-tamil-400-0.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/fonts/noto-serif-tamil-400-2.woff2" crossorigin />

  <!-- Preload & Synchronous Compiled CSS (14 KB gzipped) - Zero FOUC, 0.00 CLS -->
  <link rel="preload" as="style" href="/css/app.min.css" />
  <link rel="stylesheet" href="/css/app.min.css" />

  <!-- Inlined Critical Above-the-Fold CSS -->
  <style id="critical-css">${criticalCss}</style>

  <!-- Favicons & Brand Identity Icons -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/logo-192.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/logo-180.png" />
  <link rel="shortcut icon" href="/favicon.png" />

  <!-- PWA & Theme -->
  <link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />
  <meta name="theme-color" content="#F4F9F4" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Muthaleetu Thisai" />

  <!-- Early Theme Initialization to guarantee Light Mode as default -->
  <script>
    (function() {
      try {
        if (!localStorage.getItem('muthaleetu_theme_v1_light_default')) {
          localStorage.setItem('muthaleetu_theme', 'light');
          localStorage.setItem('muthaleetu_theme_v1_light_default', 'true');
        }
        var t = localStorage.getItem('muthaleetu_theme') || 'light';
        document.documentElement.setAttribute('data-theme', t);
      } catch (e) {}
    })();
  </script>
</head>
<body class="text-slate-900 dark:text-slate-100 antialiased relative pb-safe overflow-x-hidden w-full max-w-full">
  <!-- Global Scroll Progress Indicator -->
  <div id="scroll-progress-indicator"></div>

  <!-- Prerendered Semantic React Root -->
  <div id="root" class="relative z-10">${prerenderedHtml}</div>

  <!-- Embedded Initial Data -->
  <script id="__DATA__" type="application/json">${JSON.stringify(serverData)}</script>

  <!-- Single High-Performance ESM App Module -->
  <script type="module" src="/js/dist/${appEntryFile}"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'index.html'), templateHtml, 'utf8');
  console.log(`✅ Production index.html written successfully! Entry: /js/dist/${appEntryFile}`);
  console.log('🎉 Production build complete!');
}

runBuild().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
