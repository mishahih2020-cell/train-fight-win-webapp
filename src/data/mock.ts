import type { ChatMessageData, ProgressStat, WorkoutCategory } from '@/types'
import type { WeekPlanSlot } from '@/lib/calendar'

export const USER = {
  firstName: 'Marat',
  username: '@maratfighter',
}

// Content for each weekday slot (Monday first) — real dates/weekday labels
// are computed fresh for the current week in src/lib/calendar.ts, so this
// plan never goes stale the way a hardcoded date range would.
export const WEEK_PLAN: WeekPlanSlot[] = [
  { workoutTitle: 'Running' },
  { workoutTitle: 'Muay Thai + Strength' },
  { isRest: true },
  { workoutTitle: 'Strength' },
  { workoutTitle: 'Muay Thai' },
  { workoutTitle: 'Sparring' },
  { isRest: true },
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
