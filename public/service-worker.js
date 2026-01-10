// public/service-worker.js
const CACHE_NAME = 'ابو-رامي-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png'
];

// تثبيت Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('✅ تم فتح الكاش');
        return cache.addAll(urlsToCache);
      })
  );
});

// استرجاع الطلبات
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // إذا وجد الملف في الكاش
        if (response) {
          return response;
        }
        
        // إذا لم يجده، يحمله من الإنترنت
        return fetch(event.request).then(function(response) {
          // تأكد أن الرد صالح للتخزين
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // خزن النسخة الجديدة في الكاش
          var responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// تحديث Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ حذف الكاش القديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});