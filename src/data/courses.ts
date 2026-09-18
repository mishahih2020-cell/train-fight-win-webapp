import type { Course } from '@/types'

export const courses: Course[] = [
  {
    id: 'muay-thai-basic',
    title: 'МУАЙ-ТАЙ: БАЗОВЫЙ КУРС',
    shortTitle: 'Муай-тай: Базовый курс',
    direction: 'muay-thai',
    level: 'beginner',
    lessonCount: 24,
    weeks: 4,
    price: 4990,
    image: 'muay-thai-basic',
    isHit: true,
    description:
      'Базовый курс для тех, кто хочет освоить фундамент муай-тай: техника, защита, работа в паре и базовая тактика.',
    modules: [
      { id: 'm1', number: 1, title: 'Базовая стойка и перемещения', lessonCount: 4 },
      { id: 'm2', number: 2, title: 'Удары руками и локтями', lessonCount: 6 },
      { id: 'm3', number: 3, title: 'Лоу-кики и мидл-кики', lessonCount: 5 },
      { id: 'm4', number: 4, title: 'Защита и контратаки', lessonCount: 4 },
      { id: 'm5', number: 5, title: 'Связки и работа в паре', lessonCount: 5 },
    ],
    whatYouGet: [
      'Правильная техника ударов',
      'Постановка дистанции',
      'Базовые комбинации',
      'Основы защиты',
      'Практические задания',
    ],
    forWhom: [
      'Новичкам без опыта',
      'Тем, кто хочет освоить фундамент муай-тай',
      'Тем, кто готовится к первым спаррингам',
    ],
  },
  {
    id: 'kickboxing-technique',
    title: 'КИКБОКСИНГ: ТЕХНИКА И КОМБИНАЦИИ',
    shortTitle: 'Кикбоксинг: Техника и комбинации',
    direction: 'kickboxing',
    level: 'intermediate',
    lessonCount: 32,
    weeks: 6,
    price: 6990,
    image: 'kickboxing-technique',
    description:
      'Развёрнутый курс по технике кикбоксинга: постановка ударов руками и ногами, комбинации и тактика ближнего боя.',
    modules: [
      { id: 'm1', number: 1, title: 'Постановка ударов руками', lessonCount: 6 },
      { id: 'm2', number: 2, title: 'Удары ногами', lessonCount: 7 },
      { id: 'm3', number: 3, title: 'Комбинации и связки', lessonCount: 8 },
      { id: 'm4', number: 4, title: 'Работа на снарядах', lessonCount: 6 },
      { id: 'm5', number: 5, title: 'Тактика ближнего боя', lessonCount: 5 },
    ],
    whatYouGet: [
      'Чистая техника ударов руками и ногами',
      'Скоростные комбинации',
      'Работа на лапах и мешке',
      'Разбор частых ошибок',
      'Домашние задания',
    ],
    forWhom: ['Спортсменам с базовой подготовкой', 'Тем, кто хочет усложнить технику', 'Тем, кто готовится к соревнованиям'],
  },
  {
    id: 'muay-thai-advanced',
    title: 'МУАЙ-ТАЙ: ПРОДВИНУТЫЙ УРОВЕНЬ',
    shortTitle: 'Муай-тай: Продвинутый уровень',
    direction: 'muay-thai',
    level: 'advanced',
    lessonCount: 28,
    weeks: 5,
    price: 7990,
    image: 'muay-thai-advanced',
    description:
      'Продвинутая программа для опытных бойцов: сложные связки, работа в клинче, тактика и подготовка к бою.',
    modules: [
      { id: 'm1', number: 1, title: 'Продвинутая работа ног', lessonCount: 5 },
      { id: 'm2', number: 2, title: 'Клинч и работа коленями', lessonCount: 6 },
      { id: 'm3', number: 3, title: 'Сложные связки', lessonCount: 6 },
      { id: 'm4', number: 4, title: 'Тактика и чтение соперника', lessonCount: 5 },
      { id: 'm5', number: 5, title: 'Спарринг-подготовка', lessonCount: 6 },
    ],
    whatYouGet: [
      'Продвинутые связки и тайминг',
      'Работа в клинче',
      'Тактическое мышление в бою',
      'Подготовка к соревнованиям',
      'Разбор боёв',
    ],
    forWhom: ['Бойцам с опытом от года', 'Тем, кто готовится к соревнованиям', 'Тем, кто хочет выйти на новый уровень'],
  },
  {
    id: 'kickboxing-strength',
    title: 'КИКБОКСИНГ: СИЛОВАЯ ПОДГОТОВКА',
    shortTitle: 'Кикбоксинг: Силовая подготовка',
    direction: 'kickboxing',
    level: 'beginner',
    lessonCount: 20,
    weeks: 4,
    price: 5990,
    image: 'kickboxing-strength',
    description:
      'Физическая подготовка бойца: сила, выносливость и взрывная мощь ударов для кикбоксинга.',
    modules: [
      { id: 'm1', number: 1, title: 'Базовая физподготовка', lessonCount: 4 },
      { id: 'm2', number: 2, title: 'Взрывная сила', lessonCount: 5 },
      { id: 'm3', number: 3, title: 'Выносливость', lessonCount: 5 },
      { id: 'm4', number: 4, title: 'Функциональные тренировки', lessonCount: 6 },
    ],
    whatYouGet: [
      'Рост силы удара',
      'Выносливость на раунды',
      'Функциональная база',
      'Программа без зала',
      'Контроль прогресса',
    ],
    forWhom: ['Новичкам в физподготовке', 'Тем, кто хочет усилить удар', 'Тем, кто тренируется дома'],
  },
]

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id)
}
