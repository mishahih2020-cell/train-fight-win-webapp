import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'lg' | 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  icon?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-lime text-bg hover:bg-lime-dim',
  secondary: 'bg-transparent text-white border border-border-strong',
  ghost: 'bg-graphite text-white border border-border',
  danger: 'bg-transparent text-red border border-red/30',
}

const sizeClasses: Record<Size, string> = {
  lg: 'h-14 px-6 text-[15px]',
  md: 'h-12 px-5 text-[14px]',
  sm: 'h-10 px-4 text-[13px]',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  icon,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`press inline-flex items-center justify-center gap-2 rounded-pill font-extrabold tracking-tight disabled:opacity-40 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
