import { verifyAdminRequest } from '../lib/auth-server.js';
import { translateText } from '../lib/translate.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const { title_ta, excerpt_ta, body_ta, text } = req.body || {};

    if (text) {
      const translated = await translateText(text);
      return res.status(200).json({ status: 'success', data: { translated } });
    }

    const [title_en, excerpt_en, body_en] = await Promise.all([
      title_ta ? translateText(title_ta) : Promise.resolve(''),
      excerpt_ta ? translateText(excerpt_ta) : Promise.resolve(''),
      body_ta ? translateText(body_ta) : Promise.resolve('')
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        title_en,
        excerpt_en,
        body_en
      }
    });

  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({ error: 'Translation failed', message: error.message });
  }
}
