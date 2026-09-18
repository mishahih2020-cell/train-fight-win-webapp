import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function Modal({
  open,
  onClose,
  children,
  dismissible = true,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  dismissible?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in sm:items-center">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={dismissible ? onClose : undefined}
      />
      <div className="relative w-full max-w-[560px] animate-slide-up">
        <div className="safe-bottom relative mx-3 mb-3 overflow-hidden rounded-xl border border-border-strong bg-bg-elevated px-6 pb-6 pt-5 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
          {dismissible && (
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="press absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-pill bg-white/8 text-white"
            >
              <X size={18} />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
