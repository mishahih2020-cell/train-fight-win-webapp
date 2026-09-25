import { Activity, Dumbbell, Flame, MoreHorizontal, Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StepProgress } from '@/components/ui/ProgressBar'
import { Header } from '@/components/navigation/Header'
import { CREATE_WORKOUT_TYPES, DEFAULT_NEW_EXERCISES } from '@/data/mock'
import type { Exercise } from '@/types'

const TYPE_ICONS = { fight: Flame, strength: Dumbbell, run: Activity, other: MoreHorizontal }

export function CreateWorkoutPage() {
  const navigate = useNavigate()
  const [type, setType] = useState('fight')
  const [name, setName] = useState('Muay Thai')
  const [duration, setDuration] = useState(90)
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_NEW_EXERCISES)

  const addExercise = () =>
    setExercises((list) => [...list, { id: `ne${list.length + 1}`, name: 'Новое упражнение', durationMin: 15 }])
  const removeExercise = (id: string) => setExercises((list) => list.filter((e) => e.id !== id))

  return (
    <div className="pb-8">
      <Header title="Новая тренировка">
        <div className="mt-4">
          <StepProgress step={2} total={4} />
        </div>
      </Header>

      <div className="mt-6 flex flex-col gap-5 px-4">
        <div>
          <span className="text-body-secondary mb-2 block text-[var(--color-text-secondary)]">Тип тренировки</span>
          <div className="grid grid-cols-4 gap-2">
            {CREATE_WORKOUT_TYPES.map((t) => {
              const Icon = TYPE_ICONS[t.id as keyof typeof TYPE_ICONS]
              const active = t.id === type
              return (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`press flex flex-col items-center gap-1.5 rounded-[var(--radius-card)] border p-3 ${
                    active
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                      : 'border-[var(--color-divider)] bg-[var(--color-card)]'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`} />
                  <span className={`text-caption font-medium ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                    {t.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <Input label="Название" value={name} onChange={(e) => setName(e.target.value)} />

        <div>
          <span className="text-body-secondary mb-2 block text-[var(--color-text-secondary)]">Длительность</span>
          <div className="flex h-12 items-center justify-between rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4">
            <button
              className="press flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-card-2)]"
              onClick={() => setDuration((d) => Math.max(5, d - 5))}
            >
              <Minus className="h-4 w-4 text-[var(--color-text)]" />
            </button>
            <span className="text-body font-semibold text-[var(--color-text)]">{duration} мин</span>
            <button
              className="press flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-card-2)]"
              onClick={() => setDuration((d) => d + 5)}
            >
              <Plus className="h-4 w-4 text-[var(--color-text)]" />
            </button>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-body-secondary text-[var(--color-text-secondary)]">Упражнения</span>
          </div>
          <button
            onClick={addExercise}
            className="press text-body-secondary flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dashed border-[var(--color-divider)] font-medium text-[var(--color-text-secondary)]"
          >
            <Plus className="h-4 w-4" /> Добавить упражнение
          </button>

          <div className="mt-3 flex flex-col gap-2">
            {exercises.map((ex, i) => (
              <div
                key={ex.id}
                className="flex items-center gap-3 rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 py-3"
              >
                <span className="text-body-secondary font-semibold text-[var(--color-text-secondary)]">{i + 1}.</span>
                <span className="text-body-secondary flex-1 text-[var(--color-text)]">{ex.name}</span>
                <span className="text-caption text-[var(--color-text-secondary)]">{ex.durationMin} мин</span>
                <button onClick={() => removeExercise(ex.id)} aria-label="Удалить">
                  <X className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button variant="primary" className="mt-2" onClick={() => navigate('/workouts/session')}>
          Начать тренировку
        </Button>
      </div>
    </div>
  )
}
