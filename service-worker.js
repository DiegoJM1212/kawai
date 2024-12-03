const CACHE_NAME = 'kawaipet-cache-v1';
const urlsToCache = [
  '/',  // Página de inicio

  // Archivos HTML
  '/html/accesorios.html',
  '/html/alimentos.html',
  '/html/articulos.html',
  '/html/citaveterinaria.html',
  '/html/contacto.html',
  '/html/esteticareservaciones.html',
  '/html/inicio.html',
  '/html/login.html',
  '/html/masocotasapi.html',
  '/html/medicamentos.html',
  '/html/offline.html',
  '/html/onboarding.html',
  '/html/pagopaypal.html',
  '/html/productos.html',
  '/html/recuperarpass.html',
  '/html/reservacionhotel.html',
  '/html/seguimientoveterinaria.html',
  '/html/tarjetas.html',

  '/icons/go.png',
  '/icons/lo.png',

  // Archivos CSS
  '/css/agendar-citaveterinaria.css',
  '/css/alimentos.css',
  '/css/articulos.css',
  '/css/banco.css',
  '/css/contacto.css',
  '/css/esteticareservas.css',
  '/css/hotelreservas.css',
  '/css/inicio.css',
  '/css/juguetes.css',
  '/css/login.css',
  '/css/mascotasapi.css',
  '/css/medicamentos.css',
  '/css/onboarding.css',
  '/css/paypal.css',
  '/css/recuperarpass.css',
  '/css/seguimientomascotas.css',
  '/css/tienda.css',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch (obtención de archivos desde la caché o desde la red)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Si está en caché, devuélvelo
        }

        return fetch(event.request)
          .then((response) => {
            // Verificar que la respuesta sea válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta para cachearla
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch((error) => {
        console.error('Fetch falló:', error);
        // Opción: devolver una página personalizada de error
        return caches.match('/html/error.html');
      })
  );
});

// Activación del Service Worker y limpieza de cachés obsoletos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
})

