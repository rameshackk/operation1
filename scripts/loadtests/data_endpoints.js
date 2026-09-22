import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = 'http://127.0.0.1:3000';
const categories = ['all', 'mutual-fund', 'stock-market', 'personal-finance', 'tax'];

export default function () {
  const cat = categories[Math.floor(Math.random() * categories.length)];

  group('Core Data Endpoints', function () {
    const resVideos = http.get(`${BASE_URL}/api/videos?page=1&limit=20&category=${cat}&sort=newest`);
    check(resVideos, {
      'videos status is 200': (r) => r.status === 200,
    });

    const resArticles = http.get(`${BASE_URL}/api/articles?page=1&limit=20&category=${cat}&sort=newest`);
    check(resArticles, {
      'articles status is 200': (r) => r.status === 200,
    });
  });

  sleep(0.1);
}
