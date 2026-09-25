import { useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { bonusLedgerRepo, coursesRepo, ordersRepo, promoCodesRepo, weightRepo, workoutLogRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'

export function DashboardPage() {
  const { items: orders } = useRepoList(ordersRepo)
  const { items: courses } = useRepoList(coursesRepo)
  const { items: workoutLog } = useRepoList(workoutLogRepo)
  const { items: bonusLedger } = useRepoList(bonusLedgerRepo)
  const { items: promoCodes } = useRepoList(promoCodesRepo)
  const { items: weightEntries } = useRepoList(weightRepo)

  const revenue = useMemo(() => orders.reduce((sum, o) => sum + o.amount, 0), [orders])
  const bonusBalance = useMemo(() => bonusLedger.reduce((sum, e) => sum + e.amount, 0), [bonusLedger])

  const stats = [
    { label: 'Заказов', value: orders.length },
    { label: 'Выручка (тест)', value: `${revenue.toLocaleString('ru-RU')} ₽` },
    { label: 'Курсов в каталоге', value: courses.length },
    { label: 'Тренировок в истории', value: workoutLog.length },
    { label: 'Измерений веса', value: weightEntries.length },
    { label: 'Активных промокодов', value: promoCodes.filter((p) => p.active).length },
    { label: 'Баланс бонусов', value: bonusBalance },
  ]

  return (
    <div>
      <p className="text-caption mb-4 rounded-[var(--radius-button)] bg-[var(--color-card-2)] p-3 text-[var(--color-text-tertiary)]">
        Данные только с этого устройства (localStorage) — это не сводная статистика по всем пользователям. Она
        появится после переноса на сервер.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="text-caption text-[var(--color-text-secondary)]">{s.label}</div>
            <div className="text-h2 mt-1 text-[var(--color-text)]">{s.value}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
