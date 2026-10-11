import { Plus } from 'lucide-react'
import type { Meal } from '@/types'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { useT } from '@/i18n/useT'
import type { TranslationKey } from '@/i18n/translations'

const MEAL_NAME_KEYS: Record<string, TranslationKey> = {
  breakfast: 'nutrition.meal.breakfast',
  lunch: 'nutrition.meal.lunch',
  dinner: 'nutrition.meal.dinner',
  snack: 'nutrition.meal.snack',
}

export function FoodCard({ meal, onAdd, onClick }: { meal: Meal; onAdd?: () => void; onClick?: () => void }) {
  const { t } = useT()
  const mealNameKey = MEAL_NAME_KEYS[meal.name]
  const mealNameLabel = mealNameKey ? t(mealNameKey) : meal.name

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-left"
    >
      {meal.photoUrl ? (
        <img src={meal.photoUrl} alt="" className="h-12 w-12 shrink-0 rounded-[var(--radius-element)] object-cover" />
      ) : (
        <PlaceholderImage className="h-12 w-12 shrink-0" rounded="rounded-[var(--radius-element)]" compact />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-caption text-[var(--color-text-secondary)]">{mealNameLabel}</div>
        <div className="text-body-secondary truncate font-semibold text-[var(--color-text)]">{meal.title}</div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-caption text-[var(--color-text-tertiary)]">{meal.time}</span>
        <span className="text-caption font-semibold text-[var(--color-text-secondary)]">
          {meal.kcal} {t('common.kcal')}
        </span>
      </div>
      {onAdd && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAdd()
          }}
          aria-label={t('nutrition.addMeal')}
          className="press flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-accent text-white"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
