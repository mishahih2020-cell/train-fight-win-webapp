import { User } from 'lucide-react'

export function Avatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-divider)] bg-[linear-gradient(155deg,#232327_0%,#151517_100%)]"
      style={{ width: size, height: size }}
    >
      <User className="text-[var(--color-text-tertiary)]" style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={1.5} />
    </div>
  )
}
