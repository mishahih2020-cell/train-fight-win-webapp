import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ChatMessage } from '@/components/ui/ChatMessage'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { USER } from '@/data/mock'
import type { ChatMessageData } from '@/types'

type Phase = 'splash' | 'chat' | 'reward'
const TYPING_DELAY_MS = 900

/**
 * One-time animated entrance shown right after profile setup, before Home:
 * branded splash → a short scripted "coach" chat building rapport → a real
 * reward reveal (a genuine wheel spin is granted here, not just claimed).
 */
export function WelcomePage() {
  const navigate = useNavigate()
  const { displayName, addSpin } = useAppState()
  const { t } = useT()
  const [phase, setPhase] = useState<Phase>('splash')
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)

  const messages = useMemo<string[]>(
    () => [
      t('welcome.msg1', { name: displayName || USER.firstName }),
      t('welcome.msg2'),
      t('welcome.msg3'),
    ],
    [t, displayName],
  )

  useEffect(() => {
    const id = setTimeout(() => setPhase('chat'), 1300)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (phase !== 'chat') return
    if (shown >= messages.length) {
      const id = setTimeout(() => setPhase('reward'), 500)
      return () => clearTimeout(id)
    }
    setTyping(true)
    const id = setTimeout(() => {
      setTyping(false)
      setShown((n) => n + 1)
    }, TYPING_DELAY_MS)
    return () => clearTimeout(id)
  }, [phase, shown, messages.length])

  useEffect(() => {
    if (phase === 'reward') addSpin(1)
    // Fires once per mount when the reward phase is reached — not on every
    // render, since `phase` only flips forward through the sequence above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const chatData: ChatMessageData[] = messages.slice(0, shown).map((text, i) => ({ id: `w${i}`, from: 'ai', text }))

  return (
    <div className="safe-top safe-bottom overscroll-none fixed inset-0 flex flex-col items-center justify-center px-6">
      {phase === 'splash' && (
        <div className="animate-fade-in flex flex-col items-center gap-5">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div
              className="animate-spin-slow absolute inset-0 rounded-full border-2 border-transparent"
              style={{ borderTopColor: 'var(--color-accent)', borderRightColor: 'var(--color-accent)' }}
            />
            <div className="gradient-accent flex h-16 w-16 items-center justify-center rounded-full">
              <Dumbbell className="h-7 w-7 text-white" />
            </div>
          </div>
          <span className="text-caption font-bold tracking-[0.2em] text-[var(--color-text-secondary)]">{t('welcome.appName')}</span>
        </div>
      )}

      {phase === 'chat' && (
        <div className="flex w-full max-w-sm flex-col gap-3">
          {chatData.map((m) => (
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
      )}

      {phase === 'reward' && (
        <div className="animate-scale-in flex w-full max-w-sm flex-col items-center text-center">
          <div className="text-h1 text-[var(--color-text)]">{t('welcome.rewardTitle')}</div>
          <p className="text-body-secondary mt-2 text-[var(--color-text-secondary)]">{t('welcome.rewardBody')}</p>
          <Button variant="primary" size="large" className="mt-8" onClick={() => navigate('/profile-setup')}>
            {t('welcome.enter')}
          </Button>
        </div>
      )}
    </div>
  )
}
