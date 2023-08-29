const myApp = "promise-App-v1"; //name of cache
const assets = [
    "/",
    "./index.html",
    "./sass/main.css",
    "./app.js",
    "./images/favicon.ico"
]
//self mean the serviec worker itself
self.addEventListener("install", (installEvent) => {
    installEvent.waitUntil(
        caches.open(myApp).then((cache) => {
            cache.addAll(assets);
        })
    )
})


// now we need to fetch the assets
self.addEventListener("fetch", (fetchEvent) => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then((res) => {
            return res || fetch(fetchEvent.request);
        })
    )
})