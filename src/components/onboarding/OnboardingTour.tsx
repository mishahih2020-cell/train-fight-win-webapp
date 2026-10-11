import { useLayoutEffect, useState, type RefObject } from 'react'
import { useT } from '@/i18n/useT'
import type { TranslationKey } from '@/i18n/translations'

export interface TourStep {
  titleKey: TranslationKey
  bodyKey: TranslationKey
  /** Element this step points at. `null` = the fixed bottom nav bar, which has no single ref to measure. */
  target: RefObject<HTMLElement | null> | null
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

const PAD = 8

function measure(target: TourStep['target']): Rect {
  if (target?.current) {
    target.current.scrollIntoView({ block: 'center', behavior: 'instant' })
    const r = target.current.getBoundingClientRect()
    return { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 }
  }
  // Bottom nav: fixed band at the bottom of the viewport, no element ref needed.
  return { top: window.innerHeight - 76, left: 8, width: window.innerWidth - 16, height: 68 }
}

/**
 * One-time coach-mark sequence — a real spotlight cut into the dimmed
 * backdrop around whichever element each step targets (measured live via
 * `getBoundingClientRect`, not a guessed fixed position), with the card
 * placed above or below it depending on which side has room.
 */
export function OnboardingTour({ steps, onDone }: { steps: TourStep[]; onDone: () => void }) {
  const { t } = useT()
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const step = steps[index]
  const isLast = index === steps.length - 1

  useLayoutEffect(() => {
    setRect(measure(step.target))
  }, [step])

  const next = () => (isLast ? onDone() : setIndex((i) => i + 1))

  if (!rect) return null

  const cardBelow = rect.top < window.innerHeight / 2
  const cardTop = cardBelow ? Math.min(rect.top + rect.height + 12, window.innerHeight - 200) : undefined
  const cardBottom = !cardBelow ? window.innerHeight - rect.top + 12 : undefined

  return (
    <div className="fixed inset-0 z-50" onClick={next}>
      {/* Spotlight: a transparent box the size of the target, whose huge
          box-shadow dims the rest of the screen — no SVG mask needed. */}
      <div
        className="pointer-events-none absolute rounded-[var(--radius-card)] border-2 border-[var(--color-accent)] transition-all duration-300"
        style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)' }}
      />

      <div
        className="animate-fade-in card-shadow absolute inset-x-4 rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-4"
        style={{ top: cardTop, bottom: cardBottom }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-caption font-semibold text-[var(--color-accent)]">
            {index + 1}/{steps.length}
          </span>
          <button onClick={onDone} className="text-caption font-medium text-[var(--color-text-tertiary)] underline underline-offset-4">
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
