import { CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/navigation/Header'
import { AthletePhoto } from '@/components/ui/AthletePhoto'
import { formatPrice } from '@/lib/selectors'
import { useAppState } from '@/context/AppStateContext'

export function PurchaseHistoryPage() {
  const { state } = useAppState()

  return (
    <div className="pb-10">
      <Header title="История покупок" />

      <div className="mt-3 flex flex-col gap-2.5 px-5">
        {state.purchaseHistory.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-md border border-border bg-graphite p-3">
            <AthletePhoto focal="top" fade="none" className="h-12 w-12 shrink-0 rounded-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-white">{item.courseName}</p>
              <p className="mt-0.5 text-[12px] font-bold text-lime">{formatPrice(item.price)}</p>
              <p className="text-[11px] text-muted-2">{item.date}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-lime">
              <CheckCircle2 size={14} />
              Оплачено
            </div>
          </div>
        ))}

        {state.purchaseHistory.length === 0 && (
          <p className="mt-6 text-center text-[13px] text-muted">Покупок пока нет.</p>
        )}
      </div>
    </div>
  )
}
