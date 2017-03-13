var dataCacheName = 'conferenceData-v1';
var cacheName = 'conferenceApp-1';
var filesToCache = [
	'/',
	'/index.html',
	'/scripts/app.js'
];

self.addEventListener('install', function(e) {
	console.log('ServiceWorker Install');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('ServiceWorker Caching app shell');
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('activate', function(e) {
	console.log('ServiceWorker Activate');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName && key !== dataCacheName) {
					console.log('ServiceWorker Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
	var dataUrl = 'http://127.0.0.1:8080/conference.json';
	// when it's the dataUrl we always want to get fresh data
	if (e.request.url.indexOf(dataUrl) > -1) {
		e.respondWith(
			caches.open(dataCacheName).then(function(cache) {
				return fetch(e.request).then(function(response){
					cache.put(e.request.url, response.clone());
					return response;
				});
			})
		);
	} else {
		e.respondWith(
			caches.match(e.request).then(function(response) {
				return response || fetch(e.request);
			})
		);
	}
});