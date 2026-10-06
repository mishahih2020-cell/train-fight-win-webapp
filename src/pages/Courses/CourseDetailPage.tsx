import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/navigation/Header'
import { Modal } from '@/components/ui/Modal'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import { awardBonus, coursesRepo, ordersRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { primeAudio } from '@/lib/sound'

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addSpin, language } = useAppState()
  const { t } = useT()
  const { items: courses, loaded, reload } = useRepoList(coursesRepo)
  const course = courses.find((c) => c.id === id)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [justBought, setJustBought] = useState(false)

  if (!course) {
    if (!loaded) return null
    return (
      <div className="pb-8">
        <Header title={t('courses.title')} />
        <div className="mt-8 px-4 text-center">
          <p className="text-body-secondary text-[var(--color-text-secondary)]">{t('courses.notFound')}</p>
          <Button variant="secondary" className="mt-5" onClick={() => navigate('/courses')}>
            {t('common.back')}
          </Button>
        </div>
      </div>
    )
  }

  const confirmPurchase = async () => {
    await coursesRepo.update(course.id, { purchased: true, progress: 0 })
    await ordersRepo.add({
      id: `o${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      amount: course.price,
      date: new Date().toISOString().slice(0, 10),
      status: course.price > 0 ? 'paid' : 'free',
    })
    await awardBonus(50, `Покупка курса «${course.title}»`)
    addSpin(1)
    setConfirmOpen(false)
    setJustBought(true)
    reload()
  }

  const startCourseWorkout = () => {
    primeAudio()
    navigate('/workouts/session', { state: { workoutName: course.title, courseId: course.id } })
  }

  const progress = course.progress ?? 0

  return (
    <div className="pb-8">
      <Header title={course.title} />

      <div className="mt-4 px-4">
        <PlaceholderImage className="h-48 w-full" darken />

        <div className="mt-4">
          <div className="text-h1 text-[var(--color-text)] uppercase">{course.title}</div>
          <div className="text-body-secondary mt-1 text-[var(--color-text-secondary)]">{course.subtitle}</div>
        </div>

        {course.purchased ? (
          <>
            <div className="mt-5 rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-body-secondary font-semibold text-[var(--color-text)]">{t('courses.detailVideo')}</span>
                <span className="text-caption font-semibold text-[var(--color-accent)]">{progress}%</span>
              </div>
              <ProgressBar value={progress} className="mt-2" />
              <PlaceholderImage className="mt-3 aspect-video w-full" compact />
              <p className="text-caption mt-2 text-[var(--color-text-tertiary)]">{t('courses.detailVideoHint')}</p>
            </div>

            <p className="text-body-secondary mt-4 text-[var(--color-text-secondary)]">{course.description}</p>

            <Button variant="primary" className="mt-6" onClick={startCourseWorkout}>
              {progress >= 100 ? t('courses.completed') : progress > 0 ? t('courses.continueCourse') : t('courses.startWorkoutFromCourse')}
            </Button>
          </>
        ) : (
          <>
            <p className="text-body-secondary mt-4 text-[var(--color-text-secondary)]">{course.description}</p>

            <div className="h-24" />
          </>
        )}
      </div>

      {!course.purchased && (
        <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-[var(--color-divider)] bg-[var(--color-bg)] p-4">
          <Button variant="primary" onClick={() => setConfirmOpen(true)}>
            {course.price > 0 ? t('courses.buyFor', { price: course.price.toLocaleString(language === 'en' ? 'en-US' : 'ru-RU') }) : t('courses.getFree')}
          </Button>
        </div>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="text-h2 text-[var(--color-text)]">{course.title}</div>
        <p className="text-body-secondary mt-2 text-[var(--color-text-secondary)]">{course.description}</p>
        <p className="text-caption mt-4 rounded-[var(--radius-button)] bg-[var(--color-card-2)] p-3 text-[var(--color-text-tertiary)]">
          {t('courses.testPurchaseNote')}
        </p>
        <Button variant="primary" className="mt-5" onClick={confirmPurchase}>
          {course.price > 0 ? t('courses.buyFor', { price: course.price.toLocaleString(language === 'en' ? 'en-US' : 'ru-RU') }) : t('courses.getFree')}
        </Button>
      </Modal>

      <Modal open={justBought} onClose={() => setJustBought(false)}>
        <div className="text-center">
          <div className="text-h2 text-[var(--color-text)]">{t('courses.boughtTitle')}</div>
          <p className="text-body-secondary mt-2 text-[var(--color-text-secondary)]">{t('courses.boughtBody', { title: course.title })}</p>
          <div className="mt-5 flex flex-col gap-2">
            <Button variant="primary" onClick={() => navigate('/wheel')}>
              {t('courses.spinWheel')}
            </Button>
            <Button variant="ghost" onClick={() => setJustBought(false)}>
              {t('common.later')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
