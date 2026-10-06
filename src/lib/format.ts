import type { Lang } from '@/i18n/translations'

/** Rubles are the only currency here regardless of UI language — just the thousands-separator locale adapts. */
export function formatRub(amount: number, lang: Lang = 'ru') {
  return `${amount.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU')} ₽`
}
