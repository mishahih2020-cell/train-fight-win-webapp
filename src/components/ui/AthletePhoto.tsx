import type { CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

type Focal = 'top' | 'center' | 'bottom' | 'top-right'
type Fade = 'bottom' | 'top' | 'both' | 'none'

const focalPosition: Record<Focal, string> = {
  top: '50% 15%',
  center: '50% 50%',
  bottom: '50% 85%',
  'top-right': '72% 18%',
}

const focalLight: Record<Focal, string> = {
  top: '30% 5%',
  center: '25% 20%',
  bottom: '30% 30%',
  'top-right': '80% 0%',
}

// Compact tileable film-grain texture (feTurbulence baked to a data URI) so
// gradient placeholders read as photographic rather than flat vector fills.
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * Cinematic placeholder standing in for the athlete's real photography.
 * Swap in real photo assets later without touching layout — every screen
 * that needs a "fighter photo" renders this with the same crop/overlay contract.
 */
export function AthletePhoto({
  focal = 'center',
  fade = 'bottom',
  icon: Icon,
  iconSize = 96,
  className = '',
  style,
  children,
}: {
  focal?: Focal
  fade?: Fade
  icon?: LucideIcon
  iconSize?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  const pos = focalPosition[focal]
  const light = focalLight[focal]

  return (
    <div
      className={`relative overflow-hidden bg-graphite ${className}`}
      style={{
        backgroundImage: `
          radial-gradient(60% 50% at ${light}, rgba(198,255,69,0.16) 0%, transparent 65%),
          radial-gradient(120% 95% at ${pos}, rgba(76,138,63,0.32) 0%, rgba(76,138,63,0.07) 32%, transparent 58%),
          linear-gradient(135deg, transparent 38%, rgba(198,255,69,0.10) 47%, transparent 55%),
          linear-gradient(180deg, #1f2723 0%, #121715 42%, #070a09 78%, #030403 100%)
        `,
        ...style,
      }}
    >
      {Icon && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
          <Icon size={iconSize} strokeWidth={1.25} color="#ffffff" />
        </div>
      )}

      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: GRAIN_URL, backgroundSize: '140px 140px', opacity: 0.5 }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(90% 70% at 50% 42%, transparent 25%, rgba(0,0,0,0.62) 100%)',
        }}
      />

      {(fade === 'bottom' || fade === 'both') && (
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{ backgroundImage: 'linear-gradient(180deg, transparent 0%, rgba(3,4,4,0.95) 100%)' }}
        />
      )}
      {(fade === 'top' || fade === 'both') && (
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{ backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(3,4,4,0.88) 100%)' }}
        />
      )}
      {children}
    </div>
  )
}
