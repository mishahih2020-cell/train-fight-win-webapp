import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'gradient-accent text-white',
  secondary: 'bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-divider)]',
  outline: 'bg-transparent text-[var(--color-accent)] border border-[var(--color-accent)]',
  ghost: 'bg-transparent text-[var(--color-text-secondary)]',
}

export function Button({
  variant = 'primary',
  icon,
  fullWidth = true,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`press text-button flex h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] ${VARIANT_CLASSES[variant]} ${fullWidth ? 'w-full' : 'px-6'} disabled:opacity-50 ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
