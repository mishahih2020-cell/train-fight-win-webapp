import { Activity, Dumbbell, Flame, MoreHorizontal, Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Header } from '@/components/navigation/Header'
import { CREATE_WORKOUT_TYPES } from '@/data/mock'
import { workoutsRepo } from '@/db/repos'
import { DEFAULT_REST_SEC, DEFAULT_ROUNDS, DEFAULT_ROUND_SEC } from '@/lib/session'
import { haptic } from '@/lib/haptics'

const TYPE_ICONS = { fight: Flame, strength: Dumbbell, run: Activity, other: MoreHorizontal }
const TYPE_CATEGORY: Record<string, string> = { fight: 'Бойцовские', strength: 'Силовые', run: 'Бег', other: 'Другое' }

const DEFAULT_ROUND_EXERCISES = [
  { id: 're1', name: 'Джеб-кросс' },
  { id: 're2', name: 'Апперкоты' },
  { id: 're3', name: 'Работа ног' },
]

function formatMMSS(totalSec: number) {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function Stepper({
  label,
  display,
  onDec,
  onInc,
}: {
  label: string
  display: string
  onDec: () => void
  onInc: () => void
}) {
  return (
    <div>
      <span className="text-caption mb-1.5 block text-[var(--color-text-secondary)]">{label}</span>
      <div className="flex h-11 items-center justify-between rounded-[var(--radius-button)] bg-[var(--color-card-2)] px-3">
        <button
          className="press flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-divider)]"
          onClick={onDec}
          aria-label={`Уменьшить: ${label}`}
        >
          <Minus className="h-3.5 w-3.5 text-[var(--color-text)]" />
        </button>
        <span className="text-body-secondary font-semibold text-[var(--color-text)]">{display}</span>
        <button
          className="press flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-divider)]"
          onClick={onInc}
          aria-label={`Увеличить: ${label}`}
        >
          <Plus className="h-3.5 w-3.5 text-[var(--color-text)]" />
        </button>
      </div>
    </div>
  )
}

export function CreateWorkoutPage() {
  const navigate = useNavigate()
  const [type, setType] = useState('fight')
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
      category: TYPE_CATEGORY[type],
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
      <Header title="Новая тренировка" />

      <div className="mt-4 flex flex-col gap-5 px-4">
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

        <Card>
          <span className="text-body-secondary mb-3 block font-semibold text-[var(--color-text)]">Раунды</span>
          <div className="grid grid-cols-3 gap-2">
            <Stepper
              label="Раундов"
              display={String(rounds)}
              onDec={() => setRounds((r) => Math.max(1, r - 1))}
              onInc={() => setRounds((r) => Math.min(15, r + 1))}
            />
            <Stepper
              label="Раунд"
              display={formatMMSS(roundSec)}
              onDec={() => setRoundSec((s) => Math.max(30, s - 15))}
              onInc={() => setRoundSec((s) => Math.min(300, s + 15))}
            />
            <Stepper
              label="Отдых"
              display={formatMMSS(restSec)}
              onDec={() => setRestSec((s) => Math.max(15, s - 15))}
              onInc={() => setRestSec((s) => Math.min(180, s + 15))}
            />
          </div>
        </Card>

        <div>
          <span className="text-body-secondary mb-1 block text-[var(--color-text-secondary)]">Упражнения по раундам</span>
          <p className="text-caption mb-3 text-[var(--color-text-tertiary)]">
            Необязательно — подпись к раунду, по кругу
          </p>

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
                  placeholder="Название упражнения"
                  className="text-body-secondary h-11 flex-1 bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)]"
                />
                <button onClick={() => removeExercise(ex.id)} aria-label="Удалить">
                  <X className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addExercise}
            className="press text-body-secondary mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dashed border-[var(--color-divider)] font-medium text-[var(--color-text-secondary)]"
          >
            <Plus className="h-4 w-4" /> Добавить упражнение
          </button>
        </div>

        <Button variant="primary" className="mt-2" disabled={!name.trim()} onClick={saveWorkout}>
          Сохранить тренировку
        </Button>
      </div>
    </div>
  )
}
