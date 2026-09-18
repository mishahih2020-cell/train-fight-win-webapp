import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/navigation/BottomNav'

export function TabLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  )
}
