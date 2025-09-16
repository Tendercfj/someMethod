import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',     // 自动检查 sw 更新
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,ico}'],
        // 不要自动生成 precache，我们自己写 sw.ts
        swSrc: 'sw.ts',
        swDest: 'dist/sw.js',         // 输出到最终目录
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MB
      },
      injectRegister: 'auto',         // 自动生成注册代码
      devOptions: {
        enabled: true,                // dev 阶段也启用 sw
        type: 'module',               // sw.ts 用 esm
      },
    }),
  ],
});