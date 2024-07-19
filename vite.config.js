import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  build: { },
  plugins: [
    // TODO: compression plugin
    react(),
    VitePWA({
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,webp,svg,ico}'],
        // TODO: revisit, throw error during build if too large?
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        sourcemap: true,
      },
    }),
    svgrPlugin(),
  ].filter(Boolean),
  test: {
    environment: "jsdom",
    setupFiles: ['tests/unit/setup.js'],
    reporter: ['junit', 'html', 'default'],
    outputFile: {
      junit: 'reports/unit/junit.xml',
      html: 'reports/unit/index.html',
    },
  },
});
