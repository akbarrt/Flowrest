import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_TIMER_SETTINGS, parseTimerSettings } from '../core/settings'
import type { TimerSettings } from '../core/settings'
import { localStorageSettingsStorage } from '../storage/settings'
import type { SettingsStorage } from '../storage/storage'

export interface UseSettingsResult {
  settings: TimerSettings
  isLoading: boolean
  error: string | null
  saveSettings: (settings: TimerSettings) => Promise<void>
}

export function useSettings(
  storage: SettingsStorage = localStorageSettingsStorage,
): UseSettingsResult {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_TIMER_SETTINGS)
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
        const stored = await storageRef.current.getSettings()
        if (!cancelled) {
          setSettings(parseTimerSettings(stored))
        }
      } catch {
        if (!cancelled) {
          setError('Durasi tidak dapat dimuat.')
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

  const saveSettings = useCallback(async (next: TimerSettings) => {
    const normalized = parseTimerSettings(next)

    try {
      await storageRef.current.saveSettings(normalized)
      setSettings(normalized)
      setError(null)
    } catch {
      setError('Durasi tidak dapat disimpan.')
    }
  }, [])

  return { settings, isLoading, error, saveSettings }
}
