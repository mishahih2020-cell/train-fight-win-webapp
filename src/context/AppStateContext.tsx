import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

interface AppState {
  profile: ProfileAnswers
  setProfile: (profile: ProfileAnswers) => void
  wheelSpinsLeft: number
  spendSpin: () => void
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileAnswers>(DEFAULT_PROFILE)
  const [wheelSpinsLeft, setWheelSpinsLeft] = useState(1)

  const value = useMemo<AppState>(
    () => ({
      profile,
      setProfile,
      wheelSpinsLeft,
      spendSpin: () => setWheelSpinsLeft((n) => Math.max(0, n - 1)),
    }),
    [profile, wheelSpinsLeft],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
