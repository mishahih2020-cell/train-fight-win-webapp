import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/train-fight-win-webapp/',
  // Telegram's in-app WebView (especially the Android system WebView on older
  // phones) is far less current than a desktop browser — target a safer
  // baseline so the bundle doesn't silently fail to parse there.
  build: {
    target: 'es2018',
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: true,
  },
})
