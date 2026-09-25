import { Apple, Bot, Dumbbell, GraduationCap, Home, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/home', label: 'Главная', icon: Home, end: true },
  { to: '/workouts', label: 'Тренировки', icon: Dumbbell, end: false },
  { to: '/nutrition', label: 'Питание', icon: Apple, end: false },
  { to: '/ai-coach', label: 'AI Coach', icon: Bot, end: false },
  { to: '/courses', label: 'Курсы', icon: GraduationCap, end: false },
  { to: '/profile', label: 'Профиль', icon: User, end: false },
]

export function BottomNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-[var(--color-divider)] bg-[var(--color-bg)]/95 backdrop-blur">
      <div className="flex h-16 items-stretch justify-between px-2">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `press flex min-w-0 flex-1 flex-col items-center justify-center gap-1 ${
                isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-tertiary)]'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
            <span className="w-full truncate px-0.5 text-center text-[10px] leading-none font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
