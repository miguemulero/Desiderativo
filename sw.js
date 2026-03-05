// SOLO CAMBIO NECESARIO: subir la versión para invalidar caché (no cambia funcionamiento)
const CACHE_VERSION = "2026-03-05-past-ui-2";
const CACHE_NAME = `desiderativo-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "/Desiderativo/",
  "/Desiderativo/index.html",
  "/Desiderativo/form.css",
  "/Desiderativo/form.js",
  "/Desiderativo/app-config.js",
  "/Desiderativo/manifest.json",
  "/Desiderativo/icon.png",
  "/Desiderativo/icon-192.png",
  "/Desiderativo/icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith("desiderativo-") && k !== CACHE_NAME)
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    // Network-first para HTML (evita quedarse con UI vieja)
    if (url.pathname === "/Desiderativo/" || url.pathname.endsWith("/index.html")) {
      try {
        const res = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, res.clone());
        return res;
      } catch {
        return (await caches.match(event.request)) || (await caches.match("/Desiderativo/index.html"));
      }
    }

    // Cache-first para el resto
    const cached = await caches.match(event.request);
    if (cached) return cached;

    const res = await fetch(event.request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(event.request, res.clone());
    return res;
  })());
});
