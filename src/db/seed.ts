import type { Course, Meal, OrderRecord, PromoCodeRecord, SavedWorkout, WeightLogEntry, WheelSegment, WorkoutLogEntry } from '@/types'

// Computed relative to whenever the app first loads, not hardcoded — so the
// nutrition "by day" history always looks like the last real week instead
// of silently going stale as real time passes a fixed seed date.
function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export const SEED_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'FULL COURSE ON ELBOWS',
    subtitle: 'Техника · Комбинации · Драйлы',
    description:
      'Полный курс по работе локтями в муай-тай: базовая техника, связки с руками и коленями, отработка на лапах и в спарринге.',
    price: 2990,
    purchased: true,
    progress: 45,
  },
  {
    id: 'c2',
    title: 'DAY IN MY TRAINING CAMP',
    subtitle: 'Полная программа со мной',
    description: 'Разбор одного полного тренировочного дня из моего лагеря — от разминки до заминки и восстановления.',
    price: 0,
    purchased: true,
    progress: 0,
  },
]

export const SEED_PROMO_CODES: PromoCodeRecord[] = [
  { id: 'MARAT10', discountPercent: 10, active: true },
  { id: 'FIGHT2026', discountPercent: 20, active: true },
]

export const SEED_WEIGHT: WeightLogEntry[] = [
  { id: 'w1', date: '2026-09-01', value: 72 },
  { id: 'w2', date: '2026-09-08', value: 71.2 },
  { id: 'w3', date: '2026-09-15', value: 71.4 },
  { id: 'w4', date: '2026-09-22', value: 70.0 },
]

export const SEED_WORKOUTS: SavedWorkout[] = [
  {
    id: 'w1',
    title: 'Muay Thai',
    category: 'fight',
    rounds: 8,
    roundSec: 180,
    restSec: 60,
    exerciseNames: ['Разминка', 'Удары руками', 'Удары ногами'],
    createdDate: '2026-09-29',
  },
  {
    id: 'w2',
    title: 'Strength',
    category: 'strength',
    rounds: 5,
    roundSec: 60,
    restSec: 30,
    exerciseNames: ['Приседания', 'Отжимания', 'Планка'],
    createdDate: '2026-09-28',
  },
  {
    id: 'w3',
    title: 'Running',
    category: 'run',
    rounds: 1,
    roundSec: 2700,
    restSec: 60,
    exerciseNames: ['Бег 12 км'],
    createdDate: '2026-09-22',
  },
  {
    id: 'w4',
    title: 'Sparring',
    category: 'fight',
    rounds: 6,
    roundSec: 180,
    restSec: 60,
    exerciseNames: ['Спарринг'],
    createdDate: '2026-09-20',
  },
]

export const SEED_WORKOUT_LOG: WorkoutLogEntry[] = [
  { id: 'wl1', title: 'Strength', category: 'strength', date: '2026-09-24', durationSec: 1200, exerciseCount: 5 },
  { id: 'wl2', title: 'Muay Thai', category: 'fight', date: '2026-09-23', durationSec: 2700, exerciseCount: 6 },
]

export const SEED_ORDERS: OrderRecord[] = [
  { id: 'o1', courseId: 'c1', courseTitle: 'FULL COURSE ON ELBOWS', amount: 2990, date: '2026-09-12', status: 'paid' },
  { id: 'o2', courseId: 'c2', courseTitle: 'DAY IN MY TRAINING CAMP', amount: 0, date: '2026-08-30', status: 'free' },
]

export const SEED_BONUS_LEDGER = [{ id: 'b1', date: '2026-09-12', amount: 50, reason: 'Покупка курса' }]

const MEAL_PLAN: Array<Array<[string, string, string, number]>> = [
  // [name, title, time, kcal] per day, oldest first
  [
    ['Завтрак', 'Овсянка с бананом', '08:15', 420],
    ['Обед', 'Гречка с курицей', '13:30', 680],
    ['Ужин', 'Творог с ягодами', '19:45', 390],
  ],
  [
    ['Завтрак', 'Яичница с тостом', '08:00', 480],
    ['Обед', 'Паста с индейкой', '13:45', 820],
    ['Ужин', 'Бургер и картофель фри', '20:30', 1050],
  ],
  [
    ['Завтрак', 'Протеиновый смузи', '07:45', 320],
    ['Обед', 'Салат с тунцом', '13:00', 540],
    ['Ужин', 'Лосось, рис, овощи', '19:20', 680],
  ],
  [
    ['Завтрак', 'Овсянка с бананом', '08:30', 420],
    ['Обед', 'Курица, рис, овощи', '13:15', 720],
    ['Ужин', 'Омлет с овощами', '19:00', 410],
  ],
  [
    ['Завтрак', 'Творог с мёдом', '08:10', 380],
    ['Обед', 'Гречка с курицей', '13:40', 680],
    ['Ужин', 'Пицца', '20:15', 1100],
  ],
  [
    ['Завтрак', 'Яичница с тостом', '07:50', 480],
    ['Обед', 'Салат с тунцом', '13:20', 540],
    ['Ужин', 'Лосось, рис, овощи', '19:40', 680],
  ],
  [
    ['Завтрак', 'Овсянка с бананом', '08:30', 660],
    ['Обед', 'Курица, рис, овощи', '13:15', 720],
    ['Ужин', 'Лосось, рис, овощи', '19:40', 680],
  ],
]

export const SEED_MEALS: Meal[] = MEAL_PLAN.flatMap((day, dayIndex) =>
  day.map(([name, title, time, kcal], i) => ({
    id: `meal-${dayIndex}-${i}`,
    date: daysAgo(MEAL_PLAN.length - 1 - dayIndex),
    name,
    title,
    time,
    kcal,
  })),
)

export const SEED_WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 'seg1', label: '50%\nскидка', color: 'accent' },
  { id: 'seg2', label: 'Бонусные\nбаллы', color: 'card' },
  { id: 'seg3', label: '30%\nскидка', color: 'accent' },
  { id: 'seg4', label: '10%\nскидка', color: 'card' },
  { id: 'seg5', label: 'Бесплатный\nкурс', color: 'accent' },
  { id: 'seg6', label: 'Попробуй\nещё раз', color: 'card' },
]
