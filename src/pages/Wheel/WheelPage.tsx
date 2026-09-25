import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Wheel } from '@/components/ui/Wheel'
import { useAppState } from '@/context/AppStateContext'
import { WHEEL_SEGMENTS } from '@/data/mock'
import { haptic } from '@/lib/haptics'

export function WheelPage() {
  const { wheelSpinsLeft, spendSpin } = useAppState()
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)

  const spin = () => {
    if (spinning || wheelSpinsLeft <= 0) return
    haptic('medium')
    spendSpin()
    setSpinning(true)
    const segIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length)
    const segAngle = 360 / WHEEL_SEGMENTS.length
    const targetOffset = 360 - (segIndex * segAngle + segAngle / 2)
    setRotation((r) => r + 1800 + targetOffset)
    window.setTimeout(() => {
      setSpinning(false)
      haptic('heavy')
      setResult(WHEEL_SEGMENTS[segIndex].label.replace('\n', ' '))
    }, 4200)
  }

  return (
    <div className="safe-top safe-bottom overscroll-none fixed inset-0 flex flex-col overflow-y-auto">
      <Header title="Колесо Фортуны" />

      <div className="mt-6 flex flex-1 flex-col items-center px-4">
        <Wheel segments={WHEEL_SEGMENTS} rotation={rotation} spinning={spinning} />

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
          <div className="text-h2 text-[var(--color-text)]">🎉 Поздравляем!</div>
          <p className="text-body-secondary mt-2 text-[var(--color-text-secondary)]">Ваш приз: {result}</p>
          <Button variant="primary" className="mt-5" onClick={() => setResult(null)}>
            Отлично
          </Button>
        </div>
      </Modal>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)}>
        <div className="text-h2 text-[var(--color-text)]">Как это работает?</div>
        <p className="text-body-secondary mt-3 text-[var(--color-text-secondary)]">
          Каждая покупка курса даёт одну бесплатную попытку крутить колесо. Приз начисляется сразу после
          остановки — скидку можно применить при следующей покупке, а бонусные баллы и бесплатный курс появятся
          в разделе «Бонусы» в профиле.
        </p>
        <Button variant="primary" className="mt-5" onClick={() => setInfoOpen(false)}>
          Понятно
        </Button>
      </Modal>
    </div>
  )
}
