import type { Goal, Meal } from '@/types'

/** ~30 kcal/kg bodyweight baseline (sedentary-to-moderately-active estimate), shifted by goal. */
export function computeCalorieTarget(weightKg: number, goal: Goal): number {
  const baseline = weightKg > 0 ? weightKg * 30 : 2200
  const multiplier = goal === 'loseWeight' ? 0.85 : goal === 'gainMass' ? 1.15 : 1
  return Math.round(baseline * multiplier)
}

export interface MacroTargets {
  protein: number
  carbs: number
  fats: number
}

/** 30/45/25 protein/carbs/fat split of the calorie target, converted to grams (4/4/9 kcal per gram). */
export function computeMacroTargets(calorieTarget: number): MacroTargets {
  return {
    protein: Math.round((calorieTarget * 0.3) / 4),
    carbs: Math.round((calorieTarget * 0.45) / 4),
    fats: Math.round((calorieTarget * 0.25) / 9),
  }
}

export function groupMealsByDay(meals: Meal[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const meal of meals) {
    map.set(meal.date, (map.get(meal.date) ?? 0) + meal.kcal)
  }
  return map
}

/** Same grouping but keeping the full meal records, for calendar day-detail views. */
export function groupMealsByDayList(meals: Meal[]): Map<string, Meal[]> {
  const map = new Map<string, Meal[]>()
  for (const meal of meals) {
    const list = map.get(meal.date)
    if (list) list.push(meal)
    else map.set(meal.date, [meal])
  }
  return map
}

/**
 * Monday-first weeks covering roughly the past month, oldest first. The
 * current (last) week only includes days up to today — not padded with
 * future dates — so a chart built from it naturally fills in day by day
 * instead of always rendering 7 mostly-empty slots.
 */
export function buildMonthWeeks(weeksBack = 4): string[][] {
  const today = new Date()
  const isoWeekday = (today.getDay() + 6) % 7 // Monday = 0
  const currentMonday = new Date(today)
  currentMonday.setDate(today.getDate() - isoWeekday)

  const weeks: string[][] = []
  for (let w = weeksBack - 1; w >= 0; w--) {
    const monday = new Date(currentMonday)
    monday.setDate(currentMonday.getDate() - w * 7)
    const days: string[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      if (d > today) break
      days.push(d.toISOString().slice(0, 10))
    }
    weeks.push(days)
  }
  return weeks
}

export function lastNDays(n: number): string[] {
  const days: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export type RecommendationKind = 'noData' | 'over' | 'under' | 'onTarget'

export interface Recommendation {
  kind: RecommendationKind
  avg: number
  target: number
  diff: number
  daysLogged: number
}

const MIN_DAYS_FOR_RECOMMENDATION = 3

/**
 * Always recomputed from the real meal log (never cached) so it naturally
 * stays accurate as the user keeps logging new days — no stale snapshot to
 * invalidate. Needs a minimum of real history before it says anything
 * prescriptive; below that it just asks for more data.
 */
export function buildRecommendation(dayTotals: Map<string, number>, target: number): Recommendation {
  const loggedDays = [...dayTotals.values()].filter((v) => v > 0)
  if (loggedDays.length < MIN_DAYS_FOR_RECOMMENDATION) {
    return { kind: 'noData', avg: 0, target, diff: 0, daysLogged: loggedDays.length }
  }
  const avg = Math.round(loggedDays.reduce((sum, v) => sum + v, 0) / loggedDays.length)
  const diff = Math.abs(avg - target)
  if (avg > target * 1.1) return { kind: 'over', avg, target, diff, daysLogged: loggedDays.length }
  if (avg < target * 0.9) return { kind: 'under', avg, target, diff, daysLogged: loggedDays.length }
  return { kind: 'onTarget', avg, target, diff, daysLogged: loggedDays.length }
}
