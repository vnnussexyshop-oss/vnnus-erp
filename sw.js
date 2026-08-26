/* =====================================================
   VNNUS ERP
   SERVICE WORKER 4.0
===================================================== */

const CACHE_NAME =
  'vnnus-erp-v4';


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

              chaves
                .filter(
                  function(chave) {

                    return (
                      chave !==
                      CACHE_NAME
                    );

                  }
                )
                .map(
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

    if (
      event.request.method !==
      'GET'
    ) {

      return;

    }


    event.respondWith(

      fetch(
        event.request,
        {
          cache:
            'no-store'
        }
      )

      .then(
        function(resposta) {

          return resposta;

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
