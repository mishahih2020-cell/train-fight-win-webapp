import { User } from 'lucide-react'

/** `src` omitted keeps the placeholder icon; pass it once a real photo exists. */
export function Avatar({ size = 40, src }: { size?: number; src?: string }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-divider)] bg-[linear-gradient(155deg,#232327_0%,#151517_100%)]"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <User className="text-[var(--color-text-tertiary)]" style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={1.5} />
      )}
    </div>
  )
}
