import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StreakCard } from '@/components/diary/StreakCard'
import { WeightWidget } from '@/components/diary/WeightWidget'
import { WorkoutLogItem } from '@/components/diary/WorkoutLogItem'
import { LogWorkoutModal } from '@/components/diary/LogWorkoutModal'
import { LogWeightModal } from '@/components/diary/LogWeightModal'
import { getTodayTip } from '@/data/dailyTips'
import { getLastNDaysActivity, getTrainingStreak, getWeekWorkoutStats } from '@/lib/selectors'
import { useAppState } from '@/context/AppStateContext'
import { useToast } from '@/context/ToastContext'

export function DiaryPage() {
  const navigate = useNavigate()
  const { state, logWorkout, deleteWorkout, logWeight } = useAppState()
  const { showToast } = useToast()
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false)
  const [weightModalOpen, setWeightModalOpen] = useState(false)

  const streak = useMemo(() => getTrainingStreak(state.workoutLog), [state.workoutLog])
  const last7 = useMemo(() => getLastNDaysActivity(state.workoutLog, 7), [state.workoutLog])
  const weekStats = useMemo(() => getWeekWorkoutStats(state.workoutLog), [state.workoutLog])
  const tip = useMemo(() => getTodayTip(), [])
  const latestWeight = [...state.weightLog].sort((a, b) => b.date.localeCompare(a.date))[0]

  return (
    <div className="pb-28">
      <div className="px-5 pt-[max(16px,env(safe-area-inset-top))]">
        <h1 className="text-[24px] font-extrabold uppercase tracking-tight">Дневник</h1>
        <p className="mt-1 text-[13px] text-muted">Отслеживай тренировки, вес и свой прогресс день за днём.</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 px-5">
        <div className="flex items-start gap-3 rounded-md border border-border bg-graphite p-3.5">
          <Lightbulb size={18} className="mt-0.5 shrink-0 text-lime" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Совет дня</p>
            <p className="mt-1 text-[13px] leading-snug text-white">{tip}</p>
          </div>
        </div>

        <StreakCard streak={streak} last7Days={last7} />

        <Button icon={<Plus size={18} />} onClick={() => setWorkoutModalOpen(true)}>
          Записать тренировку
        </Button>

        <WeightWidget
          entries={state.weightLog}
          onOpen={() => navigate('/diary/weight')}
          onAdd={() => setWeightModalOpen(true)}
        />

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md border border-border bg-graphite py-3 text-center">
            <p className="text-[20px] font-extrabold text-white">{weekStats.count}</p>
            <p className="text-[11px] text-muted">тренировок</p>
          </div>
          <div className="rounded-md border border-border bg-graphite py-3 text-center">
            <p className="text-[20px] font-extrabold text-white">{weekStats.minutes}</p>
            <p className="text-[11px] text-muted">минут</p>
          </div>
          <div className="rounded-md border border-border bg-graphite py-3 text-center">
            <p className="text-[20px] font-extrabold text-white">{streak}</p>
            <p className="text-[11px] text-muted">дней подряд</p>
          </div>
        </div>

        <div className="mt-2">
          <p className="mb-2.5 text-[15px] font-extrabold text-white">История тренировок</p>
          {state.workoutLog.length === 0 ? (
            <p className="rounded-md border border-border bg-graphite px-4 py-6 text-center text-[13px] text-muted">
              Пока нет записей. Запиши первую тренировку — это +{'30'} XP.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {state.workoutLog.map((entry) => (
                <WorkoutLogItem
                  key={entry.id}
                  entry={entry}
                  onDelete={() => {
                    deleteWorkout(entry.id)
                    showToast('Запись удалена')
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <LogWorkoutModal
        open={workoutModalOpen}
        onClose={() => setWorkoutModalOpen(false)}
        onSubmit={(workout) => {
          logWorkout(workout)
          setWorkoutModalOpen(false)
          showToast(`Тренировка записана +30 XP`)
        }}
      />
      <LogWeightModal
        open={weightModalOpen}
        onClose={() => setWeightModalOpen(false)}
        currentValue={latestWeight?.value}
        onSubmit={(value) => {
          logWeight(value)
          setWeightModalOpen(false)
          showToast('Вес записан +10 XP')
        }}
      />
    </div>
  )
}
