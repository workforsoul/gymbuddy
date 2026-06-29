const CACHE = 'gym-v3';
const ASSETS = ['/index.html'];
 
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
 
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
 
self.addEventListener('fetch', e => {
  // Never intercept Supabase requests
  if (e.request.url.includes('supabase.co')) {
    return;
  }
  // Never intercept CDN requests
  if (e.request.url.includes('cdn.jsdelivr.net')) {
    return;
  }
  // For everything else serve from cache with network fallback
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request);
    })
  );
});
 
