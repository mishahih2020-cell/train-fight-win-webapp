import { useEffect, useRef, useState } from 'react'

export type RoundPhase = 'prep' | 'round' | 'rest' | 'done'

export interface RoundTimerConfig {
  rounds: number
  roundSec: number
  restSec: number
  /** Countdown before round 1 so you can get into position. Defaults to 10s. */
  prepSec?: number
}

export interface RoundTimerEvents {
  onRoundStart?: () => void
  onRestStart?: () => void
  /** Fires once, ~10 seconds before a round ends. */
  onWarning?: () => void
  onComplete?: () => void
}

interface Phase {
  phase: RoundPhase
  roundIndex: number // 0-based
  secondsLeft: number
}

function nextPhase(state: Phase, cfg: Required<RoundTimerConfig>): Phase {
  if (state.phase === 'prep') return { phase: 'round', roundIndex: 0, secondsLeft: cfg.roundSec }
  if (state.phase === 'round') {
    return state.roundIndex >= cfg.rounds - 1
      ? { phase: 'done', roundIndex: state.roundIndex, secondsLeft: 0 }
      : { phase: 'rest', roundIndex: state.roundIndex, secondsLeft: cfg.restSec }
  }
  if (state.phase === 'rest') return { phase: 'round', roundIndex: state.roundIndex + 1, secondsLeft: cfg.roundSec }
  return state
}

function prevPhase(state: Phase, cfg: Required<RoundTimerConfig>): Phase {
  if (state.phase === 'round') {
    return state.roundIndex === 0 ? state : { phase: 'round', roundIndex: state.roundIndex - 1, secondsLeft: cfg.roundSec }
  }
  if (state.phase === 'rest') return { phase: 'round', roundIndex: state.roundIndex, secondsLeft: cfg.roundSec }
  return state
}

/**
 * Drives a boxing-style round/rest countdown: prep → round → rest → round →
 * ... → done, auto-advancing every second. `config` is captured once, on
 * mount — a live session's round count/lengths don't change mid-workout.
 */
export function useRoundTimer(config: RoundTimerConfig, events: RoundTimerEvents = {}) {
  const cfgRef = useRef<Required<RoundTimerConfig>>({ prepSec: 10, ...config })
  const eventsRef = useRef(events)
  eventsRef.current = events

  const [state, setState] = useState<Phase>({ phase: 'prep', roundIndex: 0, secondsLeft: cfgRef.current.prepSec })
  const [running, setRunning] = useState(true)
  const [elapsedSec, setElapsedSec] = useState(0)
  const runningRef = useRef(running)
  runningRef.current = running
  // Mirrors state.phase so the interval can check "are we done yet" without
  // reading stale state from its own closure or reacting to it as a dep —
  // stops elapsedSec from still climbing while the completion screen is up.
  const phaseRef = useRef(state.phase)
  phaseRef.current = state.phase

  const fireEvents = (phase: RoundPhase) => {
    if (phase === 'round') eventsRef.current.onRoundStart?.()
    else if (phase === 'rest') eventsRef.current.onRestStart?.()
    else if (phase === 'done') eventsRef.current.onComplete?.()
  }

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!runningRef.current || phaseRef.current === 'done') return
      setElapsedSec((s) => s + 1)
      setState((prev) => {
        if (prev.phase === 'done') return prev
        const secondsLeft = prev.secondsLeft - 1
        if (secondsLeft <= 0) {
          const next = nextPhase(prev, cfgRef.current)
          fireEvents(next.phase)
          return next
        }
        if (secondsLeft === 10 && prev.phase === 'round') eventsRef.current.onWarning?.()
        return { ...prev, secondsLeft }
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return {
    phase: state.phase,
    roundIndex: state.roundIndex,
    secondsLeft: state.secondsLeft,
    rounds: cfgRef.current.rounds,
    roundSec: cfgRef.current.roundSec,
    restSec: cfgRef.current.restSec,
    elapsedSec,
    running,
    toggleRunning: () => setRunning((r) => !r),
    skipNext: () =>
      setState((prev) => {
        const next = nextPhase(prev, cfgRef.current)
        fireEvents(next.phase)
        return next
      }),
    skipPrev: () => setState((prev) => prevPhase(prev, cfgRef.current)),
    canSkipPrev: state.phase === 'rest' || (state.phase === 'round' && state.roundIndex > 0),
    canSkipNext: state.phase !== 'done',
  }
}
