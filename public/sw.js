/* Monologger Service Worker - basic offline support */
const VERSION = 'v1.1.0';
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/logo.svg',
  '/manifest.webmanifest',
  // 記事HTMLの軽量プリキャッシュ（トップページに表示される記事パスを将来的に注入）
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      try { await cache.addAll(PRECACHE_URLS); } catch (_) {}
      // 動的にトップの記事リンクを取得してプリキャッシュ（存在すれば）
      try {
        const res = await fetch('/sitemap-index.xml', { cache: 'no-store' });
        if (res.ok) {
          const text = await res.text();
          const matches = [...text.matchAll(/<loc>[^<]*\/blog\/[\w-]+\/?<\/loc>/g)].slice(0, 5);
          const urls = matches.map(m => m[0].replace(/<\/?loc>/g, '').trim());
          await cache.addAll(urls);
        }
      } catch (_) {}
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Helper strategies
async function networkFirst(request) {
  try {
    const fresh = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    throw err;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  const cache = await caches.open(RUNTIME_CACHE);
  cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Navigation/documents → Network First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets (CSS/JS)
  if (url.pathname.match(/\.(?:js|css|mjs)$/)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Images → Cache First
  if (url.pathname.match(/\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default SWR
  event.respondWith(staleWhileRevalidate(request));
});


