const CACHE_NAME =
  'vnnus-erp-v3';


self.addEventListener(
  'install',
  function(event) {

    self.skipWaiting();

  }
);


self.addEventListener(
  'activate',
  function(event) {

    event.waitUntil(

      caches
        .keys()
        .then(
          function(chaves) {

            return Promise.all(

              chaves.map(
                function(chave) {

                  return caches.delete(
                    chave
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
      ERP 2.1:
      sempre buscamos a versão atual
      diretamente da internet.

      Isso evita JS antigo no celular.
    */

    event.respondWith(

      fetch(
        event.request,
        {
          cache:
            'no-store'
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
