import { HelpCircle, Lock, Send } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ChatMessage } from '@/components/ui/ChatMessage'
import { IconButton } from '@/components/ui/IconButton'
import { OnboardingTour, type TourStep } from '@/components/onboarding/OnboardingTour'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { weightRepo, workoutLogRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { buildAiReply, buildQuickActionReply } from '@/lib/aiCoach'
import { API_BASE, apiFetch } from '@/lib/apiClient'
import { haptic } from '@/lib/haptics'
import { track } from '@/lib/analytics'
import { summarizeWeight } from '@/lib/weight'
import type { ChatMessageData } from '@/types'

const REPLY_DELAY_MS = 700
const QUICK_ACTION_IDS = ['qa1', 'qa2', 'qa3'] as const
const QUICK_ACTION_KEYS: Record<string, 'aiCoach.quick.plan' | 'aiCoach.quick.nutrition' | 'aiCoach.quick.progress'> = {
  qa1: 'aiCoach.quick.plan',
  qa2: 'aiCoach.quick.nutrition',
  qa3: 'aiCoach.quick.progress',
}

function AICoachPaywall() {
  const { setIsPro, tours, completeTour } = useAppState()
  const { t } = useT()
  const [tourForced, setTourForced] = useState(false)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const tourSteps = useMemo<TourStep[]>(
    () => [{ titleKey: 'tour.aiCoachLocked.step1Title', bodyKey: 'tour.aiCoachLocked.step1Body', target: ctaRef }],
    [],
  )

  return (
    <div className="safe-top px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-[var(--color-text)]">{t('aiCoach.title')}</h1>
        <IconButton variant="card" aria-label={t('tour.help')} onClick={() => setTourForced(true)}>
          <HelpCircle className="h-4 w-4" />
        </IconButton>
      </div>

      <Card className="mt-4 flex items-center gap-3">
        <Avatar size={44} />
        <div>
          <div className="text-body-secondary font-semibold text-[var(--color-text)]">{t('aiCoach.name')}</div>
          <div className="text-caption text-[var(--color-text-secondary)]">{t('aiCoach.subtitle')}</div>
        </div>
      </Card>

      <div className="mt-8 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-card)]">
          <Lock className="h-6 w-6 text-[var(--color-accent)]" />
        </div>
        <h2 className="text-h2 mt-4 text-[var(--color-text)]">{t('aiCoach.lockedTitle')}</h2>
        <p className="text-body-secondary mt-2 text-[var(--color-text-secondary)]">{t('aiCoach.lockedBody')}</p>

        <ul className="text-body-secondary mt-5 flex flex-col gap-2 self-stretch text-left text-[var(--color-text-secondary)]">
          <li>• {t('aiCoach.quick.plan')}</li>
          <li>• {t('aiCoach.quick.nutrition')}</li>
          <li>• {t('aiCoach.quick.progress')}</li>
        </ul>

        <Button ref={ctaRef} variant="primary" className="mt-6" onClick={() => setIsPro(true)}>
          {t('aiCoach.lockedCta', { price: t('profile.subscription.price') })}
        </Button>
        <p className="text-caption mt-3 text-[var(--color-text-tertiary)]">{t('profile.subscription.testNote')}</p>
      </div>

      <div className="h-4" />

      {(tourForced || !tours.aiCoachLocked) && (
        <OnboardingTour
          steps={tourSteps}
          onDone={() => {
            completeTour('aiCoachLocked')
            setTourForced(false)
          }}
        />
      )}
    </div>
  )
}

export function AICoachPage() {
  const { profile, language, isPro, tours, completeTour } = useAppState()
  const { t } = useT()
  const { items: weightEntries } = useRepoList(weightRepo)
  const { items: workoutLog } = useRepoList(workoutLogRepo)
  const [extraMessages, setExtraMessages] = useState<ChatMessageData[]>([])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [tourForced, setTourForced] = useState(false)
  const quickActionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const tourSteps = useMemo<TourStep[]>(
    () => [
      { titleKey: 'tour.aiCoach.step1Title', bodyKey: 'tour.aiCoach.step1Body', target: quickActionsRef },
      { titleKey: 'tour.aiCoach.step2Title', bodyKey: 'tour.aiCoach.step2Body', target: inputRef },
    ],
    [],
  )

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

  if (!isPro) return <AICoachPaywall />

  // Local mode (no backend yet): instant canned reply after a short fake
  // "typing" delay — this is the behaviour of the current production
  // build. Remote mode: a real AI reply from the backend (see
  // server/src/routes/aiCoach.ts), with the canned reply only as a
  // fallback if that request fails.
  const respondLocal = (replyText: string) => {
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setExtraMessages((m) => [...m, { id: `ai${Date.now()}`, from: 'ai', text: replyText }])
    }, REPLY_DELAY_MS)
  }

  const respondRemote = async (userText: string, fallbackReply: string) => {
    setTyping(true)
    try {
      const res = await apiFetch('/api/ai-coach/message', { method: 'POST', body: JSON.stringify({ text: userText }) })
      const data = res.ok ? await res.json() : null
      const replyText = typeof data?.reply === 'string' ? data.reply : fallbackReply
      setExtraMessages((m) => [...m, { id: `ai${Date.now()}`, from: 'ai', text: replyText }])
    } catch {
      setExtraMessages((m) => [...m, { id: `ai${Date.now()}`, from: 'ai', text: fallbackReply }])
    } finally {
      setTyping(false)
    }
  }

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setExtraMessages((m) => [...m, { id: `u${Date.now()}`, from: 'user', text }])
    setDraft('')
    track('ai_coach_message')
    if (API_BASE) void respondRemote(text, buildAiReply(text, context, language))
    else respondLocal(buildAiReply(text, context, language))
  }

  const sendQuickAction = (actionId: string, label: string) => {
    haptic('light')
    setExtraMessages((m) => [...m, { id: `u${Date.now()}`, from: 'user', text: label }])
    track('ai_coach_message', { quickAction: actionId })
    const fallback = buildQuickActionReply(actionId, context, language)
    if (API_BASE) void respondRemote(label, fallback)
    else respondLocal(fallback)
  }

  return (
    <div className="safe-top px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-[var(--color-text)]">{t('aiCoach.title')}</h1>
        <IconButton variant="card" aria-label={t('tour.help')} onClick={() => setTourForced(true)}>
          <HelpCircle className="h-4 w-4" />
        </IconButton>
      </div>

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

      <div ref={quickActionsRef} className="mt-4 flex flex-col gap-2">
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

      <div ref={inputRef} className="mt-4 flex items-center gap-2">
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

      {(tourForced || !tours.aiCoach) && (
        <OnboardingTour
          steps={tourSteps}
          onDone={() => {
            completeTour('aiCoach')
            setTourForced(false)
          }}
        />
      )}
    </div>
  )
}
