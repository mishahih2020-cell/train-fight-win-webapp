import type { Intensity, WorkoutType } from '@/types'

export const WORKOUT_TYPES: WorkoutType[] = ['Муай-тай', 'Кикбоксинг', 'ОФП', 'Спарринг', 'Растяжка']

export const INTENSITY_LEVELS: Intensity[] = ['Легко', 'Средне', 'Тяжело']

export const INTENSITY_TONE: Record<Intensity, 'lime' | 'neutral' | 'muted'> = {
  Легко: 'muted',
  Средне: 'neutral',
  Тяжело: 'lime',
}
