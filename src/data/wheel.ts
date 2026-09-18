import type { WheelSegment } from '@/types'

export const wheelSegments: WheelSegment[] = [
  { id: 'w1', label: 'Скидка 5%', type: 'discount', value: 5 },
  { id: 'w2', label: 'Бесплатный урок', type: 'lesson', value: 1 },
  { id: 'w3', label: 'Кэшбек 10%', type: 'bonus', value: 10 },
  { id: 'w4', label: 'Скидка 30%', type: 'discount', value: 30 },
  { id: 'w5', label: 'Повторный спин', type: 'spin', value: 1 },
  { id: 'w6', label: 'Бонус XP', type: 'xp', value: 100 },
  { id: 'w7', label: 'Кэшбек 5%', type: 'bonus', value: 5 },
  { id: 'w8', label: 'Скидка 10%', type: 'discount', value: 10 },
]

export const WHEEL_COOLDOWN_HOURS = 24
