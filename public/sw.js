// Minimal runtime-cache service worker — P4/stretch scope for offline page-shell support.
// Deliberately simple: it does NOT try to precache Next.js's per-build hashed chunks (that
// needs a build-integrated tool like Workbox/Serwist, which requires webpack config this
// Turbopack setup doesn't use). Instead it caches pages and assets as they're actually
// visited, network-first, so a page you've already opened once while online can reopen
// with no connection. This does not make brand-new, never-visited pages work offline.

const CACHE_NAME = "sehat-saathi-shell-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never cache API calls — a cached diagnosis response would be actively misleading.
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached ?? Response.error()))
  );
});
