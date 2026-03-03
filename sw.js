const CACHE_VERSION = "2026-03-03-2";
const CACHE_NAME = `desiderativo-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "/Desiderativo/form.css",
  "/Desiderativo/manifest.json",
  "/Desiderativo/icon.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("desiderativo-") && k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  // No cachear HTML ni el JS principal
  if (
    url.pathname === "/Desiderativo/" ||
    url.pathname === "/Desiderativo/index.html" ||
    url.pathname === "/Desiderativo/form.js"
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // cache-first para estáticos
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
