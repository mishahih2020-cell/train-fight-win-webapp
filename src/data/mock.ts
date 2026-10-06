import type { CalendarDay, ChatMessageData, ProgressStat, WorkoutCategory } from '@/types'

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

export const STREAK_DAYS = 12

export const WORKOUT_CATEGORIES: Array<'all' | WorkoutCategory> = ['all', 'fight', 'strength', 'run', 'other']

// Тренировок/время/серия теперь считаются из реальной истории (src/lib/streak.ts,
// ProgressPage) — здесь остаётся только то, для чего пока нет модели данных.
export const PROGRESS_STATS: ProgressStat[] = [{ id: 'ps3', label: 'Личные рекорды', value: '12', icon: 'trophy' }]

export const AI_MESSAGES: ChatMessageData[] = [
  { id: 'ai1', from: 'user', text: 'Что мне сегодня тренировать?' },
  {
    id: 'ai2',
    from: 'ai',
    text: 'У тебя была тяжёлая тренировка вчера, поэтому сегодня рекомендую:\n\n• 10 км бег (зона 2)\n• Лёгкая техника (30–40 мин)\n• Растяжка\n\nЭто поможет восстановить форму и поддержать прогресс.',
  },
]

/** Free sample workouts shown on Home — no purchase, no saved-workout record, just a short round-timer session. */
export interface TrialWorkout {
  id: string
  title: string
  rounds: number
  roundSec: number
  restSec: number
}

export const TRIAL_WORKOUTS: TrialWorkout[] = [
  { id: 'trial-1', title: 'Quick Boxing Basics', rounds: 3, roundSec: 120, restSec: 30 },
  { id: 'trial-2', title: 'Muay Thai Starter', rounds: 4, roundSec: 150, restSec: 45 },
  { id: 'trial-3', title: 'Core & Conditioning', rounds: 5, roundSec: 60, restSec: 20 },
]
