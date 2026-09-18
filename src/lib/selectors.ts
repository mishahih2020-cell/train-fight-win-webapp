import { achievements } from '@/data/achievements'
import { getCourseById } from '@/data/courses'
import type { AppState } from '@/context/AppStateContext'

export function getCompletedCoursesCount(state: AppState): number {
  return state.purchasedCourses.filter((id) => {
    const course = getCourseById(id)
    if (!course) return false
    return (state.courseProgress[id] ?? 0) >= course.lessonCount
  }).length
}

export function getAchievementProgress(state: AppState, level: number) {
  const completedCourses = getCompletedCoursesCount(state)

  return achievements.map((achievement) => {
    let progress = 0
    switch (achievement.id) {
      case 'first-steps':
        progress = Math.min(state.viewedLessons.length, achievement.total)
        break
      case 'willpower':
        progress = Math.min(state.trainingStreak, achievement.total)
        break
      case 'fighter':
        progress = completedCourses > 0 ? 1 : 0
        break
      case 'growth':
        progress = Math.min(level, achievement.total)
        break
      default:
        progress = 0
    }
    return { ...achievement, progress, unlocked: progress >= achievement.total }
  })
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`
}

export function formatDateRu(date: Date): string {
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
