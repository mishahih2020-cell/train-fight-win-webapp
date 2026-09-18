import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { FilterChip } from '@/components/ui/FilterChip'
import { INTENSITY_LEVELS, WORKOUT_TYPES } from '@/data/workoutTypes'
import type { Intensity, WorkoutType } from '@/types'

export function LogWorkoutModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (workout: { type: WorkoutType; durationMin: number; intensity: Intensity; note?: string }) => void
}) {
  const [type, setType] = useState<WorkoutType>('Муай-тай')
  const [duration, setDuration] = useState(45)
  const [intensity, setIntensity] = useState<Intensity>('Средне')
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    onSubmit({ type, durationMin: duration, intensity, note: note.trim() || undefined })
    setNote('')
    setDuration(45)
    setIntensity('Средне')
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-[19px] font-extrabold uppercase tracking-tight">Записать тренировку</h2>

      <p className="mt-5 text-[12px] font-bold uppercase tracking-wide text-muted">Тип тренировки</p>
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
        {WORKOUT_TYPES.map((t) => (
          <FilterChip key={t} label={t} active={type === t} onClick={() => setType(t)} />
        ))}
      </div>

      <p className="mt-5 text-[12px] font-bold uppercase tracking-wide text-muted">Длительность</p>
      <div className="mt-2 flex items-center justify-between rounded-md surface px-3 py-2.5">
        <button
          onClick={() => setDuration((d) => Math.max(10, d - 5))}
          aria-label="Меньше"
          className="press flex h-9 w-9 items-center justify-center rounded-pill bg-white/8 text-white"
        >
          <Minus size={16} />
        </button>
        <span className="text-[18px] font-extrabold text-white">{duration} мин</span>
        <button
          onClick={() => setDuration((d) => Math.min(180, d + 5))}
          aria-label="Больше"
          className="press flex h-9 w-9 items-center justify-center rounded-pill bg-white/8 text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      <p className="mt-5 text-[12px] font-bold uppercase tracking-wide text-muted">Интенсивность</p>
      <div className="mt-2 flex gap-2">
        {INTENSITY_LEVELS.map((level) => (
          <FilterChip key={level} label={level} active={intensity === level} onClick={() => setIntensity(level)} />
        ))}
      </div>

      <p className="mt-5 text-[12px] font-bold uppercase tracking-wide text-muted">Заметка (необязательно)</p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Что делал на тренировке..."
        rows={2}
        className="mt-2 w-full resize-none rounded-md surface px-3.5 py-3 text-[14px] text-white outline-none placeholder:text-muted-2"
      />

      <Button className="mt-6" onClick={handleSubmit}>
        Сохранить тренировку
      </Button>
    </Modal>
  )
}
