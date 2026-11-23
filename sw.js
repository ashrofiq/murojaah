var C="murajaah-v13",T="murajaah-set",F=["./","index.html","manifest.json","icon.svg","icon-192.png","icon-512.png","favicon-32.png","apple-touch-icon.png"];
function pad(n){return n<10?"0"+n:""+n}
function get(k){return caches.open(T).then(function(c){return c.match(k)}).then(function(r){return r?r.json():null})}
function put(k,o){return caches.open(T).then(function(c){return c.put(k,new Response(JSON.stringify(o)))})}
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return Promise.all(F.map(function(u){return c.add(u).catch(function(){})}))}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C&&x!==T}).map(function(x){return caches.delete(x)}))}));self.clients.claim()});
self.addEventListener("fetch",function(e){
 if(e.request.method!=="GET")return;
 if(new URL(e.request.url).origin!==self.location.origin)return;
 e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(C).then(function(ch){ch.put(e.request,c)});return r}).catch(function(){return caches.match(e.request)}))});
// Pengingat harian (Periodic Background Sync, hanya di Chrome Android untuk aplikasi terinstal)
function remind(){
 var n=new Date(),td=n.getFullYear()+"-"+pad(n.getMonth()+1)+"-"+pad(n.getDate()),hm=pad(n.getHours())+":"+pad(n.getMinutes());
 return Promise.all([get("rem.json"),get("last.json")]).then(function(a){var s=a[0],l=a[1];
  if(!s||!s.on||(l&&l.d===td))return;
  var pend=s.date===td?s.pend:true;
  if(!pend||hm<s.time)return;
  return put("last.json",{d:td}).then(function(){return self.registration.showNotification("Waktunya murajaah 🌙",{body:"Target hari ini menunggu. Sedikit tapi rutin.",icon:"icon.svg",badge:"icon.svg",tag:"murajaah"})})})}
self.addEventListener("periodicsync",function(e){if(e.tag==="remind")e.waitUntil(remind())});
self.addEventListener("notificationclick",function(e){e.notification.close();
 e.waitUntil(clients.matchAll({type:"window"}).then(function(l){return l.length?l[0].focus():clients.openWindow("./")}))});
