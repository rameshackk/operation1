const CACHE_NAME = 'muthaleetu-thisai-v3-6-0';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network first: always fetch fresh bundle and assets
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
