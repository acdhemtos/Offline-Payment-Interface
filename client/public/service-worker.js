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

// Intercept fetch requests and serve cached resources or handle API requests
self.addEventListener("fetch", (event) => {
  const apiUrl = "/api/"; // Adjust this to match your backend API base path

  if (event.request.url.includes(apiUrl)) {
    // Handle API requests
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response and store it in the cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Serve cached API response if available
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response("API data not available offline", { status: 503 });
          });
        })
    );
  } else {
    // Handle other requests (e.g., static assets)
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).catch((error) => {
            console.error("Fetch failed for:", event.request.url, error);
            return new Response("Resource not available", { status: 404 });
          })
        );
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