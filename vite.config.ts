/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Server-side only (no VITE_ prefix): never included in the browser bundle.
  const posProxyTarget = loadEnv(mode, process.cwd(), '').POS_API_PROXY_TARGET;

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    // Development only: forwards /api/pos/* to the POS API so the browser avoids CORS.
    // Production needs an equivalent proxy on the hosting server (see POS_INTEGRATION.md).
    server: posProxyTarget
      ? {
          proxy: {
            '/api/pos': {
              target: posProxyTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/pos/, ''),
            },
          },
        }
      : undefined,
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: { modules: { classNameStrategy: 'non-scoped' } },
    },
  };
});
