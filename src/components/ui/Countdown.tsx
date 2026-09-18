import { pad2, useCountdown } from '@/hooks/useCountdown'

const UNITS = ['ДНИ', 'ЧАСЫ', 'МИНУТЫ', 'СЕКУНДЫ']

export function Countdown({ targetIso }: { targetIso: string }) {
  const { days, hours, minutes, seconds, isOver } = useCountdown(targetIso)

  if (isOver) {
    return (
      <div className="rounded-md border border-lime/25 bg-lime/10 px-4 py-3 text-center text-[13px] font-bold text-lime">
        Турнир уже начался
      </div>
    )
  }

  const values = [pad2(days), pad2(hours), pad2(minutes), pad2(seconds)]

  return (
    <div>
      <div className="flex items-center justify-center gap-1.5">
        {values.map((value, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="min-w-[42px] rounded-sm bg-white/8 px-1.5 py-1.5 text-center text-[20px] font-extrabold tabular-nums text-white">
              {value}
            </span>
            {i < values.length - 1 && <span className="text-[16px] font-extrabold text-muted-2">:</span>}
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-center gap-1.5">
        {UNITS.map((u, i) => (
          <span
            key={u}
            className={`text-center text-[9px] font-bold tracking-wide text-muted-2 ${i < UNITS.length - 1 ? 'mr-[9px]' : ''}`}
            style={{ width: 42 }}
          >
            {u}
          </span>
        ))}
      </div>
    </div>
  )
}
