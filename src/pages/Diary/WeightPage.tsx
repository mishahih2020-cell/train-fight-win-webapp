import { useMemo, useState } from 'react'
import { Plus, TrendingDown, TrendingUp } from 'lucide-react'
import { Header } from '@/components/navigation/Header'
import { Button } from '@/components/ui/Button'
import { FilterChip } from '@/components/ui/FilterChip'
import { Sparkline } from '@/components/ui/Sparkline'
import { LogWeightModal } from '@/components/diary/LogWeightModal'
import { formatDiaryDate } from '@/lib/selectors'
import { useAppState } from '@/context/AppStateContext'
import { useToast } from '@/context/ToastContext'

type Period = '7' | '30' | 'all'

const periods: { id: Period; label: string }[] = [
  { id: '7', label: '7Д' },
  { id: '30', label: '30Д' },
  { id: 'all', label: 'Всё время' },
]

export function WeightPage() {
  const { state, logWeight } = useAppState()
  const { showToast } = useToast()
  const [period, setPeriod] = useState<Period>('30')
  const [modalOpen, setModalOpen] = useState(false)

  const sorted = useMemo(() => [...state.weightLog].sort((a, b) => a.date.localeCompare(b.date)), [state.weightLog])

  const filtered = useMemo(() => {
    if (period === 'all') return sorted
    const days = period === '7' ? 7 : 30
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    const cutoffStr = cutoff.toISOString().slice(0, 10)
    return sorted.filter((e) => e.date >= cutoffStr)
  }, [sorted, period])

  const latest = sorted[sorted.length - 1]
  const first = filtered[0]
  const periodDelta = latest && first ? Math.round((latest.value - first.value) * 10) / 10 : null

  return (
    <div className="pb-10">
      <Header title="Вес" />

      <div className="px-5 pt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-[36px] font-extrabold text-white">{latest ? latest.value.toFixed(1) : '—'}</span>
          <span className="text-[16px] font-semibold text-muted">кг</span>
          {periodDelta !== null && periodDelta !== 0 && (
            <span className={`flex items-center gap-0.5 text-[13px] font-bold ${periodDelta < 0 ? 'text-lime' : 'text-muted'}`}>
              {periodDelta < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {Math.abs(periodDelta)} кг
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          {periods.map((p) => (
            <FilterChip key={p.id} label={p.label} active={period === p.id} onClick={() => setPeriod(p.id)} />
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-border bg-graphite p-4">
          <Sparkline values={filtered.map((e) => e.value)} height={120} showDots />
        </div>

        <Button className="mt-4" icon={<Plus size={18} />} onClick={() => setModalOpen(true)}>
          Добавить вес
        </Button>

        <p className="mb-2.5 mt-7 text-[15px] font-extrabold text-white">История записей</p>
        <div className="flex flex-col gap-2">
          {[...filtered].reverse().map((entry, i, arr) => {
            const prevEntry = arr[i + 1]
            const delta = prevEntry ? Math.round((entry.value - prevEntry.value) * 10) / 10 : null
            return (
              <div key={entry.id} className="flex items-center justify-between rounded-md border border-border bg-graphite px-4 py-3">
                <span className="text-[13px] font-semibold text-muted">{formatDiaryDate(entry.date)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-extrabold text-white">{entry.value.toFixed(1)} кг</span>
                  {delta !== null && delta !== 0 && (
                    <span className={`text-[12px] font-bold ${delta < 0 ? 'text-lime' : 'text-muted'}`}>
                      {delta > 0 ? '+' : ''}
                      {delta}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="rounded-md border border-border bg-graphite px-4 py-6 text-center text-[13px] text-muted">
              Нет записей за этот период.
            </p>
          )}
        </div>
      </div>

      <LogWeightModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        currentValue={latest?.value}
        onSubmit={(value) => {
          logWeight(value)
          setModalOpen(false)
          showToast('Вес записан +10 XP')
        }}
      />
    </div>
  )
}
