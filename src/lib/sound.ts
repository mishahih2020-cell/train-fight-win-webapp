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

function beep(freq: number, durationSec: number, delaySec = 0, volume = 0.25, type: OscillatorType = 'sine') {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
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

/** Two close, detuned oscillators beating against each other — the harsh
 * "electronic buzzer" timbre of a real boxing round-end horn, not a clean tone. */
function buzz(durationSec: number, volume = 0.3) {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const start = ctx.currentTime
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, start)
    gain.gain.setValueAtTime(volume, start + Math.max(0, durationSec - 0.06))
    gain.gain.exponentialRampToValueAtTime(0.001, start + durationSec)
    gain.connect(ctx.destination)

    for (const freq of [196, 202]) {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = freq
      osc.connect(gain)
      osc.start(start)
      osc.stop(start + durationSec + 0.02)
    }
  } catch {
    // non-critical — a failed buzz shouldn't break the workout
  }
}

/** Round begins — a single, higher "go" tone. */
export function playRoundStart() {
  beep(880, 0.25)
}

/** Round ends — the boxing-bell buzzer. */
export function playRoundEnd() {
  buzz(1.1, 0.3)
}

/** ~10 seconds left in the round — two short blips, the classic boxing-timer warning. */
export function playWarning() {
  beep(660, 0.12)
  beep(660, 0.12, 0.22)
}

/** Last 3 seconds of prep/rest before a round starts — one tick per second. */
export function playCountdownTick() {
  beep(1046, 0.09, 0, 0.22, 'square')
}

/** Workout finished — a short triumphant three-note run. */
export function playComplete() {
  beep(880, 0.15, 0)
  beep(988, 0.15, 0.18)
  beep(1175, 0.35, 0.36)
}
