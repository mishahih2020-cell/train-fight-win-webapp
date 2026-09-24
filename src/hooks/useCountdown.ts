import { useEffect, useRef, useState } from 'react'

export function formatClock(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

/** Counts up from 0, pausable. Used for the workout session elapsed timer. */
export function useStopwatch(running: boolean) {
  const [seconds, setSeconds] = useState(0)
  const savedRunning = useRef(running)

  useEffect(() => {
    savedRunning.current = running
  }, [running])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (savedRunning.current) setSeconds((s) => s + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return seconds
}
