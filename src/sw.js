/* global workbox */

self.addEventListener('message', (e) => {
  if (!e.data) return

  switch (e.data) {
    case 'skipWaiting':
      self.skipWaiting()
      break
    default:
      break
  }
})

workbox.clientsClaim()

// The precaching code provided by Workbox.
self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
workbox.routing.registerNavigationRoute('/')
