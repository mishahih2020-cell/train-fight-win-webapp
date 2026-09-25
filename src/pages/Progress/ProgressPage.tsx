import { BarChart3, Clock, Flame, Trophy } from 'lucide-react'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { LineChart } from '@/components/ui/Chart'
import { Header } from '@/components/navigation/Header'
import { Select } from '@/components/ui/Select'
import { Tabs } from '@/components/ui/Tabs'
import { PROGRESS_STATS, WEIGHT_HISTORY, WEIGHT_TODAY } from '@/data/mock'
import type { ProgressTab } from '@/types'

const ICONS = { chart: BarChart3, clock: Clock, trophy: Trophy, flame: Flame }
const GOAL_WEIGHT = 67.0

export function ProgressPage() {
  const [tab, setTab] = useState<ProgressTab>('Вес')

  return (
    <div className="pb-8">
      <Header title="Прогресс" />

      <div className="mt-4 px-4">
        <Tabs options={['Вес', 'Тренировки', 'Статистика']} value={tab} onChange={setTab} />
      </div>

      <div className="mt-5 px-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-caption text-[var(--color-text-secondary)]">Текущий вес</div>
            <div className="text-h1 mt-1 text-[var(--color-text)]">{WEIGHT_TODAY.value.toFixed(1)} кг</div>
          </div>
          <div className="w-32">
            <Select label="" options={['1 неделя', '1 месяц', '3 месяца', 'Год']} defaultValue="1 месяц" />
          </div>
        </div>

        <Card className="mt-4 p-4">
          <LineChart points={WEIGHT_HISTORY} />
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Card>
            <div className="text-caption text-[var(--color-text-secondary)]">Цель</div>
            <div className="text-h2 mt-1 text-[var(--color-text)]">{GOAL_WEIGHT.toFixed(1)} кг</div>
          </Card>
          <Card>
            <div className="text-caption text-[var(--color-text-secondary)]">Осталось</div>
            <div className="text-h2 mt-1 text-[var(--color-accent)]">
              {(WEIGHT_TODAY.value - GOAL_WEIGHT).toFixed(1)} кг
            </div>
          </Card>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {PROGRESS_STATS.map((stat) => {
            const Icon = ICONS[stat.icon]
            return (
              <Card key={stat.id}>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-[var(--color-text-secondary)]">{stat.label}</span>
                  <Icon className="h-4 w-4 text-[var(--color-accent)]" />
                </div>
                <div className="text-h2 mt-2 text-[var(--color-text)]">{stat.value}</div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
