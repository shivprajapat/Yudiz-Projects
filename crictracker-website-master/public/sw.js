try {
  const PRECACHE = 'precache-v1'
  const RUNTIME = 'runtime-v1'

  // A list of local resources we always want to be cached.
  const PRECACHE_URLS = [
    '/',
    '/images/icons/android-chrome-192x192.png',
    '/images/icons/android-chrome-512x512.png',
    '/images/icons/apple-touch-icon.png',
    '/images/icons/favicon-16x16.png',
    '/images/icons/favicon-32x32.png',
    '/images/icons/favicon.ico',
    '/images/icons/site.webmanifest',
    '/images/pwa/icon-192x192.png',
    '/images/pwa/icon-256x256.png',
    '/images/pwa/icon-384x384.png',
    '/images/pwa/icon-512x512.png',
    '/images/blur-image.jpg',
    '/images/no-data.svg',
    '/images/logo.png',
    '/images/logo-color.png',
    '/images/CricTracker-Facebook-Preview.webp',
    '/images/CricTracker-Facebook-Preview.jpg',
    'favicon.png',
    'favicon.ico',
    'manifest.json'
  ]

  // The install handler takes care of precaching the resources we always need.
  self.addEventListener('install', (event) => {
    console.log('installing sw')
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then((cache) => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting()) // Remove if you want to add update popup
    )
  })
  // The activate handler takes care of cleaning up old caches.
  self.addEventListener('activate', (event) => {
    const currentCaches = [PRECACHE, RUNTIME]
    console.log('activate cache')
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return cacheNames.filter(
            (cacheName) => !currentCaches.includes(cacheName)
          )
        })
        .then((cachesToDelete) => {
          console.log('cache is deleting')
          return Promise.all(
            cachesToDelete.map((cacheToDelete) => {
              return caches.delete(cacheToDelete)
            })
          )
        })
        .then(() => self.clients.claim()) // Remove if you want to add update popup
    )
  })

  // The fetch handler serves responses for same-origin resources from a cache.
  // If no response is found, it populates the runtime cache with the response
  // from the network before returning it to the page.
  self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          return caches.open(RUNTIME).then((cache) => {
            return fetch(event.request, {

            }).then((response) => {
              // Put a copy of the response in the runtime cache.
              return cache.put(event.request, response.clone()).then(() => {
                return response
              })
            })
          })
        })
      )
    }
  })
} catch (e) {
  console.log(e)
}
