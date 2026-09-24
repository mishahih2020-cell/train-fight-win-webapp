import type { WeightPoint } from '@/types'

function buildPath(points: WeightPoint[], width: number, height: number, padY = 6) {
  const values = points.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = width / (points.length - 1 || 1)

  const coords = points.map((p, i) => {
    const x = i * stepX
    const y = padY + (height - padY * 2) * (1 - (p.value - min) / range)
    return [x, y] as const
  })

  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`
  return { line, area, coords }
}

/** Full weight-over-time chart used on the Progress screen. */
export function LineChart({ points }: { points: WeightPoint[] }) {
  const width = 328
  const height = 140
  const { line, area, coords } = buildPath(points, width, height)
  const gradientId = 'chart-gradient'

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {coords.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === coords.length - 1 ? 4 : 0}
            fill="var(--color-accent)"
            stroke="var(--color-bg)"
            strokeWidth={2}
          />
        ))}
      </svg>
      <div className="text-caption mt-1 flex justify-between text-[var(--color-text-tertiary)]">
        {points
          .filter((_, i) => i % 2 === 0 || i === points.length - 1)
          .map((p) => (
            <span key={p.date}>{p.date}</span>
          ))}
      </div>
    </div>
  )
}

/** Tiny inline sparkline used inside the Home weight stat card. */
export function Sparkline({ points, positive = true }: { points: WeightPoint[]; positive?: boolean }) {
  const width = 72
  const height = 28
  const { line } = buildPath(points, width, height, 3)
  const color = positive ? 'var(--color-success)' : 'var(--color-accent)'

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-18" preserveAspectRatio="none">
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Circular calorie ring used on Nutrition. */
export function CalorieRing({ current, total, size = 104 }: { current: number; total: number; size?: number }) {
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(1, current / total)
  const offset = circumference * (1 - pct)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--color-divider)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-h2 leading-none text-[var(--color-text)]">{current.toLocaleString('ru-RU')}</span>
        <span className="text-caption mt-1 text-[var(--color-text-secondary)]">/ {total.toLocaleString('ru-RU')}</span>
      </div>
    </div>
  )
}
