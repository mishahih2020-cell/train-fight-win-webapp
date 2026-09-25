const RELOAD_FLAG_KEY = 'marat-fight-club:reloaded-for-version'

/**
 * GitHub Pages serves index.html with `Cache-Control: max-age=600`, and
 * Telegram's in-app WebView caches on top of that — a new deploy can sit
 * unreached by already-open/cached sessions well past 10 minutes. This
 * fetches the freshly-deployed version.json (bypassing cache) and force
 * -reloads to a cache-busted URL if it doesn't match the version baked
 * into the bundle that's currently running.
 */
async function checkForUpdate() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}version.json?_=${Date.now()}`, {
      cache: 'no-store',
    })
    if (!res.ok) return
    const data: { version?: string } = await res.json()
    if (!data.version || data.version === __APP_VERSION__) return

    // Guard against a reload loop if something's still stuck stale after
    // one hop (e.g. an intermediate cache that ignores no-store too) —
    // try once per version per session, then give up quietly.
    let alreadyTried: string[] = []
    try {
      alreadyTried = JSON.parse(sessionStorage.getItem(RELOAD_FLAG_KEY) ?? '[]')
    } catch {
      // ignore malformed/blocked storage
    }
    if (alreadyTried.includes(data.version)) return
    try {
      sessionStorage.setItem(RELOAD_FLAG_KEY, JSON.stringify([...alreadyTried, data.version]))
    } catch {
      // storage blocked — still safe to proceed with the reload itself
    }

    const url = new URL(window.location.href)
    url.searchParams.set('_v', data.version)
    window.location.replace(url.toString())
  } catch {
    // offline / request blocked — just keep running the current version
  }
}

export function initVersionCheck() {
  checkForUpdate()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate()
  })
}
