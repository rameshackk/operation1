import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  // Parse URL & Query
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const reqPath = decodeURI(urlObj.pathname);

  // 1. API Route Handling (emulate Vercel Serverless Functions)
  if (reqPath.startsWith('/api/')) {
    // Helper to polyfill res.status().json() like Express/Vercel
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(data));
      return res;
    };
    req.query = Object.fromEntries(urlObj.searchParams.entries());

    try {
      if (reqPath === '/api/videos/trending-preview' || reqPath === '/api/videos/trending-preview.js') {
        const mod = await import(`./api/videos/trending-preview.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      if (reqPath === '/api/videos' || reqPath === '/api/videos/index.js') {
        const mod = await import(`./api/videos/index.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      const matchId = reqPath.match(/^\/api\/videos\/([^/?#]+)$/);
      if (matchId && matchId[1] !== 'trending-preview') {
        req.query.id = matchId[1];
        const mod = await import(`./api/videos/[id].js?t=${Date.now()}`);
        return mod.default(req, res);
      }
    } catch (apiErr) {
      console.error('API execution error:', apiErr);
      return res.status(500).json({ status: 'error', message: apiErr.message });
    }
  }

  // 2. Static File Serving
  let filePathTarget = reqPath === '/' || reqPath === '' ? '/index.html' : reqPath;
  const safePath = path.normalize(filePathTarget).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Muthaleetu Thisai server running at http://localhost:${PORT}/`);
});
