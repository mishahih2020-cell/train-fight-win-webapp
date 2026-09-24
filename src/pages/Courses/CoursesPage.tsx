import { useState } from 'react'
import { CourseCard } from '@/components/cards/CourseCard'
import { Tabs } from '@/components/ui/Tabs'
import { COURSES } from '@/data/mock'

export function CoursesPage() {
  const [tab, setTab] = useState<'Все курсы' | 'Мои курсы'>('Все курсы')

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">Курсы</h1>

      <div className="mt-4">
        <Tabs options={['Все курсы', 'Мои курсы']} value={tab} onChange={setTab} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {COURSES.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>

      <div className="h-4" />
    </div>
  )
}
