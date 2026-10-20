import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { ConfirmDeleteButton } from '@/components/ui/ConfirmDeleteButton'
import { API_BASE, apiFetch } from '@/lib/apiClient'

interface Summary {
  newUsersInPeriod: number
  dauInPeriod: number
  wau: number
  mau: number
  totalUsers: number
  eventsInPeriod: number
  timerStartsInPeriod: number
  courseViewsInPeriod: number
  purchasesInPeriod: number
  revenueInPeriod: number
  activeSubscriptions: number
  topCategories: { category: string; n: string }[]
  activeStreaks3Plus: number
}

type Period = 'day' | 'week' | 'month'
const PERIOD_LABEL: Record<Period, string> = { day: 'За день', week: 'За неделю', month: 'За месяц' }

interface Recipient {
  id: number
  telegram_chat_id: number
  label: string | null
  enabled: boolean
}

interface BotContact {
  telegram_chat_id: number
  telegram_username: string | null
  first_name: string | null
  last_message_at: string
}

async function getJson<T>(path: string): Promise<T | null> {
  const res = await apiFetch(path)
  return res.ok ? res.json() : null
}

export function AnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [botContacts, setBotContacts] = useState<BotContact[]>([])
  const [settings, setSettings] = useState<Record<string, unknown>>({})
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)
  const [newChatId, setNewChatId] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [period, setPeriod] = useState<Period>('day')

  const loadAll = async (p: Period = period) => {
    try {
      const [s, r, c, st] = await Promise.all([
        getJson<Summary>(`/api/admin/analytics/summary?period=${p}`),
        getJson<Recipient[]>('/api/admin/recipients'),
        getJson<BotContact[]>('/api/admin/bot-contacts'),
        getJson<Record<string, unknown>>('/api/admin/settings'),
      ])
      if (!s || !r || !c || !st) {
        setError(true)
        return
      }
      setSummary(s)
      setRecipients(r)
      setBotContacts(c)
      setSettings(st)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoaded(true)
    }
  }

  useEffect(() => {
    if (API_BASE) loadAll()
    else setLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changePeriod = (p: Period) => {
    setPeriod(p)
    loadAll(p)
  }

  const toggleSetting = async (key: string, value: boolean) => {
    setSettings((s) => ({ ...s, [key]: value }))
    await apiFetch(`/api/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) })
  }

  const addRecipient = async () => {
    const chatId = Number(newChatId.trim())
    if (!Number.isFinite(chatId) || !chatId) return
    await apiFetch('/api/admin/recipients', { method: 'POST', body: JSON.stringify({ telegramChatId: chatId, label: newLabel || null }) })
    setNewChatId('')
    setNewLabel('')
    loadAll()
  }

  const addFromContact = async (contact: BotContact) => {
    await apiFetch('/api/admin/recipients', {
      method: 'POST',
      body: JSON.stringify({ telegramChatId: contact.telegram_chat_id, label: contact.first_name ?? contact.telegram_username }),
    })
    loadAll()
  }

  const toggleRecipient = async (id: number, enabled: boolean) => {
    await apiFetch(`/api/admin/recipients/${id}`, { method: 'PUT', body: JSON.stringify({ enabled }) })
    loadAll()
  }

  const removeRecipient = async (id: number) => {
    await apiFetch(`/api/admin/recipients/${id}`, { method: 'DELETE' })
    loadAll()
  }

  const sendNow = async () => {
    if (sending) return
    setSending(true)
    setSendResult(null)
    try {
      const res = await apiFetch('/api/admin/report/send-now', { method: 'POST' })
      const data = await res.json()
      setSendResult(res.ok ? `Отправлено ${data.delivered}/${data.sentTo} получателям` : 'Не получилось отправить')
    } catch {
      setSendResult('Не получилось отправить')
    } finally {
      setSending(false)
    }
  }

  if (!API_BASE) {
    return (
      <Card>
        <p className="text-body-secondary text-[var(--color-text-secondary)]">
          Статистика и Telegram-отчёты соберутся здесь после подключения сервера (появится домен и HTTPS) — тогда и
          Telegram-бот начнёт получать и отправлять сообщения. Код уже готов, просто ждёт включения.
        </p>
      </Card>
    )
  }

  if (!loaded) return null

  if (error || !summary) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-accent)] bg-[var(--color-card)] p-4 text-center">
        <p className="text-body-secondary text-[var(--color-text)]">Не получилось загрузить аналитику.</p>
        <button onClick={() => loadAll()} className="text-caption mt-2 font-medium text-[var(--color-accent)] underline underline-offset-4">
          Повторить
        </button>
      </div>
    )
  }

  const stats = [
    { label: 'Активны в периоде', value: summary.dauInPeriod },
    { label: 'Активны за 7 дней (WAU)', value: summary.wau },
    { label: 'Активны за 30 дней (MAU)', value: summary.mau },
    { label: 'Новых в периоде', value: summary.newUsersInPeriod },
    { label: 'Всего пользователей', value: summary.totalUsers },
    { label: 'Стрик 3+ дня', value: summary.activeStreaks3Plus },
    { label: 'Запусков таймера', value: summary.timerStartsInPeriod },
    { label: 'Просмотров курсов', value: summary.courseViewsInPeriod },
    { label: 'Покупок', value: summary.purchasesInPeriod },
    { label: 'Выручка', value: `${summary.revenueInPeriod.toLocaleString('ru-RU')} ₽` },
    { label: 'Активных подписок AI Coach', value: summary.activeSubscriptions },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-h2 text-[var(--color-text)]">Сводка</h2>
          <div className="flex gap-1.5">
            {(['day', 'week', 'month'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => changePeriod(p)}
                className={`text-caption h-8 rounded-[var(--radius-button)] px-3 font-semibold ${
                  period === p
                    ? 'gradient-accent text-white'
                    : 'border border-[var(--color-divider)] bg-[var(--color-card)] text-[var(--color-text-secondary)]'
                }`}
              >
                {PERIOD_LABEL[p]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <div className="text-caption text-[var(--color-text-secondary)]">{s.label}</div>
              <div className="text-h2 mt-1 text-[var(--color-text)]">{s.value}</div>
            </Card>
          ))}
        </div>
        {summary.topCategories.length > 0 && (
          <p className="text-caption mt-3 text-[var(--color-text-tertiary)]">
            Топ категорий тренировок: {summary.topCategories.map((c) => `${c.category} (${c.n})`).join(', ')}
          </p>
        )}
      </div>

      <div>
        <h2 className="text-h2 mb-3 text-[var(--color-text)]">Отчёты в Telegram</h2>
        <Card className="flex items-center justify-between">
          <span className="text-body-secondary text-[var(--color-text)]">Ежедневный (00:00 МСК)</span>
          <Switch checked={Boolean(settings.daily_report_enabled)} onChange={(v) => toggleSetting('daily_report_enabled', v)} />
        </Card>
        <Card className="mt-3 flex items-center justify-between">
          <span className="text-body-secondary text-[var(--color-text)]">Еженедельный (вс 00:00 МСК)</span>
          <Switch checked={Boolean(settings.weekly_report_enabled)} onChange={(v) => toggleSetting('weekly_report_enabled', v)} />
        </Card>
        <Card className="mt-3 flex items-center justify-between">
          <span className="text-body-secondary text-[var(--color-text)]">Ежемесячный (посл. день, 18:00 МСК)</span>
          <Switch checked={Boolean(settings.monthly_report_enabled)} onChange={(v) => toggleSetting('monthly_report_enabled', v)} />
        </Card>
        <Card className="mt-3 flex items-center justify-between">
          <span className="text-body-secondary text-[var(--color-text)]">Напоминания о курсе пользователям</span>
          <Switch checked={Boolean(settings.course_reminders_enabled)} onChange={(v) => toggleSetting('course_reminders_enabled', v)} />
        </Card>

        <Button variant="secondary" className="mt-3" disabled={sending || recipients.length === 0} onClick={sendNow}>
          {sending ? 'Отправляю…' : 'Отправить дневной отчёт прямо сейчас'}
        </Button>
        <p className="text-caption mt-2 text-[var(--color-text-tertiary)]">
          Полное меню со статистикой/продажами/рассылкой по кнопкам — прямо в Telegram-боте, командой /admin (видно только
          зарегистрированным получателям ниже).
        </p>
        {sendResult && <p className="text-caption mt-2 text-[var(--color-text-tertiary)]">{sendResult}</p>}
        {recipients.length === 0 && (
          <p className="text-caption mt-2 text-[var(--color-text-tertiary)]">
            Добавь хотя бы одного получателя ниже — иначе некому отправлять.
          </p>
        )}
      </div>

      <div>
        <h2 className="text-h2 mb-3 text-[var(--color-text)]">Получатели отчёта</h2>
        <Card className="flex items-end gap-2">
          <div className="flex-1">
            <Input label="Telegram chat ID" value={newChatId} onChange={(e) => setNewChatId(e.target.value)} placeholder="123456789" />
          </div>
          <div className="flex-1">
            <Input label="Метка" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Я / владелец" />
          </div>
          <Button variant="secondary" fullWidth={false} disabled={!newChatId.trim()} onClick={addRecipient}>
            Добавить
          </Button>
        </Card>

        <div className="mt-3 flex flex-col gap-2">
          {recipients.map((r) => (
            <Card key={r.id} className="flex items-center justify-between">
              <div>
                <div className="text-body-secondary font-semibold text-[var(--color-text)]">{r.label || 'Без метки'}</div>
                <div className="text-caption text-[var(--color-text-secondary)]">chat_id: {r.telegram_chat_id}</div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={r.enabled} onChange={(v) => toggleRecipient(r.id, v)} />
                <ConfirmDeleteButton label="Удалить получателя" onConfirm={() => removeRecipient(r.id)} />
              </div>
            </Card>
          ))}
          {recipients.length === 0 && (
            <p className="text-body-secondary text-center text-[var(--color-text-secondary)]">Получателей пока нет</p>
          )}
        </div>

        {botContacts.length > 0 && (
          <>
            <p className="text-caption mt-4 text-[var(--color-text-tertiary)]">
              Писали боту, но не добавлены получателями — нажми, чтобы добавить:
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {botContacts.map((c) => (
                <button
                  key={c.telegram_chat_id}
                  onClick={() => addFromContact(c)}
                  className="press flex items-center justify-between rounded-[var(--radius-button)] border border-dashed border-[var(--color-divider)] bg-[var(--color-card)] px-4 py-2.5 text-left"
                >
                  <span className="text-body-secondary text-[var(--color-text)]">
                    {c.first_name || c.telegram_username || 'Без имени'} ({c.telegram_chat_id})
                  </span>
                  <span className="text-caption text-[var(--color-accent)]">+ добавить</span>
                </button>
              ))}
            </div>
          </>
        )}

        <p className="text-caption mt-3 text-[var(--color-text-tertiary)]">
          Чтобы узнать свой chat_id: напиши что-нибудь боту приложения в Telegram, подожди минуту и обнови эту страницу
          — твой чат появится в списке выше.
        </p>
      </div>
    </div>
  )
}
