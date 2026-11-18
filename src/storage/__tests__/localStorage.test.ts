import { describe, expect, test } from 'vitest'
import type { Session } from '../../core/types'
import { createLocalStorageSessionStorage } from '../localStorage'

const STORAGE_KEY = 'flowrest.sessions'

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

function makeSession(overrides: Partial<Session> = {}): Session {
  return {
    id: 'session-1',
    date: '2026-01-01T09:00:00.000Z',
    durationMinutes: 25,
    mood: 'neutral',
    flower: 'daisy',
    ...overrides,
  }
}

describe('localStorageSessionStorage', () => {
  test('addSession stores sessions under the flowrest.sessions key', async () => {
    const storage = new MemoryStorage()
    const sessionStorage = createLocalStorageSessionStorage(() => storage)
    const session = makeSession()

    await sessionStorage.addSession(session)

    expect(storage.getItem(STORAGE_KEY)).toBe(JSON.stringify([session]))
  })

  test('getSessions returns previously stored sessions in order', async () => {
    const storage = new MemoryStorage()
    const sessionStorage = createLocalStorageSessionStorage(() => storage)
    const first = makeSession({ id: 'a' })
    const second = makeSession({ id: 'b', mood: 'great', flower: 'rose' })

    await sessionStorage.addSession(first)
    await sessionStorage.addSession(second)

    await expect(sessionStorage.getSessions()).resolves.toEqual([first, second])
  })

  test('clearSessions removes the stored key', async () => {
    const storage = new MemoryStorage()
    const sessionStorage = createLocalStorageSessionStorage(() => storage)

    await sessionStorage.addSession(makeSession())
    await sessionStorage.clearSessions()

    expect(storage.getItem(STORAGE_KEY)).toBeNull()
    await expect(sessionStorage.getSessions()).resolves.toEqual([])
  })

  test('getSessions discards malformed JSON', async () => {
    const storage = new MemoryStorage()
    const sessionStorage = createLocalStorageSessionStorage(() => storage)

    storage.setItem(STORAGE_KEY, '{not-json')

    await expect(sessionStorage.getSessions()).resolves.toEqual([])
  })

  test('getSessions keeps valid entries and drops invalid ones', async () => {
    const storage = new MemoryStorage()
    const sessionStorage = createLocalStorageSessionStorage(() => storage)
    const valid = makeSession()
    const invalidMood = { ...valid, id: 'invalid-mood', mood: 'angry' }
    const invalidFlower = { ...valid, id: 'invalid-flower', flower: 'orchid' }
    const missingFields = { id: 'missing-fields' }

    storage.setItem(
      STORAGE_KEY,
      JSON.stringify([valid, invalidMood, invalidFlower, missingFields]),
    )

    await expect(sessionStorage.getSessions()).resolves.toEqual([valid])
  })

  test('returns no sessions when browser storage is unavailable', async () => {
    const sessionStorage = createLocalStorageSessionStorage(() => null)

    await expect(sessionStorage.getSessions()).resolves.toEqual([])
    await expect(sessionStorage.addSession(makeSession())).resolves.toBeUndefined()
    await expect(sessionStorage.clearSessions()).resolves.toBeUndefined()
  })
})
