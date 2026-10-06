import { Minus, Plus } from 'lucide-react'

export function Stepper({
  label,
  display,
  onDec,
  onInc,
}: {
  label: string
  display: string
  onDec: () => void
  onInc: () => void
}) {
  return (
    <div>
      <span className="text-caption mb-1.5 block text-[var(--color-text-secondary)]">{label}</span>
      <div className="flex h-11 items-center justify-between rounded-[var(--radius-button)] bg-[var(--color-card-2)] px-3">
        <button
          className="press flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-divider)]"
          onClick={onDec}
          aria-label={label}
        >
          <Minus className="h-3.5 w-3.5 text-[var(--color-text)]" />
        </button>
        <span className="text-body-secondary font-semibold text-[var(--color-text)]">{display}</span>
        <button
          className="press flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-divider)]"
          onClick={onInc}
          aria-label={label}
        >
          <Plus className="h-3.5 w-3.5 text-[var(--color-text)]" />
        </button>
      </div>
    </div>
  )
}

export function formatMMSS(totalSec: number) {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
