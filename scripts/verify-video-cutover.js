import 'dotenv/config';
import { getPgPool } from '../lib/db.js';
import videosHandler from '../api/videos/index.js';

function mockRes(label) {
  return {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) {
      const n = Array.isArray(data?.data) ? data.data.length : (data?.data ? 1 : 0);
      const first = Array.isArray(data?.data) ? data.data[0] : data?.data;
      console.log(
        `${label.padEnd(38)} status=${this.statusCode} rows=${String(n).padEnd(4)}` +
        ` total=${String(data?.pagination?.total ?? '-').padEnd(5)}` +
        ` first="${(first?.titleTamil || first?.error || '-').toString().slice(0, 34)}" yt=${first?.youtubeId || '-'}`
      );
      return this;
    }
  };
}

async function run() {
  const pool = getPgPool();

  // Every category the CategoryPage exposes, via useVideos(categoryId, 'newest')
  for (const cat of ['mutual-funds', 'stocks', 'personal-finance', 'tax-saving', 'education', 'shorts']) {
    await videosHandler({ method: 'GET', query: { limit: '1000', category: cat, sort: 'newest' } }, mockRes(`category=${cat}`));
  }

  // Used by searchAllContent
  await videosHandler({ method: 'GET', query: { limit: '100', search: 'SIP' } }, mockRes('search=SIP'));
  await videosHandler({ method: 'GET', query: { limit: '100', search: 'முதலீடு' } }, mockRes('search=முதலீடு (Tamil)'));

  // Used by the publisher brand-profile fetch and getRelatedVideos
  await videosHandler({ method: 'GET', query: { limit: '48', sort: 'newest' } }, mockRes('limit=48&sort=newest'));
  await videosHandler({ method: 'GET', query: { limit: '12', sort: 'newest', category: 'all' } }, mockRes('related: limit=12&category=all'));

  // Used by getVideoById -> /api/videos/:id rewrite
  await videosHandler({ method: 'GET', query: { id: '_fvxhThYO70' } }, mockRes('detail by youtubeId'));
  await videosHandler({ method: 'GET', query: { id: 'vid-bp-001' } }, mockRes('detail by legacy id (expect 404)'));

  if (pool) await pool.end();
}

run().catch(e => { console.error(e); process.exit(1); });
