import { type ReactNode } from 'react'

type Tone = 'lime' | 'neutral' | 'muted'

const toneClasses: Record<Tone, string> = {
  lime: 'bg-lime/12 text-lime border-lime/25',
  neutral: 'bg-white/8 text-white border-white/12',
  muted: 'bg-white/5 text-muted border-white/8',
}

export function Badge({
  tone = 'neutral',
  icon,
  children,
  className = '',
}: {
  tone?: Tone
  icon?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${toneClasses[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}
