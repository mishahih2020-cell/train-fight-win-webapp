const SESSION_KEY = 'mfc-admin-authed'

// TEMP, client-side-only gate: there's no server yet, so this can't be real
// security — the password is visible to anyone who opens the bundle in
// devtools. Move this to a real server-side session once one exists (see
// src/db/README.md). Do not put anything actually sensitive behind it.
export const ADMIN_PASSWORD = '2617'

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
}
