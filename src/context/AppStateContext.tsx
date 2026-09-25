import { createContext, useContext, useState, type ReactNode } from 'react'
import type { ProfileAnswers } from '@/types'

const DEFAULT_PROFILE: ProfileAnswers = {
  age: 25,
  gender: 'male',
  heightCm: 178,
  weightKg: 70,
  goal: 'Подготовка к бою',
  level: 'Продвинутый',
  workoutsPerWeek: '5-6',
}

const STORAGE_KEY = 'marat-fight-club:v1'

interface PersistedState {
  profile: ProfileAnswers
  wheelSpinsLeft: number
}

// Telegram's in-app browser can restrict storage access in rare/older
// clients — every read/write is isolated so a blocked localStorage never
// breaks the app, it just falls back to in-memory-only state.
function readPersisted(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writePersisted(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable — state just won't survive a reload
  }
}

interface AppState {
  profile: ProfileAnswers
  setProfile: (profile: ProfileAnswers) => void
  wheelSpinsLeft: number
  spendSpin: () => void
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<ProfileAnswers>(() => ({
    ...DEFAULT_PROFILE,
    ...readPersisted().profile,
  }))
  const [wheelSpinsLeft, setWheelSpinsLeft] = useState(() => readPersisted().wheelSpinsLeft ?? 1)

  const setProfile = (next: ProfileAnswers) => {
    setProfileState(next)
    writePersisted({ profile: next, wheelSpinsLeft })
  }

  const spendSpin = () =>
    setWheelSpinsLeft((n) => {
      const next = Math.max(0, n - 1)
      writePersisted({ profile, wheelSpinsLeft: next })
      return next
    })

  return (
    <AppStateContext.Provider value={{ profile, setProfile, wheelSpinsLeft, spendSpin }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
