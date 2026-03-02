const CACHE_NAME = 'desiderativo-v3-pwa';
const urlsToCache = [
  '/Desiderativo/',
  '/Desiderativo/index.html',
  '/Desiderativo/form.css',
  '/Desiderativo/form.js',
  '/Desiderativo/manifest.json',
  '/Desiderativo/icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
