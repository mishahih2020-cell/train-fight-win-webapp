import type { ButtonHTMLAttributes, MouseEvent } from 'react'
import { haptic } from '@/lib/haptics'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number
  variant?: 'card' | 'ghost' | 'accent'
}

const VARIANT_CLASSES: Record<NonNullable<IconButtonProps['variant']>, string> = {
  card: 'bg-[var(--color-card)] border border-[var(--color-divider)] text-[var(--color-text)]',
  ghost: 'bg-transparent text-[var(--color-text)]',
  accent: 'gradient-accent text-white',
}

export function IconButton({ size = 40, variant = 'card', className = '', children, onClick, ...rest }: IconButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    haptic('light')
    onClick?.(e)
  }

  return (
    <button
      className={`press flex shrink-0 items-center justify-center rounded-full ${VARIANT_CLASSES[variant]} ${className}`}
      style={{ width: size, height: size }}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  )
}
