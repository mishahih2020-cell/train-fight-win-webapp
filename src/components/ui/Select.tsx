import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'

export type SelectOption = string | { value: string; label: string }

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
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
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value
            const text = typeof opt === 'string' ? opt : opt.label
            return (
              <option key={value} value={value} className="bg-[var(--color-card)]">
                {text}
              </option>
            )
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-[var(--color-text-secondary)]" />
      </div>
    </label>
  )
}
