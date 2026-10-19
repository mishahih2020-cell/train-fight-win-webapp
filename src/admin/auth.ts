import { API_BASE, apiUrl } from '@/lib/apiClient'

const SESSION_KEY = 'mfc-admin-authed'

// TEMP, client-side-only gate — only used as a fallback while no backend
// is configured yet (current production build). The password is visible to
// anyone who opens the bundle in devtools; once VITE_API_BASE_URL is set,
// `login()` below calls the real server-side session instead (see
// server/src/routes/admin.ts) and this constant stops being used at all.
export const ADMIN_PASSWORD = '2617'

/** Real check when a backend is configured, the old client-only one otherwise. */
export async function login(password: string): Promise<boolean> {
  if (!API_BASE) {
    const ok = password === ADMIN_PASSWORD
    if (ok) setAdminAuthed()
    return ok
  }
  const res = await fetch(apiUrl('/api/admin/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  })
  if (res.ok) setAdminAuthed()
  return res.ok
}

export function isAdminAuthed() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function setAdminAuthed() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // storage blocked — auth just won't survive a reload
  }
}

export function clearAdminAuthed() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
  if (API_BASE) {
    void fetch(apiUrl('/api/admin/logout'), { method: 'POST', credentials: 'include' })
  }
}
