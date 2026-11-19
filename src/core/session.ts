import type { FlowerType, Mood, Session } from './types'

const FLOWER_BY_MOOD: Record<Mood, FlowerType> = {
  very_bad: 'daisy',
  bad: 'daisy',
  neutral: 'tulip',
  good: 'sunflower',
  great: 'rose',
}

export function flowerForMood(mood: Mood): FlowerType {
  return FLOWER_BY_MOOD[mood]
}

export interface CreateSessionInput {
  id: string
  date: string
  durationMinutes: number
  mood: Mood
}

export function createSession({ id, date, durationMinutes, mood }: CreateSessionInput): Session {
  return {
    id,
    date,
    durationMinutes,
    mood,
    flower: flowerForMood(mood),
  }
}
