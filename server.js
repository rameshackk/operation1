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

    // Helper to parse JSON body for POST/PUT/PATCH/DELETE
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString();
      if (rawBody) {
        try {
          req.body = JSON.parse(rawBody);
        } catch (e) {
          req.body = rawBody;
        }
      } else {
        req.body = {};
      }
    }

    try {
      // 1.1 Articles API
      if (reqPath === '/api/articles' || reqPath === '/api/articles/index.js') {
        const mod = await import(`./api/articles/index.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      const matchArticleSlug = reqPath.match(/^\/api\/articles\/([^/?#]+)$/);
      if (matchArticleSlug && matchArticleSlug[1] !== 'index.js') {
        req.query.slug = decodeURIComponent(matchArticleSlug[1]);
        const mod = await import(`./api/articles/[slug].js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      // 1.2 Admin Articles API
      if (reqPath === '/api/admin/articles' || reqPath === '/api/admin/articles/index.js') {
        const mod = await import(`./api/admin/articles/index.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      const matchAdminArticleId = reqPath.match(/^\/api\/admin\/articles\/([^/?#]+)$/);
      if (matchAdminArticleId && matchAdminArticleId[1] !== 'index.js') {
        req.query.id = decodeURIComponent(matchAdminArticleId[1]);
        const mod = await import(`./api/admin/articles/index.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      // 1.3 Admin Publishers API
      if (reqPath === '/api/admin/publishers' || reqPath === '/api/admin/publishers/index.js') {
        const mod = await import(`./api/admin/publishers/index.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      const matchAdminPublisherId = reqPath.match(/^\/api\/admin\/publishers\/([^/?#]+)$/);
      if (matchAdminPublisherId && matchAdminPublisherId[1] !== 'index.js') {
        req.query.id = decodeURIComponent(matchAdminPublisherId[1]);
        const mod = await import(`./api/admin/publishers/index.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      // 1.4 Publisher Onboarding API
      if (reqPath === '/api/publisher/onboarding' || reqPath === '/api/publisher/onboarding.js') {
        const mod = await import(`./api/publisher/onboarding.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      // 1.5 Translation API
      if (reqPath === '/api/translate' || reqPath === '/api/translate.js') {
        const mod = await import(`./api/translate.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      // 1.6 Admin Metrics & Videos
      if (reqPath === '/api/admin/metrics' || reqPath === '/api/admin/metrics.js') {
        const mod = await import(`./api/admin/metrics.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      if (reqPath === '/api/admin/videos' || reqPath === '/api/admin/videos.js') {
        const mod = await import(`./api/admin/videos.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      // 1.7 Videos API
      if (reqPath === '/api/videos/trending-preview' || reqPath === '/api/videos/trending-preview.js') {
        req.query.preview = '1';
        const mod = await import(`./api/videos/index.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      if (reqPath === '/api/videos' || reqPath === '/api/videos/index.js') {
        const mod = await import(`./api/videos/index.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      const matchVideoId = reqPath.match(/^\/api\/videos\/([^/?#]+)$/);
      if (matchVideoId && matchVideoId[1] !== 'trending-preview') {
        req.query.id = matchVideoId[1];
        const mod = await import(`./api/videos/index.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      // 1.8 Cron API
      if (reqPath === '/api/cron/fetch-videos' || reqPath === '/api/cron/fetch-videos.js') {
        const mod = await import(`./api/cron/fetch-videos.js?t=${Date.now()}`);
        return mod.default(req, res);
      }

      return res.status(404).json({ error: `API route not found: ${reqPath}` });
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
