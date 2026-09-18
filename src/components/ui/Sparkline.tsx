export function Sparkline({
  values,
  height = 56,
  showDots = false,
}: {
  values: number[]
  height?: number
  showDots?: boolean
}) {
  if (values.length < 2) {
    return (
      <div className="flex items-center justify-center text-[11px] text-muted-2" style={{ height }}>
        Недостаточно данных
      </div>
    )
  }

  const width = 100
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const padY = 6

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = padY + (1 - (v - min) / range) * (height - padY * 2)
    return { x, y }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c6ff45" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#c6ff45" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparklineFill)" stroke="none" />
      <path d={linePath} fill="none" stroke="#c6ff45" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {showDots &&
        points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="1.6" fill="#c6ff45" />)}
    </svg>
  )
}
