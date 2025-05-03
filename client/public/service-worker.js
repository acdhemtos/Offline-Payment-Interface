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
  "/illustration_2.svg",
  "/illustration.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
  "/account/signup",
  "/account/login",
  "/app/send",
  "/app/recieve",
  "/app/scan",
  "/app/upi-pin",
  "/app/opi-pin",
  "/app/status",
  "/app/set-pin",
  "/app/communicate",
  "/app/transactions",
  "/app/settings",
  "/app/home",
  "/app/success"
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

// Fetch event: Network First strategy
self.addEventListener("fetch", (event) => {
  // Skip caching for API requests
  if (event.request.url.includes("/api/")) {
    return; // Do nothing for API requests
  }

  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If the request is successful, clone and cache the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If the network is unavailable, serve from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return a generic fallback for other requests
            return new Response("Resource not available", { status: 404 });
          });
        })
    );
  }
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