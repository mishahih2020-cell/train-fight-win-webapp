import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAppState } from '@/context/AppStateContext'
import { weightRepo } from '@/db/repos'
import type { FitnessLevel, Gender } from '@/types'

const GOALS = ['Подготовка к бою', 'Похудение', 'Набор массы', 'Общая форма']
const LEVELS: FitnessLevel[] = ['Начинающий', 'Средний', 'Продвинутый']
const FREQUENCIES = ['1-2', '3-4', '5-6', '7+']

export function ProfileSetupPage() {
  const navigate = useNavigate()
  const { profile, setProfile, completeOnboarding } = useAppState()
  const [form, setForm] = useState(profile)

  const setGender = (gender: Gender) => setForm((f) => ({ ...f, gender }))

  const submit = async () => {
    setProfile(form)

    // Keep the real weight log in sync with what was just typed here —
    // upsert today's entry instead of appending, so revisiting this screen
    // later doesn't leave duplicate same-day points on the weight chart.
    const today = new Date().toISOString().slice(0, 10)
    const entries = await weightRepo.list()
    const todayEntry = entries.find((e) => e.date === today)
    if (todayEntry) {
      await weightRepo.update(todayEntry.id, { value: form.weightKg })
    } else {
      await weightRepo.add({ id: `w${Date.now()}`, date: today, value: form.weightKg })
    }

    completeOnboarding()
    navigate('/home')
  }

  return (
    <div className="safe-top safe-bottom overscroll-none fixed inset-0 flex flex-col overflow-y-auto px-5 pt-4 pb-6">
      <div className="mt-2">
        <h1 className="text-h1 text-[var(--color-text)]">Расскажите о себе</h1>
        <p className="text-body-secondary mt-1 text-[var(--color-text-secondary)]">
          Это поможет создать персональные рекомендации
        </p>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-4">
        <Input
          label="Возраст"
          type="number"
          min={10}
          max={100}
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
          min={100}
          max={250}
          value={form.heightCm}
          onChange={(e) => setForm((f) => ({ ...f, heightCm: Number(e.target.value) }))}
        />
        <Input
          label="Текущий вес"
          type="number"
          suffix="кг"
          min={20}
          max={300}
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

      <Button variant="primary" size="large" className="mt-6" onClick={submit}>
        Продолжить
      </Button>
    </div>
  )
}
