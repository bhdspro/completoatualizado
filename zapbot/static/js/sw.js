// sw.js
self.addEventListener('install', e => {
    e.waitUntil(
      // depois que o Service Worker estiver instalado,,
      // abra um novo cache
      caches.open('my-pwa-cache').then(cache => {
        // adicione todas as URLs de recursos que queremos armazenar em cache
        return cache.addAll([
          '/',          
          '/static/images/favicon/favicon-32x32.png',
          '/static/site/libs/@fortawesome/fontawesome-free/css/all.min.css',
          '/static/site/css/quick-website.min.css',
          '/static/site/libs/jquery/dist/jquery.min.js',
          '/static/site/libs/bootstrap/dist/js/bootstrap.bundle.min.js'
        ]);
      })
    );
   });