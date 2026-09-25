const PREFIX = 'mfc:db:'

function readTable<T>(name: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + name)
    if (raw === null) {
      localStorage.setItem(PREFIX + name, JSON.stringify(seed))
      return seed
    }
    return JSON.parse(raw)
  } catch {
    // storage blocked/unavailable — fall back to in-memory-only for this session
    return seed
  }
}

function writeTable<T>(name: string, rows: T[]) {
  try {
    localStorage.setItem(PREFIX + name, JSON.stringify(rows))
  } catch {
    // storage blocked — change just won't survive a reload
  }
}

export interface Repo<T extends { id: string }> {
  list: () => Promise<T[]>
  get: (id: string) => Promise<T | undefined>
  add: (row: T) => Promise<T>
  update: (id: string, patch: Partial<T>) => Promise<T | undefined>
  remove: (id: string) => Promise<void>
  replaceAll: (rows: T[]) => Promise<void>
}

/**
 * A tiny "table" backed by localStorage, with an async, server-shaped API
 * (list/get/add/update/remove) so every call site already looks exactly
 * like it would against a real backend. Swapping the implementation to
 * `fetch('/api/<table>')` later is a one-file change — nothing that calls
 * a repo needs to change. See src/db/README.md.
 */
export function createRepo<T extends { id: string }>(table: string, seed: T[]): Repo<T> {
  let cache: T[] | null = null
  const load = () => {
    if (!cache) cache = readTable(table, seed)
    return cache
  }
  const persist = () => writeTable(table, cache ?? [])

  return {
    async list() {
      return [...load()]
    },
    async get(id) {
      return load().find((row) => row.id === id)
    },
    async add(row) {
      load().push(row)
      persist()
      return row
    },
    async update(id, patch) {
      const rows = load()
      const index = rows.findIndex((row) => row.id === id)
      if (index === -1) return undefined
      rows[index] = { ...rows[index], ...patch }
      persist()
      return rows[index]
    },
    async remove(id) {
      cache = load().filter((row) => row.id !== id)
      persist()
    },
    async replaceAll(rows) {
      cache = rows
      persist()
    },
  }
}
