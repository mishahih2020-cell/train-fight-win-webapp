import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export function Card({ interactive, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-graphite ${interactive ? 'press cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
