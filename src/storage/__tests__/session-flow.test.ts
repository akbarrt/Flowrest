import { describe, expect, test } from 'vitest'
import { deriveFlowers } from '../../core/garden'
import { createSession } from '../../core/session'
import { createLocalStorageSessionStorage } from '../localStorage'

class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }
}

describe('session to garden flow', () => {
  test('a saved session survives a reload and becomes one flower', async () => {
    const storage = new MemoryStorage()
    const session = createSession({
      id: 'session-1',
      date: '2026-01-02T10:00:00.000Z',
      durationMinutes: 25,
      mood: 'great',
    })

    await createLocalStorageSessionStorage(() => storage).addSession(session)

    const afterReload = createLocalStorageSessionStorage(() => storage)
    const sessions = await afterReload.getSessions()

    expect(sessions).toEqual([session])
    expect(deriveFlowers(sessions)).toEqual([
      {
        sessionId: 'session-1',
        date: '2026-01-02T10:00:00.000Z',
        mood: 'great',
        flower: 'rose',
      },
    ])
  })

  test('two saved sessions stay two and sort by date after reload', async () => {
    const storage = new MemoryStorage()
    const sessionStorage = createLocalStorageSessionStorage(() => storage)

    await sessionStorage.addSession(
      createSession({
        id: 'later',
        date: '2026-02-01T10:00:00.000Z',
        durationMinutes: 25,
        mood: 'good',
      }),
    )
    await sessionStorage.addSession(
      createSession({
        id: 'earlier',
        date: '2026-01-01T10:00:00.000Z',
        durationMinutes: 25,
        mood: 'bad',
      }),
    )

    const sessions = await createLocalStorageSessionStorage(() =>
      storage,
    ).getSessions()

    expect(sessions).toHaveLength(2)
    expect(deriveFlowers(sessions).map((flower) => flower.sessionId)).toEqual([
      'earlier',
      'later',
    ])
  })
})
