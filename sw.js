/* ===== Fouquet's Suite — Service Worker (offline + cache intelligent) ===== */

const APP_VERSION = 'v10-' + new Date().toISOString().slice(0, 10); // version datée auto
const APP_SHELL = `fouquets-shell-${APP_VERSION}`;
const RUNTIME_STATIC = `fouquets-static-${APP_VERSION}`;
const RUNTIME_API = `fouquets-api-${APP_VERSION}`;

/* === Fichiers à précacher ===
   Tous les chemins sont relatifs pour GitHub Pages
   (ex: ./index.html au lieu de /index.html)
*/
const PRECACHE = [
  './index.html',
  './styles.css',
  './app.js',
  './favicon.ico',
  './manifest.webmanifest',
  './assets/logo.png',
  './assets/hero.jpg'
];

/* === Helpers d’URL === */
function isNavigationRequest(req) {
  return req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'));
}
function isStaticAsset(req) {
  const url = new URL(req.url);
  return /\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|ttf|otf|woff2?)$/i.test(url.pathname);
}
function isApiRequest(req) {
  const url = new URL(req.url);
  return url.searchParams.has('path'); // appels Apps Script : ?path=stock_journalier&apiKey=...
}

/* === Installation === */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_SHELL).then((cache) => cache.addAll(PRECACHE))
  );
});

/* === Activation et nettoyage === */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => ![APP_SHELL, RUNTIME_STATIC, RUNTIME_API].includes(k))
        .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

/* === Stratégies de cache ===
   - HTML : Network-first + fallback cache
   - Static assets : Stale-While-Revalidate
   - API : Network-first avec timeout + cache JSON
*/
const NETWORK_TIMEOUT_MS = 4500;

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1️⃣ HTML / navigation
  if (isNavigationRequest(req)) {
    event.respondWith((async () => {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
        const net = await fetch(req, { signal: controller.signal });
        clearTimeout(id);
        const cache = await caches.open(APP_SHELL);
        cache.put(req, net.clone());
        return net;
      } catch {
        const cache = await caches.open(APP_SHELL);
        const cached = await cache.match(req) || await cache.match('./index.html');
        return cached || new Response('<h1>Hors ligne</h1>', { headers:{'Content-Type':'text/html'} });
      }
    })());
    return;
  }

  // 2️⃣ Fichiers statiques
  if (isStaticAsset(req)) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_STATIC);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      return cached || fetchPromise || new Response('', { status: 504 });
    })());
    return;
  }

  // 3️⃣ API Google Apps Script
  if (isApiRequest(req) && req.method === 'GET') {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_API);
      const url = new URL(req.url);
      const params = [...url.searchParams.entries()].sort((a,b)=> a[0].localeCompare(b[0]));
      const norm = new URL(url.origin + url.pathname);
      params.forEach(([k,v]) => norm.searchParams.append(k,v));
      const cacheKey = new Request(norm.toString(), { method:'GET', headers:req.headers });

      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
        const net = await fetch(req, { signal: controller.signal });
        clearTimeout(id);
        if (net && net.ok) cache.put(cacheKey, net.clone());
        return net;
      } catch {
        const fallback = await cache.match(cacheKey);
        if (fallback) return fallback;
        return new Response(JSON.stringify({ ok:false, offline:true, error:'offline/cache_miss' }), {
          headers: { 'Content-Type':'application/json' }, status: 503
        });
      }
    })());
    return;
  }

  // 4️⃣ Par défaut : SWR
  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME_STATIC);
    const cached = await cache.match(req);
    const fetchPromise = fetch(req).then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    return cached || fetchPromise || new Response('', { status: 504 });
  })());
});
