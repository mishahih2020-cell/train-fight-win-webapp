import type { Exercise, SessionExercise } from '@/types'

/** Turns a flat exercise list (as authored in Create-workout or a library workout) into the
 * round/time/rest shape the session screen displays. */
export function buildSessionExercises(exercises: Exercise[]): SessionExercise[] {
  return exercises.map((ex, i) => ({
    id: ex.id,
    title: ex.name,
    round: `${i + 1}/${exercises.length}`,
    time: `${String(ex.durationMin).padStart(2, '0')}:00`,
    rest: '00:30',
  }))
}
