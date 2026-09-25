export type Gender = 'male' | 'female'

export type FitnessLevel = 'Начинающий' | 'Средний' | 'Продвинутый'

export interface ProfileAnswers {
  age: number
  gender: Gender
  heightCm: number
  weightKg: number
  goal: string
  level: FitnessLevel
  workoutsPerWeek: string
}

export interface CalendarDay {
  weekday: string // Пн, Вт, ...
  dayNumber: number
  workoutTitle?: string
  isRest?: boolean
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

export type WorkoutCategory = 'Бойцовские' | 'Силовые' | 'Бег'

export interface Exercise {
  id: string
  name: string
  durationMin: number
}

export interface Workout {
  id: string
  title: string
  category: WorkoutCategory
  durationMin: number
  exerciseCount: number
  dateLabel: string
  exercises: Exercise[]
}

export type ProgressTab = 'Вес' | 'Тренировки' | 'Статистика'

export interface ProgressStat {
  id: string
  label: string
  value: string
  icon: 'chart' | 'clock' | 'trophy' | 'flame'
}

export interface Meal {
  id: string
  name: string
  title: string
  time: string
  kcal: number
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

export type CreateWorkoutType = 'Бойцовская' | 'Силовая' | 'Бег' | 'Другое'

export interface Course {
  id: string
  title: string
  subtitle: string
  progress?: number
  cta: string
  badge?: string
}

export interface SettingsItem {
  id: string
  label: string
  badge?: string
}

export interface WheelSegment {
  id: string
  label: string
  color: 'accent' | 'card'
}

export interface SessionExercise {
  id: string
  title: string
  round: string
  time: string
  rest: string
}

export interface PurchaseRecord {
  id: string
  title: string
  date: string
  price: string
}
