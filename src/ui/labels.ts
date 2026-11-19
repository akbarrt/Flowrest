import type { FlowerType, Mood } from '../core/types'

export const MOOD_LABELS: Record<Mood, string> = {
  very_bad: 'Sangat tidak baik',
  bad: 'Kurang baik',
  neutral: 'Biasa saja',
  good: 'Baik',
  great: 'Sangat baik',
}

export const FLOWER_LABELS: Record<FlowerType, string> = {
  daisy: 'Daisy',
  tulip: 'Tulip',
  sunflower: 'Bunga matahari',
  rose: 'Mawar',
}
