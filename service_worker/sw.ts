/**
 * /// <reference … />
  告诉 TS 编译器“这是 Service Worker 上下文”，self 类型才是 ServiceWorkerGlobalScope，否则 importScripts、clients 等会报红。
 */


/// <reference types="vite-plugin-pwa/client" />
/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import {
  StaleWhileRevalidate,
  NetworkFirst,
  CacheFirst,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare let self: ServiceWorkerGlobalScope;


/**
 * precacheAndRoute(self.__WB_MANIFEST)
Vite 在 build 阶段会把所有带哈希的静态文件列表注入成数组，workbox-precaching 会一次性写进 Cache Storage，并自动拦截这些 URL 的 fetch 事件，走“缓存优先”。
 */
/* 1. 预缓存：build 时 Vite 会把所有静态资源清单注入 self.__WB_MANIFEST */
precacheAndRoute(self.__WB_MANIFEST);


/**
 * cleanupOutdatedCaches()
只保留当前白名单内的缓存（默认 /^workbox-/，可配置），解决“发版后旧缓存仍占空间”问题。
 */
/* 2. 激活阶段：删掉旧缓存（防止“老毒缓存”） */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      cleanupOutdatedCaches();          // Workbox 提供的白名单清理
      // 让新 SW 立即控制当前所有标签页，否则需要用户再次导航或刷新才生效。
      await self.clients.claim();       // 立即接管所有已打开标签页
    })()
  );
});



/**
 * registerRoute(…)
Workbox 的“路由 + 策略”写法，等价于手写 self.addEventListener('fetch', …)，但可读性高、易维护。
ExpirationPlugin
给“运行时缓存”加 LRU 淘汰：达到 maxEntries 或 maxAgeSeconds 自动删除最久未用条目，防止存储爆炸。
 */
/* 3. 运行时缓存策略 ---------------------------------------------------- */

/* 3-1 HTML：Stale-While-Revalidate —— 先给旧页面，后台静默更新 */
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({
    cacheName: 'html-cache-v1',
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 86400 }), // 1 天
    ],
  })
);

/* 3-2 API：NetworkFirst —— 优先网络，3 s 超时降级缓存 */
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache-v1',
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 300 }), // 5 分钟
    ],
  })
);

/* 3-3 静态资源（js/css/woff2）：CacheFirst —— 带哈希，永久缓存 */
registerRoute(
  ({ request }) =>
    ['style', 'script', 'font'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-cache-v1',
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 31536000 }), // 1 年
    ],
  })
);

/* 3-4 图片：CacheFirst + 数量上限，防存储爆炸 */
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache-v1',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 7776000 }), // 90 天
    ],
  })
);

/* 4. 离线回退：任何导航 404 时返回离线页面 */
const OFFLINE_PAGE = '/offline.html';
/**
 * 离线回退 NavigationRoute
当用户断网且本地也没有对应 HTML 时，返回事先预缓存好的 /offline.html，体验更友好。
 * 
 */
const navRoute = new NavigationRoute(
  async ({ event }) => {
    try {
      return await fetch(event.request);
    } catch {
      const cache = await caches.open('html-cache-v1');
      return (await cache.match(OFFLINE_PAGE)) || Response.error();
    }
  },
  { allowlist: [/^\/(?!api).*/] } // 仅前端路由，排除 /api/*
);
registerRoute(navRoute);

/* 5. 可选：skipWaiting + 强制刷新，开发体验更好 */
/**
 * skipWaiting()
不让新 SW 停留在 “waiting” 状态，直接激活；配合 clients.claim() 实现“刷新即最新”。

 */
self.skipWaiting();