export interface AiContext {
  goal: string
  workoutCount: number
  lastWorkoutTitle?: string
  weightCurrent: number
  weightDeltaLabel: string
}

const KEYWORD_REPLIES: { keywords: string[]; reply: (ctx: AiContext) => string }[] = [
  {
    keywords: ['вес', 'похуде', 'набра', 'масс'],
    reply: (ctx) =>
      `Твой текущий вес — ${ctx.weightCurrent > 0 ? `${ctx.weightCurrent.toFixed(1)} кг (${ctx.weightDeltaLabel})` : 'ещё не отмечен'}. Цель — «${ctx.goal}». Отмечай вес регулярно в разделе «Прогресс» — так подсказки будут точнее.`,
  },
  {
    keywords: ['питани', 'еда', 'калори', 'диет', 'ем'],
    reply: () =>
      'Держи белок на уровне 1.6–2 г на кг веса, углеводы — в основном вокруг тренировок, и стабильный питьевой режим. Дневной ориентир по калориям и БЖУ — в разделе «Питание».',
  },
  {
    keywords: ['трениров', 'заняти', 'спорт'],
    reply: (ctx) =>
      ctx.workoutCount > 0
        ? `В истории уже ${ctx.workoutCount} тренировок${ctx.lastWorkoutTitle ? `, последняя — «${ctx.lastWorkoutTitle}»` : ''}. Не забывай про день отдыха между интенсивными сессиями.`
        : 'Пока нет завершённых тренировок в истории — начни первую на вкладке «Тренировки», и я смогу давать более точные советы.',
  },
  {
    keywords: ['мотивац', 'лень', 'устал', 'не хочу', 'сложно'],
    reply: () =>
      'Дисциплина сильнее мотивации. Даже короткая лёгкая тренировка сегодня — лучше, чем пропуск. Начни хотя бы с 15 минут.',
  },
  {
    keywords: ['цел', 'план'],
    reply: (ctx) => `Твоя текущая цель — «${ctx.goal}». Если хочешь скорректировать её — загляни в «Профиль → Мои цели».`,
  },
]

const DEFAULT_REPLY = (ctx: AiContext) =>
  `Принял! Пока отвечаю по шаблонам на основе твоих реальных данных (тренировки, вес, цель «${ctx.goal}») — полноценный AI на твоих данных подключится после переноса приложения на сервер.`

export function buildAiReply(userText: string, ctx: AiContext): string {
  const lower = userText.toLowerCase()
  const match = KEYWORD_REPLIES.find((r) => r.keywords.some((k) => lower.includes(k)))
  return match ? match.reply(ctx) : DEFAULT_REPLY(ctx)
}

export function buildQuickActionReply(actionId: string, ctx: AiContext): string {
  switch (actionId) {
    case 'qa1':
      return `План на неделю под цель «${ctx.goal}»:\n\nПн — Силовая\nВт — Лёгкое кардио / растяжка\nСр — Техника\nЧт — Отдых\nПт — Силовая\nСб — Спарринг / интенсив\nВс — Отдых\n\nПодстрою точнее, когда в истории будет больше тренировок.`
    case 'qa2':
      return 'Базовый ориентир на день: около 2400 ккал, из них белки ~200 г, углеводы ~300 г, жиры ~90 г — подробный разбор в «Питание». Для похудения сократи углеводы на 15–20%, для набора массы — добавь калорийность за счёт белка и сложных углеводов.'
    case 'qa3':
      return ctx.workoutCount > 0
        ? `За всё время — ${ctx.workoutCount} тренировок${ctx.weightCurrent > 0 ? `, текущий вес ${ctx.weightCurrent.toFixed(1)} кг (${ctx.weightDeltaLabel})` : ''}. Движешься к цели «${ctx.goal}» — так держать.`
        : 'Пока данных маловато — заверши пару тренировок и отметь вес в «Прогресс», тогда смогу дать содержательный анализ.'
    default:
      return DEFAULT_REPLY(ctx)
  }
}
