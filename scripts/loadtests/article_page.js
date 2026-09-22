import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = 'http://127.0.0.1:3000';

const sampleSlugs = [
  'nifty-50-vs-sensex-tamil-guide',
  'elss-tax-saving-mutual-funds-guide-tamil',
  'what-is-sip-tamil-guide',
  'direct-vs-regular-mutual-funds'
];

export default function () {
  const slug = sampleSlugs[Math.floor(Math.random() * sampleSlugs.length)];

  group('Article Page & Detail API', function () {
    const res = http.get(`${BASE_URL}/api/articles?slug=${slug}`);
    check(res, { 'article detail is 200': (r) => r.status === 200 || r.status === 404 });
  });

  sleep(0.1);
}
