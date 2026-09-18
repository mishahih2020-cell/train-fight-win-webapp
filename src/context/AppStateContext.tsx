import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { getCourseById } from '@/data/courses'
import { seedWeightLog, seedWorkoutLog } from '@/data/diarySeed'
import { getLevelInfo } from '@/data/levels'
import { getLessonById } from '@/data/lessons'
import { seedPurchaseHistory } from '@/data/purchaseHistory'
import { WHEEL_COOLDOWN_HOURS, wheelSegments } from '@/data/wheel'
import { XP_RULES } from '@/data/xpRules'
import type { Intensity, PurchaseRecord, WeightEntry, WheelSegment, WorkoutEntry, WorkoutType } from '@/types'

export interface LevelUpInfo {
  newLevel: number
  xpGained: number
}

export interface WheelState {
  lastSpinAt: number | null
  freeRespin: boolean
  pendingReward: WheelSegment | null
  rewardClaimed: boolean
}

export interface Settings {
  notifications: boolean
  language: 'Русский'
  theme: 'Тёмная'
}

export interface AppState {
  xp: number
  viewedLessons: string[]
  purchasedCourses: string[]
  courseProgress: Record<string, number>
  purchaseHistory: PurchaseRecord[]
  workoutLog: WorkoutEntry[]
  weightLog: WeightEntry[]
  wheel: WheelState
  settings: Settings
  levelUp: LevelUpInfo | null
}

const STORAGE_KEY = 'tfw-app-state-v3'

const initialState: AppState = {
  // 1000 (level 1) + 1500 (level 2) + 1250 into level 3 → matches the "Уровень 3 · 1 250 / 2 000 XP" reference screen.
  xp: 3750,
  viewedLessons: ['l1'],
  purchasedCourses: ['muay-thai-basic', 'kickboxing-technique'],
  courseProgress: { 'muay-thai-basic': 12, 'kickboxing-technique': 8 },
  purchaseHistory: seedPurchaseHistory,
  workoutLog: seedWorkoutLog,
  weightLog: seedWeightLog,
  wheel: { lastSpinAt: null, freeRespin: false, pendingReward: null, rewardClaimed: true },
  settings: { notifications: true, language: 'Русский', theme: 'Тёмная' },
  levelUp: null,
}

type Action =
  | { type: 'VIEW_LESSON'; lessonId: string }
  | { type: 'PURCHASE_COURSE'; courseId: string }
  | { type: 'ADVANCE_COURSE'; courseId: string }
  | { type: 'SPIN_WHEEL' }
  | { type: 'CLAIM_WHEEL_REWARD' }
  | { type: 'DISMISS_LEVEL_UP' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'LOG_WORKOUT'; workout: { type: WorkoutType; durationMin: number; intensity: Intensity; note?: string } }
  | { type: 'DELETE_WORKOUT'; id: string }
  | { type: 'LOG_WEIGHT'; value: number }

function computeLevelUp(oldXp: number, newXp: number): LevelUpInfo | null {
  const oldInfo = getLevelInfo(oldXp)
  const newInfo = getLevelInfo(newXp)
  if (newInfo.level <= oldInfo.level) return null
  return { newLevel: newInfo.level, xpGained: newXp - oldXp }
}

