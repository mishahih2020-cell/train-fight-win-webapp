const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * Persistent, app-wide cinematic backdrop — a dim arena spotlight, a faint
 * crossed-gloves watermark and film grain, fixed behind every screen so
 * plain list/settings pages read as part of the same premium sports product
 * as the hero photos instead of falling back to flat black.
 */
export function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: -1 }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(70% 40% at 50% 0%, rgba(198,255,69,0.10) 0%, transparent 60%),
            radial-gradient(90% 60% at 85% 100%, rgba(76,138,63,0.10) 0%, transparent 55%),
            linear-gradient(180deg, #0a0f0d 0%, #050807 32%, #030403 70%, #020302 100%)
          `,
        }}
      />

      {/* faint crossed-gloves brand watermark, bottom-right, barely perceptible */}
      <svg
        viewBox="0 0 200 200"
        className="absolute -bottom-10 -right-10 h-[340px] w-[340px] opacity-[0.045]"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
      >
        <path d="M40 160 L160 40" strokeLinecap="round" />
        <path d="M40 40 L160 160" strokeLinecap="round" />
        <circle cx="40" cy="160" r="16" />
        <circle cx="160" cy="40" r="16" />
        <circle cx="40" cy="40" r="16" />
        <circle cx="160" cy="160" r="16" />
      </svg>

      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: GRAIN_URL, backgroundSize: '160px 160px', opacity: 0.35 }}
      />

      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(120% 90% at 50% 30%, transparent 40%, rgba(0,0,0,0.5) 100%)' }}
      />
    </div>
  )
}
