import { useEffect, useRef, useState } from 'react'
import { wheelSegments } from '@/data/wheel'

const SEGMENT_ANGLE = 360 / wheelSegments.length

export function Wheel({
  spinning,
  targetSegmentId,
  onSpinEnd,
  onSpinRequest,
  disabled,
}: {
  spinning: boolean
  targetSegmentId: string | null
  onSpinEnd: () => void
  onSpinRequest: () => void
  disabled: boolean
}) {
  const [rotation, setRotation] = useState(0)
  const wasSpinning = useRef(false)

  useEffect(() => {
    if (spinning && targetSegmentId && !wasSpinning.current) {
      const index = wheelSegments.findIndex((s) => s.id === targetSegmentId)
      const targetAngle = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
      const currentMod = ((rotation % 360) + 360) % 360
      const offset = (((360 - targetAngle - currentMod) % 360) + 360) % 360
      setRotation((prev) => prev + 5 * 360 + offset)
    }
    wasSpinning.current = spinning
  }, [spinning, targetSegmentId, rotation])

  return (
    <div className="relative mx-auto aspect-square w-[280px]">
      <div className="absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
        <div className="h-4 w-4 rotate-45 border-b border-r border-lime bg-lime shadow-[0_0_14px_rgba(198,255,69,0.6)]" />
      </div>

      <svg
        viewBox="0 0 280 280"
        className="absolute inset-0"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 3.2s cubic-bezier(0.12, 0.72, 0.15, 1)' : 'none',
        }}
        onTransitionEnd={() => spinning && onSpinEnd()}
      >
        <circle cx="140" cy="140" r="136" fill="#0d1211" stroke="rgba(198,255,69,0.25)" strokeWidth="2" />
        {wheelSegments.map((segment, i) => {
          const startAngle = i * SEGMENT_ANGLE - 90
          const endAngle = startAngle + SEGMENT_ANGLE
          const start = polar(140, 140, 132, startAngle)
          const end = polar(140, 140, 132, endAngle)
          const midAngle = startAngle + SEGMENT_ANGLE / 2
          const textPos = polar(140, 140, 88, midAngle)

          return (
            <g key={segment.id}>
              <path
                d={`M140,140 L${start.x},${start.y} A132,132 0 0,1 ${end.x},${end.y} Z`}
                fill={i % 2 === 0 ? '#121816' : '#0a0e0d'}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <text
                x={textPos.x}
                y={textPos.y}
                fill="#c6ff45"
                fontSize="10.5"
                fontWeight="800"
                textAnchor="middle"
                transform={`rotate(${midAngle + 90}, ${textPos.x}, ${textPos.y})`}
              >
                {segment.label}
              </text>
            </g>
          )
        })}
        <circle cx="140" cy="140" r="46" fill="#050706" stroke="rgba(198,255,69,0.35)" strokeWidth="1.5" />
      </svg>

      <button
        onClick={onSpinRequest}
        disabled={disabled}
        className="press absolute left-1/2 top-1/2 z-10 flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-lime text-[13px] font-extrabold uppercase tracking-tight text-bg shadow-[0_0_28px_rgba(198,255,69,0.4)] disabled:opacity-50"
      >
        Крутить
      </button>
    </div>
  )
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}
