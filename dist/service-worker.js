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

// Cache on install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate and clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await clients.claim(); // Ensure the service worker takes control of all clients
      console.log("Service worker activated and claimed clients.");
      const cacheWhitelist = [CACHE_NAME];
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })()
  );
});

// Fetch with network-first strategy
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    return; // don't cache API
  }

  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || new Response("Resource not available", { status: 404 });
          });
        })
    );
  }
});


// Periodically fetch balance
const fetchInterval = 2000;

async function fetchBalance() {
  try {
    const sessionKey = await getCookieValue("session_key");
    const username = await getCookieValue("username");

    if (!sessionKey || !username) {
      console.error("Session key or username missing. Logging out.");
      logoutUser();
      return;
    }

    const response = await fetch("/api/getBalance.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, session_key: sessionKey }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code === 0) {
      postMessageToClients({ type: "updateConnectionStatus", isConnected: true });
      //console.log("Balance fetched successfully:", data.balance);
    } else {
      console.error("Invalid response from server:", data);
      logoutUser();
    }
  } catch (error) {
    console.error("Network error or invalid response:", error);
    postMessageToClients({ type: "updateConnectionStatus", isConnected: false });
  }
}

function logoutUser() {
  //console.log("sending logout msg to clients");
  postMessageToClients({ type: "logout", isConnected:false });
}

function postMessageToClients(message) {
  self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
    if (clients.length === 0) {
      console.error("No clients available to send message. Retrying..."); // Retry after 2 seconds
      return;
    }
    clients.forEach((client) => {
      //console.log("Sending message to client:", message);
      client.postMessage(message);
    });
  });
}

// 🔧 Use cookieStore API to read cookies
async function getCookieValue(name) {
  try {
    const cookie = await cookieStore.get(name);
    return cookie ? cookie.value : null;
  } catch (error) {
    console.error("Error reading cookie:", name, error);
    return null;
  }
}

self.addEventListener("message", (event) => {
  const { type, name } = event.data;

  if (type === "getCookie") {
    getCookieValue(name).then((value) => {
      event.source.postMessage({ type: "cookieValue", name, value });
    });
  }
});

setInterval(fetchBalance, fetchInterval);
