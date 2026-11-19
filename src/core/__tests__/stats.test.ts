import { describe, expect, test } from 'vitest'
import { countSessionsToday } from '../stats'
import type { Session } from '../types'

const NOW = new Date(2026, 0, 15, 18, 30)

function makeSession(id: string, date: Date | string): Session {
  return {
    id,
    date: date instanceof Date ? date.toISOString() : date,
    durationMinutes: 25,
    mood: 'good',
    flower: 'sunflower',
  }
}

describe('countSessionsToday', () => {
  test('returns zero when there are no sessions', () => {
    expect(countSessionsToday([], NOW)).toBe(0)
  })

  test('counts sessions recorded on the same local date', () => {
    const sessions = [
      makeSession('morning', new Date(2026, 0, 15, 8, 0)),
      makeSession('afternoon', new Date(2026, 0, 15, 14, 0)),
    ]

    expect(countSessionsToday(sessions, NOW)).toBe(2)
  })

  test('ignores sessions from other dates', () => {
    const sessions = [
      makeSession('today', new Date(2026, 0, 15, 8, 0)),
      makeSession('yesterday', new Date(2026, 0, 14, 8, 0)),
    ]

    expect(countSessionsToday(sessions, NOW)).toBe(1)
  })

  test('ignores invalid dates', () => {
    const sessions = [
      makeSession('today', new Date(2026, 0, 15, 8, 0)),
      makeSession('invalid', 'not-a-date'),
    ]

    expect(countSessionsToday(sessions, NOW)).toBe(1)
  })

  test('uses local date boundaries instead of UTC', () => {
    const lateNight = makeSession('late', new Date(2026, 0, 15, 23, 30))
    const earlyNextDay = makeSession('early', new Date(2026, 0, 16, 0, 30))

    expect(countSessionsToday([lateNight], new Date(2026, 0, 15, 0, 5))).toBe(1)
    expect(countSessionsToday([earlyNextDay], new Date(2026, 0, 15, 0, 5))).toBe(0)
  })
})
