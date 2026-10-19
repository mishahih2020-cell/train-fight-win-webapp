import { useCallback, useEffect, useState } from 'react'
import type { Repo } from './localStore'

/**
 * Loads a repo's full list and exposes a `reload()` to re-sync after a
 * write. `error` is set when `list()` rejects (e.g. the future server API
 * being unreachable) so callers can show something other than a silent,
 * indistinguishable-from-"no data yet" empty list — see admin pages.
 */
export function useRepoList<T extends { id: string }>(repo: Repo<T>) {
  const [items, setItems] = useState<T[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const reload = useCallback(async () => {
    try {
      const rows = await repo.list()
      setItems(rows)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoaded(true)
    }
  }, [repo])

  useEffect(() => {
    reload()
  }, [reload])

  return { items, loaded, error, reload }
}
