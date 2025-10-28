/* ===== Fouquet’s Suite — Service Worker stable (v10.4) ===== */
/* Corrige le 404, le 206 et fonctionne sur GitHub Pages */

const APP_VERSION = 'v10.4';
const CACHE_NAME = `fqs-cache-${APP_VERSION}`;
const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Installation — pré-cache des fichiers essentiels
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => 
      Promise.allSettled(
        PRECACHE_URLS.map(url =>
          fetch(url)
            .then(res => {
              if (res.ok && res.status !== 206) cache.put(url, res);
            })
            .catch(() => null)
        )
      )
    )
  );
  self.skipWaiting();
});

// Activation — nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Fetch — stratégie cache + réseau
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req)
        .then(res => {
          if (res && res.ok && res.status !== 206) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
