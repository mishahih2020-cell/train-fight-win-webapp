import { useEffect, useRef, useState } from 'react'
import { Gift, ShoppingBag, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Wheel } from '@/components/wheel/Wheel'
import { WHEEL_COOLDOWN_HOURS } from '@/data/wheel'
import { useAppState } from '@/context/AppStateContext'

const COOLDOWN_MS = WHEEL_COOLDOWN_HOURS * 60 * 60 * 1000

export function WheelPage() {
  const { state, spinWheel, claimWheelReward } = useAppState()
  const [spinning, setSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const prevSpinAt = useRef(state.wheel.lastSpinAt)

  const now = Date.now()
  const canSpin =
    !spinning &&
    (state.wheel.freeRespin || !state.wheel.lastSpinAt || now - state.wheel.lastSpinAt >= COOLDOWN_MS)

  useEffect(() => {
    if (state.wheel.lastSpinAt && state.wheel.lastSpinAt !== prevSpinAt.current) {
      prevSpinAt.current = state.wheel.lastSpinAt
      setSpinning(true)
    }
  }, [state.wheel.lastSpinAt])

  const handleSpinEnd = () => {
    setSpinning(false)
    setShowResult(true)
  }

  const handleClaim = () => {
    claimWheelReward()
    setShowResult(false)
  }

  const reward = state.wheel.pendingReward

  return (
    <div className="pb-28">
      <div className="px-5 pt-[max(16px,env(safe-area-inset-top))]">
        <h1 className="text-[24px] font-extrabold uppercase tracking-tight">Колесо фортуны</h1>
        <p className="mt-1 text-[13px] leading-snug text-muted">
          Крути колесо и получай награды за активность и покупки.
        </p>
      </div>

      <div className="mt-8">
        <Wheel
          spinning={spinning}
          targetSegmentId={state.wheel.pendingReward?.id ?? null}
          onSpinEnd={handleSpinEnd}
          onSpinRequest={() => canSpin && spinWheel()}
          disabled={!canSpin}
        />
      </div>

      <div className="mt-7 px-5">
        <div className="rounded-pill border border-lime/25 bg-lime/10 px-4 py-2.5 text-center text-[13px] font-bold text-lime">
          {canSpin ? 'Твой бонус доступен!' : 'Следующий спин будет доступен позже'}
        </div>
      </div>

      <div className="mt-6 px-5">
        <p className="mb-3 text-[13px] font-extrabold uppercase tracking-wide text-white">Как это работает?</p>
        <div className="flex flex-col gap-2.5">
          <HowStep number={1} icon={<ShoppingBag size={16} />} text="Совершай покупку" />
          <HowStep number={2} icon={<Gift size={16} />} text="Получай бонусы" />
          <HowStep number={3} icon={<Sparkles size={16} />} text="Крути колесо и выигрывай" />
        </div>
      </div>

      <Modal open={showResult} onClose={handleClaim} dismissible={false}>
        <div className="animate-scale-in flex flex-col items-center pt-4 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-pill bg-lime/12 text-lime shadow-[0_0_28px_rgba(198,255,69,0.25)]">
            <Sparkles size={30} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Твоя награда</p>
          <h2 className="mt-2 text-[26px] font-extrabold uppercase leading-tight text-balance">
            {reward?.label ?? ''}
          </h2>
          <Button className="mt-6" onClick={handleClaim}>
            Забрать бонус
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function HowStep({ number, icon, text }: { number: number; icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md surface px-4 py-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-white/8 text-[12px] font-extrabold text-white">
        {number}
      </span>
      <span className="text-lime">{icon}</span>
      <span className="text-[13px] font-semibold text-white">{text}</span>
    </div>
  )
}
