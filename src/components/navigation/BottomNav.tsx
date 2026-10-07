import { Apple, Bot, Dumbbell, GraduationCap, Home, Lock, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import type { TranslationKey } from '@/i18n/translations'

const ITEMS: Array<{ to: string; labelKey: TranslationKey; icon: typeof Home; end: boolean; locked?: boolean }> = [
  { to: '/home', labelKey: 'nav.home', icon: Home, end: true },
  { to: '/workouts', labelKey: 'nav.workouts', icon: Dumbbell, end: false },
  { to: '/nutrition', labelKey: 'nav.nutrition', icon: Apple, end: false },
  { to: '/ai-coach', labelKey: 'nav.aiCoach', icon: Bot, end: false, locked: true },
  { to: '/courses', labelKey: 'nav.courses', icon: GraduationCap, end: false },
  { to: '/profile', labelKey: 'nav.profile', icon: User, end: false },
]

export function BottomNav() {
  const { t } = useT()
  const { isPro } = useAppState()
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-[var(--color-divider)] bg-[var(--color-bg)]/95 backdrop-blur">
      <div className="flex h-16 items-stretch justify-between px-2">
        {ITEMS.map(({ to, labelKey, icon: Icon, end, locked }) => (
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
            <span className="relative">
              <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
              {locked && !isPro && (
                <Lock className="absolute -top-1 -right-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-bg)] text-[var(--color-accent)]" strokeWidth={3} />
              )}
            </span>
            <span className="w-full truncate px-0.5 text-center text-[10px] leading-none font-medium">{t(labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
