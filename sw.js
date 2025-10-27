/* ===== Fouquet's Suite — Service Worker (offline + cache intelligent) ===== */

const APP_VERSION = 'v10-offline-1';
const APP_SHELL = `fouquets-shell-${APP_VERSION}`;
const RUNTIME_STATIC = `fouquets-static-${APP_VERSION}`;
const RUNTIME_API = `fouquets-api-${APP_VERSION}`;

/* Ajuste cette liste selon tes fichiers */
const PRECACHE = [
  '/',                 // si ton site est servi à la racine
  '/index.html',
  '/styles.css',
  '/app.js',
  '/favicon.ico',
  '/manifest.webmanifest',
  // dépendances éventuelles :
  '/assets/logo.png',
  '/assets/hero.jpg',
  // Chart.js si local (sinon enlève) :
  // '/vendor/chart.4.4.0.min.js'
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
  // règle générique : on repère la query ?path=... de ton Apps Script
  // Adapte si besoin (par ex: domaine précis)
  const url = new URL(req.url);
  return url.searchParams.has('path'); // tes appels:  ...?path=stock_journalier&apiKey=...
}

/* === App Shell (offline safe) === */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_SHELL).then((cache) => cache.addAll(PRECACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Nettoyage des vieux caches
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
   - HTML (navigation)    : Network-first -> fallback précache (app shell)
   - Static assets (css/js/images/fonts) : Stale-While-Revalidate
   - API (GET ?path=...)  : Network-first avec timeout -> fallback cache, on garde la dernière réponse OK
*/
const NETWORK_TIMEOUT_MS = 4500;

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1) Navigations HTML
  if (isNavigationRequest(req)) {
    event.respondWith((async () => {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
        const net = await fetch(req, { signal: controller.signal });
        clearTimeout(id);
        // on met en cache l’HTML actuel (optionnel)
        const cache = await caches.open(APP_SHELL);
        cache.put(req, net.clone());
        return net;
      } catch {
        // fallback app shell
        const cache = await caches.open(APP_SHELL);
        const cached = await cache.match(req) || await cache.match('/index.html');
        return cached || new Response('<h1>Hors-ligne</h1>', { headers:{'Content-Type':'text/html'} });
      }
    })());
    return;
  }

  // 2) Static assets
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

  // 3) API (Apps Script ?path=...)
  if (isApiRequest(req) && req.method === 'GET') {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_API);

      // ⚠️ On normalise la clé de cache pour éviter les variations d’ordre des params
      const url = new URL(req.url);
      const params = [...url.searchParams.entries()].sort((a,b)=> a[0].localeCompare(b[0]));
      const norm = new URL(url.origin + url.pathname);
      params.forEach(([k,v]) => norm.searchParams.append(k,v));
      const cacheKey = new Request(norm.toString(), { method: 'GET', headers: req.headers });

      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
        const net = await fetch(req, { signal: controller.signal });
        clearTimeout(id);

        // on ne met en cache que les 200 OK avec JSON attendu
        if (net && net.ok) cache.put(cacheKey, net.clone());
        return net;
      } catch {
        // hors ligne / timeout => sert le dernier snapshot si dispo
        const fallback = await cache.match(cacheKey);
        if (fallback) return fallback;
        // sinon réponse JSON minimaliste
        return new Response(JSON.stringify({ ok:false, offline:true, error:'offline/cache_miss' }), {
          headers: { 'Content-Type':'application/json' }, status: 503
        });
      }
    })());
    return;
  }

  // 4) Par défaut : passe-plat avec SWR simple
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
