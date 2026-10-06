import { Timer as TimerIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Chips } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { Stepper, formatMMSS } from '@/components/ui/Stepper'
import { WorkoutCard } from '@/components/cards/WorkoutCard'
import { WORKOUT_CATEGORIES } from '@/data/mock'
import { workoutsRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { formatClock } from '@/hooks/useCountdown'
import { primeAudio } from '@/lib/sound'
import { DEFAULT_REST_SEC, DEFAULT_ROUNDS, DEFAULT_ROUND_SEC } from '@/lib/session'
import { formatRelativeDate } from '@/lib/weight'
import type { SavedWorkout } from '@/types'

export function WorkoutsPage() {
  const navigate = useNavigate()
  const { language } = useAppState()
  const { t, tn } = useT()
  const [category, setCategory] = useState<(typeof WORKOUT_CATEGORIES)[number]>('all')
  const { items: workouts } = useRepoList(workoutsRepo)
  const [quickTimerOpen, setQuickTimerOpen] = useState(false)
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS)
  const [roundSec, setRoundSec] = useState(DEFAULT_ROUND_SEC)
  const [restSec, setRestSec] = useState(DEFAULT_REST_SEC)

  const filtered = useMemo(
    () => [...workouts]
      .filter((w) => category === 'all' || w.category === category)
      .sort((a, b) => b.createdDate.localeCompare(a.createdDate)),
    [workouts, category],
  )

  const startWorkout = (w: SavedWorkout) => {
    primeAudio()
    navigate('/workouts/session', {
      state: {
        workoutName: w.title,
        category: w.category,
        rounds: w.rounds,
        roundSec: w.roundSec,
        restSec: w.restSec,
        exerciseNames: w.exerciseNames,
      },
    })
  }

  const startQuickTimer = () => {
    primeAudio()
    navigate('/workouts/session', { state: { rounds, roundSec, restSec, isQuickTimer: true } })
  }

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">{t('workouts.title')}</h1>

      <div className="mt-4">
        <Chips options={WORKOUT_CATEGORIES} value={category} onChange={setCategory} labelFor={(c) => t(`workouts.category.${c}`)} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((w) => (
            <WorkoutCard
              key={w.id}
              title={w.title}
              meta={`${tn('workouts.rounds', w.rounds)} · ${formatClock(w.roundSec)}`}
              dateLabel={formatRelativeDate(w.createdDate, language)}
              onClick={() => startWorkout(w)}
            />
          ))
        ) : (
          <div className="text-body-secondary rounded-[var(--radius-card)] border border-dashed border-[var(--color-divider)] p-6 text-center text-[var(--color-text-secondary)]">
            {t('workouts.empty')}
          </div>
        )}
      </div>

      <Button variant="primary" className="mt-5" onClick={() => navigate('/workouts/new')}>
        {t('workouts.create')}
      </Button>

      <button
        onClick={() => setQuickTimerOpen(true)}
        className="press text-body-secondary mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] font-semibold text-[var(--color-text)]"
      >
        <TimerIcon className="h-5 w-5 text-[var(--color-accent)]" />
        {t('workouts.quickTimer')}
      </button>
      <p className="text-caption mt-2 text-center text-[var(--color-text-tertiary)]">{t('workouts.quickTimerHint')}</p>

      <div className="h-4" />

      <Modal open={quickTimerOpen} onClose={() => setQuickTimerOpen(false)}>
        <div className="text-h2 mb-4 text-[var(--color-text)]">{t('workouts.quickTimer')}</div>
        <div className="grid grid-cols-3 gap-2">
          <Stepper
            label={t('createWorkout.roundsCount')}
            display={String(rounds)}
            onDec={() => setRounds((r) => Math.max(1, r - 1))}
            onInc={() => setRounds((r) => Math.min(15, r + 1))}
          />
          <Stepper
            label={t('createWorkout.roundLength')}
            display={formatMMSS(roundSec)}
            onDec={() => setRoundSec((s) => Math.max(30, s - 15))}
            onInc={() => setRoundSec((s) => Math.min(300, s + 15))}
          />
          <Stepper
            label={t('createWorkout.rest')}
            display={formatMMSS(restSec)}
            onDec={() => setRestSec((s) => Math.max(15, s - 15))}
            onInc={() => setRestSec((s) => Math.min(180, s + 15))}
          />
        </div>
        <Button variant="primary" className="mt-5" onClick={startQuickTimer}>
          {t('home.startWorkout')}
        </Button>
      </Modal>
    </div>
  )
}
