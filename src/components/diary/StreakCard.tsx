import { Flame } from 'lucide-react'

const DAY_LABELS = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В']

function pluralDays(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'день'
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'дня'
  return 'дней'
}

export function StreakCard({ streak, last7Days }: { streak: number; last7Days: boolean[] }) {
  const today = new Date().getDay() // 0=Sun..6=Sat
  const todayIndex = today === 0 ? 6 : today - 1 // align to Mon..Sun label order

  return (
    <div className="rounded-lg border border-lime/20 bg-gradient-to-br from-lime/10 via-graphite to-graphite p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-lime/12 text-lime">
          <Flame size={24} fill={streak > 0 ? 'currentColor' : 'none'} />
        </div>
        <div>
          <p className="text-[22px] font-extrabold leading-none text-white">
            {streak} {pluralDays(streak)}
          </p>
          <p className="mt-1 text-[12px] text-muted">
            {streak > 0 ? 'Серия тренировок подряд' : 'Начни серию — тренируйся сегодня'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between gap-1.5">
        {last7Days.map((active, i) => {
          const dayOffset = i - 6 // i=6 is today
          const labelIndex = ((todayIndex + dayOffset) % 7 + 7) % 7
          const isToday = dayOffset === 0
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-pill text-[11px] font-bold ${
                  active
                    ? 'bg-lime text-bg'
                    : isToday
                      ? 'border border-lime/40 text-lime'
                      : 'border border-border-strong text-muted-2'
                }`}
              >
                {active ? <Flame size={14} fill="currentColor" /> : DAY_LABELS[labelIndex]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
