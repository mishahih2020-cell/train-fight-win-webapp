import { Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { ChatMessage } from '@/components/ui/ChatMessage'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { weightRepo, workoutLogRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { buildAiReply, buildQuickActionReply } from '@/lib/aiCoach'
import { haptic } from '@/lib/haptics'
import { summarizeWeight } from '@/lib/weight'
import type { ChatMessageData } from '@/types'

const REPLY_DELAY_MS = 700
const QUICK_ACTION_IDS = ['qa1', 'qa2', 'qa3'] as const
const QUICK_ACTION_KEYS: Record<string, 'aiCoach.quick.plan' | 'aiCoach.quick.nutrition' | 'aiCoach.quick.progress'> = {
  qa1: 'aiCoach.quick.plan',
  qa2: 'aiCoach.quick.nutrition',
  qa3: 'aiCoach.quick.progress',
}

export function AICoachPage() {
  const { profile, language } = useAppState()
  const { t } = useT()
  const { items: weightEntries } = useRepoList(weightRepo)
  const { items: workoutLog } = useRepoList(workoutLogRepo)
  const [extraMessages, setExtraMessages] = useState<ChatMessageData[]>([])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)

  const context = useMemo(() => {
    const weight = summarizeWeight(weightEntries, profile.goal, language)
    const sorted = [...workoutLog].sort((a, b) => b.date.localeCompare(a.date))
    return {
      goal: t(`goal.${profile.goal}`),
      workoutCount: workoutLog.length,
      lastWorkoutTitle: sorted[0]?.title,
      weightCurrent: weight.current,
      weightDeltaLabel: weight.deltaLabel,
    }
  }, [weightEntries, workoutLog, profile.goal, language, t])

  const seedMessages = useMemo<ChatMessageData[]>(
    () => [{ id: 'ai-seed', from: 'ai', text: buildAiReply('', context, language) }],
    [context, language],
  )
  const messages = [...seedMessages, ...extraMessages]

  const respond = (replyText: string) => {
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setExtraMessages((m) => [...m, { id: `ai${Date.now()}`, from: 'ai', text: replyText }])
    }, REPLY_DELAY_MS)
  }

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setExtraMessages((m) => [...m, { id: `u${Date.now()}`, from: 'user', text }])
    setDraft('')
    respond(buildAiReply(text, context, language))
  }

  const sendQuickAction = (actionId: string, label: string) => {
    haptic('light')
    setExtraMessages((m) => [...m, { id: `u${Date.now()}`, from: 'user', text: label }])
    respond(buildQuickActionReply(actionId, context, language))
  }

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">{t('aiCoach.title')}</h1>

      <Card className="mt-4 flex items-center gap-3">
        <Avatar size={44} />
        <div>
          <div className="text-body-secondary font-semibold text-[var(--color-text)]">{t('aiCoach.name')}</div>
          <div className="text-caption text-[var(--color-text-secondary)]">{t('aiCoach.subtitle')}</div>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-3">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {typing && (
          <div className="animate-fade-in flex items-center gap-2">
            <Avatar size={28} />
            <div className="text-caption rounded-[var(--radius-card)] rounded-tl-[4px] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 py-3 text-[var(--color-text-secondary)]">
              {t('aiCoach.typing')}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {QUICK_ACTION_IDS.map((id) => {
          const label = t(QUICK_ACTION_KEYS[id])
          return (
            <button
              key={id}
              onClick={() => sendQuickAction(id, label)}
              className="press text-body-secondary flex h-11 items-center rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 text-left font-medium text-[var(--color-text)]"
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={t('aiCoach.placeholder')}
          className="text-body h-12 flex-1 rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)]"
        />
        <button
          onClick={send}
          className="press flex h-12 w-12 shrink-0 items-center justify-center rounded-full gradient-accent text-white"
          aria-label={t('aiCoach.send')}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      <div className="h-4" />
    </div>
  )
}
