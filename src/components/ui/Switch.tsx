export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`press relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        checked ? 'gradient-accent' : 'bg-[var(--color-card-2)] border border-[var(--color-divider)]'
      }`}
    >
      <span
        className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  )
}
