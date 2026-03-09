const CACHE_VERSION = "2026-03-09-hotfix-networkfirst-js-1";
const CACHE_NAME = `desiderativo-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./form.css",
  "./form.js",
  "./app-config.js",
  "./manifest.json",
  "./icon.png",
  "./icon-192.png",
  "./icon-512.png",
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

async function networkFirst(event) {
  try {
    const res = await fetch(event.request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(event.request, res.clone());
    return res;
  } catch {
    return (await caches.match(event.request));
  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    // Network-first para HTML + JS crítico (evita UI vieja)
    if (
      url.pathname.endsWith("/Desiderativo/") ||
      url.pathname.endsWith("/Desiderativo/index.html") ||
      url.pathname.endsWith("/Desiderativo/form.js") ||
      url.pathname.endsWith("/Desiderativo/app-config.js")
    ) {
      const res = await networkFirst(event);
      return res || (await caches.match("./index.html"));
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
