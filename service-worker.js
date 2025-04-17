self.addEventListener("install", (e) => {
  console.log("Service Worker Installed");
  e.waitUntil(
    caches.open("binance-pro-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles/main.css",
        "/scripts/app.js",
        "/assets/icons/icon-192.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});