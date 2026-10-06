import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, type SelectOption } from '@/components/ui/Select'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { weightRepo } from '@/db/repos'
import type { FitnessLevel, Gender, Goal } from '@/types'

const GOAL_KEYS: Goal[] = ['fight', 'loseWeight', 'gainMass', 'generalFitness']
const LEVEL_KEYS: FitnessLevel[] = ['beginner', 'intermediate', 'advanced']
const FREQUENCIES = ['1-2', '3-4', '5-6', '7+']

export function ProfileSetupPage() {
  const navigate = useNavigate()
  const { profile, setProfile, completeOnboarding } = useAppState()
  const { t } = useT()
  const [form, setForm] = useState(profile)

  const goalOptions: SelectOption[] = GOAL_KEYS.map((key) => ({ value: key, label: t(`goal.${key}`) }))
  const levelOptions: SelectOption[] = LEVEL_KEYS.map((key) => ({ value: key, label: t(`level.${key}`) }))

  const setGender = (gender: Gender) => setForm((f) => ({ ...f, gender }))
  const canSubmit = form.age > 0 && form.heightCm > 0 && form.weightKg > 0

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
        <h1 className="text-h1 text-[var(--color-text)]">{t('profileSetup.title')}</h1>
        <p className="text-body-secondary mt-1 text-[var(--color-text-secondary)]">{t('profileSetup.subtitle')}</p>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-4">
        <Input
          label={t('profileSetup.age')}
          type="number"
          min={10}
          max={100}
          value={form.age || ''}
          onChange={(e) => setForm((f) => ({ ...f, age: Number(e.target.value) }))}
        />

        <div>
          <span className="text-body-secondary mb-2 block text-[var(--color-text-secondary)]">{t('profileSetup.gender')}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setGender('male')}
              className={`press text-body-secondary h-11 flex-1 rounded-[var(--radius-button)] font-semibold ${
                form.gender === 'male'
                  ? 'gradient-accent text-white'
                  : 'border border-[var(--color-divider)] bg-[var(--color-card)] text-[var(--color-text-secondary)]'
              }`}
            >
              {t('profileSetup.male')}
            </button>
            <button
              onClick={() => setGender('female')}
              className={`press text-body-secondary h-11 flex-1 rounded-[var(--radius-button)] font-semibold ${
                form.gender === 'female'
                  ? 'gradient-accent text-white'
                  : 'border border-[var(--color-divider)] bg-[var(--color-card)] text-[var(--color-text-secondary)]'
              }`}
            >
              {t('profileSetup.female')}
            </button>
          </div>
        </div>

        <Input
          label={t('profileSetup.height')}
          type="number"
          suffix={t('common.cm')}
          min={100}
          max={250}
          value={form.heightCm || ''}
          onChange={(e) => setForm((f) => ({ ...f, heightCm: Number(e.target.value) }))}
        />
        <Input
          label={t('profileSetup.weight')}
          type="number"
          suffix={t('common.kg')}
          min={20}
          max={300}
          value={form.weightKg || ''}
          onChange={(e) => setForm((f) => ({ ...f, weightKg: Number(e.target.value) }))}
        />
        <Select
          label={t('profileSetup.goal')}
          options={goalOptions}
          value={form.goal}
          onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value as Goal }))}
        />
        <Select
          label={t('profileSetup.level')}
          options={levelOptions}
          value={form.level}
          onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as FitnessLevel }))}
        />
        <Select
          label={t('profileSetup.workoutsPerWeek')}
          options={FREQUENCIES}
          value={form.workoutsPerWeek}
          onChange={(e) => setForm((f) => ({ ...f, workoutsPerWeek: e.target.value }))}
        />
      </div>

      <Button variant="primary" size="large" className="mt-6" disabled={!canSubmit} onClick={submit}>
        {t('profileSetup.continue')}
      </Button>
    </div>
  )
}
