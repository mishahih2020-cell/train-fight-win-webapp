import { Activity, Dumbbell, Flame, MoreHorizontal, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Header } from '@/components/navigation/Header'
import { Stepper, formatMMSS } from '@/components/ui/Stepper'
import { workoutsRepo } from '@/db/repos'
import { useT } from '@/i18n/useT'
import { DEFAULT_REST_SEC, DEFAULT_ROUNDS, DEFAULT_ROUND_SEC } from '@/lib/session'
import { haptic } from '@/lib/haptics'
import type { WorkoutCategory } from '@/types'

const TYPE_KEYS: WorkoutCategory[] = ['fight', 'strength', 'run', 'other']
const TYPE_ICONS: Record<WorkoutCategory, typeof Flame> = { fight: Flame, strength: Dumbbell, run: Activity, other: MoreHorizontal }

const DEFAULT_ROUND_EXERCISES = [
  { id: 're1', name: 'Джеб-кросс' },
  { id: 're2', name: 'Апперкоты' },
  { id: 're3', name: 'Работа ног' },
]

export function CreateWorkoutPage() {
  const navigate = useNavigate()
  const { t } = useT()
  const [type, setType] = useState<WorkoutCategory>('fight')
  const [name, setName] = useState('Muay Thai')
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS)
  const [roundSec, setRoundSec] = useState(DEFAULT_ROUND_SEC)
  const [restSec, setRestSec] = useState(DEFAULT_REST_SEC)
  const [exercises, setExercises] = useState(DEFAULT_ROUND_EXERCISES)

  const addExercise = () => setExercises((list) => [...list, { id: `re${Date.now()}`, name: '' }])
  const removeExercise = (id: string) => setExercises((list) => list.filter((e) => e.id !== id))
  const renameExercise = (id: string, value: string) =>
    setExercises((list) => list.map((e) => (e.id === id ? { ...e, name: value } : e)))

  const saveWorkout = async () => {
    haptic('light')
    await workoutsRepo.add({
      id: `w${Date.now()}`,
      title: name.trim(),
      category: type,
      rounds,
      roundSec,
      restSec,
      exerciseNames: exercises.map((e) => e.name.trim()).filter(Boolean),
      createdDate: new Date().toISOString().slice(0, 10),
    })
    navigate('/workouts')
  }

  return (
    <div className="pb-8">
      <Header title={t('createWorkout.title')} />

      <div className="mt-4 flex flex-col gap-5 px-4">
        <div>
          <span className="text-body-secondary mb-2 block text-[var(--color-text-secondary)]">{t('createWorkout.type')}</span>
          <div className="grid grid-cols-4 gap-2">
            {TYPE_KEYS.map((key) => {
              const Icon = TYPE_ICONS[key]
              const active = key === type
              return (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  className={`press flex flex-col items-center gap-1.5 rounded-[var(--radius-card)] border p-3 ${
                    active
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                      : 'border-[var(--color-divider)] bg-[var(--color-card)]'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`} />
                  <span className={`text-caption font-medium ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                    {t(`workouts.category.${key}`)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <Input label={t('createWorkout.name')} value={name} onChange={(e) => setName(e.target.value)} />

        <Card>
          <span className="text-body-secondary mb-3 block font-semibold text-[var(--color-text)]">{t('createWorkout.roundsSection')}</span>
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
        </Card>

        <div>
          <span className="text-body-secondary mb-1 block text-[var(--color-text-secondary)]">{t('createWorkout.exercisesTitle')}</span>
          <p className="text-caption mb-3 text-[var(--color-text-tertiary)]">{t('createWorkout.exercisesHint')}</p>

          <div className="flex flex-col gap-2">
            {exercises.map((ex, i) => (
              <div
                key={ex.id}
                className="flex items-center gap-3 rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 py-1"
              >
                <span className="text-body-secondary font-semibold text-[var(--color-text-secondary)]">{i + 1}.</span>
                <input
                  value={ex.name}
                  onChange={(e) => renameExercise(ex.id, e.target.value)}
                  placeholder={t('createWorkout.exercisePlaceholder')}
                  className="text-body-secondary h-11 flex-1 bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)]"
                />
                <button onClick={() => removeExercise(ex.id)} aria-label={t('createWorkout.delete')}>
                  <X className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addExercise}
            className="press text-body-secondary mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dashed border-[var(--color-divider)] font-medium text-[var(--color-text-secondary)]"
          >
            <Plus className="h-4 w-4" /> {t('createWorkout.addExercise')}
          </button>
        </div>

        <Button variant="primary" className="mt-2" disabled={!name.trim()} onClick={saveWorkout}>
          {t('createWorkout.save')}
        </Button>
      </div>
    </div>
  )
}
