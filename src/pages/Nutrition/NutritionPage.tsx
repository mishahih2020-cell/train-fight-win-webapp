import { Calendar, Camera } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { CalorieRing, LineChart } from '@/components/ui/Chart'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { FoodCard } from '@/components/cards/FoodCard'
import { MealEditModal } from '@/components/cards/MealEditModal'
import { mealsRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { calorieRingColor } from '@/lib/nutrition'
import { readAndDownscaleImage } from '@/lib/image'
import {
  buildMonthWeeks,
  buildRecommendation,
  computeCalorieTarget,
  computeMacroTargets,
  groupMealsByDay,
  groupMealsByDayList,
  lastNDays,
} from '@/lib/nutritionRecommend'
import { formatShortDate } from '@/lib/weight'
import type { Lang } from '@/i18n/translations'
import type { Meal } from '@/types'

const MOCK_DISH_NAMES: Record<Lang, string[]> = {
  ru: ['Творог с ягодами', 'Гречка с курицей', 'Салат с тунцом', 'Протеиновый смузи', 'Индейка с овощами'],
  en: ['Cottage cheese with berries', 'Buckwheat with chicken', 'Tuna salad', 'Protein smoothie', 'Turkey with vegetables'],
}
const MACRO_DEFS = [
  { id: 'protein', color: 'var(--color-success)' },
  { id: 'carbs', color: 'var(--color-accent)' },
  { id: 'fats', color: 'var(--color-warning)' },
] as const

export function NutritionPage() {
  const navigate = useNavigate()
  const { profile, language } = useAppState()
  const { t } = useT()
  const [tab, setTab] = useState<'today' | 'analytics'>('today')
  const { items: meals, reload } = useRepoList(mealsRepo)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const unit = language === 'en' ? 'g' : 'г'

  const [pendingPhoto, setPendingPhoto] = useState<{ url: string } | null>(null)
  const [photoNote, setPhotoNote] = useState('')
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [viewDate, setViewDate] = useState<string | null>(null)
  const weeksScrollRef = useRef<HTMLDivElement>(null)

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
  const mealsByDay = useMemo(() => groupMealsByDayList(meals), [meals])
  const weekDays = useMemo(() => lastNDays(7), [])
  const recommendation = useMemo(() => buildRecommendation(dayTotals, calorieTarget), [dayTotals, calorieTarget])
  const goalLabel = t(`goal.${profile.goal}`)

  // Swipeable weeks within the past month — the current (last) week is only
  // as wide as the days actually logged so far, not padded with future
  // zero-slots, so the chart "fills in" as the week goes rather than always
  // showing a flat 7-slot grid.
  const monthWeeks = useMemo(() => buildMonthWeeks(4), [])
  const weekPointsList = useMemo(
    () => monthWeeks.map((week) => week.map((date) => ({ date: formatShortDate(date, language), value: dayTotals.get(date) ?? 0 }))),
    [monthWeeks, dayTotals, language],
  )
  useEffect(() => {
    const el = weeksScrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [weekPointsList.length])
  const viewDateMeals = useMemo(
    () => (viewDate ? (mealsByDay.get(viewDate) ?? []).sort((a, b) => a.time.localeCompare(b.time)) : []),
    [mealsByDay, viewDate],
  )

  const onPhotoSelected = async (file: File) => {
    const url = await readAndDownscaleImage(file)
    setPendingPhoto({ url })
    setPhotoNote('')
  }

  const savePhotoMeal = () => {
    if (!pendingPhoto) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const note = photoNote.trim()
    const dishNames = MOCK_DISH_NAMES[language]
    const title = note || dishNames[Math.floor(Math.random() * dishNames.length)]
    const kcal = 350 + Math.floor(Math.random() * 300)
    mealsRepo
      .add({ id: `photo-${Date.now()}`, date: today, name: 'snack', title, time, kcal, photoUrl: pendingPhoto.url, note: note || undefined })
      .then(reload)
    setPendingPhoto(null)
    setPhotoNote('')
  }

  return (
    <div className="safe-top px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-[var(--color-text)]">{t('nutrition.title')}</h1>
        <button
          onClick={() => navigate('/nutrition/calendar')}
          aria-label={t('nutrition.calendar')}
          className="press flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-divider)] bg-[var(--color-card)]"
        >
          <Calendar className="h-4 w-4 text-[var(--color-text-secondary)]" />
        </button>
      </div>

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
              const file = e.target.files?.[0]
              if (file) onPhotoSelected(file)
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
                onClick={() => setEditingMeal(meal)}
                onAdd={i === todayMeals.length - 1 ? () => fileInputRef.current?.click() : undefined}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <div className="text-caption mb-2 text-[var(--color-text-secondary)]">{t('nutrition.weeklyCalories')}</div>
            <div ref={weeksScrollRef} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
              {weekPointsList.map((points, i) => (
                <Card key={i} className="w-full shrink-0 snap-center p-4">
                  {points.length > 1 ? (
                    <LineChart points={points} />
                  ) : (
                    <p className="text-body-secondary py-6 text-center text-[var(--color-text-secondary)]">{t('progress.needMorePoints')}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="text-caption mb-2 text-[var(--color-text-secondary)]">{t('nutrition.byDay')}</div>
            <div className="flex flex-col gap-2">
              {weekDays.map((date) => {
                const kcal = dayTotals.get(date) ?? 0
                return (
                  <button
                    key={date}
                    onClick={() => setViewDate(date)}
                    className="press flex items-center justify-between rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 py-2.5 text-left"
                  >
                    <span className="text-body-secondary text-[var(--color-text)]">{formatShortDate(date, language)}</span>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: kcal > 0 ? calorieRingColor(kcal, calorieTarget) : 'var(--color-divider)' }} />
                      <span className="text-body-secondary font-semibold text-[var(--color-text)]">{kcal > 0 ? `${kcal} ${t('common.kcal')}` : '—'}</span>
                    </div>
                  </button>
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

      <Modal open={!!pendingPhoto} onClose={() => setPendingPhoto(null)}>
        <div className="text-h2 mb-4 text-[var(--color-text)]">{t('nutrition.photoModalTitle')}</div>
        {pendingPhoto && <img src={pendingPhoto.url} alt="" className="h-40 w-full rounded-[var(--radius-card)] object-cover" />}
        <div className="mt-4">
          <Input label={t('nutrition.note')} placeholder={t('nutrition.notePlaceholder')} value={photoNote} onChange={(e) => setPhotoNote(e.target.value)} />
          <p className="text-caption mt-1.5 text-[var(--color-text-tertiary)]">{t('nutrition.noteHint')}</p>
        </div>
        <Button variant="primary" className="mt-5" onClick={savePhotoMeal}>
          {t('common.save')}
        </Button>
      </Modal>

      <Modal open={!!viewDate} onClose={() => setViewDate(null)}>
        <div className="text-h2 mb-4 text-[var(--color-text)]">{viewDate && formatShortDate(viewDate, language)}</div>
        <div className="flex flex-col gap-2.5">
          {viewDateMeals.length > 0 ? (
            viewDateMeals.map((meal) => <FoodCard key={meal.id} meal={meal} onClick={() => setEditingMeal(meal)} />)
          ) : (
            <p className="text-body-secondary text-center text-[var(--color-text-secondary)]">{t('nutrition.noMealsThisDay')}</p>
          )}
        </div>
      </Modal>

      <MealEditModal key={editingMeal?.id ?? 'none'} meal={editingMeal} unit={unit} onClose={() => setEditingMeal(null)} onChanged={reload} />
    </div>
  )
}
