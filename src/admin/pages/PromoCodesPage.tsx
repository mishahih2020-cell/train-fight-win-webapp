import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDeleteButton } from '@/components/ui/ConfirmDeleteButton'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { promoCodesRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'

function clampDiscount(n: number) {
  if (Number.isNaN(n)) return 1
  return Math.min(100, Math.max(1, Math.round(n)))
}

export function PromoCodesPage() {
  const { items: codes, loaded, error, reload } = useRepoList(promoCodesRepo)
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(10)
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  const add = async () => {
    const id = code.trim().toUpperCase()
    if (!id || saving) return
    setSaving(true)
    try {
      const exists = codes.some((c) => c.id === id)
      if (exists) {
        await promoCodesRepo.update(id, { discountPercent: discount, active: true })
        setNotice(`Код ${id} уже был — обновил скидку`)
      } else {
        await promoCodesRepo.add({ id, discountPercent: discount, active: true })
        setNotice('')
      }
      setCode('')
      setDiscount(10)
      reload()
    } catch {
      setNotice('Не получилось сохранить промокод — попробуй ещё раз')
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (id: string, active: boolean) => {
    await promoCodesRepo.update(id, { active })
    reload()
  }

  const remove = async (id: string) => {
    await promoCodesRepo.remove(id)
    reload()
  }

  if (!loaded) return null

  if (error) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-accent)] bg-[var(--color-card)] p-4 text-center">
        <p className="text-body-secondary text-[var(--color-text)]">Не получилось загрузить промокоды.</p>
        <button onClick={reload} className="text-caption mt-2 font-medium text-[var(--color-accent)] underline underline-offset-4">
          Повторить
        </button>
      </div>
    )
  }

  return (
    <div>
      <Card className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label="Код"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="MARAT10"
          />
        </div>
        <div className="w-24">
          <Input
            label="% скидки"
            type="number"
            min={1}
            max={100}
            value={discount}
            onChange={(e) => setDiscount(clampDiscount(Number(e.target.value)))}
          />
        </div>
        <Button variant="secondary" fullWidth={false} disabled={saving || !code.trim()} icon={<Plus className="h-4 w-4" />} onClick={add}>
          Добавить
        </Button>
      </Card>
      {notice && <p className="text-caption mt-2 text-[var(--color-text-tertiary)]">{notice}</p>}

      <div className="mt-4 flex flex-col gap-2.5">
        {codes.map((c) => (
          <Card key={c.id} className="flex items-center justify-between">
            <div>
              <div className="text-body-secondary font-semibold text-[var(--color-text)]">{c.id}</div>
              <div className="text-caption text-[var(--color-text-secondary)]">−{c.discountPercent}%</div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={c.active} onChange={(v) => toggle(c.id, v)} />
              <ConfirmDeleteButton label="Удалить промокод" onConfirm={() => remove(c.id)} />
            </div>
          </Card>
        ))}
        {codes.length === 0 && (
          <p className="text-body-secondary text-center text-[var(--color-text-secondary)]">Промокодов пока нет</p>
        )}
      </div>
    </div>
  )
}
