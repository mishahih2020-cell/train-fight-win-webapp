import { ChevronLeft, Pause, Play, SkipBack, SkipForward, Square } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/ui/IconButton'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { Timer } from '@/components/ui/Timer'
import { formatClock, useStopwatch } from '@/hooks/useCountdown'
import { SESSION_EXERCISES } from '@/data/mock'
import type { SessionExercise } from '@/types'

interface SessionNavState {
  workoutName?: string
  exercises?: SessionExercise[]
}

export function WorkoutSessionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const navState = location.state as SessionNavState | null
  const customExercises = navState?.exercises?.length ? navState.exercises : null
  const exercises = customExercises ?? SESSION_EXERCISES

  const [running, setRunning] = useState(true)
  const [index, setIndex] = useState(() => (customExercises ? 0 : Math.min(2, exercises.length - 1)))
  const elapsed = useStopwatch(running)
  const exercise = exercises[index]

  return (
    <div className="safe-top safe-bottom overscroll-none fixed inset-0 flex flex-col overflow-y-auto px-4 pt-4">
      <div className="flex items-center justify-between">
        <IconButton variant="card" onClick={() => navigate(-1)} aria-label="Назад">
          <ChevronLeft className="h-5 w-5" />
        </IconButton>
        <Timer label={formatClock(elapsed)} />
        <IconButton variant="card" onClick={() => setRunning((r) => !r)} aria-label={running ? 'Пауза' : 'Продолжить'}>
          {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </IconButton>
      </div>

      <div className="mt-6 text-center">
        {navState?.workoutName && (
          <p className="text-caption font-semibold tracking-wide text-[var(--color-accent)] uppercase">{navState.workoutName}</p>
        )}
        <h1 className="text-h2 text-[var(--color-text)]">{exercise.title}</h1>
        <p className="text-body-secondary mt-1 text-[var(--color-text-secondary)]">
          {index + 1} из {exercises.length}
        </p>
      </div>

      <PlaceholderImage className="mt-6 aspect-[4/5] w-full flex-1" />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
          <div className="text-caption text-[var(--color-text-secondary)]">Раунды</div>
          <div className="text-h2 mt-1 text-[var(--color-text)]">{exercise.round}</div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
          <div className="text-caption text-[var(--color-text-secondary)]">Время</div>
          <div className="text-h2 mt-1 text-[var(--color-text)]">{exercise.time}</div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
          <div className="text-caption text-[var(--color-text-secondary)]">Отдых</div>
          <div className="text-h2 mt-1 text-[var(--color-text)]">{exercise.rest}</div>
        </div>
      </div>

      <div className="mt-6 mb-2 flex items-center justify-center gap-6">
        <IconButton
          variant="card"
          size={48}
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          aria-label="Предыдущее упражнение"
          className="disabled:opacity-40"
        >
          <SkipBack className="h-5 w-5" />
        </IconButton>
        <IconButton variant="accent" size={72} onClick={() => navigate('/workouts')} aria-label="Завершить">
          <Square className="h-7 w-7" fill="white" />
        </IconButton>
        <IconButton
          variant="card"
          size={48}
          disabled={index === exercises.length - 1}
          onClick={() => setIndex((i) => Math.min(exercises.length - 1, i + 1))}
          aria-label="Следующее упражнение"
          className="disabled:opacity-40"
        >
          <SkipForward className="h-5 w-5" />
        </IconButton>
      </div>
    </div>
  )
}
