import dotenv from 'dotenv';
dotenv.config();

// Default API keys from environment or project config
const apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || process.env.TRANSLATE_API_KEY;
console.log('Testing YouTube API with key present:', !!apiKey);

async function testSync() {
  const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE || '@budgetpadmanaban_';
  console.log(`Resolving channel handle: ${channelHandle}`);

  try {
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(channelHandle)}&key=${apiKey}`
    );
    if (!channelRes.ok) {
      console.error('Channel fetch failed:', channelRes.status, await channelRes.text());
      return;
    }
    const channelData = await channelRes.json();
    console.log('Channel response:', JSON.stringify(channelData.items?.[0]?.snippet?.title));
    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    console.log('Uploads playlist ID:', uploadsPlaylistId);

    if (uploadsPlaylistId) {
      const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${apiKey}`
      );
      const playlistData = await playlistRes.json();
      console.log(`Found ${playlistData.items?.length || 0} sample videos from playlist.`);
      if (playlistData.items?.[0]) {
        console.log('Sample video title:', playlistData.items[0].snippet?.title);
      }
    }
  } catch (err) {
    console.error('Test sync error:', err);
  }
}

testSync();
