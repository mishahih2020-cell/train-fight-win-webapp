import { Plus } from 'lucide-react'
import type { Meal } from '@/types'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

export function FoodCard({ meal, showAdd = false }: { meal: Meal; showAdd?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3">
      <PlaceholderImage className="h-12 w-12 shrink-0" rounded="rounded-[var(--radius-element)]" compact />
      <div className="min-w-0 flex-1">
        <div className="text-caption text-[var(--color-text-secondary)]">{meal.name}</div>
        <div className="text-body-secondary truncate font-semibold text-[var(--color-text)]">{meal.title}</div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-caption text-[var(--color-text-tertiary)]">{meal.time}</span>
        <span className="text-caption font-semibold text-[var(--color-text-secondary)]">{meal.kcal} ккал</span>
      </div>
      {showAdd && (
        <button className="press flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-accent text-white">
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
