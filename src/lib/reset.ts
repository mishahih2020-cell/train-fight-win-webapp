const APP_STATE_KEY = 'marat-fight-club:v1'
const DB_PREFIX = 'mfc:db:'

/**
 * Wipes everything this app itself wrote to localStorage (profile, onboarding
 * flags, and every local "table" under src/db) and reloads — the same end
 * state as a brand-new install, so onboarding/the entrance animation/the
 * first-run tour all play again. Deliberately leaves the admin panel's own
 * sessionStorage auth alone (different storage, different concern).
 */
export function resetAppData() {
  try {
    const keys = Object.keys(localStorage).filter((k) => k === APP_STATE_KEY || k.startsWith(DB_PREFIX))
    keys.forEach((k) => localStorage.removeItem(k))
  } catch {
    // storage unavailable — nothing to clear, just reload
  }
  window.location.href = import.meta.env.BASE_URL
}
