import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Wheel } from '@/components/ui/Wheel'
import { useAppState } from '@/context/AppStateContext'
import { awardBonus, wheelSegmentsRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { haptic } from '@/lib/haptics'

export function WheelPage() {
  const { wheelSpinsLeft, spendSpin } = useAppState()
  const { items: segments } = useRepoList(wheelSegmentsRepo)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<{ label: string; bonusAwarded: boolean } | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)

  const spin = () => {
    if (spinning || wheelSpinsLeft <= 0 || segments.length === 0) return
    haptic('medium')
    spendSpin()
    setSpinning(true)
    const segIndex = Math.floor(Math.random() * segments.length)
    const segAngle = 360 / segments.length
    const targetOffset = 360 - (segIndex * segAngle + segAngle / 2)
    setRotation((r) => r + 1800 + targetOffset)
    window.setTimeout(async () => {
      setSpinning(false)
      haptic('heavy')
      const prize = segments[segIndex]
      const label = prize.label.replace('\n', ' ')
      const bonusAwarded = !label.toLowerCase().includes('ещё раз')
      if (bonusAwarded) {
        await awardBonus(20, `Колесо фортуны: ${label}`)
      }
      setResult({ label, bonusAwarded })
    }, 4200)
  }

  return (
    <div className="safe-top safe-bottom overscroll-none fixed inset-0 flex flex-col overflow-y-auto">
      <Header title="Колесо Фортуны" />

      <div className="mt-6 flex flex-1 flex-col items-center px-4">
        {segments.length > 0 && <Wheel segments={segments} rotation={rotation} spinning={spinning} />}

        <p className="text-body-secondary mt-8 max-w-[280px] text-center text-[var(--color-text-secondary)]">
          Крути колесо за покупку курса и получи бонус!
        </p>

        <button
          onClick={spin}
          disabled={spinning || wheelSpinsLeft <= 0}
          className="press text-button gradient-accent mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-[var(--radius-button)] text-white disabled:opacity-50"
        >
          Крутить
          <span className="text-caption rounded-[var(--radius-pill)] bg-black/25 px-2 py-0.5 font-bold">
            {wheelSpinsLeft}
          </span>
        </button>

        <button
          onClick={() => setInfoOpen(true)}
          className="text-body-secondary mt-4 font-medium text-[var(--color-text-secondary)] underline underline-offset-4"
        >
          Как это работает?
        </button>
      </div>

      <Modal open={!!result} onClose={() => setResult(null)}>
        <div className="text-center">
          <div className="text-h2 text-[var(--color-text)]">{result?.bonusAwarded ? '🎉 Поздравляем!' : 'Почти!'}</div>
          <p className="text-body-secondary mt-2 text-[var(--color-text-secondary)]">Выпало: {result?.label}</p>
          {result?.bonusAwarded && (
            <p className="text-caption mt-1 font-medium text-[var(--color-success)]">+20 бонусов начислено</p>
          )}
          <Button variant="primary" className="mt-5" onClick={() => setResult(null)}>
            Отлично
          </Button>
        </div>
      </Modal>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)}>
        <div className="text-h2 text-[var(--color-text)]">Как это работает?</div>
        <p className="text-body-secondary mt-3 text-[var(--color-text-secondary)]">
          Каждая покупка курса даёт одну бесплатную попытку крутить колесо. За любой приз, кроме «Попробуй ещё
          раз», сразу начисляются бонусные баллы — посмотреть баланс и историю начислений можно в разделе
          «Бонусы» в профиле. Автоматическое применение скидок и купонов заработает после переноса на сервер.
        </p>
        <Button variant="primary" className="mt-5" onClick={() => setInfoOpen(false)}>
          Понятно
        </Button>
      </Modal>
    </div>
  )
}
