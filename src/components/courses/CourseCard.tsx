import { ChevronRight, Swords } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AthletePhoto } from '@/components/ui/AthletePhoto'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { directionLabels, levelLabels } from '@/data/lessons'
import { formatPrice } from '@/lib/selectors'
import type { Course } from '@/types'

export function CourseCard({ course, owned }: { course: Course; owned: boolean }) {
  const navigate = useNavigate()
  const open = () => navigate(`/courses/${course.id}`)

  return (
    <div className="overflow-hidden rounded-lg surface">
      <button onClick={open} className="press block w-full text-left">
        <AthletePhoto focal="top" fade="bottom" icon={Swords} iconSize={84} className="h-40 w-full">
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <Badge tone="muted">{directionLabels[course.direction]}</Badge>
            {course.isHit && <Badge tone="lime">Хит</Badge>}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <h3 className="text-[16px] font-extrabold uppercase leading-tight text-white">{course.shortTitle}</h3>
            <p className="mt-1 text-[12px] text-muted">
              {levelLabels[course.level]} · {course.lessonCount} уроков · {course.weeks} нед.
            </p>
          </div>
        </AthletePhoto>
      </button>

      <div className="flex items-center justify-between gap-3 p-3.5">
        <span className="text-[18px] font-extrabold text-white">{formatPrice(course.price)}</span>
        {owned ? (
          <Button size="sm" fullWidth={false} variant="secondary" onClick={open} className="px-4">
            Продолжить
          </Button>
        ) : (
          <Button size="sm" fullWidth={false} onClick={open} icon={<ChevronRight size={16} />} className="px-4">
            Купить курс
          </Button>
        )}
      </div>
    </div>
  )
}
