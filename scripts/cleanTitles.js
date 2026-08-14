import fs from 'fs';

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace any mojibake or broken strings in bundle.js
  content = content.replace(/title=\{t\('mutualFundVideos'\)[^}]+\}/g, "title={t('mutualFundVideos')}");
  content = content.replace(/title=\{t\('stockMarketVideos'\)[^}]+\}/g, "title={t('stockMarketVideos')}");
  content = content.replace(/title=\{t\('sipVideos'\)[^}]+\}/g, "title={t('sipVideos')}");
  content = content.replace(/\{t\('nav\.mutualFunds'\)\} â€” \{t\('nav\.news'\)\}/g, "{t('mutualFundNewsTitle')}");
  content = content.replace(/\{t\('nav\.stocks'\)\} â€” \{t\('nav\.news'\)\}/g, "{t('stockMarketNewsTitle')}");
  content = content.replace(/SIP & \{t\('nav\.personalFinance'\)\} â€” \{t\('nav\.news'\)\}/g, "{t('personalFinanceNewsTitle')}");
  content = content.replace(/â€”/g, "—");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned: ${filePath}`);
}

cleanFile('js/bundle.js');
cleanFile('js/pages/Home.js');
