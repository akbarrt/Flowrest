import { DEFAULT_TIMER_SETTINGS, parseTimerSettings } from '../core/settings'
import type { TimerSettings } from '../core/settings'
import { getBrowserStorage } from './localStorage'
import type { StorageProvider } from './localStorage'
import type { SettingsStorage } from './storage'

const STORAGE_KEY = 'flowrest.settings'

function readSettings(storage: globalThis.Storage): TimerSettings {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) {
      return DEFAULT_TIMER_SETTINGS
    }

    return parseTimerSettings(JSON.parse(raw))
  } catch {
    return DEFAULT_TIMER_SETTINGS
  }
}

export function createLocalStorageSettingsStorage(getStorage: StorageProvider): SettingsStorage {
  return {
    async getSettings() {
      const storage = getStorage()
      return storage ? readSettings(storage) : DEFAULT_TIMER_SETTINGS
    },

    async saveSettings(settings) {
      const storage = getStorage()
      if (!storage) {
        return
      }

      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(parseTimerSettings(settings)))
      } catch {
        // Storage may be unavailable (private mode/quota); ignore for MVP.
      }
    },
  }
}

export const localStorageSettingsStorage: SettingsStorage =
  createLocalStorageSettingsStorage(getBrowserStorage)
