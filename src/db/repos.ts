import { createRepo } from './localStore'
import {
  createCoursesHttpRepo,
  createHttpRepo,
  createOrdersHttpRepo,
  createPromoCodesHttpRepo,
  createWheelSegmentsHttpRepo,
  createWorkoutsHttpRepo,
} from './httpStore'
import { API_BASE } from '@/lib/apiClient'
import {
  SEED_BONUS_LEDGER,
  SEED_COURSES,
  SEED_MEALS,
  SEED_ORDERS,
  SEED_PROMO_CODES,
  SEED_WEIGHT,
  SEED_WHEEL_SEGMENTS,
  SEED_WORKOUT_LOG,
  SEED_WORKOUTS,
} from './seed'
import type {
  BonusLedgerEntry,
  Course,
  Meal,
  OrderRecord,
  PromoCodeRecord,
  SavedWorkout,
  WeightLogEntry,
  WheelSegment,
  WorkoutLogEntry,
} from '@/types'

// With no backend configured (current production build), everything keeps
// working exactly as before, straight out of localStorage. Once
// VITE_API_BASE_URL is set (after the domain + HTTPS are ready) and the
// app is rebuilt, every repo below talks to the real server instead — no
// call site anywhere else in the app needs to change. See server/README.md.
const hasApi = Boolean(API_BASE)

export const coursesRepo = hasApi ? createCoursesHttpRepo<Course>() : createRepo<Course>('courses', SEED_COURSES)
export const promoCodesRepo = hasApi
  ? createPromoCodesHttpRepo<PromoCodeRecord>()
  : createRepo<PromoCodeRecord>('promo_codes', SEED_PROMO_CODES)
export const weightRepo = hasApi
  ? createHttpRepo<WeightLogEntry>('/api/weight-log')
  : createRepo<WeightLogEntry>('weight_log', SEED_WEIGHT)
export const workoutsRepo = hasApi
  ? createWorkoutsHttpRepo<SavedWorkout>()
  : createRepo<SavedWorkout>('workouts', SEED_WORKOUTS)
export const workoutLogRepo = hasApi
  ? createHttpRepo<WorkoutLogEntry>('/api/workout-log')
  : createRepo<WorkoutLogEntry>('workout_log', SEED_WORKOUT_LOG)
export const mealsRepo = hasApi ? createHttpRepo<Meal>('/api/meals') : createRepo<Meal>('meals', SEED_MEALS)
export const ordersRepo = hasApi ? createOrdersHttpRepo<OrderRecord>() : createRepo<OrderRecord>('orders', SEED_ORDERS)
export const bonusLedgerRepo = hasApi
  ? createHttpRepo<BonusLedgerEntry>('/api/bonus-ledger')
  : createRepo<BonusLedgerEntry>('bonus_ledger', SEED_BONUS_LEDGER)
export const wheelSegmentsRepo = hasApi
  ? createWheelSegmentsHttpRepo<WheelSegment>()
  : createRepo<WheelSegment>('wheel_segments', SEED_WHEEL_SEGMENTS)

export async function awardBonus(amount: number, reason: string) {
  await bonusLedgerRepo.add({
    id: `b${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    amount,
    reason,
  })
}

export async function getBonusBalance() {
  const ledger = await bonusLedgerRepo.list()
  return ledger.reduce((sum, entry) => sum + entry.amount, 0)
}
