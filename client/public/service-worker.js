const CACHE_NAME = "pwa-cache-v1";
const API_CACHE_NAME = "api-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/src/index.css",
  // Add other static assets here
];

// Install event: Cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Handle API requests and static assets
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Handle API requests
  if (requestUrl.origin !== location.origin && requestUrl.pathname.startsWith("/api/")) {
    if (event.request.method === "GET") {
      // Cache GET requests
      event.respondWith(
        caches.open(API_CACHE_NAME).then((cache) => {
          return fetch(event.request)
            .then((response) => {
              // Clone and store the response in the cache
              if (response.status === 200) {
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Serve from cache if offline
              return cache.match(event.request);
            });
        })
      );
    } else if (event.request.method === "POST") {
      // Handle POST requests (fallback or custom logic)
      event.respondWith(
        fetch(event.request).catch(() => {
          return new Response(
            JSON.stringify({ error: "Offline: POST request failed" }),
            { headers: { "Content-Type": "application/json" } }
          );
        })
      );
    }
    return;
  }

  // Cache static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});