import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Headset, ListChecks, ShieldCheck, Swords } from 'lucide-react'
import { AthletePhoto } from '@/components/ui/AthletePhoto'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/navigation/Header'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getCourseById } from '@/data/courses'
import { directionLabels, levelLabels } from '@/data/lessons'
import { formatPrice } from '@/lib/selectors'
import { useAppState } from '@/context/AppStateContext'
import { useToast } from '@/context/ToastContext'

type Tab = 'program' | 'get' | 'whom'

const tabs: { id: Tab; label: string }[] = [
  { id: 'program', label: 'Программа' },
  { id: 'get', label: 'Что получишь' },
  { id: 'whom', label: 'Для кого' },
]

export function CourseDetailPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const course = courseId ? getCourseById(courseId) : undefined
  const [tab, setTab] = useState<Tab>('program')
  const { state, advanceCourse } = useAppState()
  const { showToast } = useToast()

  if (!course) return null

  const owned = state.purchasedCourses.includes(course.id)
  const progress = state.courseProgress[course.id] ?? 0
  const isComplete = progress >= course.lessonCount

  const handlePrimaryCta = () => {
    if (!owned) {
      navigate(`/checkout/${course.id}`)
      return
    }
    if (isComplete) return
    advanceCourse(course.id)
    showToast(`Урок пройден +50 XP`)
  }

  return (
    <div className="pb-10">
      <div className="relative">
        <AthletePhoto focal="top" fade="bottom" icon={Swords} iconSize={130} className="h-[300px] w-full">
          <div className="safe-top absolute inset-x-0 top-0 p-4">
            <Header title="" transparent onBack={() => navigate(-1)} />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <Badge tone="muted">{directionLabels[course.direction]}</Badge>
          </div>
        </AthletePhoto>
      </div>

      <div className="px-5 pt-5">
        <h1 className="text-[24px] font-extrabold uppercase leading-tight tracking-tight text-balance">{course.title}</h1>
        <p className="mt-2 text-[12px] font-semibold text-muted">
          {levelLabels[course.level]} · {course.lessonCount} уроков · {course.weeks} недели
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">{course.description}</p>

        {owned ? (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-[12px] font-bold">
              <span className="text-white">
                {progress} / {course.lessonCount} уроков
              </span>
              <span className="text-lime">{Math.round((progress / course.lessonCount) * 100)}%</span>
            </div>
            <ProgressBar value={progress} max={course.lessonCount} />
            <Button className="mt-4" onClick={handlePrimaryCta} disabled={isComplete}>
              {isComplete ? 'Курс завершён' : 'Продолжить курс'}
            </Button>
          </div>
        ) : (
          <Button className="mt-5" onClick={handlePrimaryCta}>
            Купить курс — {formatPrice(course.price)}
          </Button>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2">
          <TrustItem icon={<ListChecks size={18} />} label="Пошаговая система" />
          <TrustItem icon={<ShieldCheck size={18} />} label="Доступ навсегда" />
          <TrustItem icon={<Headset size={18} />} label="Поддержка тренера" />
        </div>

        <div className="mt-7 flex gap-1.5 rounded-pill border border-border bg-graphite p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`press flex-1 rounded-pill py-2 text-[12px] font-bold ${
                tab === t.id ? 'bg-lime text-bg' : 'text-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {tab === 'program' && (
            <div className="flex flex-col gap-2">
              {course.modules.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-md border border-border bg-graphite px-4 py-3.5"
                >
                  <span className="text-[13px] font-extrabold text-lime">{String(m.number).padStart(2, '0')}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold text-white">{m.title}</p>
                    <p className="text-[11px] text-muted">{m.lessonCount} уроков</p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-muted-2" />
                </div>
              ))}
            </div>
          )}

          {tab === 'get' && (
            <ul className="flex flex-col gap-2.5">
              {course.whatYouGet.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-white">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-lime" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {tab === 'whom' && (
            <ul className="flex flex-col gap-2.5">
              {course.forWhom.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-white">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-lime" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-md border border-border bg-graphite px-2 py-3 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center text-lime">{icon}</div>
      <p className="mt-1.5 text-[10px] font-semibold leading-tight text-muted">{label}</p>
    </div>
  )
}
