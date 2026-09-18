import { Crown, Flag, Flame, Medal, TrendingUp, Swords } from 'lucide-react'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Achievement } from '@/types'

const iconMap: Record<Achievement['icon'], typeof Flag> = {
  flag: Flag,
  flame: Flame,
  fighter: Swords,
  trending: TrendingUp,
  crown: Crown,
  medal: Medal,
}

export function AchievementCard({
  achievement,
  progress,
  unlocked,
}: {
  achievement: Achievement
  progress: number
  unlocked: boolean
}) {
  const Icon = iconMap[achievement.icon]

  return (
    <div
      className={`flex flex-col gap-2.5 rounded-md border p-3.5 ${
        unlocked ? 'border-lime/25 bg-lime/6' : 'border-border bg-graphite'
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-pill ${
          unlocked ? 'bg-lime/12 text-lime' : 'bg-white/6 text-muted-2'
        }`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className={`text-[13px] font-extrabold ${unlocked ? 'text-white' : 'text-muted'}`}>{achievement.title}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-muted-2">{achievement.description}</p>
      </div>
      <div>
        <ProgressBar value={progress} max={achievement.total} />
        <p className="mt-1 text-right text-[10px] font-bold text-muted-2">
          {progress}/{achievement.total}
        </p>
      </div>
    </div>
  )
}
