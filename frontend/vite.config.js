import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true, // 🔥 Esto obligará a Vite a detectar tus cambios de código
    },
    proxy: {
      '/api': {
        target: 'http://backend:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
