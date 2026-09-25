import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { StepProgress } from '@/components/ui/ProgressBar'
import { useAppState } from '@/context/AppStateContext'
import type { FitnessLevel, Gender } from '@/types'

const GOALS = ['Подготовка к бою', 'Похудение', 'Набор массы', 'Общая форма']
const LEVELS: FitnessLevel[] = ['Начинающий', 'Средний', 'Продвинутый']
const FREQUENCIES = ['1-2', '3-4', '5-6', '7+']

export function ProfileSetupPage() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAppState()
  const [form, setForm] = useState(profile)

  const setGender = (gender: Gender) => setForm((f) => ({ ...f, gender }))

  return (
    <div className="safe-top safe-bottom fixed inset-0 flex flex-col overflow-y-auto px-5 pt-4 pb-6">
      <StepProgress step={1} total={3} />

      <div className="mt-6">
        <h1 className="text-h2 text-[var(--color-text)]">Расскажите о себе</h1>
        <p className="text-body-secondary mt-1 text-[var(--color-text-secondary)]">
          Это поможет создать персональные рекомендации
        </p>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-4">
        <Input
          label="Возраст"
          type="number"
          value={form.age}
          onChange={(e) => setForm((f) => ({ ...f, age: Number(e.target.value) }))}
        />

        <div>
          <span className="text-body-secondary mb-2 block text-[var(--color-text-secondary)]">Пол</span>
          <div className="flex gap-2">
            <button
              onClick={() => setGender('male')}
              className={`press text-body-secondary h-11 flex-1 rounded-[var(--radius-button)] font-semibold ${
                form.gender === 'male'
                  ? 'gradient-accent text-white'
                  : 'border border-[var(--color-divider)] bg-[var(--color-card)] text-[var(--color-text-secondary)]'
              }`}
            >
              Мужской
            </button>
            <button
              onClick={() => setGender('female')}
              className={`press text-body-secondary h-11 flex-1 rounded-[var(--radius-button)] font-semibold ${
                form.gender === 'female'
                  ? 'gradient-accent text-white'
                  : 'border border-[var(--color-divider)] bg-[var(--color-card)] text-[var(--color-text-secondary)]'
              }`}
            >
              Женский
            </button>
          </div>
        </div>

        <Input
          label="Рост"
          type="number"
          suffix="см"
          value={form.heightCm}
          onChange={(e) => setForm((f) => ({ ...f, heightCm: Number(e.target.value) }))}
        />
        <Input
          label="Текущий вес"
          type="number"
          suffix="кг"
          value={form.weightKg}
          onChange={(e) => setForm((f) => ({ ...f, weightKg: Number(e.target.value) }))}
        />
        <Select
          label="Цель"
          options={GOALS}
          value={form.goal}
          onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))}
        />
        <Select
          label="Уровень подготовки"
          options={LEVELS}
          value={form.level}
          onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as FitnessLevel }))}
        />
        <Select
          label="Тренировок в неделю"
          options={FREQUENCIES}
          value={form.workoutsPerWeek}
          onChange={(e) => setForm((f) => ({ ...f, workoutsPerWeek: e.target.value }))}
        />
      </div>

      <Button
        variant="primary"
        className="mt-6"
        onClick={() => {
          setProfile(form)
          navigate('/home')
        }}
      >
        Продолжить
      </Button>
    </div>
  )
}
