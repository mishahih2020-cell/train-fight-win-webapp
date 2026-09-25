import { createRepo } from './localStore'
import {
  SEED_BONUS_LEDGER,
  SEED_COURSES,
  SEED_ORDERS,
  SEED_PROMO_CODES,
  SEED_WEIGHT,
  SEED_WHEEL_SEGMENTS,
  SEED_WORKOUT_LOG,
} from './seed'
import type { BonusLedgerEntry, Course, OrderRecord, PromoCodeRecord, WeightLogEntry, WheelSegment, WorkoutLogEntry } from '@/types'

export const coursesRepo = createRepo<Course>('courses', SEED_COURSES)
export const promoCodesRepo = createRepo<PromoCodeRecord>('promo_codes', SEED_PROMO_CODES)
export const weightRepo = createRepo<WeightLogEntry>('weight_log', SEED_WEIGHT)
export const workoutLogRepo = createRepo<WorkoutLogEntry>('workout_log', SEED_WORKOUT_LOG)
export const ordersRepo = createRepo<OrderRecord>('orders', SEED_ORDERS)
export const bonusLedgerRepo = createRepo<BonusLedgerEntry>('bonus_ledger', SEED_BONUS_LEDGER)
export const wheelSegmentsRepo = createRepo<WheelSegment>('wheel_segments', SEED_WHEEL_SEGMENTS)

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
