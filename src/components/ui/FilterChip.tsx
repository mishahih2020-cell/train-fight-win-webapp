export function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`press shrink-0 rounded-pill border px-4 py-2 text-[13px] font-bold transition-colors ${
        active ? 'border-lime bg-lime text-bg' : 'border-border-strong bg-transparent text-muted'
      }`}
    >
      {label}
    </button>
  )
}
