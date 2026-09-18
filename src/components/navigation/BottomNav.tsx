import { NavLink } from 'react-router-dom'
import { BookOpen, CircleDot, PlayCircle, User } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Уроки', icon: PlayCircle, end: true },
  { to: '/courses', label: 'Курсы', icon: BookOpen, end: false },
  { to: '/wheel', label: 'Колесо', icon: CircleDot, end: false },
  { to: '/profile', label: 'Профиль', icon: User, end: false },
]

export function BottomNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[560px] border-t border-border bg-bg/92 backdrop-blur-lg">
      <div className="flex items-stretch justify-between px-2">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `press flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-bold tracking-wide ${
                isActive ? 'text-lime' : 'text-muted-2'
              }`
            }
          >
            <Icon size={22} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export const BOTTOM_NAV_HEIGHT = 'pb-[76px]'
