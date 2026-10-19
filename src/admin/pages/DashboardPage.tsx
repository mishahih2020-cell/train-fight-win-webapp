import { useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { bonusLedgerRepo, coursesRepo, ordersRepo, promoCodesRepo, weightRepo, workoutLogRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'

export function DashboardPage() {
  const { items: orders, loaded: ordersLoaded, error: ordersError, reload: reloadOrders } = useRepoList(ordersRepo)
  const { items: courses, loaded: coursesLoaded, error: coursesError, reload: reloadCourses } = useRepoList(coursesRepo)
  const { items: workoutLog, loaded: workoutLogLoaded, error: workoutLogError, reload: reloadWorkoutLog } = useRepoList(workoutLogRepo)
  const { items: bonusLedger, loaded: bonusLoaded, error: bonusError, reload: reloadBonus } = useRepoList(bonusLedgerRepo)
  const { items: promoCodes, loaded: promoLoaded, error: promoError, reload: reloadPromo } = useRepoList(promoCodesRepo)
  const { items: weightEntries, loaded: weightLoaded, error: weightError, reload: reloadWeight } = useRepoList(weightRepo)

  const allLoaded = ordersLoaded && coursesLoaded && workoutLogLoaded && bonusLoaded && promoLoaded && weightLoaded
  const anyError = ordersError || coursesError || workoutLogError || bonusError || promoError || weightError
  const reloadAll = () => {
    reloadOrders()
    reloadCourses()
    reloadWorkoutLog()
    reloadBonus()
    reloadPromo()
    reloadWeight()
  }

  const revenue = useMemo(() => orders.reduce((sum, o) => sum + o.amount, 0), [orders])
  const bonusBalance = useMemo(() => bonusLedger.reduce((sum, e) => sum + e.amount, 0), [bonusLedger])

  if (!allLoaded) return null

  if (anyError) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-accent)] bg-[var(--color-card)] p-4 text-center">
        <p className="text-body-secondary text-[var(--color-text)]">Не получилось загрузить данные дашборда.</p>
        <button onClick={reloadAll} className="text-caption mt-2 font-medium text-[var(--color-accent)] underline underline-offset-4">
          Повторить
        </button>
      </div>
    )
  }

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
