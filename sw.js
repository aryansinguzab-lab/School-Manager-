const CACHE_NAME = 'biz-registry-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Install Event: Save the UI shell to the cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Forces the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// 2. Activate Event: Clean up old versions of the cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Event: Cache-First Strategy
// This ensures the app loads instantly from cache, even without internet.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the cached version if it exists, otherwise fetch from network
      return cachedResponse || fetch(event.request);
    })
  );
});
