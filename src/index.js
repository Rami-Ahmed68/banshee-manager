import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider , ColorModeScript } from '@chakra-ui/react';
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

// 🔽🔽🔽 أضف هذا الكود هنا 🔽🔽🔽
// تسجيل Service Worker لتطبيق PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // في التطوير استخدم '/service-worker.js' 
    // في الإنتاج استخدم '/service-worker.js' أو './service-worker.js'
    navigator.serviceWorker.register('/public/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered successfully: ', registration);
        
        // تحديث Service Worker عند وجود نسخة جديدة
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 New Service Worker installing...');
          
          newWorker.addEventListener('statechange', () => {
            console.log(`🔄 Service Worker state: ${newWorker.state}`);
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('✨ New content is available!');
            }
          });
        });
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed: ', error);
      });
  });
}

// (اختياري) كود لتفعيل Service Worker فوراً
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    console.log('🎯 Service Worker is ready to work offline');
  });
}