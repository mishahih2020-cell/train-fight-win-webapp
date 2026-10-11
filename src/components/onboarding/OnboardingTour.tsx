import { useState } from 'react'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import type { TranslationKey } from '@/i18n/translations'

interface TourStep {
  titleKey: TranslationKey
  bodyKey: TranslationKey
  /** Roughly where on screen the referenced section sits — this is a simple
   * coach-mark overlay (fixed-position cards), not a true per-element
   * spotlight, so positioning is approximate rather than pixel-measured. */
  anchor: 'top' | 'upperMiddle' | 'lowerMiddle' | 'bottom'
}

const STEPS: TourStep[] = [
  { titleKey: 'tour.step1Title', bodyKey: 'tour.step1Body', anchor: 'top' },
  { titleKey: 'tour.step2Title', bodyKey: 'tour.step2Body', anchor: 'upperMiddle' },
  { titleKey: 'tour.step3Title', bodyKey: 'tour.step3Body', anchor: 'lowerMiddle' },
  { titleKey: 'tour.step4Title', bodyKey: 'tour.step4Body', anchor: 'bottom' },
  { titleKey: 'tour.step5Title', bodyKey: 'tour.step5Body', anchor: 'top' },
]

const ANCHOR_CLASS: Record<TourStep['anchor'], string> = {
  top: 'top-20',
  upperMiddle: 'top-[38%]',
  lowerMiddle: 'top-[58%]',
  bottom: 'bottom-24',
}

/** One-time coach-mark sequence shown on first visit to Home — see AppStateContext.tourSeen. */
export function OnboardingTour() {
  const { completeTour } = useAppState()
  const { t } = useT()
  const [index, setIndex] = useState(0)
  const step = STEPS[index]
  const isLast = index === STEPS.length - 1

  const next = () => (isLast ? completeTour() : setIndex((i) => i + 1))

  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={next}>
      <div
        className={`animate-fade-in card-shadow absolute inset-x-4 ${ANCHOR_CLASS[step.anchor]} rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-4`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-caption font-semibold text-[var(--color-accent)]">
            {index + 1}/{STEPS.length}
          </span>
          <button onClick={completeTour} className="text-caption font-medium text-[var(--color-text-tertiary)] underline underline-offset-4">
            {t('tour.skip')}
          </button>
        </div>
        <div className="text-h2 mt-2 text-[var(--color-text)]">{t(step.titleKey)}</div>
        <p className="text-body-secondary mt-1 text-[var(--color-text-secondary)]">{t(step.bodyKey)}</p>
        <button
          onClick={next}
          className="press text-button gradient-accent mt-4 flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] text-white"
        >
          {isLast ? t('common.done') : t('tour.next')}
        </button>
      </div>
    </div>
  )
}
