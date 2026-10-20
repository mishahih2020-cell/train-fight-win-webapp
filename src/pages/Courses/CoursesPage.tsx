import { HelpCircle } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CourseCard } from '@/components/cards/CourseCard'
import { IconButton } from '@/components/ui/IconButton'
import { Tabs } from '@/components/ui/Tabs'
import { OnboardingTour, type TourStep } from '@/components/onboarding/OnboardingTour'
import { useAppState } from '@/context/AppStateContext'
import { coursesRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { useT } from '@/i18n/useT'
import { track } from '@/lib/analytics'

export function CoursesPage() {
  const navigate = useNavigate()
  const { t } = useT()
  const { tours, completeTour } = useAppState()
  const [tab, setTab] = useState<'all' | 'mine'>('all')
  const { items: courses } = useRepoList(coursesRepo)

  useEffect(() => {
    track('course_list_view')
  }, [])
  const [tourForced, setTourForced] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const tourSteps = useMemo<TourStep[]>(
    () => [
      { titleKey: 'tour.courses.step1Title', bodyKey: 'tour.courses.step1Body', target: tabsRef },
      { titleKey: 'tour.courses.step2Title', bodyKey: 'tour.courses.step2Body', target: listRef },
    ],
    [],
  )

  const visible = useMemo(
    () => (tab === 'mine' ? courses.filter((c) => c.purchased) : courses),
    [tab, courses],
  )

  return (
    <div className="safe-top px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-[var(--color-text)]">{t('courses.title')}</h1>
        <IconButton variant="card" aria-label={t('tour.help')} onClick={() => setTourForced(true)}>
          <HelpCircle className="h-4 w-4" />
        </IconButton>
      </div>

      <div ref={tabsRef} className="mt-4">
        <Tabs options={['all', 'mine']} value={tab} onChange={setTab} labelFor={(k) => t(k === 'all' ? 'courses.tab.all' : 'courses.tab.mine')} />
      </div>

      <div ref={listRef} className="mt-4 flex flex-col gap-4">
        {visible.length > 0 ? (
          visible.map((c) => <CourseCard key={c.id} course={c} onClick={() => navigate(`/courses/${c.id}`)} />)
        ) : (
          <div className="text-body-secondary rounded-[var(--radius-card)] border border-dashed border-[var(--color-divider)] p-6 text-center text-[var(--color-text-secondary)]">
            {t('courses.empty')}
          </div>
        )}
      </div>

      <div className="h-4" />

      {(tourForced || !tours.courses) && (
        <OnboardingTour
          steps={tourSteps}
          onDone={() => {
            completeTour('courses')
            setTourForced(false)
          }}
        />
      )}
    </div>
  )
}
