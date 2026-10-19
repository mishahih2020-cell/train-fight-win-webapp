import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDeleteButton } from '@/components/ui/ConfirmDeleteButton'
import { Input } from '@/components/ui/Input'
import { awardBonus, bonusLedgerRepo, wheelSegmentsRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'

export function BonusesPage() {
  const { items: ledger, loaded: ledgerLoaded, error: ledgerError, reload: reloadLedger } = useRepoList(bonusLedgerRepo)
  const { items: segments, loaded: segmentsLoaded, error: segmentsError, reload: reloadSegments } = useRepoList(wheelSegmentsRepo)
  const [amount, setAmount] = useState(50)
  const [reason, setReason] = useState('Начислено вручную')
  const [newSegment, setNewSegment] = useState('')
  const [awarding, setAwarding] = useState(false)
  const [addingSegment, setAddingSegment] = useState(false)

  const balance = useMemo(() => ledger.reduce((sum, e) => sum + e.amount, 0), [ledger])

  const addManual = async () => {
    if (!amount || awarding) return
    setAwarding(true)
    try {
      await awardBonus(amount, reason || 'Начислено вручную')
      reloadLedger()
    } finally {
      setAwarding(false)
    }
  }

  const addSegment = async () => {
    const label = newSegment.trim()
    if (!label || segments.length >= 8 || addingSegment) return
    setAddingSegment(true)
    try {
      await wheelSegmentsRepo.add({
        id: `seg${Date.now()}`,
        label,
        color: segments.length % 2 === 0 ? 'accent' : 'card',
      })
      setNewSegment('')
      reloadSegments()
    } finally {
      setAddingSegment(false)
    }
  }

  const removeSegment = async (id: string) => {
    if (segments.length <= 2) return
    await wheelSegmentsRepo.remove(id)
    reloadSegments()
  }

  if (!ledgerLoaded || !segmentsLoaded) return null

  if (ledgerError || segmentsError) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-accent)] bg-[var(--color-card)] p-4 text-center">
        <p className="text-body-secondary text-[var(--color-text)]">Не получилось загрузить бонусы.</p>
        <button
          onClick={() => {
            reloadLedger()
            reloadSegments()
          }}
          className="text-caption mt-2 font-medium text-[var(--color-accent)] underline underline-offset-4"
        >
          Повторить
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Card>
          <div className="text-caption text-[var(--color-text-secondary)]">Баланс бонусов (это устройство)</div>
          <div className="text-h1 mt-1 text-[var(--color-text)]">{balance}</div>
        </Card>

        <Card className="mt-3 flex items-end gap-2">
          <div className="w-24">
            <Input label="Баллы" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
          <div className="flex-1">
            <Input label="Причина" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button variant="secondary" fullWidth={false} disabled={awarding || !amount} onClick={addManual}>
            Начислить
          </Button>
        </Card>

        <div className="mt-3 flex flex-col gap-2">
          {[...ledger]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 10)
            .map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 py-2.5"
              >
                <div>
                  <div className="text-body-secondary text-[var(--color-text)]">{e.reason}</div>
                  <div className="text-caption text-[var(--color-text-secondary)]">{e.date}</div>
                </div>
                <span className={`text-body-secondary font-semibold ${e.amount >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-accent)]'}`}>
                  {e.amount >= 0 ? '+' : ''}
                  {e.amount}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h2 className="text-h2 mb-3 text-[var(--color-text)]">Колесо фортуны — сегменты</h2>
        <Card className="flex items-end gap-2">
          <div className="flex-1">
            <Input label="Новый приз" value={newSegment} onChange={(e) => setNewSegment(e.target.value)} placeholder="15% скидка" />
          </div>
          <Button
            variant="secondary"
            fullWidth={false}
            icon={<Plus className="h-4 w-4" />}
            disabled={segments.length >= 8 || addingSegment || !newSegment.trim()}
            onClick={addSegment}
          >
            Добавить
          </Button>
        </Card>
        <div className="mt-3 flex flex-col gap-2">
          {segments.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: s.color === 'accent' ? 'var(--color-accent)' : 'var(--color-card-2)' }}
                />
                <span className="text-body-secondary text-[var(--color-text)]">{s.label.replace('\n', ' ')}</span>
              </div>
              <ConfirmDeleteButton
                label="Удалить сегмент"
                disabled={segments.length <= 2}
                onConfirm={() => removeSegment(s.id)}
              />
            </div>
          ))}
        </div>
        <p className="text-caption mt-2 text-[var(--color-text-tertiary)]">От 2 до 8 сегментов — больше не влезет на колесо аккуратно.</p>
      </div>
    </div>
  )
}
