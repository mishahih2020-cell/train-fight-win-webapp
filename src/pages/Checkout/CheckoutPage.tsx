import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, ChevronRight, Landmark, ShieldCheck, Sparkles } from 'lucide-react'
import { AthletePhoto } from '@/components/ui/AthletePhoto'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/navigation/Header'
import { Modal } from '@/components/ui/Modal'
import { getCourseById } from '@/data/courses'
import { XP_RULES } from '@/data/xpRules'
import { formatPrice } from '@/lib/selectors'
import { useAppState } from '@/context/AppStateContext'

export function CheckoutPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const course = courseId ? getCourseById(courseId) : undefined
  const { purchaseCourse } = useAppState()
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!course) return null

  const handlePay = () => {
    setPaying(true)
    window.setTimeout(() => {
      purchaseCourse(course.id)
      setPaying(false)
      setSuccess(true)
    }, 900)
  }

  const goToCourse = () => {
    setSuccess(false)
    navigate(`/courses/${course.id}`, { replace: true })
  }

  return (
    <div className="pb-10">
      <Header title="Покупка курса" />

      <div className="px-5 pt-4">
        <div className="flex items-center gap-3 rounded-md border border-border bg-graphite p-3">
          <AthletePhoto focal="top" fade="none" className="h-14 w-14 shrink-0 rounded-sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-white">{course.shortTitle}</p>
            <p className="text-[12px] text-muted">
              {course.lessonCount} уроков · {course.weeks} недели
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-graphite px-4 py-3.5">
          <span className="text-[13px] font-semibold text-muted">Итого</span>
          <span className="text-[20px] font-extrabold text-white">{formatPrice(course.price)}</span>
        </div>

        <p className="mt-6 px-1 text-[12px] font-bold uppercase tracking-wide text-muted">Способ оплаты</p>
        <button className="press mt-2 flex w-full items-center justify-between rounded-md border border-border bg-graphite px-4 py-3.5 text-left">
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/8 text-lime">
              <Landmark size={18} />
            </span>
            <span>
              <span className="block text-[14px] font-bold text-white">Банковская карта (Т-Банк)</span>
              <span className="block text-[11px] text-muted">Быстрая и безопасная оплата</span>
            </span>
          </span>
          <ChevronRight size={16} className="text-muted-2" />
        </button>

        <div className="mt-3 rounded-md border border-border bg-graphite p-4">
          <div className="flex items-center gap-2 text-lime">
            <ShieldCheck size={18} />
            <span className="text-[13px] font-bold text-white">Безопасная оплата</span>
          </div>
          <p className="mt-1.5 text-[12px] leading-snug text-muted">
            Все данные защищены и не передаются третьим лицам.
          </p>
        </div>

        <Button className="mt-6" onClick={handlePay} disabled={paying}>
          {paying ? 'Обработка...' : `Оплатить ${formatPrice(course.price)}`}
        </Button>
        <p className="mt-3 text-center text-[11px] leading-snug text-muted-2">
          Нажимая кнопку, вы соглашаетесь с офертой и политикой конфиденциальности.
        </p>
      </div>

      <Modal open={success} onClose={goToCourse} dismissible={false}>
        <div className="animate-scale-in flex flex-col items-center pt-4 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-pill bg-lime/12 text-lime shadow-[0_0_28px_rgba(198,255,69,0.25)]">
            <CheckCircle2 size={30} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Оплата прошла успешно</p>
          <h2 className="mt-2 text-[22px] font-extrabold uppercase leading-tight text-balance">{course.shortTitle}</h2>
          <p className="mt-2 max-w-[280px] text-[14px] leading-snug text-muted">
            Курс доступен в профиле. Прогресс и XP уже засчитаны — можно начинать тренировки.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-pill border border-lime/25 bg-lime/10 px-4 py-2 text-[13px] font-bold text-lime">
            <Sparkles size={14} />
            +{XP_RULES.coursePurchase} XP получено
          </div>
          <Button className="mt-6" onClick={goToCourse}>
            Начать курс
          </Button>
        </div>
      </Modal>
    </div>
  )
}
