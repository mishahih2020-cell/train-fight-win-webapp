import type { CalendarDay, ChatMessageData, MacroStat, Meal, ProgressStat, QuickAction, WeightPoint, WorkoutCategory } from '@/types'

export const USER = {
  firstName: 'Marat',
  username: '@maratfighter',
  isPro: true,
}

export const WEEK_DAYS: CalendarDay[] = [
  { weekday: 'Пн', dayNumber: 22, workoutTitle: 'Running' },
  { weekday: 'Вт', dayNumber: 23, workoutTitle: 'Muay Thai + Strength' },
  { weekday: 'Ср', dayNumber: 24, isRest: true },
  { weekday: 'Чт', dayNumber: 25, workoutTitle: 'Strength' },
  { weekday: 'Пт', dayNumber: 26, workoutTitle: 'Muay Thai' },
  { weekday: 'Сб', dayNumber: 27, workoutTitle: 'Sparring' },
  { weekday: 'Вс', dayNumber: 28, isRest: true },
]

export const TODAY_WORKOUT_LABEL = 'Сегодняшняя тренировка'

export const STREAK_DAYS = 12

export const WORKOUT_CATEGORIES: Array<'Все' | WorkoutCategory> = ['Все', 'Бойцовские', 'Силовые', 'Бег', 'Другое']

// Тренировок/время/серия теперь считаются из реальной истории (src/lib/streak.ts,
// ProgressPage) — здесь остаётся только то, для чего пока нет модели данных.
export const PROGRESS_STATS: ProgressStat[] = [{ id: 'ps3', label: 'Личные рекорды', value: '12', icon: 'trophy' }]

export const MACROS: MacroStat[] = [
  { id: 'protein', label: 'Белки', value: 180, total: 200, unit: 'г', color: 'var(--color-success)' },
  { id: 'carbs', label: 'Углеводы', value: 240, total: 300, unit: 'г', color: 'var(--color-accent)' },
  { id: 'fats', label: 'Жиры', value: 70, total: 90, unit: 'г', color: 'var(--color-warning)' },
]

export const CALORIES = { current: 2350, total: 2400 }

export const MEALS: Meal[] = [
  { id: 'm1', name: 'Завтрак', title: 'Овсянка с бананом', time: '08:30', kcal: 660 },
  { id: 'm2', name: 'Обед', title: 'Курица, рис, овощи', time: '13:15', kcal: 720 },
  { id: 'm3', name: 'Ужин', title: 'Лосось, рис, овощи', time: '19:40', kcal: 680 },
]

export const AI_MESSAGES: ChatMessageData[] = [
  { id: 'ai1', from: 'user', text: 'Что мне сегодня тренировать?' },
  {
    id: 'ai2',
    from: 'ai',
    text: 'У тебя была тяжёлая тренировка вчера, поэтому сегодня рекомендую:\n\n• 10 км бег (зона 2)\n• Лёгкая техника (30–40 мин)\n• Растяжка\n\nЭто поможет восстановить форму и поддержать прогресс.',
  },
]

export const AI_QUICK_ACTIONS: QuickAction[] = [
  { id: 'qa1', label: 'Составь план на неделю' },
  { id: 'qa2', label: 'Подсказки по питанию' },
  { id: 'qa3', label: 'Анализ моего прогресса' },
]

export const CREATE_WORKOUT_TYPES: Array<{ id: string; label: string }> = [
  { id: 'fight', label: 'Бойцовская' },
  { id: 'strength', label: 'Силовая' },
  { id: 'run', label: 'Бег' },
  { id: 'other', label: 'Другое' },
]

export const WEEKLY_CALORIES: WeightPoint[] = [
  { date: 'Пн', value: 2180 },
  { date: 'Вт', value: 2350 },
  { date: 'Ср', value: 1990 },
  { date: 'Чт', value: 2420 },
  { date: 'Пт', value: 2300 },
  { date: 'Сб', value: 2510 },
  { date: 'Вс', value: 2350 },
]

