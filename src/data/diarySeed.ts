import type { WeightEntry, WorkoutEntry } from '@/types'

function daysAgoStr(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

// A live 5-day streak ending today, plus older sessions for a believable history.
export const seedWorkoutLog: WorkoutEntry[] = [
  { id: 'w1', date: daysAgoStr(0), type: 'Муай-тай', durationMin: 60, intensity: 'Средне', xp: 30 },
  { id: 'w2', date: daysAgoStr(1), type: 'ОФП', durationMin: 40, intensity: 'Тяжело', note: 'Круговая на выносливость', xp: 30 },
  { id: 'w3', date: daysAgoStr(2), type: 'Спарринг', durationMin: 45, intensity: 'Тяжело', xp: 30 },
  { id: 'w4', date: daysAgoStr(3), type: 'Кикбоксинг', durationMin: 50, intensity: 'Средне', xp: 30 },
  { id: 'w5', date: daysAgoStr(4), type: 'Растяжка', durationMin: 25, intensity: 'Легко', xp: 30 },
  { id: 'w6', date: daysAgoStr(7), type: 'Муай-тай', durationMin: 55, intensity: 'Средне', xp: 30 },
  { id: 'w7', date: daysAgoStr(8), type: 'ОФП', durationMin: 35, intensity: 'Средне', xp: 30 },
  { id: 'w8', date: daysAgoStr(10), type: 'Кикбоксинг', durationMin: 60, intensity: 'Тяжело', xp: 30 },
]

export const seedWeightLog: WeightEntry[] = [
  { id: 'wt1', date: daysAgoStr(42), value: 79.4 },
  { id: 'wt2', date: daysAgoStr(35), value: 78.6 },
  { id: 'wt3', date: daysAgoStr(28), value: 78.8 },
  { id: 'wt4', date: daysAgoStr(21), value: 77.9 },
  { id: 'wt5', date: daysAgoStr(14), value: 77.3 },
  { id: 'wt6', date: daysAgoStr(7), value: 76.8 },
  { id: 'wt7', date: daysAgoStr(1), value: 76.4 },
]
