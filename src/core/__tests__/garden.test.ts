import { describe, expect, test } from 'vitest'
import { deriveFlowers } from '../garden'
import type { Session } from '../types'

function session(overrides: Partial<Session> & Pick<Session, 'id' | 'date'>): Session {
  return {
    durationMinutes: 25,
    mood: 'neutral',
    flower: 'tulip',
    ...overrides,
  }
}

describe('deriveFlowers', () => {
  test('returns one flower per session with the session fields', () => {
    const flowers = deriveFlowers([
      session({
        id: 'session-1',
        date: '2026-01-01T09:00:00.000Z',
        mood: 'great',
        flower: 'rose',
      }),
      session({
        id: 'session-2',
        date: '2026-01-02T09:00:00.000Z',
        mood: 'bad',
        flower: 'daisy',
      }),
    ])

    expect(flowers).toEqual([
      {
        sessionId: 'session-1',
        date: '2026-01-01T09:00:00.000Z',
        mood: 'great',
        flower: 'rose',
      },
      {
        sessionId: 'session-2',
        date: '2026-01-02T09:00:00.000Z',
        mood: 'bad',
        flower: 'daisy',
      },
    ])
  })

  test('orders flowers by date ascending regardless of input order', () => {
    const flowers = deriveFlowers([
      session({ id: 'third', date: '2026-03-01T09:00:00.000Z' }),
      session({ id: 'first', date: '2026-01-01T09:00:00.000Z' }),
      session({ id: 'second', date: '2026-02-01T09:00:00.000Z' }),
    ])

    expect(flowers.map((flower) => flower.sessionId)).toEqual([
      'first',
      'second',
      'third',
    ])
  })

  test('does not mutate the input array', () => {
    const sessions = [
      session({ id: 'later', date: '2026-02-01T09:00:00.000Z' }),
      session({ id: 'earlier', date: '2026-01-01T09:00:00.000Z' }),
    ]
    const original = [...sessions]

    deriveFlowers(sessions)

    expect(sessions).toEqual(original)
  })

  test('returns an empty garden when there are no sessions', () => {
    expect(deriveFlowers([])).toEqual([])
  })

  test('keeps the flower type stored on each session', () => {
    const flowers = deriveFlowers([
      session({ id: 'a', date: '2026-01-01T00:00:00.000Z', flower: 'daisy' }),
      session({ id: 'b', date: '2026-01-02T00:00:00.000Z', flower: 'sunflower' }),
      session({ id: 'c', date: '2026-01-03T00:00:00.000Z', flower: 'rose' }),
    ])

    expect(flowers.map((flower) => flower.flower)).toEqual([
      'daisy',
      'sunflower',
      'rose',
    ])
  })
})
