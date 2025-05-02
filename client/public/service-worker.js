const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo192.png",
  "/logo256.png",
  "/logo384.png",
  "/logo512.png",
  "/maskable.png",
  "/desktop.png",
  "/mobile.png",
  "/static/js/main.chunk.js",
  "/static/js/0.chunk.js",
  "/static/js/0.bundle.js",
  "/assets/illustration_2.svg",
  "/assets/illustration.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/android-chrome-192x192.png"
];

// Install the service worker and cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercept fetch requests and serve cached resources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached resource if available, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});

// Activate the service worker and clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});