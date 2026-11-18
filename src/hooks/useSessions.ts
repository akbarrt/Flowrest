import { useCallback, useEffect, useRef, useState } from 'react'
import type { Session } from '../core/types'
import { localStorageSessionStorage } from '../storage/localStorage'
import type { SessionStorage } from '../storage/storage'

export interface UseSessionsResult {
  sessions: Session[]
  isLoading: boolean
  error: string | null
  addSession: (session: Session) => Promise<void>
  clearSessions: () => Promise<void>
  refresh: () => Promise<void>
}

export function useSessions(
  storage: SessionStorage = localStorageSessionStorage,
): UseSessionsResult {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const storageRef = useRef(storage)

  useEffect(() => {
    storageRef.current = storage
  }, [storage])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const stored = await storageRef.current.getSessions()
        if (!cancelled) {
          setSessions(stored)
        }
      } catch {
        if (!cancelled) {
          setError('Sesi tidak dapat dimuat.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const stored = await storageRef.current.getSessions()
      setSessions(stored)
    } catch {
      setError('Sesi tidak dapat dimuat.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addSession = useCallback(async (session: Session) => {
    try {
      await storageRef.current.addSession(session)
      const stored = await storageRef.current.getSessions()
      setSessions(stored)
      setError(null)
    } catch {
      setError('Sesi tidak dapat disimpan.')
    }
  }, [])

  const clearSessions = useCallback(async () => {
    try {
      await storageRef.current.clearSessions()
      setSessions([])
      setError(null)
    } catch {
      setError('Sesi tidak dapat dihapus.')
    }
  }, [])

  return { sessions, isLoading, error, addSession, clearSessions, refresh }
}
