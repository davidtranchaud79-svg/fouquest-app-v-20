/* ===== Fouquet’s Suite — Service Worker v10.3 ===== */
/* Corrige les erreurs 404 et 206 partielles sur GitHub Pages */

const APP_VERSION = 'v10.3';
const CACHE_NAME = `fqs-cache-${APP_VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Installation (cache initial)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(
        ASSETS.map(url => 
          fetch(url, { cache: 'reload' })
            .then(resp => (resp.ok ? cache.put(url, resp) : null))
            .catch(() => null)
        )
      ))
  );
  self.skipWaiting();
});

// Activation (nettoyage des anciens caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Stratégie de récupération
self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached => {
      const networkFetch = fetch(req)
        .then(resp => {
          // Ignore les réponses partielles 206
          if (!resp || !resp.ok || resp.status === 206) return resp;
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return resp;
        })
        .catch(() => cached || new Response('', { status: 503 }));

      return cached || networkFetch;
    })
  );
});
