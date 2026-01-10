import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { theme } from './ui/Theme';
import { BansheeProvider } from './hooks/bansheeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <BansheeProvider>
          <App />
        </BansheeProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// 🔽🔽🔽 كود Service Worker المعدل 🔽🔽🔽
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // ⚠️ المسار الصحيح: '/service-worker.js' وليس '/public/service-worker.js'
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    
    // للتطوير: سجل فقط في production، في development قد يسبب مشاكل
    if (process.env.NODE_ENV === 'production' && swUrl.startsWith('http')) {
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('✅ Service Worker registered successfully. Scope:', registration.scope);
          
          // تسجيل تحديثات Service Worker
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // يوجد تحديث جديد
                    console.log('✨ New content is available. Please refresh.');
                    
                    // هنا يمكنك إظهار إشعار للمستخدم
                    if (window.confirm('يتوفر تحديث جديد! هل تريد تحديث الصفحة؟')) {
                      window.location.reload();
                    }
                  } else {
                    // أول مرة يتم التثبيت
                    console.log('📱 Content is cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch(error => {
          console.error('❌ Service Worker registration failed:', error);
        });
    } else if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Service Worker disabled for easier debugging');
      
      // في التطوير، ألغِ أي Service Worker موجود
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }
  });
  
  // تفعيل Service Worker فوراً عند الجاهزية
  navigator.serviceWorker.ready
    .then(registration => {
      console.log('🎯 Service Worker is ready to work offline');
      
      // إرسال رسالة للتنشيط الفوري
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    })
    .catch(error => {
      console.log('ℹ️ No active Service Worker yet');
    });
}

// 🔧 كود إضافي لتحديث Service Worker عند تغيير المحتوى
let refreshing = false;
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (!refreshing) {
    refreshing = true;
    console.log('🔄 Controller changed - refreshing page');
    window.location.reload();
  }
});