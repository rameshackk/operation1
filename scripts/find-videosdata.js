import fs from 'fs';
const content = fs.readFileSync('./js/bundle.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('videosData') && idx > 25000) {
    console.log(`Line ${idx + 1}: ${line.trim().slice(0, 100)}`);
  }
});
