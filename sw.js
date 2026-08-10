const CACHE =
  'vnnus-erp-v2';


const ASSETS = [

  './',

  './index.html',

  './css/app.css',

  './js/config.js',

  './js/api.js',

  './js/router.js',

  './js/app.js',

  './pages/dashboard.html',

  './pages/produtos.html',

  './pages/scanner.html',

  './pages/estoque.html',

  './pages/pdv.html',

  './pages/clientes.html',

  './pages/financeiro.html',

  './pages/configuracoes.html',

  './assets/icons/icon-192.png',

  './assets/icons/icon-512.png',

  './manifest.webmanifest'

];


self.addEventListener(
  'install',
  function(event) {

    self.skipWaiting();

    event.waitUntil(

      caches
        .open(CACHE)
        .then(
          function(cache) {

            return cache.addAll(
              ASSETS
            );

          }
        )

    );

  }
);


self.addEventListener(
  'activate',
  function(event) {

    event.waitUntil(

      caches
        .keys()
        .then(
          function(keys) {

            return Promise.all(

              keys
                .filter(
                  function(key) {

                    return (
                      key !== CACHE
                    );

                  }
                )
                .map(
                  function(key) {

                    return caches.delete(
                      key
                    );

                  }
                )

            );

          }
        )
        .then(
          function() {

            return self.clients.claim();

          }
        )

    );

  }
);


self.addEventListener(
  'fetch',
  function(event) {

    /*
      Para HTML, JS e CSS:
      tenta sempre pegar a versão nova primeiro.
    */

    event.respondWith(

      fetch(
        event.request
      )

      .then(
        function(response) {

          const copia =
            response.clone();


          caches
            .open(CACHE)
            .then(
              function(cache) {

                cache.put(
                  event.request,
                  copia
                );

              }
            );


          return response;

        }
      )

      .catch(
        function() {

          return caches.match(
            event.request
          );

        }
      )

    );

  }
);
