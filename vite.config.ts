import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Identifies this exact build so the running app can tell it's stale and
// force itself to reload — see src/lib/versionCheck.ts for why: GitHub
// Pages caches index.html for 10 minutes, and Telegram's in-app WebView
// caches on top of that, so a new deploy alone doesn't reach users fast.
const appVersion = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return String(Date.now())
  }
})()

// Writes dist/version.json from the exact same value baked into the JS
// bundle via `define`, so the two can never drift apart.
function versionFilePlugin(): Plugin {
  return {
    name: 'write-version-file',
    closeBundle() {
      writeFileSync(path.resolve(import.meta.dirname, 'dist/version.json'), JSON.stringify({ version: appVersion }))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/train-fight-win-webapp/',
  // Telegram's in-app WebView (especially the Android system WebView on older
  // phones) is far less current than a desktop browser — target a safer
  // baseline so the bundle doesn't silently fail to parse there.
  build: {
    target: 'es2018',
  },
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [react(), tailwindcss(), versionFilePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: true,
  },
})
