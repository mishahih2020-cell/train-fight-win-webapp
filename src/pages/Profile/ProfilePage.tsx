import { useNavigate } from 'react-router-dom'
import { ChevronRight, Flame, History, NotebookPen, Settings, Trophy } from 'lucide-react'
import { AthletePhoto } from '@/components/ui/AthletePhoto'
import { IconButton } from '@/components/ui/IconButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { getCourseById } from '@/data/courses'
import { DEFAULT_USER } from '@/data/user'
import { getAchievementProgress, getTrainingStreak } from '@/lib/selectors'
import { useAppState } from '@/context/AppStateContext'

export function ProfilePage() {
  const navigate = useNavigate()
  const { state, level, xpIntoLevel, xpForLevel, isMaxLevel } = useAppState()

  const unlockedAchievements = getAchievementProgress(state, level).filter((a) => a.unlocked).length
  const viewedLessonsCount = state.viewedLessons.length
  const streak = getTrainingStreak(state.workoutLog)

  return (
    <div className="pb-28">
      <div className="flex items-center justify-between px-5 pt-[max(16px,env(safe-area-inset-top))]">
        <span className="text-[17px] font-extrabold uppercase tracking-tight">Профиль</span>
        <IconButton icon={<Settings size={18} />} onClick={() => navigate('/settings')} aria-label="Настройки" />
      </div>

      <div className="mt-4 flex items-center gap-4 px-5">
        <AthletePhoto focal="top" fade="none" className="h-16 w-16 shrink-0 rounded-pill" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-extrabold text-white">{DEFAULT_USER.name}</p>
          <p className="text-[12px] text-muted">{DEFAULT_USER.status}</p>
          <div className="mt-0.5 flex items-center gap-3">
            <p className="text-[13px] font-extrabold text-lime">Уровень {level}</p>
            {streak > 0 && (
              <span className="flex items-center gap-1 text-[12px] font-bold text-white">
                <Flame size={13} className="text-lime" fill="currentColor" />
                {streak}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 px-5">
        <div className="mb-2 flex items-center justify-between text-[12px] font-bold">
          <span className="text-white">XP</span>
          <span className="text-muted">
            {isMaxLevel ? `${xpIntoLevel} XP` : `${xpIntoLevel} / ${xpForLevel} XP`}
          </span>
        </div>
        <ProgressBar value={xpIntoLevel} max={isMaxLevel ? Math.max(xpIntoLevel, 1) : xpForLevel} glow />
      </div>

      <div className="mt-5 px-5">
        <ProfileStats
          courses={state.purchasedCourses.length}
          lessons={viewedLessonsCount}
          achievements={unlockedAchievements}
        />
      </div>

      <div className="mt-7 px-5">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[15px] font-extrabold text-white">Мои курсы</p>
          <button onClick={() => navigate('/courses')} className="press text-[12px] font-bold text-lime">
            Все
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {state.purchasedCourses.map((id) => {
            const course = getCourseById(id)
            if (!course) return null
            const progress = state.courseProgress[id] ?? 0
            return (
              <button
                key={id}
                onClick={() => navigate(`/courses/${id}`)}
                className="press flex items-center gap-3 rounded-md border border-border bg-graphite p-3 text-left"
              >
                <AthletePhoto focal="top" fade="none" className="h-12 w-12 shrink-0 rounded-sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-white">{course.shortTitle}</p>
                  <p className="mb-1.5 mt-0.5 text-[11px] text-muted">
                    {progress} / {course.lessonCount} уроков
                  </p>
                  <ProgressBar value={progress} max={course.lessonCount} />
                </div>
                <ChevronRight size={16} className="shrink-0 text-muted-2" />
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-2 px-5">
        <ProfileListItem icon={<NotebookPen size={18} />} label="Дневник тренировок" onClick={() => navigate('/diary')} />
        <ProfileListItem icon={<History size={18} />} label="История покупок" onClick={() => navigate('/purchase-history')} />
        <ProfileListItem
          icon={<Trophy size={18} />}
          label="Достижения"
          onClick={() => navigate('/achievements')}
        />
        <ProfileListItem icon={<Settings size={18} />} label="Настройки" onClick={() => navigate('/settings')} />
      </div>
    </div>
  )
}

function ProfileListItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="press flex items-center gap-3 rounded-md border border-border bg-graphite px-4 py-3.5"
    >
      <span className="text-lime">{icon}</span>
      <span className="flex-1 text-left text-[14px] font-semibold text-white">{label}</span>
      <ChevronRight size={16} className="text-muted-2" />
    </button>
  )
}
