export type Direction = 'muay-thai' | 'kickboxing'

export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface Lesson {
  id: string
  number: number
  title: string
  direction: Direction
  level: Level
  durationMin: number
  thumbnail: string
  xp: number
}

export interface CourseModule {
  id: string
  number: number
  title: string
  lessonCount: number
}

export interface Course {
  id: string
  title: string
  shortTitle: string
  direction: Direction
  level: Level
  lessonCount: number
  weeks: number
  price: number
  image: string
  description: string
  isHit?: boolean
  modules: CourseModule[]
  whatYouGet: string[]
  forWhom: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  category: 'courses' | 'progress'
  total: number
  icon: 'flag' | 'flame' | 'fighter' | 'trending' | 'crown' | 'medal'
}

export interface WheelSegment {
  id: string
  label: string
  type: 'discount' | 'lesson' | 'xp' | 'bonus' | 'spin'
  value: number
}

export interface PurchaseRecord {
  id: string
  courseId: string
  courseName: string
  price: number
  date: string
  status: 'paid'
  image: string
}

export type WorkoutType = 'Муай-тай' | 'Кикбоксинг' | 'ОФП' | 'Спарринг' | 'Растяжка'

export type Intensity = 'Легко' | 'Средне' | 'Тяжело'

export interface WorkoutEntry {
  id: string
  date: string // yyyy-mm-dd, local calendar day
  type: WorkoutType
  durationMin: number
  intensity: Intensity
  note?: string
  xp: number
}

export interface WeightEntry {
  id: string
  date: string // yyyy-mm-dd
  value: number // kg
}
