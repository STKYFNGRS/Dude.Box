const CACHE_NAME = "dudebox-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/favicon-192x192.png",
  "/favicon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for API calls and navigation
  if (url.pathname.startsWith("/api/") || request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful article pages for offline reading
          if (
            request.mode === "navigate" &&
            url.pathname.startsWith("/articles/") &&
            response.ok
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              new Response(
                '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline - Dude.Box</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0f1a;color:#e5e7eb;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:2rem}.c{max-width:400px}h1{font-size:1.5rem;color:#22c55e;margin-bottom:.5rem}p{color:#9ca3af;font-size:.875rem;margin-bottom:1.5rem}button{background:#22c55e;color:#fff;border:none;padding:.75rem 1.5rem;border-radius:.5rem;font-weight:600;cursor:pointer}button:hover{background:#16a34a}</style></head><body><div class="c"><h1>You\'re Offline</h1><p>Check your connection and try again.</p><button onclick="location.reload()">Retry</button></div></body></html>',
                { headers: { "Content-Type": "text/html" } }
              )
          )
        )
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (
            response.ok &&
            (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff2?)$/) ||
              url.pathname.startsWith("/_next/static/"))
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
    )
  );
});

// Push notifications
self.addEventListener("push", (event) => {
  let data = { title: "Dude.Box", body: "New update available", url: "/" };
  try {
    data = Object.assign(data, event.data?.json());
  } catch {
    // use defaults
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/favicon-192x192.png",
      badge: "/favicon-192x192.png",
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
