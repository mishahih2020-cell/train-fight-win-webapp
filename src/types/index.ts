export type Gender = 'male' | 'female'

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'

export type Goal = 'fight' | 'loseWeight' | 'gainMass' | 'generalFitness'

export interface ProfileAnswers {
  age: number
  gender: Gender
  heightCm: number
  weightKg: number
  /** Stable key (not a display string) — see src/i18n, translated via `goal.*` keys. */
  goal: Goal
  level: FitnessLevel
  workoutsPerWeek: string
}

export interface CalendarDay {
  weekday: string // Пн, Вт, ...
  dayNumber: number
  workoutTitle?: string
  isRest?: boolean
  isToday?: boolean
}

export interface TodayWorkout {
  id: string
  title: string
  subtitle: string
}

export interface WeightPoint {
  date: string
  value: number
}

/** Stable key (not a display string) — translated via `workouts.category.*` keys. */
export type WorkoutCategory = 'fight' | 'strength' | 'run' | 'other'

/** A saved, reusable workout — created via "Создать тренировку" and started from the list. */
export interface SavedWorkout {
  id: string
  title: string
  category: string
  rounds: number
  roundSec: number
  restSec: number
  exerciseNames: string[]
  createdDate: string // yyyy-mm-dd
}

/** Stable key (not a display string) — translated via `progress.tab.*` keys. */
export type ProgressTab = 'weight' | 'workouts' | 'stats'

export interface ProgressStat {
  id: string
  label: string
  value: string
  icon: 'chart' | 'clock' | 'trophy' | 'flame'
}

/** `name` is a stable key ('breakfast'|'lunch'|'dinner'|'snack') — translated via `nutrition.meal.*`. */
export interface Meal {
  id: string
  date: string // yyyy-mm-dd
  name: string
  title: string
  time: string
  kcal: number
  /** Grams/macros are optional — only present once the user (or a future real AI) fills them in. */
  grams?: number
  protein?: number
  carbs?: number
  fats?: number
  /** Compressed data URL of the user's own photo — never a stock/mock image. */
  photoUrl?: string
  /** Freeform note the user typed when logging the photo, for a future real AI pass. */
  note?: string
}

export interface MacroStat {
  id: string
  label: string
  value: number
  total: number
  unit: string
  color: string
}

export interface ChatMessageData {
  id: string
  from: 'user' | 'ai'
  text: string
}

export interface QuickAction {
  id: string
  label: string
}

/** Editable via the admin panel; `purchased`/`progress` are per-device until there's a server. */
export interface Course {
  id: string
  title: string
  subtitle: string
  description: string
  price: number // rubles, 0 = free
  purchased: boolean
  progress?: number // 0-100 once purchased and started
}

export interface SettingsItem {
  id: string
  label: string
  badge?: string
}

/** Editable via the admin panel (Бонусы → Колесо). */
export interface WheelSegment {
  id: string
  label: string
  color: 'accent' | 'card'
}

// ---- Local "database" records (src/db) ----
// Same shape a future server API would return, so swapping the storage
// layer later doesn't change any call site — see src/db/README.md.

export interface WeightLogEntry {
  id: string
  date: string // yyyy-mm-dd
  value: number
}

export interface WorkoutLogEntry {
  id: string
  title: string
  category: string
  date: string // yyyy-mm-dd
  durationSec: number
  exerciseCount: number
}

export interface OrderRecord {
  id: string
  courseId: string
  courseTitle: string
  amount: number // rubles, 0 = free
  date: string // yyyy-mm-dd
  status: 'paid' | 'free'
}

/** Editable via the admin panel. */
export interface PromoCodeRecord {
  id: string // the code itself, uppercased
  discountPercent: number
  active: boolean
}

export interface BonusLedgerEntry {
  id: string
  date: string // yyyy-mm-dd
  amount: number
  reason: string
}
