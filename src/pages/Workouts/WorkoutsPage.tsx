import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Chips } from '@/components/ui/Tabs'
import { WorkoutCard } from '@/components/cards/WorkoutCard'
import { WORKOUT_CATEGORIES } from '@/data/mock'
import { workoutsRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { formatClock } from '@/hooks/useCountdown'
import { pluralizeRu } from '@/lib/pluralize'
import { primeAudio } from '@/lib/sound'
import { formatRelativeDate } from '@/lib/weight'
import type { SavedWorkout } from '@/types'

export function WorkoutsPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<(typeof WORKOUT_CATEGORIES)[number]>('Все')
  const { items: workouts } = useRepoList(workoutsRepo)

  const filtered = useMemo(
    () => [...workouts]
      .filter((w) => category === 'Все' || w.category === category)
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

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">Тренировки</h1>

      <div className="mt-4">
        <Chips options={WORKOUT_CATEGORIES} value={category} onChange={setCategory} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((w) => (
            <WorkoutCard
              key={w.id}
              title={w.title}
              meta={`${w.rounds} ${pluralizeRu(w.rounds, 'раунд', 'раунда', 'раундов')} · ${formatClock(w.roundSec)}`}
              dateLabel={formatRelativeDate(w.createdDate)}
              onClick={() => startWorkout(w)}
            />
          ))
        ) : (
          <div className="text-body-secondary rounded-[var(--radius-card)] border border-dashed border-[var(--color-divider)] p-6 text-center text-[var(--color-text-secondary)]">
            Тренировок в этой категории пока нет
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
