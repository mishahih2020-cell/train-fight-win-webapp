type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'

/** No-ops outside Telegram (desktop browser, older clients without HapticFeedback). */
export function haptic(style: ImpactStyle = 'light') {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style)
  } catch {
    // unsupported on this client — ignore
  }
}

export function hapticSelect() {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged()
  } catch {
    // unsupported on this client — ignore
  }
}
