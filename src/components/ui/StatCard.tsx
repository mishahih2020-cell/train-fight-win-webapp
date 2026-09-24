import type { ReactNode } from 'react'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  subColor?: string
  icon?: ReactNode
  children?: ReactNode
}

export function StatCard({ label, value, sub, subColor = 'var(--color-success)', icon, children }: StatCardProps) {
  return (
    <Card className="flex min-h-[100px] flex-col justify-between gap-2">
      <div className="flex items-center justify-between">
        <span className="text-caption text-[var(--color-text-secondary)]">{label}</span>
        {icon}
      </div>
      <div>
        <div className="text-h2 text-[var(--color-text)]">{value}</div>
        {sub && (
          <div className="text-caption mt-0.5 font-medium" style={{ color: subColor }}>
            {sub}
          </div>
        )}
      </div>
      {children}
    </Card>
  )
}
