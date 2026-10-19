/**
 * Base URL of the real backend. Unset (as in the current production
 * build) means "no server yet" — every repo/context falls back to the
 * existing localStorage-only behaviour, so nothing about today's deployed
 * app changes until this is set (at build time) and the site is rebuilt.
 * See server/README.md for what has to be true first (domain + HTTPS).
 */
export const API_BASE: string | undefined = import.meta.env.VITE_API_BASE_URL

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`
}

export interface LoginResult {
  loggedIn: boolean
  /** True only the very first time this Telegram account ever logs in — see AppStateContext's server sync. */
  isNewUser: boolean
}

let loginPromise: Promise<LoginResult> | null = null

/**
 * Logs the current Telegram user into the backend (creating the row on
 * first launch) using the signed `initData` Telegram attaches to the
 * WebApp launch. Safe to call repeatedly — only runs once per page load.
 */
export function ensureLoggedIn(): Promise<LoginResult> {
  if (!API_BASE) return Promise.resolve({ loggedIn: false, isNewUser: false })
  if (loginPromise) return loginPromise

  const initData = window.Telegram?.WebApp?.initData
  if (!initData) {
    loginPromise = Promise.resolve({ loggedIn: false, isNewUser: false })
    return loginPromise
  }

  loginPromise = fetch(apiUrl('/api/auth/telegram'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ initData }),
  })
    .then(async (r) => (r.ok ? { loggedIn: true, isNewUser: Boolean((await r.json()).isNewUser) } : { loggedIn: false, isNewUser: false }))
    .catch(() => ({ loggedIn: false, isNewUser: false }))

  return loginPromise
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  await ensureLoggedIn()
  return fetch(apiUrl(path), {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}
