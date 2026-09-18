import { Sparkles, Zap } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'

export function LevelUpModal() {
  const { state, dismissLevelUp } = useAppState()
  const info = state.levelUp

  if (!info) return null

  return (
    <Modal open={!!info} onClose={dismissLevelUp}>
      <div className="animate-scale-in flex flex-col items-center pt-4 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-pill bg-lime/12 text-lime shadow-[0_0_28px_rgba(198,255,69,0.25)]">
          <Sparkles size={30} />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Уровень пройден</p>
        <h2 className="mt-2 text-[26px] font-extrabold uppercase leading-tight">Уровень {info.newLevel}</h2>
        <p className="mt-2 max-w-[280px] text-[14px] leading-snug text-muted">
          Ты становишься сильнее. Двигаемся дальше.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-pill border border-lime/25 bg-lime/10 px-4 py-2.5 text-[14px] font-extrabold text-lime">
          <Zap size={16} />
          +{info.xpGained} XP
        </div>

        <Button className="mt-6" onClick={dismissLevelUp}>
          Продолжить
        </Button>
      </div>
    </Modal>
  )
}
