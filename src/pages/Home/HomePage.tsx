import { Flame } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { Sparkline } from '@/components/ui/Chart'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { TRIAL_WORKOUTS, USER, WEEK_DAYS } from '@/data/mock'
import { weightRepo, workoutLogRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { computeWorkoutStreak } from '@/lib/streak'
import { formatClock } from '@/hooks/useCountdown'
import { primeAudio } from '@/lib/sound'
import { formatRelativeDate, summarizeWeight } from '@/lib/weight'

export function HomePage() {
  const navigate = useNavigate()
  const { profile, language } = useAppState()
  const { t, tn } = useT()
  const [selectedDay, setSelectedDay] = useState(WEEK_DAYS[1])
  const { items: weightEntries } = useRepoList(weightRepo)
  const { items: workoutLog } = useRepoList(workoutLogRepo)

  const weight = useMemo(() => summarizeWeight(weightEntries, profile.goal, language), [weightEntries, profile.goal, language])
  const lastWorkout = useMemo(
    () => [...workoutLog].sort((a, b) => b.date.localeCompare(a.date))[0],
    [workoutLog],
  )
  const streak = useMemo(() => computeWorkoutStreak(workoutLog.map((w) => w.date)), [workoutLog])

  const startTrial = (trial: (typeof TRIAL_WORKOUTS)[number]) => {
    primeAudio()
    navigate('/workouts/session', {
      state: {
        workoutName: trial.title,
        rounds: trial.rounds,
        roundSec: trial.roundSec,
        restSec: trial.restSec,
        isQuickTimer: true,
      },
    })
  }

  return (
    <div className="safe-top px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-[var(--color-text)]">
          {t('home.greeting')}, {USER.firstName}!
        </h1>
        <button onClick={() => navigate('/profile')} aria-label={t('nav.profile')} className="press">
          <Avatar size={44} />
        </button>
      </div>

      <div className="mt-5 flex justify-between">
        {WEEK_DAYS.map((day) => {
          const active = day.dayNumber === selectedDay.dayNumber
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDay(day)}
              className="press flex flex-col items-center gap-1.5"
            >
              <span className="text-caption text-[var(--color-text-tertiary)]">{day.weekday}</span>
              <div
                className={`text-body-secondary flex h-9 w-9 items-center justify-center rounded-full font-semibold ${
                  active ? 'gradient-accent text-white' : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {day.dayNumber}
              </div>
            </button>
          )
        })}
      </div>

      <Card className="mt-5 flex flex-col gap-4">
        {selectedDay.isRest ? (
          <>
            <div>
              <div className="text-caption text-[var(--color-text-secondary)]">{t('home.todayWorkout')}</div>
              <div className="text-h2 mt-1 text-[var(--color-text)]">{t('home.restDay')}</div>
            </div>
            <Button variant="secondary" onClick={() => navigate('/workouts/new')}>
              {t('home.planWorkout')}
            </Button>
          </>
        ) : (
          <>
            <div>
              <div className="text-caption text-[var(--color-text-secondary)]">{t('home.todayWorkout')}</div>
              <div className="text-h2 mt-1 text-[var(--color-text)]">{selectedDay.workoutTitle}</div>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                primeAudio()
                navigate('/workouts/session', { state: { workoutName: selectedDay.workoutTitle } })
              }}
            >
              {t('home.startWorkout')}
            </Button>
          </>
        )}
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/progress')} className="press text-left">
          <Card>
            <div className="text-caption text-[var(--color-text-secondary)]">{t('home.weight')}</div>
            <div className="mt-1 flex items-end justify-between">
              <div>
                <div className="text-h2 text-[var(--color-text)]">{weight.current.toFixed(1)} кг</div>
                <div className="text-caption mt-0.5 font-medium" style={{ color: weight.deltaColor }}>
                  {weight.deltaLabel}
                </div>
              </div>
              {weight.points.length > 1 && <Sparkline points={weight.points} positive={weight.trendingWell} />}
            </div>
          </Card>
        </button>
        <button onClick={() => navigate('/progress')} className="press text-left">
          <Card>
            <div className="text-caption text-[var(--color-text-secondary)]">{t('home.streak')}</div>
            <div className="mt-1 flex items-end justify-between">
              <div className="text-h2 text-[var(--color-text)]">{tn('home.streakDays', streak)}</div>
              <Flame className="h-6 w-6 text-[var(--color-warning)]" fill="var(--color-warning)" strokeWidth={0} />
            </div>
          </Card>
        </button>
      </div>

      <div className="mt-4">
        <div className="text-caption mb-2 text-[var(--color-text-secondary)]">{t('home.lastWorkout')}</div>
        <button onClick={() => navigate('/workouts')} className="press w-full text-left">
          <Card className="flex items-center gap-3">
            <PlaceholderImage className="h-12 w-12 shrink-0" rounded="rounded-[var(--radius-element)]" compact />
            {lastWorkout ? (
              <div>
                <div className="text-body-secondary font-semibold text-[var(--color-text)]">
                  {formatRelativeDate(lastWorkout.date, language)} · {lastWorkout.title}
                </div>
                <div className="text-caption text-[var(--color-text-secondary)]">{tn('workouts.rounds', lastWorkout.exerciseCount)}</div>
              </div>
            ) : (
              <div className="text-body-secondary text-[var(--color-text-secondary)]">{t('home.noWorkoutsYet')}</div>
            )}
          </Card>
        </button>
      </div>

      <div className="mt-5">
        <div className="text-h2 text-[var(--color-text)]">{t('home.trialSectionTitle')}</div>
        <p className="text-caption mt-0.5 text-[var(--color-text-secondary)]">{t('home.trialSectionSubtitle')}</p>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {TRIAL_WORKOUTS.map((trial) => (
            <button
              key={trial.id}
              onClick={() => startTrial(trial)}
              className="press card-shadow w-40 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] text-left"
            >
              <PlaceholderImage className="h-24 w-full" rounded="rounded-none" compact />
              <div className="p-3">
                <div className="text-body-secondary font-semibold text-[var(--color-text)]">{trial.title}</div>
                <div className="text-caption mt-1 text-[var(--color-text-secondary)]">
                  {tn('workouts.rounds', trial.rounds)} · {formatClock(trial.roundSec)}
                </div>
                <div className="text-caption mt-1 font-semibold text-[var(--color-success)]">{t('common.free')}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}
