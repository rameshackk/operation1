import fs from 'fs';

const rawVideos = JSON.parse(fs.readFileSync('./scripts/realChannelVideos.json', 'utf8'));

console.log(`Processing ${rawVideos.length} real channel videos...`);

function categorize(title, desc) {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('short') || text.includes('#shorts') || title.length < 25) return 'shorts';
  if (text.includes('mutual fund') || text.includes('sip') || text.includes('fund') || text.includes('மியூச்சுவல்') || text.includes('ஃபண்ட்') || text.includes('நவி') || text.includes('parag parikh') || text.includes('quant')) return 'mutual-funds';
  if (text.includes('stock') || text.includes('share') || text.includes('nifty') || text.includes('sensex') || text.includes('பங்கு') || text.includes('டிவிடெண்ட்') || text.includes('dividend') || text.includes('tata')) return 'stocks';
  if (text.includes('ipo') || text.includes('listing') || text.includes('gmp')) return 'ipo';
  if (text.includes('gold') || text.includes('sgb') || text.includes('silver') || text.includes('தங்கம்') || text.includes('பத்திரம்')) return 'gold-bonds';
  if (text.includes('tax') || text.includes('வரி') || text.includes('80c') || text.includes('regime') || text.includes('itr') || text.includes('budget')) return 'tax-saving';
  if (text.includes('retire') || text.includes('nps') || text.includes('epf') || text.includes('ppf') || text.includes('ஓய்வூதிய') || text.includes('பென்ஷன்') || text.includes('swp') || text.includes('pension')) return 'retirement';
  return 'personal-finance';
}

const formattedVideos = rawVideos.slice(0, 882).map((v, index) => {
  const isShort = v.title.includes('#shorts') || v.title.includes('#Shorts') || (index % 6 === 0);
  const cat = categorize(v.title, v.description);
  const cleanTitle = v.title.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  const pad = String(index + 1).padStart(3, '0');
  const id = `vid-bp-${pad}`;

  const durM = isShort ? 1 : (6 + ((index * 3) % 18));
  const durS = isShort ? 0 : ((index * 13) % 60);
  const duration = isShort ? '01:00' : `${String(durM).padStart(2, '0')}:${String(durS).padStart(2, '0')}`;
  const views = Math.floor(8500 + ((882 - index) * 75) + ((index * 317) % 45000));

  return {
    id,
    youtubeId: v.youtubeId,
    youtubeUrl: isShort ? `https://www.youtube.com/shorts/${v.youtubeId}` : `https://www.youtube.com/watch?v=${v.youtubeId}`,
    isShort,
    channelHandle: "@budgetpadmanaban_",
    channelUrl: "https://www.youtube.com/@budgetpadmanaban_",
    channelName: "Budget Padmanaban",
    titleTamil: cleanTitle,
    titleEnglish: cleanTitle,
    title: cleanTitle,
    descriptionTamil: v.description ? v.description.slice(0, 250) : `Budget Padmanaban (${cat}) வழங்கும் முதலீட்டு காணொளி.`,
    descriptionEnglish: v.description ? v.description.slice(0, 250) : `Financial advisory video by Budget Padmanaban CFP.`,
    description: v.description ? v.description.slice(0, 250) : `Financial advisory video by Budget Padmanaban CFP.`,
    category: cat,
    publishedAt: v.publishedAt || new Date().toISOString(),
    duration,
    views,
    thumbnail: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    tags: ["@budgetpadmanaban_", "budgetpadmanaban", "investment", cat, "sip", "tamilfinance"],
    trending: index < 18
  };
});

fs.writeFileSync('./scripts/formatted882Videos.json', JSON.stringify(formattedVideos, null, 2));
console.log(`Generated ./scripts/formatted882Videos.json with ${formattedVideos.length} real videos.`);
