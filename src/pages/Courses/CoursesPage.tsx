import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CourseCard } from '@/components/cards/CourseCard'
import { Tabs } from '@/components/ui/Tabs'
import { COURSES } from '@/data/mock'

export function CoursesPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'Все курсы' | 'Мои курсы'>('Все курсы')

  const visible = useMemo(
    () => (tab === 'Мои курсы' ? COURSES.filter((c) => typeof c.progress === 'number') : COURSES),
    [tab],
  )

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">Курсы</h1>

      <div className="mt-4">
        <Tabs options={['Все курсы', 'Мои курсы']} value={tab} onChange={setTab} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {visible.length > 0 ? (
          visible.map((c) => <CourseCard key={c.id} course={c} onCta={() => navigate('/workouts/session')} />)
        ) : (
          <div className="text-body-secondary rounded-[var(--radius-card)] border border-dashed border-[var(--color-divider)] p-6 text-center text-[var(--color-text-secondary)]">
            Здесь появятся начатые курсы
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  )
}
