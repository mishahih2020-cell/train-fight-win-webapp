import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  suffix?: string
}

export function Input({ label, suffix, className = '', ...rest }: InputProps) {
  return (
    <label className="block">
      <span className="text-body-secondary mb-2 block text-[var(--color-text-secondary)]">{label}</span>
      <div className="flex h-12 items-center rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4">
        <input
          className={`text-body h-full w-full bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)] ${className}`}
          {...rest}
        />
        {suffix && <span className="text-body-secondary shrink-0 text-[var(--color-text-secondary)]">{suffix}</span>}
      </div>
    </label>
  )
}
