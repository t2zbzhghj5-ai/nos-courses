// Nos courses : garde l'app sur le téléphone pour qu'elle s'ouvre même sans réseau.
// Les données de la liste ne passent pas par ici : Firestore les met lui-même en cache.
const CACHE = "nos-courses-v8";
const SHELL = ["./", "./index.html", "./rayons.js", "./parse.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Pages de l'app : réseau d'abord (pour recevoir les mises à jour), copie locale si le réseau tarde ou manque.
function networkFirst(request) {
  return caches.open(CACHE).then((cache) => new Promise((resolve) => {
    let settled = false;
    const finish = (res) => { if (!settled) { settled = true; resolve(res); } };
    const fallback = () => cache.match(request, { ignoreSearch: true }).then((hit) => hit || cache.match("./index.html"));
    const timer = setTimeout(() => { fallback().then((hit) => { if (hit) finish(hit); }); }, 3000);
    // « no-cache » : on redemande toujours au serveur s'il y a du neuf, au lieu de se fier au cache du navigateur.
    fetch(request, { cache: "no-cache" })
      .then((res) => {
        clearTimeout(timer);
        if (res.ok) cache.put(request, res.clone());
        finish(res);
      })
      .catch(() => {
        clearTimeout(timer);
        fallback().then((hit) => finish(hit || Response.error()));
      });
  }));
}

// Bibliothèque Firebase et polices : fichiers versionnés, la copie locale suffit.
function cacheFirst(request) {
  return caches.open(CACHE).then((cache) => cache.match(request).then((hit) => hit || fetch(request).then((res) => {
    if (res.ok || res.type === "opaque") cache.put(request, res.clone());
    return res;
  })));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request));
  } else if ((url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/"))
    || url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(cacheFirst(request));
  }
});
