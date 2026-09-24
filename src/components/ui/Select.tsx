import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: string[]
}

export function Select({ label, options, className = '', ...rest }: SelectProps) {
  return (
    <label className="block">
      {label && <span className="text-body-secondary mb-2 block text-[var(--color-text-secondary)]">{label}</span>}
      <div className="relative flex h-12 items-center rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4">
        <select
          className={`text-body h-full w-full appearance-none bg-transparent pr-6 text-[var(--color-text)] outline-none ${className}`}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[var(--color-card)]">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-[var(--color-text-secondary)]" />
      </div>
    </label>
  )
}
