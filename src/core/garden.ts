import type { FlowerType, Mood, Session } from './types'

/** One flower in the garden, derived from a completed session. */
export interface GardenFlower {
  sessionId: string
  date: string
  mood: Mood
  flower: FlowerType
}

function toTime(date: string): number {
  const time = Date.parse(date)
  return Number.isNaN(time) ? 0 : time
}

/**
 * Derives the garden from stored sessions. Pure: no garden state is persisted,
 * and the input array is never mutated.
 */
export function deriveFlowers(sessions: Session[]): GardenFlower[] {
  return [...sessions]
    .sort((a, b) => toTime(a.date) - toTime(b.date))
    .map((session) => ({
      sessionId: session.id,
      date: session.date,
      mood: session.mood,
      flower: session.flower,
    }))
}
