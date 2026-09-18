import { Dumbbell, Shield, StretchHorizontal, Swords, Trash2, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { INTENSITY_TONE } from '@/data/workoutTypes'
import { formatDiaryDate } from '@/lib/selectors'
import type { WorkoutEntry, WorkoutType } from '@/types'

const typeIcon: Record<WorkoutType, typeof Swords> = {
  'Муай-тай': Swords,
  Кикбоксинг: Zap,
  ОФП: Dumbbell,
  Спарринг: Shield,
  Растяжка: StretchHorizontal,
}

export function WorkoutLogItem({ entry, onDelete }: { entry: WorkoutEntry; onDelete: () => void }) {
  const Icon = typeIcon[entry.type]

  return (
    <div className="flex items-start gap-3 rounded-md surface p-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-lime/10 text-lime">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[14px] font-bold text-white">{entry.type}</p>
          <span className="shrink-0 text-[11px] font-semibold text-muted-2">{formatDiaryDate(entry.date)}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[12px] text-muted">{entry.durationMin} мин</span>
          <Badge tone={INTENSITY_TONE[entry.intensity]}>{entry.intensity}</Badge>
          <span className="text-[11px] font-bold text-lime">+{entry.xp} XP</span>
        </div>
        {entry.note && <p className="mt-1.5 text-[12px] leading-snug text-muted">{entry.note}</p>}
      </div>
      <button
        onClick={onDelete}
        aria-label="Удалить запись"
        className="press shrink-0 rounded-pill p-1.5 text-muted-2 hover:text-red"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
