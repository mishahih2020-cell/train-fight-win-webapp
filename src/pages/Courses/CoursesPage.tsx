import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CourseCard } from '@/components/cards/CourseCard'
import { Tabs } from '@/components/ui/Tabs'
import { coursesRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { useT } from '@/i18n/useT'

export function CoursesPage() {
  const navigate = useNavigate()
  const { t } = useT()
  const [tab, setTab] = useState<'all' | 'mine'>('all')
  const { items: courses } = useRepoList(coursesRepo)

  const visible = useMemo(
    () => (tab === 'mine' ? courses.filter((c) => c.purchased) : courses),
    [tab, courses],
  )

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">{t('courses.title')}</h1>

      <div className="mt-4">
        <Tabs options={['all', 'mine']} value={tab} onChange={setTab} labelFor={(k) => t(k === 'all' ? 'courses.tab.all' : 'courses.tab.mine')} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {visible.length > 0 ? (
          visible.map((c) => <CourseCard key={c.id} course={c} onClick={() => navigate(`/courses/${c.id}`)} />)
        ) : (
          <div className="text-body-secondary rounded-[var(--radius-card)] border border-dashed border-[var(--color-divider)] p-6 text-center text-[var(--color-text-secondary)]">
            {t('courses.empty')}
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  )
}
