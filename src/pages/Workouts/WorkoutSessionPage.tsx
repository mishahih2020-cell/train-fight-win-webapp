import { ChevronLeft, Pause, Play, SkipBack, SkipForward, Square } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { Timer } from '@/components/ui/Timer'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { coursesRepo, workoutLogRepo } from '@/db/repos'
import { useRoundTimer } from '@/hooks/useRoundTimer'
import { formatClock } from '@/hooks/useCountdown'
import { haptic } from '@/lib/haptics'
import { DEFAULT_REST_SEC, DEFAULT_ROUNDS, DEFAULT_ROUND_SEC, type SessionNavState } from '@/lib/session'
import { playComplete, playCountdownTick, playRoundEnd, playRoundStart, playWarning } from '@/lib/sound'

export function WorkoutSessionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { soundEnabled } = useAppState()
  const { t, tn } = useT()
  const navState = (location.state as SessionNavState | null) ?? {}

  const config = useMemo(
    () => ({
      rounds: navState.rounds ?? DEFAULT_ROUNDS,
      roundSec: navState.roundSec ?? DEFAULT_ROUND_SEC,
      restSec: navState.restSec ?? DEFAULT_REST_SEC,
    }),
    // Captured once for the lifetime of this screen — see useRoundTimer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const exerciseNames = navState.exerciseNames ?? []

  const timer = useRoundTimer(config, {
    onRoundStart: () => {
      haptic('medium')
      if (soundEnabled) playRoundStart()
    },
    onRestStart: () => {
      haptic('heavy')
      if (soundEnabled) playRoundEnd()
    },
    onWarning: () => {
      haptic('light')
      if (soundEnabled) playWarning()
    },
    onCountdownTick: () => {
      haptic('light')
      if (soundEnabled) playCountdownTick()
    },
    onComplete: () => {
      haptic('heavy')
      if (soundEnabled) playComplete()
    },
  })

  const finishWorkout = async () => {
    if (!navState.isQuickTimer) {
      await workoutLogRepo.add({
        id: `wl${Date.now()}`,
        title: navState.workoutName ?? t('createWorkout.title'),
        category: navState.category ?? 'other',
        date: new Date().toISOString().slice(0, 10),
        durationSec: timer.elapsedSec,
        exerciseCount: timer.rounds,
      })

      if (navState.courseId) {
        const course = await coursesRepo.get(navState.courseId)
        if (course) {
          const nextProgress = Math.min(100, (course.progress ?? 0) + 20)
          await coursesRepo.update(course.id, { progress: nextProgress })
        }
      }
    }

    navigate('/workouts')
  }

  if (timer.phase === 'done') {
    return (
      <div className="safe-top safe-bottom overscroll-none fixed inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <div className="text-h1 text-[var(--color-text)]">{t('session.complete')}</div>
        <p className="text-body-secondary text-[var(--color-text-secondary)]">
          {tn('workouts.rounds', timer.rounds)} · {formatClock(timer.elapsedSec)}
        </p>
        <Button variant="primary" className="mt-6" onClick={finishWorkout}>
          {t('common.done')}
        </Button>
      </div>
    )
  }

  const phaseColor = timer.phase === 'rest' ? 'var(--color-success)' : 'var(--color-accent)'
  const phaseLabel =
    timer.phase === 'prep'
      ? t('session.getReady')
      : timer.phase === 'round'
        ? `${t('session.round')} ${timer.roundIndex + 1} ${t('session.roundOf')} ${timer.rounds}`
        : t('session.rest')
  const currentExerciseName =
    timer.phase === 'round' && exerciseNames.length > 0 ? exerciseNames[timer.roundIndex % exerciseNames.length] : null
  const headerTitle = navState.workoutName ?? (navState.isQuickTimer ? t('session.quickTimerTitle') : null)

  return (
    <div className="safe-top safe-bottom overscroll-none fixed inset-0 flex flex-col overflow-y-auto px-4 pt-4">
      <div className="flex items-center justify-between">
        <IconButton variant="card" onClick={() => navigate(-1)} aria-label={t('common.back')}>
          <ChevronLeft className="h-5 w-5" />
        </IconButton>
        <Timer label={formatClock(timer.secondsLeft)} color={phaseColor} />
        <IconButton variant="card" onClick={timer.toggleRunning} aria-label={timer.running ? t('session.pause') : t('session.resume')}>
          {timer.running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </IconButton>
      </div>

      <div className="mt-6 text-center">
        {headerTitle && (
          <p className="text-caption font-semibold tracking-wide text-[var(--color-accent)] uppercase">{headerTitle}</p>
        )}
        <h1 className="text-h2 mt-1" style={{ color: phaseColor }}>
          {phaseLabel}
        </h1>
        {currentExerciseName && (
          <p className="text-body-secondary mt-1 text-[var(--color-text-secondary)]">{currentExerciseName}</p>
        )}
      </div>

      <PlaceholderImage className="mt-6 aspect-[4/5] w-full flex-1" />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
          <div className="text-caption text-[var(--color-text-secondary)]">{t('session.roundLabel')}</div>
          <div className="text-h2 mt-1 text-[var(--color-text)]">
            {Math.min(timer.roundIndex + 1, timer.rounds)}/{timer.rounds}
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
          <div className="text-caption text-[var(--color-text-secondary)]">{t('session.roundLength')}</div>
          <div className="text-h2 mt-1 text-[var(--color-text)]">{formatClock(timer.roundSec)}</div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
          <div className="text-caption text-[var(--color-text-secondary)]">{t('session.restLabel')}</div>
          <div className="text-h2 mt-1 text-[var(--color-text)]">{formatClock(timer.restSec)}</div>
        </div>
      </div>

      <div className="mt-6 mb-2 flex items-center justify-center gap-6">
        <IconButton
          variant="card"
          size={48}
          disabled={!timer.canSkipPrev}
          onClick={timer.skipPrev}
          aria-label={t('session.prevRound')}
          className="disabled:opacity-40"
        >
          <SkipBack className="h-5 w-5" />
        </IconButton>
        <IconButton variant="accent" size={72} onClick={finishWorkout} aria-label={t('session.finish')}>
          <Square className="h-7 w-7" fill="white" />
        </IconButton>
        <IconButton
          variant="card"
          size={48}
          disabled={!timer.canSkipNext}
          onClick={timer.skipNext}
          aria-label={t('session.nextRound')}
          className="disabled:opacity-40"
        >
          <SkipForward className="h-5 w-5" />
        </IconButton>
      </div>
    </div>
  )
}
