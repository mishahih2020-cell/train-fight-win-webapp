const DAY_MS = 86_400_000

function toDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`)
}

/**
 * Consecutive-day streak from a list of workout dates (yyyy-mm-dd, may
 * repeat). Alive if the most recent workout was today or yesterday;
 * broken (0) if there's a gap of a full day or more.
 */
export function computeWorkoutStreak(dates: string[]): number {
  const uniqueDays = Array.from(new Set(dates)).sort()
  if (uniqueDays.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const mostRecent = toDate(uniqueDays[uniqueDays.length - 1])
  const daysSinceMostRecent = Math.round((today.getTime() - mostRecent.getTime()) / DAY_MS)
  if (daysSinceMostRecent > 1) return 0

  let streak = 1
  for (let i = uniqueDays.length - 1; i > 0; i--) {
    const diff = Math.round((toDate(uniqueDays[i]).getTime() - toDate(uniqueDays[i - 1]).getTime()) / DAY_MS)
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}
