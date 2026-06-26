/* NetKids — Service Worker: cache offline-first para uso sin conexión en el aula */
const CACHE_NAME = "netkids-cache-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Estrategia "red primero": siempre intenta traer la version mas reciente.
   Solo recurre a la cache si no hay conexion (modo offline en el aula). */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy)).catch(() => {});
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
