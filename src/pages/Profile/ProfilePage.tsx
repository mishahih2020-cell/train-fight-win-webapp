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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Modal } from '@/components/ui/Modal'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { Switch } from '@/components/ui/Switch'
import { PROFILE_STATS, PURCHASE_HISTORY, SETTINGS_ITEMS, USER } from '@/data/mock'

type ModalKind = 'orders' | 'promo' | 'subscription' | 'settings' | null

const ROUTES: Record<string, string> = { s1: '/profile-setup', s2: '/progress', s3: '/courses', s6: '/wheel' }
const MODALS: Record<string, Exclude<ModalKind, null>> = { s4: 'orders', s5: 'promo', s7: 'subscription', s8: 'settings' }

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
  const [modal, setModal] = useState<ModalKind>(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const openItem = (id: string) => {
    const to = ROUTES[id]
    if (to) return navigate(to)
    const kind = MODALS[id]
    if (kind) setModal(kind)
  }

  return (
    <div className="safe-top px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-[var(--color-text)]">Профиль</h1>
        <IconButton variant="card" aria-label="Настройки" onClick={() => setModal('settings')}>
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
              onClick={() => openItem(item.id)}
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

      <Modal open={modal === 'orders'} onClose={() => setModal(null)}>
        <div className="text-h2 mb-4 text-[var(--color-text)]">История заказов</div>
        <div className="flex flex-col gap-2.5">
          {PURCHASE_HISTORY.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card-2)] px-4 py-3"
            >
              <div>
                <div className="text-body-secondary font-semibold text-[var(--color-text)]">{p.title}</div>
                <div className="text-caption mt-0.5 text-[var(--color-text-secondary)]">{p.date}</div>
              </div>
              <span className="text-body-secondary font-semibold text-[var(--color-text)]">{p.price}</span>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={modal === 'promo'}
        onClose={() => {
          setModal(null)
          setPromoApplied(false)
          setPromoCode('')
        }}
      >
        <div className="text-h2 mb-1 text-[var(--color-text)]">Промокод</div>
        <p className="text-body-secondary mb-4 text-[var(--color-text-secondary)]">Введите код и получите бонус</p>
        <div className="flex h-12 items-center rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card-2)] px-4">
          <input
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value.toUpperCase())
              setPromoApplied(false)
            }}
            placeholder="MARAT2026"
            className="text-body h-full w-full bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)]"
          />
        </div>
        {promoApplied && (
          <p className="text-caption mt-2 font-medium text-[var(--color-success)]">Промокод применён — бонус зачислен!</p>
        )}
        <Button variant="primary" className="mt-5" disabled={!promoCode.trim()} onClick={() => setPromoApplied(true)}>
          Применить
        </Button>
      </Modal>

      <Modal open={modal === 'subscription'} onClose={() => setModal(null)}>
        <div className="flex items-center gap-2">
          <div className="text-h2 text-[var(--color-text)]">Подписка</div>
          <span className="text-caption rounded-[var(--radius-pill)] bg-[var(--color-accent)] px-2 py-0.5 font-bold text-white">PRO</span>
        </div>
        <ul className="text-body-secondary mt-4 flex flex-col gap-2 text-[var(--color-text-secondary)]">
          <li>• Безлимитный доступ ко всем курсам</li>
          <li>• Персональные планы от AI Coach</li>
          <li>• Приоритетная поддержка</li>
          <li>• Бонусные попытки колеса фортуны</li>
        </ul>
        <Button variant="primary" className="mt-5" onClick={() => setModal(null)}>
          Продлить подписку
        </Button>
      </Modal>

      <Modal open={modal === 'settings'} onClose={() => setModal(null)}>
        <div className="text-h2 mb-4 text-[var(--color-text)]">Настройки</div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-body text-[var(--color-text)]">Push-уведомления</span>
            <Switch checked={pushEnabled} onChange={setPushEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body text-[var(--color-text)]">Звук в тренировке</span>
            <Switch checked={soundEnabled} onChange={setSoundEnabled} />
          </div>
        </div>
        <Button variant="primary" className="mt-6" onClick={() => setModal(null)}>
          Готово
        </Button>
      </Modal>
    </div>
  )
}
