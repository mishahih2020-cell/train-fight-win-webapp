// XP required to complete each level (not cumulative). Index 0 = cost of level 1.
export const LEVEL_REQUIREMENTS = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000]

export const MAX_REGULAR_LEVEL = LEVEL_REQUIREMENTS.length
export const UFC_LEVEL = MAX_REGULAR_LEVEL + 1

export interface LevelInfo {
  level: number
  xpIntoLevel: number
  xpForLevel: number
  isMax: boolean
}

export function getLevelInfo(totalXp: number): LevelInfo {
  let remaining = totalXp
  let level = 1

  for (let i = 0; i < LEVEL_REQUIREMENTS.length; i++) {
    const cost = LEVEL_REQUIREMENTS[i]
    if (remaining >= cost) {
      remaining -= cost
      level += 1
    } else {
      return { level, xpIntoLevel: remaining, xpForLevel: cost, isMax: false }
    }
  }

  return { level: UFC_LEVEL, xpIntoLevel: remaining, xpForLevel: 0, isMax: true }
}
