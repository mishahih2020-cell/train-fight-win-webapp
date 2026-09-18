import { useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, Globe, Info, LogOut, Moon, HelpCircle } from 'lucide-react'
import { Header } from '@/components/navigation/Header'
import { AthletePhoto } from '@/components/ui/AthletePhoto'
import { Switch } from '@/components/ui/Switch'
import { DEFAULT_USER } from '@/data/user'
import { useAppState } from '@/context/AppStateContext'
import { useToast } from '@/context/ToastContext'

export function SettingsPage() {
  const navigate = useNavigate()
  const { state, toggleNotifications } = useAppState()
  const { showToast } = useToast()

  return (
    <div className="pb-10">
      <Header title="Настройки" />

      <div className="px-5 pt-2">
        <button className="press flex w-full items-center gap-3 rounded-md border border-border bg-graphite p-3.5 text-left">
          <AthletePhoto focal="top" fade="none" className="h-12 w-12 shrink-0 rounded-pill" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-white">{DEFAULT_USER.name}</p>
            <p className="text-[12px] text-muted">{DEFAULT_USER.username}</p>
          </div>
          <ChevronRight size={16} className="text-muted-2" />
        </button>

        <div className="mt-4 flex flex-col gap-2">
          <Row icon={<Bell size={18} />} label="Уведомления" right={<Switch checked={state.settings.notifications} onChange={toggleNotifications} />} />
          <Row icon={<Globe size={18} />} label="Язык" value={state.settings.language} onClick={() => showToast('Доступен только русский язык')} />
          <Row icon={<Moon size={18} />} label="Тема" value={state.settings.theme} onClick={() => showToast('Доступна только тёмная тема')} />
          <Row icon={<HelpCircle size={18} />} label="Поддержка" onClick={() => showToast('Поддержка: @trainfightwin_support')} />
          <Row icon={<Info size={18} />} label="О приложении" onClick={() => showToast('TRAIN FIGHT WIN · версия 1.0 (демо)')} />
        </div>

        <button
          onClick={() => navigate('/')}
          className="press mt-6 flex w-full items-center gap-3 rounded-md border border-red/25 px-4 py-3.5 text-left text-red"
        >
          <LogOut size={18} />
          <span className="text-[14px] font-bold">Выйти</span>
        </button>
      </div>
    </div>
  )
}

function Row({
  icon,
  label,
  value,
  right,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  right?: React.ReactNode
  onClick?: () => void
}) {
  const content = (
    <>
      <span className="text-lime">{icon}</span>
      <span className="flex-1 text-left text-[14px] font-semibold text-white">{label}</span>
      {right ?? (
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
          {value}
          {onClick && <ChevronRight size={16} className="text-muted-2" />}
        </span>
      )}
    </>
  )

  if (!onClick) {
    return <div className="flex items-center gap-3 rounded-md border border-border bg-graphite px-4 py-3.5">{content}</div>
  }

  return (
    <button onClick={onClick} className="press flex items-center gap-3 rounded-md border border-border bg-graphite px-4 py-3.5">
      {content}
    </button>
  )
}
