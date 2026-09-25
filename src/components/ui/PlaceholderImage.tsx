import { User } from 'lucide-react'
import { useState } from 'react'

interface PlaceholderImageProps {
  className?: string
  rounded?: string
  darken?: boolean
  compact?: boolean
  /** Real photo URL (e.g. `/photos/hero.jpg`). Omit to keep the placeholder. */
  src?: string
}

/**
 * Fills the exact area a real photo of Marat will occupy later. Keeps
 * proportions/position/rounding/darkening intact so swapping in real
 * assets is a drop-in replacement, not a relayout — just pass `src`.
 * Falls back to the placeholder if the file 404s or fails to decode,
 * instead of showing the browser's broken-image icon.
 */
export function PlaceholderImage({
  className = '',
  rounded = 'rounded-[var(--radius-card)]',
  darken = false,
  compact = false,
  src,
}: PlaceholderImageProps) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[linear-gradient(155deg,#232327_0%,#151517_100%)] ${rounded} ${className}`}
    >
      {showImage ? (
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <div className="flex flex-col items-center gap-1.5 px-2 text-center">
          <User className={compact ? 'h-4 w-4 text-[var(--color-text-tertiary)]' : 'h-6 w-6 text-[var(--color-text-tertiary)]'} strokeWidth={1.5} />
          {!compact && (
            <span className="text-caption font-medium tracking-tight text-[var(--color-text-tertiary)]">
              ЗДЕСЬ БУДЕТ ФОТО МАРАТА
            </span>
          )}
        </div>
      )}
      {darken && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />}
    </div>
  )
}
