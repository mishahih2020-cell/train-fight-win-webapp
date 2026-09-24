import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from '@/context/AppStateContext'
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

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void
        expand: () => void
        disableVerticalSwipes?: () => void
        setHeaderColor?: (color: string) => void
        setBackgroundColor?: (color: string) => void
        setBottomBarColor?: (color: string) => void
      }
    }
  }
}

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
  }, [])
}

function AppRoutes() {
  useTelegramInit()

  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
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
    </Routes>
  )
}

function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppStateProvider>
  )
}

export default App
