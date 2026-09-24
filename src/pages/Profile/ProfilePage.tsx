import {
  ChevronRight,
  Gift,
  GraduationCap,
  Settings as SettingsIcon,
  ShoppingBag,
  Star,
  Target,
  Ticket,
  User,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { IconButton } from '@/components/ui/IconButton'
import { PROFILE_STATS, SETTINGS_ITEMS, USER } from '@/data/mock'

const ROUTES: Record<string, string> = { s6: '/wheel' }

const ICONS: Record<string, typeof User> = {
  s1: User,
  s2: Target,
  s3: GraduationCap,
  s4: ShoppingBag,
  s5: Ticket,
  s6: Gift,
  s7: Star,
  s8: SettingsIcon,
}

export function ProfilePage() {
  const navigate = useNavigate()
  return (
    <div className="safe-top px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-[var(--color-text)]">Профиль</h1>
        <IconButton variant="card" aria-label="Настройки">
          <SettingsIcon className="h-5 w-5" />
        </IconButton>
      </div>

      <div className="mt-5 flex flex-col items-center text-center">
        <PlaceholderImage className="h-24 w-24" rounded="rounded-full" />
        <div className="mt-3 flex items-center gap-2">
          <span className="text-h2 text-[var(--color-text)]">{USER.firstName}</span>
          {USER.isPro && (
            <span className="text-caption rounded-[var(--radius-pill)] bg-[var(--color-accent)] px-2 py-0.5 font-bold text-white">
              PRO
            </span>
          )}
        </div>
        <span className="text-body-secondary text-[var(--color-text-secondary)]">{USER.username}</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {PROFILE_STATS.map((s) => (
          <div key={s.id} className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
            <div className="text-h2 text-[var(--color-text)]">{s.value}</div>
            <div className="text-caption mt-0.5 text-[var(--color-text-secondary)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)]">
        {SETTINGS_ITEMS.map((item, i) => {
          const Icon = ICONS[item.id]
          return (
            <button
              key={item.id}
              onClick={() => {
                const to = ROUTES[item.id]
                if (to) navigate(to)
              }}
              className={`press flex h-14 items-center gap-3 px-4 text-left ${
                i !== SETTINGS_ITEMS.length - 1 ? 'border-b border-[var(--color-divider)]' : ''
              }`}
            >
              <Icon className="h-5 w-5 text-[var(--color-text-secondary)]" />
              <span className="text-body flex-1 text-[var(--color-text)]">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-caption rounded-[var(--radius-pill)] px-2 py-0.5 font-semibold ${
                    item.badge === 'PRO' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-card-2)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-[var(--color-text-tertiary)]" />
            </button>
          )
        })}
      </div>

      <div className="h-4" />
    </div>
  )
}
