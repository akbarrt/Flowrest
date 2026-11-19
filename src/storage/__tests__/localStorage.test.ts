import { describe, expect, test } from 'vitest'
import { DEFAULT_TIMER_SETTINGS } from '../../core/settings'
import type { Session } from '../../core/types'
import { createLocalStorageSessionStorage } from '../localStorage'
import { createLocalStorageSettingsStorage } from '../settings'

const STORAGE_KEY = 'flowrest.sessions'
const SETTINGS_KEY = 'flowrest.settings'

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

describe('localStorageSettingsStorage', () => {
  test('saveSettings stores settings under the flowrest.settings key', async () => {
    const storage = new MemoryStorage()
    const settingsStorage = createLocalStorageSettingsStorage(() => storage)
    const settings = { focusMinutes: 50, breakMinutes: 10 }

    await settingsStorage.saveSettings(settings)

    expect(storage.getItem(SETTINGS_KEY)).toBe(JSON.stringify(settings))
    await expect(settingsStorage.getSettings()).resolves.toEqual(settings)
  })

  test('getSettings returns defaults when nothing is stored', async () => {
    const storage = new MemoryStorage()
    const settingsStorage = createLocalStorageSettingsStorage(() => storage)

    await expect(settingsStorage.getSettings()).resolves.toEqual(DEFAULT_TIMER_SETTINGS)
  })

  test('getSettings sanitizes stored values', async () => {
    const storage = new MemoryStorage()
    const settingsStorage = createLocalStorageSettingsStorage(() => storage)

    storage.setItem(SETTINGS_KEY, '{not-json')
    await expect(settingsStorage.getSettings()).resolves.toEqual(DEFAULT_TIMER_SETTINGS)

    storage.setItem(SETTINGS_KEY, JSON.stringify({ focusMinutes: 200, breakMinutes: 3 }))
    await expect(settingsStorage.getSettings()).resolves.toEqual({
      focusMinutes: DEFAULT_TIMER_SETTINGS.focusMinutes,
      breakMinutes: 3,
    })
  })

  test('returns defaults when browser storage is unavailable', async () => {
    const settingsStorage = createLocalStorageSettingsStorage(() => null)

    await expect(settingsStorage.getSettings()).resolves.toEqual(DEFAULT_TIMER_SETTINGS)
    await expect(
      settingsStorage.saveSettings({ focusMinutes: 15, breakMinutes: 3 }),
    ).resolves.toBeUndefined()
  })
})
