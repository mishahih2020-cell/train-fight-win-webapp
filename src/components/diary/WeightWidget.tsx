import { ChevronRight, Plus, TrendingDown, TrendingUp } from 'lucide-react'
import { Sparkline } from '@/components/ui/Sparkline'
import type { WeightEntry } from '@/types'

export function WeightWidget({
  entries,
  onOpen,
  onAdd,
}: {
  entries: WeightEntry[]
  onOpen: () => void
  onAdd: () => void
}) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const latest = sorted[sorted.length - 1]
  const prev = sorted[sorted.length - 2]
  const delta = latest && prev ? Math.round((latest.value - prev.value) * 10) / 10 : null

  return (
    <div className="rounded-lg border border-border bg-graphite p-4">
      <div className="flex items-start justify-between">
        <button onClick={onOpen} className="press flex-1 text-left">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Вес</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[26px] font-extrabold text-white">{latest ? latest.value.toFixed(1) : '—'}</span>
            <span className="text-[13px] font-semibold text-muted">кг</span>
            {delta !== null && delta !== 0 && (
              <span className={`flex items-center gap-0.5 text-[12px] font-bold ${delta < 0 ? 'text-lime' : 'text-muted'}`}>
                {delta < 0 ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
                {Math.abs(delta)}
              </span>
            )}
          </div>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onAdd}
            aria-label="Добавить вес"
            className="press flex h-9 w-9 items-center justify-center rounded-pill bg-lime/12 text-lime"
          >
            <Plus size={18} />
          </button>
          <button onClick={onOpen} aria-label="История веса" className="press text-muted-2">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <button onClick={onOpen} className="press mt-3 block w-full">
        <Sparkline values={sorted.map((e) => e.value)} height={44} />
      </button>
    </div>
  )
}
