const CACHE_NAME = 'flixstar-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/css/style.css',
    '/js/load-home-components.js',  // Added for index.html
    '/js/load-components.js',      // For other pages
    '/images/logo3.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
