const RED: [number, number, number] = [255, 30, 45] // var(--color-accent)
const YELLOW: [number, number, number] = [255, 168, 0] // var(--color-warning)
const GREEN: [number, number, number] = [0, 200, 83] // var(--color-success)

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  const [r1, g1, b1] = a
  const [r2, g2, b2] = b
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const bl = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r}, ${g}, ${bl})`
}

/**
 * Red while well short of the calorie goal, sliding through yellow and
 * settling on green once it's actually reached — recomputed fresh on
 * every render, so it shifts a little with each meal logged.
 */
export function calorieRingColor(current: number, total: number): string {
  if (total <= 0) return mix(RED, RED, 0)
  const pct = Math.min(1, Math.max(0, current / total))
  return pct <= 0.5 ? mix(RED, YELLOW, pct / 0.5) : mix(YELLOW, GREEN, (pct - 0.5) / 0.5)
}
