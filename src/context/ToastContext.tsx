import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Zap } from 'lucide-react'

interface ToastItem {
  id: number
  message: string
}

interface ToastContextValue {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const showToast = useCallback((message: string) => {
    const id = counter.current++
    setToasts((prev) => [...prev, { id, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4 pt-[max(16px,env(safe-area-inset-top))]">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="animate-slide-up flex items-center gap-2 rounded-pill border border-lime/30 bg-bg-elevated/95 px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur"
            >
              <Zap size={14} className="text-lime" fill="currentColor" />
              {toast.message}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
