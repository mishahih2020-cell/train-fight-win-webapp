import { useEffect, useState } from 'react'

export interface CountdownValue {
  days: number
  hours: number
  minutes: number
  seconds: number
  isOver: boolean
}

function diffToCountdown(diffMs: number): CountdownValue {
  if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true }
  const totalSeconds = Math.floor(diffMs / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isOver: false,
  }
}

export function useCountdown(targetIso: string): CountdownValue {
  const target = new Date(targetIso).getTime()
  const [value, setValue] = useState<CountdownValue>(() => diffToCountdown(target - Date.now()))

  useEffect(() => {
    const tick = () => setValue(diffToCountdown(target - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [target])

  return value
}

export function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}
