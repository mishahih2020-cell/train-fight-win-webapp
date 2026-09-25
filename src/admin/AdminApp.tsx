import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './AdminLayout'
import { AdminLoginPage } from './AdminLoginPage'
import { isAdminAuthed } from './auth'
import { BonusesPage } from './pages/BonusesPage'
import { CoursesPage } from './pages/CoursesPage'
import { DashboardPage } from './pages/DashboardPage'
import { OrdersPage } from './pages/OrdersPage'
import { PromoCodesPage } from './pages/PromoCodesPage'

function RequireAdmin({ children }: { children: ReactNode }) {
  if (!isAdminAuthed()) return <Navigate to="/admin" replace />
  return <>{children}</>
}

export function AdminApp() {
  return (
    <Routes>
      <Route path="/" element={<AdminLoginPage />} />
      <Route
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="promo" element={<PromoCodesPage />} />
        <Route path="bonuses" element={<BonusesPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
