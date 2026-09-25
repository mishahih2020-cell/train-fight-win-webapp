import { User } from 'lucide-react'
import { useState } from 'react'

/** `src` omitted (or failing to load) keeps the placeholder icon. */
export function Avatar({ size = 40, src }: { size?: number; src?: string }) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-divider)] bg-[linear-gradient(155deg,#232327_0%,#151517_100%)]"
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <User className="text-[var(--color-text-tertiary)]" style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={1.5} />
      )}
    </div>
  )
}
