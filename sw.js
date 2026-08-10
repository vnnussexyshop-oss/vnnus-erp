const CACHE="vnnus-erp-v1";
const ASSETS=["./", "./index.html", "./css/app.css", "./js/config.js", "./js/api.js", "./js/router.js", "./js/app.js", "./pages/dashboard.html", "./pages/produtos.html", "./pages/scanner.html", "./pages/estoque.html", "./pages/pdv.html", "./pages/clientes.html", "./pages/financeiro.html", "./pages/configuracoes.html", "./assets/icons/icon-192.png", "./assets/icons/icon-512.png", "./manifest.webmanifest"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match("./index.html")))));
