import { useCallback, useEffect, useState } from 'react'
import type { Repo } from './localStore'

/** Loads a repo's full list and exposes a `reload()` to re-sync after a write. */
export function useRepoList<T extends { id: string }>(repo: Repo<T>) {
  const [items, setItems] = useState<T[]>([])
  const [loaded, setLoaded] = useState(false)

  const reload = useCallback(async () => {
    const rows = await repo.list()
    setItems(rows)
    setLoaded(true)
  }, [repo])

  useEffect(() => {
    reload()
  }, [reload])

  return { items, loaded, reload }
}
