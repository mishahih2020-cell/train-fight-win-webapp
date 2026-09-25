import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAdminAuthed } from './auth'

const LINKS = [
  { to: '/admin/dashboard', label: 'Дашборд' },
  { to: '/admin/courses', label: 'Курсы' },
  { to: '/admin/promo', label: 'Промокоды' },
  { to: '/admin/bonuses', label: 'Бонусы' },
  { to: '/admin/orders', label: 'Заказы' },
]

const COMING_SOON = ['Пользователи', 'Рассылки', 'Оплаты', 'Подписки']

export function AdminLayout() {
  const navigate = useNavigate()

  return (
    <div className="safe-top safe-bottom px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-[var(--color-text)]">Админ-панель</h1>
        <button
          onClick={() => {
            clearAdminAuthed()
            navigate('/admin')
          }}
          className="text-caption font-medium text-[var(--color-text-secondary)] underline underline-offset-4"
        >
          Выйти
        </button>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `press text-body-secondary h-9 shrink-0 rounded-[var(--radius-button)] px-4 leading-9 font-semibold ${
                isActive
                  ? 'gradient-accent text-white'
                  : 'border border-[var(--color-divider)] bg-[var(--color-card)] text-[var(--color-text-secondary)]'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
        {COMING_SOON.map((label) => (
          <span
            key={label}
            className="text-caption flex h-9 shrink-0 items-center gap-1.5 rounded-[var(--radius-button)] border border-dashed border-[var(--color-divider)] px-3 text-[var(--color-text-tertiary)]"
          >
            {label} <span className="text-[10px] opacity-70">· нужен сервер</span>
          </span>
        ))}
      </div>

      <div className="mt-5">
        <Outlet />
      </div>

      <div className="h-10" />
    </div>
  )
}
