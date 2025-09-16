# Service Worker - 使用步骤

- 一般是用来配置pwa项目的离线缓存，提升用户体验。

## 安装依赖

```bash
pnpm add -D vite-plugin-pwa workbox-precaching workbox-routing workbox-strategies workbox-expiration workbox-cacheable-response
```

## sw.ts

- 把 sw.ts 放到项目根目录，并新建 public/offline.html（离线兜底页）。

## 运行

```bash
pnpm dev          # 开发模式，DevTools → Application → Service Workers 可见
pnpm build        # 生成 dist，sw.js 已带版本哈希
pnpm preview      # 本地验证离线：Network 面板勾选 Offline，刷新仍秒开
```
