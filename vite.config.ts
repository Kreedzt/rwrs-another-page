import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    proxy: {
      // use rwrs-server
      '/api': {
        target: 'http://localhost:5800',
        changeOrigin: true
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
