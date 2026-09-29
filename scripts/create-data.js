import fs from 'fs';
import path from 'path';

const bundlePath = path.join(process.cwd(), 'js', 'bundle.js');
const rawCode = fs.readFileSync(bundlePath, 'utf8');
const lines = rawCode.split('\n');

function getLines(start, end) {
  return lines.slice(start - 1, end).join('\n');
}

// 1. Data Layer: translations, mock data, helper constants
const dataContent = `// Core constants and translations
${getLines(3, 6)}
${getLines(15, 419)}
`;
fs.writeFileSync(path.join(process.cwd(), 'js', 'data', 'translations.js'), `
${dataContent}

export {
  OFFICIAL_CHANNEL_URL,
  OFFICIAL_CHANNEL_HANDLE,
  OFFICIAL_CHANNEL_NAME,
  translations,
  CHANNEL_URL,
  CHANNEL_HANDLE,
  CHANNEL_NAME,
  CHANNEL_ID,
  videosData,
  newsData,
  professionalsData,
  marketSnapshotData
};
`, 'utf8');

console.log('js/data/translations.js created.');
