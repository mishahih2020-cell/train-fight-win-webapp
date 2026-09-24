export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-divider)] ${className}`}>
      <div
        className="gradient-accent h-full rounded-[var(--radius-pill)] transition-[width] duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

/** Segmented step indicator used on Onboarding/Profile-setup/Create-workout headers. */
export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-[var(--radius-pill)] ${i < step ? 'gradient-accent' : 'bg-[var(--color-divider)]'}`}
        />
      ))}
    </div>
  )
}
