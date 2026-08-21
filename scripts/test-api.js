import 'dotenv/config';
import { getPgPool } from '../lib/db.js';
import videosHandler from '../api/videos/index.js';

async function test() {
  const pool = getPgPool();
  console.log('--- Testing /api/videos?preview=1 ---');
  let previewData = null;
  const mockPreviewRes = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) {
      previewData = data;
      console.log('Preview status code:', this.statusCode);
      console.log('Preview items returned:', data?.data?.length);
      console.log('First preview item:', data?.data?.[0]?.titleTamil, '|', data?.data?.[0]?.youtubeId);
      return this;
    }
  };
  await videosHandler({ method: 'GET', query: { preview: '1', limit: '8' } }, mockPreviewRes);

  console.log('\n--- Testing /api/videos (catalog list) ---');
  let listData = null;
  const mockListRes = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) {
      listData = data;
      console.log('Catalog list status code:', this.statusCode);
      console.log('Catalog items returned:', data?.data?.length, 'Total in DB:', data?.pagination?.total);
      console.log('First catalog item:', data?.data?.[0]?.titleTamil, '|', data?.data?.[0]?.youtubeId);
      return this;
    }
  };
  await videosHandler({ method: 'GET', query: { limit: '100', category: 'all', sort: 'newest' } }, mockListRes);

  if (pool) await pool.end();
}

test().catch(console.error);
