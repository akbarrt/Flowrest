import { FLOWER_TYPES, MOODS, type Session } from '../core/types'
import type { SessionStorage } from './storage'

const STORAGE_KEY = 'flowrest.sessions'
const moodValues = new Set<string>(MOODS)
const flowerValues = new Set<string>(FLOWER_TYPES)

function getBrowserStorage(): globalThis.Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.date === 'string' &&
    typeof candidate.durationMinutes === 'number' &&
    Number.isFinite(candidate.durationMinutes) &&
    typeof candidate.mood === 'string' &&
    moodValues.has(candidate.mood) &&
    typeof candidate.flower === 'string' &&
    flowerValues.has(candidate.flower)
  )
}

function readSessions(storage: globalThis.Storage): Session[] {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isSession) : []
  } catch {
    return []
  }
}

export const localStorageSessionStorage: SessionStorage = {
  async getSessions() {
    const storage = getBrowserStorage()
    return storage ? readSessions(storage) : []
  },

  async addSession(session) {
    const storage = getBrowserStorage()
    if (!storage) return

    try {
      const sessions = readSessions(storage)
      storage.setItem(STORAGE_KEY, JSON.stringify([...sessions, session]))
    } catch {
      // Storage may be unavailable (private mode/quota); ignore for MVP.
    }
  },

  async clearSessions() {
    const storage = getBrowserStorage()
    if (!storage) return

    try {
      storage.removeItem(STORAGE_KEY)
    } catch {
      // Storage may be unavailable; ignore for MVP.
    }
  },
}
