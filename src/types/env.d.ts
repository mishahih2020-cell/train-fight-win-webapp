export {}

declare global {
  // Injected by vite.config.ts `define` — the short git commit hash of this build.
  const __APP_VERSION__: string
}

interface ImportMetaEnv {
  /** Backend base URL, e.g. https://api.maratfightclub.com — unset means "no server yet". */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
