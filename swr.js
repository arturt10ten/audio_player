setTimeout(()=>{
if('serviceWorker' in navigator){
  registration=navigator.serviceWorker.register('./sw.js');
  registration.then(function(swRegistration) {
    console.log('sw ready');
    return swRegistration.sync.register('sync');
  }).then(function(i) {
    console.log(i);
  });
}
},10000);
