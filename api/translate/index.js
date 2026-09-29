import { verifyAdminOrPublisherRequest } from '../../lib/auth-server.js';
import { translateText } from '../../lib/translate.js';
import { 
  sanitizeHtml, 
  sanitizeText, 
  checkRateLimit, 
  getClientIp 
} from '../../lib/security.js';

export default async function handler(req, res) {
  const clientIp = getClientIp(req);

  // 1. Verify admin or publisher role
  const auth = await verifyAdminOrPublisherRequest(req);
  if (!auth.authorized) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const rate = checkRateLimit(clientIp, 'translate_api', 30, 60000);
  if (!rate.allowed) {
    return res.status(429).json({ error: 'Translation rate limit exceeded. Please wait a minute.' });
  }

  try {
    const { title_ta, excerpt_ta, body_ta, text } = req.body || {};
    
    if (text) {
      const translated = await translateText(sanitizeText(text, 5000));
      return res.status(200).json({ status: 'success', data: { translated } });
    }

    const [title_en, excerpt_en, body_en] = await Promise.all([
      title_ta ? translateText(sanitizeText(title_ta, 500)) : Promise.resolve(''),
      excerpt_ta ? translateText(sanitizeText(excerpt_ta, 1000)) : Promise.resolve(''),
      body_ta ? translateText(sanitizeHtml(body_ta)) : Promise.resolve('')
    ]);

    return res.status(200).json({
      status: 'success',
      data: { title_en, excerpt_en, body_en }
    });
  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({ error: 'Translation failed', message: error.message });
  }
}
