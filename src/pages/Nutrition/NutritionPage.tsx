import { Camera } from 'lucide-react'
import { useState } from 'react'
import { CalorieRing } from '@/components/ui/Chart'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { FoodCard } from '@/components/cards/FoodCard'
import { CALORIES, MACROS, MEALS } from '@/data/mock'

export function NutritionPage() {
  const [tab, setTab] = useState<'Сегодня' | 'Аналитика'>('Сегодня')

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">Питание</h1>

      <div className="mt-4">
        <Tabs options={['Сегодня', 'Аналитика']} value={tab} onChange={setTab} />
      </div>

      <Card className="mt-4 flex items-center gap-4">
        <CalorieRing current={CALORIES.current} total={CALORIES.total} />
        <div className="flex flex-1 flex-col gap-2.5">
          {MACROS.map((m) => (
            <div key={m.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="text-caption text-[var(--color-text-secondary)]">{m.label}</span>
              </div>
              <span className="text-body-secondary font-semibold text-[var(--color-text)]">
                {m.value} / {m.total} {m.unit}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <button className="press text-body-secondary mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] font-semibold text-[var(--color-text)]">
        <Camera className="h-5 w-5 text-[var(--color-accent)]" />
        Сфотографировать еду
      </button>

      <div className="mt-5 flex flex-col gap-2.5">
        {MEALS.map((meal, i) => (
          <FoodCard key={meal.id} meal={meal} showAdd={i === MEALS.length - 1} />
        ))}
      </div>

      <div className="h-4" />
    </div>
  )
}
