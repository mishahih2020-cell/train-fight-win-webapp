import { useNavigate } from 'react-router-dom'
import { Gift, Swords, TrendingUp, Users } from 'lucide-react'
import { AthletePhoto } from '@/components/ui/AthletePhoto'
import { Button } from '@/components/ui/Button'
import { BrandMark } from '@/components/navigation/BrandMark'
import { LessonCard } from '@/components/lessons/LessonCard'
import { UfcEventBanner } from '@/components/lessons/UfcEventBanner'
import { freeLessons } from '@/data/lessons'
import { useAppState } from '@/context/AppStateContext'
import { useToast } from '@/context/ToastContext'

export function LessonsPage() {
  const navigate = useNavigate()
  const { state, viewLesson } = useAppState()
  const { showToast } = useToast()

  const handleOpen = (lessonId: string, xp: number) => {
    const alreadyViewed = state.viewedLessons.includes(lessonId)
    viewLesson(lessonId)
    if (!alreadyViewed) showToast(`Урок просмотрен +${xp} XP`)
  }

  return (
    <div className="pb-28">
      <div className="flex items-center justify-between px-5 pt-[max(16px,env(safe-area-inset-top))]">
        <BrandMark />
      </div>

      <AthletePhoto focal="top" fade="bottom" icon={Swords} iconSize={150} className="mt-4 h-[340px] w-full">
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6">
          <h1 className="text-[34px] font-extrabold uppercase leading-[0.95] tracking-tight text-white text-balance">
            Бесплатные
            <br />
            уроки
          </h1>
          <p className="mt-3 max-w-[280px] text-[13px] leading-snug text-muted">
            Попробуй мой подход к тренировкам. Получи реальные знания и почувствуй результат с первых уроков.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-sm border border-border bg-black/40 px-2 py-2.5 text-center backdrop-blur-sm">
              <Gift size={16} className="mx-auto text-lime" />
              <p className="mt-1 text-[10px] font-semibold leading-tight text-white">5 уроков в подарок</p>
            </div>
            <div className="rounded-sm border border-border bg-black/40 px-2 py-2.5 text-center backdrop-blur-sm">
              <Users size={16} className="mx-auto text-lime" />
              <p className="mt-1 text-[10px] font-semibold leading-tight text-white">Для любого уровня</p>
            </div>
            <div className="rounded-sm border border-border bg-black/40 px-2 py-2.5 text-center backdrop-blur-sm">
              <TrendingUp size={16} className="mx-auto text-lime" />
              <p className="mt-1 text-[10px] font-semibold leading-tight text-white">Реальный прогресс</p>
            </div>
          </div>
        </div>
      </AthletePhoto>

      <div className="mt-5 flex flex-col gap-2.5 px-5">
        {freeLessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            viewed={state.viewedLessons.includes(lesson.id)}
            onOpen={() => handleOpen(lesson.id, lesson.xp)}
          />
        ))}
      </div>

      <div className="mt-6 px-5">
        <UfcEventBanner />
      </div>

      <div className="mt-6 px-5">
        <div className="rounded-lg border border-lime/20 bg-gradient-to-br from-lime/10 to-transparent p-5 text-center">
          <h2 className="text-[20px] font-extrabold uppercase tracking-tight text-white">Хочешь больше?</h2>
          <p className="mt-2 text-[13px] leading-snug text-muted">
            Полные курсы и продвинутая техника доступны в платных программах.
          </p>
          <Button className="mt-4" onClick={() => navigate('/courses')}>
            Перейти к курсам
          </Button>
        </div>
      </div>
    </div>
  )
}
