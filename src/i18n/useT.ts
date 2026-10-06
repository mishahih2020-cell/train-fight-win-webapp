import { useAppState } from '@/context/AppStateContext'
import { translations, type TranslationKey } from './translations'

function interpolate(str: string, vars?: Record<string, string | number>) {
  if (!vars) return str
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), str)
}

/** `forms` is a "one|few|many" string from the dictionary (Russian needs all three; English reuses "many" for both plural cases). */
function pluralForm(lang: 'ru' | 'en', n: number, forms: string) {
  const [one, few, many] = forms.split('|')
  if (lang === 'en') return n === 1 ? one : (many ?? few ?? one)
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few ?? one
  return many ?? few ?? one
}

export function useT() {
  const { language } = useAppState()

  const t = (key: TranslationKey, vars?: Record<string, string | number>) =>
    interpolate(translations[language][key] ?? translations.ru[key] ?? key, vars)

  /** For a pipe-form key ("раунд|раунда|раундов"), returns "{count} {correct form}". */
  const tn = (key: TranslationKey, count: number) =>
    `${count} ${pluralForm(language, count, translations[language][key] ?? translations.ru[key])}`

  return { t, tn, language }
}
