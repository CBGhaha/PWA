var cacheStorageKey = 'minimal-pwa5'
var cacheList=[
  '/index.html',
  '/main.css',

]
//监听service的install事件 缓存资源
self.addEventListener('install',e =>{
  //等待
  e.waitUntil(
    //建立了一个缓存版本
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))//想要加入缓存的资源列表
    .then(() => self.skipWaiting())
  )
})






//自定义页面请求响应 监听fetch事件
this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // 来来来，代理可以搞一些代理的事情

            // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
            if (response) {
                return response;
            }

            // 如果 service worker 没有返回，那就得直接请求真实远程服务
            var request = event.request.clone(); // 把原始请求拷过来
            return fetch(request).then(function (httpRes) {

                // http请求的返回已被抓到，可以处置了。

                // 请求失败了，直接返回失败的结果就好了。。
                if (!httpRes || httpRes.status !== 200) {
                    return httpRes;
                }
                //请求成功的话，将请求缓存起来。
                var responseClone = httpRes.clone();
                caches.open(cacheStorageKey).then(function (cache) {
                    cache.put(event.request, responseClone);
                });

                return httpRes;
            });
        })
    );
});


// //serviceWorker更新 在修改了业务代码后让缓存更新 serviceWorker新版本时 旧版本仍然在运行
// // 当前版本处于waiting状态  所以在install serviceWorker时 将当前版本skipWaiting（） 至activate激活
// self.addEventListener('activate', function (event) {
//     event.waitUntil(
//         Promise.all([
//
//             // 更新客户端
//             self.clients.claim(),
//
//             // 清理旧版本
//             caches.keys().then(function (cacheList) {
//                 return Promise.all(
//                     cacheList.map(function (cacheName) {
//                         if (cacheName !==cacheStorageKey) {
//                             return caches.delete(cacheName);
//                         }
//                     })
//                 );
//             })
//         ])
//     );
// });

self.addEventListener('activate',function(e){
  e.waitUntil(
    //获取所有cache名称
    caches.keys().then(cacheNames => {
      return Promise.all(
        // 获取所有不同于当前版本名称cache下的内容
        cacheNames.filter(cacheNames => {
          return cacheNames !== cacheStorageKey
        }).map(cacheNames => {
          return caches.delete(cacheNames)
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})
