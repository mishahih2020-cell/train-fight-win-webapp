import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang } from '@/i18n/translations'
import type { ProfileAnswers } from '@/types'
import { API_BASE, apiFetch, ensureLoggedIn } from '@/lib/apiClient'

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
  /** One flag per screen's coach-mark tour, e.g. tours.home, tours.workouts. */
  tours: Record<string, boolean>
}

const DEFAULT_STATE: PersistedState = {
  profile: DEFAULT_PROFILE,
  // Not 1 by default — the welcome spin is granted explicitly by the
  // animated entrance (WelcomePage) when it reaches the reward reveal, so
  // the in-app claim "+1 spin" is actually true instead of a hidden default.
  wheelSpinsLeft: 0,
  onboarded: false,
  soundEnabled: true,
  language: 'ru',
  goalWeightKg: null,
  isPro: false,
  displayName: '',
  telegramUsername: null,
  telegramPrefillDone: false,
  tours: {},
}

// Telegram's in-app browser can restrict storage access in rare/older
// clients — every read/write is isolated so a blocked localStorage never
// breaks the app, it just falls back to in-memory-only state.
function readPersisted(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Partial<PersistedState> & { tourSeen?: boolean }
    // Migrate the old single-screen `tourSeen` flag (pre-dating per-screen
    // tours) into the home tour's entry, so existing users who already saw
    // the Home tour don't see it replayed, while every other screen's tour
    // still plays once for them.
    if (parsed.tourSeen !== undefined && !parsed.tours) {
      parsed.tours = { home: parsed.tourSeen }
    }
    delete parsed.tourSeen
    return parsed
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
  completeTour: (id: string) => void
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
      pushToServer(partial)
      return next
    })
  }

  // Best-effort background mirror to the server: localStorage stays the
  // instant, synchronous source of truth for rendering (nothing here waits
  // on the network), the server call just piggybacks on every change so
  // state is also available cross-device. No-ops entirely while no backend
  // is configured (current production build). `isPro` is excluded — it's
  // derived server-side from `subscriptions`, see setIsPro below.
  const pushToServer = (partial: Partial<PersistedState>) => {
    if (!API_BASE) return
    const { isPro, ...rest } = partial
    void isPro
    if (Object.keys(rest).length === 0) return
    void apiFetch('/api/me', { method: 'PATCH', body: JSON.stringify(rest) })
  }

  // One-shot, on mount: if a backend is configured, log the Telegram user in
  // and either push this device's pre-existing local state up (first-ever
  // login for this Telegram account — the server row was just created empty,
  // so local data is the only copy that matters) or pull the server's own
  // state down (returning login, possibly from a different device — the
  // server is now the authority). No-ops entirely while no backend is
  // configured, so today's deployed build is unaffected.
  useEffect(() => {
    if (!API_BASE) return
    let cancelled = false
    ;(async () => {
      const { loggedIn, isNewUser } = await ensureLoggedIn()
      if (!loggedIn || cancelled) return
      if (isNewUser) {
        pushToServer({
          profile: state.profile,
          wheelSpinsLeft: state.wheelSpinsLeft,
          onboarded: state.onboarded,
          soundEnabled: state.soundEnabled,
          language: state.language,
          goalWeightKg: state.goalWeightKg,
          displayName: state.displayName,
          tours: state.tours,
        })
        return
      }
      const res = await apiFetch('/api/me')
      if (!res.ok || cancelled) return
      const server = await res.json()
      patch(() => ({
        profile: server.profile ?? DEFAULT_PROFILE,
        wheelSpinsLeft: server.wheelSpinsLeft ?? 0,
        onboarded: Boolean(server.onboarded),
        soundEnabled: server.soundEnabled ?? true,
        language: server.language ?? 'ru',
        goalWeightKg: server.goalWeightKg,
        isPro: Boolean(server.isPro),
        displayName: server.displayName || state.displayName,
        telegramUsername: server.telegramUsername ?? state.telegramUsername,
        tours: server.tours ?? {},
      }))
    })()
    return () => {
      cancelled = true
    }
    // One-shot on mount only — see the comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value: AppState = {
    ...state,
    setProfile: (profile) => patch({ profile }),
    spendSpin: () => patch((prev) => ({ wheelSpinsLeft: Math.max(0, prev.wheelSpinsLeft - 1) })),
    addSpin: (count = 1) => patch((prev) => ({ wheelSpinsLeft: prev.wheelSpinsLeft + count })),
    completeOnboarding: () => patch({ onboarded: true }),
    setSoundEnabled: (soundEnabled) => patch({ soundEnabled }),
    setLanguage: (language) => patch({ language }),
    setGoalWeightKg: (goalWeightKg) => patch({ goalWeightKg }),
    setIsPro: (isPro) => {
      patch({ isPro })
      if (API_BASE) void apiFetch('/api/subscribe', { method: isPro ? 'POST' : 'DELETE' })
    },
    setDisplayName: (displayName) => patch({ displayName }),
    prefillFromTelegram: (name, username) =>
      patch((prev) =>
        prev.telegramPrefillDone
          ? {}
          : { displayName: prev.displayName || name, telegramUsername: username, telegramPrefillDone: true },
      ),
    completeTour: (id) => patch((prev) => ({ tours: { ...prev.tours, [id]: true } })),
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
