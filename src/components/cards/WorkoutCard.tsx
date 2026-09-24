import { ChevronRight } from 'lucide-react'
import type { Workout } from '@/types'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

export function WorkoutCard({ workout, onClick }: { workout: Workout; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="press card-shadow flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-left"
    >
      <PlaceholderImage className="h-14 w-14 shrink-0" rounded="rounded-[var(--radius-element)]" compact />
      <div className="min-w-0 flex-1">
        <div className="text-body font-semibold text-[var(--color-text)]">{workout.title}</div>
        <div className="text-caption mt-0.5 text-[var(--color-text-secondary)]">
          {workout.durationMin} мин &middot; {workout.exerciseCount} упражнений
        </div>
        <div className="text-caption mt-0.5 text-[var(--color-text-tertiary)]">{workout.dateLabel}</div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-[var(--color-text-tertiary)]" />
    </button>
  )
}
