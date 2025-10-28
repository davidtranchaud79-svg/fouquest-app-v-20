/* ===== Fouquet’s Suite — Service Worker (offline + cache intelligent) ===== */

const APP_VERSION = 'v10.2';
const CACHE_SHELL = `fqs-shell-${APP_VERSION}`;
const FILES = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_SHELL).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_SHELL ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // Ne gère que les requêtes GET
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(cached =>
      cached ||
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_SHELL).then(c => c.put(req, copy));
        return res;
      }).catch(() => cached || new Response('', { status: 503 }))
    )
  );
});
