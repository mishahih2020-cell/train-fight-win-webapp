import { Swords } from 'lucide-react'
import { AthletePhoto } from '@/components/ui/AthletePhoto'
import { Button } from '@/components/ui/Button'
import { Countdown } from '@/components/ui/Countdown'
import { UFC_EVENT_DATE, UFC_EVENT_TITLE } from '@/data/event'
import { useToast } from '@/context/ToastContext'

export function UfcEventBanner() {
  const { showToast } = useToast()

  return (
    <AthletePhoto focal="top-right" fade="both" icon={Swords} className="rounded-lg border border-border">
      <div className="relative px-5 py-6">
        <p className="text-center text-[19px] font-extrabold uppercase tracking-tight text-white">{UFC_EVENT_TITLE}</p>
        <p className="mt-1 text-center text-[12px] font-semibold text-muted">До начала трансляции</p>

        <div className="mt-4">
          <Countdown targetIso={UFC_EVENT_DATE} />
        </div>

        <Button className="mt-5" onClick={() => showToast('Напомним о начале трансляции!')}>
          Смотреть турнир
        </Button>
      </div>
    </AthletePhoto>
  )
}
