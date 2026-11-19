import type { Session } from '../core/types'
import type { TimerSettings } from '../core/settings'

export interface SessionStorage {
  getSessions(): Promise<Session[]>
  addSession(session: Session): Promise<void>
  clearSessions(): Promise<void>
}

export interface SettingsStorage {
  getSettings(): Promise<TimerSettings>
  saveSettings(settings: TimerSettings): Promise<void>
}
