var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  './',
  './uploaded/p/',
  './dh.css',
  './drive.html',
  './drive.js',
  './edit.css',
  './edit.html',
  './edit.js',
  './index.html',
  './list.css',
  './main.js',
  './player.css',
  './player.html',
  './player.js',
  './swr.js',
  './res/cloud-computing.svg',
  './res/left-arrow.svg',
  './res/rubbish-bin.svg',
];

async function sw_fetch(request){
  let response=await caches.match(request);
  if(response){
    return response;
  }
  var fetchRequest = request.clone();
  response=await fetch(fetchRequest);
  return response;
}

self.addEventListener('install',function(event){
  event.waitUntil((async ()=>{
    let cache=await caches.open(CACHE_NAME);
    console.log('Opened cache');
    return await cache.addAll(urlsToCache);
  })());
});

this.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key!=CACHE_NAME) {
          if(key[0]!="p"){
            return caches.delete(key);
          }
        }
      }));
    })
  );
});

self.addEventListener('fetch',function(event){
  event.respondWith(sw_fetch(event.request));
});
self.addEventListener('sync', function(event){
  event.waitUntil((async ()=>{
    console.log('sync begin');
    console.log(event);
    let c=await caches.open(CACHE_NAME);
    let res=await c.addAll(urlsToCache);
    console.log('sync end');
    return;
  })());
});

addEventListener('backgroundfetchsuccess',(event)=>{
  const bgFetch=event.registration;
  event.waitUntil(async function(){
    const cache=await caches.open('pl_'+bgFetch.id);
    const records=await bgFetch.matchAll();
    const promises=records.map(async (record) => {
      const response=await record.responseReady;
      await cache.put(record.request,response);
    });
    await Promise.all(promises);
    event.updateUI({title:'done'});
  }());
});
