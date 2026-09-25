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
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Modal } from '@/components/ui/Modal'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { Switch } from '@/components/ui/Switch'
import { USER } from '@/data/mock'
import { awardBonus, bonusLedgerRepo, ordersRepo, promoCodesRepo, weightRepo, workoutLogRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { computeWorkoutStreak } from '@/lib/streak'
import { summarizeWeight } from '@/lib/weight'

type ModalKind = 'orders' | 'promo' | 'subscription' | 'settings' | null

const ROUTES: Record<string, string> = { s1: '/profile-setup', s2: '/progress', s3: '/courses', s6: '/wheel' }
const MODALS: Record<string, Exclude<ModalKind, null>> = { s4: 'orders', s5: 'promo', s7: 'subscription', s8: 'settings' }

const SETTINGS_ITEMS = [
  { id: 's1', label: 'Мои данные', icon: User },
  { id: 's2', label: 'Мои цели', icon: Target },
  { id: 's3', label: 'Мои курсы', icon: GraduationCap },
  { id: 's4', label: 'История заказов', icon: ShoppingBag },
  { id: 's5', label: 'Промокоды', icon: Ticket },
  { id: 's6', label: 'Бонусы', icon: Gift },
  { id: 's7', label: 'Подписка', icon: Star, badge: 'PRO' },
  { id: 's8', label: 'Настройки', icon: SettingsIcon },
]

export function ProfilePage() {
  const navigate = useNavigate()
  const [modal, setModal] = useState<ModalKind>(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoResult, setPromoResult] = useState<'ok' | 'error' | 'used' | null>(null)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const { items: orders } = useRepoList(ordersRepo)
  const { items: weightEntries } = useRepoList(weightRepo)
  const { items: workoutLog } = useRepoList(workoutLogRepo)
  const { items: bonusLedger, reload: reloadBonus } = useRepoList(bonusLedgerRepo)

  const bonusBalance = useMemo(() => bonusLedger.reduce((sum, e) => sum + e.amount, 0), [bonusLedger])
  const currentWeight = useMemo(() => summarizeWeight(weightEntries).current, [weightEntries])
  const streak = useMemo(() => computeWorkoutStreak(workoutLog.map((w) => w.date)), [workoutLog])
  const profileStats = [
    { id: 'streak', label: 'Серия', value: `${streak}` },
    { id: 'workouts', label: 'Тренировок', value: `${workoutLog.length}` },
    { id: 'weight', label: 'Вес', value: currentWeight ? `${currentWeight.toFixed(0)} кг` : '—' },
  ]

  const openItem = (id: string) => {
    const to = ROUTES[id]
    if (to) return navigate(to)
    const kind = MODALS[id]
    if (kind) setModal(kind)
  }

  const applyPromo = async () => {
    const codes = await promoCodesRepo.list()
    const match = codes.find((c) => c.id === promoCode.trim().toUpperCase() && c.active)
    if (!match) {
      setPromoResult('error')
      return
    }
    const reason = `Промокод ${match.id}`
    if (bonusLedger.some((e) => e.reason === reason)) {
      setPromoResult('used')
      return
    }
    await awardBonus(match.discountPercent * 2, reason)
    reloadBonus()
    setPromoResult('ok')
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
        {profileStats.map((s) => (
          <div key={s.id} className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
            <div className="text-h2 text-[var(--color-text)]">{s.value}</div>
            <div className="text-caption mt-0.5 text-[var(--color-text-secondary)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)]">
        {SETTINGS_ITEMS.map((item, i) => {
          const Icon = item.icon
          const badge = item.id === 's6' ? String(bonusBalance) : item.badge
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
              {badge && (
                <span
                  className={`text-caption rounded-[var(--radius-pill)] px-2 py-0.5 font-semibold ${
                    badge === 'PRO' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-card-2)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {badge}
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
          {orders.length > 0 ? (
            [...orders]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card-2)] px-4 py-3"
                >
                  <div>
                    <div className="text-body-secondary font-semibold text-[var(--color-text)]">{o.courseTitle}</div>
                    <div className="text-caption mt-0.5 text-[var(--color-text-secondary)]">{o.date}</div>
                  </div>
                  <span className="text-body-secondary font-semibold text-[var(--color-text)]">
                    {o.amount > 0 ? `${o.amount.toLocaleString('ru-RU')} ₽` : 'Бесплатно'}
                  </span>
                </div>
              ))
          ) : (
            <p className="text-body-secondary text-[var(--color-text-secondary)]">Заказов пока нет</p>
          )}
        </div>
      </Modal>

      <Modal
        open={modal === 'promo'}
        onClose={() => {
          setModal(null)
          setPromoResult(null)
          setPromoCode('')
        }}
      >
        <div className="text-h2 mb-1 text-[var(--color-text)]">Промокод</div>
        <p className="text-body-secondary mb-4 text-[var(--color-text-secondary)]">Введите код и получите бонусные баллы</p>
        <div className="flex h-12 items-center rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card-2)] px-4">
          <input
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value.toUpperCase())
              setPromoResult(null)
            }}
            placeholder="MARAT10"
            className="text-body h-full w-full bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)]"
          />
        </div>
        {promoResult === 'ok' && (
          <p className="text-caption mt-2 font-medium text-[var(--color-success)]">Промокод применён — бонус зачислен!</p>
        )}
        {promoResult === 'error' && (
          <p className="text-caption mt-2 font-medium text-[var(--color-accent)]">Промокод не найден или недействителен</p>
        )}
        {promoResult === 'used' && (
          <p className="text-caption mt-2 font-medium text-[var(--color-warning)]">Этот промокод уже был применён раньше</p>
        )}
        <Button variant="primary" className="mt-5" disabled={!promoCode.trim()} onClick={applyPromo}>
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
        <p className="text-caption mt-4 rounded-[var(--radius-button)] bg-[var(--color-card-2)] p-3 text-[var(--color-text-tertiary)]">
          Продление подписки заработает после подключения платёжной системы на сервере.
        </p>
        <Button variant="primary" className="mt-5" onClick={() => setModal(null)}>
          Понятно
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
