import { getArticleBySlug } from '../../lib/db.js';
import { synthesizeSpeech, cleanTextForSpeech } from '../../lib/tts.js';

export default async function handler(req, res) {
  const { slug, lang = 'ta', text } = req.query || {};
  const isTa = lang === 'ta';

  try {
    let textToSynthesize = '';

    if (text) {
      textToSynthesize = text.toString();
    } else if (slug) {
      const article = await getArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      const title = isTa ? (article.titleTamil || article.title_ta || '') : (article.titleEnglish || article.title_en || '');
      const excerpt = isTa ? (article.excerptTamil || article.excerpt_ta || '') : (article.excerptEnglish || article.excerpt_en || '');
      const rawBody = isTa ? (article.bodyTamil || article.body_ta || '') : (article.bodyEnglish || article.body_en || '');
      const body = cleanTextForSpeech(rawBody);

      textToSynthesize = `${title}. ${excerpt ? excerpt + '.' : ''} ${body}`.trim();
    }

    if (!textToSynthesize) {
      return res.status(400).json({ error: 'No text content available to synthesize' });
    }

    const audioBuffer = await synthesizeSpeech(textToSynthesize, isTa ? 'ta' : 'en');

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.setHeader('Accept-Ranges', 'bytes');
    return res.status(200).end(audioBuffer);
  } catch (error) {
    console.error('TTS API streaming error:', error);
    return res.status(500).json({ error: 'Failed to synthesize speech', message: error.message });
  }
}
