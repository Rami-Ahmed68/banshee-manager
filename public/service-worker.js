const CACHE_NAME = 'abou-rami-sales-v1';

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});