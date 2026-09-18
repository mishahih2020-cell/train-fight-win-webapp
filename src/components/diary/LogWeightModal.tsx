import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

export function LogWeightModal({
  open,
  onClose,
  onSubmit,
  currentValue,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (value: number) => void
  currentValue?: number
}) {
  const [value, setValue] = useState(currentValue ? String(currentValue) : '')

  const parsed = parseFloat(value.replace(',', '.'))
  const isValid = !Number.isNaN(parsed) && parsed > 20 && parsed < 300

  const handleSubmit = () => {
    if (!isValid) return
    onSubmit(Math.round(parsed * 10) / 10)
    setValue('')
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-[19px] font-extrabold uppercase tracking-tight">Записать вес</h2>
      <p className="mt-1 text-[13px] text-muted">Сегодняшнее значение обновит запись за сегодня.</p>

      <div className="mt-6 flex items-center justify-center gap-2 rounded-md border border-border bg-graphite px-4 py-5">
        <input
          autoFocus
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0.0"
          className="w-28 bg-transparent text-center text-[36px] font-extrabold text-white outline-none placeholder:text-muted-2"
        />
        <span className="text-[18px] font-semibold text-muted">кг</span>
      </div>

      <Button className="mt-6" onClick={handleSubmit} disabled={!isValid}>
        Сохранить
      </Button>
    </Modal>
  )
}
