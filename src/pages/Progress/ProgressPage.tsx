import { BarChart3, Clock, Flame, Plus, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LineChart } from '@/components/ui/Chart'
import { Header } from '@/components/navigation/Header'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Tabs } from '@/components/ui/Tabs'
import { WorkoutCard } from '@/components/cards/WorkoutCard'
import { useAppState } from '@/context/AppStateContext'
import { PROGRESS_STATS } from '@/data/mock'
import { weightRepo, workoutLogRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { pluralizeRu } from '@/lib/pluralize'
import { computeWorkoutStreak } from '@/lib/streak'
import { formatRelativeDate, summarizeWeight } from '@/lib/weight'
import type { ProgressTab, Workout } from '@/types'

const ICONS = { chart: BarChart3, clock: Clock, trophy: Trophy, flame: Flame }
const GOAL_WEIGHT = 67.0

export function ProgressPage() {
  const navigate = useNavigate()
  const { profile } = useAppState()
  const [tab, setTab] = useState<ProgressTab>('Вес')
  const { items: weightEntries, reload: reloadWeight } = useRepoList(weightRepo)
  const { items: workoutLog } = useRepoList(workoutLogRepo)
  const [addWeightOpen, setAddWeightOpen] = useState(false)
  const [newWeight, setNewWeight] = useState('')

  const weight = useMemo(() => summarizeWeight(weightEntries, profile.goal), [weightEntries, profile.goal])

  const loggedWorkouts: Workout[] = useMemo(
    () =>
      [...workoutLog]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((log) => ({
          id: log.id,
          title: log.title,
          category: log.category as Workout['category'],
          durationMin: Math.round(log.durationSec / 60),
          exerciseCount: log.exerciseCount,
          dateLabel: formatRelativeDate(log.date),
          exercises: [],
        })),
    [workoutLog],
  )

  const monthDurationHours = useMemo(() => {
    const totalSec = workoutLog.reduce((sum, w) => sum + w.durationSec, 0)
    return Math.round((totalSec / 3600) * 10) / 10
  }, [workoutLog])

  const streak = useMemo(() => computeWorkoutStreak(workoutLog.map((w) => w.date)), [workoutLog])

  const saveWeight = async () => {
    const value = Number(newWeight.replace(',', '.'))
    if (!value || value <= 0) return
    await weightRepo.add({ id: `w${Date.now()}`, date: new Date().toISOString().slice(0, 10), value })
    setNewWeight('')
    setAddWeightOpen(false)
    reloadWeight()
  }

  return (
    <div className="pb-8">
      <Header title="Прогресс" />

      <div className="mt-4 px-4">
        <Tabs options={['Вес', 'Тренировки', 'Статистика']} value={tab} onChange={setTab} />
      </div>

      <div className="mt-5 px-4">
        {tab === 'Вес' && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-caption text-[var(--color-text-secondary)]">Текущий вес</div>
                <div className="text-h1 mt-1 text-[var(--color-text)]">{weight.current.toFixed(1)} кг</div>
                <div className="text-caption mt-0.5 font-medium" style={{ color: weight.deltaColor }}>
                  {weight.deltaLabel}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconButton variant="card" onClick={() => setAddWeightOpen(true)} aria-label="Добавить вес">
                  <Plus className="h-4 w-4" />
                </IconButton>
                <div className="w-28">
                  <Select label="" options={['1 неделя', '1 месяц', '3 месяца', 'Год']} defaultValue="1 месяц" />
                </div>
              </div>
            </div>

            <Card className="mt-4 p-4">
              {weight.points.length > 1 ? (
                <LineChart points={weight.points} />
              ) : (
                <p className="text-body-secondary py-6 text-center text-[var(--color-text-secondary)]">
                  Добавьте ещё одно измерение веса, чтобы увидеть график
                </p>
              )}
            </Card>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Card>
                <div className="text-caption text-[var(--color-text-secondary)]">Цель</div>
                <div className="text-h2 mt-1 text-[var(--color-text)]">{GOAL_WEIGHT.toFixed(1)} кг</div>
              </Card>
              <Card>
                <div className="text-caption text-[var(--color-text-secondary)]">Осталось</div>
                <div className="text-h2 mt-1 text-[var(--color-accent)]">
                  {Math.max(0, weight.current - GOAL_WEIGHT).toFixed(1)} кг
                </div>
              </Card>
            </div>
          </>
        )}

        {tab === 'Тренировки' && (
          <div className="flex flex-col gap-3">
            {loggedWorkouts.length > 0 ? (
              loggedWorkouts.map((w) => (
                <WorkoutCard
                  key={w.id}
                  workout={w}
                  onClick={() => navigate('/workouts/session', { state: { workoutName: w.title, category: w.category } })}
                />
              ))
            ) : (
              <div className="text-body-secondary rounded-[var(--radius-card)] border border-dashed border-[var(--color-divider)] p-6 text-center text-[var(--color-text-secondary)]">
                Завершённые тренировки появятся здесь
              </div>
            )}
          </div>
        )}

        {tab === 'Статистика' && (
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <div className="flex items-center justify-between">
                <span className="text-caption text-[var(--color-text-secondary)]">Тренировок всего</span>
                <BarChart3 className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              <div className="text-h2 mt-2 text-[var(--color-text)]">{workoutLog.length}</div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <span className="text-caption text-[var(--color-text-secondary)]">Время всего</span>
                <Clock className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              <div className="text-h2 mt-2 text-[var(--color-text)]">{monthDurationHours} ч</div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <span className="text-caption text-[var(--color-text-secondary)]">Серия</span>
                <Flame className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              <div className="text-h2 mt-2 text-[var(--color-text)]">
                {streak} {pluralizeRu(streak, 'день', 'дня', 'дней')}
              </div>
            </Card>
            {PROGRESS_STATS.filter((s) => s.icon === 'trophy').map((stat) => {
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
        )}
      </div>

      <Modal open={addWeightOpen} onClose={() => setAddWeightOpen(false)}>
        <div className="text-h2 mb-4 text-[var(--color-text)]">Новое измерение</div>
        <Input
          label="Вес сегодня"
          type="number"
          inputMode="decimal"
          suffix="кг"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          autoFocus
        />
        <Button variant="primary" className="mt-5" disabled={!newWeight} onClick={saveWeight}>
          Сохранить
        </Button>
      </Modal>
    </div>
  )
}
