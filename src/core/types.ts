export const MOODS = [
  'very_bad',
  'bad',
  'neutral',
  'good',
  'great',
] as const

export type Mood = (typeof MOODS)[number]

export const FLOWER_TYPES = ['daisy', 'tulip', 'sunflower', 'rose'] as const

export type FlowerType = (typeof FLOWER_TYPES)[number]

export interface Session {
  id: string
  /** ISO 8601 timestamp. */
  date: string
  durationMinutes: number
  mood: Mood
  flower: FlowerType
}
