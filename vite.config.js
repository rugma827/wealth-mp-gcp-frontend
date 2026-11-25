import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/meeting-prep': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        proxyTimeout: 600_000,
        timeout: 600_000,
      },
      '/assist': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        proxyTimeout: 600_000,
        timeout: 600_000,
      },
    },
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "connect-src 'self' http://localhost:8000 ws://localhost:8000 https://*.run.app https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com",
        "frame-ancestors 'none'",
        "object-src 'none'",
      ].join('; '),
    },
  },
});
