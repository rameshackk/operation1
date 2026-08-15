import fs from 'fs';

const rawVideos = JSON.parse(fs.readFileSync('./scripts/formatted882Videos.json', 'utf8'));
const bundlePath = './js/bundle.js';
let bundle = fs.readFileSync(bundlePath, 'utf8');

const startMarker = 'const rawSeedTopics = [';
const endMarker = 'const newsData = [';

const startIndex = bundle.indexOf(startMarker);
const endIndex = bundle.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers in bundle.js', { startIndex, endIndex });
  process.exit(1);
}

const replacement = `const videosData = ${JSON.stringify(rawVideos, null, 2)};\n\n`;

bundle = bundle.slice(0, startIndex) + replacement + bundle.slice(endIndex);

fs.writeFileSync(bundlePath, bundle, 'utf8');
console.log('Successfully injected 882 genuine YouTube videos into js/bundle.js!');
