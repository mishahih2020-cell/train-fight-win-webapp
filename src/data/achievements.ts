import type { Achievement } from '@/types'

export const achievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'Первые шаги',
    description: 'Пройди 5 бесплатных уроков',
    category: 'progress',
    total: 5,
    icon: 'flag',
  },
  {
    id: 'willpower',
    title: 'Сила воли',
    description: '7 дней подряд тренировок',
    category: 'progress',
    total: 7,
    icon: 'flame',
  },
  {
    id: 'fighter',
    title: 'Боец',
    description: 'Заверши первый курс',
    category: 'courses',
    total: 1,
    icon: 'fighter',
  },
  {
    id: 'growth',
    title: 'Развитие',
    description: 'Достигни 10 уровня',
    category: 'progress',
    total: 10,
    icon: 'trending',
  },
]
