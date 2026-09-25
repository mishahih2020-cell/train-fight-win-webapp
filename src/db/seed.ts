import type { Course, OrderRecord, PromoCodeRecord, WeightLogEntry, WheelSegment, WorkoutLogEntry } from '@/types'

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

export const SEED_WORKOUT_LOG: WorkoutLogEntry[] = [
  { id: 'wl1', title: 'Strength', category: 'Силовые', date: '2026-09-24', durationSec: 1200, exerciseCount: 5 },
  { id: 'wl2', title: 'Muay Thai', category: 'Бойцовские', date: '2026-09-23', durationSec: 2700, exerciseCount: 6 },
]

export const SEED_ORDERS: OrderRecord[] = [
  { id: 'o1', courseId: 'c1', courseTitle: 'FULL COURSE ON ELBOWS', amount: 2990, date: '2026-09-12', status: 'paid' },
  { id: 'o2', courseId: 'c2', courseTitle: 'DAY IN MY TRAINING CAMP', amount: 0, date: '2026-08-30', status: 'free' },
]

export const SEED_BONUS_LEDGER = [{ id: 'b1', date: '2026-09-12', amount: 50, reason: 'Покупка курса' }]

export const SEED_WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 'seg1', label: '50%\nскидка', color: 'accent' },
  { id: 'seg2', label: 'Бонусные\nбаллы', color: 'card' },
  { id: 'seg3', label: '30%\nскидка', color: 'accent' },
  { id: 'seg4', label: '10%\nскидка', color: 'card' },
  { id: 'seg5', label: 'Бесплатный\nкурс', color: 'accent' },
  { id: 'seg6', label: 'Попробуй\nещё раз', color: 'card' },
]
