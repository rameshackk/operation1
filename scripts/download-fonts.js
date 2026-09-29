import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fontsDir = path.join(__dirname, '..', 'fonts');

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Fetch Google Fonts CSS with a User-Agent that triggers woff2
async function fetchWoff2Urls() {
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700&display=swap';
  
  const res = await fetch(cssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  
  const css = await res.text();
  console.log('Fetched Google Fonts CSS definition');
  
  // Extract @font-face blocks
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  let match;
  let fontIndex = 0;
  
  const fontFaceDeclarations = [];

  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?/);
    const weightMatch = block.match(/font-weight:\s*([0-9]+)/);
    const styleMatch = block.match(/font-style:\s*([^;]+)/);
    const urlMatch = block.match(/src:\s*url\((https:\/\/[^)]+\.woff2)\)/);
    const unicodeMatch = block.match(/unicode-range:\s*([^;]+)/);

    if (familyMatch && urlMatch) {
      const family = familyMatch[1].trim();
      const weight = weightMatch ? weightMatch[1].trim() : '400';
      const fontStyle = styleMatch ? styleMatch[1].trim() : 'normal';
      const url = urlMatch[1].trim();
      const unicodeRange = unicodeMatch ? unicodeMatch[1].trim() : null;
      
      const safeName = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight}-${fontIndex++}.woff2`;
      const filePath = path.join(fontsDir, safeName);

      console.log(`Downloading ${family} (${weight}) -> ${safeName}...`);
      const fontRes = await fetch(url);
      const buffer = Buffer.from(await fontRes.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      fontFaceDeclarations.push(`@font-face {
  font-family: '${family}';
  font-style: ${fontStyle};
  font-weight: ${weight};
  font-display: swap;
  src: url('/fonts/${safeName}') format('woff2');
  ${unicodeRange ? `unicode-range: ${unicodeRange};` : ''}
}`);
    }
  }

  const outputCssPath = path.join(fontsDir, 'fonts.css');
  fs.writeFileSync(outputCssPath, fontFaceDeclarations.join('\n\n'), 'utf8');
  console.log(`Saved ${fontIndex} fonts and generated ${outputCssPath}`);
}

fetchWoff2Urls().catch(console.error);
