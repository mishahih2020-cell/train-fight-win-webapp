export const DEFAULT_ROUNDS = 5
export const DEFAULT_ROUND_SEC = 180
export const DEFAULT_REST_SEC = 60

/** What every "Начать тренировку" entry point hands to /workouts/session via router state. */
export interface SessionNavState {
  workoutName?: string
  category?: string
  courseId?: string
  rounds?: number
  roundSec?: number
  restSec?: number
  /** Shown as each round's sub-label, cycling if there are fewer names than rounds. */
  exerciseNames?: string[]
}
