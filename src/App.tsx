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

    webApp.ready()
    webApp.setHeaderColor?.('#050708')
    webApp.setBackgroundColor?.('#050708')
    webApp.setBottomBarColor?.('#050708')

    // Vertical swipes closing the app mid-scroll is a known Telegram WebApp gesture
    // conflict — kill it explicitly, and prefer true fullscreen (which disables the
    // gesture entirely) over the older expand() on clients that support it.
    try {
      webApp.disableVerticalSwipes?.()
    } catch {
      // older client without swipe control support
    }

    try {
      if (typeof webApp.requestFullscreen === 'function') {
        webApp.requestFullscreen()
      } else {
        webApp.expand()
      }
    } catch {
      webApp.expand()
    }
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
