import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from '@/context/AppStateContext'
import { ToastProvider } from '@/context/ToastContext'
import { TabLayout } from '@/components/navigation/TabLayout'
import { AppBackground } from '@/components/ui/AppBackground'
import { LevelUpModal } from '@/components/ui/LevelUpModal'
import { LessonsPage } from '@/pages/Lessons/LessonsPage'
import { CoursesPage } from '@/pages/Courses/CoursesPage'
import { CourseDetailPage } from '@/pages/CourseDetail/CourseDetailPage'
import { CheckoutPage } from '@/pages/Checkout/CheckoutPage'
import { DiaryPage } from '@/pages/Diary/DiaryPage'
import { WeightPage } from '@/pages/Diary/WeightPage'
import { WheelPage } from '@/pages/Wheel/WheelPage'
import { ProfilePage } from '@/pages/Profile/ProfilePage'
import { AchievementsPage } from '@/pages/Achievements/AchievementsPage'
import { PurchaseHistoryPage } from '@/pages/PurchaseHistory/PurchaseHistoryPage'
import { SettingsPage } from '@/pages/Settings/SettingsPage'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void
        expand: () => void
        requestFullscreen?: () => void
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
    // API versions (fullscreen, swipe control, bottom bar color) — a single
    // uncaught throw here kills the whole React render, producing a black screen.
    // Every call is isolated so one unsupported method can't break the rest.
    const safe = (fn?: () => void) => {
      try {
        fn?.()
      } catch {
        // unsupported on this client/Bot API version — ignore
      }
    }

    safe(() => webApp.ready())
    safe(() => webApp.setHeaderColor?.('#050708'))
    safe(() => webApp.setBackgroundColor?.('#050708'))
    safe(() => webApp.setBottomBarColor?.('#050708'))
    safe(() => webApp.disableVerticalSwipes?.())
    safe(() => {
      if (typeof webApp.requestFullscreen === 'function') {
        webApp.requestFullscreen()
      } else {
        webApp.expand()
      }
    })
  }, [])
}

function AppRoutes() {
  useTelegramInit()

  return (
    <Routes>
      <Route element={<TabLayout />}>
        <Route path="/" element={<LessonsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/wheel" element={<WheelPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />
      <Route path="/checkout/:courseId" element={<CheckoutPage />} />
      <Route path="/diary/weight" element={<WeightPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  )
}

function App() {
  return (
    <AppStateProvider>
      <ToastProvider>
        <AppBackground />
        <HashRouter>
          <AppRoutes />
          <LevelUpModal />
        </HashRouter>
      </ToastProvider>
    </AppStateProvider>
  )
}

export default App
