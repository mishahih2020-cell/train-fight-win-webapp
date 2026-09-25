import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function TabLayout() {
  return (
    <div className="pb-24">
      <Outlet />
      <BottomNav />
    </div>
  )
}
