import type { Course, Meal, OrderRecord, PromoCodeRecord, SavedWorkout, WeightLogEntry, WheelSegment, WorkoutLogEntry } from '@/types'

// Courses are real catalog content — what Marat actually offers — so they
// stay seeded. Everything below this (orders, workout/weight/meal history,
// bonus ledger) is per-user activity: a brand-new customer hasn't done any
// of it yet, so none of it is pre-filled. Faking "already purchased" /
// "already logged" history here would look like a bug (or a lie) the
// moment a real person opens the app for the first time.
export const SEED_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'FULL COURSE ON ELBOWS',
    subtitle: 'Техника · Комбинации · Драйлы',
    description:
      'Полный курс по работе локтями в муай-тай: базовая техника, связки с руками и коленями, отработка на лапах и в спарринге.',
    price: 2990,
    purchased: false,
  },
  {
    id: 'c2',
    title: 'DAY IN MY TRAINING CAMP',
    subtitle: 'Полная программа со мной',
    description: 'Разбор одного полного тренировочного дня из моего лагеря — от разминки до заминки и восстановления.',
    price: 0,
    purchased: false,
  },
]

export const SEED_PROMO_CODES: PromoCodeRecord[] = [
  { id: 'MARAT10', discountPercent: 10, active: true },
  { id: 'FIGHT2026', discountPercent: 20, active: true },
]

export const SEED_WEIGHT: WeightLogEntry[] = []

// Reusable starter workout templates — not claimed as "things you already
// did", just ready-made routines sitting in the list before the user has
// created their own. Unlike the activity history below, this is fine to
// pre-fill the same way a recipe app ships with a few starter recipes.
export const SEED_WORKOUTS: SavedWorkout[] = [
  {
    id: 'w1',
    title: 'Muay Thai',
    category: 'fight',
    rounds: 8,
    roundSec: 180,
    restSec: 60,
    exerciseNames: ['Разминка', 'Удары руками', 'Удары ногами'],
    createdDate: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'w2',
    title: 'Strength',
    category: 'strength',
    rounds: 5,
    roundSec: 60,
    restSec: 30,
    exerciseNames: ['Приседания', 'Отжимания', 'Планка'],
    createdDate: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'w3',
    title: 'Running',
    category: 'run',
    rounds: 1,
    roundSec: 2700,
    restSec: 60,
    exerciseNames: ['Бег 12 км'],
    createdDate: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'w4',
    title: 'Sparring',
    category: 'fight',
    rounds: 6,
    roundSec: 180,
    restSec: 60,
    exerciseNames: ['Спарринг'],
    createdDate: new Date().toISOString().slice(0, 10),
  },
]

export const SEED_WORKOUT_LOG: WorkoutLogEntry[] = []

export const SEED_ORDERS: OrderRecord[] = []

export const SEED_BONUS_LEDGER: Array<{ id: string; date: string; amount: number; reason: string }> = []

export const SEED_MEALS: Meal[] = []

export const SEED_WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 'seg1', label: '50%\nскидка', color: 'accent' },
  { id: 'seg2', label: 'Бонусные\nбаллы', color: 'card' },
  { id: 'seg3', label: '30%\nскидка', color: 'accent' },
  { id: 'seg4', label: '10%\nскидка', color: 'card' },
  { id: 'seg5', label: 'Бесплатный\nкурс', color: 'accent' },
  { id: 'seg6', label: 'Попробуй\nещё раз', color: 'card' },
]
