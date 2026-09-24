interface TabsProps<T extends string> {
  options: T[]
  value: T
  onChange: (value: T) => void
}

export function Tabs<T extends string>({ options, value, onChange }: TabsProps<T>) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = opt === value
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`press text-body-secondary h-9 rounded-[var(--radius-button)] px-4 font-semibold transition-colors ${
              active
                ? 'gradient-accent text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text-secondary)] border border-[var(--color-divider)]'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export function Chips<T extends string>({ options, value, onChange }: TabsProps<T>) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">
      {options.map((opt) => {
        const active = opt === value
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`press text-body-secondary h-8 shrink-0 rounded-[var(--radius-pill)] px-3.5 font-medium transition-colors ${
              active
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text-secondary)] border border-[var(--color-divider)]'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
