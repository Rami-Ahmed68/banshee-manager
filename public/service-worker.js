// public/service-worker.js - النسخة المعدلة
const APP_NAME = 'ابو-رامي';
const CACHE_VERSION = 'v3';
const CACHE_NAME = `${APP_NAME}-${CACHE_VERSION}`;

// الملفات التي يجب تخزينها فور التثبيت
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  
  // ملفات React الأساسية (تتغير أسماؤها في كل build)
  '/static/js/bundle.js',
  '/static/js/main.*.js',
  '/static/js/0.*.js',
  '/static/js/1.*.js',
  '/static/js/2.*.js',
  
  '/static/css/main.*.css',
  '/static/css/0.*.css',
  
  // ملفات Chakra UI
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// ===== 1. التثبيت =====
self.addEventListener('install', (event) => {
  console.log(`🎯 ${APP_NAME}: Installing Service Worker...`);
  
  // التنشيط الفوري بدون انتظار
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Opening cache...');
        
        // حاول تخزين الملفات الأساسية
        return cache.addAll(urlsToCache)
          .then(() => {
            console.log(`✅ All resources cached (${urlsToCache.length} files)`);
          })
          .catch((error) => {
            console.warn('⚠️ Some resources failed to cache:', error);
            // لا توقف التثبيت إذا فشل تخزين بعض الملفات
          });
      })
      .catch((error) => {
        console.error('❌ Cache opening failed:', error);
      })
  );
});

// ===== 2. التنشيط =====
self.addEventListener('activate', (event) => {
  console.log(`🎯 ${APP_NAME}: Service Worker activated`);
  
  event.waitUntil(
    // حذف الكاش القديم
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith(APP_NAME)) {
            console.log(`🧹 Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // المطالبة بالتحكم في جميع علامات التبويب فوراً
      return self.clients.claim();
    })
  );
});

// ===== 3. اعتراض الطلبات =====
self.addEventListener('fetch', (event) => {
  // تجاهل طلبات POST وطلبات غير GET
  if (event.request.method !== 'GET') return;
  
  // تجاهل طلبات chrome-extension
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // تجاهل طلبات التحليلات
  if (event.request.url.includes('google-analytics') || 
      event.request.url.includes('gtag')) return;
  
  const requestUrl = new URL(event.request.url);
  
  // استراتيجية Cache First للطلبات المحلية
  if (requestUrl.origin === location.origin) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // 1. إذا كان الملف في الكاش
            console.log(`📦 Serving from cache: ${event.request.url}`);
            return cachedResponse;
          }
          
          // 2. إذا لم يكن في الكاش، حمله من الشبكة
          console.log(`🌐 Fetching from network: ${event.request.url}`);
          return fetch(event.request)
            .then((networkResponse) => {
              // تحقق من صحة الرد
              if (!networkResponse || networkResponse.status !== 200) {
                return networkResponse;
              }
              
              // خزن الملف في الكاش للمستقبل
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                  console.log(`💾 Cached: ${event.request.url}`);
                });
              
              return networkResponse;
            })
            .catch((error) => {
              // 3. إذا فشل الاتصال بالشبكة
              console.log(`🚫 Offline - Can't fetch: ${event.request.url}`);
              
              // إذا كان طلب صفحة HTML، ارجع index.html
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/index.html');
              }
              
              // رسالة بديلة للطلبات الأخرى
              return new Response(
                `<h1>أنت غير متصل بالإنترنت</h1>
                 <p>التطبيق يعمل بدون اتصال، لكن هذا المورد يحتاج شبكة.</p>
                 <p>URL: ${event.request.url}</p>`,
                {
                  headers: { 'Content-Type': 'text/html; charset=utf-8' }
                }
              );
            });
        })
    );
  } else {
    // للطلبات الخارجية (مثل CDNs)
    event.respondWith(fetch(event.request));
  }
});

// ===== 4. استقبال الرسائل من الصفحة =====
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});