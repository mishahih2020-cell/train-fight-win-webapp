import { achievements } from '@/data/achievements'
import { getCourseById } from '@/data/courses'
import type { AppState } from '@/context/AppStateContext'
import type { WorkoutEntry } from '@/types'

export function getCompletedCoursesCount(state: AppState): number {
  return state.purchasedCourses.filter((id) => {
    const course = getCourseById(id)
    if (!course) return false
    return (state.courseProgress[id] ?? 0) >= course.lessonCount
  }).length
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Consecutive trained days counting back from today (or yesterday, if today has no entry yet). */
export function getTrainingStreak(workoutLog: WorkoutEntry[]): number {
  const days = new Set(workoutLog.map((w) => w.date))
  const cursor = new Date()
  if (!days.has(toDateStr(cursor))) cursor.setDate(cursor.getDate() - 1)

  let streak = 0
  while (days.has(toDateStr(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

/** Oldest → newest booleans for the last n calendar days, true if a workout was logged that day. */
export function getLastNDaysActivity(workoutLog: WorkoutEntry[], n: number): boolean[] {
  const days = new Set(workoutLog.map((w) => w.date))
  const result: boolean[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    result.push(days.has(toDateStr(d)))
  }
  return result
}

export function getWeekWorkoutStats(workoutLog: WorkoutEntry[]): { count: number; minutes: number } {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 6)
  const cutoffStr = toDateStr(cutoff)
  const recent = workoutLog.filter((w) => w.date >= cutoffStr)
  return { count: recent.length, minutes: recent.reduce((sum, w) => sum + w.durationMin, 0) }
}

export function getAchievementProgress(state: AppState, level: number) {
  const completedCourses = getCompletedCoursesCount(state)
  const trainingStreak = getTrainingStreak(state.workoutLog)

  return achievements.map((achievement) => {
    let progress = 0
    switch (achievement.id) {
      case 'first-steps':
        progress = Math.min(state.viewedLessons.length, achievement.total)
        break
      case 'willpower':
        progress = Math.min(trainingStreak, achievement.total)
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

export function formatDiaryDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const today = toDateStr(new Date())
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateStr === today) return 'Сегодня'
  if (dateStr === toDateStr(yesterday)) return 'Вчера'
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })
}
