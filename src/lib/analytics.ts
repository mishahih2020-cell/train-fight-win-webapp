import { API_BASE, apiFetch } from './apiClient'

/**
 * Fires a lightweight, best-effort usage event to the backend. A no-op
 * while no server is configured (current production build) — same
 * "prepared but inactive" pattern as the rest of the server integration,
 * see src/db/repos.ts. Never awaited by callers: a dropped event is fine,
 * blocking the UI on it is not.
 */
export function track(type: string, metadata?: Record<string, unknown>) {
  if (!API_BASE) return
  void apiFetch('/api/events', { method: 'POST', body: JSON.stringify({ type, metadata: metadata ?? {} }) }).catch(() => {
    // offline/unreachable — losing one analytics event is fine
  })
}
