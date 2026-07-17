/**
 * KidsLab Service Worker — 源码模板。
 * 构建时由 scripts/build.mjs 的 emitServiceWorker() 替换占位符、压缩后
 * 生成仓库根目录 sw.js（入库构建产物，与 courseware/ 同约定）。
 *
 * 缓存分层：
 *   kidslab-shell-<hash>   主站壳预缓存（index.html + assets + 课件清单）。
 *                          版本 = 预缓存内容整体 hash，发版自动换名并清理旧缓存。
 *   kidslab-courseware     课件运行时缓存（cache-on-visit）。跨版本保留：
 *                          联网重访即覆盖为新内容，断网时兜底回放。
 *
 * fetch 策略（仅拦截同源 GET，其余直透 —— analytics POST 离线自然丢弃）：
 *   导航请求 / courseware/**  → network-first(超时) → 缓存兜底：
 *                              在线永远最新（发版不"粘死"），离线可重玩。
 *   ?v= 指纹资源             → cache-first：指纹变即新 URL，天然失效。
 *
 * 更新策略保守：不 skipWaiting，新版本等所有页面关闭后接管，
 * 避免孩子玩到一半被刷新；内容新鲜度由 network-first 保证，不依赖 SW 换代。
 */
'use strict';

const VERSION = '__CACHE_VERSION__';
const SHELL_CACHE = `kidslab-shell-${VERSION}`;
const COURSEWARE_CACHE = 'kidslab-courseware';
const PRECACHE = __PRECACHE__;
const NETWORK_TIMEOUT_MS = 3500;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((n) => n.startsWith('kidslab-shell-') && n !== SHELL_CACHE)
          .map((n) => caches.delete(n)),
      );
      /* 首装即接管现有页面，让当次会话开始 cache-on-visit（不会刷新页面） */
      await self.clients.claim();
    })(),
  );
});

/** 带超时的网络请求；成功响应写入指定缓存（cache-on-visit） */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetchWithTimeout(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request, { ignoreSearch: false });
    if (cached) return cached;
    /* 导航离线兜底：返回预缓存主页（如深链主站路由） */
    if (request.mode === 'navigate') {
      const shell = await caches.match('./');
      if (shell) return shell;
    }
    throw err;
  }
}

function fetchWithTimeout(request) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('network timeout')), NETWORK_TIMEOUT_MS);
    fetch(request).then(
      (res) => { clearTimeout(timer); resolve(res); },
      (err) => { clearTimeout(timer); reject(err); },
    );
  });
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(SHELL_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const scopePath = new URL(self.registration.scope).pathname;
  const rel = url.pathname.startsWith(scopePath) ? url.pathname.slice(scopePath.length) : null;
  if (rel === null) return;

  /* 课件资源：network-first + 运行时缓存（玩过即可离线重玩，且发版不粘死） */
  if (rel.startsWith('courseware/') && rel !== 'courseware/index.json') {
    event.respondWith(networkFirst(request, COURSEWARE_CACHE));
    return;
  }

  /* 导航（主站页）与课件清单：network-first + 壳缓存兜底 */
  if (request.mode === 'navigate' || rel === 'courseware/index.json' || rel === '' || rel === 'index.html') {
    event.respondWith(networkFirst(request, SHELL_CACHE));
    return;
  }

  /* 带内容指纹或壳静态资源：cache-first（指纹变即新 URL） */
  event.respondWith(cacheFirst(request));
});
