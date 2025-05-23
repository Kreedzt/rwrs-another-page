import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  server: {
    proxy: {
      // use rwrs-server
      '/api': {
        target: 'http://localhost:5800',

        // target: 'https://rwrs.kreedzt.cn/',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
});
