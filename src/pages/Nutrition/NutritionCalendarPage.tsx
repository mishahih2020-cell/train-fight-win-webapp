import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { Card } from '@/components/ui/Card'
import { FoodCard } from '@/components/cards/FoodCard'
import { MealEditModal } from '@/components/cards/MealEditModal'
import { mealsRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { groupMealsByDayList } from '@/lib/nutritionRecommend'
import type { Meal } from '@/types'

const WEEKDAY_FORMAT: Record<'ru' | 'en', Intl.DateTimeFormat> = {
  ru: new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }),
  en: new Intl.DateTimeFormat('en-US', { weekday: 'short' }),
}
const MONTH_FORMAT: Record<'ru' | 'en', Intl.DateTimeFormat> = {
  ru: new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }),
  en: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }),
}

function toIso(d: Date) {
  return d.toISOString().slice(0, 10)
}

/** Monday-first grid of the given month, padded with the trailing days of the previous/next month to fill whole weeks. */
function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7 // Monday = 0
  const gridStart = new Date(year, month, 1 - startOffset)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    return d
  })
}

export function NutritionCalendarPage() {
  const { language } = useAppState()
  const { t } = useT()
  const { items: meals, reload } = useRepoList(mealsRepo)
  const today = new Date()
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selectedDate, setSelectedDate] = useState(toIso(today))
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const unit = language === 'en' ? 'g' : 'г'

  const mealsByDay = useMemo(() => groupMealsByDayList(meals), [meals])
  const grid = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor])
  const selectedMeals = useMemo(
    () => (mealsByDay.get(selectedDate) ?? []).sort((a, b) => a.time.localeCompare(b.time)),
    [mealsByDay, selectedDate],
  )

  const weekdayLabels = useMemo(() => {
    const monday = grid[0]
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return WEEKDAY_FORMAT[language].format(d).replace('.', '')
    })
  }, [grid, language])

  const changeMonth = (delta: number) => {
    const next = new Date(cursor.year, cursor.month + delta, 1)
    setCursor({ year: next.getFullYear(), month: next.getMonth() })
  }

  return (
    <div className="pb-8">
      <Header title={t('nutrition.calendarTitle')} />

      <div className="mt-4 px-4">
        <div className="flex items-center justify-between">
          <button onClick={() => changeMonth(-1)} aria-label={t('common.back')} className="press flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-divider)]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-body-secondary font-semibold text-[var(--color-text)] capitalize">
            {MONTH_FORMAT[language].format(new Date(cursor.year, cursor.month, 1))}
          </span>
          <button onClick={() => changeMonth(1)} aria-label={t('tour.next')} className="press flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-divider)]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center">
          {weekdayLabels.map((w) => (
            <div key={w} className="text-caption text-[var(--color-text-tertiary)]">
              {w}
            </div>
          ))}
          {grid.map((d) => {
            const iso = toIso(d)
            const inMonth = d.getMonth() === cursor.month
            const hasMeals = (mealsByDay.get(iso)?.length ?? 0) > 0
            const isSelected = iso === selectedDate
            const isToday = iso === toIso(today)
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(iso)}
                className={`press relative flex h-10 flex-col items-center justify-center rounded-[var(--radius-element)] text-body-secondary font-medium ${
                  isSelected
                    ? 'gradient-accent text-white'
                    : inMonth
                      ? isToday
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-text)]'
                      : 'text-[var(--color-text-tertiary)]'
                }`}
              >
                {d.getDate()}
                {hasMeals && !isSelected && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--color-accent)]" />}
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          {selectedMeals.length > 0 ? (
            selectedMeals.map((meal) => <FoodCard key={meal.id} meal={meal} onClick={() => setEditingMeal(meal)} />)
          ) : (
            <Card>
              <p className="text-body-secondary text-center text-[var(--color-text-secondary)]">{t('nutrition.noMealsThisDay')}</p>
            </Card>
          )}
        </div>
      </div>

      <MealEditModal key={editingMeal?.id ?? 'none'} meal={editingMeal} unit={unit} onClose={() => setEditingMeal(null)} onChanged={reload} />
    </div>
  )
}