function formatToday(): string {
  const d = new Date()
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'VIEW_LESSON': {
      if (state.viewedLessons.includes(action.lessonId)) return state
      const lesson = getLessonById(action.lessonId)
      if (!lesson) return state

      const finalXp = state.xp + lesson.xp

      return {
        ...state,
        xp: finalXp,
        viewedLessons: [...state.viewedLessons, action.lessonId],
        levelUp: computeLevelUp(state.xp, finalXp),
      }
    }

    case 'PURCHASE_COURSE': {
      if (state.purchasedCourses.includes(action.courseId)) return state
      const course = getCourseById(action.courseId)
      if (!course) return state

      const finalXp = state.xp + XP_RULES.coursePurchase

      const record: PurchaseRecord = {
        id: `hist-${Date.now()}`,
        courseId: course.id,
        courseName: course.shortTitle,
        price: course.price,
        date: formatToday(),
        status: 'paid',
        image: course.image,
      }

      return {
        ...state,
        xp: finalXp,
        purchasedCourses: [...state.purchasedCourses, course.id],
        courseProgress: { ...state.courseProgress, [course.id]: 0 },
        purchaseHistory: [record, ...state.purchaseHistory],
        levelUp: computeLevelUp(state.xp, finalXp),
      }
    }

    case 'ADVANCE_COURSE': {
      const course = getCourseById(action.courseId)
      if (!course || !state.purchasedCourses.includes(action.courseId)) return state
      const current = state.courseProgress[action.courseId] ?? 0
      if (current >= course.lessonCount) return state

      const nextCount = current + 1
      const willComplete = nextCount >= course.lessonCount
      const xpAfter = state.xp + XP_RULES.lessonView + (willComplete ? XP_RULES.courseComplete : 0)

      return {
        ...state,
        xp: xpAfter,
        courseProgress: { ...state.courseProgress, [action.courseId]: nextCount },
        levelUp: computeLevelUp(state.xp, xpAfter),
      }
    }

    case 'SPIN_WHEEL': {
      const now = Date.now()
      const cooldownMs = WHEEL_COOLDOWN_HOURS * 60 * 60 * 1000
      const canSpin =
        state.wheel.freeRespin || !state.wheel.lastSpinAt || now - state.wheel.lastSpinAt >= cooldownMs
      if (!canSpin) return state

      const segment = wheelSegments[Math.floor(Math.random() * wheelSegments.length)]
      const xpGain = segment.type === 'xp' ? segment.value : 0
      const finalXp = state.xp + xpGain

      return {
        ...state,
        xp: finalXp,
        wheel: {
          lastSpinAt: now,
          freeRespin: segment.type === 'spin',
          pendingReward: segment,
          rewardClaimed: false,
        },
        levelUp: computeLevelUp(state.xp, finalXp),
      }
    }

    case 'CLAIM_WHEEL_REWARD':
      return { ...state, wheel: { ...state.wheel, rewardClaimed: true } }

    case 'DISMISS_LEVEL_UP':
      return { ...state, levelUp: null }

    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, settings: { ...state.settings, notifications: !state.settings.notifications } }

    case 'LOG_WORKOUT': {
      const entry: WorkoutEntry = {
        id: `workout-${Date.now()}`,
        date: todayIso(),
        xp: XP_RULES.workoutLog,
        ...action.workout,
      }
      const finalXp = state.xp + entry.xp

      return {
        ...state,
        xp: finalXp,
        workoutLog: [entry, ...state.workoutLog],
        levelUp: computeLevelUp(state.xp, finalXp),
      }
    }

    case 'DELETE_WORKOUT':
      return { ...state, workoutLog: state.workoutLog.filter((w) => w.id !== action.id) }

    case 'LOG_WEIGHT': {
      const entry: WeightEntry = { id: `weight-${Date.now()}`, date: todayIso(), value: action.value }
      const hadToday = state.weightLog.some((w) => w.date === entry.date)
      const withoutToday = state.weightLog.filter((w) => w.date !== entry.date)
      const finalXp = state.xp + (hadToday ? 0 : XP_RULES.weightLog)

      return {
        ...state,
        xp: finalXp,
        weightLog: [...withoutToday, entry],
        levelUp: computeLevelUp(state.xp, finalXp),
      }
    }

    default:
      return state
  }
}

function loadInitialState(): AppState {
  if (typeof window === 'undefined') return initialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<AppState>
    return { ...initialState, ...parsed }
  } catch {
    return initialState
  }
}

interface AppStateContextValue {
  state: AppState
  level: number
  xpIntoLevel: number
  xpForLevel: number
  isMaxLevel: boolean
  viewLesson: (lessonId: string) => void
  purchaseCourse: (courseId: string) => void
  advanceCourse: (courseId: string) => void
  spinWheel: () => void
  claimWheelReward: () => void
  dismissLevelUp: () => void
  toggleNotifications: () => void
  logWorkout: (workout: { type: WorkoutType; durationMin: number; intensity: Intensity; note?: string }) => void
  deleteWorkout: (id: string) => void
  logWeight: (value: number) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // demo mode: ignore persistence failures (e.g. private browsing)
    }
  }, [state])

  const value = useMemo<AppStateContextValue>(() => {
    const levelInfo = getLevelInfo(state.xp)
    return {
      state,
      level: levelInfo.level,
      xpIntoLevel: levelInfo.xpIntoLevel,
      xpForLevel: levelInfo.xpForLevel,
      isMaxLevel: levelInfo.isMax,
      viewLesson: (lessonId) => dispatch({ type: 'VIEW_LESSON', lessonId }),
      purchaseCourse: (courseId) => dispatch({ type: 'PURCHASE_COURSE', courseId }),
      advanceCourse: (courseId) => dispatch({ type: 'ADVANCE_COURSE', courseId }),
      spinWheel: () => dispatch({ type: 'SPIN_WHEEL' }),
      claimWheelReward: () => dispatch({ type: 'CLAIM_WHEEL_REWARD' }),
      dismissLevelUp: () => dispatch({ type: 'DISMISS_LEVEL_UP' }),
      toggleNotifications: () => dispatch({ type: 'TOGGLE_NOTIFICATIONS' }),
      logWorkout: (workout) => dispatch({ type: 'LOG_WORKOUT', workout }),
      deleteWorkout: (id) => dispatch({ type: 'DELETE_WORKOUT', id }),
      logWeight: (value) => dispatch({ type: 'LOG_WEIGHT', value }),
    }
  }, [state])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
