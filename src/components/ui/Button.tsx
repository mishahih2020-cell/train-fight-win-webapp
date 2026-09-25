import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { haptic } from '@/lib/haptics'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'

type Size = 'default' | 'large'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'gradient-accent text-white',
  secondary: 'bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-divider)]',
  outline: 'bg-transparent text-[var(--color-accent)] border border-[var(--color-accent)]',
  ghost: 'bg-transparent text-[var(--color-text-secondary)]',
}

const SIZE_CLASSES: Record<Size, string> = {
  default: 'h-12 text-button',
  large: 'h-16 text-lg font-bold',
}

export function Button({
  variant = 'primary',
  size = 'default',
  icon,
  fullWidth = true,
  className = '',
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    haptic('light')
    onClick?.(e)
  }

  return (
    <button
      className={`press flex items-center justify-center gap-2 rounded-[var(--radius-button)] ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${fullWidth ? 'w-full' : 'px-6'} disabled:opacity-50 ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
