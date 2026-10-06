import type { Lang } from '@/i18n/translations'

export interface AiContext {
  /** Already display-translated (e.g. via t('goal.' + profile.goal)), not the raw stored key. */
  goal: string
  workoutCount: number
  lastWorkoutTitle?: string
  weightCurrent: number
  weightDeltaLabel: string
}

interface KeywordReply {
  keywords: string[]
  reply: (ctx: AiContext) => string
}

const KEYWORD_REPLIES_RU: KeywordReply[] = [
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

const KEYWORD_REPLIES_EN: KeywordReply[] = [
  {
    keywords: ['weight', 'lose', 'gain', 'mass'],
    reply: (ctx) =>
      `Your current weight is ${ctx.weightCurrent > 0 ? `${ctx.weightCurrent.toFixed(1)} kg (${ctx.weightDeltaLabel})` : 'not logged yet'}. Your goal is "${ctx.goal}". Log weight regularly in Progress — it makes the advice more accurate.`,
  },
  {
    keywords: ['nutrition', 'food', 'calorie', 'diet', 'eat'],
    reply: () =>
      'Aim for 1.6–2g of protein per kg of bodyweight, keep carbs mostly around your workouts, and stay consistent on water. Your daily calorie/macro targets are in Nutrition.',
  },
  {
    keywords: ['workout', 'train', 'sport', 'exercise'],
    reply: (ctx) =>
      ctx.workoutCount > 0
        ? `You've got ${ctx.workoutCount} workouts logged${ctx.lastWorkoutTitle ? `, last one was "${ctx.lastWorkoutTitle}"` : ''}. Don't skip rest days between intense sessions.`
        : "No completed workouts yet — start your first one in the Workouts tab, and I'll be able to give more specific advice.",
  },
  {
    keywords: ['motivat', 'lazy', 'tired', "don't want", 'hard'],
    reply: () =>
      "Discipline beats motivation. Even a short, easy workout today beats skipping it. Start with just 15 minutes.",
  },
  {
    keywords: ['goal', 'plan'],
    reply: (ctx) => `Your current goal is "${ctx.goal}". Want to change it? Check Profile → My goals.`,
  },
]

const DEFAULT_REPLY: Record<Lang, (ctx: AiContext) => string> = {
  ru: (ctx) =>
    `Принял! Пока отвечаю по шаблонам на основе твоих реальных данных (тренировки, вес, цель «${ctx.goal}») — полноценный AI на твоих данных подключится после переноса приложения на сервер.`,
  en: (ctx) =>
    `Got it! I'm still template-based for now, using your real data (workouts, weight, goal "${ctx.goal}") — full AI will connect once the app moves to a server.`,
}

export function buildAiReply(userText: string, ctx: AiContext, lang: Lang = 'ru'): string {
  const lower = userText.toLowerCase()
  const table = lang === 'en' ? KEYWORD_REPLIES_EN : KEYWORD_REPLIES_RU
  const match = table.find((r) => r.keywords.some((k) => lower.includes(k)))
  return match ? match.reply(ctx) : DEFAULT_REPLY[lang](ctx)
}

const QUICK_ACTION_RU: Record<string, (ctx: AiContext) => string> = {
  qa1: (ctx) =>
    `План на неделю под цель «${ctx.goal}»:\n\nПн — Силовая\nВт — Лёгкое кардио / растяжка\nСр — Техника\nЧт — Отдых\nПт — Силовая\nСб — Спарринг / интенсив\nВс — Отдых\n\nПодстрою точнее, когда в истории будет больше тренировок.`,
  qa2: () =>
    'Базовый ориентир на день: около 2400 ккал, из них белки ~200 г, углеводы ~300 г, жиры ~90 г — подробный разбор в «Питание». Для похудения сократи углеводы на 15–20%, для набора массы — добавь калорийность за счёт белка и сложных углеводов.',
  qa3: (ctx) =>
    ctx.workoutCount > 0
      ? `За всё время — ${ctx.workoutCount} тренировок${ctx.weightCurrent > 0 ? `, текущий вес ${ctx.weightCurrent.toFixed(1)} кг (${ctx.weightDeltaLabel})` : ''}. Движешься к цели «${ctx.goal}» — так держать.`
      : 'Пока данных маловато — заверши пару тренировок и отметь вес в «Прогресс», тогда смогу дать содержательный анализ.',
}

const QUICK_ACTION_EN: Record<string, (ctx: AiContext) => string> = {
  qa1: (ctx) =>
    `Week plan for your "${ctx.goal}" goal:\n\nMon — Strength\nTue — Light cardio / stretching\nWed — Technique\nThu — Rest\nFri — Strength\nSat — Sparring / intense\nSun — Rest\n\nI'll tune this once there's more workout history.`,
  qa2: () =>
    'Daily baseline: about 2400 kcal, roughly 200g protein, 300g carbs, 90g fat — see the full breakdown in Nutrition. For weight loss, cut carbs by 15-20%; for mass gain, add calories via protein and complex carbs.',
  qa3: (ctx) =>
    ctx.workoutCount > 0
      ? `All-time: ${ctx.workoutCount} workouts${ctx.weightCurrent > 0 ? `, current weight ${ctx.weightCurrent.toFixed(1)} kg (${ctx.weightDeltaLabel})` : ''}. Making progress on "${ctx.goal}" — keep it up.`
      : 'Not enough data yet — finish a couple of workouts and log your weight in Progress, then I can give a real analysis.',
}

export function buildQuickActionReply(actionId: string, ctx: AiContext, lang: Lang = 'ru'): string {
  const table = lang === 'en' ? QUICK_ACTION_EN : QUICK_ACTION_RU
  return table[actionId]?.(ctx) ?? DEFAULT_REPLY[lang](ctx)
}
