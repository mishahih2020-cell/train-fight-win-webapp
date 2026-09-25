import { Camera } from 'lucide-react'
import { useRef, useState } from 'react'
import { CalorieRing, LineChart } from '@/components/ui/Chart'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { FoodCard } from '@/components/cards/FoodCard'
import { CALORIES, MACROS, MEALS, WEEKLY_CALORIES } from '@/data/mock'
import type { Meal } from '@/types'

const MOCK_DISH_NAMES = ['Творог с ягодами', 'Гречка с курицей', 'Салат с тунцом', 'Протеиновый смузи', 'Индейка с овощами']

export function NutritionPage() {
  const [tab, setTab] = useState<'Сегодня' | 'Аналитика'>('Сегодня')
  const [meals, setMeals] = useState<Meal[]>(MEALS)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addMealFromPhoto = () => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const dish = MOCK_DISH_NAMES[Math.floor(Math.random() * MOCK_DISH_NAMES.length)]
    const kcal = 350 + Math.floor(Math.random() * 300)
    setMeals((list) => [...list, { id: `photo-${Date.now()}`, name: 'Перекус', title: dish, time, kcal }])
  }

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">Питание</h1>

      <div className="mt-4">
        <Tabs options={['Сегодня', 'Аналитика']} value={tab} onChange={setTab} />
      </div>

      {tab === 'Сегодня' ? (
        <>
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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addMealFromPhoto()
              e.target.value = ''
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="press text-body-secondary mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] font-semibold text-[var(--color-text)]"
          >
            <Camera className="h-5 w-5 text-[var(--color-accent)]" />
            Сфотографировать еду
          </button>

          <div className="mt-5 flex flex-col gap-2.5">
            {meals.map((meal, i) => (
              <FoodCard key={meal.id} meal={meal} onAdd={i === meals.length - 1 ? () => fileInputRef.current?.click() : undefined} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <Card className="p-4">
            <div className="text-caption mb-2 text-[var(--color-text-secondary)]">Калории за неделю</div>
            <LineChart points={WEEKLY_CALORIES} />
          </Card>
          <div className="grid grid-cols-3 gap-3">
            {MACROS.map((m) => (
              <Card key={m.id}>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-caption text-[var(--color-text-secondary)]">{m.label}</span>
                </div>
                <div className="text-h2 mt-2 text-[var(--color-text)]">
                  {Math.round((m.value / m.total) * 100)}%
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}
