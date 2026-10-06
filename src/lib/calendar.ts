import type { Lang } from '@/i18n/translations'
import type { CalendarDay } from '@/types'

const WEEKDAY_FORMAT: Record<Lang, Intl.DateTimeFormat> = {
  ru: new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }),
  en: new Intl.DateTimeFormat('en-US', { weekday: 'short' }),
}

export interface WeekPlanSlot {
  workoutTitle?: string
  isRest?: boolean
}

/**
 * Monday-first week containing today's real date, with weekday labels
 * localized per language. `plan` cycles over the 7 slots so the home
 * calendar always shows the current week instead of a hardcoded one that
 * goes stale as real time passes it.
 */
export function buildCurrentWeek(lang: Lang, plan: WeekPlanSlot[]): CalendarDay[] {
  const today = new Date()
  const isoWeekday = (today.getDay() + 6) % 7 // Monday = 0 ... Sunday = 6
  const monday = new Date(today)
  monday.setDate(today.getDate() - isoWeekday)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const slot = plan[i % plan.length]
    return {
      weekday: WEEKDAY_FORMAT[lang].format(d).replace('.', ''),
      dayNumber: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
      ...slot,
    }
  })
}
