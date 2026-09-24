import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { Wheel } from '@/components/ui/Wheel'
import { useAppState } from '@/context/AppStateContext'
import { WHEEL_SEGMENTS } from '@/data/mock'

export function WheelPage() {
  const { wheelSpinsLeft, spendSpin } = useAppState()
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const spin = () => {
    if (spinning || wheelSpinsLeft <= 0) return
    spendSpin()
    setSpinning(true)
    setRotation((r) => r + 1800 + Math.floor(Math.random() * 360))
    window.setTimeout(() => setSpinning(false), 4200)
  }

  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col px-4 pt-4">
      <Header title="Колесо Фортуны" />

      <div className="mt-6 flex flex-1 flex-col items-center">
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

        <button className="text-body-secondary mt-4 font-medium text-[var(--color-text-secondary)] underline underline-offset-4">
          Как это работает?
        </button>
      </div>
    </div>
  )
}
