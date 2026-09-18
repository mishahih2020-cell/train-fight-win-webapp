import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  variant?: 'ghost' | 'solid'
}

export function IconButton({ icon, variant = 'ghost', className = '', ...props }: IconButtonProps) {
  return (
    <button
      className={`press flex h-10 w-10 shrink-0 items-center justify-center rounded-pill ${
        variant === 'ghost' ? 'bg-white/8 text-white backdrop-blur-sm' : 'bg-graphite border border-border text-white'
      } ${className}`}
      {...props}
    >
      {icon}
    </button>
  )
}
