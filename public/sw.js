// Service Worker for Hover Wayfinder Kiosk
// Automatically pre-caches all application bundles, styles, and site configurations
// into Chromium's local CacheStorage on the NUC.

const CACHE_NAME = 'hover-wayfinder-v1.0.0';

const scopePath = new URL(self.registration.scope).pathname;
const basePath = scopePath.endsWith('/') ? scopePath : `${scopePath}/`;

const PRECACHE_URLS = [
  basePath,
  `${basePath}index.html`,
  `${basePath}version.json`,
  `${basePath}sites/default.json`,
  `${basePath}sites/mall-a.json`,
  `${basePath}sites/hospital.json`,
  `${basePath}sites/museum.json`,
];

// Install: pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate strategy for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for version checking and API tokens
  if (url.pathname.includes('/version.json') || url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first / stale-while-revalidate for assets, bundles, scripts, and fonts
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
