// sw.js — light PWA (no tile caching)
self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

const APP_CACHE = 'app-lite-v1';
const APP_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const isAppAsset = APP_ASSETS.includes(url.href) || APP_ASSETS.includes(url.pathname) || url.origin === location.origin;

  if (isAppAsset) {
    e.respondWith((async () => {
      const cache = await caches.open(APP_CACHE);
      const cached = await cache.match(e.request, { ignoreSearch: true });
      try {
        const net = await fetch(e.request);
        cache.put(e.request, net.clone());
        return net;
      } catch {
        return cached || Response.error();
      }
    })());
  }
});
