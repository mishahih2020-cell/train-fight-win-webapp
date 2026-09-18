import type { PurchaseRecord } from '@/types'

export const seedPurchaseHistory: PurchaseRecord[] = [
  {
    id: 'p1',
    courseId: 'muay-thai-basic',
    courseName: 'Муай-тай: Базовый курс',
    price: 4990,
    date: '12.05.2025',
    status: 'paid',
    image: 'muay-thai-basic',
  },
  {
    id: 'p2',
    courseId: 'kickboxing-technique',
    courseName: 'Кикбоксинг: Техника и комбинации',
    price: 6990,
    date: '02.04.2025',
    status: 'paid',
    image: 'kickboxing-technique',
  },
]
