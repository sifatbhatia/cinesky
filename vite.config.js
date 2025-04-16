import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://weather-app-backend-4a2p.onrender.com/api/v1',
        changeOrigin: true
      }
    }
  },
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
}) 