import { Gift } from 'lucide-react'
import type { WheelSegment } from '@/types'

interface WheelProps {
  segments: WheelSegment[]
  rotation: number
  spinning: boolean
  size?: number
}

export function Wheel({ segments, rotation, spinning, size = 288 }: WheelProps) {
  const segAngle = 360 / segments.length
  const gradientStops = segments
    .map((seg, i) => {
      const from = i * segAngle
      const to = from + segAngle
      const color = seg.color === 'accent' ? 'var(--color-accent)' : 'var(--color-card-2)'
      return `${color} ${from}deg ${to}deg`
    })
    .join(', ')

  const dots = Array.from({ length: 12 })

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* outer glow ring */}
      <div
        className="absolute inset-0 rounded-full border-4"
        style={{ borderColor: 'var(--color-accent)', boxShadow: '0 0 32px 4px rgba(255,30,45,0.35)' }}
      />
      {dots.map((_, i) => {
        const angle = (360 / dots.length) * i
        const r = size / 2
        return (
          <div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-white"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${angle}deg) translate(${r - 3}px) rotate(-${angle}deg)`,
              marginTop: -3,
              marginLeft: -3,
            }}
          />
        )
      })}
      <div
        className="absolute inset-2 overflow-hidden rounded-full"
        style={{
          background: `conic-gradient(${gradientStops})`,
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 4.2s cubic-bezier(0.15,0.65,0.2,1)' : undefined,
        }}
      >
        {segments.map((seg, i) => {
          const mid = i * segAngle + segAngle / 2
          const lines = seg.label.split('\n')
          // Keep each label legible: radiating text upside-down on the
          // bottom half of the wheel is unreadable, so segments past the
          // 3-9 o'clock line get an extra 180° to stay right-side up.
          const upright = mid > 90 && mid < 270 ? mid + 180 : mid
          return (
            <div
              key={seg.id}
              className="absolute top-1/2 left-1/2 flex w-20 flex-col items-center text-center"
              style={{ transform: `rotate(${mid}deg) translateY(-${size / 2 - 44}px) rotate(${upright - mid}deg)`, marginLeft: -40 }}
            >
              {lines.map((line) => (
                <span key={line} className="text-caption leading-tight font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">
                  {line}
                </span>
              ))}
            </div>
          )
        })}
      </div>
      <div
        className="gradient-accent absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[var(--color-bg)]"
        style={{ boxShadow: '0 0 20px 2px rgba(255,30,45,0.5)' }}
      >
        <Gift className="h-7 w-7 text-white" strokeWidth={1.75} />
      </div>
      {/* pointer — a narrow downward triangle so it clearly singles out one
          segment under its tip, rather than a chunky diamond that reads as
          straddling two segments. */}
      <div
        className="absolute top-1 left-1/2 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '9px solid transparent',
          borderRight: '9px solid transparent',
          borderTop: '18px solid var(--color-accent)',
          filter: 'drop-shadow(0 0 4px rgba(255,30,45,0.6))',
        }}
      />
    </div>
  )
}
