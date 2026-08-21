async function testNoKey(handleOrUrl) {
  const clean = handleOrUrl.trim().replace(/^@/, '');
  const url = clean.startsWith('http') ? clean : `https://www.youtube.com/@${clean}`;
  
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  
  const channelIdMatch = html.match(/channel_id=(UC[A-Za-z0-9_-]{22})/) || 
                         html.match(/"browseId":"(UC[A-Za-z0-9_-]{22})"/);
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  
  const channelId = channelIdMatch ? channelIdMatch[1] : null;
  console.log(`Input: ${handleOrUrl}`);
  console.log(`  -> Channel ID: ${channelId}`);
  console.log(`  -> Title: ${titleMatch?.[1]}`);

  if (channelId) {
    const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    const xml = await rssRes.text();
    const videoMatches = [...xml.matchAll(/<yt:videoId>(.*?)<\/yt:videoId>/g)].map(m => m[1]);
    const titleMatches = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);
    console.log(`  -> Successfully fetched ${videoMatches.length} videos without API key!`);
    console.log(`  -> Sample video: "${titleMatches[1]}" (https://youtube.com/watch?v=${videoMatches[0]})`);
  }
}

testNoKey('@Mutualfundstelugu');
