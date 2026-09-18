import { useMemo, useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { FilterChip } from '@/components/ui/FilterChip'
import { AchievementCard } from '@/components/achievements/AchievementCard'
import { getAchievementProgress } from '@/lib/selectors'
import { useAppState } from '@/context/AppStateContext'

type FilterId = 'all' | 'courses' | 'progress'

const filters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'courses', label: 'Курсы' },
  { id: 'progress', label: 'Прогресс' },
]

export function AchievementsPage() {
  const { state, level } = useAppState()
  const [filter, setFilter] = useState<FilterId>('all')

  const all = useMemo(() => getAchievementProgress(state, level), [state, level])
  const items = useMemo(() => (filter === 'all' ? all : all.filter((a) => a.category === filter)), [all, filter])
  const unlockedCount = all.filter((a) => a.unlocked).length

  return (
    <div className="pb-10">
      <Header title="Достижения" />

      <div className="px-5 pt-2">
        <div className="flex items-center justify-between rounded-md surface px-4 py-3.5">
          <p className="text-[13px] font-semibold text-muted">Открыто достижений</p>
          <p className="text-[16px] font-extrabold text-white">
            {unlockedCount} <span className="text-muted">/ {all.length}</span>
          </p>
        </div>
      </div>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5">
        {filters.map((f) => (
          <FilterChip key={f.id} label={f.label} active={filter === f.id} onClick={() => setFilter(f.id)} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 px-5">
        {items.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            progress={achievement.progress}
            unlocked={achievement.unlocked}
          />
        ))}
      </div>
    </div>
  )
}
