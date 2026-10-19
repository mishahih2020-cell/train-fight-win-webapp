import { apiFetch } from '@/lib/apiClient'
import type { Repo } from './localStore'

async function json<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>
}

/**
 * Fetch-backed version of the generic per-user tables (weight_log,
 * workout_log, meals, bonus_ledger on the server) — same shape as
 * `createRepo` in localStore.ts, see src/db/README.md.
 */
export function createHttpRepo<T extends { id: string }>(endpoint: string): Repo<T> {
  return {
    async list() {
      const res = await apiFetch(endpoint)
      if (!res.ok) throw new Error(`GET ${res.url} failed (${res.status})`)
      return json<T[]>(res)
    },
    async get(id) {
      const rows = await this.list()
      return rows.find((row) => row.id === id)
    },
    async add(row) {
      await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(row) })
      return row
    },
    async update(id, patch) {
      const res = await apiFetch(`${endpoint}/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
      if (!res.ok) return undefined
      const current = await this.get(id)
      return current ? ({ ...current, ...patch } as T) : undefined
    },
    async remove(id) {
      await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' })
    },
    async replaceAll() {
      // Not used by any current call site for these tables — bulk replace
      // isn't exposed by the backend on purpose (it'd have to mean "wipe
      // and re-insert everything", which no screen actually needs here).
    },
  }
}

/**
 * Courses are special: the catalog row (title/price/...) is shared by
 * everyone and only the admin panel edits it (PUT /api/admin/courses/:id),
 * while `purchased`/`progress` are this user's own and go through
 * PATCH /api/courses/:id/progress. Both flow through the same
 * `coursesRepo.update(id, patch)` call on the client (see CourseDetailPage,
 * WorkoutSessionPage vs admin/pages/CoursesPage) — this adapter looks at
 * which fields are in the patch to route to the right one.
 */
export function createCoursesHttpRepo<T extends { id: string }>(): Repo<T> {
  const repo: Repo<T> = {
    async list() {
      const res = await apiFetch('/api/courses')
      if (!res.ok) throw new Error(`GET ${res.url} failed (${res.status})`)
      return json<T[]>(res)
    },
    async get(id) {
      const rows = await repo.list()
      return rows.find((row) => row.id === id)
    },
    async add(row) {
      await apiFetch(`/api/admin/courses/${row.id}`, { method: 'PUT', body: JSON.stringify(row) })
      return row
    },
    async update(id, patch) {
      const patchKeys = Object.keys(patch)
      const isCatalogEdit = patchKeys.some((k) => ['title', 'subtitle', 'description', 'price'].includes(k))
      if (isCatalogEdit) {
        const current = await repo.get(id)
        const merged = { ...current, ...patch } as T
        await apiFetch(`/api/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(merged) })
        return merged
      }
      await apiFetch(`/api/courses/${id}/progress`, { method: 'PATCH', body: JSON.stringify(patch) })
      const current = await repo.get(id)
      return current ? ({ ...current, ...patch } as T) : undefined
    },
    async remove(id) {
      await apiFetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    },
    async replaceAll() {
      // Not used — courses are added/removed/edited one at a time.
    },
  }
  return repo
}

/** Starter templates (everyone's) + this user's own, see server/src/routes/workouts.ts. */
export function createWorkoutsHttpRepo<T extends { id: string }>(): Repo<T> {
  return {
    async list() {
      const res = await apiFetch('/api/workouts')
      if (!res.ok) throw new Error(`GET ${res.url} failed (${res.status})`)
      return json<T[]>(res)
    },
    async get(id) {
      const rows = await this.list()
      return rows.find((row) => row.id === id)
    },
    async add(row) {
      await apiFetch('/api/workouts', { method: 'POST', body: JSON.stringify(row) })
      return row
    },
    async update() {
      return undefined
    },
    async remove(id) {
      await apiFetch(`/api/workouts/${id}`, { method: 'DELETE' })
    },
    async replaceAll() {},
  }
}

/** Read for everyone, add/remove admin-only — see server/src/routes/wheelSegments.ts + admin.ts. */
export function createWheelSegmentsHttpRepo<T extends { id: string }>(): Repo<T> {
  return {
    async list() {
      const res = await apiFetch('/api/wheel-segments')
      if (!res.ok) throw new Error(`GET ${res.url} failed (${res.status})`)
      return json<T[]>(res)
    },
    async get(id) {
      const rows = await this.list()
      return rows.find((row) => row.id === id)
    },
    async add(row) {
      await apiFetch('/api/admin/wheel-segments', { method: 'POST', body: JSON.stringify(row) })
      return row
    },
    async update(id, patch) {
      await apiFetch(`/api/admin/wheel-segments/${id}`, { method: 'PUT', body: JSON.stringify(patch) })
      const current = await this.get(id)
      return current ? ({ ...current, ...patch } as T) : undefined
    },
    async remove(id) {
      await apiFetch(`/api/admin/wheel-segments/${id}`, { method: 'DELETE' })
    },
    async replaceAll() {},
  }
}

/** Read for everyone, add/update/remove admin-only — see server/src/routes/promoCodes.ts + admin.ts. */
export function createPromoCodesHttpRepo<T extends { id: string }>(): Repo<T> {
  return {
    async list() {
      const res = await apiFetch('/api/promo-codes')
      if (!res.ok) throw new Error(`GET ${res.url} failed (${res.status})`)
      return json<T[]>(res)
    },
    async get(id) {
      const rows = await this.list()
      return rows.find((row) => row.id === id)
    },
    async add(row) {
      const r = row as unknown as { id: string; discountPercent: number; active: boolean }
      await apiFetch(`/api/admin/promo-codes/${r.id}`, {
        method: 'PUT',
        body: JSON.stringify({ discountPercent: r.discountPercent, active: r.active }),
      })
      return row
    },
    async update(id, patch) {
      const current = await this.get(id)
      const merged = { ...current, ...patch } as unknown as { discountPercent: number; active: boolean }
      await apiFetch(`/api/admin/promo-codes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ discountPercent: merged.discountPercent, active: merged.active }),
      })
      return merged as unknown as T
    },
    async remove(id) {
      await apiFetch(`/api/admin/promo-codes/${id}`, { method: 'DELETE' })
    },
    async replaceAll() {},
  }
}

/** Create-only for the current user — see server/src/routes/orders.ts. */
export function createOrdersHttpRepo<T extends { id: string }>(): Repo<T> {
  return {
    async list() {
      const res = await apiFetch('/api/orders')
      if (!res.ok) throw new Error(`GET ${res.url} failed (${res.status})`)
      return json<T[]>(res)
    },
    async get(id) {
      const rows = await this.list()
      return rows.find((row) => row.id === id)
    },
    async add(row) {
      // Throwing (rather than silently echoing `row` back) matters here
      // specifically: this is a course purchase — a caller that doesn't
      // check the result would otherwise think it succeeded and grant
      // access to a course that was never actually recorded as bought.
      const res = await apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(row) })
      if (!res.ok) throw new Error(`POST /api/orders failed (${res.status})`)
      return json<T>(res)
    },
    async update() {
      return undefined
    },
    async remove() {},
    async replaceAll() {},
  }
}
