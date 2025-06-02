// service-worker.js

const CACHE_NAME = 'mindbloom-cache-v2'; // COMENTARIO_ESTRATÉGICO: Incrementamos la versión del caché
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/images/logo-mindbloom.svg',
  '/images/hero-mindbloom-space.webp',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
  // COMENTARIO_ESTRATÉGICO: Agregamos las imágenes del equipo al caché para mejorar la experiencia offline.
  '/images/team/margueryte-soto.jpg',
  '/images/team/alicia-puternicki.jpg',
  '/images/team/zulyce-malave.jpg',
  '/images/team/franklin-cortez.jpg',
  '/images/team/nelson-lastra.jpg',
  '/images/team/sandra-sanchez-garcia.jpg',
  // CDN assets (opcional, pero puede mejorar la carga si el CDN falla o es lento)
  // Considera que los CDNs tienen sus propias cabeceras de caché muy optimizadas.
  // Cachear CDNs puede ser complejo por las actualizaciones y versionado.
  // 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  // 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  // 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
];

// COMENTARIO_ESTRATÉGICO: El evento 'install' se dispara cuando el service worker se instala por primera vez.
// Aquí es donde usualmente se precachean los assets estáticos fundamentales de la aplicación.
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache app shell:', error);
      })
  );
});

// COMENTARIO_ESTRATÉGICO: El evento 'activate' se dispara después de la instalación y cuando una nueva versión
// del service worker reemplaza a una antigua. Es un buen lugar para limpiar cachés antiguas.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Permite que el SW activo controle clientes sin recargar.
});

// COMENTARIO_ESTRATÉGICO: El evento 'fetch' intercepta todas las solicitudes HTTP de la aplicación.
// Aquí implementamos una estrategia "Cache First" para los assets cacheados.
// Para otros recursos, va a la red.
self.addEventListener('fetch', event => {
  // No interceptar peticiones que no sean GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Estrategia: Cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // console.log('[Service Worker] Returning from cache:', event.request.url);
          return cachedResponse;
        }
        // console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request).then(
          networkResponse => {
            // Opcional: Cachear dinámicamente nuevos recursos si es necesario
            // Pero cuidado con llenar la caché con todo.
            // if (networkResponse && networkResponse.status === 200 && !urlsToCache.includes(event.request.url) && !event.request.url.includes('chrome-extension')) {
            //   const responseToCache = networkResponse.clone();
            //   caches.open(CACHE_NAME)
            //     .then(cache => {
            //       cache.put(event.request, responseToCache);
            //     });
            // }
            return networkResponse;
          }
        ).catch(error => {
          console.error('[Service Worker] Fetch failed; returning offline page instead.', error);
          // Opcional: Podrías devolver una página offline personalizada aquí
          // return caches.match('/offline.html'); 
        });
      })
  );
});

// Opcional: Escuchar mensajes del cliente (desde app.js)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
