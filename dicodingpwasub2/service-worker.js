importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
if (workbox) {
  console.log(`Workbox berhasil dimuat`);

  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/style.css', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/js/sw.js', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/team.html', revision: '1' },
    // { url: '/match.html', revision: '1' },
    { url: '/tim_favorit.html', revision: '1' },
    { url: '/"https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js', revision: '1' },
  ], {
    ignoreUrlParametersMatching: [/.*/]
  });

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg|webp)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ]
    })
  );

  workbox.routing.registerRoute(    
    new RegExp('/'),
    workbox.strategies.staleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate()
  );

  workbox.routing.registerRoute(
      new RegExp('https://api.football-data.org/v2/'),
      workbox.strategies.staleWhileRevalidate({
        cacheExpiration: {
              maxAgeSeconds: 60 * 30 //cache diperbarui setiap 30 menit
        }
      })
  );
}
else {
  console.log(`Workbox gagal dimuat`);
}

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/icon-128x128.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});