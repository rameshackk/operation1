import fs from 'fs';

const logoBuffer = fs.readFileSync('assets/logo.png');
const b64Str = logoBuffer.toString('base64');

// 1. Write favicon.png
fs.writeFileSync('favicon.png', logoBuffer);

// 2. Write favicon.ico (copy PNG directly as modern browsers accept PNG-encoded ICOs)
fs.writeFileSync('favicon.ico', logoBuffer);

// 3. Write favicon.svg with embedded transparent data uri
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${b64Str}" x="0" y="0" width="512" height="512" preserveAspectRatio="xMidYMid meet" />
</svg>`;

fs.writeFileSync('favicon.svg', svgContent, 'utf8');

console.log('Successfully written favicon.ico, favicon.png, and favicon.svg with brand logo!');
