import { Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { Sparkline } from '@/components/ui/Chart'
import { LAST_WORKOUT, STREAK_DAYS, TODAY_WORKOUT, USER, WEEK_DAYS, WEIGHT_HISTORY, WEIGHT_TODAY } from '@/data/mock'

export function HomePage() {
  const navigate = useNavigate()
  const selectedDay = WEEK_DAYS[1]

  return (
    <div className="safe-top px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-[var(--color-text)]">{USER.firstName}!</h1>
        <Avatar size={44} />
      </div>

      <div className="mt-5 flex justify-between">
        {WEEK_DAYS.map((day) => {
          const active = day.dayNumber === selectedDay.dayNumber
          return (
            <div key={day.dayNumber} className="flex flex-col items-center gap-1.5">
              <span className="text-caption text-[var(--color-text-tertiary)]">{day.weekday}</span>
              <div
                className={`text-body-secondary flex h-9 w-9 items-center justify-center rounded-full font-semibold ${
                  active ? 'gradient-accent text-white' : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {day.dayNumber}
              </div>
            </div>
          )
        })}
      </div>

      <Card className="mt-5 flex flex-col gap-4">
        <div>
          <div className="text-caption text-[var(--color-text-secondary)]">{TODAY_WORKOUT.label}</div>
          <div className="text-h2 mt-1 text-[var(--color-text)]">{TODAY_WORKOUT.title}</div>
        </div>
        <Button variant="primary" onClick={() => navigate('/workouts/session')}>
          Начать тренировку
        </Button>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card onClick={() => navigate('/progress')} className="cursor-pointer">
          <div className="text-caption text-[var(--color-text-secondary)]">Вес</div>
          <div className="mt-1 flex items-end justify-between">
            <div>
              <div className="text-h2 text-[var(--color-text)]">{WEIGHT_TODAY.value.toFixed(1)} кг</div>
              <div className="text-caption mt-0.5 font-medium text-[var(--color-success)]">{WEIGHT_TODAY.deltaLabel}</div>
            </div>
            <Sparkline points={WEIGHT_HISTORY} />
          </div>
        </Card>
        <Card>
          <div className="text-caption text-[var(--color-text-secondary)]">Серия</div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-h2 text-[var(--color-text)]">{STREAK_DAYS} дней</div>
            <Flame className="h-6 w-6 text-[var(--color-warning)]" fill="var(--color-warning)" strokeWidth={0} />
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <div className="text-caption mb-2 text-[var(--color-text-secondary)]">Последняя тренировка</div>
        <Card className="flex items-center gap-3">
          <PlaceholderImage className="h-12 w-12 shrink-0" rounded="rounded-[var(--radius-element)]" compact />
          <div>
            <div className="text-body-secondary font-semibold text-[var(--color-text)]">{LAST_WORKOUT.label}</div>
            <div className="text-caption text-[var(--color-text-secondary)]">{LAST_WORKOUT.exercises}</div>
          </div>
        </Card>
      </div>

      <div className="h-4" />
    </div>
  )
}
