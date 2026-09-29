import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Chips, Tabs } from '@/components/ui/Tabs'
import { WorkoutCard } from '@/components/cards/WorkoutCard'
import { WORKOUTS, WORKOUT_CATEGORIES } from '@/data/mock'
import { DEFAULT_REST_SEC, DEFAULT_ROUND_SEC } from '@/lib/session'
import { primeAudio } from '@/lib/sound'
import type { Workout } from '@/types'

// Library workouts only carry a total duration + a few exercise names, not a
// round count — derive a round count that actually fills that duration
// instead of "1 round" for a 45-minute run that happens to list one exercise.
function roundsForDuration(durationMin: number) {
  const cycleSec = DEFAULT_ROUND_SEC + DEFAULT_REST_SEC
  return Math.max(1, Math.min(15, Math.round((durationMin * 60) / cycleSec)))
}

export function WorkoutsPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'Мои тренировки' | 'Программы'>('Мои тренировки')
  const [category, setCategory] = useState<(typeof WORKOUT_CATEGORIES)[number]>('Все')

  const filtered = useMemo(
    () => (category === 'Все' ? WORKOUTS : WORKOUTS.filter((w) => w.category === category)),
    [category],
  )

  const startWorkout = (w: Workout) => {
    primeAudio()
    navigate('/workouts/session', {
      state: {
        workoutName: w.title,
        category: w.category,
        rounds: roundsForDuration(w.durationMin),
        roundSec: DEFAULT_ROUND_SEC,
        restSec: DEFAULT_REST_SEC,
        exerciseNames: w.exercises.map((e) => e.name),
      },
    })
  }

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">Тренировки</h1>

      <div className="mt-4">
        <Tabs options={['Мои тренировки', 'Программы']} value={mode} onChange={setMode} />
      </div>

      <div className="mt-4">
        <Chips options={WORKOUT_CATEGORIES} value={category} onChange={setCategory} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {mode === 'Мои тренировки' ? (
          filtered.map((w) => <WorkoutCard key={w.id} workout={w} onClick={() => startWorkout(w)} />)
        ) : (
          <div className="text-body-secondary rounded-[var(--radius-card)] border border-dashed border-[var(--color-divider)] p-6 text-center text-[var(--color-text-secondary)]">
            Программы тренировок скоро появятся
          </div>
        )}
      </div>

      <Button variant="primary" className="mt-5" onClick={() => navigate('/workouts/new')}>
        + Создать тренировку
      </Button>

      <div className="h-4" />
    </div>
  )
}
