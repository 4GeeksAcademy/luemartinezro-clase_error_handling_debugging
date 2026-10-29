import { defineConfig } from 'vite';

// El frontend corre en su propio puerto y habla con el backend vía proxy.
export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});