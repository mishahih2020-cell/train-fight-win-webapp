import type { ReactNode } from 'react'

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="animate-scale-in card-shadow w-full max-w-[448px] rounded-[var(--radius-card)] border border-[var(--color-divider)] bg-[var(--color-card)] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
