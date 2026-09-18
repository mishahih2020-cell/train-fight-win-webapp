import type { Lesson } from '@/types'

export const freeLessons: Lesson[] = [
  {
    id: 'l1',
    number: 1,
    title: 'Базовая стойка и перемещения',
    direction: 'muay-thai',
    level: 'beginner',
    durationMin: 8,
    thumbnail: 'lesson-1',
    xp: 50,
  },
  {
    id: 'l2',
    number: 2,
    title: 'Техника лоу-кика',
    direction: 'kickboxing',
    level: 'beginner',
    durationMin: 12,
    thumbnail: 'lesson-2',
    xp: 50,
  },
  {
    id: 'l3',
    number: 3,
    title: 'Защита и уклоны',
    direction: 'muay-thai',
    level: 'beginner',
    durationMin: 10,
    thumbnail: 'lesson-3',
    xp: 50,
  },
  {
    id: 'l4',
    number: 4,
    title: 'Комбинации ударов',
    direction: 'kickboxing',
    level: 'intermediate',
    durationMin: 14,
    thumbnail: 'lesson-4',
    xp: 50,
  },
  {
    id: 'l5',
    number: 5,
    title: 'Работа в клинче',
    direction: 'muay-thai',
    level: 'intermediate',
    durationMin: 11,
    thumbnail: 'lesson-5',
    xp: 50,
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return freeLessons.find((lesson) => lesson.id === id)
}

export const directionLabels: Record<Lesson['direction'], string> = {
  'muay-thai': 'Муай-тай',
  kickboxing: 'Кикбоксинг',
}

export const levelLabels: Record<Lesson['level'], string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}
