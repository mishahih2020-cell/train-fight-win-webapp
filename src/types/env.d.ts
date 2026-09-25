export {}

declare global {
  // Injected by vite.config.ts `define` — the short git commit hash of this build.
  const __APP_VERSION__: string
}
