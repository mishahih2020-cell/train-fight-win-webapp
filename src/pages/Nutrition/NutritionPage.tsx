import { Camera } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { CalorieRing, LineChart } from '@/components/ui/Chart'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { FoodCard } from '@/components/cards/FoodCard'
import { mealsRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { calorieRingColor } from '@/lib/nutrition'
import {
  buildRecommendation,
  computeCalorieTarget,
  computeMacroTargets,
  groupMealsByDay,
  lastNDays,
} from '@/lib/nutritionRecommend'
import { formatShortDate } from '@/lib/weight'

const MOCK_DISH_NAMES = ['Творог с ягодами', 'Гречка с курицей', 'Салат с тунцом', 'Протеиновый смузи', 'Индейка с овощами']
const MACRO_DEFS = [
  { id: 'protein', color: 'var(--color-success)' },
  { id: 'carbs', color: 'var(--color-accent)' },
  { id: 'fats', color: 'var(--color-warning)' },
] as const

export function NutritionPage() {
  const { profile, language } = useAppState()
  const { t } = useT()
  const [tab, setTab] = useState<'today' | 'analytics'>('today')
  const { items: meals, reload } = useRepoList(mealsRepo)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const unit = language === 'en' ? 'g' : 'г'

  const today = new Date().toISOString().slice(0, 10)
  const todayMeals = useMemo(() => meals.filter((m) => m.date === today).sort((a, b) => a.time.localeCompare(b.time)), [meals, today])
  const caloriesEaten = useMemo(() => todayMeals.reduce((sum, m) => sum + m.kcal, 0), [todayMeals])

  const calorieTarget = useMemo(() => computeCalorieTarget(profile.weightKg, profile.goal), [profile.weightKg, profile.goal])
  const macroTargets = useMemo(() => computeMacroTargets(calorieTarget), [calorieTarget])

  // Meals only track kcal, not a full macro breakdown per dish — scale each
  // macro by the same share of its daily target as calories are, so the
  // bars move with every meal instead of sitting frozen at seed values.
  const progressShare = calorieTarget > 0 ? caloriesEaten / calorieTarget : 0
  const macrosEaten = MACRO_DEFS.map((m) => ({
    ...m,
    total: macroTargets[m.id],
    value: Math.round(macroTargets[m.id] * progressShare),
  }))

  const dayTotals = useMemo(() => groupMealsByDay(meals), [meals])
  const weekDays = useMemo(() => lastNDays(7), [])
  const weekPoints = useMemo(
    () => weekDays.map((date) => ({ date: formatShortDate(date, language), value: dayTotals.get(date) ?? 0 })),
    [weekDays, dayTotals, language],
  )
  const recommendation = useMemo(() => buildRecommendation(dayTotals, calorieTarget), [dayTotals, calorieTarget])
  const goalLabel = t(`goal.${profile.goal}`)

  const addMealFromPhoto = () => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const dish = MOCK_DISH_NAMES[Math.floor(Math.random() * MOCK_DISH_NAMES.length)]
    const kcal = 350 + Math.floor(Math.random() * 300)
    mealsRepo.add({ id: `photo-${Date.now()}`, date: today, name: 'Перекус', title: dish, time, kcal }).then(reload)
  }

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">{t('nutrition.title')}</h1>

      <div className="mt-4">
        <Tabs options={['today', 'analytics']} value={tab} onChange={setTab} labelFor={(k) => t(`nutrition.tab.${k}`)} />
      </div>

      {tab === 'today' ? (
        <>
          <Card className="mt-4 flex items-center gap-4">
            <CalorieRing current={caloriesEaten} total={calorieTarget} lang={language} />
            <div className="flex flex-1 flex-col gap-2.5">
              {macrosEaten.map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-caption text-[var(--color-text-secondary)]">{t(`nutrition.macro.${m.id}`)}</span>
                  </div>
                  <span className="text-body-secondary font-semibold text-[var(--color-text)]">
                    {m.value} / {m.total} {unit}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addMealFromPhoto()
              e.target.value = ''
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="press text-body-secondary mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] font-semibold text-[var(--color-text)]"
          >
            <Camera className="h-5 w-5 text-[var(--color-accent)]" />
            {t('nutrition.photoButton')}
          </button>

          <div className="mt-5 flex flex-col gap-2.5">
            {todayMeals.map((meal, i) => (
              <FoodCard
                key={meal.id}
                meal={meal}
                onAdd={i === todayMeals.length - 1 ? () => fileInputRef.current?.click() : undefined}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <Card className="p-4">
            <div className="text-caption mb-2 text-[var(--color-text-secondary)]">{t('nutrition.weeklyCalories')}</div>
            <LineChart points={weekPoints} />
          </Card>

          <div>
            <div className="text-caption mb-2 text-[var(--color-text-secondary)]">{t('nutrition.byDay')}</div>
            <div className="flex flex-col gap-2">
              {weekDays.map((date) => {
                const kcal = dayTotals.get(date) ?? 0
                return (
                  <div
                    key={date}
                    className="flex items-center justify-between rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 py-2.5"
                  >
                    <span className="text-body-secondary text-[var(--color-text)]">{formatShortDate(date, language)}</span>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: kcal > 0 ? calorieRingColor(kcal, calorieTarget) : 'var(--color-divider)' }} />
                      <span className="text-body-secondary font-semibold text-[var(--color-text)]">{kcal > 0 ? `${kcal} ${t('common.kcal')}` : '—'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {macrosEaten.map((m) => (
              <Card key={m.id}>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-caption text-[var(--color-text-secondary)]">{t(`nutrition.macro.${m.id}`)}</span>
                </div>
                <div className="text-h2 mt-2 text-[var(--color-text)]">{Math.round((m.value / m.total) * 100)}%</div>
              </Card>
            ))}
          </div>

          <Card>
            <div className="text-body-secondary mb-1 font-semibold text-[var(--color-text)]">{t('nutrition.recommendations')}</div>
            <div className="text-caption mb-3 text-[var(--color-text-secondary)]">
              {t('nutrition.target')}: {calorieTarget} {t('common.kcal')}
            </div>
            <p className="text-body-secondary text-[var(--color-text-secondary)]">
              {recommendation.kind === 'noData' && t('nutrition.noDataYet')}
              {recommendation.kind === 'over' &&
                t('nutrition.overTarget', { diff: recommendation.diff, goal: goalLabel })}
              {recommendation.kind === 'under' &&
                t('nutrition.underTarget', { diff: recommendation.diff, goal: goalLabel })}
              {recommendation.kind === 'onTarget' && t('nutrition.onTarget', { goal: goalLabel })}
            </p>
            {recommendation.kind !== 'noData' && (
              <p className="text-caption mt-2 text-[var(--color-text-tertiary)]">
                {t('nutrition.avgVsTarget', { days: recommendation.daysLogged, avg: recommendation.avg, target: recommendation.target })}
              </p>
            )}
          </Card>
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}
