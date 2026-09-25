import type {
  CalendarDay,
  ChatMessageData,
  Exercise,
  MacroStat,
  Meal,
  ProgressStat,
  QuickAction,
  SessionExercise,
  WeightPoint,
  Workout,
} from '@/types'

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

export const WORKOUTS: Workout[] = [
  {
    id: 'w1',
    title: 'Muay Thai',
    category: 'Бойцовские',
    durationMin: 45,
    exerciseCount: 6,
    dateLabel: 'Сегодня',
    exercises: [
      { id: 'e1', name: 'Разминка', durationMin: 10 },
      { id: 'e2', name: 'Удары руками', durationMin: 15 },
      { id: 'e3', name: 'Удары ногами', durationMin: 20 },
    ],
  },
  {
    id: 'w2',
    title: 'Strength',
    category: 'Силовые',
    durationMin: 20,
    exerciseCount: 5,
    dateLabel: 'Вчера',
    exercises: [
      { id: 'e4', name: 'Приседания', durationMin: 8 },
      { id: 'e5', name: 'Отжимания', durationMin: 6 },
      { id: 'e6', name: 'Планка', durationMin: 6 },
    ],
  },
  {
    id: 'w3',
    title: 'Running',
    category: 'Бег',
    durationMin: 45,
    exerciseCount: 1,
    dateLabel: 'Пн, 22 Сен',
    exercises: [{ id: 'e7', name: 'Бег 12 км', durationMin: 45 }],
  },
  {
    id: 'w4',
    title: 'Sparring',
    category: 'Бойцовские',
    durationMin: 30,
    exerciseCount: 1,
    dateLabel: 'Сб, 20 Сен',
    exercises: [{ id: 'e8', name: 'Спарринг', durationMin: 30 }],
  },
]

export const WORKOUT_CATEGORIES: Array<'Все' | Workout['category']> = ['Все', 'Бойцовские', 'Силовые', 'Бег']

export const PROGRESS_STATS: ProgressStat[] = [
  { id: 'ps1', label: 'Тренировок в этом месяце', value: '18', icon: 'chart' },
  { id: 'ps2', label: 'Время в этом месяце', value: '32 ч', icon: 'clock' },
  { id: 'ps3', label: 'Личные рекорды', value: '12', icon: 'trophy' },
  { id: 'ps4', label: 'Серия', value: '12 дней', icon: 'flame' },
]

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

export const DEFAULT_NEW_EXERCISES: Exercise[] = [
  { id: 'ne1', name: 'Бег', durationMin: 30 },
  { id: 'ne2', name: 'Техника', durationMin: 30 },
]

export const SESSION_EXERCISES: SessionExercise[] = [
  { id: 'se1', title: 'Разминка', round: '1/3', time: '05:00', rest: '00:30' },
  { id: 'se2', title: 'Удары руками', round: '2/4', time: '04:00', rest: '00:45' },
  { id: 'se3', title: 'Ударная техника', round: '3/5', time: '03:00', rest: '01:00' },
  { id: 'se4', title: 'Работа ног', round: '2/4', time: '03:30', rest: '00:45' },
  { id: 'se5', title: 'Спарринг', round: '3/3', time: '05:00', rest: '01:30' },
  { id: 'se6', title: 'Растяжка', round: '1/1', time: '08:00', rest: '00:00' },
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

