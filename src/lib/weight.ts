import type { WeightLogEntry } from '@/types'

const SHORT_DATE = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })

export function formatShortDate(isoDate: string) {
  return SHORT_DATE.format(new Date(isoDate))
}

export interface WeightSummary {
  points: { date: string; value: number }[]
  current: number
  deltaLabel: string
  deltaColor: string
}

export function summarizeWeight(entries: WeightLogEntry[]): WeightSummary {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const latest = sorted.at(-1)
  const prev = sorted.at(-2)
  const delta = latest && prev ? latest.value - prev.value : 0

  return {
    points: sorted.map((e) => ({ date: formatShortDate(e.date), value: e.value })),
    current: latest?.value ?? 0,
    deltaLabel: latest && prev ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)} кг` : 'Нет данных за прошлый раз',
    deltaColor: delta < 0 ? 'var(--color-success)' : delta > 0 ? 'var(--color-warning)' : 'var(--color-text-secondary)',
  }
}

export function formatRelativeDate(isoDate: string) {
  const today = new Date()
  const date = new Date(isoDate)
  const diffDays = Math.round((today.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / 86_400_000)
  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'
  return formatShortDate(isoDate)
}
