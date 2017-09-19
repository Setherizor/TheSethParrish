var CACHE_NAME = 'my-site-cache-v1'
var urlsToCache = [
    // '/',
    // '/index.html',
    // 'css/style.css',
    // 'css/nav.css',
    // '/index.js'
]

// Perform install steps
self.addEventListener('install', function (event) {
    // Perform install steps
  event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
              console.log('Opened cache')
              return cache.addAll(urlsToCache)
            })
    )
})

self.addEventListener('activate', function (event) {
  var cacheWhitelist = ['NONE']
  event.waitUntil(
        caches.keys().then(function (cacheNames) {
          return Promise.all(
                cacheNames.map(function (cacheName) {
                  if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName)
                  }
                })
            )
        })
    )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
        caches.match(event.request).then(function (response) {
            // Cache hit - return response
          if (response) {
            return response
          }

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
          var fetchRequest = event.request.clone()

          return fetch(fetchRequest).then(
                function (response) {
                    // Check if we received a valid response
                  if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response
                  }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                  var responseToCache = response.clone()

                  caches.open(CACHE_NAME)
                        .then(function (cache) {
                          cache.put(event.request, responseToCache)
                        })
                  return response
                }
            )
        })
    )
})

// Database based notifications
importScripts('/__/firebase/3.7.4/firebase-app.js')
importScripts('/__/firebase/3.7.4/firebase-auth.js')
importScripts('/__/firebase/3.7.4/firebase-database.js')
importScripts('/__/firebase/init.js')

/*
self.addEventListener('message', function (evt) {
    console.log('SW received: ', evt.data);
    firebase.database().ref('notify/' + evt.data).once('value').then(function (snapshot) {
        var current = snapshot.val();
        console.log(current);
    });
});
*/

// self.addEventListener('message', function (evt) {
//   console.log('SW received: ', evt.data);
var URL = ''
firebase.database().ref('notify/').on('value', function (snapshot) {
  var val = snapshot.val()
  if (val.send === 'true') {
    title = val.title
    icon = val.icon
    body = val.body
    URL = val.URL

    registration.showNotification(title, {
      icon: icon,
      body: body,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      tag: 'vibration-sample-Seff'
    })

        // Set sent to false
    firebase.database().ref('notify/send').set('false')
    console.log('SW notification sent')
  } else if (val.send !== 'false') {
        // Data validation
    firebase.database().ref('notify/send').set('false')
  }
})

self.addEventListener('notificationclick', function (event) {
  let url = URL
  event.notification.close() // Android needs explicit close.
  event.waitUntil(
        clients.matchAll({
          type: 'window'
        }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
          for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i]
                // If so, just focus it.
            if (client.url === url && 'focus' in client) {
              return client.focus()
            }
          }
            // If not, then open the target URL in a new window/tab.
          if (clients.openWindow) {
            return clients.openWindow(url)
          }
        })
    )
})
