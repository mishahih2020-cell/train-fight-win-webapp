export function ProgressBar({
  value,
  max,
  className = '',
  trackClassName = '',
  glow = false,
}: {
  value: number
  max: number
  className?: string
  trackClassName?: string
  glow?: boolean
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-pill bg-white/8 ${trackClassName}`}>
      <div
        className={`h-full rounded-pill bg-lime transition-[width] duration-500 ease-out ${glow ? 'shadow-[0_0_12px_var(--color-lime)]' : ''} ${className}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
