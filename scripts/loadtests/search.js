import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = 'http://127.0.0.1:3000';
const searchTerms = ['mutual', 'tax', 'nifty', 'sip', 'fund', 'elss', 'gold', 'sensex', 'budget'];

export default function () {
  const query = searchTerms[Math.floor(Math.random() * searchTerms.length)];

  group('Search API Queries', function () {
    const resA = http.get(`${BASE_URL}/api/articles?search=${encodeURIComponent(query)}&limit=20`);
    check(resA, { 'articles search status is 200': (r) => r.status === 200 });

    const resV = http.get(`${BASE_URL}/api/videos?search=${encodeURIComponent(query)}&limit=20`);
    check(resV, { 'videos search status is 200': (r) => r.status === 200 });
  });

  sleep(0.1);
}
