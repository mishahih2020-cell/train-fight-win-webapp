import { Flame, HelpCircle } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IconButton } from '@/components/ui/IconButton'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { Sparkline } from '@/components/ui/Chart'
import { OnboardingTour, type TourStep } from '@/components/onboarding/OnboardingTour'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { TRIAL_WORKOUTS, USER, WEEK_PLAN } from '@/data/mock'
import { weightRepo, workoutLogRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { buildCurrentWeek } from '@/lib/calendar'
import { computeWorkoutStreak } from '@/lib/streak'
import { formatClock } from '@/hooks/useCountdown'
import { primeAudio } from '@/lib/sound'
import { formatRelativeDate, summarizeWeight } from '@/lib/weight'

export function HomePage() {
  const navigate = useNavigate()
  const { profile, language, displayName, tours, completeTour } = useAppState()
  const { t, tn } = useT()
  const weekDays = useMemo(() => buildCurrentWeek(language, WEEK_PLAN), [language])
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null)
  const [tourForced, setTourForced] = useState(false)
  const weekRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const trialRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)
  // Stable array identity across re-renders — OnboardingTour measures the
  // current step's target in a layout effect keyed on the step object, so a
  // fresh array/object here on every render would re-measure needlessly.
  const tourSteps = useMemo<TourStep[]>(
    () => [
      { titleKey: 'tour.step1Title', bodyKey: 'tour.step1Body', target: weekRef },
      { titleKey: 'tour.step2Title', bodyKey: 'tour.step2Body', target: statsRef },
      { titleKey: 'tour.step3Title', bodyKey: 'tour.step3Body', target: trialRef },
      { titleKey: 'tour.step4Title', bodyKey: 'tour.step4Body', target: null },
      { titleKey: 'tour.step5Title', bodyKey: 'tour.step5Body', target: avatarRef },
    ],
    [],
  )
  const selectedDay = weekDays.find((d) => d.dayNumber === selectedDayNumber) ?? weekDays.find((d) => d.isToday) ?? weekDays[0]
  const { items: weightEntries } = useRepoList(weightRepo)
  const { items: workoutLog } = useRepoList(workoutLogRepo)

  const weight = useMemo(() => summarizeWeight(weightEntries, profile.goal, language), [weightEntries, profile.goal, language])
  const lastWorkout = useMemo(
    () => [...workoutLog].sort((a, b) => b.date.localeCompare(a.date))[0],
    [workoutLog],
  )
  const streak = useMemo(() => computeWorkoutStreak(workoutLog.map((w) => w.date)), [workoutLog])


  return (
    <div className="safe-top px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-[var(--color-text)]">
          {t('home.greeting')}, {displayName || USER.firstName}!
        </h1>
        <div className="flex items-center gap-2">
          <IconButton variant="card" aria-label={t('tour.help')} onClick={() => setTourForced(true)}>
            <HelpCircle className="h-4 w-4" />
          </IconButton>
          <button ref={avatarRef} onClick={() => navigate('/profile')} aria-label={t('nav.profile')} className="press">
            <Avatar size={44} />
          </button>
        </div>
      </div>

      <div ref={weekRef} className="mt-5 flex justify-between">
        {weekDays.map((day) => {
          const active = day.dayNumber === selectedDay.dayNumber
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className="press flex flex-col items-center gap-1.5"
            >
              <span className="text-caption text-[var(--color-text-tertiary)]">{day.weekday}</span>
              <div
                className={`text-body-secondary flex h-9 w-9 items-center justify-center rounded-full font-semibold ${
                  active ? 'gradient-accent text-white' : day.isToday ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
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

      <div ref={statsRef} className="mt-4 grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/progress')} className="press text-left">
          <Card>
            <div className="text-caption text-[var(--color-text-secondary)]">{t('home.weight')}</div>
            <div className="mt-1 flex items-end justify-between">
              <div>
                <div className="text-h2 text-[var(--color-text)]">{weight.current.toFixed(1)} {t('common.kg')}</div>
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
              <Flame className="h-8 w-8 text-[var(--color-warning)]" fill="var(--color-warning)" strokeWidth={0} />
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

      <div ref={trialRef} className="mt-5">
        <div className="text-h2 text-[var(--color-text)]">{t('home.trialSectionTitle')}</div>
        <p className="text-caption mt-0.5 text-[var(--color-text-secondary)]">{t('home.trialSectionSubtitle')}</p>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {TRIAL_WORKOUTS.map((trial) => (
            <button
              key={trial.id}
              onClick={() => navigate(`/workouts/trial/${trial.id}`)}
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

      {(tourForced || !tours.home) && (
        <OnboardingTour
          steps={tourSteps}
          onDone={() => {
            completeTour('home')
            setTourForced(false)
          }}
        />
      )}
    </div>
  )
}
