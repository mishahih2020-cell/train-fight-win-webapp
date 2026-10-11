import { Play } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/navigation/Header'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { useT } from '@/i18n/useT'
import { TRIAL_WORKOUTS } from '@/data/mock'
import { formatClock } from '@/hooks/useCountdown'
import { primeAudio } from '@/lib/sound'

export function TrialWorkoutDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, tn } = useT()
  const trial = TRIAL_WORKOUTS.find((w) => w.id === id)

  if (!trial) {
    return (
      <div className="pb-8">
        <Header title={t('home.trialSectionTitle')} />
        <div className="mt-8 px-4 text-center">
          <Button variant="secondary" className="mt-5" onClick={() => navigate('/home')}>
            {t('common.back')}
          </Button>
        </div>
      </div>
    )
  }

  const start = () => {
    primeAudio()
    navigate('/workouts/session', {
      state: { workoutName: trial.title, rounds: trial.rounds, roundSec: trial.roundSec, restSec: trial.restSec, isQuickTimer: true },
    })
  }

  return (
    <div className="pb-8">
      <Header title={trial.title} />

      <div className="mt-4 px-4">
        <button onClick={start} className="press relative block w-full" aria-label={t('home.startWorkout')}>
          <PlaceholderImage className="aspect-video w-full" darken />
          <span className="text-caption absolute top-3 right-3 rounded-[var(--radius-pill)] bg-black/60 px-2.5 py-1 font-semibold text-white backdrop-blur">
            {t('common.free')}
          </span>
          <span className="gradient-accent absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full">
            <Play className="h-7 w-7 translate-x-0.5 text-white" fill="white" />
          </span>
        </button>

        <div className="mt-4">
          <div className="text-h1 text-[var(--color-text)] uppercase">{trial.title}</div>
          <div className="text-caption mt-1 text-[var(--color-text-secondary)]">
            {tn('workouts.rounds', trial.rounds)} · {formatClock(trial.roundSec)}
          </div>
        </div>

        <p className="text-body-secondary mt-4 text-[var(--color-text-secondary)]">{trial.description}</p>
      </div>
    </div>
  )
}
