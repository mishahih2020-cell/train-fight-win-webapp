import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Wheel } from '@/components/ui/Wheel'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { awardBonus, wheelSegmentsRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { haptic } from '@/lib/haptics'

export function WheelPage() {
  const { wheelSpinsLeft, spendSpin } = useAppState()
  const { t } = useT()
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
      <Header title={t('wheel.title')} />

      <div className="mt-6 flex flex-1 flex-col items-center px-4">
        {segments.length > 0 && <Wheel segments={segments} rotation={rotation} spinning={spinning} />}

        <p className="text-body-secondary mt-8 max-w-[280px] text-center text-[var(--color-text-secondary)]">{t('wheel.subtitle')}</p>

        <button
          onClick={spin}
          disabled={spinning || wheelSpinsLeft <= 0}
          className="press text-button gradient-accent mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-[var(--radius-button)] text-white disabled:opacity-50"
        >
          {t('wheel.spin')}
          <span className="text-caption rounded-[var(--radius-pill)] bg-black/25 px-2 py-0.5 font-bold">{wheelSpinsLeft}</span>
        </button>

        <button
          onClick={() => setInfoOpen(true)}
          className="text-body-secondary mt-4 font-medium text-[var(--color-text-secondary)] underline underline-offset-4"
        >
          {t('wheel.howItWorks')}
        </button>
      </div>

      <Modal open={!!result} onClose={() => setResult(null)}>
        <div className="text-center">
          <div className="text-h2 text-[var(--color-text)]">{result?.bonusAwarded ? t('wheel.congrats') : t('wheel.almost')}</div>
          <p className="text-body-secondary mt-2 text-[var(--color-text-secondary)]">{t('wheel.result', { label: result?.label ?? '' })}</p>
          {result?.bonusAwarded && <p className="text-caption mt-1 font-medium text-[var(--color-success)]">{t('wheel.bonusAwarded')}</p>}
          <Button variant="primary" className="mt-5" onClick={() => setResult(null)}>
            {t('wheel.great')}
          </Button>
        </div>
      </Modal>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)}>
        <div className="text-h2 text-[var(--color-text)]">{t('wheel.howItWorks')}</div>
        <p className="text-body-secondary mt-3 text-[var(--color-text-secondary)]">{t('wheel.howItWorksBody')}</p>
        <Button variant="primary" className="mt-5" onClick={() => setInfoOpen(false)}>
          {t('common.understood')}
        </Button>
      </Modal>
    </div>
  )
}
