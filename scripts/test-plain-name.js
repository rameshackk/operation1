import 'dotenv/config';
import { resolvePublisherYouTubeInput } from '../lib/youtube.js';

async function testPlainNames() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  console.log('Testing channel resolution by plain names:');

  const names = ['Budget Padmanaban', 'Mutual Funds Telugu', 'Finance With Sharan'];
  for (const name of names) {
    try {
      const res = await resolvePublisherYouTubeInput(name, apiKey);
      console.log(`\nInput: "${name}"`);
      console.log(`   - Found Channel Title: ${res?.channelTitle}`);
      console.log(`   - Channel ID: ${res?.channelId}`);
      console.log(`   - Uploads Playlist: ${res?.uploadsPlaylistId}`);
    } catch (err) {
      console.error(`Failed for "${name}":`, err.message);
    }
  }
}

testPlainNames();
