import { ChevronLeft, Pause, Play, SkipBack, SkipForward, Square } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/ui/IconButton'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { Timer } from '@/components/ui/Timer'
import { formatClock, useStopwatch } from '@/hooks/useCountdown'
import { SESSION_EXERCISE } from '@/data/mock'

export function WorkoutSessionPage() {
  const navigate = useNavigate()
  const [running, setRunning] = useState(true)
  const elapsed = useStopwatch(running)

  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col px-4 pt-4">
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
        <h1 className="text-h2 text-[var(--color-text)]">{SESSION_EXERCISE.title}</h1>
        <p className="text-body-secondary mt-1 text-[var(--color-text-secondary)]">
          {SESSION_EXERCISE.index} из {SESSION_EXERCISE.total}
        </p>
      </div>

      <PlaceholderImage className="mt-6 aspect-[4/5] w-full flex-1" />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
          <div className="text-caption text-[var(--color-text-secondary)]">Раунды</div>
          <div className="text-h2 mt-1 text-[var(--color-text)]">{SESSION_EXERCISE.round}</div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
          <div className="text-caption text-[var(--color-text-secondary)]">Время</div>
          <div className="text-h2 mt-1 text-[var(--color-text)]">{SESSION_EXERCISE.time}</div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-center">
          <div className="text-caption text-[var(--color-text-secondary)]">Отдых</div>
          <div className="text-h2 mt-1 text-[var(--color-text)]">{SESSION_EXERCISE.rest}</div>
        </div>
      </div>

      <div className="mt-6 mb-2 flex items-center justify-center gap-6">
        <IconButton variant="card" size={48} aria-label="Предыдущее упражнение">
          <SkipBack className="h-5 w-5" />
        </IconButton>
        <IconButton variant="accent" size={72} onClick={() => navigate('/workouts')} aria-label="Завершить">
          <Square className="h-7 w-7" fill="white" />
        </IconButton>
        <IconButton variant="card" size={48} aria-label="Следующее упражнение">
          <SkipForward className="h-5 w-5" />
        </IconButton>
      </div>
    </div>
  )
}
