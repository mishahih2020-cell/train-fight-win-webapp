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
import { useT } from '@/i18n/useT'
import { PROGRESS_STATS } from '@/data/mock'
import { weightRepo, workoutLogRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { computeWorkoutStreak } from '@/lib/streak'
import { primeAudio } from '@/lib/sound'
import { formatRelativeDate, formatShortDate, summarizeWeight } from '@/lib/weight'
import { formatClock } from '@/hooks/useCountdown'
import type { ProgressTab } from '@/types'

const ICONS = { chart: BarChart3, clock: Clock, trophy: Trophy, flame: Flame }
const PERIODS = ['week', 'month', 'quarter', 'year'] as const
const PERIOD_DAYS: Record<(typeof PERIODS)[number], number> = { week: 7, month: 30, quarter: 90, year: 365 }

export function ProgressPage() {
  const navigate = useNavigate()
  const { profile, goalWeightKg, language } = useAppState()
  const { t, tn } = useT()
  const [tab, setTab] = useState<ProgressTab>('weight')
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('month')
  const { items: weightEntries, reload: reloadWeight } = useRepoList(weightRepo)
  const { items: workoutLog } = useRepoList(workoutLogRepo)
  const [addWeightOpen, setAddWeightOpen] = useState(false)
  const [newWeight, setNewWeight] = useState('')

  const weight = useMemo(() => summarizeWeight(weightEntries, profile.goal, language), [weightEntries, profile.goal, language])

  // The period selector only scopes the chart — "current weight"/delta
  // above it always reflect the latest real entries regardless of period.
  const chartPoints = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - PERIOD_DAYS[period])
    const cutoffIso = cutoff.toISOString().slice(0, 10)
    return [...weightEntries]
      .filter((e) => e.date >= cutoffIso)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({ date: formatShortDate(e.date, language), value: e.value }))
  }, [weightEntries, period, language])

  const loggedWorkouts = useMemo(
    () => [...workoutLog].sort((a, b) => b.date.localeCompare(a.date)),
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
      <Header title={t('progress.title')} />

      <div className="mt-4 px-4">
        <Tabs options={['weight', 'workouts', 'stats']} value={tab} onChange={setTab} labelFor={(k) => t(`progress.tab.${k}`)} />
      </div>

      <div className="mt-5 px-4">
        {tab === 'weight' && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-caption text-[var(--color-text-secondary)]">{t('progress.currentWeight')}</div>
                <div className="text-h1 mt-1 text-[var(--color-text)]">{weight.current.toFixed(1)} {t('common.kg')}</div>
                <div className="text-caption mt-0.5 font-medium" style={{ color: weight.deltaColor }}>
                  {weight.deltaLabel}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconButton variant="card" onClick={() => setAddWeightOpen(true)} aria-label={t('progress.addWeight')}>
                  <Plus className="h-4 w-4" />
                </IconButton>
                <div className="w-28">
                  <Select
                    label=""
                    options={PERIODS.map((p) => ({ value: p, label: t(`progress.period.${p}`) }))}
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as (typeof PERIODS)[number])}
                  />
                </div>
              </div>
            </div>

            <Card className="mt-4 p-4">
              {chartPoints.length > 1 ? (
                <LineChart points={chartPoints} />
              ) : (
                <p className="text-body-secondary py-6 text-center text-[var(--color-text-secondary)]">{t('progress.needMorePoints')}</p>
              )}
            </Card>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Card>
                <div className="text-caption text-[var(--color-text-secondary)]">{t('progress.goal')}</div>
                <div className="text-h2 mt-1 text-[var(--color-text)]">
                  {goalWeightKg != null ? `${goalWeightKg.toFixed(1)} ${t('common.kg')}` : t('progress.noGoalSet')}
                </div>
                {goalWeightKg == null && <div className="text-caption mt-0.5 text-[var(--color-text-tertiary)]">{t('progress.setGoalHint')}</div>}
              </Card>
              <Card>
                <div className="text-caption text-[var(--color-text-secondary)]">{t('progress.remaining')}</div>
                <div className="text-h2 mt-1 text-[var(--color-accent)]">
                  {goalWeightKg != null ? `${Math.abs(weight.current - goalWeightKg).toFixed(1)} ${t('common.kg')}` : '—'}
                </div>
              </Card>
            </div>
          </>
        )}

        {tab === 'workouts' && (
          <div className="flex flex-col gap-3">
            {loggedWorkouts.length > 0 ? (
              loggedWorkouts.map((w) => (
                <WorkoutCard
                  key={w.id}
                  title={w.title}
                  meta={`${formatClock(w.durationSec)} · ${tn('workouts.rounds', w.exerciseCount)}`}
                  dateLabel={formatRelativeDate(w.date, language)}
                  onClick={() => {
                    primeAudio()
                    navigate('/workouts/session', { state: { workoutName: w.title, category: w.category } })
                  }}
                />
              ))
            ) : (
              <div className="text-body-secondary rounded-[var(--radius-card)] border border-dashed border-[var(--color-divider)] p-6 text-center text-[var(--color-text-secondary)]">
                {t('progress.noWorkoutsHistory')}
              </div>
            )}
          </div>
        )}

        {tab === 'stats' && (
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <div className="flex items-center justify-between">
                <span className="text-caption text-[var(--color-text-secondary)]">{t('progress.totalWorkouts')}</span>
                <BarChart3 className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              <div className="text-h2 mt-2 text-[var(--color-text)]">{workoutLog.length}</div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <span className="text-caption text-[var(--color-text-secondary)]">{t('progress.totalTime')}</span>
                <Clock className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              <div className="text-h2 mt-2 text-[var(--color-text)]">{monthDurationHours} {t('common.hours')}</div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <span className="text-caption text-[var(--color-text-secondary)]">{t('progress.streak')}</span>
                <Flame className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              <div className="text-h2 mt-2 text-[var(--color-text)]">{tn('home.streakDays', streak)}</div>
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
        <div className="text-h2 mb-4 text-[var(--color-text)]">{t('progress.addWeightTitle')}</div>
        <Input
          label={t('progress.weightToday')}
          type="number"
          inputMode="decimal"
          suffix={t('common.kg')}
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          autoFocus
        />
        <Button variant="primary" className="mt-5" disabled={!newWeight} onClick={saveWeight}>
          {t('common.save')}
        </Button>
      </Modal>
    </div>
  )
}
