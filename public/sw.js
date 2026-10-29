// ============================================
// SERVICE WORKER — TechField PWA
// Estrategia: Cache First para App Shell
//             Network First para API
//             Offline Fallback
// ============================================

const CACHE_NAME = 'techfield-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable.png'
];

// ── EVENTO INSTALL ──────────────────────────
// Se ejecuta cuando el navegador detecta un SW nuevo.
// Precachea el App Shell (archivos esenciales para funcionar offline).
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  // Activa inmediatamente sin esperar a que se cierren las pestañas
  self.skipWaiting();
});

// ── EVENTO ACTIVATE ─────────────────────────
// Se ejecuta cuando el SW toma control.
// Limpia cachés viejas de versiones anteriores.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            return caches.delete(name);
          })
      );
    })
  );
  // Toma control de todas las páginas abiertas inmediatamente
  self.clients.claim();
});

// ── EVENTO FETCH ────────────────────────────
// Intercepta TODAS las peticiones de red.
// Estrategia:
//   - Peticiones a la API → Network First (intenta red, si falla usa caché)
//   - Archivos estáticos  → Cache First / Stale-While-Revalidate
//   - Si todo falla       → Muestra offline.html
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignorar peticiones que no sean GET
  if (request.method !== 'GET') return;

  // Peticiones a la API → Network First
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Guardar copia en caché para cuando no haya red
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // Sin red → buscar en caché
          return caches.match(request);
        })
    );
    return;
  }

  // Archivos estáticos → Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          // Actualizar la caché con la versión más nueva
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // Si no hay caché ni red y es una navegación → offline.html
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });

      // Devuelve la caché inmediatamente (stale) y actualiza en segundo plano (revalidate)
      return cached || fetchPromise;
    })
  );
});
