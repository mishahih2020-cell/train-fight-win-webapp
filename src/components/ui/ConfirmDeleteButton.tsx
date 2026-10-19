import { Check, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const ARM_TIMEOUT_MS = 3000

interface ConfirmDeleteButtonProps {
  onConfirm: () => void
  label?: string
  disabled?: boolean
}

/**
 * A destructive icon button that requires two clicks: the first arms it
 * (trash icon turns into a checkmark for a few seconds), the second
 * actually fires `onConfirm`. Mirrors the arm/confirm pattern already used
 * for "Reset data" in ProfilePage, just compact enough for a list row —
 * same idea (no accidental one-tap data loss), no new interaction model.
 */
export function ConfirmDeleteButton({ onConfirm, label = 'Удалить', disabled }: ConfirmDeleteButtonProps) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const id = setTimeout(() => setArmed(false), ARM_TIMEOUT_MS)
    return () => clearTimeout(id)
  }, [armed])

  return (
    <button
      type="button"
      aria-label={armed ? 'Нажмите ещё раз для подтверждения' : label}
      title={armed ? 'Нажмите ещё раз для подтверждения' : label}
      disabled={disabled}
      onClick={() => {
        if (armed) {
          setArmed(false)
          onConfirm()
        } else {
          setArmed(true)
        }
      }}
      className="press shrink-0 disabled:opacity-50"
    >
      {armed ? (
        <Check className="h-4 w-4 text-[var(--color-success)]" />
      ) : (
        <Trash2 className="h-4 w-4 text-[var(--color-accent)]" />
      )}
    </button>
  )
}
