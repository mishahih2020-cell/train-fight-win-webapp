import { ChevronRight } from 'lucide-react'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

interface WorkoutCardProps {
  title: string
  meta: string
  dateLabel: string
  onClick?: () => void
}

export function WorkoutCard({ title, meta, dateLabel, onClick }: WorkoutCardProps) {
  return (
    <button
      onClick={onClick}
      className="press card-shadow flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-left"
    >
      <PlaceholderImage className="h-14 w-14 shrink-0" rounded="rounded-[var(--radius-element)]" compact />
      <div className="min-w-0 flex-1">
        <div className="text-body font-semibold text-[var(--color-text)]">{title}</div>
        <div className="text-caption mt-0.5 text-[var(--color-text-secondary)]">{meta}</div>
        <div className="text-caption mt-0.5 text-[var(--color-text-tertiary)]">{dateLabel}</div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-[var(--color-text-tertiary)]" />
    </button>
  )
}
