import { Card } from '@/components/ui/Card'
import { ordersRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'

export function OrdersPage() {
  const { items: orders } = useRepoList(ordersRepo)
  const revenue = orders.reduce((sum, o) => sum + o.amount, 0)

  return (
    <div>
      <Card className="flex items-center justify-between">
        <span className="text-body-secondary text-[var(--color-text-secondary)]">Выручка (тестовые покупки)</span>
        <span className="text-h2 text-[var(--color-text)]">{revenue.toLocaleString('ru-RU')} ₽</span>
      </Card>

      <div className="mt-4 flex flex-col gap-2.5">
        {[...orders]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3"
            >
              <div>
                <div className="text-body-secondary font-semibold text-[var(--color-text)]">{o.courseTitle}</div>
                <div className="text-caption text-[var(--color-text-secondary)]">
                  {o.date} · {o.status === 'paid' ? 'оплачен' : 'бесплатно'}
                </div>
              </div>
              <span className="text-body-secondary font-semibold text-[var(--color-text)]">
                {o.amount > 0 ? `${o.amount.toLocaleString('ru-RU')} ₽` : '—'}
              </span>
            </div>
          ))}
        {orders.length === 0 && <p className="text-body-secondary text-center text-[var(--color-text-secondary)]">Заказов пока нет</p>}
      </div>
    </div>
  )
}
