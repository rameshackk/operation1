import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },    // Stage 1 warmup to 50 VUs
    { duration: '30s', target: 50 },    // Stage 1 hold 50 VUs
    { duration: '30s', target: 200 },   // Stage 2 ramp to 200 VUs
    { duration: '1m', target: 200 },    // Stage 2 hold 200 VUs
    { duration: '30s', target: 500 },   // Stage 3 ramp to 500 VUs
    { duration: '1m', target: 500 },    // Stage 3 hold 500 VUs
    { duration: '30s', target: 1000 },  // Stage 4 ramp to 1000 VUs
    { duration: '1m', target: 1000 },   // Stage 4 hold 1000 VUs
    { duration: '30s', target: 0 },     // Ramp-down
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],      // Error rate < 5%
    http_req_duration: ['p(95)<3000'],   // 95% of requests under 3s
  },
};

const BASE_URL = 'http://127.0.0.1:3000';

export default function () {
  group('Homepage Initial Load', function () {
    // 1. Static HTML & Assets
    const responses = http.batch([
      ['GET', `${BASE_URL}/`],
      ['GET', `${BASE_URL}/css/styles.css`],
      ['GET', `${BASE_URL}/js/bundle.compiled.js`],
      ['GET', `${BASE_URL}/manifest.json`],
    ]);

    check(responses[0], { 'homepage status is 200': (r) => r.status === 200 });
    check(responses[1], { 'css status is 200': (r) => r.status === 200 });
    check(responses[2], { 'bundle status is 200': (r) => r.status === 200 });

    // 2. Client Hydration API Calls
    const apiResponses = http.batch([
      ['GET', `${BASE_URL}/api/videos?page=1&limit=12&category=all`],
      ['GET', `${BASE_URL}/api/articles?page=1&limit=6&category=all`],
      ['GET', `${BASE_URL}/api/news?limit=10`],
    ]);

    check(apiResponses[0], { 'videos api status is 200': (r) => r.status === 200 });
    check(apiResponses[1], { 'articles api status is 200': (r) => r.status === 200 });
    check(apiResponses[2], { 'news api status is 200': (r) => r.status === 200 });
  });

  sleep(1);
}
