import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { CourseCard } from '@/components/cards/CourseCard'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { awardBonus, coursesRepo, ordersRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import { useAppState } from '@/context/AppStateContext'
import type { Course } from '@/types'

export function CoursesPage() {
  const navigate = useNavigate()
  const { addSpin } = useAppState()
  const [tab, setTab] = useState<'Все курсы' | 'Мои курсы'>('Все курсы')
  const { items: courses, reload } = useRepoList(coursesRepo)
  const [pendingCourse, setPendingCourse] = useState<Course | null>(null)
  const [justBought, setJustBought] = useState<Course | null>(null)

  const visible = useMemo(
    () => (tab === 'Мои курсы' ? courses.filter((c) => c.purchased) : courses),
    [tab, courses],
  )

  const handleCta = (course: Course) => {
    if (course.purchased) {
      navigate('/workouts/session')
      return
    }
    setPendingCourse(course)
  }

  const confirmPurchase = async () => {
    if (!pendingCourse) return
    await coursesRepo.update(pendingCourse.id, { purchased: true, progress: 0 })
    await ordersRepo.add({
      id: `o${Date.now()}`,
      courseId: pendingCourse.id,
      courseTitle: pendingCourse.title,
      amount: pendingCourse.price,
      date: new Date().toISOString().slice(0, 10),
      status: pendingCourse.price > 0 ? 'paid' : 'free',
    })
    await awardBonus(50, `Покупка курса «${pendingCourse.title}»`)
    addSpin(1)
    setJustBought(pendingCourse)
    setPendingCourse(null)
    reload()
  }

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">Курсы</h1>

      <div className="mt-4">
        <Tabs options={['Все курсы', 'Мои курсы']} value={tab} onChange={setTab} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {visible.length > 0 ? (
          visible.map((c) => <CourseCard key={c.id} course={c} onCta={() => handleCta(c)} />)
        ) : (
          <div className="text-body-secondary rounded-[var(--radius-card)] border border-dashed border-[var(--color-divider)] p-6 text-center text-[var(--color-text-secondary)]">
            Здесь появятся купленные курсы
          </div>
        )}
      </div>

      <div className="h-4" />

      <Modal open={!!pendingCourse} onClose={() => setPendingCourse(null)}>
        <div className="text-h2 text-[var(--color-text)]">{pendingCourse?.title}</div>
        <p className="text-body-secondary mt-2 text-[var(--color-text-secondary)]">{pendingCourse?.description}</p>
        <p className="text-caption mt-4 rounded-[var(--radius-button)] bg-[var(--color-card-2)] p-3 text-[var(--color-text-tertiary)]">
          Тестовая покупка — реальная оплата подключится после переноса приложения на сервер. Деньги не списываются.
        </p>
        <Button variant="primary" className="mt-5" onClick={confirmPurchase}>
          {pendingCourse && pendingCourse.price > 0 ? `Купить за ${pendingCourse.price.toLocaleString('ru-RU')} ₽` : 'Забрать бесплатно'}
        </Button>
      </Modal>

      <Modal open={!!justBought} onClose={() => setJustBought(null)}>
        <div className="text-center">
          <div className="text-h2 text-[var(--color-text)]">🎉 Курс открыт!</div>
          <p className="text-body-secondary mt-2 text-[var(--color-text-secondary)]">
            «{justBought?.title}» уже в разделе «Мои курсы». Плюс +50 бонусов и попытка колеса фортуны.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button variant="primary" onClick={() => navigate('/wheel')}>
              Крутить колесо
            </Button>
            <Button variant="ghost" onClick={() => setJustBought(null)}>
              Позже
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
