import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AppStateProvider, useAppState } from '@/context/AppStateContext'
import { AdminApp } from '@/admin/AdminApp'
import { TabLayout } from '@/components/navigation/TabLayout'
import { OnboardingPage } from '@/pages/Onboarding/OnboardingPage'
import { ProfileSetupPage } from '@/pages/ProfileSetup/ProfileSetupPage'
import { HomePage } from '@/pages/Home/HomePage'
import { WorkoutsPage } from '@/pages/Workouts/WorkoutsPage'
import { CreateWorkoutPage } from '@/pages/Workouts/CreateWorkoutPage'
import { WorkoutSessionPage } from '@/pages/Workouts/WorkoutSessionPage'
import { ProgressPage } from '@/pages/Progress/ProgressPage'
import { NutritionPage } from '@/pages/Nutrition/NutritionPage'
import { AICoachPage } from '@/pages/AICoach/AICoachPage'
import { CoursesPage } from '@/pages/Courses/CoursesPage'
import { ProfilePage } from '@/pages/Profile/ProfilePage'
import { WheelPage } from '@/pages/Wheel/WheelPage'

function useTelegramInit() {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp
    if (!webApp) return

    // Older Telegram clients throw synchronously on API calls added in newer Bot
    // API versions — a single uncaught throw here would kill the whole React
    // render, producing a black screen. Every call is isolated so one
    // unsupported method can't break the rest.
    const safe = (fn?: () => void) => {
      try {
        fn?.()
      } catch {
        // unsupported on this client/Bot API version — ignore
      }
    }

    safe(() => webApp.ready())
    safe(() => webApp.setHeaderColor?.('#0B0B0D'))
    safe(() => webApp.setBackgroundColor?.('#0B0B0D'))
    safe(() => webApp.setBottomBarColor?.('#0B0B0D'))
    safe(() => webApp.disableVerticalSwipes?.())
    safe(() => webApp.expand())
    // requestFullscreen() (Bot API 8.0+) hides Telegram's own header chrome so
    // the app truly fills the screen; no-ops safely via `safe()` on clients
    // that don't support it yet.
    safe(() => webApp.requestFullscreen?.())
  }, [])
}

// "/" is the onboarding splash, but only until the user has actually filled
// in their profile once — after that, opening the Mini App should land
// straight on Home instead of re-running the first-run flow every time.
function RootRoute() {
  const { onboarded } = useAppState()
  return onboarded ? <Navigate to="/home" replace /> : <OnboardingPage />
}

// Mirrors in-app navigation onto Telegram's native hardware/UI back button,
// so it always does the same thing as the on-screen back chevron instead of
// closing the Mini App straight from a drill-in screen.
function useTelegramBackButton() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const backButton = window.Telegram?.WebApp?.BackButton
    if (!backButton) return

    const onClick = () => navigate(-1)

    try {
      if (location.pathname === '/') {
        backButton.hide()
      } else {
        backButton.show()
      }
      backButton.onClick(onClick)
    } catch {
      // unsupported on this client — ignore
    }

    return () => {
      try {
        backButton.offClick(onClick)
      } catch {
        // unsupported on this client — ignore
      }
    }
  }, [location.pathname, navigate])
}

function AppRoutes() {
  useTelegramInit()
  useTelegramBackButton()

  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />

      <Route element={<TabLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/ai-coach" element={<AICoachPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/workouts/new" element={<CreateWorkoutPage />} />
      <Route path="/workouts/session" element={<WorkoutSessionPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/wheel" element={<WheelPage />} />

      <Route path="/admin/*" element={<AdminApp />} />

      {/* Any unmatched path (e.g. Telegram resuming the WebView on a stale
          deep path, or a GitHub Pages 404 fallback hit) bounces back to the
          start instead of rendering a blank screen. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Telegram appends its own payload to the URL *hash* on every launch
// (`#tgWebAppData=...&tgWebAppPlatform=...`) — a HashRouter would try to
// parse that as the app's route, match nothing, and render a blank screen.
// BrowserRouter ignores the hash entirely and routes off the real pathname.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

function App() {
  return (
    <AppStateProvider>
      <BrowserRouter basename={basename}>
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  )
}

export default App
