import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
        timeout: 180000,        // ← เพิ่มบรรทัดนี้
        proxyTimeout: 180000,   // ← และบรรทัดนี้
      }
    }
  }
})

