import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Lang } from '@/i18n/translations'
import type { ProfileAnswers } from '@/types'

const DEFAULT_PROFILE: ProfileAnswers = {
  age: 25,
  gender: 'male',
  heightCm: 178,
  weightKg: 70,
  goal: 'fight',
  level: 'advanced',
  workoutsPerWeek: '5-6',
}

const STORAGE_KEY = 'marat-fight-club:v1'

interface PersistedState {
  profile: ProfileAnswers
  wheelSpinsLeft: number
  onboarded: boolean
  soundEnabled: boolean
  language: Lang
  goalWeightKg: number | null
  isPro: boolean
  /** Editable by the user; prefilled once from Telegram's own identity — see App.tsx. */
  displayName: string
  telegramUsername: string | null
  /** Guards the one-time Telegram prefill so it never overwrites a name the user already edited. */
  telegramPrefillDone: boolean
  tourSeen: boolean
}

const DEFAULT_STATE: PersistedState = {
  profile: DEFAULT_PROFILE,
  wheelSpinsLeft: 1,
  onboarded: false,
  soundEnabled: true,
  language: 'ru',
  goalWeightKg: null,
  isPro: false,
  displayName: '',
  telegramUsername: null,
  telegramPrefillDone: false,
  tourSeen: false,
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

interface AppState extends PersistedState {
  setProfile: (profile: ProfileAnswers) => void
  spendSpin: () => void
  addSpin: (count?: number) => void
  completeOnboarding: () => void
  setSoundEnabled: (enabled: boolean) => void
  setLanguage: (lang: Lang) => void
  setGoalWeightKg: (kg: number | null) => void
  setIsPro: (isPro: boolean) => void
  setDisplayName: (name: string) => void
  /** One-shot: only applies if the user hasn't set/edited a name yet. */
  prefillFromTelegram: (name: string, username: string | null) => void
  completeTour: () => void
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => ({ ...DEFAULT_STATE, ...readPersisted() }))

  const patch = (updater: Partial<PersistedState> | ((prev: PersistedState) => Partial<PersistedState>)) => {
    setState((prev) => {
      const partial = typeof updater === 'function' ? updater(prev) : updater
      // Bail out (same reference) when nothing actually changed — a
      // same-content-but-new-object `next` would still re-render every
      // consumer and recreate the context value, which can turn a "one-shot
      // if not already done" updater into an infinite update loop wherever
      // it's called from an effect keyed on that updater's identity.
      const prevRecord = prev as unknown as Record<string, unknown>
      const changed = Object.keys(partial).some((k) => (partial as Record<string, unknown>)[k] !== prevRecord[k])
      if (!changed) return prev
      const next = { ...prev, ...partial }
      writePersisted(next)
      return next
    })
  }

  const value: AppState = {
    ...state,
    setProfile: (profile) => patch({ profile }),
    spendSpin: () => patch((prev) => ({ wheelSpinsLeft: Math.max(0, prev.wheelSpinsLeft - 1) })),
    addSpin: (count = 1) => patch((prev) => ({ wheelSpinsLeft: prev.wheelSpinsLeft + count })),
    completeOnboarding: () => patch({ onboarded: true }),
    setSoundEnabled: (soundEnabled) => patch({ soundEnabled }),
    setLanguage: (language) => patch({ language }),
    setGoalWeightKg: (goalWeightKg) => patch({ goalWeightKg }),
    setIsPro: (isPro) => patch({ isPro }),
    setDisplayName: (displayName) => patch({ displayName }),
    prefillFromTelegram: (name, username) =>
      patch((prev) =>
        prev.telegramPrefillDone
          ? {}
          : { displayName: prev.displayName || name, telegramUsername: username, telegramPrefillDone: true },
      ),
    completeTour: () => patch({ tourSeen: true }),
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
