let audioCtx: AudioContext | null = null

function getCtx() {
  if (!audioCtx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    audioCtx = new Ctor()
  }
  return audioCtx
}

/**
 * Call from an actual click handler (a "Начать тренировку" button) before
 * navigating into the session screen. Browsers block audio until it's been
 * unlocked by a direct user gesture, and by the time the round timer wants
 * to beep we're several ticks and a route change removed from any click —
 * priming the (module-level, SPA-persistent) AudioContext here means it's
 * already unlocked by the time the timer needs it.
 */
export function primeAudio() {
  try {
    getCtx()?.resume()
  } catch {
    // Web Audio unsupported/blocked — sounds just won't play
  }
}

function beep(freq: number, durationSec: number, delaySec = 0, volume = 0.25) {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    const start = ctx.currentTime + delaySec
    gain.gain.setValueAtTime(volume, start)
    gain.gain.exponentialRampToValueAtTime(0.001, start + durationSec)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(start)
    osc.stop(start + durationSec + 0.02)
  } catch {
    // non-critical — a failed beep shouldn't break the workout
  }
}

/** Round begins — a single, higher "go" tone. */
export function playRoundStart() {
  beep(880, 0.25)
}

/** Round ends, rest begins — a single, lower tone. */
export function playRestStart() {
  beep(440, 0.4)
}

/** ~10 seconds left in the round — two short blips, the classic boxing-timer warning. */
export function playWarning() {
  beep(660, 0.12)
  beep(660, 0.12, 0.22)
}

/** Workout finished — a short triumphant three-note run. */
export function playComplete() {
  beep(880, 0.15, 0)
  beep(988, 0.15, 0.18)
  beep(1175, 0.35, 0.36)
}
