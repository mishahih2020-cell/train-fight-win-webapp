import { Check, Play } from 'lucide-react'
import { AthletePhoto } from '@/components/ui/AthletePhoto'
import { Button } from '@/components/ui/Button'
import { directionLabels, levelLabels } from '@/data/lessons'
import type { Lesson } from '@/types'

export function LessonCard({
  lesson,
  viewed,
  onOpen,
}: {
  lesson: Lesson
  viewed: boolean
  onOpen: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-graphite p-2.5">
      <AthletePhoto focal="top" fade="none" className="h-16 w-16 shrink-0 rounded-sm">
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <Play size={18} className="text-white" fill="white" />
        </div>
      </AthletePhoto>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-lime">Урок {lesson.number}</p>
        <h3 className="truncate text-[14px] font-bold leading-snug text-white">{lesson.title}</h3>
        <p className="mt-0.5 truncate text-[12px] text-muted">
          {directionLabels[lesson.direction]} · {levelLabels[lesson.level]} · {lesson.durationMin} мин
        </p>
      </div>

      {viewed ? (
        <div className="flex shrink-0 items-center gap-1.5 rounded-pill bg-lime/12 px-3 py-2 text-[11px] font-bold text-lime">
          <Check size={14} />
          Просмотрено
        </div>
      ) : (
        <Button size="sm" fullWidth={false} onClick={onOpen} className="shrink-0 px-4">
          Смотреть
        </Button>
      )}
    </div>
  )
}
